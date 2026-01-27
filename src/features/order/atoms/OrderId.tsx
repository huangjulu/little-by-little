import * as React from "react";
import { cn } from "@/lib/utils";

interface OrderIdProps {
  id: string;
  className?: string;
}

/**
 * OrderId - 訂單編號原子組件
 */
export const OrderId: React.FC<OrderIdProps> = (props) => {
  return (
    <span
      className={cn("font-mono text-[11px] text-gray-700", props.className)}
    >
      {props.id}
    </span>
  );
};

OrderId.displayName = "OrderId";
