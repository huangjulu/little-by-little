import { beforeEach, describe, expect, it, vi } from "vitest";

import { MOCK_NEXT_HEADERS } from "@/__test-utils__/api-mocks";
import { jsonRequest, rawRequest } from "@/__test-utils__/request-builder";

// ─── Mocks ──────────────────────────────────────────────────────────────────

const mockSignInWithPassword = vi.fn();
const mockGetUser = vi.fn();

vi.mock("next/headers", () => MOCK_NEXT_HEADERS);

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      getUser: mockGetUser,
    },
  })),
}));

// ─── helpers ────────────────────────────────────────────────────────────────

const makeLoginRequest = (body: unknown) =>
  jsonRequest("/api/auth/login", "POST", body);

// ─── import handlers ────────────────────────────────────────────────────────

let loginPOST: typeof import("../../auth/login/route").POST;
let checkGET: typeof import("../../auth/check/route").GET;

beforeEach(async () => {
  vi.clearAllMocks();
  const loginMod = await import("../login/route");
  loginPOST = loginMod.POST;
  const checkMod = await import("../check/route");
  checkGET = checkMod.GET;
});

// ─── Tests: POST /api/auth/login ────────────────────────────────────────────

describe("POST /api/auth/login", () => {
  it("錯誤驗證碼回傳 401", async () => {
    const res = await loginPOST(makeLoginRequest({ passcode: "9999" }));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe(true);
    expect(json.message).toContain("驗證碼錯誤");
  });

  it("正確驗證碼回傳 200", async () => {
    mockSignInWithPassword.mockResolvedValueOnce({ error: null });

    const res = await loginPOST(makeLoginRequest({ passcode: "1234" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.error).toBe(false);
    expect(json.message).toBe("驗證成功");
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: "admin@lbl.local",
      password: "lbl-admin-1234",
    });
  });

  it("缺少 passcode 欄位回傳 500（JSON parse 不會失敗但存取 undefined）", async () => {
    const res = await loginPOST(makeLoginRequest({}));
    const json = await res.json();

    // passcode 為 undefined !== "1234"，所以走 401
    expect(res.status).toBe(401);
    expect(json.error).toBe(true);
  });

  it("無效 JSON body 回傳 500", async () => {
    const req = rawRequest("/api/auth/login", "POST", "{invalid");
    const res = await loginPOST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe(true);
  });

  it("Supabase auth 失敗回傳 500", async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      error: { message: "Invalid login credentials" },
    });

    const res = await loginPOST(makeLoginRequest({ passcode: "1234" }));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe(true);
    expect(json.message).toContain("登入失敗");
  });
});

// ─── Tests: GET /api/auth/check ─────────────────────────────────────────────

describe("GET /api/auth/check", () => {
  it("已登入使用者回傳 authenticated=true", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: "user-1", email: "admin@lbl.local" } },
      error: null,
    });

    const res = await checkGET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.authenticated).toBe(true);
  });

  it("未登入使用者回傳 authenticated=false", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: null },
      error: null,
    });

    const res = await checkGET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.authenticated).toBe(false);
  });

  it("Supabase 錯誤回傳 authenticated=false", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: null },
      error: { message: "token expired" },
    });

    const res = await checkGET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.authenticated).toBe(false);
  });
});
