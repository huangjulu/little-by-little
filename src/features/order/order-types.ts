export type OrderStatus = "active" | "inactive";
export type StatusFilterValue = "all" | OrderStatus;

export type CustomerInfoData = {
  customer_name: string;
  mobile_phone: string;
  community_name: string;
  house_unit: string;
};

export type Order = {
  id: string;
  orderId: number;
  customerName: string;
  mobilePhone: string;
  communityName: string;
  houseUnit: string;
  basePrice: number;
  currentPrice: number;
  contractStartDate: string;
  contractEndDate: string;
  paymentDeadline: string;
  nextBillingDate: string;
  createdAt: string;
  status: OrderStatus;
};

export type StatusFilterOption = {
  value: StatusFilterValue;
  label: string;
};
