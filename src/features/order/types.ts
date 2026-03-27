// ─── Domain Types ─────────────────────────────────────────────────────────────

export type OrderStatus = "active" | "inactive";
export type PaymentStatus = "up_to_date" | "waiting_for_payment" | "overdue";
export type StatusFilterValue = "all" | OrderStatus;

export type CustomerInfoData = {
  customer_name: string;
  mobile_phone: string;
  community_name: string;
  house_unit: string;
  address: string;
};

export type Order = {
  id: string;
  orderId: number;
  customerName: string;
  mobilePhone: string;
  communityName: string;
  houseUnit: string;
  address: string;
  basePrice: number;
  currentPrice: number;
  contractStartDate: string;
  contractEndDate: string;
  paymentDeadline: string;
  nextBillingDate: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  speed: string;
  billingPlan: string;
  atmAccountNumber: string;
  projectCode: string;
  deposit: number;
  priceDifference: number;
  yearlyFee: number | null;
  yearlyBonusMonths: number | null;
  twoYearFee: number | null;
  twoYearBonusMonths: number | null;
  lastNoticeDownloadedAt: string | null;
};

export type StatusFilterOption = {
  value: StatusFilterValue;
  label: string;
};

export type StatusCounts = Record<StatusFilterValue, number>;

// ─── API 介面型別（前後端共用） ──────────────────────────────────────────────

export interface GetOrdersParams {
  status?: StatusFilterValue;
  billing?: "next-month" | "overdue";
  keyword?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateOrderParams {
  customerName: string;
  mobilePhone: string;
  communityName?: string;
  houseUnit?: string;
  basePrice?: number;
  currentPrice?: number;
  contractStartDate?: string;
  contractEndDate?: string;
  paymentDeadline?: string;
  nextBillingDate?: string;
}

export interface UpdateOrderStatusParams {
  status: OrderStatus;
}
