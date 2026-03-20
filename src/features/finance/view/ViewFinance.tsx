"use client";

import { CheckCircle as IconCheckCircle } from "lucide-react";
import { useQueryState } from "nuqs";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import PaymentCard from "@/features/finance/molecules/PaymentCard";
import { orderApi } from "@/features/order/order.api";
import Dialog from "@/ui/dialog";

const ViewFinance: React.FC = () => {
  const [tab, setTab] = useQueryState("tab", { defaultValue: "waiting" });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget | null>(
    null
  );
  const revenueRef = useRef({ total: 0, count: 0 });
  const [, forceUpdate] = useState(0);

  const { data: nextMonthData, isLoading: loadingNextMonth } =
    orderApi.getOrders.useQuery({ billing: "next-month" });
  const { data: overdueData, isLoading: loadingOverdue } =
    orderApi.getOrders.useQuery({ billing: "overdue" });

  const waitingOrders = (nextMonthData?.orders ?? []).filter(
    (o) => o.paymentStatus === "waiting_for_payment"
  );
  const overdueOrders = overdueData?.orders ?? [];

  const activeOrders = tab === "waiting" ? waitingOrders : overdueOrders;
  const isLoading = tab === "waiting" ? loadingNextMonth : loadingOverdue;

  const batchMutation = orderApi.batchUpdateStatus.useMutation();

  const handleToggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSingleConfirm = useCallback(
    (id: string) => {
      const order = activeOrders.find((o) => o.id === id);
      if (!order) return;
      setConfirmTarget({ ids: [id], count: 1 });
    },
    [activeOrders]
  );

  const handleBatchConfirm = useCallback(() => {
    if (selectedIds.size === 0) return;
    setConfirmTarget({
      ids: Array.from(selectedIds),
      count: selectedIds.size,
    });
  }, [selectedIds]);

  const handleConfirmExecute = useCallback(() => {
    if (!confirmTarget) return;
    const confirmedOrders = activeOrders.filter((o) =>
      confirmTarget.ids.includes(o.id)
    );
    const revenue = confirmedOrders.reduce((sum, o) => sum + o.currentPrice, 0);

    batchMutation.mutate(
      {
        ids: confirmTarget.ids,
        paymentStatus: "up_to_date",
        updateBillingDate: true,
      },
      {
        onSuccess: () => {
          revenueRef.current = {
            total: revenueRef.current.total + revenue,
            count: revenueRef.current.count + confirmTarget.ids.length,
          };
          forceUpdate((n) => n + 1);
          setConfirmTarget(null);
          setSelectedIds(new Set());
          toast.success(
            `已將 ${confirmTarget.ids.length} 筆客戶狀態改為「正常繳費」並續期`
          );
        },
        onError: (err) => toast.error(err.message),
      }
    );
  }, [confirmTarget, activeOrders, batchMutation]);

  const handleDialogOpenChange = useCallback((open: boolean) => {
    if (!open) setConfirmTarget(null);
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4">
      <h1 className="text-2xl font-bold">財務管理</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setTab("waiting")}
          className={`pb-2 text-sm font-medium transition-colors ${
            tab === "waiting"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          已通知 ({waitingOrders.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("overdue")}
          className={`pb-2 text-sm font-medium transition-colors ${
            tab === "overdue"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          逾期 ({overdueOrders.length})
        </button>
      </div>

      {/* Selection Banner */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between rounded-md bg-blue-50 px-4 py-2">
          <span className="text-sm text-blue-700">
            已選了 {selectedIds.size} 筆
          </span>
          <button
            type="button"
            onClick={handleBatchConfirm}
            className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            批量確認繳費
          </button>
        </div>
      )}

      {/* Column Header */}
      <div className="flex items-center gap-3 px-4 text-xs font-medium text-gray-400">
        <div className="size-4 shrink-0" />
        <div className="w-24 shrink-0">ATM</div>
        <div className="w-16 shrink-0">狀態</div>
        <div className="flex-[1.2]">社區 / 戶別</div>
        <div className="flex-1">客戶</div>
        <div className="flex-1">合約期間</div>
        <div className="w-[70px] shrink-0">繳費期限</div>
        <div className="w-[70px] shrink-0 text-right">金額</div>
        <div className="w-20 shrink-0" />
      </div>

      {/* Card List */}
      {isLoading ? (
        <div className="py-12 text-center text-sm text-gray-400">載入中...</div>
      ) : activeOrders.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-400">
          目前沒有待確認的訂單
        </div>
      ) : (
        <div className="space-y-2">
          {activeOrders.map((order) => (
            <PaymentCard
              key={order.id}
              order={order}
              isSelected={selectedIds.has(order.id)}
              isPending={batchMutation.isPending}
              onToggle={handleToggle}
              onConfirm={handleSingleConfirm}
              isOverdue={tab === "overdue"}
            />
          ))}
        </div>
      )}

      {/* Revenue Summary */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">本月已確認收益</span>
          <span className="text-lg font-bold text-green-600">
            ${revenueRef.current.total.toLocaleString()}
          </span>
        </div>
        {revenueRef.current.count > 0 && (
          <div className="mt-1 text-xs text-gray-400">
            共 {revenueRef.current.count} 筆
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <Dialog.Root
        open={confirmTarget !== null}
        onOpenChange={handleDialogOpenChange}
      >
        <Dialog.Content size="sm">
          <Dialog.Header isClosable>
            <Dialog.Title>確認繳費</Dialog.Title>
            <Dialog.Description>
              確定要將 {confirmTarget?.count ?? 0}{" "}
              筆訂單標記為「正常繳費」並自動續期嗎？
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            <div className="flex items-center gap-3 rounded-md bg-green-50 px-4 py-3">
              <IconCheckCircle className="size-5 text-green-600" />
              <span className="text-sm text-green-800">
                狀態將更新為「正常繳費」，繳費期限自動延期
              </span>
            </div>
          </Dialog.Body>
          <Dialog.Footer
            haveCancel
            cancelText="取消"
            confirmText="確認"
            onConfirm={handleConfirmExecute}
            isAutoClose={false}
          />
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};

// Types
interface ConfirmTarget {
  ids: string[];
  count: number;
}

ViewFinance.displayName = "ViewFinance";
export default ViewFinance;
