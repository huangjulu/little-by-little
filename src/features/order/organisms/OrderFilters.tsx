import { useMemo } from "react";

import { cn } from "@/lib/utils";

import StatusFilter from "../molecules/StatusFilter";
import type { Order, StatusFilterValue } from "../types";

interface OrderFiltersProps {
  status: StatusFilterValue;
  onFiltersChange: (patch: { status?: StatusFilterValue }) => void;
  allOrders?: Order[];
  className?: string;
}

/**
 * OrderFilters - 訂單篩選區有機體組件（僅狀態方塊，Search 在 table 上方）
 */
const OrderFilters: React.FC<OrderFiltersProps> = (props) => {
  const { status, onFiltersChange, allOrders = [], className } = props;

  const statusCounts = useMemo(
    () => ({
      all: allOrders.length,
      active: allOrders.filter((o) => o.status === "active").length,
      inactive: allOrders.filter((o) => o.status === "inactive").length,
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

export default OrderFilters;
