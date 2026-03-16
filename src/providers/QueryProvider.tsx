"use client";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { isOfflineError } from "@/lib/network-error";

/**
 * QueryClient 設定
 */
function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError(error, query) {
        const id = JSON.stringify(query.queryKey);
        if (isOfflineError(error)) {
          toast.warning("目前離線", { id });
        } else {
          toast.error("連線不穩，請稍後再試", { id });
        }
      },
      onSuccess(_data, query) {
        toast.dismiss(JSON.stringify(query.queryKey));
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 分鐘
        gcTime: 5 * 60 * 1000, // 5 分鐘 (舊版叫 cacheTime)
        retry: (failureCount, error) =>
          !isOfflineError(error) && failureCount < 2,
        throwOnError: (error) => !isOfflineError(error),
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: 每次都建立新的 QueryClient
    return makeQueryClient();
  } else {
    // Browser: 使用單例模式，避免在開發時重新建立
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}

/**
 * QueryProvider - React Query 的 Provider 元件
 */

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
