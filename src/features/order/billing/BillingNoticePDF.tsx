import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import type { Order } from "../types";
import {
  ATM_BANK_CODE,
  ATM_BANK_NAME,
  formatBillingPeriod,
  formatMinguoDate,
  formatNoticeAmount,
  formatNoticeTitleDate,
} from "./billing-notice.utils";

Font.register({
  family: "NotoSansTC",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-tc@latest/chinese-traditional-400-normal.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-tc@latest/chinese-traditional-700-normal.ttf",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSansTC",
    fontSize: 11,
    padding: "12mm 15mm",
    color: "#1e1e1e",
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: 4,
  },
  date: {
    fontSize: 10,
    textAlign: "center",
    color: "#666",
    marginBottom: 16,
  },
  table: {
    width: "100%",
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #999",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottom: "1px solid #999",
  },
  labelCell: {
    width: "20%",
    padding: "5px 8px",
    fontWeight: 700,
    backgroundColor: "#f7f7f7",
    borderRight: "1px solid #999",
  },
  valueCell: {
    width: "30%",
    padding: "5px 8px",
    borderRight: "1px solid #999",
  },
  headerCell: {
    flex: 1,
    padding: "4px 6px",
    fontSize: 9,
    fontWeight: 700,
    textAlign: "center",
    borderRight: "1px solid #999",
  },
  dataCell: {
    flex: 1,
    padding: "4px 6px",
    fontSize: 10,
    textAlign: "center",
    borderRight: "1px solid #999",
  },
  amountCell: {
    flex: 1,
    padding: "4px 6px",
    fontSize: 10,
    textAlign: "right",
    fontWeight: 700,
    borderRight: "1px solid #999",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginTop: 12,
    marginBottom: 6,
    borderBottom: "2px solid #333",
    paddingBottom: 2,
  },
  note: {
    fontSize: 9,
    color: "#888",
    marginTop: 4,
  },
  adjustSection: {
    fontSize: 10,
    color: "#555",
    marginBottom: 12,
  },
  footer: {
    marginTop: 16,
    paddingTop: 10,
    borderTop: "1px solid #ccc",
    fontSize: 10,
  },
  footerLine: {
    marginBottom: 2,
  },
  overdue: {
    color: "#c00",
    fontWeight: 700,
    marginTop: 6,
  },
  monoText: {
    fontFamily: "Courier",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 2,
  },
  outerBorder: {
    border: "1px solid #999",
  },
});

// Types
interface BillingNoticePDFProps {
  orders: Order[];
}

const BillingNoticePDF: React.FC<BillingNoticePDFProps> = (props) => {
  const today = new Date();

  return (
    <Document>
      {props.orders.map((order) => (
        <Page key={order.id} size="A4" style={styles.page}>
          {/* 1. 標題 */}
          <Text style={styles.title}>力網(京網)寬頻 服務費 繳費通知</Text>
          <Text style={styles.date}>{formatNoticeTitleDate(today)}</Text>

          {/* 2. 客戶資訊 */}
          <View style={[styles.table, styles.outerBorder]}>
            <View style={styles.tableRow}>
              <Text style={styles.labelCell}>社區名稱</Text>
              <Text style={styles.valueCell}>{order.communityName || "—"}</Text>
              <Text style={styles.labelCell}>姓名</Text>
              <Text style={styles.valueCell}>{order.customerName || "—"}</Text>
            </View>
            <View style={[styles.tableRow, { borderBottom: "none" }]}>
              <Text style={styles.labelCell}>戶別</Text>
              <Text style={styles.valueCell}>{order.houseUnit || "—"}</Text>
              <Text style={styles.labelCell}>地址</Text>
              <Text style={styles.valueCell}>{order.address || "—"}</Text>
            </View>
          </View>

          {/* 3. 收費明細 */}
          <View style={[styles.table, styles.outerBorder]}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.headerCell}>計費區間</Text>
              <Text style={styles.headerCell}>速率</Text>
              <Text style={styles.headerCell}>繳費方案</Text>
              <Text style={styles.headerCell}>應繳金額</Text>
              <Text style={styles.headerCell}>ATM 轉帳金額</Text>
              <Text style={styles.headerCell}>繳費期限</Text>
            </View>
            <View style={[styles.tableRow, { borderBottom: "none" }]}>
              <Text style={styles.dataCell}>
                {formatBillingPeriod(
                  order.contractStartDate,
                  order.contractEndDate
                )}
              </Text>
              <Text style={styles.dataCell}>{order.speed || "—"}</Text>
              <Text style={styles.dataCell}>{order.billingPlan || "—"}</Text>
              <Text style={styles.amountCell}>
                {formatNoticeAmount(order.currentPrice)}
              </Text>
              <Text style={styles.amountCell}>
                {formatNoticeAmount(computeAtmAmount(order))}
              </Text>
              <Text style={styles.dataCell}>
                {order.paymentDeadline
                  ? formatMinguoDate(new Date(order.paymentDeadline))
                  : "—"}
              </Text>
            </View>
          </View>

          {/* 4. ATM 轉帳資訊 */}
          <Text style={styles.sectionTitle}>ATM 轉帳資訊</Text>
          <View style={[styles.table, styles.outerBorder]}>
            <View style={styles.tableRow}>
              <Text style={styles.labelCell}>銀行代碼</Text>
              <Text style={styles.valueCell}>
                {ATM_BANK_CODE}（{ATM_BANK_NAME}）
              </Text>
            </View>
            <View style={[styles.tableRow, { borderBottom: "none" }]}>
              <Text style={styles.labelCell}>轉入帳號（14碼）</Text>
              <Text style={styles.valueCell}>
                <Text style={styles.monoText}>
                  {order.atmAccountNumber || "—"}
                </Text>
              </Text>
            </View>
          </View>
          <Text style={styles.note}>※ 以上金額未含營業稅</Text>

          {/* 5. 帳務調整說明 */}
          <View style={styles.adjustSection}>
            <Text>※ 如有押金、價差等帳務調整，已反映於本期應繳金額中。</Text>
            {order.deposit > 0 && (
              <Text>　押金扣抵：{formatNoticeAmount(order.deposit)}</Text>
            )}
            {order.priceDifference !== 0 && (
              <Text>
                　價差調整：{formatNoticeAmount(order.priceDifference)}
              </Text>
            )}
          </View>

          {/* 6. 優惠方案 */}
          {hasPromotion(order) && (
            <View>
              <Text style={styles.sectionTitle}>優惠方案</Text>
              <View style={[styles.table, styles.outerBorder]}>
                <View style={styles.tableHeaderRow}>
                  <Text style={styles.headerCell}>方案</Text>
                  <Text style={styles.headerCell}>費用</Text>
                  <Text style={styles.headerCell}>加送月數</Text>
                </View>
                {order.yearlyFee != null && (
                  <View style={styles.tableRow}>
                    <Text style={styles.dataCell}>年繳</Text>
                    <Text style={styles.amountCell}>
                      {formatNoticeAmount(order.yearlyFee)}
                    </Text>
                    <Text style={styles.dataCell}>
                      {order.yearlyBonusMonths != null
                        ? `${order.yearlyBonusMonths} 個月`
                        : "—"}
                    </Text>
                  </View>
                )}
                {order.twoYearFee != null && (
                  <View style={[styles.tableRow, { borderBottom: "none" }]}>
                    <Text style={styles.dataCell}>2年繳</Text>
                    <Text style={styles.amountCell}>
                      {formatNoticeAmount(order.twoYearFee)}
                    </Text>
                    <Text style={styles.dataCell}>
                      {order.twoYearBonusMonths != null
                        ? `${order.twoYearBonusMonths} 個月`
                        : "—"}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* 7. 頁尾 */}
          <View style={styles.footer}>
            <Text style={styles.footerLine}>
              繳費方式：ATM 轉帳或至門市繳費。
            </Text>
            <Text style={styles.footerLine}>
              服務專線：請洽力網(京網)寬頻客服。
            </Text>
            <Text style={styles.overdue}>
              ※ 逾期未繳費者，本公司將依規定暫停服務。
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

BillingNoticePDF.displayName = "BillingNoticePDF";

export default BillingNoticePDF;

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
