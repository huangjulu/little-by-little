"use client";

import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";

import BillingActionBar from "../billing/BillingActionBar";
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
  const [billing] = useQueryState("billing", parseAsString);
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

  const isBillingMode = billing === "next-month";
  const filteredOrders = ordersData?.orders ?? [];
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
        placeholder="以 編號 / 客戶姓名 / 手機 / 社區 搜尋"
      />

      {isBillingMode && !isLoadingOrders && filteredOrders.length > 0 && (
        <BillingActionBar
          orders={filteredOrders}
          checkedIds={checkedIds}
          onToggleCheck={handleToggleCheck}
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
          <OrderDetailPanel order={OrderData} error={safeError} />
        )}
      </div>
    </div>
  );
};

ViewOrder.displayName = "ViewOrder";

export default ViewOrder;
