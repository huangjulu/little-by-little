import type { OrderStatus, PaymentStatus, StatusFilterOption } from "./types";

export const statusLabel: Record<OrderStatus, string> = {
  active: "啟用中",
  inactive: "已停用",
};

export const statusChipStyle: Record<OrderStatus, string> = {
  active: "bg-green-100 text-green-800 ring-green-200",
  inactive: "bg-gray-100 text-gray-500 ring-gray-200",
};

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  up_to_date: "正常繳費",
  invoiced: "已出帳",
  overdue: "逾期未繳",
};

export const paymentStatusChipStyle: Record<PaymentStatus, string> = {
  up_to_date: "bg-blue-100 text-blue-800 ring-blue-200",
  invoiced: "bg-amber-100 text-amber-800 ring-amber-200",
  overdue: "bg-red-100 text-red-800 ring-red-200",
};

export const statusFilterOptions: StatusFilterOption[] = [
  { value: "all", label: "全部" },
  { value: "active", label: "啟用中" },
  { value: "inactive", label: "已停用" },
];
