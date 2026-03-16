import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  variant?: "default" | "warning";
  className?: string;
}

/**
 * StatCard - 統計卡片分子組件
 */
const StatCard: React.FC<StatCardProps> = (props) => {
  return (
    <Card
      className={cn("px-4 py-2", "border-gray-200 bg-gray-50", props.className)}
    >
      <CardContent className="flex flex-col gap-1 p-0">
        <div className="text-xs text-gray-500">{props.label}</div>
        <div className="font-semibold">{props.value}</div>
      </CardContent>
    </Card>
  );
};

StatCard.displayName = "StatCard";

export default StatCard;
