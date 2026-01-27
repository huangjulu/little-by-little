import * as React from "react";
import { cn } from "@/lib/utils";

interface CustomerInfoProps {
  name: string;
  email: string;
  className?: string;
}

/**
 * CustomerInfo - 客戶資訊原子組件
 */
export const CustomerInfo: React.FC<CustomerInfoProps> = (props) => {
  return (
    <div className={cn("flex flex-col", props.className)}>
      <span className="text-xs font-medium">{props.name}</span>
      <span className="truncate text-[11px] text-gray-400">{props.email}</span>
    </div>
  );
};

CustomerInfo.displayName = "CustomerInfo";
