import type {
  CustomerInfoData,
  Order,
  OrderStatus,
  PaymentStatus,
} from "@/features/order/types";
import type { Tables } from "@/types/database";

/** JOIN 查詢結果：customers + orders（對應 Supabase .select("*, orders!inner(*)")） */
export type CustomerRow = Tables<"customers"> & {
  orders: Tables<"orders">;
};

const emptyCustomerInfo: CustomerInfoData = {
  customer_name: "",
  mobile_phone: "",
  community_name: "",
  house_unit: "",
  address: "",
};

export function isOrderStatus(value: unknown): value is OrderStatus {
  return value === "active" || value === "inactive";
}

export function isPaymentStatus(value: unknown): value is PaymentStatus {
  return (
    value === "up_to_date" ||
    value === "waiting_for_payment" ||
    value === "overdue"
  );
}

export function mapToOrder(row: CustomerRow): Order {
  const info = (row.customer_info ?? emptyCustomerInfo) as CustomerInfoData;
  const order = row.orders;
  return {
    id: String(row.id),
    orderId: row.order_id ?? 0,
    customerName: info.customer_name ?? "",
    mobilePhone: info.mobile_phone ?? "",
    communityName: info.community_name ?? "",
    houseUnit: info.house_unit ?? "",
    address: info.address ?? "",
    basePrice: Number(order?.base_price ?? 0),
    currentPrice: Number(order?.current_price ?? 0),
    contractStartDate: order?.contract_start_date ?? "",
    contractEndDate: order?.contract_end_date ?? "",
    paymentDeadline: order?.payment_deadline ?? "",
    nextBillingDate: order?.next_billing_date ?? "",
    createdAt: row.created_at ?? "",
    status: isOrderStatus(row.order_status) ? row.order_status : "inactive",
    paymentStatus: isPaymentStatus(row.payment_status)
      ? row.payment_status
      : "up_to_date",
    speed: order?.speed ?? "",
    billingPlan: order?.billing_plan ?? "",
    atmAccountNumber: order?.atm_account_number ?? "",
    projectCode: order?.project_code ?? "",
    deposit: Number(order?.deposit ?? 0),
    priceDifference: Number(order?.price_difference ?? 0),
    yearlyFee: order?.yearly_fee ?? null,
    yearlyBonusMonths: order?.yearly_bonus_months ?? null,
    twoYearFee: order?.two_year_fee ?? null,
    twoYearBonusMonths: order?.two_year_bonus_months ?? null,
    lastNoticeDownloadedAt:
      ((row as Record<string, unknown>).last_notice_downloaded_at as
        | string
        | null) ?? null,
  };
}
