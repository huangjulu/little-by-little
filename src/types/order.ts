export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";
export type StatusFilterValue = "all" | OrderStatus;

export type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  customerName: string;
  email: string;
  createdAt: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
};

export type StatusFilterOption = {
  value: StatusFilterValue;
  label: string;
};
