# Feature 結構規範

## 目錄結構規則

當在 `src/features/` 下建立新的功能模組（如 `order`、`finance`、`history`）時，請遵循以下結構規範：

### 基本結構

```
src/features/{feature-name}/
├── atoms/              # 原子組件（最基礎的組件）
├── molecules/          # 分子組件（組合多個原子組件）
├── organisms/          # 有機體組件（組合多個分子和原子組件）
├── {sub-feature}/      # 子功能目錄（如 billing/、upload-order/、add-order/）
├── types.ts            # 類型定義
├── order.api.ts        # API namespace（TanStack React Query）
├── constants.ts        # 常數定義
└── view/               # 頁面層級視圖
```

### 重要規則

1. **組件結構扁平化**

   - ❌ 不要使用 `components/atoms`、`components/molecules`、`components/organisms`
   - ✅ 直接使用 `atoms/`、`molecules/`、`organisms/` 在 feature 根目錄下

2. **禁止 barrel export（index.ts）**

   - 不建立 `index.ts` 做 re-export，所有 import 必須指向具體檔案
   - 目的：讓讀者從 import path 就能知道來源檔案

3. **單檔命名規則**

   - 如果 `api`、`hooks`、`types` 資料夾內只有一個檔案，不要建立資料夾
   - 直接以檔案名稱命名：
     - `types.ts`（不是 `types/order.ts`）
     - `order.api.ts`（不是 `api/orders.ts`）
     - `constants.ts`

4. **組件層級**

   - `atoms/` — 純展示、無互動邏輯、不持有 state（如 StatusBadge）
   - `molecules/` — 組合 atom + 互動邏輯、持有 callback/hook（如 OrderRow、SearchInput）
   - `organisms/` — 組合多個 molecule/atom、構成頁面區塊（如 OrderTable、OrderDetailPanel）

5. **子功能目錄**

   - 跨多檔案的子功能獨立成目錄（如 `billing/`、`upload-order/`、`add-order/`）
   - 子功能內可包含自己的元件、utils、schema

### 範例：Order Feature（目前實際結構）

```
src/features/order/
├── atoms/
│   └── StatusBadge.tsx
├── molecules/
│   ├── OrderRow.tsx           # 含內部子元件 CustomerInfo
│   ├── OrderItemRow.tsx
│   ├── SearchInput.tsx
│   ├── StatCard.tsx
│   └── StatusFilter.tsx
├── organisms/
│   ├── OrderDetailPanel.tsx
│   ├── OrderFilters.tsx
│   ├── OrderHeader.tsx
│   └── OrderTable.tsx
├── billing/
│   ├── PrintableNotice.tsx    # 列印用繳費通知版面
│   └── BillingActionBar.tsx   # 列印 + 狀態更新動作列
├── upload-order/
│   └── UploadOrderDialog.tsx
├── add-order/
│   ├── AddOrderDialog.tsx
│   ├── create-order.schema.ts
│   └── __tests__/
│       └── create-order.schema.test.ts
├── view/
│   └── ViewOrder.tsx          # 主頁面視圖
├── types.ts
├── order.api.ts
└── constants.ts
```

### 共用模組結構

```
src/lib/
├── hooks/
│   └── useFaultTolerantQuery.ts
├── mappers/
│   └── order-mapper.ts
├── __tests__/
│   └── billing-filter.test.ts
├── billing-filter.ts
├── local-cache.ts
└── supabase/
    ├── client.ts
    └── server.ts

src/ui/                        # shadcn/ui 元件（自動生成，不手動修改）
├── button.tsx
├── card.tsx
├── dialog.tsx
├── table.tsx
└── ...
```

### 使用方式

```typescript
// 直接指向具體檔案（禁止 barrel export）
import StatusBadge from "@/features/order/atoms/StatusBadge";
import OrderTable from "@/features/order/organisms/OrderTable";
import { orderApi } from "@/features/order/order.api";
import type { Order } from "@/features/order/types";
```

### 未來新增 Feature 時

當需要新增 `finance`、`history` 等功能時，請遵循相同的結構規範：

```
src/features/finance/
├── atoms/
├── molecules/
├── organisms/
├── types.ts
├── finance.api.ts
└── constants.ts
```
