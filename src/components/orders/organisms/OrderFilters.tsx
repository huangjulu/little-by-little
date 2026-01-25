import * as React from "react";
import { useMemo } from "react";
import { StatusFilter } from "../molecules";
import type { StatusFilterValue } from "@/types/order";
import type { Order } from "@/types/order";
import { cn } from "@/lib/utils";

interface OrderFiltersProps {
  status: StatusFilterValue;
  onFiltersChange: (patch: { status?: StatusFilterValue }) => void;
  allOrders?: Order[];
  className?: string;
}

/**
 * OrderFilters - 訂單篩選區有機體組件（僅狀態方塊，Search 在 table 上方）
 */
export const OrderFilters: React.FC<OrderFiltersProps> = (props) => {
  const { status, onFiltersChange, allOrders = [], className } = props;

  const statusCounts = useMemo(
    () => ({
      all: allOrders.length,
      shipped: allOrders.filter((o) => o.status === "shipped").length,
      paid: allOrders.filter((o) => o.status === "paid").length,
      pending: allOrders.filter((o) => o.status === "pending").length,
    }),
    [allOrders]
  );

  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <StatusFilter
        value={status}
        onChange={(v) => onFiltersChange({ status: v })}
        statusCounts={statusCounts}
      />
    </section>
  );
};

OrderFilters.displayName = "OrderFilters";
