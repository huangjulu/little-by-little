import {
  useMutation,
  useQueryClient,
  queryOptions,
} from "@tanstack/react-query";
import type {
  Order,
  GetOrdersParams,
  CreateOrderParams,
  UpdateOrderStatusParams,
  ApiResponse,
} from "./types";
import { useFaultTolerantQuery } from "@/lib/hooks/useFaultTolerantQuery";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (params?: GetOrdersParams) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

// ─── Query Options（純設定，無 hooks，可用於 Server Component / prefetch） ────

export const orderQueryOptions = {
  list: (params?: GetOrdersParams) =>
    queryOptions({
      queryKey: orderKeys.list(params),
      queryFn: () => getOrders(params),
      staleTime: 5 * 60 * 1000,
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: orderKeys.detail(id),
      queryFn: () => getOrder(id),
      staleTime: 5 * 60 * 1000,
    }),
};

// ─── Public API Namespace ─────────────────────────────────────────────────────

export const orderApi = {
  getOrders: {
    useQuery: (params?: GetOrdersParams) =>
      useFaultTolerantQuery<
        ApiResponse<Order[]>,
        { orders: Order[]; total: number }
      >({
        queryKey: orderKeys.list(params),
        queryFn: () => getOrders(params),
        staleTime: 5 * 60 * 1000,
        select: (r) => ({ orders: r.data, total: r.total ?? 0 }),
        cacheKey: `orders-list-${JSON.stringify(params ?? {})}`,
        cacheGuard: isOrdersQueryData,
      }),
  },

  getOrder: {
    useQuery: (id: string | null) =>
      useFaultTolerantQuery<ApiResponse<Order>, Order>({
        queryKey: orderKeys.detail(id ?? ""),
        queryFn: () => getOrder(id ?? ""),
        staleTime: 5 * 60 * 1000,
        enabled: !!id,
        select: (r) => r.data,
        cacheKey: `orders-detail-${id ?? ""}`,
        cacheGuard: isOrder,
      }),
  },

  create: {
    useMutation: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: (params: CreateOrderParams) => createOrder(params),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
      });
    },
  },

  updateStatus: {
    useMutation: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: ({
          id,
          params,
        }: {
          id: string;
          params: UpdateOrderStatusParams;
        }) => updateOrderStatus(id, params),
        onSuccess: (response, variables) => {
          queryClient.setQueryData(
            orderKeys.detail(variables.id),
            (old: Order | undefined) => {
              if (!old) return undefined;
              return { ...old, ...response.data };
            }
          );
          queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
      });
    },
  },
} as const;

// ─── Fetch Functions（內部使用，不對外匯出） ──────────────────────────────────

async function getOrders(
  params?: GetOrdersParams
): Promise<ApiResponse<Order[]>> {
  const searchParams = new URLSearchParams();
  if (params?.status && params.status !== "all")
    searchParams.append("status", params.status);
  if (params?.keyword) searchParams.append("keyword", params.keyword);
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.pageSize)
    searchParams.append("pageSize", params.pageSize.toString());
  const qs = searchParams.toString();
  const res = await fetch(qs ? `/api/orders?${qs}` : "/api/orders");
  if (!res.ok) throw new Error("取得訂單列表失敗");
  return res.json();
}

async function getOrder(id: string): Promise<ApiResponse<Order>> {
  const res = await fetch(`/api/orders/${id}`);
  if (!res.ok) throw new Error("取得訂單失敗");
  return res.json();
}

async function createOrder(
  params: CreateOrderParams
): Promise<ApiResponse<Order>> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err: ApiResponse<never> = await res.json();
    throw new Error(err.message ?? "建立訂單失敗");
  }
  return res.json();
}

async function updateOrderStatus(
  id: string,
  params: UpdateOrderStatusParams
): Promise<ApiResponse<Order>> {
  const res = await fetch(`/api/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err: ApiResponse<never> = await res.json();
    throw new Error(err.message ?? "更新訂單失敗");
  }
  return res.json();
}

// ─── Type Guards（放下方，hoisting 保證上方可用） ─────────────────────────────

function isOrder(v: unknown): v is Order {
  return (
    typeof v === "object" &&
    v !== null &&
    typeof (v as Record<string, unknown>).id === "string" &&
    typeof (v as Record<string, unknown>).orderId === "number" &&
    typeof (v as Record<string, unknown>).customerName === "string" &&
    typeof (v as Record<string, unknown>).status === "string"
  );
}

function isOrdersQueryData(
  v: unknown
): v is { orders: Order[]; total: number } {
  return (
    typeof v === "object" &&
    v !== null &&
    Array.isArray((v as Record<string, unknown>).orders) &&
    ((v as Record<string, unknown>).orders as unknown[]).every(isOrder) &&
    typeof (v as Record<string, unknown>).total === "number"
  );
}
