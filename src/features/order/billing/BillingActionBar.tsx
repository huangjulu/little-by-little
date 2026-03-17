"use client";

import { Download } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import Dialog from "@/ui/dialog";

import { orderApi } from "../order.api";
import type { Order } from "../types";
import PrintableNotice from "./PrintableNotice";

const BillingActionBar: React.FC<BillingActionBarProps> = (props) => {
  const { orders, checkedIds } = props;
  const isAllSelected = orders.length > 0 && checkedIds.size === orders.length;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const batchMutation = orderApi.batchUpdateStatus.useMutation();
  const mutateRef = useRef(batchMutation.mutate);
  mutateRef.current = batchMutation.mutate;

  const checkedOrders = useMemo(
    () => orders.filter((o) => checkedIds.has(o.id)),
    [orders, checkedIds]
  );

  const printableOrders = useMemo(
    () => checkedOrders.filter((o) => o.paymentStatus === "up_to_date"),
    [checkedOrders]
  );

  const invoicedIds = checkedOrders
    .filter((o) => o.paymentStatus === "invoiced")
    .map((o) => o.id);

  const handleOpenPreview = useCallback(() => {
    if (printableOrders.length === 0) return;
    setPreviewOpen(true);
  }, [printableOrders.length]);

  const handleConfirmDownload = useCallback(async () => {
    const ids = printableOrders.map((o) => o.id);
    setDownloading(true);

    try {
      // 1. 產生 PDF
      const pdfRes = await fetch("/api/orders/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders: printableOrders }),
      });

      if (!pdfRes.ok) {
        const err = await pdfRes.json().catch(() => null);
        throw new Error(err?.message ?? "PDF 產生失敗");
      }

      // 2. 觸發瀏覽器下載
      const blob = await pdfRes.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "billing-notice.pdf";
      a.click();
      URL.revokeObjectURL(url);

      // 3. 下載成功後，改狀態為「已出帳」
      mutateRef.current(
        { ids, paymentStatus: "invoiced" },
        {
          onSuccess: () =>
            toast.success(`已下載 ${ids.length} 筆繳費通知並標記為「已出帳」`),
          onError: (err) => toast.error(err.message),
        }
      );

      setPreviewOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "下載失敗");
    } finally {
      setDownloading(false);
    }
  }, [printableOrders]);

  const handleConfirmPaid = useCallback(() => {
    if (invoicedIds.length === 0) return;
    mutateRef.current(
      {
        ids: invoicedIds,
        paymentStatus: "up_to_date",
        updateBillingDate: true,
      },
      {
        onSuccess: () =>
          toast.success(
            `已將 ${invoicedIds.length} 筆訂單標記為「正常繳費」並續期`
          ),
        onError: (err) => toast.error(err.message),
      }
    );
  }, [invoicedIds]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <span className="mr-auto text-sm font-medium text-amber-800">
          已選取 {checkedIds.size} 筆
        </span>

        <button
          type="button"
          onClick={isAllSelected ? props.onDeselectAll : props.onSelectAll}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50"
        >
          {isAllSelected ? "取消全選" : "全選"}
        </button>

        {printableOrders.length > 0 && (
          <button
            type="button"
            onClick={handleOpenPreview}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50"
          >
            <Download className="size-3.5" />
            下載繳費通知 ({printableOrders.length})
          </button>
        )}

        {invoicedIds.length > 0 && (
          <button
            type="button"
            onClick={handleConfirmPaid}
            disabled={batchMutation.isPending}
            className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 disabled:opacity-50"
          >
            {batchMutation.isPending
              ? "處理中..."
              : `確認繳費 (${invoicedIds.length})`}
          </button>
        )}
      </div>

      {/* 繳費通知預覽 Dialog */}
      <Dialog.Root open={previewOpen} onOpenChange={setPreviewOpen}>
        <Dialog.Content size="lg" className="sm:max-w-4xl max-h-[95vh]">
          <Dialog.Header isClosable>
            <Dialog.Title>
              繳費通知預覽（{printableOrders.length} 筆）
            </Dialog.Title>
            <Dialog.Description>
              請確認以下內容無誤後，點選「確認下載」
            </Dialog.Description>
          </Dialog.Header>

          <Dialog.Body>
            <PrintableNotice orders={printableOrders} />
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
              <Download className="size-3.5" />
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
}

BillingActionBar.displayName = "BillingActionBar";

export default BillingActionBar;
