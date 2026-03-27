import { beforeEach, describe, expect, it, vi } from "vitest";

import { MOCK_NEXT_HEADERS } from "@/__test-utils__/api-mocks";
import { jsonRequest, rawRequest } from "@/__test-utils__/request-builder";

// ─── Mocks ──────────────────────────────────────────────────────────────────

const mockOrderSingle = vi.fn();
const mockCustomerSingle = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();

vi.mock("next/headers", () => MOCK_NEXT_HEADERS);

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn((table: string) => {
      if (table === "orders") {
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: mockOrderSingle,
            }),
          }),
          delete: mockDelete.mockReturnValue({
            eq: mockEq,
          }),
        };
      }
      if (table === "customers") {
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: mockCustomerSingle,
            }),
          }),
        };
      }
      return {};
    }),
  })),
}));

// ─── helpers ────────────────────────────────────────────────────────────────

const PATH = "/api/orders/import";
const makeRequest = (body: unknown) => jsonRequest(PATH, "POST", body);
const makeInvalidRequest = (body: string) => rawRequest(PATH, "POST", body);

// 模擬一筆成功的 Supabase 插入流程
function mockSuccessfulInsert(orderId: number, customerId: number) {
  mockOrderSingle.mockResolvedValueOnce({
    data: { id: orderId, base_price: 0, current_price: 0 },
    error: null,
  });
  mockCustomerSingle.mockResolvedValueOnce({
    data: {
      id: customerId,
      customer_info: {
        customer_name: "Test",
        mobile_phone: "0912000000",
        community_name: "",
        house_unit: "",
      },
      order_id: orderId,
      order_status: "active",
      payment_status: "up_to_date",
      created_at: "2026-01-01T00:00:00Z",
      orders: {
        id: orderId,
        base_price: 0,
        current_price: 0,
        contract_start_date: null,
        contract_end_date: null,
        payment_deadline: null,
        next_billing_date: null,
        created_at: "2026-01-01T00:00:00Z",
      },
    },
    error: null,
  });
}

function mockFailedOrderInsert(errorMsg: string) {
  mockOrderSingle.mockResolvedValueOnce({
    data: null,
    error: { message: errorMsg },
  });
}

function mockFailedCustomerInsert(orderId: number, errorMsg: string) {
  mockOrderSingle.mockResolvedValueOnce({
    data: { id: orderId },
    error: null,
  });
  mockCustomerSingle.mockResolvedValueOnce({
    data: null,
    error: { message: errorMsg },
  });
  mockEq.mockResolvedValueOnce({ error: null });
}

// ─── import handler（延遲引入，在 mock 設定之後） ────────────────────────────

let POST: typeof import("../import/route").POST;

beforeEach(async () => {
  vi.clearAllMocks();
  const mod = await import("../import/route");
  POST = mod.POST;
});

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("POST /api/orders/import", () => {
  it("空陣列回傳 { success: 0, failed: 0 }", async () => {
    const req = makeRequest({ orders: [] });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.error).toBe(false);
    expect(json.data.success).toBe(0);
    expect(json.data.failed).toBe(0);
    expect(json.data.errors).toHaveLength(0);
  });

  it("單筆正確資料成功匯入，回傳 { success: 1, failed: 0 }", async () => {
    mockSuccessfulInsert(1, 1);

    const req = makeRequest({
      orders: [{ customerName: "王大明", mobilePhone: "0912111111" }],
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.success).toBe(1);
    expect(json.data.failed).toBe(0);
  });

  it("多筆正確資料全部成功匯入", async () => {
    mockSuccessfulInsert(1, 1);
    mockSuccessfulInsert(2, 2);
    mockSuccessfulInsert(3, 3);

    const req = makeRequest({
      orders: [
        { customerName: "王大明", mobilePhone: "0912111111" },
        { customerName: "李小華", mobilePhone: "0912222222" },
        { customerName: "張美玲", mobilePhone: "0912333333" },
      ],
    });
    const res = await POST(req);
    const json = await res.json();

    expect(json.data.success).toBe(3);
    expect(json.data.failed).toBe(0);
  });

  it("缺少必填欄位的筆數回傳失敗，不影響其他筆", async () => {
    mockSuccessfulInsert(1, 1);

    const req = makeRequest({
      orders: [
        { customerName: "王大明", mobilePhone: "0912111111" },
        { customerName: "", mobilePhone: "0912222222" }, // 空姓名
        { mobilePhone: "0912333333" }, // 缺 customerName
      ],
    });
    const res = await POST(req);
    const json = await res.json();

    expect(json.data.success).toBe(1);
    expect(json.data.failed).toBe(2);
    expect(json.data.errors).toHaveLength(2);
    expect(json.data.errors[0].index).toBe(1);
    expect(json.data.errors[1].index).toBe(2);
  });

  it("部分成功部分失敗，回傳各自計數 + errors 陣列（含 index）", async () => {
    mockSuccessfulInsert(1, 1);
    mockFailedOrderInsert("DB constraint violation");
    mockSuccessfulInsert(3, 3);

    const req = makeRequest({
      orders: [
        { customerName: "王大明", mobilePhone: "0912111111" },
        { customerName: "李小華", mobilePhone: "0912222222" },
        { customerName: "張美玲", mobilePhone: "0912333333" },
      ],
    });
    const res = await POST(req);
    const json = await res.json();

    expect(json.data.success).toBe(2);
    expect(json.data.failed).toBe(1);
    expect(json.data.errors).toHaveLength(1);
    expect(json.data.errors[0].index).toBe(1);
    expect(json.data.errors[0].message).toContain("DB constraint violation");
  });

  it("重複手機號碼的訂單不擋（允許同一客戶多筆訂單）", async () => {
    mockSuccessfulInsert(1, 1);
    mockSuccessfulInsert(2, 2);

    const req = makeRequest({
      orders: [
        { customerName: "王大明", mobilePhone: "0912111111" },
        { customerName: "王大明", mobilePhone: "0912111111" },
      ],
    });
    const res = await POST(req);
    const json = await res.json();

    expect(json.data.success).toBe(2);
    expect(json.data.failed).toBe(0);
  });

  it("單筆 DB 失敗（customer insert）→ 該筆計入 failed，rollback order", async () => {
    mockFailedCustomerInsert(99, "customer insert failed");

    const req = makeRequest({
      orders: [{ customerName: "王大明", mobilePhone: "0912111111" }],
    });
    const res = await POST(req);
    const json = await res.json();

    expect(json.data.success).toBe(0);
    expect(json.data.failed).toBe(1);
    expect(json.data.errors[0].message).toContain("customer insert failed");
  });
});

describe("POST /api/orders/import — validation", () => {
  it("body 不是合法 JSON → 400 錯誤", async () => {
    const req = makeInvalidRequest("{invalid json");
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe(true);
  });

  it("body.orders 不是陣列 → 400 錯誤", async () => {
    const req = makeRequest({ orders: "not-an-array" });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe(true);
    expect(json.message).toContain("orders");
  });

  it("body 沒有 orders 欄位 → 400 錯誤", async () => {
    const req = makeRequest({ data: [] });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe(true);
  });
});
