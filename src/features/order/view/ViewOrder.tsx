"use client";

import { cn } from "@/lib/utils";
import {
  SearchInput,
  StatusFilterValue,
  useOrders,
  useSingleOrderById,
} from "..";
import {
  OrderDetailPanel,
  OrderFilters,
  OrderHeader,
  OrderTable,
} from "../organisms";
import {
  DataTableSkeleton,
  PanelDetailSkeleton,
} from "@/components/shared/skeletons";
import { useCallback, useEffect, useState } from "react";

export const ViewOrder: React.FC<{ className?: string }> = (props) => {
  const [filterParams, setFilterParams] = useState<{
    keyword: string;
    status: StatusFilterValue;
  }>({
    keyword: "",
    status: "all",
  });

  // 在 page 層管理選中的訂單 ID
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>();

  // 使用 React Query 取得全部訂單（供狀態方塊數量使用）
  const { data: allOrders = [] } = useOrders({});

  // 使用 React Query 取得訂單列表（API 已處理篩選）
  const {
    data: filteredOrders = [],
    isLoading: isLoadingOrders,
    error: ordersError,
  } = useOrders({
    status: filterParams.status !== "all" ? filterParams.status : undefined,
    keyword: filterParams.keyword.trim() || undefined,
  });

  // 當訂單列表改變時，若當前選中的訂單不在列表中則清空選取（不預設選第一筆）
  useEffect(() => {
    const currentSelectedExists =
      selectedOrderId && filteredOrders.some((o) => o.id === selectedOrderId);
    if (!currentSelectedExists && selectedOrderId !== null) {
      setSelectedOrderId(null);
    }
  }, [filteredOrders, selectedOrderId]);

  // 使用 React Query 取得選中的訂單（僅在點選時才查詢與顯示）
  const { data: selectedOrder, isLoading: isLoadingOrderDetail } =
    useSingleOrderById(selectedOrderId ?? null);

  // 處理篩選條件變化（支援 partial 合併）
  const handleFiltersChange = useCallback(
    (patch: Partial<{ keyword: string; status: StatusFilterValue }>) => {
      setFilterParams((prev) => ({ ...prev, ...patch }));
    },
    []
  );

  return (
    <div className={cn("flex flex-col gap-4", props.className)}>
      <OrderHeader orders={filteredOrders} />

      <OrderFilters
        status={filterParams.status}
        onFiltersChange={handleFiltersChange}
        allOrders={allOrders}
      />
      <section className="grid gap-4 grid-cols-2">
        <SearchInput
          value={filterParams.keyword}
          onChange={(v) => handleFiltersChange({ keyword: v })}
          placeholder="以 訂單編號 / 客戶姓名 / Email 搜尋"
          className="col-span-2"
        />

        <div
          className={cn(
            "grid gap-4",
            selectedOrderId
              ? "md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] col-span-2"
              : "col-span-2"
          )}
        >
          {isLoadingOrders ? (
            <DataTableSkeleton rows={5} columns={5} showSummary />
          ) : (
            <OrderTable
              orders={filteredOrders}
              selectedOrderId={selectedOrderId}
              isLoading={false}
            />
          )}

          {selectedOrderId && (!selectedOrder || isLoadingOrderDetail) && (
            <PanelDetailSkeleton contentSections={3} />
          )}

          {selectedOrderId && selectedOrder && (
            <OrderDetailPanel order={selectedOrder} error={ordersError} />
          )}
        </div>
      </section>
    </div>
  );
};

ViewOrder.displayName = "ViewOrder";
