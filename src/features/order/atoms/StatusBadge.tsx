import * as React from "react";
import { Badge } from "@/ui/badge";
import { statusLabel, statusChipStyle } from "../constants";
import type { OrderStatus } from "../order-types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

/**
 * StatusBadge - 訂單狀態標籤原子組件
 */
export const StatusBadge: React.FC<StatusBadgeProps> = (props) => {
  const { status, className } = props;

  return (
    <Badge
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[10px] font-medium ring-1",
        statusChipStyle[status],
        className
      )}
    >
      {statusLabel[status]}
    </Badge>
  );
};

StatusBadge.displayName = "StatusBadge";
