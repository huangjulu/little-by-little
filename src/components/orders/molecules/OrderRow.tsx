import * as React from "react";
import {
  StatusBadge,
  OrderId,
  DateDisplay,
  CurrencyDisplay,
  CustomerInfo,
} from "../atoms";
import type { Order } from "@/types/order";
import { cn } from "@/lib/utils";

interface OrderRowProps {
  order: Order;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * OrderRow - 訂單列表行分子組件
 */
export const OrderRow: React.FC<OrderRowProps> = (props) => {
  const { order, isSelected = false, onClick, className } = props;

  return (
    <tr
      onClick={onClick}
      className={cn(
        "cursor-pointer border-b border-gray-100 align-middle text-xs transition-colors hover:bg-gray-100",
        "*:p-3",
        isSelected ? "bg-gray-100/80" : "bg-white",
        className
      )}
    >
      <td>
        <OrderId id={order.id} />
      </td>
      <td>
        <CustomerInfo name={order.customerName} email={order.email} />
      </td>
      <td>
        <DateDisplay dateString={order.createdAt} />
      </td>
      <td>
        <CurrencyDisplay value={order.total} />
      </td>
      <td>
        <StatusBadge status={order.status} />
      </td>
    </tr>
  );
};

OrderRow.displayName = "OrderRow";
