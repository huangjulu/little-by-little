import * as React from "react";
import { CurrencyDisplay } from "../atoms";
import { cn } from "@/lib/utils";

interface OrderItemRowProps {
  name: string;
  quantity: number;
  price: number;
  className?: string;
}

/**
 * OrderItemRow - 訂單項目行分子組件
 */
export const OrderItemRow: React.FC<OrderItemRowProps> = (props) => {
  const { name, quantity, price, className } = props;

  const subtotal = price * quantity;

  return (
    <div
      className={cn(
        "flex items-center justify-between text-[11px] text-gray-600",
        className
      )}
    >
      <div className="flex flex-col">
        <span className="font-medium text-gray-700">{name}</span>
        <span className="text-[10px] text-gray-400">數量 × {quantity}</span>
      </div>
      <CurrencyDisplay value={subtotal} variant="mono" />
    </div>
  );
};

OrderItemRow.displayName = "OrderItemRow";
