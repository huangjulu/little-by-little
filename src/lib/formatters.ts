/**
 * 格式化日期時間為中文格式
 */
export function formatDate(dateString: string): string {
  if (!dateString) {
    return "-";
  }

  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(dateString));
}

/**
 * 格式化金額為台幣格式
 */
export function formatCurrency(value: number): string {
  if (isNaN(value)) {
    return "Invalid number";
  }

  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }).format(value);
}

// ─── 民國年日期格式 ──────────────────────────────────────────────────────────

/** 西元轉民國年（如 2026-01-20 → 「115/01/20」） */
export function formatMinguoDate(date: Date): string {
  const year = date.getFullYear() - 1911;
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

/** 格式化民國年月（如 2026-01-20 → 「115年01月」） */
export function formatMinguoYearMonth(date: Date): string {
  const year = date.getFullYear() - 1911;
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}年${month}月`;
}

/** 格式化計費區間（如「115/01/01 ~ 115/01/31」） */
export function formatBillingPeriod(start: string, end: string): string {
  if (!start || !end) return "—";
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return "—";
  return `${formatMinguoDate(s)} ~ ${formatMinguoDate(e)}`;
}

/** 格式化民國年標題日期（如「中華民國 115 年 01 月」） */
export function formatNoticeTitleDate(date: Date): string {
  const year = date.getFullYear() - 1911;
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `中華民國 ${year} 年 ${month} 月`;
}

// ─── 金額格式 ────────────────────────────────────────────────────────────────

/** 格式化金額（如 4500 → 「NT$ 4,500」） */
export function formatNoticeAmount(amount: number | null | undefined): string {
  if (amount == null || isNaN(amount)) return "—";
  return `NT$ ${amount.toLocaleString("zh-TW")}`;
}
