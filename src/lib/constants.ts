import type { OrderStatus, StatusFilterOption } from "@/types/order";

export const statusLabel: Record<OrderStatus, string> = {
  pending: "待付款",
  paid: "已付款",
  shipped: "已出貨",
  cancelled: "已取消",
};

export const statusChipStyle: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 ring-yellow-200",
  paid: "bg-green-100 text-green-800 ring-green-200",
  shipped: "bg-blue-100 text-blue-800 ring-blue-200",
  cancelled: "bg-gray-100 text-gray-500 ring-gray-200 line-through",
};

export const statusFilterOptions: StatusFilterOption[] = [
  { value: "all", label: "全部訂單" },
  { value: "shipped", label: "運行中" },
  { value: "paid", label: "已付款" },
  { value: "pending", label: "待付款" },
];
