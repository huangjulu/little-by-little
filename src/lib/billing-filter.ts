import {
  addMonths,
  endOfMonth,
  format,
  isValid,
  isWithinInterval,
  parseISO,
  startOfMonth,
} from "date-fns";

/**
 * 判斷 next_billing_date 是否落在「下個月」的範圍內
 */
export function isNextMonthBilling(
  nextBillingDate: string | null | undefined
): boolean {
  if (!nextBillingDate) return false;

  const date = parseISO(nextBillingDate);
  if (!isValid(date)) return false;

  const now = new Date();
  const nextMonth = addMonths(now, 1);
  const start = startOfMonth(nextMonth);
  const end = endOfMonth(nextMonth);

  return isWithinInterval(date, { start, end });
}

/**
 * 取得下個月的起迄日期（ISO 日期字串）
 * 用於 API query 的 .gte() / .lte() 範圍篩選
 */
export function getNextMonthRange(): { start: string; end: string } {
  const now = new Date();
  const nextMonth = addMonths(now, 1);
  return {
    start: format(startOfMonth(nextMonth), "yyyy-MM-dd"),
    end: format(endOfMonth(nextMonth), "yyyy-MM-dd"),
  };
}
