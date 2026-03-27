import { cn } from "@/lib/utils";
import Badge from "@/ui/badge";

import { isNextMonthBilling } from "../billing/utils/billing-filter";
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
    isNextMonthBilling(props.nextBillingDate);

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
