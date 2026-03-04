import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useFaultTolerantQuery } from "@/lib/hooks/useFaultTolerantQuery";
import * as localCache from "@/lib/local-cache";

vi.mock("sonner", () => ({
  toast: {
    warning: vi.fn(),
    error: vi.fn(),
    dismiss: vi.fn(),
  },
}));

const isString = (v: unknown): v is string => typeof v === "string";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useFaultTolerantQuery", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    // 預設在線
    Object.defineProperty(navigator, "onLine", {
      value: true,
      writable: true,
      configurable: true,
    });
  });

  it("成功 fetch 後應回傳資料並寫入 cache", async () => {
    const setCacheSpy = vi.spyOn(localCache, "localCacheSet");

    const { result } = renderHook(
      () =>
        useFaultTolerantQuery({
          queryKey: ["test"],
          queryFn: () => Promise.resolve("hello"),
          cacheKey: "test-key",
          cacheGuard: isString,
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.data).toBe("hello"));
    expect(result.current.isCachedFallback).toBe(false);
    expect(setCacheSpy).toHaveBeenCalledWith("test-key", "hello");
  });

  it("select 轉換後應儲存轉換結果", async () => {
    const setCacheSpy = vi.spyOn(localCache, "localCacheSet");
    const isNum = (v: unknown): v is number => typeof v === "number";

    const { result } = renderHook(
      () =>
        useFaultTolerantQuery({
          queryKey: ["transform"],
          queryFn: () => Promise.resolve("42"),
          select: (raw: string) => parseInt(raw, 10),
          cacheKey: "transform-key",
          cacheGuard: isNum,
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.data).toBe(42));
    expect(setCacheSpy).toHaveBeenCalledWith("transform-key", 42);
  });

  it("離線時 throwOnError 應回傳 false，並顯示快取 fallback", async () => {
    // 先在 cache 放入舊資料
    vi.spyOn(localCache, "localCacheGet").mockReturnValue("cached-value");

    // 模擬離線
    Object.defineProperty(navigator, "onLine", {
      value: false,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(
      () =>
        useFaultTolerantQuery({
          queryKey: ["offline"],
          queryFn: () => Promise.resolve("online-data"),
          cacheKey: "offline-key",
          cacheGuard: isString,
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.error).not.toBeNull());

    // 離線錯誤不應 throw（error 存在但元件不崩）
    expect(result.current.error?.message).toBe("目前離線");
    // 快取 fallback 應顯示
    expect(result.current.isCachedFallback).toBe(true);
    expect(result.current.data).toBe("cached-value");
  });

  it("enabled: false 時不應發出 request", () => {
    const queryFn = vi.fn(() => Promise.resolve("data"));

    renderHook(
      () =>
        useFaultTolerantQuery({
          queryKey: ["disabled"],
          queryFn,
          cacheKey: "disabled-key",
          cacheGuard: isString,
          enabled: false,
        }),
      { wrapper: createWrapper() }
    );

    expect(queryFn).not.toHaveBeenCalled();
  });
});
