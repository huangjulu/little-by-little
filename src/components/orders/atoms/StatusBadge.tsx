import * as React from "react";
import { BaseBadge } from "@/components/base";
import { statusLabel, statusChipStyle } from "@/lib/constants";
import type { OrderStatus } from "@/types/order";
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
    <BaseBadge
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[10px] font-medium ring-1",
        statusChipStyle[status],
        className
      )}
    >
      {statusLabel[status]}
    </BaseBadge>
  );
};

StatusBadge.displayName = "StatusBadge";
