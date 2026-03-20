"use client";

import { useCallback, useMemo } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { downloadBillingPdf } from "../billing/billing-notice.utils";
import BillingActionBar from "../billing/BillingActionBar";
import SearchInput from "../molecules/SearchInput";
import { orderApi } from "../order.api";
import OrderDetailPanel from "../organisms/OrderDetailPanel";
import OrderHeader from "../organisms/OrderHeader";
import OrderTable from "../organisms/OrderTable";
import type { Order } from "../types";
import DataTableSkeleton from "./DataTableSkeleton";
import PanelDetailSkeleton from "./PanelDetailSkeleton";
import useCheckedOrders from "./useCheckedOrders";
import useOrderFilters from "./useOrderFilters";

const ViewOrder: React.FC<{ className?: string }> = (props) => {
  const filters = useOrderFilters();

  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    error: ordersError,
  } = orderApi.getOrders.useQuery({
    status: filters.status !== "all" ? filters.status : undefined,
    billing:
      filters.billing === "next-month"
        ? "next-month"
        : filters.billing === "overdue"
        ? "overdue"
        : undefined,
    keyword: filters.keyword.trim() || undefined,
    page: filters.page,
    pageSize: filters.pageSize,
  });

  const filteredOrders = useMemo(
    () => ordersData?.orders ?? [],
    [ordersData?.orders]
  );
  const totalOrders = ordersData?.total ?? 0;
  const totalPages = Math.ceil(totalOrders / filters.pageSize);

  const {
    scheduleAutoSelect,
    deselectAll,
    selectAll,
    selectByIds,
    checkedIds,
    toggle,
  } = useCheckedOrders(filteredOrders);

  const searchFilter = useMemo(
    () => ({
      ...filters.searchFilter,
      onSelect: (option: { key: string }) => {
        scheduleAutoSelect();
        filters.searchFilter.onSelect(option);
      },
      onClear: () => {
        filters.searchFilter.onClear();
        deselectAll();
      },
    }),
    [filters.searchFilter, scheduleAutoSelect, deselectAll]
  );

  const { data: orderDetail, isLoading: isLoadingOrderDetail } =
    orderApi.getOrder.useQuery(filters.selectedId ?? null);

  const safeError = ordersError instanceof Error ? ordersError : null;

  const markAsNotified = orderApi.batchUpdateStatus.useMutation();

  const handleDownloadNotice = useCallback(
    async (order: Order) => {
      try {
        await downloadBillingPdf([order]);
        if (order.paymentStatus === "up_to_date") {
          markAsNotified.mutate(
            { ids: [order.id], paymentStatus: "waiting_for_payment" },
            {
              onSuccess: () =>
                toast.success("已下載繳費通知，並標記為「已通知」"),
              onError: (err) => toast.error(err.message),
            }
          );
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "下載失敗");
      }
    },
    [markAsNotified]
  );

  return (
    <div className={cn("flex flex-col gap-4", props.className)}>
      <OrderHeader orders={filteredOrders} />

      <SearchInput
        value={filters.keyword}
        onChange={(v) => filters.handleFiltersChange({ keyword: v })}
        filter={searchFilter}
        placeholder="以 編號 / 客戶姓名 / 手機 / 社區 搜尋"
      />

      {filters.isBillingMode && (
        <BillingActionBar
          orders={filteredOrders}
          checkedIds={checkedIds}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          onSelectByIds={selectByIds}
        />
      )}

      <div
        className={cn(
          "grid gap-4 min-h-0 flex-1",
          filters.selectedId
            ? "md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] col-span-2"
            : "col-span-2"
        )}
      >
        {isLoadingOrders ? (
          <DataTableSkeleton rows={5} columns={5} showSummary />
        ) : (
          <div className="flex flex-col gap-3 min-h-0">
            <OrderTable
              orders={filteredOrders}
              isLoading={false}
              checkbox={
                filters.isBillingMode
                  ? {
                      checkedIds,
                      onToggle: toggle,
                      onSelectAll: selectAll,
                      onDeselectAll: deselectAll,
                    }
                  : undefined
              }
              hideUpload={!!filters.selectedId}
            />

            {totalPages > 1 && (
              <div className="flex items-center justify-end gap-3 px-1 text-sm text-gray-500">
                <button
                  onClick={() =>
                    void filters.setPage((p) => Math.max(1, (p ?? 1) - 1))
                  }
                  disabled={filters.page <= 1}
                  className="rounded-lg px-3 py-1.5 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  上一頁
                </button>
                <span className="text-xs">
                  第 {filters.page} 頁，共 {totalPages} 頁（{totalOrders} 筆）
                </span>
                <button
                  onClick={() =>
                    void filters.setPage((p) =>
                      Math.min(totalPages, (p ?? 1) + 1)
                    )
                  }
                  disabled={filters.page >= totalPages}
                  className="rounded-lg px-3 py-1.5 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  下一頁
                </button>
              </div>
            )}
          </div>
        )}

        {filters.selectedId && (!orderDetail || isLoadingOrderDetail) && (
          <PanelDetailSkeleton contentSections={3} />
        )}

        {filters.selectedId && orderDetail && (
          <OrderDetailPanel
            order={orderDetail}
            error={safeError}
            onDownload={() => handleDownloadNotice(orderDetail)}
          />
        )}
      </div>
    </div>
  );
};

ViewOrder.displayName = "ViewOrder";

export default ViewOrder;
