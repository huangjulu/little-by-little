import * as React from "react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { StatusBadge, OrderId, DateDisplay, CurrencyDisplay } from "../atoms";
import { OrderItemRow } from "../molecules";
import type { Order } from "../order-types";
import { cn } from "@/lib/utils";

interface OrderDetailPanelProps {
  order: Order;
  error?: Error | null;
  className?: string;
}

/**
 * OrderDetailPanel - 訂單詳情面板有機體組件
 */
export const OrderDetailPanel: React.FC<OrderDetailPanelProps> = (props) => {
  const { order, error, className } = props;
  const prevErrorRef = useRef<Error | null>(null);

  // 使用 toast 顯示錯誤狀態
  useEffect(() => {
    if (!error) {
      toast.dismiss("order-detail-error");
      prevErrorRef.current = null;
    } else if (error !== prevErrorRef.current) {
      toast.error(`載入失敗：${error.message}`, {
        id: "order-detail-error",
      });
      prevErrorRef.current = error;
    }
  }, [error]);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold">訂單明細</h2>
          <p className="text-xs text-gray-500">
            點選左側列表中的任一筆訂單查看細節。
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="space-y-4 text-xs">
        {/* 基本資訊卡片 */}
        <div className="space-y-1 rounded-lg border border-gray-200 bg-white px-3 py-3">
          <div className="flex items-center justify-between gap-2">
            <OrderId id={order.id} />
            <DateDisplay
              dateString={order.createdAt}
              className="text-xs text-gray-400"
            />
          </div>
          <div className="mt-2 flex justify-between gap-2">
            <div>
              <div className="text-xs font-medium">{order.customerName}</div>
              <div className="text-[11px] text-gray-500">{order.email}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-gray-500">訂單金額</div>
              <CurrencyDisplay
                value={order.total}
                className="text-sm font-semibold"
              />
            </div>
          </div>
        </div>

        {/* 品項清單卡片 */}
        <div className="space-y-2 rounded-lg border border-gray-200 bg-white px-3 py-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">內含品項</span>
            <span className="text-[11px] text-gray-400">
              共 {order.items.length} 筆
            </span>
          </div>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <OrderItemRow
                key={`${order.id}-${index}`}
                name={item.name}
                quantity={item.quantity}
                price={item.price}
              />
            ))}
          </div>
        </div>

        {/* API 建議卡片 */}
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-100/70 px-3 py-3 text-[11px] text-gray-500">
          <p className="mb-1 font-medium text-gray-600">接上真實 API 的建議</p>
          <ul className="list-disc space-y-1 pl-4">
            <li>以 `/api/orders` 取得列表（支援分頁、狀態與關鍵字查詢）。</li>
            <li>
              後續可以在這裡加上「變更狀態」、「備註欄位」、「操作紀錄」等元件。
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

OrderDetailPanel.displayName = "OrderDetailPanel";
