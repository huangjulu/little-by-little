"use client";

import { useCallback } from "react";

import {
  paymentBadgeVariant,
  paymentStatusLabel,
} from "@/features/order/constants";
import type { Order } from "@/features/order/types";
import Badge from "@/ui/badge";

const PaymentCard: React.FC<PaymentCardProps> = (props) => {
  const { onToggle, onConfirm } = props;
  const orderId = props.order.id;

  const handleToggle = useCallback(
    () => onToggle(orderId),
    [onToggle, orderId]
  );
  const handleConfirm = useCallback(
    () => onConfirm(orderId),
    [onConfirm, orderId]
  );

  return (
    <div
      className={`flex items-center gap-3 rounded-md bg-white px-4 py-3 shadow-md ${
        props.isSelected ? "outline outline-2 outline-blue-500" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={props.isSelected}
        onChange={handleToggle}
        className="size-4 shrink-0 cursor-pointer rounded border-gray-300 accent-blue-600"
      />

      <div className="w-24 shrink-0 font-mono text-xs text-gray-600">
        {props.order.atmAccountNumber}
      </div>

      <div className="w-16 shrink-0">
        <Badge
          variant={paymentBadgeVariant[props.order.paymentStatus]}
          size="sm"
        >
          {paymentStatusLabel[props.order.paymentStatus]}
        </Badge>
      </div>

      <div className="min-w-0 flex-[1.2]">
        <div className="truncate font-medium">{props.order.communityName}</div>
        <div className="truncate text-xs text-gray-500">
          {props.order.houseUnit}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{props.order.customerName}</div>
        <div className="truncate text-xs text-gray-500">
          {props.order.mobilePhone}
        </div>
      </div>

      <div className="flex-1 text-xs text-gray-600">
        {props.order.contractStartDate} ~ {props.order.contractEndDate}
      </div>

      <div
        className={`w-[70px] shrink-0 text-xs ${
          props.isOverdue ? "font-semibold text-red-600" : ""
        }`}
      >
        {props.order.paymentDeadline}
      </div>

      <div className="w-[70px] shrink-0 text-right text-sm font-bold">
        ${props.order.currentPrice.toLocaleString()}
      </div>

      <button
        type="button"
        onClick={handleConfirm}
        disabled={props.isPending}
        className="w-20 shrink-0 rounded-md bg-blue-600 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        確認繳費
      </button>
    </div>
  );
};

// Types
interface PaymentCardProps {
  order: Order;
  isSelected: boolean;
  isPending: boolean;
  onToggle: (id: string) => void;
  onConfirm: (id: string) => void;
  isOverdue: boolean;
}

PaymentCard.displayName = "PaymentCard";
export default PaymentCard;
