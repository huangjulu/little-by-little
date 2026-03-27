"use client";

import { useState } from "react";
import { Download as IconDownload, Info as IconInfo } from "lucide-react";
import { toast } from "sonner";

import Dialog from "@/ui/dialog";

import { orderApi } from "../order.api";
import type { Order } from "../types";
import { downloadBillingPdf } from "./utils/billing-notice";

const BillingActionBar: React.FC<BillingActionBarProps> = (props) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const batchMutation = orderApi.batchUpdateStatus.useMutation();

  const isAllSelected =
    props.orders.length > 0 && props.checkedIds.size === props.orders.length;

  const totalPrintable = props.orders.filter(
    (o) => o.paymentStatus === "up_to_date"
  ).length;

  const checkedOrders = props.orders.filter((o) => props.checkedIds.has(o.id));
  const downloadableOrders = checkedOrders.filter(
    (o) =>
      o.paymentStatus === "up_to_date" ||
      o.paymentStatus === "waiting_for_payment"
  );

  const handleConfirmDownload = async () => {
    setDownloading(true);

    try {
      await downloadBillingPdf(downloadableOrders);

      const newDownloadIds = checkedOrders
        .filter((o) => o.paymentStatus === "up_to_date")
        .map((o) => o.id);

      if (newDownloadIds.length > 0) {
        batchMutation.mutate(
          { ids: newDownloadIds, paymentStatus: "waiting_for_payment" },
          {
            onSuccess: () =>
              toast.success(
                `已下載 ${downloadableOrders.length} 筆繳費通知，${newDownloadIds.length} 筆標記為「已通知」`
              ),
            onError: (err) => toast.error(err.message),
          }
        );
      } else {
        toast.success(`已重新下載 ${downloadableOrders.length} 筆繳費通知`);
      }

      setIsConfirmOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "下載失敗");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
        <IconInfo className="size-4 shrink-0 text-blue-600" />

        <div className="mr-auto text-sm text-blue-800">
          <p>
            {totalPrintable > 0 && (
              <>
                有{" "}
                <button
                  type="button"
                  onClick={() => {
                    const ids = props.orders
                      .filter((o) => o.paymentStatus === "up_to_date")
                      .map((o) => o.id);
                    props.onSelectByIds(ids);
                  }}
                  className="font-semibold text-blue-600 underline underline-offset-2 hover:text-blue-800"
                >
                  {totalPrintable} 筆
                </button>{" "}
                繳費通知尚未下載。
              </>
            )}
            {(() => {
              const waitingCount = props.orders.filter(
                (o) => o.paymentStatus === "waiting_for_payment"
              ).length;
              if (waitingCount === 0) return null;
              return (
                <>
                  已下載的 {waitingCount} 筆繳費通知請至
                  <a
                    href="/finance"
                    className="font-semibold text-blue-600 underline underline-offset-2 hover:text-blue-800"
                  >
                    財務管理
                  </a>
                  頁面確認繳費
                </>
              );
            })()}
          </p>
        </div>

        <button
          type="button"
          onClick={isAllSelected ? props.onDeselectAll : props.onSelectAll}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50"
        >
          {isAllSelected ? "取消全選" : "全選"}
        </button>

        {downloadableOrders.length > 0 && (
          <button
            type="button"
            onClick={() => setIsConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50"
          >
            <IconDownload className="size-3.5" />
            下載繳費通知 ({downloadableOrders.length})
          </button>
        )}
      </div>

      <Dialog.Root
        open={isConfirmOpen}
        onOpenChange={(open) => {
          if (!open) setIsConfirmOpen(false);
        }}
      >
        <Dialog.Content size="sm">
          <Dialog.Header isClosable>
            <Dialog.Title>
              確定下載{" "}
              <span className="text-blue-600">{downloadableOrders.length}</span>{" "}
              筆繳費通知嗎？
            </Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <p className="text-sm text-gray-500">
              下載完後即可寄送信件，等到後續有收到客戶匯款，即可切換訂單狀態，改成「已付款」。
            </p>
          </Dialog.Body>

          <Dialog.Footer>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex flex-1 justify-center rounded-md border px-4 py-2 text-sm"
              >
                取消
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={handleConfirmDownload}
              disabled={downloading}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              <IconDownload className="size-3.5" />
              {downloading ? "產生中..." : "確認下載"}
            </button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

// Types
interface BillingActionBarProps {
  orders: Order[];
  checkedIds: Set<string>;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSelectByIds: (ids: string[]) => void;
}

BillingActionBar.displayName = "BillingActionBar";

export default BillingActionBar;
