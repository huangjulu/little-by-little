import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// ─── Mock nuqs ───────────────────────────────────────────────────────────────

/**
 * nuqs 的 useQueryState 在非瀏覽器環境無法運作，
 * 用簡易 mock 模擬其行為。
 * vi.mock factory 會被 hoisted，不可引用外部變數。
 */
vi.mock("nuqs", () => {
  const mockSetValue = vi.fn().mockImplementation(() => Promise.resolve());

  const useQueryState = vi
    .fn()
    .mockImplementation((_key: string, parser?: { defaultValue?: unknown }) => {
      const defaultVal = parser?.defaultValue ?? null;
      return [defaultVal, mockSetValue];
    });

  return {
    useQueryState,
    parseAsString: { withDefault: (d: string) => ({ defaultValue: d }) },
    parseAsInteger: { withDefault: (d: number) => ({ defaultValue: d }) },
    parseAsStringLiteral: (_opts: readonly string[]) => ({
      withDefault: (d: string) => ({ defaultValue: d }),
    }),
  };
});

import useOrderFilters from "../useOrderFilters";

// ─── 預設值 ──────────────────────────────────────────────────────────────────

describe("useOrderFilters — 預設值", () => {
  it("keyword 預設為空字串", () => {
    const { result } = renderHook(() => useOrderFilters());
    expect(result.current.keyword).toBe("");
  });

  it("status 預設為 'all'", () => {
    const { result } = renderHook(() => useOrderFilters());
    expect(result.current.status).toBe("all");
  });

  it("page 預設為 1", () => {
    const { result } = renderHook(() => useOrderFilters());
    expect(result.current.page).toBe(1);
  });

  it("pageSize 為 20", () => {
    const { result } = renderHook(() => useOrderFilters());
    expect(result.current.pageSize).toBe(20);
  });

  it("isBillingMode 預設為 false", () => {
    const { result } = renderHook(() => useOrderFilters());
    expect(result.current.isBillingMode).toBe(false);
  });
});

// ─── handleFiltersChange ─────────────────────────────────────────────────────

describe("useOrderFilters — handleFiltersChange", () => {
  it("handleFiltersChange 為 function", () => {
    const { result } = renderHook(() => useOrderFilters());
    expect(typeof result.current.handleFiltersChange).toBe("function");
  });

  it("呼叫 handleFiltersChange 不會拋錯", () => {
    const { result } = renderHook(() => useOrderFilters());

    act(() => {
      result.current.handleFiltersChange({ keyword: "test" });
    });

    // handleFiltersChange 應正常執行（呼叫內部的 setKeyword 和 setPage）
    // 由於 mock 的 setValue 不會觸發 re-render，我們只驗證不會拋錯
  });
});

// ─── searchFilter ────────────────────────────────────────────────────────────

describe("useOrderFilters — searchFilter", () => {
  it("searchFilter.active 預設為 null（非 billing mode）", () => {
    const { result } = renderHook(() => useOrderFilters());
    expect(result.current.searchFilter.active).toBeNull();
  });

  it("searchFilter.onSelect 為 function", () => {
    const { result } = renderHook(() => useOrderFilters());
    expect(typeof result.current.searchFilter.onSelect).toBe("function");
  });

  it("searchFilter.onClear 為 function", () => {
    const { result } = renderHook(() => useOrderFilters());
    expect(typeof result.current.searchFilter.onClear).toBe("function");
  });

  it("呼叫 searchFilter.onClear 不會拋錯", () => {
    const { result } = renderHook(() => useOrderFilters());

    act(() => {
      result.current.searchFilter.onClear();
    });
  });

  it("呼叫 searchFilter.onSelect 帶 billing:next-month 不會拋錯", () => {
    const { result } = renderHook(() => useOrderFilters());

    act(() => {
      result.current.searchFilter.onSelect({ key: "billing:next-month" });
    });
  });
});
