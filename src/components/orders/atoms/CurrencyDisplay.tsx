import * as React from "react";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface CurrencyDisplayProps {
  value: number;
  variant?: "default" | "semibold" | "mono";
  className?: string;
}

/**
 * CurrencyDisplay - 金額顯示原子組件
 */
export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = (props) => {
  const { value, variant = "default", className } = props;

  const variantClasses = {
    default: "text-xs",
    semibold: "text-sm font-semibold",
    mono: "font-mono text-xs",
  };

  return (
    <span className={cn(variantClasses[variant], className)}>
      {formatCurrency(value)}
    </span>
  );
};

CurrencyDisplay.displayName = "CurrencyDisplay";
