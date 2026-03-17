import { useCallback } from "react";

import { cn } from "@/lib/utils";

import { statusFilterOptions } from "../constants";
import type { StatusCounts, StatusFilterValue } from "../types";

interface StatusFilterProps {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
  statusCounts?: Partial<StatusCounts>;
  className?: string;
}

/**
 * StatusFilter - 狀態篩選器分子組件（四個方塊，選中為 primary，顯示各狀態數量）
 */
const StatusFilter: React.FC<StatusFilterProps> = (props) => {
  const { value, onChange, statusCounts, className } = props;

  const handleOptionClick = useCallback(
    (optionValue: StatusFilterValue) => {
      onChange(optionValue);
    },
    [onChange]
  );

  return (
    <div
      className={cn("grid grid-cols-3 gap-3", className)}
      role="group"
      aria-label="訂單狀態篩選"
    >
      {statusFilterOptions.map((option) => {
        const isSelected = value === option.value;
        const count = statusCounts?.[option.value] ?? 0;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleOptionClick(option.value)}
            className={cn(
              "flex flex-col items-start justify-center rounded-xl border px-4 py-3 text-left transition-colors",
              isSelected
                ? "border-primary bg-blue-200 text-blue-800 shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            <span className="text-sm font-medium">{option.label}</span>
            <span
              className={cn(
                "mt-1 text-2xl font-semibold tabular-nums",
                isSelected ? "text-blue-800" : "text-gray-800"
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

StatusFilter.displayName = "StatusFilter";

export default StatusFilter;
