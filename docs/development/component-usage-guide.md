# 組件使用規範

本文檔說明專案中組件的使用規範，特別是 shadcn/ui 組件的使用方式。

---

## 📚 組件層級說明

### 1. shadcn/ui 組件層 (`components/ui/`)

**定位：** 基礎 UI 組件庫

**特點：**

- 由 shadcn/ui CLI 自動生成和管理
- 不應手動修改（除非是客製化需求）
- 提供標準化的組件 API
- 使用 class-variance-authority (CVA) 管理變體

**當前已安裝的組件：**

- ✅ Badge - 標籤組件
- ✅ Card - 卡片組件
- ✅ Dialog - 對話框組件
- ✅ Input - 輸入框組件
- ✅ Skeleton - 骨架屏組件
- ✅ Table - 表格組件

---

### 2. 共享組件層 (`components/shared/`)

**定位：** 跨功能模組共享的組件

**特點：**

- 多個 feature 都會用到的組件
- 直接使用 shadcn/ui 組件
- 提供業務邏輯包裝

**當前組件：**

- `skeletons/` - 骨架屏組件
  - `DataTableSkeleton` - 使用 `Table` 和 `Skeleton`
  - `PanelDetailSkeleton` - 使用 `Skeleton`

---

### 3. 功能組件層 (`features/{feature}/`)

**定位：** 功能特定的組件

**特點：**

- 使用 shadcn/ui 組件或共享組件
- 提供業務邏輯和樣式客製化
- 遵循原子設計原則（atoms/molecules/organisms）

---

## 🎯 使用模式

### 模式 1：直接使用

**適用場景：**

- 組件功能完整，不需要額外包裝
- 共享組件（如 skeletons）
- 簡單的使用場景

**範例：**

```typescript
// OrderTable.tsx
import { Table, TableBody, TableCell, ... } from "@/components/ui/table";

export const OrderTable = () => {
  return (
    <Table>
      <TableHeader>...</TableHeader>
      <TableBody>...</TableBody>
    </Table>
  );
};
```

**使用位置：**

- `OrderTable` - 直接使用 `Table` 組件
- `DataTableSkeleton` - 直接使用 `Table` 和 `Skeleton`

---

### 模式 2：業務包裝

**適用場景：**

- 需要業務邏輯（如狀態映射、資料轉換）
- 需要統一樣式（如狀態顏色、預設樣式）
- 需要簡化 API（隱藏複雜配置）

**範例：**

```typescript
// StatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { statusLabel, statusChipStyle } from "../constants";

export const StatusBadge = ({ status }) => {
  return (
    <Badge className={cn(statusChipStyle[status], ...)}>
      {statusLabel[status]}
    </Badge>
  );
};
```

**使用位置：**

- `StatusBadge` - 包裝 `Badge`，提供狀態映射和樣式
- `SearchInput` - 包裝 `Input`，提供搜尋圖示和樣式

---

### 模式 3：組合使用

**適用場景：**

- 需要額外的 UI 元素（如圖示、標籤）
- 需要複雜的佈局
- 需要多個 shadcn/ui 組件組合

**範例：**

```typescript
// OrderDetailPanel.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const OrderDetailPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>訂單明細</CardTitle>
      </CardHeader>
      <CardContent>
        <Card>...</Card> {/* 嵌套使用 */}
      </CardContent>
    </Card>
  );
};
```

**使用位置：**

- `OrderDetailPanel` - 組合多個 `Card` 組件
- `StatCard` - 使用 `Card` 和 `CardContent`

---

## 📋 組件選擇決策流程

### 步驟 1：確定需求

- **需要基礎 UI 組件？** → 使用 `components/ui/`
- **需要跨功能共享組件？** → 使用 `components/shared/`
- **需要功能特定組件？** → 在 `features/{feature}/` 內建立

### 步驟 2：選擇使用模式

- **功能完整，直接使用？** → 模式 1：直接使用
- **需要業務邏輯或統一樣式？** → 模式 2：業務包裝
- **需要組合多個組件？** → 模式 3：組合使用

### 步驟 3：實作

- 遵循原子設計原則
- 保持組件職責單一
- 提供清晰的 API

---

## ✅ 最佳實踐

### 1. 優先使用 shadcn/ui 組件

**✅ 推薦：**

```typescript
import { Card, CardContent } from "@/components/ui/card";
```

**❌ 不推薦：**

```typescript
<div className="rounded-xl border bg-white p-4">...</div>
```

**理由：**

- 統一的設計系統
- 更好的可訪問性
- 更容易維護

---

### 2. 適當包裝組件

**✅ 推薦：**

```typescript
// StatusBadge.tsx - 包裝 Badge，提供業務邏輯
export const StatusBadge = ({ status }) => {
  return (
    <Badge className={statusChipStyle[status]}>{statusLabel[status]}</Badge>
  );
};
```

**❌ 不推薦：**

```typescript
// 直接使用 Badge，每次都要重複寫樣式和標籤
<Badge className="bg-yellow-100 text-yellow-800">待付款</Badge>
```

**理由：**

- 減少重複程式碼
- 統一樣式和行為
- 更容易維護

---

### 3. 保持組件職責單一

**✅ 推薦：**

```typescript
// StatusBadge.tsx - 只負責顯示狀態標籤
export const StatusBadge = ({ status }) => { ... };

// OrderRow.tsx - 只負責顯示訂單行
export const OrderRow = ({ order }) => { ... };
```

**❌ 不推薦：**

```typescript
// 一個組件做太多事情
export const OrderRow = ({ order, onStatusChange, onDelete }) => {
  // 顯示訂單 + 狀態變更 + 刪除功能
};
```

**理由：**

- 更容易測試
- 更容易重用
- 更容易維護

---

### 4. 使用語義化的組件名稱

**✅ 推薦：**

- `StatusBadge` - 清楚表達用途
- `OrderDetailPanel` - 清楚表達用途
- `CreateOrderButton` - 清楚表達用途

**❌ 不推薦：**

- `Badge` - 太通用
- `Panel` - 太通用
- `Button` - 太通用

---

## 🚫 避免的做法

### 1. 不要直接修改 shadcn/ui 組件

**❌ 不推薦：**

```typescript
// 直接修改 components/ui/badge.tsx
function Badge({ className, ...props }) {
  return <span className={cn("custom-class", className)}>...</span>;
}
```

**✅ 推薦：**

```typescript
// 在 feature 內包裝
export const StatusBadge = ({ status }) => {
  return <Badge className={cn("custom-class", ...)}>...</Badge>;
};
```

---

### 2. 不要過度包裝

**❌ 不推薦：**

```typescript
// 只是簡單的 className 合併，不需要包裝
export const CustomBadge = ({ className }) => {
  return <Badge className={cn("text-sm", className)} />;
};
```

**✅ 推薦：**

```typescript
// 直接使用
<Badge className="text-sm">...</Badge>
```

---

### 3. 不要混用不同的設計系統

**❌ 不推薦：**

```typescript
// 混用 shadcn/ui 和自定義組件
<Card>
  <div className="custom-card-content">...</div>
</Card>
```

**✅ 推薦：**

```typescript
// 統一使用 shadcn/ui
<Card>
  <CardContent>...</CardContent>
</Card>
```

---

## 📝 組件命名規範

### shadcn/ui 組件

- **檔案名稱：** 小寫，單數（`badge.tsx`, `card.tsx`）
- **組件名稱：** PascalCase（`Badge`, `Card`）
- **匯出名稱：** 與組件名稱相同

### 業務組件

- **檔案名稱：** PascalCase（`StatusBadge.tsx`, `OrderDetailPanel.tsx`）
- **組件名稱：** PascalCase（`StatusBadge`, `OrderDetailPanel`）
- **匯出名稱：** 與組件名稱相同

---

## 🔄 新增組件流程

### 1. 新增 shadcn/ui 組件

```bash
# 使用 shadcn CLI
npx shadcn@latest add [component-name]

# 或手動建立（參考官方文檔）
```

### 2. 新增業務組件

1. 確定組件層級（atoms/molecules/organisms）
2. 建立組件檔案
3. 實作組件邏輯
4. 在對應的 `index.ts` 匯出
5. 在 `features/{feature}/index.ts` 匯出（如需要）

---

## 📊 當前組件使用統計

### shadcn/ui 組件使用情況

| 組件     | 狀態      | 使用位置                                   |
| -------- | --------- | ------------------------------------------ |
| Badge    | ✅ 已使用 | `StatusBadge`                              |
| Card     | ✅ 已使用 | `OrderDetailPanel`, `StatCard`             |
| Dialog   | ✅ 已使用 | `app/page.tsx`                             |
| Input    | ✅ 已使用 | `SearchInput`                              |
| Skeleton | ✅ 已使用 | `DataTableSkeleton`, `PanelDetailSkeleton` |
| Table    | ✅ 已使用 | `OrderTable`, `DataTableSkeleton`          |

---

## 🎓 範例參考

### 範例 1：狀態標籤（業務包裝）

```typescript
// features/order/atoms/StatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { statusLabel, statusChipStyle } from "../constants";

export const StatusBadge = ({ status }) => {
  return (
    <Badge className={cn(statusChipStyle[status], ...)}>
      {statusLabel[status]}
    </Badge>
  );
};
```

**特點：**

- 包裝 `Badge` 組件
- 提供狀態映射邏輯
- 統一狀態樣式

---

### 範例 2：搜尋輸入框（組合使用）

```typescript
// features/order/molecules/SearchInput.tsx
import { Input } from "@/components/ui/input";

export const SearchInput = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2 ...">
      <span>🔍</span>
      <Input value={value} onChange={onChange} className="..." />
    </div>
  );
};
```

**特點：**

- 組合 `Input` 和其他元素
- 提供搜尋圖示
- 客製化樣式

---

### 範例 3：訂單詳情面板（組合使用）

```typescript
// features/order/organisms/OrderDetailPanel.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const OrderDetailPanel = ({ order }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>訂單明細</CardTitle>
      </CardHeader>
      <CardContent>
        <Card>...</Card> {/* 嵌套使用 */}
      </CardContent>
    </Card>
  );
};
```

**特點：**

- 組合多個 `Card` 組件
- 使用嵌套結構
- 清晰的語義化

---

## 🔗 相關資源

- [shadcn/ui 官方文檔](https://ui.shadcn.com/)
- [Radix UI 官方文檔](https://www.radix-ui.com/)
- [原子設計原則](https://atomicdesign.bradfrost.com/)

---

## 📝 更新記錄

- 2026-01-27 - 初始版本
  - 建立組件使用規範
  - 記錄當前組件使用情況
  - 提供最佳實踐指南
