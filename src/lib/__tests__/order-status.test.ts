import { describe, expect, it } from "vitest";

import {
  paymentStatusChipStyle,
  paymentStatusLabel,
  statusChipStyle,
  statusFilterOptions,
  statusLabel,
} from "@/features/order/constants";
import {
  isOrderStatus,
  isPaymentStatus,
  mapToOrder,
} from "@/lib/mappers/order-mapper";

// ─── isOrderStatus ───────────────────────────────────────────────────────────

describe("isOrderStatus", () => {
  it('"active" 應回傳 true', () => {
    expect(isOrderStatus("active")).toBe(true);
  });

  it('"inactive" 應回傳 true', () => {
    expect(isOrderStatus("inactive")).toBe(true);
  });

  it('"invalid" 應回傳 false', () => {
    expect(isOrderStatus("invalid")).toBe(false);
  });

  it("空字串應回傳 false", () => {
    expect(isOrderStatus("")).toBe(false);
  });

  it("null 應回傳 false", () => {
    expect(isOrderStatus(null)).toBe(false);
  });

  it("undefined 應回傳 false", () => {
    expect(isOrderStatus(undefined)).toBe(false);
  });
});

// ─── isPaymentStatus ─────────────────────────────────────────────────────────

describe("isPaymentStatus", () => {
  it('"up_to_date" 應回傳 true', () => {
    expect(isPaymentStatus("up_to_date")).toBe(true);
  });

  it('"invoiced" 應回傳 true', () => {
    expect(isPaymentStatus("invoiced")).toBe(true);
  });

  it('"overdue" 應回傳 true', () => {
    expect(isPaymentStatus("overdue")).toBe(true);
  });

  it('"unknown" 應回傳 false', () => {
    expect(isPaymentStatus("unknown")).toBe(false);
  });

  it("null 應回傳 false", () => {
    expect(isPaymentStatus(null)).toBe(false);
  });

  it("undefined 應回傳 false", () => {
    expect(isPaymentStatus(undefined)).toBe(false);
  });
});

// ─── mapToOrder ──────────────────────────────────────────────────────────────

describe("mapToOrder", () => {
  const baseRow = {
    id: 1,
    customer_info: {
      customer_name: "王小明",
      mobile_phone: "0912345678",
      community_name: "陽光社區",
      house_unit: "A棟3F",
    },
    order_id: 100,
    order_status: "active",
    payment_status: "up_to_date",
    created_at: "2026-01-01T00:00:00Z",
    orders: {
      id: 100,
      base_price: 1000,
      current_price: 1200,
      contract_start_date: "2026-01-01",
      contract_end_date: "2026-12-31",
      payment_deadline: "2026-02-15",
      next_billing_date: "2026-03-01",
      created_at: "2026-01-01T00:00:00Z",
    },
  };

  it("order_status 和 payment_status 正確映射", () => {
    const order = mapToOrder(baseRow as never);
    expect(order.status).toBe("active");
    expect(order.paymentStatus).toBe("up_to_date");
  });

  it('payment_status="invoiced" 應正確映射', () => {
    const row = { ...baseRow, payment_status: "invoiced" };
    const order = mapToOrder(row as never);
    expect(order.paymentStatus).toBe("invoiced");
  });

  it('payment_status="overdue" 應正確映射', () => {
    const row = { ...baseRow, payment_status: "overdue" };
    const order = mapToOrder(row as never);
    expect(order.paymentStatus).toBe("overdue");
  });

  it("order_status 為未知字串應降級為 inactive", () => {
    const row = { ...baseRow, order_status: "unknown_status" };
    const order = mapToOrder(row as never);
    expect(order.status).toBe("inactive");
  });

  it("order_status 為 null 應降級為 inactive", () => {
    const row = { ...baseRow, order_status: null };
    const order = mapToOrder(row as never);
    expect(order.status).toBe("inactive");
  });

  it("payment_status 為未知字串應降級為 up_to_date", () => {
    const row = { ...baseRow, payment_status: "invalid" };
    const order = mapToOrder(row as never);
    expect(order.paymentStatus).toBe("up_to_date");
  });

  it("payment_status 為 null 應降級為 up_to_date", () => {
    const row = { ...baseRow, payment_status: null };
    const order = mapToOrder(row as never);
    expect(order.paymentStatus).toBe("up_to_date");
  });

  it("customer_info 為 null 應使用 emptyCustomerInfo 預設值", () => {
    const row = { ...baseRow, customer_info: null };
    const order = mapToOrder(row as never);
    expect(order.customerName).toBe("");
    expect(order.mobilePhone).toBe("");
  });

  it("orders 為 null 應所有金額/日期欄位為預設值", () => {
    const row = { ...baseRow, orders: null };
    const order = mapToOrder(row as never);
    expect(order.basePrice).toBe(0);
    expect(order.currentPrice).toBe(0);
    expect(order.contractStartDate).toBe("");
    expect(order.nextBillingDate).toBe("");
  });
});

// ─── statusLabel / statusChipStyle ───────────────────────────────────────────

describe("statusLabel", () => {
  it("應包含 active 和 inactive", () => {
    expect(statusLabel.active).toBe("啟用中");
    expect(statusLabel.inactive).toBe("已停用");
    expect(Object.keys(statusLabel)).toHaveLength(2);
  });
});

describe("statusChipStyle", () => {
  it("應包含 active（green）和 inactive（gray）", () => {
    expect(statusChipStyle.active).toContain("green");
    expect(statusChipStyle.inactive).toContain("gray");
  });
});

// ─── paymentStatusLabel / paymentStatusChipStyle ─────────────────────────────

describe("paymentStatusLabel", () => {
  it("應包含 3 個繳費狀態標籤", () => {
    expect(paymentStatusLabel.up_to_date).toBe("正常繳費");
    expect(paymentStatusLabel.invoiced).toBe("已出帳");
    expect(paymentStatusLabel.overdue).toBe("逾期未繳");
  });
});

describe("paymentStatusChipStyle", () => {
  it("up_to_date 應為 blue 色系", () => {
    expect(paymentStatusChipStyle.up_to_date).toContain("blue");
  });

  it("invoiced 應為 amber 色系", () => {
    expect(paymentStatusChipStyle.invoiced).toContain("amber");
  });

  it("overdue 應為 red 色系", () => {
    expect(paymentStatusChipStyle.overdue).toContain("red");
  });
});

// ─── statusFilterOptions ─────────────────────────────────────────────────────

describe("statusFilterOptions", () => {
  it("應包含 3 個選項（全部/啟用中/已停用）", () => {
    expect(statusFilterOptions).toHaveLength(3);
    expect(statusFilterOptions.map((o) => o.value)).toEqual([
      "all",
      "active",
      "inactive",
    ]);
  });
});
