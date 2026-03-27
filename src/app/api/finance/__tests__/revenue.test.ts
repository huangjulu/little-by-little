import { beforeEach, describe, expect, it, vi } from "vitest";

import { MOCK_NEXT_HEADERS } from "@/__test-utils__/api-mocks";
import { getRequest } from "@/__test-utils__/request-builder";

// ─── Mocks ──────────────────────────────────────────────────────────────────

const mockLt = vi.fn();
const mockGte = vi.fn();

vi.mock("next/headers", () => MOCK_NEXT_HEADERS);

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnValue({
        gte: mockGte.mockReturnValue({
          lt: mockLt,
        }),
      }),
    })),
  })),
}));

// ─── helpers ────────────────────────────────────────────────────────────────

const makeRequest = (params?: Record<string, string>) =>
  getRequest("/api/finance/revenue", params);

// ─── import handler ─────────────────────────────────────────────────────────

let GET: typeof import("../../finance/revenue/route").GET;

beforeEach(async () => {
  vi.clearAllMocks();
  const mod = await import("../revenue/route");
  GET = mod.GET;
});

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("GET /api/finance/revenue", () => {
  it("回傳收益資料與 totalAmount 計算", async () => {
    mockLt.mockResolvedValueOnce({
      data: [
        { orders: { current_price: 500 } },
        { orders: { current_price: 800 } },
        { orders: { current_price: 300 } },
      ],
      error: null,
    });

    const res = await GET(makeRequest({ month: "2026-03" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.error).toBe(false);
    expect(json.data.totalAmount).toBe(1600);
    expect(json.data.count).toBe(3);
  });

  it("空結果回傳 totalAmount=0 count=0", async () => {
    mockLt.mockResolvedValueOnce({
      data: [],
      error: null,
    });

    const res = await GET(makeRequest({ month: "2026-03" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.totalAmount).toBe(0);
    expect(json.data.count).toBe(0);
  });

  it("Supabase 錯誤回傳 500", async () => {
    mockLt.mockResolvedValueOnce({
      data: null,
      error: { message: "query timeout" },
    });

    const res = await GET(makeRequest({ month: "2026-03" }));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe(true);
    expect(json.message).toContain("query timeout");
  });

  it("缺少 month 參數回傳 400", async () => {
    const res = await GET(makeRequest());
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe(true);
    expect(json.message).toContain("YYYY-MM");
  });

  it("無效 month 格式回傳 400", async () => {
    const res = await GET(makeRequest({ month: "2026-13" }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe(true);
  });

  it("month 格式不正確（非 YYYY-MM）回傳 400", async () => {
    const res = await GET(makeRequest({ month: "March" }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe(true);
  });

  it("12 月正確計算跨年的 endDate", async () => {
    mockLt.mockResolvedValueOnce({
      data: [{ orders: { current_price: 1000 } }],
      error: null,
    });

    const res = await GET(makeRequest({ month: "2026-12" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.totalAmount).toBe(1000);
    // 驗證 gte/lt 被正確呼叫
    expect(mockGte).toHaveBeenCalledWith(
      "paid_confirmed_at",
      "2026-12-01T00:00:00.000Z"
    );
    expect(mockLt).toHaveBeenCalledWith(
      "paid_confirmed_at",
      "2027-01-01T00:00:00.000Z"
    );
  });
});
