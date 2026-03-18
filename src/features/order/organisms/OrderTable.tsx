"use client";

import { parseAsString, useQueryState } from "nuqs";
import { useCallback } from "react";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";

import OrderRow from "../molecules/OrderRow";
import type { Order } from "../types";
import UploadOrderButton from "../upload-order/UploadOrderButton";

const OrderTable: React.FC<OrderTableProps> = (props) => {
  const [selectedId, setSelectedId] = useQueryState("orderId", parseAsString);

  const handleOrderClick = useCallback(
    (id: string) => {
      void setSelectedId((prev) => {
        const next = prev === id ? null : id;
        props.onSelectionChange?.(
          next ? props.orders.find((o) => o.id === next) ?? null : null
        );
        return next;
      });
    },
    [setSelectedId, props.onSelectionChange, props.orders]
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-gray-200 bg-white",
        props.className
      )}
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
        <span className="text-xs text-gray-500">
          共 {props.orders.length} 筆訂單
        </span>
        {!props.hideUpload && <UploadOrderButton />}
      </div>
      <div className="max-h-120 overflow-auto text-sm">
        <Table>
          <TableHeader>
            <TableRow
              className={cn(
                "bg-gray-50",
                " *:px-3 *:py-2 *:text-left *:text-xs *:font-medium *:text-gray-500"
              )}
            >
              <TableHead
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  props.checkbox
                    ? "w-10 max-w-10 opacity-100 p-3"
                    : "w-0 max-w-0 opacity-0 p-0 border-0"
                )}
              >
                {props.checkbox && (
                  <input
                    type="checkbox"
                    checked={
                      props.orders.length > 0 &&
                      props.checkbox.checkedIds.size === props.orders.length
                    }
                    onChange={() => {
                      if (
                        props.checkbox!.checkedIds.size === props.orders.length
                      ) {
                        props.checkbox!.onDeselectAll();
                      } else {
                        props.checkbox!.onSelectAll();
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 accent-blue-500"
                  />
                )}
              </TableHead>
              <TableHead>社區 / 戶別</TableHead>
              <TableHead>ATM</TableHead>
              <TableHead>客戶</TableHead>
              <TableHead>合約期間</TableHead>
              <TableHead>繳費期限</TableHead>
              <TableHead>金額</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>繳費狀態</TableHead>
              <TableHead
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  "w-0 max-w-0 opacity-0 p-0 border-0"
                )}
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.isLoading && <TableLoading colSpan={9} />}
            {!props.isLoading && props.orders.length === 0 ? (
              <TableEmpty colSpan={9} />
            ) : (
              props.orders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  isSelected={selectedId === order.id}
                  onOrderClick={handleOrderClick}
                  checkbox={
                    props.checkbox
                      ? {
                          checked: props.checkbox.checkedIds.has(order.id),
                          onToggle: props.checkbox.onToggle,
                        }
                      : undefined
                  }
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Types
interface OrderTableProps {
  orders: Order[];
  onSelectionChange?: (order: Order | null) => void;
  isLoading?: boolean;
  className?: string;
  checkbox?: {
    checkedIds: Set<string>;
    onToggle: (id: string) => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
  };
  hideUpload?: boolean;
}

OrderTable.displayName = "OrderTable";

export default OrderTable;

const TableLoading: React.FC<{ className?: string; colSpan?: number }> = (
  props
) => {
  return (
    <TableRow>
      <TableCell
        colSpan={props.colSpan ?? 5}
        className={cn(
          "px-4 py-10 text-center text-xs text-gray-400",
          props.className
        )}
      >
        載入中...
      </TableCell>
    </TableRow>
  );
};

const TableEmpty: React.FC<{ className?: string; colSpan?: number }> = (
  props
) => {
  return (
    <TableRow>
      <TableCell
        colSpan={props.colSpan ?? 5}
        className={cn(
          "px-4 py-10 text-center text-xs text-gray-400",
          props.className
        )}
      >
        找不到符合條件的訂單，試試調整搜尋關鍵字或狀態。
      </TableCell>
    </TableRow>
  );
};
