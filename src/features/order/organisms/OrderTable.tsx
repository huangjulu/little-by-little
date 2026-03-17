"use client";

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

interface OrderTableProps {
  orders: Order[];
  selectedOrderId?: string | null;
  onOrderClick?: (orderId: string) => void;
  isLoading?: boolean;
  className?: string;
  billingMode?: boolean;
  checkedIds?: Set<string>;
  onToggleCheck?: (id: string) => void;
  onPrint?: (id: string) => void;
  onMarkPaid?: (id: string) => void;
  printedIds?: Set<string>;
  hideUpload?: boolean;
}

/**
 * OrderTable - 訂單表格有機體組件（純 UI 呈現）
 * 選中狀態由父組件管理
 */
const OrderTable: React.FC<OrderTableProps> = (props) => {
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
                  props.billingMode
                    ? "w-10 max-w-10 opacity-100 p-3"
                    : "w-0 max-w-0 opacity-0 p-0 border-0"
                )}
              />
              <TableHead>訂單編號</TableHead>
              <TableHead>客戶</TableHead>
              <TableHead>合約期間</TableHead>
              <TableHead>繳費期限</TableHead>
              <TableHead>金額</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  props.billingMode
                    ? "w-24 max-w-24 opacity-100 p-3"
                    : "w-0 max-w-0 opacity-0 p-0 border-0"
                )}
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.isLoading && <TableLoading colSpan={8} />}
            {!props.isLoading && props.orders.length === 0 ? (
              <TableEmpty colSpan={8} />
            ) : (
              props.orders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  isSelected={props.selectedOrderId === order.id}
                  onOrderClick={props.onOrderClick}
                  billingMode={props.billingMode}
                  checked={props.checkedIds?.has(order.id)}
                  onToggleCheck={props.onToggleCheck}
                  onPrint={props.onPrint}
                  onMarkPaid={props.onMarkPaid}
                  isPrinted={props.printedIds?.has(order.id)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

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
