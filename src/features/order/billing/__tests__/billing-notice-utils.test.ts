import { describe, expect, it } from "vitest";

import {
  formatBillingPeriod,
  formatMinguoDate,
  formatMinguoYearMonth,
  formatNoticeAmount,
  formatNoticeTitleDate,
} from "@/lib/formatters";

import { ATM_BANK_CODE, ATM_BANK_NAME } from "../constants";

// ─── 常數 ──────────────────────────────────────────────────────────────────────

describe("ATM 常數", () => {
  it("ATM_BANK_CODE 為 '807'", () => {
    expect(ATM_BANK_CODE).toBe("807");
  });

  it("ATM_BANK_NAME 為 '永豐銀行'", () => {
    expect(ATM_BANK_NAME).toBe("永豐銀行");
  });
});

// ─── formatMinguoDate ────────────────────────────────────────────────────────

describe("formatMinguoDate — 西元轉民國年", () => {
  it("2026-01-20 → '115/01/20'", () => {
    expect(formatMinguoDate(new Date("2026-01-20"))).toBe("115/01/20");
  });

  it("2024-12-05 → '113/12/05'", () => {
    expect(formatMinguoDate(new Date("2024-12-05"))).toBe("113/12/05");
  });

  it("1912-01-01 → '1/01/01'（民國元年）", () => {
    expect(formatMinguoDate(new Date("1912-01-01"))).toBe("1/01/01");
  });
});

// ─── formatMinguoYearMonth ───────────────────────────────────────────────────

describe("formatMinguoYearMonth — 民國年月", () => {
  it("2026-01-20 → '115年01月'", () => {
    expect(formatMinguoYearMonth(new Date("2026-01-20"))).toBe("115年01月");
  });

  it("2026-12-01 → '115年12月'", () => {
    expect(formatMinguoYearMonth(new Date("2026-12-01"))).toBe("115年12月");
  });
});

// ─── formatBillingPeriod ─────────────────────────────────────────────────────

describe("formatBillingPeriod — 計費區間格式化", () => {
  it("正常日期區間", () => {
    expect(formatBillingPeriod("2026-01-01", "2026-01-31")).toBe(
      "115/01/01 ~ 115/01/31"
    );
  });

  it("start 為空字串回傳 '—'", () => {
    expect(formatBillingPeriod("", "2026-01-31")).toBe("—");
  });

  it("end 為空字串回傳 '—'", () => {
    expect(formatBillingPeriod("2026-01-01", "")).toBe("—");
  });

  it("無效日期字串回傳 '—'", () => {
    expect(formatBillingPeriod("invalid", "also-invalid")).toBe("—");
  });
});

// ─── formatNoticeAmount ──────────────────────────────────────────────────────

describe("formatNoticeAmount — 金額格式化", () => {
  it("4500 → 'NT$ 4,500'", () => {
    expect(formatNoticeAmount(4500)).toBe("NT$ 4,500");
  });

  it("0 → 'NT$ 0'", () => {
    expect(formatNoticeAmount(0)).toBe("NT$ 0");
  });

  it("null 回傳 '—'", () => {
    expect(formatNoticeAmount(null)).toBe("—");
  });

  it("undefined 回傳 '—'", () => {
    expect(formatNoticeAmount(undefined)).toBe("—");
  });

  it("NaN 回傳 '—'", () => {
    expect(formatNoticeAmount(NaN)).toBe("—");
  });
});

// ─── formatNoticeTitleDate ───────────────────────────────────────────────────

describe("formatNoticeTitleDate — 民國年標題日期", () => {
  it("2026-01-15 → '中華民國 115 年 01 月'", () => {
    expect(formatNoticeTitleDate(new Date("2026-01-15"))).toBe(
      "中華民國 115 年 01 月"
    );
  });

  it("2026-12-01 → '中華民國 115 年 12 月'", () => {
    expect(formatNoticeTitleDate(new Date("2026-12-01"))).toBe(
      "中華民國 115 年 12 月"
    );
  });
});
