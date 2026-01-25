import type { Order, OrderStatus, StatusFilterValue } from "@/types/order";

/**
 * API Response 型別
 */
export interface ApiResponse<T> {
  error: boolean;
  data: T;
  message?: string;
  total?: number;
}

export interface GetOrdersParams {
  status?: StatusFilterValue;
  keyword?: string;
}

export interface CreateOrderParams {
  customerName: string;
  email: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

export interface UpdateOrderStatusParams {
  status: OrderStatus;
}

/**
 * 取得訂單列表
 */
export async function getOrders(
  params?: GetOrdersParams
): Promise<ApiResponse<Order[]>> {
  const searchParams = new URLSearchParams();

  if (params?.status && params.status !== "all") {
    searchParams.append("status", params.status);
  }

  if (params?.keyword) {
    searchParams.append("keyword", params.keyword);
  }

  const queryString = searchParams.toString();
  const url = queryString ? `/api/orders?${queryString}` : "/api/orders";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("取得訂單列表失敗");
  }

  return response.json();
}

/**
 * 取得單筆訂單
 */
export async function getOrder(id: string): Promise<ApiResponse<Order>> {
  const response = await fetch(`/api/orders/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("取得訂單失敗");
  }

  return response.json();
}

/**
 * 建立新訂單
 */
export async function createOrder(
  params: CreateOrderParams
): Promise<ApiResponse<Order>> {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "建立訂單失敗");
  }

  return response.json();
}

/**
 * 更新訂單狀態
 */
export async function updateOrderStatus(
  id: string,
  params: UpdateOrderStatusParams
): Promise<ApiResponse<Order>> {
  const response = await fetch(`/api/orders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "更新訂單失敗");
  }

  return response.json();
}
