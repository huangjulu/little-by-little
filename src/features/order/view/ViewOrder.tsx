"use client";

import { useCallback } from "react";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";
import { cn } from "@/lib/utils";
import { SearchInput, StatusFilterValue, orderApi } from "..";
import { OrderDetailPanel, OrderHeader, OrderTable } from "../organisms";
import { DataTableSkeleton } from "./DataTableSkeleton";
import { PanelDetailSkeleton } from "./PanelDetailSkeleton";

const PAGE_SIZE = 20;
const STATUS_OPTIONS = ["all", "active", "inactive"] as const;

export const ViewOrder: React.FC<{ className?: string }> = (props) => {
  const [keyword, setKeyword] = useQueryState(
    "keyword",
    parseAsString.withDefault("")
  );
  const [status, setStatus] = useQueryState(
    "status",
    parseAsStringLiteral(STATUS_OPTIONS).withDefault("all")
  );
  const [selectedId, setSelectedId] = useQueryState("orderId", parseAsString);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    error: ordersError,
  } = orderApi.getOrders.useQuery({
    status: status !== "all" ? status : undefined,
    keyword: keyword.trim() || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

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
