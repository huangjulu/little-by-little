import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderRow } from "../molecules";
import type { Order } from "@/types/order";
import { cn } from "@/lib/utils";

interface OrderTableProps {
  orders: Order[];
  selectedOrderId?: string | null;
  onOrderClick?: (orderId: string) => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * OrderTable - 訂單表格有機體組件（純 UI 呈現）
 * 選中狀態由父組件管理
 */
export const OrderTable: React.FC<OrderTableProps> = (props) => {
  const { orders, selectedOrderId, onOrderClick, isLoading, className } = props;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-gray-200 bg-white",
        className
      )}
    >
      <div className="border-b border-gray-100 px-4 py-2 text-xs text-gray-500">
        共 {orders.length} 筆訂單
      </div>
      <div className="max-h-[480px] overflow-auto text-sm">
        <Table>
          <TableHeader>
            <TableRow
              className={cn(
                "bg-gray-100",
                " *:px-3 *:py-2 *:text-left *:text-xs *:font-medium *:text-gray-500"
              )}
            >
              <TableHead>訂單編號</TableHead>
              <TableHead>客戶</TableHead>
              <TableHead>建立時間</TableHead>
              <TableHead>金額</TableHead>
              <TableHead>狀態</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableLoading />}
            {!isLoading && orders.length === 0 ? (
              <TableEmpty />
            ) : (
              orders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  isSelected={selectedOrderId === order.id}
                  onClick={() => onOrderClick?.(order.id)}
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

const TableLoading: React.FC<{ className?: string }> = (props) => {
  const { className } = props;
  return (
    <TableRow>
      <TableCell
        colSpan={5}
        className={cn(
          "px-4 py-10 text-center text-xs text-gray-400",
          className
        )}
      >
        載入中...
      </TableCell>
    </TableRow>
  );
};

const TableEmpty: React.FC<{ className?: string }> = (props) => {
  const { className } = props;
  return (
    <TableRow>
      <TableCell
        colSpan={5}
        className={cn(
          "px-4 py-10 text-center text-xs text-gray-400",
          className
        )}
      >
        找不到符合條件的訂單，試試調整搜尋關鍵字或狀態。
      </TableCell>
    </TableRow>
  );
};
