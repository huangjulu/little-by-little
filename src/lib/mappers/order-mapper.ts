import type { Tables } from "@/types/database";
import type {
  Order,
  OrderStatus,
  CustomerInfoData,
} from "@/features/order/types";

/** JOIN 查詢結果：customers + orders（對應 Supabase .select("*, orders!inner(*)")） */
export type CustomerRow = Tables<"customers"> & {
  orders: Tables<"orders">;
};

const emptyCustomerInfo: CustomerInfoData = {
  customer_name: "",
  mobile_phone: "",
  community_name: "",
  house_unit: "",
};

function isOrderStatus(value: string): value is OrderStatus {
  return value === "active" || value === "inactive";
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
    basePrice: Number(order?.base_price ?? 0),
    currentPrice: Number(order?.current_price ?? 0),
    contractStartDate: order?.contract_start_date ?? "",
    contractEndDate: order?.contract_end_date ?? "",
    paymentDeadline: order?.payment_deadline ?? "",
    nextBillingDate: order?.next_billing_date ?? "",
    createdAt: row.created_at ?? "",
    status: isOrderStatus(row.order_status) ? row.order_status : "inactive",
  };
}
