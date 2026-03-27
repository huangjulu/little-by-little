import { beforeEach, describe, expect, it, vi } from "vitest";

import { MOCK_NEXT_HEADERS } from "@/__test-utils__/api-mocks";
import { getRequest, jsonRequest } from "@/__test-utils__/request-builder";

// ─── Mocks ──────────────────────────────────────────────────────────────────

const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockOr = vi.fn();
const mockGte = vi.fn();
const mockLte = vi.fn();
const mockLt = vi.fn();
const mockOrder = vi.fn();
const mockRange = vi.fn();
const mockInsert = vi.fn();
const mockInsertSelect = vi.fn();
const mockInsertSingle = vi.fn();
const mockCustomerInsert = vi.fn();
const mockCustomerSelect = vi.fn();
const mockCustomerSingle = vi.fn();
const mockDeleteEq = vi.fn();

vi.mock("next/headers", () => MOCK_NEXT_HEADERS);

vi.mock("@/features/order/billing/utils/billing-filter", () => ({
  getNextMonthRange: vi.fn(() => ({ start: "2026-04-01", end: "2026-04-30" })),
}));

vi.mock("@/lib/mappers/order-mapper", () => ({
  mapToOrder: vi.fn((row: Record<string, unknown>) => ({
    id: String(row.id),
    customerName:
      (row.customer_info as Record<string, string>)?.customer_name ?? "",
  })),
}));

// 建立一個支援鏈式呼叫的 query builder mock
function createChainableQuery(resolvedValue: {
  data: unknown;
  error: unknown;
  count?: number | null;
}) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};

  const makeChain = () =>
    new Proxy(
      {},
      {
        get(_target, prop: string) {
          if (prop === "then") {
            // 讓 await 能取到值
            return (resolve: (v: unknown) => void) => resolve(resolvedValue);
          }
          if (!chain[prop]) {
            chain[prop] = vi.fn().mockReturnValue(makeChain());
          }
          return chain[prop];
        },
      }
    );

  return { chain: makeChain(), fns: chain };
}

let mockQueryResult: { data: unknown; error: unknown; count?: number | null };

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn((table: string) => {
      if (table === "customers") {
        return {
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              range: vi.fn().mockImplementation(() => {
                // 回傳支援鏈式過濾的 proxy
                return createChainableQuery(mockQueryResult).chain;
              }),
            }),
          }),
          insert: mockCustomerInsert.mockReturnValue({
            select: mockCustomerSelect.mockReturnValue({
              single: mockCustomerSingle,
            }),
          }),
        };
      }
      if (table === "orders") {
        return {
          insert: mockInsert.mockReturnValue({
            select: mockInsertSelect.mockReturnValue({
              single: mockInsertSingle,
            }),
          }),
          delete: vi.fn().mockReturnValue({
            eq: mockDeleteEq,
          }),
        };
      }
      return {};
    }),
  })),
}));

// ─── helpers ────────────────────────────────────────────────────────────────

const PATH = "/api/orders";
const makeGetRequest = (params?: Record<string, string>) =>
  getRequest(PATH, params);
const makePostRequest = (body: unknown) => jsonRequest(PATH, "POST", body);

// ─── import handler ─────────────────────────────────────────────────────────

let GET: typeof import("../route").GET;
let POST: typeof import("../route").POST;

beforeEach(async () => {
  vi.clearAllMocks();
  mockQueryResult = { data: [], error: null, count: 0 };
  const mod = await import("../route");
  GET = mod.GET;
  POST = mod.POST;
});

// ─── Tests: GET /api/orders ─────────────────────────────────────────────────

describe("GET /api/orders", () => {
  it("預設分頁回傳訂單列表", async () => {
    mockQueryResult = {
      data: [
        { id: 1, customer_info: { customer_name: "王大明" }, orders: {} },
        { id: 2, customer_info: { customer_name: "李小華" }, orders: {} },
      ],
      error: null,
      count: 2,
    };

    const res = await GET(makeGetRequest());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.error).toBe(false);
    expect(json.data).toHaveLength(2);
    expect(json.total).toBe(2);
  });

  it("以 status 篩選訂單", async () => {
    mockQueryResult = {
      data: [{ id: 1, customer_info: { customer_name: "王大明" }, orders: {} }],
      error: null,
      count: 1,
    };

    const res = await GET(makeGetRequest({ status: "active" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.error).toBe(false);
    expect(json.data).toHaveLength(1);
  });

  it("以 keyword 搜尋訂單", async () => {
    mockQueryResult = {
      data: [{ id: 1, customer_info: { customer_name: "王大明" }, orders: {} }],
      error: null,
      count: 1,
    };

    const res = await GET(makeGetRequest({ keyword: "王大明" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toHaveLength(1);
  });

  it("以 billing=next-month 篩選訂單", async () => {
    mockQueryResult = {
      data: [{ id: 1, customer_info: { customer_name: "王大明" }, orders: {} }],
      error: null,
      count: 1,
    };

    const res = await GET(makeGetRequest({ billing: "next-month" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toHaveLength(1);
  });

  it("無符合條件時回傳空陣列", async () => {
    mockQueryResult = { data: [], error: null, count: 0 };

    const res = await GET(makeGetRequest({ status: "inactive" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.error).toBe(false);
    expect(json.data).toHaveLength(0);
    expect(json.total).toBe(0);
  });

  it("Supabase 錯誤回傳 500", async () => {
    mockQueryResult = {
      data: null,
      error: { message: "connection refused" },
      count: null,
    };

    const res = await GET(makeGetRequest());
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe(true);
    expect(json.message).toContain("connection refused");
  });
});

// ─── Tests: POST /api/orders ────────────────────────────────────────────────

describe("POST /api/orders", () => {
  it("建立訂單成功回傳 201", async () => {
    mockInsertSingle.mockResolvedValueOnce({
      data: { id: 10, base_price: 500, current_price: 500 },
      error: null,
    });
    mockCustomerSingle.mockResolvedValueOnce({
      data: {
        id: 1,
        customer_info: { customer_name: "王大明", mobile_phone: "0912111111" },
        order_id: 10,
        orders: { id: 10, base_price: 500, current_price: 500 },
      },
      error: null,
    });

    const res = await POST(
      makePostRequest({
        customerName: "王大明",
        mobilePhone: "0912111111",
        basePrice: 500,
        currentPrice: 500,
      })
    );
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.error).toBe(false);
    expect(json.message).toBe("訂單建立成功");
  });

  it("缺少必要欄位回傳 400", async () => {
    const res = await POST(makePostRequest({ communityName: "社區A" }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe(true);
    expect(json.message).toContain("customerName");
    expect(json.message).toContain("mobilePhone");
  });

  it("Supabase 插入訂單失敗回傳 500", async () => {
    mockInsertSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "insert failed" },
    });

    const res = await POST(
      makePostRequest({ customerName: "王大明", mobilePhone: "0912111111" })
    );
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe(true);
    expect(json.message).toContain("insert failed");
  });
});
