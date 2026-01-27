import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card
      className={cn(
        "px-4 py-2 text-sm",
        "border-gray-200 bg-gray-50",
        props.className
      )}
    >
      <CardContent className="p-0">
        <div className="text-xs text-gray-500">{props.label}</div>
        <div className="mt-1 font-semibold">{props.value}</div>
      </CardContent>
    </Card>
  );
};

StatCard.displayName = "StatCard";
