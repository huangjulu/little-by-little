"use client";

import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import BillingActionBar from "../billing/BillingActionBar";
import PrintableNotice from "../billing/PrintableNotice";
import SearchInput from "../molecules/SearchInput";
import { orderApi } from "../order.api";
import OrderDetailPanel from "../organisms/OrderDetailPanel";
import OrderHeader from "../organisms/OrderHeader";
import OrderTable from "../organisms/OrderTable";
import type { StatusFilterValue } from "../types";
import DataTableSkeleton from "./DataTableSkeleton";
import PanelDetailSkeleton from "./PanelDetailSkeleton";

const PAGE_SIZE = 20;
const STATUS_OPTIONS = ["all", "active", "inactive"] as const;

const ViewOrder: React.FC<{ className?: string }> = (props) => {
  const [keyword, setKeyword] = useQueryState(
    "keyword",
    parseAsString.withDefault("")
  );
  const [status, setStatus] = useQueryState(
    "status",
    parseAsStringLiteral(STATUS_OPTIONS).withDefault("all")
  );
  const [selectedId, setSelectedId] = useQueryState("orderId", parseAsString);
  const [billing, setBilling] = useQueryState("billing", parseAsString);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    error: ordersError,
  } = orderApi.getOrders.useQuery({
    status: status !== "all" ? status : undefined,
    billing: billing === "next-month" ? "next-month" : undefined,
    keyword: keyword.trim() || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [printedIds, setPrintedIds] = useState<Set<string>>(new Set());
  const [printingId, setPrintingId] = useState<string | null>(null);
  const printingIdRef = useRef<string | null>(null);
  const markInvoicedMutation = orderApi.batchUpdateStatus.useMutation();
  const markPaidMutation = orderApi.batchUpdateStatus.useMutation();

  const isBillingMode = billing === "next-month";
  const filteredOrders = useMemo(
    () => ordersData?.orders ?? [],
    [ordersData?.orders]
  );
  const totalOrders = ordersData?.total ?? 0;
  const totalPages = Math.ceil(totalOrders / PAGE_SIZE);

  const { data: OrderData, isLoading: isLoadingOrderDetail } =
    orderApi.getOrder.useQuery(selectedId ?? null);

  const safeError = ordersError instanceof Error ? ordersError : null;

  const handleFiltersChange = useCallback(
    (patch: Partial<{ keyword: string; status: StatusFilterValue }>) => {
      if (patch.keyword !== undefined) void setKeyword(patch.keyword);
      if (patch.status !== undefined) void setStatus(patch.status);
      void setPage(1);
    },
    [setKeyword, setStatus, setPage]
  );

  const handleToggleCheck = useCallback((id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setCheckedIds(new Set(filteredOrders.map((o) => o.id)));
  }, [filteredOrders]);

  useEffect(
    function autoSelectOnBillingMode() {
      if (isBillingMode && filteredOrders.length > 0) {
        setCheckedIds(new Set(filteredOrders.map((o) => o.id)));
      }
      if (!isBillingMode) {
        setCheckedIds(new Set());
      }
    },
    [isBillingMode, filteredOrders]
  );

  const handleDeselectAll = useCallback(() => {
    setCheckedIds(new Set());
  }, []);

  const searchFilter = useMemo(
    () => ({
      active:
        billing === "next-month"
          ? { key: "billing:next-month", label: "下個月繳費名單" }
          : null,
      onSelect: (option: { key: string }) => {
        if (option.key === "billing:next-month") {
          void setBilling("next-month");
          void setSelectedId(null);
          void setKeyword("");
          void setPage(1);
        }
      },
      onClear: () => {
        void setBilling(null);
        void setPage(1);
        setCheckedIds(new Set());
      },
    }),
    [billing, setBilling, setSelectedId, setKeyword, setPage]
  );

  const handlePrint = useCallback((id: string) => {
    printingIdRef.current = id;
    setPrintingId(id);
    requestAnimationFrame(() => {
      window.print();
    });
  }, []);

  useEffect(
    function listenAfterPrint() {
      function handleAfterPrint() {
        const id = printingIdRef.current;
        if (!id) return;
        markInvoicedMutation.mutate(
          { ids: [id], paymentStatus: "invoiced" },
          {
            onSuccess: () => toast.success("已標記為「已出帳」"),
            onError: (err) => toast.error(err.message),
          }
        );
        setPrintedIds((prev) => new Set(prev).add(id));
        printingIdRef.current = null;
        setPrintingId(null);
      }

      window.addEventListener("afterprint", handleAfterPrint);
      return () => window.removeEventListener("afterprint", handleAfterPrint);
    },
    [markInvoicedMutation]
  );

  const handleMarkPaid = useCallback(
    (id: string) => {
      markPaidMutation.mutate(
        { ids: [id], paymentStatus: "up_to_date", updateBillingDate: true },
        {
          onSuccess: () => toast.success("已標記為「正常繳費」並續期"),
          onError: (err) => toast.error(err.message),
        }
      );
    },
    [markPaidMutation]
  );

  const handleOrderClick = useCallback(
    (orderId: string) => {
      void setSelectedId((prev) => (prev === orderId ? null : orderId));
    },
    [setSelectedId]
  );

  return (
    <div className={cn("flex flex-col gap-4", props.className)}>
      <OrderHeader orders={filteredOrders} />

      <SearchInput
        value={keyword}
        onChange={(v) => handleFiltersChange({ keyword: v })}
        filter={searchFilter}
        placeholder="以 編號 / 客戶姓名 / 手機 / 社區 搜尋"
      />

      {isBillingMode && (
        <BillingActionBar
          orders={filteredOrders}
          checkedIds={checkedIds}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
        />
      )}

      <div
        className={cn(
          "grid gap-4",
          selectedId
            ? "md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] col-span-2"
            : "col-span-2"
        )}
      >
        {isLoadingOrders ? (
          <DataTableSkeleton rows={5} columns={5} showSummary />
        ) : (
          <div className="flex flex-col gap-3">
            <OrderTable
              orders={filteredOrders}
              selectedOrderId={selectedId}
              onOrderClick={handleOrderClick}
              isLoading={false}
              billingMode={isBillingMode}
              checkedIds={checkedIds}
              onToggleCheck={handleToggleCheck}
              onPrint={handlePrint}
              onMarkPaid={handleMarkPaid}
              printedIds={printedIds}
              hideUpload={!!selectedId}
            />

            {totalPages > 1 && (
              <div className="flex items-center justify-end gap-3 px-1 text-sm text-gray-500">
                <button
                  onClick={() => void setPage((p) => Math.max(1, (p ?? 1) - 1))}
                  disabled={page <= 1}
                  className="rounded-lg px-3 py-1.5 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  上一頁
                </button>
                <span className="text-xs">
                  第 {page} 頁，共 {totalPages} 頁（{totalOrders} 筆）
                </span>
                <button
                  onClick={() =>
                    void setPage((p) => Math.min(totalPages, (p ?? 1) + 1))
                  }
                  disabled={page >= totalPages}
                  className="rounded-lg px-3 py-1.5 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  下一頁
                </button>
              </div>
            )}
          </div>
        )}

        {selectedId && (!OrderData || isLoadingOrderDetail) && (
          <PanelDetailSkeleton contentSections={3} />
        )}

        {selectedId && OrderData && (
          <OrderDetailPanel
            order={OrderData}
            error={safeError}
            onPrint={() => handlePrint(OrderData.id)}
            onMarkPaid={() => handleMarkPaid(OrderData.id)}

          />
        )}
      </div>

      {printingId && (
        <PrintableNotice
          orders={filteredOrders.filter((o) => o.id === printingId)}
        />
      )}
    </div>
  );
};

ViewOrder.displayName = "ViewOrder";

export default ViewOrder;
