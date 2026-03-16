import { cn } from "@/lib/utils";
import Badge from "@/ui/badge";

import { statusBadgeVariant, statusLabel } from "../constants";
import type { OrderStatus } from "../types";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

/**
 * StatusBadge - 訂單狀態標籤原子組件
 */
const StatusBadge: React.FC<StatusBadgeProps> = (props) => {
  const { status, className } = props;

  return (
    <Badge
      variant={statusBadgeVariant[status]}
      size="sm"
      className={cn("px-2.5 py-1 text-[0.625rem]", className)}
    >
      {statusLabel[status]}
    </Badge>
  );
};

StatusBadge.displayName = "StatusBadge";

export default StatusBadge;
