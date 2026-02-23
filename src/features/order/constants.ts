import type { OrderStatus, StatusFilterOption } from "./order-types";

export const statusLabel: Record<OrderStatus, string> = {
  active: "啟用中",
  inactive: "已停用",
};

export const statusChipStyle: Record<OrderStatus, string> = {
  active: "bg-green-100 text-green-800 ring-green-200",
  inactive: "bg-gray-100 text-gray-500 ring-gray-200",
};

export const statusFilterOptions: StatusFilterOption[] = [
  { value: "all", label: "全部" },
  { value: "active", label: "啟用中" },
  { value: "inactive", label: "已停用" },
];
