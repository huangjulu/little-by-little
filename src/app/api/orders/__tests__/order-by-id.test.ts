import { beforeEach, describe, expect, it, vi } from "vitest";

import { MOCK_NEXT_HEADERS } from "@/__test-utils__/api-mocks";
import { getRequest, jsonRequest } from "@/__test-utils__/request-builder";

// ─── Mocks ──────────────────────────────────────────────────────────────────

const mockSingle = vi.fn();
const mockUpdateEq = vi.fn();

vi.mock("next/headers", () => MOCK_NEXT_HEADERS);

vi.mock("@/lib/mappers/order-mapper", () => ({
  mapToOrder: vi.fn((row: Record<string, unknown>) => ({
    id: String(row.id),
    customerName:
      (row.customer_info as Record<string, string>)?.customer_name ?? "",
    status: row.order_status ?? "inactive",
  })),
}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn((table: string) => {
      if (table === "customers") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: mockSingle,
            }),
          }),
          update: vi.fn().mockReturnValue({
            eq: mockUpdateEq,
          }),
        };
      }
      return {};
    }),
  })),
}));

// ─── helpers ────────────────────────────────────────────────────────────────

const makeGetRequest = (id: string) => getRequest(`/api/orders/${id}`);
const makePatchRequest = (id: string, body: unknown) =>
  jsonRequest(`/api/orders/${id}`, "PATCH", body);

function makeParams(id: string): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id }) };
}

// ─── import handler ─────────────────────────────────────────────────────────

let GET: typeof import("../../orders/[id]/route").GET;
let PATCH: typeof import("../../orders/[id]/route").PATCH;

beforeEach(async () => {
  vi.clearAllMocks();
  const mod = await import("../[id]/route");
  GET = mod.GET;
  PATCH = mod.PATCH;
});

// ─── Tests: GET /api/orders/[id] ────────────────────────────────────────────

describe("GET /api/orders/[id]", () => {
  it("回傳單筆訂單", async () => {
    mockSingle.mockResolvedValueOnce({
      data: {
        id: 1,
        customer_info: { customer_name: "王大明" },
        order_status: "active",
        orders: { id: 10, base_price: 500 },
      },
      error: null,
    });

    const res = await GET(makeGetRequest("1"), makeParams("1"));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.error).toBe(false);
    expect(json.data.id).toBe("1");
  });

  it("找不到訂單回傳 404", async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "not found" },
    });

    const res = await GET(makeGetRequest("999"), makeParams("999"));
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe(true);
    expect(json.message).toContain("訂單不存在");
  });

  it("非數字 ID 回傳 404", async () => {
    const res = await GET(makeGetRequest("abc"), makeParams("abc"));
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe(true);
  });
});

// ─── Tests: PATCH /api/orders/[id] ──────────────────────────────────────────

describe("PATCH /api/orders/[id]", () => {
  it("更新訂單狀態成功", async () => {
    mockUpdateEq.mockResolvedValueOnce({ error: null });
    mockSingle.mockResolvedValueOnce({
      data: {
        id: 1,
        customer_info: { customer_name: "王大明" },
        order_status: "inactive",
        orders: { id: 10 },
      },
      error: null,
    });

    const res = await PATCH(
      makePatchRequest("1", { status: "inactive" }),
      makeParams("1")
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.error).toBe(false);
    expect(json.message).toBe("訂單更新成功");
  });

  it("無效狀態回傳 400", async () => {
    const res = await PATCH(
      makePatchRequest("1", { status: "deleted" }),
      makeParams("1")
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe(true);
    expect(json.message).toContain("無效的狀態");
  });

  it("非數字 ID 回傳 404", async () => {
    const res = await PATCH(
      makePatchRequest("abc", { status: "active" }),
      makeParams("abc")
    );
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe(true);
  });

  it("更新後找不到訂單回傳 404", async () => {
    mockUpdateEq.mockResolvedValueOnce({ error: null });
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "not found" },
    });

    const res = await PATCH(
      makePatchRequest("999", { status: "active" }),
      makeParams("999")
    );
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe(true);
  });
});
