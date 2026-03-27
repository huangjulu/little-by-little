import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { readFileSync } from "fs";
import path from "path";

import "./utils/pdf-font";

import {
  formatBillingPeriod,
  formatMinguoDate,
  formatNoticeAmount,
  formatNoticeTitleDate,
} from "@/lib/formatters";

import type { Order } from "../types";
import { ATM_BANK_CODE, ATM_BANK_NAME, PDF_FONT_FAMILY } from "./constants";
import { computeAtmAmount, hasPromotion } from "./utils/billing-notice";

// ─── 圖片（base64 data URI，確保 @react-pdf/renderer 能正確嵌入）─────────────────
const imgDir = path.join(process.cwd(), "public", "billing");

const IMG_STAMP = loadImage(path.join(imgDir, "stamp.jpg"));
const IMG_CARD_LEFT = loadImage(path.join(imgDir, "card_left.png"));
const IMG_CARD_RIGHT = loadImage(path.join(imgDir, "card_right.png"));
const IMG_BOTTOM_LEFT = loadImage(path.join(imgDir, "bottom_left.png"));
const IMG_BOTTOM_RIGHT = loadImage(path.join(imgDir, "bottom_right.png"));

// ─── Styles ─────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: PDF_FONT_FAMILY,
    fontSize: 9,
    padding: "8mm 12mm",
    color: "#1e1e1e",
  },

  // 頂部：公司資訊 + 郵戳
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 2,
  },
  companyDetail: {
    fontSize: 8,
    color: "#555",
    marginBottom: 1,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  stamp: {
    width: 56,
    height: 56,
    marginBottom: 4,
  },
  printedMatter: {
    fontSize: 12,
    fontWeight: 700,
    border: "1px solid #333",
    padding: "2px 10px",
    marginBottom: 8,
  },
  mailingTag: {
    fontSize: 8,
    color: "#c00",
    fontWeight: 700,
    textAlign: "right",
    marginBottom: 1,
  },
  billTag: {
    fontSize: 9,
    fontWeight: 700,
    border: "1px solid #c00",
    color: "#c00",
    padding: "1px 6px",
    marginTop: 2,
  },

  // 分隔線
  divider: {
    borderBottom: "1.5px solid #333",
    marginVertical: 6,
  },
  dividerLight: {
    borderBottom: "1px solid #ccc",
    marginVertical: 6,
  },

  // 標題
  title: {
    fontSize: 14,
    fontWeight: 700,
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: 2,
  },
  date: {
    fontSize: 8,
    textAlign: "center",
    color: "#666",
    marginBottom: 8,
  },

  // 表格
  table: {
    width: "100%",
    marginBottom: 6,
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
    width: "18%",
    padding: "3px 5px",
    fontSize: 8,
    fontWeight: 700,
    backgroundColor: "#f7f7f7",
    borderRight: "1px solid #999",
  },
  valueCell: {
    width: "32%",
    padding: "3px 5px",
    fontSize: 8,
    borderRight: "1px solid #999",
  },
  headerCell: {
    flex: 1,
    padding: "2px 4px",
    fontSize: 7,
    fontWeight: 700,
    textAlign: "center",
    borderRight: "1px solid #999",
  },
  dataCell: {
    flex: 1,
    padding: "2px 4px",
    fontSize: 8,
    textAlign: "center",
    borderRight: "1px solid #999",
  },
  amountCell: {
    flex: 1,
    padding: "2px 4px",
    fontSize: 8,
    textAlign: "right",
    fontWeight: 700,
    borderRight: "1px solid #999",
  },
  outerBorder: {
    border: "1px solid #999",
  },

  // 區塊
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    marginTop: 6,
    marginBottom: 4,
    borderBottom: "1.5px solid #333",
    paddingBottom: 1,
  },
  note: {
    fontSize: 7,
    color: "#888",
    marginTop: 2,
  },
  adjustSection: {
    fontSize: 8,
    color: "#555",
    marginBottom: 4,
  },
  promoIntro: {
    fontSize: 8,
    marginBottom: 4,
  },
  promoNote: {
    fontSize: 7,
    color: "#555",
    marginTop: 2,
    marginBottom: 4,
  },

  // 頁尾
  footer: {
    marginTop: 4,
    paddingTop: 4,
    borderTop: "1px solid #ccc",
    fontSize: 8,
  },
  footerLine: {
    marginBottom: 1,
  },
  footerBold: {
    fontWeight: 700,
  },
  overdue: {
    color: "#c00",
    fontWeight: 700,
    marginTop: 3,
    fontSize: 7,
  },
  monoText: {
    fontFamily: "Courier",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
  },

  // 名片 + 底部圖片區
  cardSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cardColumn: {
    width: "48%",
  },
  cardImage: {
    width: 120,
    objectFit: "contain",
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomImageWrapper: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#999",
    borderStyle: "solid",
    padding: 2,
  },
  bottomImage: {
    width: "100%",
  },
});

// ─── Component ──────────────────────────────────────────────────────────────────

const BillingNoticePDF: React.FC<BillingNoticePDFProps> = (props) => {
  const today = new Date();

  return (
    <Document>
      {props.orders.map((order) => (
        <Page key={order.id} size="A4" style={s.page}>
          {/* ══ 頂部：公司資訊 + 郵戳 + 郵件字樣 ══ */}
          <View style={s.header}>
            <View style={s.companyInfo}>
              <Text style={s.companyName}>力網(京網)寬頻</Text>
              <Text style={s.companyDetail}>社區寬頻</Text>
              <Text style={s.companyDetail}>30259 竹北市建國街31號4F</Text>
              <Text style={s.companyDetail}>
                服務專線：0921-095080 / 0963-162080
              </Text>
              <Text style={s.companyDetail}>
                電子郵件：amber@powernet.com.tw
              </Text>
            </View>
            <View style={s.headerRight}>
              <Image style={s.stamp} src={IMG_STAMP} />
              <Text style={s.printedMatter}>印 刷 品</Text>
              <Text style={s.mailingTag}>本件有時間性</Text>
              <Text style={s.mailingTag}>請提前拆閱</Text>
              <Text style={s.billTag}>網路費帳單</Text>
            </View>
          </View>

          {/* ══ 分隔線 ══ */}
          <View style={s.divider} />

          {/* ══ 繳費通知標題 ══ */}
          <Text style={s.title}>服務費 繳費通知</Text>
          <Text style={s.date}>{formatNoticeTitleDate(today)}</Text>

          {/* ══ 客戶資訊 ══ */}
          <View style={[s.table, s.outerBorder]}>
            <View style={s.tableRow}>
              <Text style={s.labelCell}>社區名稱</Text>
              <Text style={s.valueCell}>{order.communityName || "—"} 社區</Text>
              <Text style={s.labelCell}>姓名</Text>
              <Text style={s.valueCell}>{order.customerName || "—"}</Text>
            </View>
            <View style={[s.tableRow, { borderBottom: "none" }]}>
              <Text style={s.labelCell}>戶別</Text>
              <Text style={s.valueCell}>{order.houseUnit || "—"}</Text>
              <Text style={s.labelCell}>地址</Text>
              <Text style={s.valueCell}>{order.address || "—"}</Text>
            </View>
          </View>

          {/* ══ 收費明細 ══ */}
          <View style={[s.table, s.outerBorder]}>
            <View style={s.tableHeaderRow}>
              <Text style={s.headerCell}>計費區間</Text>
              <Text style={s.headerCell}>速率</Text>
              <Text style={s.headerCell}>繳費方案</Text>
              <Text style={s.headerCell}>應繳金額</Text>
              <Text style={s.headerCell}>ATM 轉帳金額</Text>
              <Text style={s.headerCell}>繳費期限</Text>
            </View>
            <View style={[s.tableRow, { borderBottom: "none" }]}>
              <Text style={s.dataCell}>
                {formatBillingPeriod(
                  order.contractStartDate,
                  order.contractEndDate
                )}
              </Text>
              <Text style={s.dataCell}>{order.speed || "—"}</Text>
              <Text style={s.dataCell}>{order.billingPlan || "—"}</Text>
              <Text style={s.amountCell}>
                {formatNoticeAmount(order.currentPrice)}
              </Text>
              <Text style={s.amountCell}>
                {formatNoticeAmount(computeAtmAmount(order))}
              </Text>
              <Text style={s.dataCell}>
                {order.paymentDeadline
                  ? formatMinguoDate(new Date(order.paymentDeadline))
                  : "—"}
              </Text>
            </View>
          </View>

          {/* ══ ATM 轉帳資訊 ══ */}
          <Text style={s.sectionTitle}>ATM 轉帳資訊</Text>
          <View style={[s.table, s.outerBorder]}>
            <View style={s.tableRow}>
              <Text style={s.labelCell}>銀行代碼</Text>
              <Text style={s.valueCell}>
                {ATM_BANK_CODE}（{ATM_BANK_NAME}）
              </Text>
            </View>
            <View style={[s.tableRow, { borderBottom: "none" }]}>
              <Text style={s.labelCell}>轉入帳號{"\n"}（個人獨立帳號）</Text>
              <Text style={s.valueCell}>
                <Text style={s.monoText}>{order.atmAccountNumber || "—"}</Text>
              </Text>
            </View>
          </View>
          <Text style={s.note}>以上金額未含營業稅</Text>

          {/* ══ 帳務調整說明 ══ */}
          <View style={s.adjustSection}>
            <Text>
              客戶帳務調整：為了簡化帳務系統，自115年1月開始將下期繳費日整合到每月1日、11日、21日，本期金額可能會有畸零天數的差額費用，也謝謝您的配合。
            </Text>
            {order.deposit > 0 && (
              <Text>　押金扣抵：{formatNoticeAmount(order.deposit)}</Text>
            )}
            {order.priceDifference !== 0 && (
              <Text>
                　價差調整：{formatNoticeAmount(order.priceDifference)}
              </Text>
            )}
          </View>

          {/* ══ 優惠方案 ══ */}
          {hasPromotion(order) && (
            <View>
              <Text style={s.sectionTitle}>優惠方案</Text>
              <Text style={s.promoIntro}>
                您所使用的網路頻寬為 {order.speed || "—"}
                ，歡迎採用最優惠的繳費方案：
              </Text>
              <View style={[s.table, s.outerBorder]}>
                <View style={s.tableHeaderRow}>
                  <Text style={s.headerCell}>方案</Text>
                  <Text style={s.headerCell}>費用</Text>
                  <Text style={s.headerCell}>加送月數</Text>
                </View>
                {order.yearlyFee != null && (
                  <View style={s.tableRow}>
                    <Text style={s.dataCell}>1年繳</Text>
                    <Text style={s.amountCell}>
                      {formatNoticeAmount(order.yearlyFee)}
                    </Text>
                    <Text style={s.dataCell}>
                      {order.yearlyBonusMonths != null
                        ? `加送 ${order.yearlyBonusMonths} 個月`
                        : "—"}
                    </Text>
                  </View>
                )}
                {order.twoYearFee != null && (
                  <View style={[s.tableRow, { borderBottom: "none" }]}>
                    <Text style={s.dataCell}>2年繳</Text>
                    <Text style={s.amountCell}>
                      {formatNoticeAmount(order.twoYearFee)}
                    </Text>
                    <Text style={s.dataCell}>
                      {order.twoYearBonusMonths != null
                        ? `加送 ${order.twoYearBonusMonths} 個月`
                        : "—"}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={s.promoNote}>
                請依如上帳號直接轉入即可，請注意～須匯足額始享有如上優惠。
              </Text>
            </View>
          )}

          {/* ══ 繳費方式 + 逾期說明 ══ */}
          <View style={s.footer}>
            <Text style={s.footerLine}>
              <Text style={s.footerBold}>繳費方式：</Text>
              請您於全省ATM（提款機）或網路銀行轉帳完成繳款即可，銀行代號：
              {ATM_BANK_CODE}({ATM_BANK_NAME}
              )，轉入帳號（個人獨立帳號共14碼，如上），用戶不需再來電通知已繳款。
            </Text>
            <Text style={s.overdue}>
              逾期繳款：系統將於寬限期後自動停止網路服務，無法如期繳費者請主動與我們連絡，謝謝。
            </Text>
          </View>

          {/* ══ 分隔線 ══ */}
          <View style={s.divider} />

          {/* ══ 名片區：image_2 + image_4 並排（對齊底部 image_6 + image_7） ══ */}
          <View style={s.cardSection}>
            <View style={s.cardColumn}>
              <Image style={s.cardImage} src={IMG_CARD_LEFT} />
            </View>
            <View style={s.cardColumn}>
              <Image style={s.cardImage} src={IMG_CARD_RIGHT} />
            </View>
          </View>

          {/* ══ 底部圖片：image_6 + image_7 ══ */}
          <View style={s.bottomSection}>
            <View style={s.bottomImageWrapper}>
              <Image style={s.bottomImage} src={IMG_BOTTOM_LEFT} />
            </View>
            <View style={s.bottomImageWrapper}>
              <Image style={s.bottomImage} src={IMG_BOTTOM_RIGHT} />
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

// Types
interface BillingNoticePDFProps {
  orders: Order[];
}

BillingNoticePDF.displayName = "BillingNoticePDF";

export default BillingNoticePDF;

// Helpers
function loadImage(filePath: string): string {
  const ext =
    filePath.endsWith(".jpg") || filePath.endsWith(".jpeg") ? "jpeg" : "png";
  const buf = readFileSync(filePath);
  return `data:image/${ext};base64,${buf.toString("base64")}`;
}
