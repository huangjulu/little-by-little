import type { Order } from "../types";

// ─── 繳費通知共用工具函式 ──────────────────────────────────────────────────

/** ATM 轉帳常數 */
export const ATM_BANK_CODE = "807";
export const ATM_BANK_NAME = "永豐銀行";

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

/** 格式化金額（如 4500 → 「NT$ 4,500」） */
export function formatNoticeAmount(amount: number | null | undefined): string {
  if (amount == null || isNaN(amount)) return "—";
  return `NT$ ${amount.toLocaleString("zh-TW")}`;
}

/** 格式化民國年標題日期（如「中華民國 115 年 01 月」） */
export function formatNoticeTitleDate(date: Date): string {
  const year = date.getFullYear() - 1911;
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `中華民國 ${year} 年 ${month} 月`;
}

/** POST /api/orders/pdf → blob → 觸發瀏覽器下載 */
export async function downloadBillingPdf(orders: Order[]): Promise<void> {
  const pdfRes = await fetch("/api/orders/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orders }),
  });

  if (!pdfRes.ok) {
    const err = await pdfRes.json().catch(() => null);
    throw new Error(err?.message ?? "PDF 產生失敗");
  }

  const blob = await pdfRes.blob();
  triggerBrowserDownload(blob, buildPdfFilename(orders));
}

/** 產生 PDF 檔名：「{客戶名}_{月}月_繳費通知.pdf」或多筆時「{月}月_繳費通知.pdf」 */
function buildPdfFilename(orders: Order[]): string {
  const billingMonth = getBillingMonth(orders[0]);
  const prefix = orders.length === 1 ? `${orders[0].customerName}_` : "";
  return `${prefix}${billingMonth}月_繳費通知.pdf`;
}

/** 從 nextBillingDate 取月份數字；無效時 fallback 為下個月 */
function getBillingMonth(order: Order): number {
  const date = new Date(order.nextBillingDate);
  if (!isNaN(date.getTime())) return date.getMonth() + 1;
  const now = new Date();
  return ((now.getMonth() + 1) % 12) + 1;
}

function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
