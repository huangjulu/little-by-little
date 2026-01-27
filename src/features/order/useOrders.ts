import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  type GetOrdersParams,
  type CreateOrderParams,
  type UpdateOrderStatusParams,
} from "./orders-api";
import type { Order } from "./order-types";

/**
 * Query Keys
 */
export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (params?: GetOrdersParams) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

/**
 * 取得訂單列表
 */
export function useOrders(params?: GetOrdersParams) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => getOrders(params),
    staleTime: 1000 * 60 * 5, // 5 分鐘
    select: (response) => response.data,
  });
}

/**
 * 取得單筆訂單
 */
export function useSingleOrderById(id: string | null) {
  return useQuery({
    queryKey: orderKeys.detail(id!),
    queryFn: () => getOrder(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 分鐘
    select: (response) => response.data,
  });
}

/**
 * 建立新訂單
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateOrderParams) => createOrder(params),
    onSuccess: () => {
      // 使訂單列表快取失效，重新取得
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

/**
 * 更新訂單狀態
 */
export function useUpdateOrderStatus() {
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
      // 更新單筆訂單快取
      queryClient.setQueryData(
        orderKeys.detail(variables.id),
        (old: Order | undefined) => {
          if (!old) return undefined;
          return { ...old, ...response.data };
        }
      );

      // 使訂單列表快取失效
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}
