import * as React from "react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/ui/card";
import { OrderId, DateDisplay, CurrencyDisplay } from "../atoms";
import type { Order } from "../types";
import { cn } from "@/lib/utils";
import { StatusBadge } from "../atoms/StatusBadge";

interface OrderDetailPanelProps {
  order: Order;
  error?: Error | null;
  className?: string;
}

export const OrderDetailPanel: React.FC<OrderDetailPanelProps> = (props) => {
  const { order, error, className } = props;
  const prevErrorRef = useRef<Error | null>(null);

  useEffect(
    function syncErrorToast() {
      if (!error) {
        toast.dismiss("order-detail-error");
        prevErrorRef.current = null;
      } else if (error !== prevErrorRef.current) {
        toast.error(`載入失敗：${error.message}`, {
          id: "order-detail-error",
        });
        prevErrorRef.current = error;
      }
    },
    [error]
  );

  return (
    <Card className={cn("flex flex-col gap-3 bg-gray-50 p-4", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 p-0">
        <div>
          <CardTitle className="text-sm">訂單明細</CardTitle>
          <CardDescription className="text-xs">
            點選左側列表中的任一筆訂單查看細節。
          </CardDescription>
        </div>
        <StatusBadge status={order.status} />
      </CardHeader>

      <CardContent className="space-y-4 p-0 text-xs">
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
              <div className="text-[11px] text-gray-500">
                {order.mobilePhone}
              </div>
              <div className="text-[11px] text-gray-400">
                {order.communityName} {order.houseUnit}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-gray-500">目前金額</div>
              <CurrencyDisplay
                value={order.currentPrice}
                className="text-sm font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 rounded-lg border border-gray-200 bg-white px-3 py-3">
          <span className="text-xs font-medium text-gray-700">合約資訊</span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-gray-400">合約起始</span>
              <div className="font-medium">
                {order.contractStartDate || "—"}
              </div>
            </div>
            <div>
              <span className="text-gray-400">合約到期</span>
              <div className="font-medium">{order.contractEndDate || "—"}</div>
            </div>
            <div>
              <span className="text-gray-400">繳費期限</span>
              <div className="font-medium">{order.paymentDeadline || "—"}</div>
            </div>
            <div>
              <span className="text-gray-400">下次帳單日</span>
              <div className="font-medium">{order.nextBillingDate || "—"}</div>
            </div>
            <div>
              <span className="text-gray-400">基本價格</span>
              <CurrencyDisplay
                value={order.basePrice}
                className="font-medium"
              />
            </div>
            <div>
              <span className="text-gray-400">目前價格</span>
              <CurrencyDisplay
                value={order.currentPrice}
                className="font-medium"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

OrderDetailPanel.displayName = "OrderDetailPanel";
