import * as React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  variant?: "default" | "warning";
  className?: string;
}

/**
 * StatCard - 統計卡片分子組件
 */
export const StatCard: React.FC<StatCardProps> = (props) => {
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-2 text-sm",
        "border-gray-200 bg-gray-50",
        props.className
      )}
    >
      <div className="text-xs text-gray-500">{props.label}</div>
      <div className="mt-1 font-semibold">{props.value}</div>
    </div>
  );
};

StatCard.displayName = "StatCard";
