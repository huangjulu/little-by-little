import { describe, expect, it } from "vitest";

import { formatCurrency, formatDate } from "@/lib/formatters";

// ─── formatDate ─────────────────────────────────────────────────────────────

describe("formatDate", () => {
  it("格式化有效日期字串", () => {
    const result = formatDate("2026-03-15");
    // Intl.DateTimeFormat zh-TW → "2026/03/15"
    expect(result).toBe("2026/03/15");
  });

  it("空字串回傳 '-'", () => {
    expect(formatDate("")).toBe("-");
  });

  it("null/undefined 強制傳入回傳 '-'", () => {
    // 利用 as any 測試邊界情況
    expect(formatDate(null as unknown as string)).toBe("-");
    expect(formatDate(undefined as unknown as string)).toBe("-");
  });

  it("無效日期字串拋出 RangeError", () => {
    // new Date("not-a-date") → Invalid Date → Intl.DateTimeFormat.format() 拋出 RangeError
    expect(() => formatDate("not-a-date")).toThrow(RangeError);
  });
});

// ─── formatCurrency ─────────────────────────────────────────────────────────

describe("formatCurrency", () => {
  it("格式化正整數為台幣格式", () => {
    const result = formatCurrency(1500);
    // Intl.NumberFormat zh-TW TWD → "$1,500"
    expect(result).toContain("1,500");
  });

  it("零值格式化", () => {
    const result = formatCurrency(0);
    expect(result).toContain("0");
  });

  it("負數格式化", () => {
    const result = formatCurrency(-500);
    expect(result).toContain("500");
  });

  it("NaN 回傳 'Invalid number'", () => {
    expect(formatCurrency(NaN)).toBe("Invalid number");
  });

  it("大數值正確格式化", () => {
    const result = formatCurrency(1000000);
    expect(result).toContain("1,000,000");
  });
});
