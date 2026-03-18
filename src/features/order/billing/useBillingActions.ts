"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

import { orderApi } from "../order.api";
import type { Order } from "../types";
import { downloadBillingPdf } from "./billing-notice.utils";

type DoubleConfirmType = "download" | "paid" | null;

const useBillingActions = (orders: Order[], checkedIds: Set<string>) => {
  const [doubleConfirmType, setDoubleConfirmType] =
    useState<DoubleConfirmType>(null);
  const [downloading, setDownloading] = useState(false);

  const batchMutation = orderApi.batchUpdateStatus.useMutation();
  const mutateRef = useRef(batchMutation.mutate);
  mutateRef.current = batchMutation.mutate;

  // Derived state — 全量統計（banner 文字用，不受 checkbox 影響）
  const totalPrintable = orders.filter(
    (o) => o.paymentStatus === "up_to_date"
  ).length;
  const totalWaitingForPayment = orders.filter(
    (o) => o.paymentStatus === "waiting_for_payment"
  ).length;

  // Derived state — 勾選項目（按鈕操作用）
  const checkedOrders = orders.filter((o) => checkedIds.has(o.id));
  const downloadableOrders = checkedOrders.filter(
    (o) =>
      o.paymentStatus === "up_to_date" ||
      o.paymentStatus === "waiting_for_payment"
  );
  const newDownloadIds = checkedOrders
    .filter((o) => o.paymentStatus === "up_to_date")
    .map((o) => o.id);
  const waitingForPaymentIds = checkedOrders
    .filter((o) => o.paymentStatus === "waiting_for_payment")
    .map((o) => o.id);

  // Actions
  const openDownloadConfirm = () => {
    if (downloadableOrders.length === 0) return;
    setDoubleConfirmType("download");
  };

  const openPaidConfirm = () => {
    if (waitingForPaymentIds.length === 0) return;
    setDoubleConfirmType("paid");
  };

  const closeDoubleConfirm = () => setDoubleConfirmType(null);

  const confirmDownload = async () => {
    setDownloading(true);

    try {
      await downloadBillingPdf(downloadableOrders);

      // 只對尚未下載過的訂單（up_to_date）改狀態
      if (newDownloadIds.length > 0) {
        mutateRef.current(
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

      setDoubleConfirmType(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "下載失敗");
    } finally {
      setDownloading(false);
    }
  };

  const confirmPaid = () => {
    if (waitingForPaymentIds.length === 0) return;
    mutateRef.current(
      {
        ids: waitingForPaymentIds,
        paymentStatus: "up_to_date",
        updateBillingDate: true,
      },
      {
        onSuccess: () => {
          toast.success(
            `已將 ${waitingForPaymentIds.length} 筆客戶狀態改為「正常繳費」並續期`
          );
          setDoubleConfirmType(null);
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return {
    totalPrintable,
    totalWaitingForPayment,
    downloadableOrders,
    waitingForPaymentIds,
    doubleConfirmType,
    closeDoubleConfirm,
    downloading,
    isPending: batchMutation.isPending,
    openDownloadConfirm,
    openPaidConfirm,
    confirmDownload,
    confirmPaid,
  };
};

export default useBillingActions;
