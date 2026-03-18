import Badge from "@/ui/badge";

import type { OrderStatus, PaymentStatus, StatusFilterOption } from "./types";

type BadgeVariant = NonNullable<React.ComponentProps<typeof Badge>["variant"]>;

export const statusLabel: Record<OrderStatus, string> = {
  active: "啟用中",
  inactive: "已停用",
};

export const statusBadgeVariant: Record<OrderStatus, BadgeVariant> = {
  active: "success",
  inactive: "default",
};

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  up_to_date: "正常",
  waiting_for_payment: "已通知",
  overdue: "逾期",
};

export const paymentBadgeVariant: Record<PaymentStatus, BadgeVariant> = {
  up_to_date: "info",
  waiting_for_payment: "warning",
  overdue: "alert",
};

export const statusFilterOptions: StatusFilterOption[] = [
  { value: "all", label: "全部" },
  { value: "active", label: "啟用中" },
  { value: "inactive", label: "已停用" },
];
