import { afterEach, describe, expect, it, vi } from "vitest";

import { getNextMonthRange, isNextMonthBilling } from "@/lib/billing-filter";

// ─── isNextMonthBilling ─────────────────────────────────────────────────────

describe("isNextMonthBilling", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("next_billing_date 在下個月第 1 天 → true", () => {
    vi.useFakeTimers({ now: new Date("2026-03-14") });
    expect(isNextMonthBilling("2026-04-01")).toBe(true);
  });

  it("next_billing_date 在下個月最後一天 → true", () => {
    vi.useFakeTimers({ now: new Date("2026-03-14") });
    expect(isNextMonthBilling("2026-04-30")).toBe(true);
  });

  it("next_billing_date 在本月 → false", () => {
    vi.useFakeTimers({ now: new Date("2026-03-14") });
    expect(isNextMonthBilling("2026-03-15")).toBe(false);
  });

  it("next_billing_date 在兩個月後 → false", () => {
    vi.useFakeTimers({ now: new Date("2026-03-14") });
    expect(isNextMonthBilling("2026-05-01")).toBe(false);
  });

  it("next_billing_date 為空字串 → false", () => {
    expect(isNextMonthBilling("")).toBe(false);
  });

  it("next_billing_date 為 null → false", () => {
    expect(isNextMonthBilling(null)).toBe(false);
  });

  it('next_billing_date 為無效日期字串（"abc"）→ false', () => {
    expect(isNextMonthBilling("abc")).toBe(false);
  });

  it('next_billing_date 為 "Invalid Date" → false', () => {
    expect(isNextMonthBilling("Invalid Date")).toBe(false);
  });

  it("在 12 月時呼叫 → 正確判斷 1 月為下個月（跨年）", () => {
    vi.useFakeTimers({ now: new Date("2026-12-15") });
    expect(isNextMonthBilling("2027-01-15")).toBe(true);
    expect(isNextMonthBilling("2026-12-15")).toBe(false);
  });

  it("在 1 月 31 日呼叫 → 正確判斷 2 月（短月）的範圍", () => {
    vi.useFakeTimers({ now: new Date("2026-01-31") });
    expect(isNextMonthBilling("2026-02-01")).toBe(true);
    expect(isNextMonthBilling("2026-02-28")).toBe(true);
    expect(isNextMonthBilling("2026-03-01")).toBe(false);
  });
});

// ─── getNextMonthRange ──────────────────────────────────────────────────────

describe("getNextMonthRange", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("回傳下個月的起迄日期（ISO 格式）", () => {
    vi.useFakeTimers({ now: new Date("2026-03-14") });
    const { start, end } = getNextMonthRange();
    expect(start).toBe("2026-04-01");
    expect(end).toBe("2026-04-30");
  });

  it("12 月 → 隔年 1 月", () => {
    vi.useFakeTimers({ now: new Date("2026-12-01") });
    const { start, end } = getNextMonthRange();
    expect(start).toBe("2027-01-01");
    expect(end).toBe("2027-01-31");
  });

  it("1 月 → 2 月（短月 28 天）", () => {
    vi.useFakeTimers({ now: new Date("2026-01-15") });
    const { start, end } = getNextMonthRange();
    expect(start).toBe("2026-02-01");
    expect(end).toBe("2026-02-28");
  });
});
