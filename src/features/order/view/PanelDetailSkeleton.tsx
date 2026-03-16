import { cn } from "@/lib/utils";
import Skeleton from "@/ui/skeleton";

interface PanelDetailSkeletonProps {
  className?: string;
  showAvatar?: boolean;
  contentSections?: number;
}

/**
 * PanelDetailSkeleton - 通用詳情面板骨架組件
 * 模擬右側詳情面板，包含頭像區、多行長條、內容區塊
 */
const PanelDetailSkeleton: React.FC<PanelDetailSkeletonProps> = (props) => {
  const { className, showAvatar = false, contentSections = 3 } = props;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4",
        className
      )}
    >
      {/* 頂部標題區域 */}
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-48" />
        </div>
        {showAvatar ? (
          <Skeleton className="h-10 w-10 rounded-full" />
        ) : (
          <Skeleton className="h-6 w-16 rounded-full" />
        )}
      </div>

      <div className="space-y-4 text-xs">
        {/* 內容區塊 */}
        {Array.from({ length: contentSections }).map((_, sectionIndex) => (
          <div
            key={sectionIndex}
            className={cn(
              "rounded-lg border border-gray-200 bg-white px-3 py-3",
              sectionIndex === contentSections - 1 &&
                "border-dashed border-gray-300 bg-gray-100/70"
            )}
          >
            {sectionIndex === 0 ? (
              // 第一個區塊：基本資訊樣式
              <>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex justify-between gap-2 mt-3">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-3 w-16 ml-auto" />
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </div>
                </div>
              </>
            ) : sectionIndex === 1 ? (
              // 第二個區塊：列表樣式
              <>
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between"
                    >
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-2.5 w-20" />
                      </div>
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              // 其他區塊：簡單文字樣式
              <>
                <Skeleton className="h-3 w-32 mb-2" />
                <div className="space-y-1.5 pl-4">
                  <Skeleton className="h-2.5 w-full" />
                  <Skeleton className="h-2.5 w-3/4" />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

PanelDetailSkeleton.displayName = "PanelDetailSkeleton";

export default PanelDetailSkeleton;
