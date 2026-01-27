# React Query 整合說明

## 架構概述

專案已完整整合 **TanStack React Query**，實現了 API 層與業務邏輯的完全隔離。

### 目錄結構

```
src/
├── lib/
│   └── api/              # API 層（隔離層）
│       ├── orders.ts     # 訂單相關 API 函數
│       └── index.ts      # API 統一匯出
├── hooks/                # React Query Hooks
│   ├── useOrders.ts      # 訂單相關 Hooks
│   └── index.ts          # Hooks 統一匯出
└── providers/
    └── QueryProvider.tsx # React Query Provider
```

## API 層（隔離層）

### `src/lib/api/orders.ts`

所有 API 請求都在這裡定義，完全隔離了 HTTP 請求邏輯：

```typescript
// GET 請求
export async function getOrders(
  params?: GetOrdersParams
): Promise<ApiResponse<Order[]>>;

// POST 請求
export async function createOrder(
  params: CreateOrderParams
): Promise<ApiResponse<Order>>;

// PATCH 請求
export async function updateOrderStatus(
  id: string,
  params: UpdateOrderStatusParams
): Promise<ApiResponse<Order>>;
```

**特點：**

- ✅ 統一的錯誤處理
- ✅ 統一的回應格式
- ✅ 型別安全
- ✅ 易於測試和維護

## React Query Hooks

### `src/hooks/useOrders.ts`

提供所有訂單相關的 React Query Hooks：

#### 查詢 Hooks

**`useOrders(params?)`** - 取得訂單列表

```typescript
const { data, isLoading, error } = useOrders({
  status: "pending",
  keyword: "王小明",
});
```

**`useSingleOrderById(id)`** - 取得單筆訂單

```typescript
const { data, isLoading, error } = useOrder("ORD-240101-001");
```

#### 變更 Hooks

**`useCreateOrder()`** - 建立新訂單

```typescript
const createOrderMutation = useCreateOrder();

createOrderMutation.mutate({
  customerName: "張三",
  email: "zhangsan@example.com",
  items: [{ name: "Pro Plan", quantity: 1, price: 2990 }],
});
```

**`useUpdateOrderStatus()`** - 更新訂單狀態

```typescript
const updateStatusMutation = useUpdateOrderStatus();

updateStatusMutation.mutate({
  id: "ORD-240101-001",
  params: { status: "paid" },
});
```

### Query Keys

使用標準化的 Query Keys 結構：

```typescript
orderKeys.all; // ["orders"]
orderKeys.lists(); // ["orders", "list"]
orderKeys.list(params); // ["orders", "list", params]
orderKeys.details(); // ["orders", "detail"]
orderKeys.detail(id); // ["orders", "detail", id]
```

這樣的結構方便：

- 統一管理快取
- 精確控制失效範圍
- 支援部分更新

## 使用範例

### 在元件中使用

```typescript
"use client";

import { useOrders, useCreateOrder } from "@/hooks";

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders({ status: "pending" });
  const createOrder = useCreateOrder();

  const handleCreate = () => {
    createOrder.mutate({
      customerName: "張三",
      email: "zhangsan@example.com",
      items: [{ name: "Pro Plan", quantity: 1, price: 2990 }],
    });
  };

  if (isLoading) return <div>載入中...</div>;

  return (
    <div>
      {orders?.map((order) => (
        <div key={order.id}>{order.id}</div>
      ))}
    </div>
  );
}
```

## 設定

### QueryClient 設定

在 `src/providers/QueryProvider.tsx` 中：

```typescript
{
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,        // 1 分鐘內資料被視為新鮮
      gcTime: 5 * 60 * 1000,       // 5 分鐘後從快取移除
      retry: 1,                     // 失敗時重試 1 次
      refetchOnWindowFocus: false,  // 視窗聚焦時不重新取得
    },
  },
}
```

## 優點

### 1. **API 隔離**

- API 請求邏輯集中在 `lib/api/`
- 元件不需要知道 API 實作細節
- 容易替換 API 實作（例如從 REST 改為 GraphQL）

### 2. **自動快取管理**

- React Query 自動管理快取
- 相同的查詢會使用快取，不會重複請求
- 自動失效和重新取得

### 3. **樂觀更新**

- 支援樂觀更新（可在 mutation 中設定）
- 提升使用者體驗

### 4. **錯誤處理**

- 統一的錯誤處理機制
- 元件中可以輕鬆取得錯誤狀態

### 5. **載入狀態**

- 自動管理 `isLoading`、`isFetching` 狀態
- 元件可以輕鬆顯示載入畫面

### 6. **型別安全**

- 完整的 TypeScript 支援
- 編譯時就能發現型別錯誤

## 未來擴充

### 分頁支援

```typescript
export function useOrders(params: GetOrdersParams & { page?: number }) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => getOrders(params),
    keepPreviousData: true, // 分頁時保持前一頁資料
  });
}
```

### 無限滾動

```typescript
import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfiniteOrders() {
  return useInfiniteQuery({
    queryKey: ["orders", "infinite"],
    queryFn: ({ pageParam = 1 }) => getOrders({ page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
  });
}
```

### 樂觀更新

```typescript
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,
    onMutate: async (newData) => {
      // 取消進行中的查詢
      await queryClient.cancelQueries({
        queryKey: orderKeys.detail(newData.id),
      });

      // 快照目前的值
      const previousOrder = queryClient.getQueryData(
        orderKeys.detail(newData.id)
      );

      // 樂觀更新
      queryClient.setQueryData(orderKeys.detail(newData.id), (old) => ({
        ...old,
        ...newData.params,
      }));

      return { previousOrder };
    },
    onError: (err, newData, context) => {
      // 發生錯誤時還原
      queryClient.setQueryData(
        orderKeys.detail(newData.id),
        context?.previousOrder
      );
    },
  });
}
```
