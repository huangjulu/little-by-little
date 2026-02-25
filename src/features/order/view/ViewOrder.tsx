"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { SearchInput, StatusFilterValue, orderApi } from "..";
import {
  OrderDetailPanel,
  OrderFilters,
  OrderHeader,
  OrderTable,
} from "../organisms";
import { DataTableSkeleton } from "./DataTableSkeleton";
import { PanelDetailSkeleton } from "./PanelDetailSkeleton";

export const ViewOrder: React.FC<{ className?: string }> = (props) => {
  const [filterParams, setFilterParams] = useState<{
    keyword: string;
    status: StatusFilterValue;
  }>({
    keyword: "",
    status: "all",
  });

  // 在 page 層管理選中的訂單 ID
  const [selectedId, setSelectedId] = useState<string | null>();

  // 取得全部訂單（供狀態方塊數量使用）
  const { data: allOrders = [] } = orderApi.getOrders.useQuery({});

  // 取得訂單列表（API 已處理篩選）
  const {
    data: filteredOrders = [],
    isLoading: isLoadingOrders,
    error: ordersError,
  } = orderApi.getOrders.useQuery({
    status: filterParams.status !== "all" ? filterParams.status : undefined,
    keyword: filterParams.keyword.trim() || undefined,
  });

  // 取得選中的訂單（僅在點選時才查詢與顯示）
  const { data: OrderData, isLoading: isLoadingOrderDetail } =
    orderApi.getOrder.useQuery(selectedId ?? null);

  const safeError = ordersError instanceof Error ? ordersError : null;

  // 處理篩選條件變化（支援 partial 合併）
  const handleFiltersChange = useCallback(
    (patch: Partial<{ keyword: string; status: StatusFilterValue }>) => {
      setFilterParams((prev) => ({ ...prev, ...patch }));
    },
    []
  );

  // 再點同一筆訂單時收起 panel（toggle）
  const handleOrderClick = useCallback((orderId: string) => {
    setSelectedId((prev) => (prev === orderId ? null : orderId));
  }, []);

  return (
    <div className={cn("flex flex-col gap-4", props.className)}>
      <OrderHeader orders={filteredOrders} />

      <OrderFilters
        status={filterParams.status}
        onFiltersChange={handleFiltersChange}
        allOrders={allOrders}
      />
      <SearchInput
        value={filterParams.keyword}
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
          <OrderTable
            orders={filteredOrders}
            selectedOrderId={selectedId}
            onOrderClick={handleOrderClick}
            isLoading={false}
          />
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
