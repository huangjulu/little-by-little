import { describe, expect, it } from "vitest";

import { createOrderSchema } from "../create-order.schema";

// Helpers

/** 最小合法表單值（僅必填欄位） */
function validMinimal() {
  return {
    customerName: "王小明",
    mobilePhone: "0912345678",
  };
}

/** 完整合法表單值（所有欄位） */
function validFull() {
  return {
    customerName: "王小明",
    mobilePhone: "0912345678",
    communityName: "幸福社區",
    houseUnit: "A 棟 12 樓",
    basePrice: "1000",
    currentPrice: "900",
    contractDateRange: {
      from: new Date("2026-01-01"),
      to: new Date("2026-12-31"),
    },
    paymentDeadline: new Date("2026-02-01"),
    nextBillingDate: new Date("2026-03-01"),
  };
}

/** 從 ZodError 取得指定 path 的所有錯誤訊息 */
function getErrors(
  result: { error?: { issues: { path: PropertyKey[]; message: string }[] } },
  field: string
) {
  return (
    result.error?.issues
      .filter((i) => i.path[0] === field)
      .map((i) => i.message) ?? []
  );
}

// Tests

describe("createOrderSchema — happy path", () => {
  it("僅必填欄位應通過驗證", () => {
    const result = createOrderSchema.safeParse(validMinimal());
    expect(result.success).toBe(true);
  });

  it("所有欄位皆填寫應通過驗證", () => {
    const result = createOrderSchema.safeParse(validFull());
    expect(result.success).toBe(true);
  });

  it("選填欄位為 undefined 應通過驗證", () => {
    const result = createOrderSchema.safeParse({
      ...validMinimal(),
      communityName: undefined,
      houseUnit: undefined,
      basePrice: undefined,
      currentPrice: undefined,
      contractDateRange: undefined,
      paymentDeadline: undefined,
      nextBillingDate: undefined,
    });
    expect(result.success).toBe(true);
  });

  it("價格為空字串應通過驗證（表單未填寫）", () => {
    const result = createOrderSchema.safeParse({
      ...validMinimal(),
      basePrice: "",
      currentPrice: "",
    });
    expect(result.success).toBe(true);
  });

  it("價格為 '0' 應通過驗證", () => {
    const result = createOrderSchema.safeParse({
      ...validMinimal(),
      basePrice: "0",
      currentPrice: "0",
    });
    expect(result.success).toBe(true);
  });
});

describe("createOrderSchema — customerName 驗證", () => {
  it("空字串應回傳「客戶姓名為必填」", () => {
    const result = createOrderSchema.safeParse({
      ...validMinimal(),
      customerName: "",
    });
    expect(result.success).toBe(false);
    expect(getErrors(result, "customerName")).toContain("客戶姓名為必填");
  });

  it("未提供 customerName 應失敗", () => {
    const result = createOrderSchema.safeParse({ mobilePhone: "0912345678" });
    expect(result.success).toBe(false);
    expect(getErrors(result, "customerName").length).toBeGreaterThan(0);
  });
});

describe("createOrderSchema — mobilePhone 驗證", () => {
  it("空字串應回傳「手機號碼為必填」", () => {
    const result = createOrderSchema.safeParse({
      ...validMinimal(),
      mobilePhone: "",
    });
    expect(result.success).toBe(false);
    expect(getErrors(result, "mobilePhone")).toContain("手機號碼為必填");
  });

  it("未提供 mobilePhone 應失敗", () => {
    const result = createOrderSchema.safeParse({ customerName: "王小明" });
    expect(result.success).toBe(false);
    expect(getErrors(result, "mobilePhone").length).toBeGreaterThan(0);
  });
});

describe("createOrderSchema — basePrice 驗證", () => {
  it("負數應回傳「基礎價格不可為負」", () => {
    const result = createOrderSchema.safeParse({
      ...validMinimal(),
      basePrice: "-1",
    });
    expect(result.success).toBe(false);
    expect(getErrors(result, "basePrice")).toContain("基礎價格不可為負");
  });

  it("非數字字串應回傳「基礎價格不可為負」", () => {
    const result = createOrderSchema.safeParse({
      ...validMinimal(),
      basePrice: "abc",
    });
    expect(result.success).toBe(false);
    expect(getErrors(result, "basePrice")).toContain("基礎價格不可為負");
  });

  it("'-0.01' 應回傳錯誤", () => {
    const result = createOrderSchema.safeParse({
      ...validMinimal(),
      basePrice: "-0.01",
    });
    expect(result.success).toBe(false);
  });

  it("正數字串應通過驗證", () => {
    const result = createOrderSchema.safeParse({
      ...validMinimal(),
      basePrice: "99.99",
    });
    expect(result.success).toBe(true);
  });
});

describe("createOrderSchema — currentPrice 驗證", () => {
  it("負數應回傳「目前價格不可為負」", () => {
    const result = createOrderSchema.safeParse({
      ...validMinimal(),
      currentPrice: "-500",
    });
    expect(result.success).toBe(false);
    expect(getErrors(result, "currentPrice")).toContain("目前價格不可為負");
  });

  it("非數字字串應回傳「目前價格不可為負」", () => {
    const result = createOrderSchema.safeParse({
      ...validMinimal(),
      currentPrice: "not-a-number",
    });
    expect(result.success).toBe(false);
    expect(getErrors(result, "currentPrice")).toContain("目前價格不可為負");
  });

  it("正數字串應通過驗證", () => {
    const result = createOrderSchema.safeParse({
      ...validMinimal(),
      currentPrice: "1234.56",
    });
    expect(result.success).toBe(true);
  });
});

describe("createOrderSchema — contractDateRange 驗證", () => {
  it("完整日期區間應通過驗證", () => {
    const result = createOrderSchema.safeParse({
      ...validMinimal(),
      contractDateRange: {
        from: new Date("2026-01-01"),
        to: new Date("2026-12-31"),
      },
    });
    expect(result.success).toBe(true);
  });

  it("僅 from 應通過驗證（to 為 optional）", () => {
    const result = createOrderSchema.safeParse({
      ...validMinimal(),
      contractDateRange: {
        from: new Date("2026-01-01"),
      },
    });
    expect(result.success).toBe(true);
  });

  it("空物件應通過驗證（from/to 皆 optional）", () => {
    const result = createOrderSchema.safeParse({
      ...validMinimal(),
      contractDateRange: {},
    });
    expect(result.success).toBe(true);
  });

  it("非物件值應失敗", () => {
    const result = createOrderSchema.safeParse({
      ...validMinimal(),
      contractDateRange: "2026-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("from 為非 Date 應失敗", () => {
    const result = createOrderSchema.safeParse({
      ...validMinimal(),
      contractDateRange: { from: "2026-01-01" },
    });
    expect(result.success).toBe(false);
  });
});

describe("createOrderSchema — paymentDeadline 驗證", () => {
  it("有效 Date 應通過驗證", () => {
    const result = createOrderSchema.safeParse({
      ...validMinimal(),
      paymentDeadline: new Date("2026-02-01"),
    });
    expect(result.success).toBe(true);
  });

  it("非 Date 值應失敗", () => {
    const result = createOrderSchema.safeParse({
      ...validMinimal(),
      paymentDeadline: "2026-02-01",
    });
    expect(result.success).toBe(false);
  });
});

describe("createOrderSchema — nextBillingDate 驗證", () => {
  it("有效 Date 應通過驗證", () => {
    const result = createOrderSchema.safeParse({
      ...validMinimal(),
      nextBillingDate: new Date("2026-03-01"),
    });
    expect(result.success).toBe(true);
  });

  it("非 Date 值應失敗", () => {
    const result = createOrderSchema.safeParse({
      ...validMinimal(),
      nextBillingDate: "not-a-date",
    });
    expect(result.success).toBe(false);
  });
});

describe("createOrderSchema — 多欄位同時錯誤", () => {
  it("多個必填欄位皆空應回傳對應的所有錯誤", () => {
    const result = createOrderSchema.safeParse({
      customerName: "",
      mobilePhone: "",
      basePrice: "-1",
      currentPrice: "abc",
    });
    expect(result.success).toBe(false);
    expect(getErrors(result, "customerName")).toContain("客戶姓名為必填");
    expect(getErrors(result, "mobilePhone")).toContain("手機號碼為必填");
    expect(getErrors(result, "basePrice")).toContain("基礎價格不可為負");
    expect(getErrors(result, "currentPrice")).toContain("目前價格不可為負");
  });
});
