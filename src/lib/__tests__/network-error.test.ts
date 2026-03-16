import { describe, expect, it } from "vitest";

import { isOfflineError, OfflineError } from "@/lib/network-error";

describe("OfflineError", () => {
  it("應有正確的 message 和 name", () => {
    const err = new OfflineError();
    expect(err.message).toBe("目前離線");
    expect(err.name).toBe("OfflineError");
    expect(err.isOffline).toBe(true);
  });

  it("應是 Error 的實例", () => {
    expect(new OfflineError()).toBeInstanceOf(Error);
  });
});

describe("isOfflineError", () => {
  it("OfflineError 實例應回傳 true", () => {
    expect(isOfflineError(new OfflineError())).toBe(true);
  });

  it("帶有 isOffline: true 的 Error 應回傳 true", () => {
    const fakeOffline = Object.assign(new Error("fake"), { isOffline: true });
    expect(isOfflineError(fakeOffline)).toBe(true);
  });

  it("一般 Error 應回傳 false", () => {
    expect(isOfflineError(new Error("regular"))).toBe(false);
  });

  it("非 Error 值應回傳 false", () => {
    expect(isOfflineError(null)).toBe(false);
    expect(isOfflineError("string")).toBe(false);
    expect(isOfflineError(42)).toBe(false);
  });
});
