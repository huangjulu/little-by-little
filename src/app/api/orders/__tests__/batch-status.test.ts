import { beforeEach, describe, expect, it, vi } from "vitest";

import { MOCK_NEXT_HEADERS } from "@/__test-utils__/api-mocks";
import { jsonRequest, rawRequest } from "@/__test-utils__/request-builder";

// ─── Mocks ──────────────────────────────────────────────────────────────────

const mockRpc = vi.fn();

vi.mock("next/headers", () => MOCK_NEXT_HEADERS);

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() => ({
    rpc: mockRpc,
  })),
}));

// ─── helpers ────────────────────────────────────────────────────────────────

const PATH = "/api/orders/batch-status";
const makeRequest = (body: unknown) => jsonRequest(PATH, "PATCH", body);
const makeInvalidRequest = (body: string) => rawRequest(PATH, "PATCH", body);

// ─── import handler ─────────────────────────────────────────────────────────

let PATCH: typeof import("../batch-status/route").PATCH;

beforeEach(async () => {
  vi.clearAllMocks();
  const mod = await import("../batch-status/route");
  PATCH = mod.PATCH;
});

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("PATCH /api/orders/batch-status", () => {
  it("批量更新 2 筆訂單 payment_status 為 invoiced", async () => {
    mockRpc.mockResolvedValueOnce({
      data: { updated: 2, status: "invoiced" },
      error: null,
    });

    const req = makeRequest({
      ids: ["1", "2"],
      paymentStatus: "invoiced",
    });
    const res = await PATCH(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.error).toBe(false);
    expect(json.data.updated).toBe(2);
    expect(mockRpc).toHaveBeenCalledWith("batch_update_payment_status", {
      p_customer_ids: [1, 2],
      p_new_status: "invoiced",
      p_update_billing: false,
    });
  });

  it("空 ids 陣列回傳成功（updated: 0）", async () => {
    mockRpc.mockResolvedValueOnce({
      data: { updated: 0, status: "invoiced" },
      error: null,
    });

    const req = makeRequest({
      ids: [],
      paymentStatus: "invoiced",
    });
    const res = await PATCH(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.updated).toBe(0);
  });

  it("updateBillingDate=true 時傳入 p_update_billing=true", async () => {
    mockRpc.mockResolvedValueOnce({
      data: { updated: 1, status: "up_to_date" },
      error: null,
    });

    const req = makeRequest({
      ids: ["5"],
      paymentStatus: "up_to_date",
      updateBillingDate: true,
    });
    const res = await PATCH(req);
    await res.json();

    expect(mockRpc).toHaveBeenCalledWith("batch_update_payment_status", {
      p_customer_ids: [5],
      p_new_status: "up_to_date",
      p_update_billing: true,
    });
  });

  it("無效 paymentStatus 值回傳 400 錯誤", async () => {
    const req = makeRequest({
      ids: ["1"],
      paymentStatus: "unknown_status",
    });
    const res = await PATCH(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe(true);
    expect(json.message).toContain("paymentStatus");
  });

  it("缺少 paymentStatus 欄位回傳 400 錯誤", async () => {
    const req = makeRequest({ ids: ["1"] });
    const res = await PATCH(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe(true);
  });

  it("ids 不是陣列回傳 400 錯誤", async () => {
    const req = makeRequest({ ids: "not-array", paymentStatus: "invoiced" });
    const res = await PATCH(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe(true);
  });

  it("body 不是合法 JSON → 400 錯誤", async () => {
    const req = makeInvalidRequest("{invalid");
    const res = await PATCH(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe(true);
  });

  it("Supabase RPC 失敗 → 500 錯誤", async () => {
    mockRpc.mockResolvedValueOnce({
      data: null,
      error: { message: "connection timeout" },
    });

    const req = makeRequest({
      ids: ["1"],
      paymentStatus: "invoiced",
    });
    const res = await PATCH(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe(true);
    expect(json.message).toContain("connection timeout");
  });

  it("同一個 id 重複出現 → 去重後傳給 RPC", async () => {
    mockRpc.mockResolvedValueOnce({
      data: { updated: 1, status: "overdue" },
      error: null,
    });

    const req = makeRequest({
      ids: ["3", "3", "3"],
      paymentStatus: "overdue",
    });
    const res = await PATCH(req);
    await res.json();

    expect(mockRpc).toHaveBeenCalledWith("batch_update_payment_status", {
      p_customer_ids: [3],
      p_new_status: "overdue",
      p_update_billing: false,
    });
  });
});
