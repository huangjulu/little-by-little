"use client";

import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import {
  OrderHeader,
  OrderFilters,
  OrderTable,
  OrderDetailPanel,
  SearchInput,
} from "@/components/orders";
import { useOrders, useSingleOrderById } from "@/hooks/useOrders";
import type { StatusFilterValue } from "@/types/order";
import { cn } from "@/lib/utils";
import { OrderDetailPanelSkeleton } from "@/components/orders/organisms/skeleton/OrderDetailPanelSkeleton";

export default function OrdersPage() {
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

  // 處理訂單點擊（toggle 邏輯：點擊已選中的訂單則取消選取）
  const handleOrderClick = useCallback((orderId: string) => {
    setSelectedOrderId((prev) => {
      // 如果點擊的是已選中的訂單，則取消選取（toggle）
      if (prev === orderId) {
        return null;
      }
      // 否則選取新訂單
      return orderId;
    });
  }, []);

  return (
    <div
      className={cn("flex min-h-screen bg-gray-100 px-4 py-8 text-gray-800")}
    >
      <main
        className={cn(
          "mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm"
        )}
      >
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
              selectedOrderId
                ? "md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]"
                : "col-span-2"
            )}
          >
            <OrderTable
              orders={filteredOrders}
              selectedOrderId={selectedOrderId}
              onOrderClick={handleOrderClick}
              isLoading={isLoadingOrders}
            />
          </div>

          {selectedOrderId && (!selectedOrder || isLoadingOrderDetail) && (
            <OrderDetailPanelSkeleton />
          )}

          {selectedOrderId && selectedOrder && (
            <OrderDetailPanel order={selectedOrder} error={ordersError} />
          )}
        </section>
      </main>
    </div>
  );
}
