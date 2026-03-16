import { cn } from "@/lib/utils";
import Badge from "@/ui/badge";

import { statusChipStyle, statusLabel } from "../constants";
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
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[0.625rem] font-medium ring-1",
        statusChipStyle[status],
        className
      )}
    >
      {statusLabel[status]}
    </Badge>
  );
};

StatusBadge.displayName = "StatusBadge";

export default StatusBadge;
