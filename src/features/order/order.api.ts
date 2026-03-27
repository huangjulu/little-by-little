import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { OfflineError } from "@/lib/network-error";

import type { ApiResponse } from "@/types/api";

import type {
  CreateOrderParams,
  GetOrdersParams,
  Order,
  PaymentStatus,
  UpdateOrderStatusParams,
} from "./types";

// ─── Raw API Functions ───────────────────────────────────────────────────────

async function fetchBillingPdf(orders: Order[]): Promise<Blob> {
  const res = await fetch("/api/orders/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orders }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? "PDF 產生失敗");
  }

  return res.blob();
}

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
      useQuery({
        queryKey: orderKeys.list(params),
        queryFn: () => getOrders(params),
        staleTime: 5 * 60 * 1000,
      }),
  },

  getOrder: {
    useQuery: (id: string | null) =>
      useQuery({
        queryKey: orderKeys.detail(id ?? ""),
        queryFn: () => getOrder(id ?? ""),
        staleTime: 5 * 60 * 1000,
        enabled: !!id,
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

  import: {
    useMutation: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: (orders: CreateOrderParams[]) => importOrders(orders),
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
              return { ...old, ...response };
            }
          );
          queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
      });
    },
  },

  batchUpdateStatus: {
    useMutation: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: (params: BatchUpdateStatusParams) =>
          batchUpdateStatus(params),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
      });
    },
  },

  fetchBillingPdf,
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────

interface BatchUpdateStatusParams {
  ids: string[];
  paymentStatus: PaymentStatus;
  updateBillingDate?: boolean;
}

// ─── Fetch Functions（內部使用，不對外匯出） ──────────────────────────────────

async function getOrders(
  params?: GetOrdersParams
): Promise<{ orders: Order[]; total: number }> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new OfflineError();
  }
  const searchParams = new URLSearchParams();
  if (params?.status && params.status !== "all")
    searchParams.append("status", params.status);
  if (params?.billing) searchParams.append("billing", params.billing);
  if (params?.keyword) searchParams.append("keyword", params.keyword);
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.pageSize)
    searchParams.append("pageSize", params.pageSize.toString());
  const qs = searchParams.toString();
  const res = await fetch(qs ? `/api/orders?${qs}` : "/api/orders");
  if (!res.ok) throw new Error("取得訂單列表失敗");
  const json: ApiResponse<Order[]> = await res.json();
  return { orders: json.data ?? [], total: json.total ?? 0 };
}

async function getOrder(id: string): Promise<Order> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new OfflineError();
  }
  const res = await fetch(`/api/orders/${id}`);
  if (!res.ok) throw new Error("取得訂單失敗");
  const json: ApiResponse<Order> = await res.json();
  return json.data as Order;
}

async function createOrder(params: CreateOrderParams): Promise<Order> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err: ApiResponse<never> = await res.json();
    throw new Error(err.message ?? "建立訂單失敗");
  }
  const json: ApiResponse<Order> = await res.json();
  return json.data as Order;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: { index: number; message: string }[];
}

async function importOrders(
  orders: CreateOrderParams[]
): Promise<ImportResult> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new OfflineError();
  }
  const res = await fetch("/api/orders/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orders }),
  });
  if (!res.ok) {
    const err: ApiResponse<never> = await res.json();
    throw new Error(err.message ?? "匯入訂單失敗");
  }
  const json: ApiResponse<ImportResult> = await res.json();
  return json.data as ImportResult;
}

async function updateOrderStatus(
  id: string,
  params: UpdateOrderStatusParams
): Promise<Order> {
  const res = await fetch(`/api/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err: ApiResponse<never> = await res.json();
    throw new Error(err.message ?? "更新訂單失敗");
  }
  const json: ApiResponse<Order> = await res.json();
  return json.data as Order;
}

async function batchUpdateStatus(
  params: BatchUpdateStatusParams
): Promise<{ updated: number; status: string }> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new OfflineError();
  }
  const res = await fetch("/api/orders/batch-status", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err: ApiResponse<never> = await res.json();
    throw new Error(err.message ?? "批量更新狀態失敗");
  }
  const json: ApiResponse<{ updated: number; status: string }> =
    await res.json();
  return json.data as { updated: number; status: string };
}
