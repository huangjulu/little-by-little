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
  const { label, value, variant = "default", className } = props;

  const variantClasses = {
    default: "border-gray-200 bg-gray-100",
    warning: "border-yellow-200 bg-yellow-100",
  };

  const labelClasses = {
    default: "text-xs text-gray-500",
    warning: "text-xs text-yellow-700",
  };

  const valueClasses = {
    default: "mt-1 font-semibold",
    warning: "mt-1 text-right text-lg font-semibold text-yellow-800",
  };

  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-2 text-sm",
        variantClasses[variant],
        className
      )}
    >
      <div className={cn(labelClasses[variant])}>{label}</div>
      <div className={cn(valueClasses[variant])}>{value}</div>
    </div>
  );
};

StatCard.displayName = "StatCard";
