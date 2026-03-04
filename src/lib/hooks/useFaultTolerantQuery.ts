import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  QueryKey,
  UseQueryResult,
  QueryFunction,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { localCacheGet, localCacheSet } from "@/lib/local-cache";

// ─── Public Types ─────────────────────────────────────────────────────────────

export type FaultTolerantQueryOptions<TQueryFnData, TData = TQueryFnData> = {
  queryKey: QueryKey;
  queryFn: QueryFunction<TQueryFnData>;
  cacheKey: string;
  cacheGuard: (v: unknown) => v is TData;
  select?: (data: TQueryFnData) => TData;
  staleTime?: number;
  enabled?: boolean;
};

export type FaultTolerantQueryResult<TData> = {
  data: TData | undefined;
  isLoading: boolean;
  error: Error | null;
  isCachedFallback: boolean;
  refetch: UseQueryResult<TData>["refetch"];
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFaultTolerantQuery<TQueryFnData, TData = TQueryFnData>(
  options: FaultTolerantQueryOptions<TQueryFnData, TData>
): FaultTolerantQueryResult<TData> {
  const { queryKey, cacheKey, cacheGuard, select, staleTime, enabled } =
    options;

  const [cachedData, setCachedData] = useState<TData | undefined>(undefined);
  const [isCachedFallback, setIsCachedFallback] = useState(false);
  const toastShownRef = useRef(false);

  const wrappedQueryFn = buildWrappedQueryFn(options.queryFn);

  const query = useQuery<TQueryFnData, Error, TData>({
    queryKey,
    queryFn: wrappedQueryFn,
    select,
    staleTime,
    enabled,
    retry: (failureCount, error) => !isOfflineError(error) && failureCount < 2,
    throwOnError: (error) => !isOfflineError(error),
  });

  useEffect(
    function handleQueryError() {
      if (!query.error) return;
      if (toastShownRef.current) return;

      const cached = localCacheGet(cacheKey, cacheGuard);
      if (cached !== null) {
        setCachedData(cached);
        setIsCachedFallback(true);
      }

      toastShownRef.current = true;
      if (isOfflineError(query.error)) {
        toast.warning("目前離線，顯示最近快取資料", { id: cacheKey });
      } else {
        toast.error("連線不穩，請稍後再試", { id: cacheKey });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query.error, cacheKey]
  );

  useEffect(
    function syncSuccessToCache() {
      if (!query.data) return;
      localCacheSet(cacheKey, query.data);
      toast.dismiss(cacheKey);
      toastShownRef.current = false;
      setCachedData(undefined);
      setIsCachedFallback(false);
    },
    [query.data, cacheKey]
  );

  return {
    data: query.data ?? cachedData,
    isLoading: query.isLoading,
    error: query.error,
    isCachedFallback,
    refetch: query.refetch,
  };
}

// ─── 輔助類別 & 函式（hoisting 保證 hook 內可用） ────────────────────────────

class OfflineError extends Error {
  readonly isOffline = true;
  constructor() {
    super("目前離線");
    this.name = "OfflineError";
  }
}

function isOfflineError(error: unknown): error is OfflineError {
  return (
    error instanceof OfflineError ||
    (error instanceof Error && "isOffline" in error && error.isOffline === true)
  );
}

function buildWrappedQueryFn<TQueryFnData>(
  originalQueryFn: QueryFunction<TQueryFnData>
): QueryFunction<TQueryFnData> {
  return function wrappedQueryFn(context) {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      throw new OfflineError();
    }
    return originalQueryFn(context);
  };
}
