import { cn } from "@/lib/utils";

const Skeleton: React.FC<SkeletonProps> = (props) => {
  const { className, rows = 1, rowClassName, ...rest } = props;
  const baseClassName = "animate-pulse rounded-md bg-gray-200";

  if (rows > 1) {
    return (
      <div className={cn("space-y-3", className)} {...rest}>
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className={cn(baseClassName, rowClassName)} />
        ))}
      </div>
    );
  }

  return <div className={cn(baseClassName, className)} {...rest} />;
};

Skeleton.displayName = "Skeleton";

export default Skeleton;

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 要渲染的 Skeleton row 數量。
   * - 預設 1（單一 Skeleton）
   * - 設為 2 以上時，會渲染多個 Skeleton row
   */
  rows?: number;
  /**
   * 每個 row 的 className。
   * - 當 rows > 1 時，每個 row 會套用此 className
   * - 可用來控制每個 row 的寬度、高度等樣式
   */
  rowClassName?: string;
}
