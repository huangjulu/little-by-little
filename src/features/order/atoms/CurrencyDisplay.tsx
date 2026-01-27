import * as React from "react";
import { formatCurrency } from "@/lib/formatters";

interface CurrencyDisplayProps {
  value: number;
  className?: string;
}

/**
 * CurrencyDisplay - 金額顯示原子組件
 */
export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = (props) => {
  return <span className={props.className}>{formatCurrency(props.value)}</span>;
};

CurrencyDisplay.displayName = "CurrencyDisplay";
