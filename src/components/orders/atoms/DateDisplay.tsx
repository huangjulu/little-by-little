import * as React from "react";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface DateDisplayProps {
  dateString: string;
  variant?: "default" | "muted";
  className?: string;
}

/**
 * DateDisplay - 日期顯示原子組件
 */
export const DateDisplay: React.FC<DateDisplayProps> = (props) => {
  const { dateString, variant = "default", className } = props;

  const variantClasses = {
    default: "text-[11px] text-gray-500",
    muted: "text-[11px] text-gray-400",
  };

  return (
    <span className={cn(variantClasses[variant], className)}>
      {formatDate(dateString)}
    </span>
  );
};

DateDisplay.displayName = "DateDisplay";
