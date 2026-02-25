import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  type ApiResponse,
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
export function useOrders(
  params?: GetOrdersParams
): UseQueryResult<Order[], Error> {
  return useQuery<ApiResponse<Order[]>, Error, Order[]>({
    queryKey: orderKeys.list(params),
    queryFn: () => getOrders(params),
    staleTime: 1000 * 60 * 5, // 5 分鐘
    select: (response) => response.data,
  });
}

/**
 * 取得單筆訂單
 */
export function useSingleOrderById(
  id: string | null
): UseQueryResult<Order | undefined, Error> {
  return useQuery<ApiResponse<Order>, Error, Order | undefined>({
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
export function useCreateOrder(): UseMutationResult<
  ApiResponse<Order>,
  Error,
  CreateOrderParams
> {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Order>, Error, CreateOrderParams>({
    mutationFn: (params) => createOrder(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

/**
 * 更新訂單狀態
 */
export function useUpdateOrderStatus(): UseMutationResult<
  ApiResponse<Order>,
  Error,
  { id: string; params: UpdateOrderStatusParams }
> {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Order>,
    Error,
    { id: string; params: UpdateOrderStatusParams }
  >({
    mutationFn: ({ id, params }) => updateOrderStatus(id, params),
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
}
