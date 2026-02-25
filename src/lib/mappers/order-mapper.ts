import type {
  Order,
  OrderStatus,
  CustomerInfoData,
} from "@/features/order/order-types";

export interface CustomerRow {
  id: number;
  customer_info: CustomerInfoData;
  order_id: number;
  order_status: string;
  created_at: string;
  orders: {
    id: number;
    base_price: number;
    current_price: number;
    contract_start_date: string;
    contract_end_date: string;
    payment_deadline: string;
    next_billing_date: string;
    created_at: string;
  };
}

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
  const info = row.customer_info ?? emptyCustomerInfo;
  const order = row.orders;
  return {
    id: String(row.id),
    orderId: row.order_id,
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
