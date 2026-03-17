import { useMemo, useState } from "react";

import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

import CreateOrderForm from "../add-order/CreateOrderButton";
import StatCard from "../molecules/StatCard";
import type { Order } from "../types";

interface OrderHeaderProps {
  orders: Order[];
  className?: string;
}

const OrderHeader: React.FC<OrderHeaderProps> = (props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const thisMonth = new Date().getMonth() + 1;

  const formattedRevenue = useMemo(() => {
    const total = props.orders
      .filter((o) => o.status === "active")
      .reduce((sum, o) => sum + o.currentPrice, 0);
    return formatCurrency(total);
  }, [props.orders]);

  return (
    <header
      className={cn(
        "flex flex-col justify-between gap-4 sm:flex-row sm:items-center",
        props.className
      )}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">訂單管理</h1>
          <CreateOrderForm
            onClick={() => setIsDialogOpen(true)}
            open={isDialogOpen}
            setOpen={setIsDialogOpen}
          />
        </div>
        <p className="text-sm text-gray-500">查看訂單狀態與金額概況。</p>
      </div>
      <StatCard
        label={`${thisMonth}月啟用中營收`}
        value={formattedRevenue}
        className="text-sm"
      />
    </header>
  );
};

OrderHeader.displayName = "OrderHeader";

export default OrderHeader;
