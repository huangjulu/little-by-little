"use client";

import {
  CheckCircle as IconCheckCircle,
  Download as IconDownload,
  Info as IconInfo,
} from "lucide-react";

import Dialog from "@/ui/dialog";

import type { Order } from "../types";
import useBillingActions from "./useBillingActions";

interface BillingActionBarProps {
  orders: Order[];
  checkedIds: Set<string>;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSelectByIds: (ids: string[]) => void;
}

const BillingActionBar: React.FC<BillingActionBarProps> = (props) => {
  const isAllSelected =
    props.orders.length > 0 && props.checkedIds.size === props.orders.length;

  const billing = useBillingActions(props.orders, props.checkedIds);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
        <IconInfo className="size-4 shrink-0 text-blue-600" />

        <div className="mr-auto text-sm text-blue-800">
          <p>
            {billing.totalPrintable > 0 && (
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
                  {billing.totalPrintable} 筆
                </button>{" "}
                繳費通知尚未下載。
              </>
            )}
            {billing.totalWaitingForPayment > 0 && (
              <>
                已下載的{" "}
                <button
                  type="button"
                  onClick={() => {
                    const ids = props.orders
                      .filter((o) => o.paymentStatus === "waiting_for_payment")
                      .map((o) => o.id);
                    props.onSelectByIds(ids);
                  }}
                  className="font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800 cursor-pointer"
                >
                  {billing.totalWaitingForPayment} 筆
                </button>{" "}
                繳費通知請確認寄出，收到匯款後點擊確認繳費
              </>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={isAllSelected ? props.onDeselectAll : props.onSelectAll}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50"
        >
          {isAllSelected ? "取消全選" : "全選"}
        </button>

        {billing.downloadableOrders.length > 0 && (
          <button
            type="button"
            onClick={billing.openDownloadConfirm}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50"
          >
            <IconDownload className="size-3.5" />
            下載繳費通知 ({billing.downloadableOrders.length})
          </button>
        )}

        {billing.waitingForPaymentIds.length > 0 && (
          <button
            type="button"
            onClick={billing.openPaidConfirm}
            disabled={billing.isPending}
            className="rounded-md bg-gray-800 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-700 disabled:opacity-50"
          >
            {billing.isPending
              ? "處理中..."
              : `確認繳費 (${billing.waitingForPaymentIds.length})`}
          </button>
        )}
      </div>

      {/* 下載繳費通知二次確認 Dialog */}
      <Dialog.Root
        open={billing.doubleConfirmType === "download"}
        onOpenChange={(open) => {
          if (!open) billing.closeDoubleConfirm();
        }}
      >
        <Dialog.Content size="sm">
          <Dialog.Header isClosable>
            <Dialog.Title>
              確定下載{" "}
              <span className="text-blue-600">
                {billing.downloadableOrders.length}
              </span>{" "}
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
              onClick={billing.confirmDownload}
              disabled={billing.downloading}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              <IconDownload className="size-3.5" />
              {billing.downloading ? "產生中..." : "確認下載"}
            </button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>

      {/* 確認繳費二次確認 Dialog */}
      <Dialog.Root
        open={billing.doubleConfirmType === "paid"}
        onOpenChange={(open) => {
          if (!open) billing.closeDoubleConfirm();
        }}
      >
        <Dialog.Content size="sm">
          <Dialog.Header isClosable>
            <Dialog.Title>
              確定這{" "}
              <span className="text-blue-600">
                {billing.waitingForPaymentIds.length}
              </span>{" "}
              筆客戶繳費了嗎？
            </Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <p className="text-sm text-gray-500">
              確認後會將把這些客戶的繳費狀態改為「正常繳費」，並自動續期下次計費日。
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
              onClick={billing.confirmPaid}
              disabled={billing.isPending}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              <IconCheckCircle className="size-3.5" />
              {billing.isPending ? "處理中..." : "確認繳費"}
            </button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

BillingActionBar.displayName = "BillingActionBar";

export default BillingActionBar;
