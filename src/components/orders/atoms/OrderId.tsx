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
  const { id, className } = props;

  return (
    <span className={cn("font-mono text-[11px] text-gray-700", className)}>
      {id}
    </span>
  );
};

OrderId.displayName = "OrderId";
