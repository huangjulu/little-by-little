import * as React from "react";
import { useState } from "react";
import { StatCard, CreateOrderButton } from "../molecules";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Order } from "../types";
import { ViewCreateOrder } from "../add-order/view/ViewCreateOrder";

interface OrderHeaderProps {
  orders: Order[];
  className?: string;
}

export const OrderHeader: React.FC<OrderHeaderProps> = (props) => {
  const { orders, className } = props;

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const month = new Date().getMonth() + 1;

  const totalRevenue = orders
    .filter((o) => o.status === "active")
    .reduce((sum, o) => sum + o.currentPrice, 0);

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
          <p className="text-sm text-gray-500">查看訂單狀態與金額概況。</p>
        </div>
        <StatCard
          label={`${month}月啟用中營收`}
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
