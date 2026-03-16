import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

import StatusBadge from "../atoms/StatusBadge";
import type { Order } from "../types";

interface OrderRowProps {
  order: Order;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  billingMode?: boolean;
  checked?: boolean;
  onToggleCheck?: () => void;
}

/**
 * OrderRow - 訂單列表行分子組件
 */
const OrderRow: React.FC<OrderRowProps> = (props) => {
  const { order, isSelected = false, onClick, className } = props;

  return (
    <tr
      onClick={onClick}
      className={cn(
        "cursor-pointer border-b border-gray-100 align-middle text-xs transition-colors hover:bg-gray-50",
        "*:p-3",
        isSelected ? "bg-gray-100/80" : "bg-white",
        className
      )}
    >
      {props.billingMode && (
        <td>
          <input
            type="checkbox"
            checked={props.checked ?? false}
            onChange={(e) => {
              e.stopPropagation();
              props.onToggleCheck?.();
            }}
            onClick={(e) => e.stopPropagation()}
            className="h-4 w-4 rounded border-gray-300 accent-green-600"
          />
        </td>
      )}
      <td>
        <span className="font-mono text-[0.6875rem] text-gray-700">
          {order.id}
        </span>
      </td>
      <td>
        <CustomerInfo
          name={order.customerName}
          mobilePhone={order.mobilePhone}
        />
      </td>
      <td>
        <span className="text-xs text-gray-500">
          {formatDate(order.createdAt)}
        </span>
      </td>
      <td>
        <span className="text-xs">{formatCurrency(order.currentPrice)}</span>
      </td>
      <td>
        <StatusBadge status={order.status} />
      </td>
    </tr>
  );
};

OrderRow.displayName = "OrderRow";

export default OrderRow;

interface CustomerInfoProps {
  name: string;
  mobilePhone: string;
  className?: string;
}

const CustomerInfo: React.FC<CustomerInfoProps> = (props) => {
  return (
    <div className={cn("flex flex-col", props.className)}>
      <span className="text-xs font-medium">{props.name}</span>
      <span className="truncate text-[0.6875rem] text-gray-400">
        {props.mobilePhone}
      </span>
    </div>
  );
};

CustomerInfo.displayName = "CustomerInfo";
