"use client";

import { forwardRef } from "react";

import type { Order } from "../types";
import {
  ATM_BANK_CODE,
  ATM_BANK_NAME,
  formatBillingPeriod,
  formatMinguoDate,
  formatNoticeAmount,
  formatNoticeTitleDate,
} from "./billing-notice.utils";

const PrintableNotice = forwardRef<HTMLDivElement, PrintableNoticeProps>(
  (props, ref) => {
    const today = new Date();

    return (
      <div ref={ref} className="print-notice hidden print:block">
        {props.orders.map((order, idx) => (
          <div
            key={order.id}
            className={idx < props.orders.length - 1 ? "break-after-page" : ""}
          >
            <div className="notice-page">
              {/* ── 1. 標題 ── */}
              <h1 className="notice-title">力網(京網)寬頻 服務費 繳費通知</h1>
              <p className="notice-date">{formatNoticeTitleDate(today)}</p>

              {/* ── 2. 客戶資訊 ── */}
              <table className="notice-table">
                <tbody>
                  <tr>
                    <td className="notice-label">社區名稱</td>
                    <td className="notice-value">
                      {order.communityName || "—"}
                    </td>
                    <td className="notice-label">姓名</td>
                    <td className="notice-value">
                      {order.customerName || "—"}
                    </td>
                  </tr>
                  <tr>
                    <td className="notice-label">戶別</td>
                    <td className="notice-value">{order.houseUnit || "—"}</td>
                    <td className="notice-label">地址</td>
                    <td className="notice-value">{order.address || "—"}</td>
                  </tr>
                </tbody>
              </table>

              {/* ── 3. 收費明細 ── */}
              <table className="notice-table notice-detail-table">
                <thead>
                  <tr>
                    <th>計費區間</th>
                    <th>速率</th>
                    <th>繳費方案</th>
                    <th>應繳金額</th>
                    <th>ATM 轉帳金額</th>
                    <th>繳費期限</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {formatBillingPeriod(
                        order.contractStartDate,
                        order.contractEndDate
                      )}
                    </td>
                    <td>{order.speed || "—"}</td>
                    <td>{order.billingPlan || "—"}</td>
                    <td className="notice-amount">
                      {formatNoticeAmount(order.currentPrice)}
                    </td>
                    <td className="notice-amount">
                      {formatNoticeAmount(computeAtmAmount(order))}
                    </td>
                    <td>
                      {order.paymentDeadline
                        ? formatMinguoDate(new Date(order.paymentDeadline))
                        : "—"}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* ── 4. ATM 轉帳資訊 ── */}
              <div className="notice-atm-section">
                <p className="notice-atm-title">ATM 轉帳資訊</p>
                <table className="notice-table">
                  <tbody>
                    <tr>
                      <td className="notice-label">銀行代碼</td>
                      <td className="notice-value">
                        {ATM_BANK_CODE}（{ATM_BANK_NAME}）
                      </td>
                    </tr>
                    <tr>
                      <td className="notice-label">轉入帳號（14碼）</td>
                      <td className="notice-value notice-atm-account">
                        {order.atmAccountNumber || "—"}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p className="notice-tax-note">※ 以上金額未含營業稅</p>
              </div>

              {/* ── 5. 帳務調整說明 ── */}
              <div className="notice-adjust-section">
                <p>※ 如有押金、價差等帳務調整，已反映於本期應繳金額中。</p>
                {(order.deposit > 0 || order.priceDifference !== 0) && (
                  <table className="notice-table">
                    <tbody>
                      {order.deposit > 0 && (
                        <tr>
                          <td className="notice-label">押金扣抵</td>
                          <td className="notice-value">
                            {formatNoticeAmount(order.deposit)}
                          </td>
                        </tr>
                      )}
                      {order.priceDifference !== 0 && (
                        <tr>
                          <td className="notice-label">價差調整</td>
                          <td className="notice-value">
                            {formatNoticeAmount(order.priceDifference)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* ── 6. 優惠方案 ── */}
              {hasPromotion(order) && (
                <div className="notice-promo-section">
                  <p className="notice-promo-title">優惠方案</p>
                  <table className="notice-table">
                    <thead>
                      <tr>
                        <th>方案</th>
                        <th>費用</th>
                        <th>加送月數</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.yearlyFee != null && (
                        <tr>
                          <td>年繳</td>
                          <td className="notice-amount">
                            {formatNoticeAmount(order.yearlyFee)}
                          </td>
                          <td>
                            {order.yearlyBonusMonths != null
                              ? `${order.yearlyBonusMonths} 個月`
                              : "—"}
                          </td>
                        </tr>
                      )}
                      {order.twoYearFee != null && (
                        <tr>
                          <td>2年繳</td>
                          <td className="notice-amount">
                            {formatNoticeAmount(order.twoYearFee)}
                          </td>
                          <td>
                            {order.twoYearBonusMonths != null
                              ? `${order.twoYearBonusMonths} 個月`
                              : "—"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── 7. 頁尾：繳費方式 + 服務專線 + 逾期說明 ── */}
              <div className="notice-footer">
                <p>
                  <strong>繳費方式：</strong>ATM 轉帳或至門市繳費。
                </p>
                <p>
                  <strong>服務專線：</strong>請洽力網(京網)寬頻客服。
                </p>
                <p className="notice-overdue">
                  ※ 逾期未繳費者，本公司將依規定暫停服務。
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

PrintableNotice.displayName = "PrintableNotice";

export default PrintableNotice;

// Types
interface PrintableNoticeProps {
  orders: Order[];
}

// Helpers
function computeAtmAmount(order: Order): number | null {
  if (!order.currentPrice) return null;
  let amount = order.currentPrice;
  if (order.deposit > 0) amount -= order.deposit;
  if (order.priceDifference !== 0) amount += order.priceDifference;
  return amount;
}

function hasPromotion(order: Order): boolean {
  return order.yearlyFee != null || order.twoYearFee != null;
}
