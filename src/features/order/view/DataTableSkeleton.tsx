import { cn } from "@/lib/utils";
import Skeleton from "@/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";

interface DataTableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
  showHeader?: boolean;
  showSummary?: boolean;
}

/**
 * DataTableSkeleton - 通用資料表格骨架組件
 * 使用 Table 結構，第一列為標題列，後續為模擬資料列
 */
const DataTableSkeleton: React.FC<DataTableSkeletonProps> = (props) => {
  const {
    rows = 5,
    columns = 5,
    className,
    showHeader = true,
    showSummary = false,
  } = props;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-gray-200 bg-white",
        className
      )}
    >
      {showSummary && (
        <div className="border-b border-gray-100 px-4 py-2 text-xs text-gray-500">
          <Skeleton className="h-4 w-24" />
        </div>
      )}
      <div className="max-h-120 overflow-auto text-sm">
        <Table>
          {showHeader && (
            <TableHeader>
              <TableRow className="bg-gray-100 *:px-3 *:py-2 *:text-left *:text-xs *:font-medium *:text-gray-500">
                {Array.from({ length: columns }).map((_, index) => (
                  <TableHead key={index}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="border-b border-gray-100 *:px-3 *:py-3"
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton
                      className={cn(
                        "h-4",
                        colIndex === 0 && "w-32",
                        colIndex === 1 && "w-28",
                        colIndex === 2 && "w-24",
                        colIndex === 3 && "w-20",
                        colIndex >= 4 && "w-16"
                      )}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

DataTableSkeleton.displayName = "DataTableSkeleton";

export default DataTableSkeleton;
