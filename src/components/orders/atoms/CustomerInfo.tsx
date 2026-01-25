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
  const { name, email, className } = props;

  return (
    <div className={cn("flex flex-col", className)}>
      <span className="text-xs font-medium">{name}</span>
      <span className="truncate text-[11px] text-gray-400">{email}</span>
    </div>
  );
};

CustomerInfo.displayName = "CustomerInfo";
