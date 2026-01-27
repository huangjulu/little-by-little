import * as React from "react";
import { formatDate } from "@/lib/formatters";

interface DateDisplayProps {
  dateString: string;
  variant?: "default" | "muted";
  className?: string;
}

/**
 * DateDisplay - 日期顯示原子組件
 */
export const DateDisplay: React.FC<DateDisplayProps> = (props) => {
  return (
    <span className={props.className}>{formatDate(props.dateString)}</span>
  );
};

DateDisplay.displayName = "DateDisplay";
