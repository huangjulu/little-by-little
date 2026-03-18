import { Download as IconDownload } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";

import StatusBadge from "../atoms/StatusBadge";
import type { Order } from "../types";

interface OrderDetailPanelProps {
  order: Order;
  error?: Error | null;
  onDownload?: () => void;
  className?: string;
}

const OrderDetailPanel: React.FC<OrderDetailPanelProps> = (props) => {
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
            <span className="font-mono text-[0.6875rem] text-gray-700">
              {order.id}
            </span>
            <span className="text-xs text-gray-400">
              {formatDate(order.createdAt)}
            </span>
          </div>
          <div className="mt-2 flex justify-between gap-2">
            <div>
              <div className="text-xs font-medium">{order.customerName}</div>
              <div className="text-[0.6875rem] text-gray-500">
                {order.mobilePhone}
              </div>
              <div className="text-[0.6875rem] text-gray-400">
                {order.communityName} {order.houseUnit}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[0.6875rem] text-gray-500">目前金額</div>
              <span className="text-sm font-semibold">
                {formatCurrency(order.currentPrice)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 rounded-lg border border-gray-200 bg-white px-3 py-3">
          <span className="text-xs font-medium text-gray-700">合約資訊</span>
          <div className="grid grid-cols-2 gap-2 text-[0.6875rem]">
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
              <span className="font-medium">
                {formatCurrency(order.basePrice)}
              </span>
            </div>
            <div>
              <span className="text-gray-400">目前價格</span>
              <span className="font-medium">
                {formatCurrency(order.currentPrice)}
              </span>
            </div>
          </div>
        </div>

        {props.onDownload && (
          <div className="flex justify-start">
            <button
              type="button"
              onClick={props.onDownload}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              <IconDownload className="size-3.5" />
              下載繳費通知
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

OrderDetailPanel.displayName = "OrderDetailPanel";

export default OrderDetailPanel;
