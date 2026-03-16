import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";

import { parseSpreadsheet, validateRows } from "@/lib/csv-parser";

// ─── helpers ─────────────────────────────────────────────────────────────────

/** 從二維陣列建立 ArrayBuffer（模擬 CSV/Excel 檔案） */
function makeWorkbook(rows: string[][]): ArrayBuffer {
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  return XLSX.write(wb, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
}

function makeCSVBuffer(csv: string): ArrayBuffer {
  const encoder = new TextEncoder();
  return encoder.encode(csv).buffer as ArrayBuffer;
}

// ─── parseSpreadsheet ────────────────────────────────────────────────────────

describe("parseSpreadsheet", () => {
  it("正確解析含標題行的 CSV 資料", () => {
    const csv = "客戶姓名,手機號碼\n王大明,0912111111\n李小華,0912222222";
    const result = parseSpreadsheet(makeCSVBuffer(csv));
    expect(result.rows).toHaveLength(2);
    expect(result.rows[0]).toMatchObject({
      customerName: "王大明",
      mobilePhone: "0912111111",
    });
  });

  it("正確解析 Excel (.xlsx) 資料", () => {
    const buf = makeWorkbook([
      ["客戶姓名", "手機號碼", "基礎價格"],
      ["張美玲", "0912333333", "1000"],
    ]);
    const result = parseSpreadsheet(buf);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]).toMatchObject({
      customerName: "張美玲",
      mobilePhone: "0912333333",
      basePrice: "1000",
    });
  });

  it("空檔案回傳空陣列", () => {
    const buf = makeWorkbook([["客戶姓名", "手機號碼"]]);
    const result = parseSpreadsheet(buf);
    expect(result.rows).toHaveLength(0);
  });

  it("非標準編碼（BOM UTF-8）正確處理", () => {
    const bom = "\uFEFF";
    const csv = `${bom}客戶姓名,手機號碼\n王大明,0912111111`;
    const result = parseSpreadsheet(makeCSVBuffer(csv));
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].customerName).toBe("王大明");
  });

  it("損毀的檔案（非 CSV/Excel 格式）應 throw Error", () => {
    const garbage = new Uint8Array([0, 1, 2, 3, 4, 5]).buffer as ArrayBuffer;
    expect(() => parseSpreadsheet(garbage)).toThrow("無法解析此檔案格式");
  });

  it("檔案只有標題行沒有資料行應回傳空陣列", () => {
    const csv = "客戶姓名,手機號碼,基礎價格";
    const result = parseSpreadsheet(makeCSVBuffer(csv));
    expect(result.rows).toHaveLength(0);
  });

  it("標題行完全不符合預期欄位名應回傳空陣列 + 警告", () => {
    const csv = "foo,bar,baz\na,b,c";
    const result = parseSpreadsheet(makeCSVBuffer(csv));
    expect(result.rows).toHaveLength(0);
    expect(result.warnings).toContain("未偵測到任何已知欄位");
  });

  it("標題行部分匹配應解析匹配的欄位，其餘為 undefined", () => {
    const csv = "客戶姓名,手機號碼,未知欄位\n王大明,0912111111,xxx";
    const result = parseSpreadsheet(makeCSVBuffer(csv));
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].customerName).toBe("王大明");
    expect(result.rows[0].mobilePhone).toBe("0912111111");
    expect(result.rows[0].basePrice).toBeUndefined();
  });
});

// ─── validateRows ────────────────────────────────────────────────────────────

describe("validateRows", () => {
  it("完整正確的一行通過驗證", () => {
    const result = validateRows([
      {
        customerName: "王大明",
        mobilePhone: "0912111111",
        basePrice: "800",
        currentPrice: "1000",
        contractStartDate: "2026-01-01",
      },
    ]);
    expect(result.valid).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
  });

  it("缺少必填欄位 customerName 回傳錯誤 + 行號", () => {
    const result = validateRows([{ mobilePhone: "0912111111" } as never]);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].row).toBe(2); // 行號 = index + 2（含標題行）
    expect(result.errors[0].message).toContain("客戶姓名");
  });

  it("缺少必填欄位 mobilePhone 回傳錯誤 + 行號", () => {
    const result = validateRows([{ customerName: "王大明" } as never]);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain("手機號碼");
  });

  it("非數字的 basePrice 回傳驗證錯誤", () => {
    const result = validateRows([
      { customerName: "王大明", mobilePhone: "0912111111", basePrice: "abc" },
    ]);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain("基礎價格");
  });

  it("負數的 currentPrice 回傳驗證錯誤", () => {
    const result = validateRows([
      {
        customerName: "王大明",
        mobilePhone: "0912111111",
        currentPrice: "-100",
      },
    ]);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain("目前價格");
  });

  it("無效日期格式回傳錯誤", () => {
    const result = validateRows([
      {
        customerName: "王大明",
        mobilePhone: "0912111111",
        contractStartDate: "not-a-date",
      },
    ]);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain("合約起始日");
  });

  it("選填欄位空白時正確處理（不報錯）", () => {
    const result = validateRows([
      { customerName: "王大明", mobilePhone: "0912111111", basePrice: "" },
    ]);
    expect(result.valid).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
  });

  it("中文欄位名正確對應到 CreateOrderParams key", () => {
    // 已在 parseSpreadsheet 測試中驗證，此處確認 validateRows 接受對應後的 key
    const result = validateRows([
      {
        customerName: "王大明",
        mobilePhone: "0912111111",
        communityName: "陽光社區",
        houseUnit: "A棟3F",
      },
    ]);
    expect(result.valid).toHaveLength(1);
    expect(result.valid[0].communityName).toBe("陽光社區");
  });

  it("混合正確/錯誤的多行資料，回傳 { valid[], errors[] }", () => {
    const result = validateRows([
      { customerName: "王大明", mobilePhone: "0912111111" },
      { customerName: "", mobilePhone: "0912222222" }, // 空姓名
      { customerName: "張美玲", mobilePhone: "0912333333" },
    ]);
    expect(result.valid).toHaveLength(2);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].row).toBe(3); // 第二行資料 = 行號 3
  });

  it("超過 500 行時截斷並回傳提示", () => {
    const rows = Array.from({ length: 550 }, (_, i) => ({
      customerName: `客戶${i}`,
      mobilePhone: `091200${String(i).padStart(4, "0")}`,
    }));
    const result = validateRows(rows);
    expect(result.valid.length + result.errors.length).toBeLessThanOrEqual(500);
    expect(result.truncated).toBe(true);
  });

  // ─── fallback 情境 ──────────────────────────────────────────────────────

  it("整行全空應跳過此行（不算錯誤也不算有效）", () => {
    const result = validateRows([
      { customerName: "", mobilePhone: "" },
      { customerName: "王大明", mobilePhone: "0912111111" },
    ]);
    expect(result.valid).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
  });

  it("customerName 為純空白字串應回傳必填錯誤", () => {
    const result = validateRows([
      { customerName: "   ", mobilePhone: "0912111111" },
    ]);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain("客戶姓名");
  });

  it('basePrice 為帶千分號的數字（"1,200"）應自動移除後驗證通過', () => {
    const result = validateRows([
      { customerName: "王大明", mobilePhone: "0912111111", basePrice: "1,200" },
    ]);
    expect(result.valid).toHaveLength(1);
    expect(result.valid[0].basePrice).toBe(1200);
  });

  it('日期格式 "2026/03/15"（斜線分隔）應自動轉為 "2026-03-15"', () => {
    const result = validateRows([
      {
        customerName: "王大明",
        mobilePhone: "0912111111",
        contractStartDate: "2026/03/15",
      },
    ]);
    expect(result.valid).toHaveLength(1);
    expect(result.valid[0].contractStartDate).toBe("2026-03-15");
  });

  it('日期格式 "115/03/15"（民國年）應回傳格式錯誤', () => {
    const result = validateRows([
      {
        customerName: "王大明",
        mobilePhone: "0912111111",
        contractStartDate: "115/03/15",
      },
    ]);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain("合約起始日");
  });
});
