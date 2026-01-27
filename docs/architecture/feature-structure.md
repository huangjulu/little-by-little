# Feature 結構規範

## 目錄結構規則

當在 `src/features/` 下建立新的功能模組（如 `order`、`finance`、`history`）時，請遵循以下結構規範：

### 基本結構

```
src/features/{feature-name}/
├── atoms/              # 原子組件（最基礎的組件）
├── molecules/          # 分子組件（組合多個原子組件）
├── organisms/          # 有機體組件（組合多個分子和原子組件）
├── {feature}-types.ts  # 類型定義（單檔，直接命名）
├── {feature}-api.ts    # API 函數（單檔，直接命名）
├── use{Feature}.ts     # React Query Hooks（單檔，直接命名）
├── constants.ts        # 常數定義
└── index.ts           # 統一匯出
```

### 重要規則

1. **組件結構扁平化**

   - ❌ 不要使用 `components/atoms`、`components/molecules`、`components/organisms`
   - ✅ 直接使用 `atoms/`、`molecules/`、`organisms/` 在 feature 根目錄下

2. **單檔命名規則**

   - 如果 `api`、`hooks`、`types` 資料夾內只有一個檔案，不要建立資料夾
   - 直接以檔案名稱命名：
     - `api/orders.ts` → `orders-api.ts`
     - `hooks/useOrders.ts` → `useOrders.ts`
     - `types/order.ts` → `order-types.ts`

3. **組件層級**

   - `atoms/` - 最基礎的原子組件（如 StatusBadge、OrderId）
   - `molecules/` - 組合多個原子組件的分子組件（如 OrderRow、StatusFilter）
   - `organisms/` - 組合多個分子和原子組件的有機體組件（如 OrderTable、OrderDetailPanel）

4. **匯出方式**
   - 每個層級（atoms、molecules、organisms）都有自己的 `index.ts`
   - feature 根目錄的 `index.ts` 統一匯出所有公開的組件、hooks、types 和常數

### 範例：Order Feature

```
src/features/order/
├── atoms/
│   ├── StatusBadge.tsx
│   ├── OrderId.tsx
│   ├── DateDisplay.tsx
│   ├── CurrencyDisplay.tsx
│   ├── CustomerInfo.tsx
│   └── index.ts
├── molecules/
│   ├── OrderRow.tsx
│   ├── OrderItemRow.tsx
│   ├── SearchInput.tsx
│   ├── StatCard.tsx
│   ├── StatusFilter.tsx
│   └── index.ts
├── organisms/
│   ├── OrderTable.tsx
│   ├── OrderDetailPanel.tsx
│   ├── OrderFilters.tsx
│   ├── OrderHeader.tsx
│   └── index.ts
├── order-types.ts
├── orders-api.ts
├── useOrders.ts
├── constants.ts
└── index.ts
```

### 使用方式

```typescript
// 從 feature 統一匯出使用
import {
  OrderHeader,
  OrderFilters,
  OrderTable,
  OrderDetailPanel,
  SearchInput,
  useOrders,
  useSingleOrderById,
  type StatusFilterValue,
  type Order,
} from "@/features/order";
```

### 未來新增 Feature 時

當需要新增 `finance`、`history` 等功能時，請遵循相同的結構規範：

```
src/features/finance/
├── atoms/
├── molecules/
├── organisms/
├── finance-types.ts
├── finance-api.ts
├── useFinance.ts
├── constants.ts
└── index.ts
```
