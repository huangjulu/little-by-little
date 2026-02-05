import * as React from "react";
import { useState } from "react";
import { StatCard, CreateOrderButton } from "../molecules";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Order } from "../order-types";
import { ViewCreateOrder } from "../add-order/view/ViewCreateOrder";
// import { useMutation } from "@tanstack/react-query";

interface OrderHeaderProps {
  orders: Order[];
  className?: string;
}

/**
 * OrderHeader - 訂單頁面標題區有機體組件
 * 接收 API 取得的訂單資料，內部計算統計資訊
 */
export const OrderHeader: React.FC<OrderHeaderProps> = (props) => {
  const { orders, className } = props;

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const month = new Date().getMonth() + 1;

  // 計算當月有效營收，待透過 API 取得當月營收
  const totalRevenue = orders
    .filter((o) => o.status === "paid" || o.status === "running")
    .reduce((sum, o) => sum + o.total, 0);

  // const monthRevenue = orderApi.getMonthRevenue.useQuery({ month });

  const formattedRevenue = formatCurrency(totalRevenue);

  return (
    <>
      <header
        className={cn(
          "flex flex-col justify-between gap-4 sm:flex-row sm:items-center",
          className
        )}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">訂單管理</h1>
            <CreateOrderButton onClick={() => setIsDialogOpen(true)} />
          </div>
          <p className="text-sm text-gray-500">
            查看訂單狀態、基本明細與金額概況。後續可接上實際 API。
          </p>
        </div>
        <StatCard
          label={`${month}月有效營收（運行中＋已付款）`}
          value={formattedRevenue}
          className="text-sm"
        />
      </header>
      {isDialogOpen && (
        <ViewCreateOrder open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      )}
    </>
  );
};

OrderHeader.displayName = "OrderHeader";
