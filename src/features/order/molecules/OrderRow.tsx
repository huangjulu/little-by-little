import { Check, Printer } from "lucide-react";
import { memo, useCallback } from "react";

import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

import StatusBadge from "../atoms/StatusBadge";
import type { PaymentStatus } from "../types";
import type { Order } from "../types";

interface OrderRowProps {
  order: Order;
  isSelected?: boolean;
  onOrderClick?: (id: string) => void;
  className?: string;
  billingMode?: boolean;
  checked?: boolean;
  onToggleCheck?: (id: string) => void;
  onPrint?: (id: string) => void;
  onMarkPaid?: (id: string) => void;
  isPrinted?: boolean;
}

/**
 * OrderRow - 訂單列表行分子組件
 */
const OrderRow: React.FC<OrderRowProps> = memo((props) => {
  const { order, isSelected = false, className } = props;
  const { onOrderClick, onToggleCheck, onPrint, onMarkPaid } = props;

  const handleClick = useCallback(() => {
    onOrderClick?.(order.id);
  }, [onOrderClick, order.id]);

  const handleToggleCheck = useCallback(() => {
    onToggleCheck?.(order.id);
  }, [onToggleCheck, order.id]);

  const handlePrint = useCallback(() => {
    onPrint?.(order.id);
  }, [onPrint, order.id]);

  const handleMarkPaid = useCallback(() => {
    onMarkPaid?.(order.id);
  }, [onMarkPaid, order.id]);

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
          props.billingMode
            ? "w-10 max-w-10 opacity-100 p-3"
            : "w-0 max-w-0 opacity-0 p-0 border-0"
        )}
      >
        <input
          type="checkbox"
          checked={props.checked ?? false}
          onChange={(e) => {
            e.stopPropagation();
            handleToggleCheck();
          }}
          onClick={(e) => e.stopPropagation()}
          className="h-4 w-4 rounded border-gray-300 accent-blue-500"
          tabIndex={props.billingMode ? 0 : -1}
        />
      </td>
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
      <span className="text-xs font-medium">{props.name}</span>
      <span className="truncate text-[0.6875rem] text-gray-400">
        {props.mobilePhone}
      </span>
    </div>
  );
};

CustomerInfo.displayName = "CustomerInfo";

// Sub-components

const BillingButton: React.FC<{
  paymentStatus: PaymentStatus;
  isPrinted?: boolean;
  billingMode?: boolean;
  onPrint: () => void;
  onMarkPaid: () => void;
}> = (props) => {
  const tabIndex = props.billingMode ? 0 : -1;
  const btnClass =
    "inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 whitespace-nowrap transition-colors hover:bg-gray-50";

  // 剛列印（當次 session 過渡態）
  if (
    props.isPrinted ||
    (props.paymentStatus === "up_to_date" && props.isPrinted)
  ) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-400 whitespace-nowrap">
        <Check className="size-3" />
        已列印
      </span>
    );
  }

  // 已出帳（從 DB 來，第二次進入）→ 「已付款」可點擊
  if (props.paymentStatus === "invoiced") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          props.onMarkPaid();
        }}
        className={btnClass}
        tabIndex={tabIndex}
      >
        <Check className="size-3" />
        已付款
      </button>
    );
  }

  // up_to_date 且未列印 → 「列印」
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        props.onPrint();
      }}
      className={btnClass}
      tabIndex={tabIndex}
    >
      <Printer className="size-3" />
      列印
    </button>
  );
};

BillingButton.displayName = "BillingButton";

// Helpers
function isPastDeadline(dateString: string): boolean {
  if (!dateString) return false;
  const deadline = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return deadline < today;
}
