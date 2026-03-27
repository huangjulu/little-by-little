import { describe, expect, it } from "vitest";

import {
  type CustomerRow,
  isOrderStatus,
  isPaymentStatus,
  mapToOrder,
} from "@/lib/mappers/order-mapper";

// ─── helpers ────────────────────────────────────────────────────────────────

function makeCustomerRow(overrides: Partial<CustomerRow> = {}): CustomerRow {
  return {
    id: 1,
    order_id: 10,
    customer_info: {
      customer_name: "王大明",
      mobile_phone: "0912111111",
      community_name: "陽光社區",
      house_unit: "A棟3F",
      address: "台北市信義區",
    },
    order_status: "active",
    payment_status: "up_to_date",
    created_at: "2026-01-15T08:00:00Z",
    orders: {
      id: 10,
      base_price: 500,
      current_price: 600,
      contract_start_date: "2026-01-01",
      contract_end_date: "2026-12-31",
      payment_deadline: "2026-02-15",
      next_billing_date: "2026-03-01",
      created_at: "2026-01-15T08:00:00Z",
      speed: "100M",
      billing_plan: "monthly",
      atm_account_number: "1234567890",
      project_code: "PRJ-001",
      deposit: 1000,
      price_difference: 100,
      yearly_fee: 6000,
      yearly_bonus_months: 2,
      two_year_fee: 10000,
      two_year_bonus_months: 4,
    },
    ...overrides,
  } as unknown as CustomerRow;
}

// ─── Tests: mapToOrder ──────────────────────────────────────────────────────

describe("mapToOrder", () => {
  it("正確映射完整的 Supabase 資料列到 Order 型別", () => {
    const row = makeCustomerRow();
    const order = mapToOrder(row);

    expect(order.id).toBe("1");
    expect(order.orderId).toBe(10);
    expect(order.customerName).toBe("王大明");
    expect(order.mobilePhone).toBe("0912111111");
    expect(order.communityName).toBe("陽光社區");
    expect(order.houseUnit).toBe("A棟3F");
    expect(order.address).toBe("台北市信義區");
    expect(order.basePrice).toBe(500);
    expect(order.currentPrice).toBe(600);
    expect(order.contractStartDate).toBe("2026-01-01");
    expect(order.contractEndDate).toBe("2026-12-31");
    expect(order.paymentDeadline).toBe("2026-02-15");
    expect(order.nextBillingDate).toBe("2026-03-01");
    expect(order.status).toBe("active");
    expect(order.paymentStatus).toBe("up_to_date");
    expect(order.speed).toBe("100M");
    expect(order.billingPlan).toBe("monthly");
    expect(order.atmAccountNumber).toBe("1234567890");
    expect(order.projectCode).toBe("PRJ-001");
    expect(order.deposit).toBe(1000);
    expect(order.priceDifference).toBe(100);
    expect(order.yearlyFee).toBe(6000);
    expect(order.yearlyBonusMonths).toBe(2);
    expect(order.twoYearFee).toBe(10000);
    expect(order.twoYearBonusMonths).toBe(4);
  });

  it("customer_info 為 null 時使用預設值", () => {
    const row = makeCustomerRow({
      customer_info: null,
    } as unknown as Partial<CustomerRow>);
    const order = mapToOrder(row);

    expect(order.customerName).toBe("");
    expect(order.mobilePhone).toBe("");
    expect(order.communityName).toBe("");
    expect(order.houseUnit).toBe("");
    expect(order.address).toBe("");
  });

  it("無效 order_status 值 fallback 為 'inactive'", () => {
    const row = makeCustomerRow({
      order_status: "deleted" as unknown as CustomerRow["order_status"],
    });
    const order = mapToOrder(row);

    expect(order.status).toBe("inactive");
  });

  it("無效 payment_status 值 fallback 為 'up_to_date'", () => {
    const row = makeCustomerRow({
      payment_status: "unknown" as unknown as CustomerRow["payment_status"],
    });
    const order = mapToOrder(row);

    expect(order.paymentStatus).toBe("up_to_date");
  });

  it("orders 欄位為 null/undefined 時使用預設值", () => {
    const row = makeCustomerRow({
      orders: null,
    } as unknown as Partial<CustomerRow>);
    const order = mapToOrder(row);

    expect(order.basePrice).toBe(0);
    expect(order.currentPrice).toBe(0);
    expect(order.contractStartDate).toBe("");
    expect(order.contractEndDate).toBe("");
    expect(order.speed).toBe("");
    expect(order.deposit).toBe(0);
  });

  it("null 欄位使用空字串或 0 作為 fallback", () => {
    const row = makeCustomerRow({
      order_id: null as unknown as number,
      created_at: null,
      orders: {
        id: 10,
        base_price: null as unknown as number,
        current_price: null as unknown as number,
        contract_start_date: null,
        contract_end_date: null,
        payment_deadline: null,
        next_billing_date: null,
        created_at: null,
        speed: null,
        billing_plan: null,
        atm_account_number: null,
        project_code: null,
        deposit: null as unknown as number,
        price_difference: null as unknown as number,
        yearly_fee: null,
        yearly_bonus_months: null,
        two_year_fee: null,
        two_year_bonus_months: null,
      } as unknown as CustomerRow["orders"],
    });
    const order = mapToOrder(row);

    expect(order.orderId).toBe(0);
    expect(order.createdAt).toBe("");
    expect(order.basePrice).toBe(0);
    expect(order.currentPrice).toBe(0);
    expect(order.contractStartDate).toBe("");
    expect(order.yearlyFee).toBeNull();
    expect(order.twoYearFee).toBeNull();
  });
});

// ─── Tests: isOrderStatus ───────────────────────────────────────────────────

describe("isOrderStatus", () => {
  it('"active" 為有效 OrderStatus', () => {
    expect(isOrderStatus("active")).toBe(true);
  });

  it('"inactive" 為有效 OrderStatus', () => {
    expect(isOrderStatus("inactive")).toBe(true);
  });

  it("其他字串不是有效 OrderStatus", () => {
    expect(isOrderStatus("deleted")).toBe(false);
    expect(isOrderStatus("")).toBe(false);
  });

  it("非字串值不是有效 OrderStatus", () => {
    expect(isOrderStatus(null)).toBe(false);
    expect(isOrderStatus(undefined)).toBe(false);
    expect(isOrderStatus(123)).toBe(false);
  });
});

// ─── Tests: isPaymentStatus ─────────────────────────────────────────────────

describe("isPaymentStatus", () => {
  it('"up_to_date" 為有效 PaymentStatus', () => {
    expect(isPaymentStatus("up_to_date")).toBe(true);
  });

  it('"waiting_for_payment" 為有效 PaymentStatus', () => {
    expect(isPaymentStatus("waiting_for_payment")).toBe(true);
  });

  it('"overdue" 為有效 PaymentStatus', () => {
    expect(isPaymentStatus("overdue")).toBe(true);
  });

  it("其他字串不是有效 PaymentStatus", () => {
    expect(isPaymentStatus("paid")).toBe(false);
    expect(isPaymentStatus("")).toBe(false);
  });

  it("非字串值不是有效 PaymentStatus", () => {
    expect(isPaymentStatus(null)).toBe(false);
    expect(isPaymentStatus(undefined)).toBe(false);
  });
});
