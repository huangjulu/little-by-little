import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface OrderDetailPanelSkeletonProps {
  className?: string;
}

/**
 * OrderDetailPanelSkeleton - 訂單詳情面板骨架屏組件
 */
export const OrderDetailPanelSkeleton: React.FC<
  OrderDetailPanelSkeletonProps
> = (props) => {
  const { className } = props;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-100/80 p-4",
        className
      )}
    >
      {/* 標題區域 */}
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      <div className="space-y-4 text-xs">
        {/* 基本資訊卡片 */}
        <div className="space-y-3 rounded-lg border border-gray-200 bg-white px-3 py-3">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="mt-2 flex justify-between gap-2">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-36" />
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="h-3 w-16 ml-auto" />
              <Skeleton className="h-4 w-20 ml-auto" />
            </div>
          </div>
        </div>

        {/* 品項清單卡片 */}
        <div className="space-y-2 rounded-lg border border-gray-200 bg-white px-3 py-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-2.5 w-20" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* API 建議卡片 */}
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-100/70 px-3 py-3">
          <Skeleton className="h-3 w-32 mb-2" />
          <div className="space-y-1.5 pl-4">
            <Skeleton className="h-2.5 w-full" />
            <Skeleton className="h-2.5 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
};

OrderDetailPanelSkeleton.displayName = "OrderDetailPanelSkeleton";
