import { downloadFile } from "@/lib/download";

import { orderApi } from "../../order.api";
import type { Order } from "../../types";

/** 下載繳費通知 PDF 並觸發瀏覽器下載 */
export async function downloadBillingPdf(orders: Order[]): Promise<void> {
  const blob = await orderApi.fetchBillingPdf(orders);
  downloadFile(blob, buildPdfFilename(orders));
}

/** 計算 ATM 實際匯款金額（扣押金、加價差） */
export function computeAtmAmount(order: Order): number | null {
  if (!order.currentPrice) return null;
  let amount = order.currentPrice;
  if (order.deposit > 0) amount -= order.deposit;
  if (order.priceDifference !== 0) amount += order.priceDifference;
  return amount;
}

/** 訂單是否有年繳/兩年繳優惠 */
export function hasPromotion(order: Order): boolean {
  return order.yearlyFee != null || order.twoYearFee != null;
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
