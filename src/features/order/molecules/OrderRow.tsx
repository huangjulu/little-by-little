import { memo, useCallback } from "react";

import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

import PaymentStatusBadge from "../atoms/PaymentStatusBadge";
import StatusBadge from "../atoms/StatusBadge";
import type { Order } from "../types";

interface OrderRowProps {
  order: Order;
  isSelected?: boolean;
  onOrderClick?: (id: string) => void;
  className?: string;
  checkbox?: {
    checked: boolean;
    onToggle: (id: string) => void;
  };
}

/**
 * OrderRow - 訂單列表行分子組件
 */
const OrderRow: React.FC<OrderRowProps> = memo((props) => {
  const { order, isSelected = false, className } = props;
  const { onOrderClick } = props;

  const handleClick = useCallback(() => {
    onOrderClick?.(order.id);
  }, [onOrderClick, order.id]);

  const handleToggleCheck = useCallback(() => {
    props.checkbox?.onToggle(order.id);
  }, [props.checkbox, order.id]);

  return (
    <tr
      onClick={handleClick}
      className={cn(
        "cursor-pointer border-b border-gray-100 align-middle text-xs transition-colors hover:bg-gray-50",
        "*:p-3",
        isSelected ? "bg-gray-100/80" : "bg-white",
        className
      )}
    >
      <td
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          props.checkbox
            ? "w-10 max-w-10 opacity-100 p-3"
            : "w-0 max-w-0 opacity-0 p-0 border-0"
        )}
      >
        <input
          type="checkbox"
          checked={props.checkbox?.checked ?? false}
          onChange={(e) => {
            e.stopPropagation();
            handleToggleCheck();
          }}
          onClick={(e) => e.stopPropagation()}
          className="h-4 w-4 rounded border-gray-300 accent-blue-500"
          tabIndex={props.checkbox ? 0 : -1}
        />
      </td>
      <td>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-700">
            {order.communityName || "-"}
          </span>
          <span className="text-[0.6875rem] text-gray-400">
            {order.houseUnit || "-"}
          </span>
        </div>
      </td>
      <td>
        <span className="font-mono text-[0.6875rem] text-gray-700">
          {order.atmAccountNumber || "-"}
        </span>
      </td>
      <td>
        <CustomerInfo
          name={order.customerName}
          mobilePhone={order.mobilePhone}
        />
      </td>
      <td>
        <div className="flex flex-col">
          <span className="text-xs text-gray-700">
            {formatDate(order.contractStartDate)}
          </span>
          <span className="text-[0.6875rem] text-gray-400">
            – {formatDate(order.contractEndDate)}
          </span>
        </div>
      </td>
      <td>
        <span
          className={cn(
            "text-xs",
            isPastDeadline(order.paymentDeadline)
              ? "font-medium text-red-600"
              : "text-gray-500"
          )}
        >
          {formatDate(order.paymentDeadline)}
        </span>
      </td>
      <td>
        <span className="text-xs">{formatCurrency(order.currentPrice)}</span>
      </td>
      <td>
        <StatusBadge status={order.status} />
      </td>
      <td>
        <PaymentStatusBadge
          status={order.paymentStatus}
          nextBillingDate={order.nextBillingDate}
          paymentDeadline={order.paymentDeadline}
        />
      </td>
      <td
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          "w-0 max-w-0 opacity-0 p-0 border-0"
        )}
      />
    </tr>
  );
});

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
      <span className="text-xs font-medium">{props.name || "-"}</span>
      <span className="truncate text-[0.6875rem] text-gray-400">
        {props.mobilePhone || "-"}
      </span>
    </div>
  );
};

CustomerInfo.displayName = "CustomerInfo";

// Helpers
function isPastDeadline(dateString: string): boolean {
  if (!dateString) return false;
  const deadline = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return deadline < today;
}
