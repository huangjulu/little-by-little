import { cn } from "@/lib/utils";
import Badge from "@/ui/badge";

import { paymentBadgeVariant, paymentStatusLabel } from "../constants";
import type { PaymentStatus } from "../types";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  nextBillingDate?: string;
  paymentDeadline?: string;
  className?: string;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = (props) => {
  const isOverdue =
    props.status === "up_to_date" && isPastDeadline(props.paymentDeadline);
  const isDueSoon =
    !isOverdue &&
    props.status === "up_to_date" &&
    isNextMonth(props.nextBillingDate);

  const label = isOverdue
    ? "逾期"
    : isDueSoon
    ? "待繳"
    : paymentStatusLabel[props.status];
  const variant = isOverdue
    ? "alert"
    : isDueSoon
    ? "warning"
    : paymentBadgeVariant[props.status];

  return (
    <Badge
      variant={variant}
      size="sm"
      className={cn("px-2.5 py-1 text-[0.625rem]", props.className)}
    >
      {label}
    </Badge>
  );
};

PaymentStatusBadge.displayName = "PaymentStatusBadge";

export default PaymentStatusBadge;

function isPastDeadline(dateString?: string): boolean {
  if (!dateString) return false;
  const deadline = new Date(dateString);
  if (isNaN(deadline.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return deadline < today;
}

function isNextMonth(dateString?: string): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const monthAfter = new Date(now.getFullYear(), now.getMonth() + 2, 1);
  return date >= nextMonth && date < monthAfter;
}
