"use client";

import { useCallback, useMemo, useRef } from "react";
import { toast } from "sonner";

import { orderApi } from "../order.api";
import type { Order } from "../types";
import PrintableNotice from "./PrintableNotice";

interface BillingActionBarProps {
  orders: Order[];
  checkedIds: Set<string>;
  onSelectAll: () => void;
}

const BillingActionBar: React.FC<BillingActionBarProps> = (props) => {
  const { orders, checkedIds } = props;
  const printRef = useRef<HTMLDivElement>(null);

  const batchMutation = orderApi.batchUpdateStatus.useMutation();

  const checkedOrders = useMemo(
    () => orders.filter((o) => checkedIds.has(o.id)),
    [orders, checkedIds]
  );

  const upToDateCount = checkedOrders.filter(
    (o) => o.paymentStatus === "up_to_date"
  ).length;
  const invoicedIds = checkedOrders
    .filter((o) => o.paymentStatus === "invoiced")
    .map((o) => o.id);

  const handlePrintAll = useCallback(() => {
    const upToDateIds = checkedOrders
      .filter((o) => o.paymentStatus === "up_to_date")
      .map((o) => o.id);
    if (upToDateIds.length === 0) return;

    window.print();

    batchMutation.mutate(
      { ids: upToDateIds, paymentStatus: "invoiced" },
      {
        onSuccess: () =>
          toast.success(`已列印 ${upToDateIds.length} 筆並標記為「已出帳」`),
        onError: (err) => toast.error(err.message),
      }
    );
  }, [checkedOrders, batchMutation]);

  const handleConfirmPaid = useCallback(() => {
    if (invoicedIds.length === 0) return;
    batchMutation.mutate(
      {
        ids: invoicedIds,
        paymentStatus: "up_to_date",
        updateBillingDate: true,
      },
      {
        onSuccess: () =>
          toast.success(
            `已將 ${invoicedIds.length} 筆訂單標記為「正常繳費」並續期`
          ),
        onError: (err) => toast.error(err.message),
      }
    );
  }, [invoicedIds, batchMutation]);

  const printableOrders = useMemo(
    () => checkedOrders.filter((o) => o.paymentStatus === "up_to_date"),
    [checkedOrders]
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <span className="mr-auto text-sm font-medium text-amber-800">
          已選取 {checkedIds.size} 筆
        </span>

        <button
          type="button"
          onClick={props.onSelectAll}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50"
        >
          全選
        </button>

        {upToDateCount > 0 && (
          <button
            type="button"
            onClick={handlePrintAll}
            disabled={batchMutation.isPending}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {batchMutation.isPending
              ? "處理中..."
              : `列印繳費 (${upToDateCount})`}
          </button>
        )}

        {invoicedIds.length > 0 && (
          <button
            type="button"
            onClick={handleConfirmPaid}
            disabled={batchMutation.isPending}
            className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 disabled:opacity-50"
          >
            {batchMutation.isPending
              ? "處理中..."
              : `確認繳費 (${invoicedIds.length})`}
          </button>
        )}
      </div>

      {printableOrders.length > 0 && (
        <PrintableNotice ref={printRef} orders={printableOrders} />
      )}
    </>
  );
};

BillingActionBar.displayName = "BillingActionBar";

export default BillingActionBar;
