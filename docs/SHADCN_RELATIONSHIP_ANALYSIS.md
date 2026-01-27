# shadcn/ui 關係檢視報告

## 📋 檢視範圍

本報告檢視專案與 shadcn/ui 的完整關係，包括：

- 已安裝的 shadcn/ui 組件
- 組件的使用情況
- 配置檔案分析
- 依賴關係
- 建議改進

---

## 🔍 當前狀態

### 1. shadcn/ui 配置 (`components.json`)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

**配置分析：**

- ✅ 使用 `new-york` 風格
- ✅ 支援 RSC (React Server Components)
- ✅ 使用 CSS Variables
- ✅ 路徑別名配置正確

---

### 2. 已安裝的 shadcn/ui 組件

#### `src/components/ui/` 目錄

| 組件     | 檔案           | 狀態      | 使用位置                                                                                         |
| -------- | -------------- | --------- | ------------------------------------------------------------------------------------------------ |
| Badge    | `badge.tsx`    | ✅ 已安裝 | `features/order/atoms/StatusBadge.tsx`                                                           |
| Button   | `button.tsx`   | ✅ 已安裝 | ❌ 未使用                                                                                        |
| Card     | `card.tsx`     | ✅ 已安裝 | ❌ 未使用                                                                                        |
| Input    | `input.tsx`    | ✅ 已安裝 | `features/order/molecules/SearchInput.tsx`                                                       |
| Skeleton | `skeleton.tsx` | ✅ 已安裝 | `components/shared/skeletons/*`                                                                  |
| Table    | `table.tsx`    | ✅ 已安裝 | `features/order/organisms/OrderTable.tsx`<br>`components/shared/skeletons/DataTableSkeleton.tsx` |
| Tabs     | `tabs.tsx`     | ✅ 已安裝 | ❌ 未使用                                                                                        |

**統計：**

- 總組件數：7 個
- 已使用：4 個（Badge, Input, Skeleton, Table）
- 未使用：3 個（Button, Card, Tabs）

---

### 3. 組件使用情況詳析

#### ✅ 已使用的組件

**1. Badge (`@/components/ui/badge`)**

- **使用位置：** `features/order/atoms/StatusBadge.tsx`
- **用途：** 顯示訂單狀態標籤
- **包裝方式：** 透過 `StatusBadge` 原子組件包裝
- **樣式客製化：** 使用 `statusChipStyle` 常數定義不同狀態的樣式

**2. Input (`@/components/ui/input`)**

- **使用位置：** `features/order/molecules/SearchInput.tsx`
- **用途：** 搜尋輸入框
- **包裝方式：** 透過 `SearchInput` 分子組件包裝
- **樣式客製化：** 移除邊框和陰影，使用透明背景

**3. Skeleton (`@/components/ui/skeleton`)**

- **使用位置：**
  - `components/shared/skeletons/DataTableSkeleton.tsx`
  - `components/shared/skeletons/PanelDetailSkeleton.tsx`
- **用途：** 載入狀態的骨架屏
- **包裝方式：** 直接使用，無額外包裝

**4. Table (`@/components/ui/table`)**

- **使用位置：**
  - `features/order/organisms/OrderTable.tsx`
  - `components/shared/skeletons/DataTableSkeleton.tsx`
- **用途：** 訂單列表表格
- **包裝方式：** 直接使用，無額外包裝

#### ❌ 未使用的組件

**1. Button (`@/components/ui/button`)**

- **狀態：** 已安裝但未使用
- **可能用途：**
  - 未來可能需要用於操作按鈕（編輯、刪除、確認等）
  - 狀態篩選器目前使用原生 `<button>`
- **建議：** 保留，未來可能會用到

**2. Card (`@/components/ui/card`)**

- **狀態：** 已安裝但未使用
- **可能用途：**
  - 訂單詳情面板可以使用 Card 結構
  - 統計卡片可以使用 Card
- **建議：** 考慮使用 Card 重構現有組件

**3. Tabs (`@/components/ui/tabs`)**

- **狀態：** 已安裝但未使用
- **可能用途：**
  - 未來多標籤頁功能（訂單、財務、歷史記錄等）
- **建議：** 保留，符合未來規劃

---

### 4. 依賴關係分析

#### 核心依賴

```json
{
  "@radix-ui/react-slot": "^1.1.0", // Badge, Button 使用
  "@radix-ui/react-tabs": "^1.1.0", // Tabs 使用
  "class-variance-authority": "^0.7.0", // Badge, Button variants
  "clsx": "^2.1.1", // className 工具
  "tailwind-merge": "^2.5.4" // className 合併工具
}
```

**分析：**

- ✅ 所有必要的依賴都已安裝
- ✅ 版本符合 shadcn/ui 要求
- ✅ `cn` 工具函數正確配置

---

### 5. 組件架構關係

```
shadcn/ui 組件層 (components/ui/)
    ↓
業務組件層 (features/order/)
    ├── atoms/          # 包裝 shadcn 組件（如 StatusBadge）
    ├── molecules/     # 包裝 shadcn 組件（如 SearchInput）
    └── organisms/      # 直接使用 shadcn 組件（如 OrderTable）

共享組件層 (components/shared/)
    └── skeletons/      # 使用 shadcn Skeleton 和 Table
```

**架構特點：**

- ✅ 清晰的層級關係
- ✅ 業務組件包裝 shadcn 組件，提供業務邏輯
- ✅ 共享組件直接使用 shadcn 組件

---

### 6. 樣式系統關係

#### CSS Variables (`globals.css`)

shadcn/ui 使用 CSS Variables 定義主題色彩：

```css
:root {
  --background: ...
  --foreground: ...
  --primary: ...
  --card: ...
  --input: ...
  ...
}
```

**當前狀態：**

- ✅ CSS Variables 已配置
- ✅ 支援深色模式（dark mode）
- ✅ 與 Tailwind CSS 整合

#### Tailwind 配置

- ✅ 使用 `tailwind.config.ts`（推測）
- ✅ 支援 CSS Variables
- ✅ 與 shadcn/ui 樣式系統整合

---

## 📊 使用模式分析

### 模式 1：直接使用

**範例：** `OrderTable` 直接使用 `Table` 組件

```typescript
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

**適用場景：**

- 組件功能完整，不需要額外包裝
- 共享組件（如 skeletons）

---

### 模式 2：業務包裝

**範例：** `StatusBadge` 包裝 `Badge` 組件

```typescript
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

**適用場景：**

- 需要業務邏輯（如狀態映射）
- 需要統一樣式（如狀態顏色）
- 需要簡化 API（如隱藏複雜配置）

---

### 模式 3：組合使用

**範例：** `SearchInput` 組合 `Input` 和其他元素

```typescript
import { Input } from "@/components/ui/input";

export const SearchInput = () => {
  return (
    <div className="...">
      <span>🔍</span>
      <Input className="..." />
    </div>
  );
};
```

**適用場景：**

- 需要額外的 UI 元素（如圖示、標籤）
- 需要複雜的佈局

---

## ⚠️ 發現的問題

### 1. 未使用的組件

- **Button** - 已安裝但未使用
- **Card** - 已安裝但未使用
- **Tabs** - 已安裝但未使用

**影響：**

- 增加 bundle 大小（雖然影響很小）
- 可能造成混淆（為什麼安裝了但不用？）

**建議：**

- 如果未來會用到，保留並記錄原因
- 如果不會用到，考慮移除

---

### 2. 組件使用不一致

**問題：**

- `StatusFilter` 使用原生 `<button>`，而不是 `Button` 組件
- `StatCard` 使用自定義樣式，而不是 `Card` 組件

**影響：**

- 樣式不一致
- 無法享受 shadcn/ui 的統一設計系統

**建議：**

- 統一使用 shadcn/ui 組件
- 或明確說明不使用的原因

---

### 3. 缺少組件文檔

**問題：**

- 沒有說明哪些組件應該使用 shadcn/ui
- 沒有說明何時應該包裝，何時直接使用

**建議：**

- 建立組件使用指南
- 記錄設計決策

---

## 💡 改進建議

### 建議 1：統一使用 Button 組件

**當前：**

```typescript
// StatusFilter.tsx
<button type="button" onClick={...} className="...">
```

**建議：**

```typescript
// StatusFilter.tsx
import { Button } from "@/components/ui/button";

<Button variant="outline" onClick={...}>
```

**優點：**

- 統一的設計系統
- 更好的可訪問性
- 一致的 hover/focus 狀態

---

### 建議 2：考慮使用 Card 組件

**當前：**

```typescript
// OrderDetailPanel.tsx
<div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
```

**建議：**

```typescript
// OrderDetailPanel.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";

<Card>
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
</Card>;
```

**優點：**

- 統一的卡片樣式
- 更好的語義化
- 更容易維護

---

### 建議 3：建立組件使用規範

**建議內容：**

1. 何時使用 shadcn/ui 組件
2. 何時應該包裝組件
3. 何時應該直接使用
4. 樣式客製化指南

---

### 建議 4：考慮新增更多組件

根據未來需求，可能需要：

- **Dialog** - 確認對話框、詳情彈窗
- **Select** - 下拉選單（狀態篩選）
- **Dropdown Menu** - 操作選單
- **Toast** - 通知（已有 sonner，但可以考慮 shadcn 的 toast）
- **Form** - 表單組件（如果未來需要表單）

---

## 📈 統計總結

### 組件使用率

- **總組件數：** 7 個
- **已使用：** 4 個 (57%)
- **未使用：** 3 個 (43%)

### 使用模式分布

- **直接使用：** 2 個組件（Table, Skeleton）
- **業務包裝：** 2 個組件（Badge → StatusBadge, Input → SearchInput）
- **組合使用：** 1 個組件（Input + 其他元素 → SearchInput）

---

## ✅ 確認事項

### 組件完整性檢查

- ✅ **StatusBadge.tsx** - 已恢復
- ✅ **SearchInput.tsx** - 已恢復
- ✅ 所有引用都正確
- ✅ TypeScript 編譯無錯誤

### shadcn/ui 配置檢查

- ✅ `components.json` 配置正確
- ✅ 路徑別名配置正確
- ✅ CSS Variables 配置正確
- ✅ 依賴關係完整

---

## 🎯 結論

### 當前狀態

專案與 shadcn/ui 的關係**整體良好**：

1. ✅ **配置正確** - `components.json` 和依賴都正確
2. ✅ **使用合理** - 已使用的組件都符合需求
3. ✅ **架構清晰** - 組件層級關係明確
4. ⚠️ **有改進空間** - 部分組件未使用，使用不一致

### 建議優先級

**高優先級：**

1. 統一使用 Button 組件（替換原生 button）
2. 考慮使用 Card 組件（重構現有卡片）

**中優先級：** 3. 建立組件使用規範文檔 4. 評估未使用組件的必要性

**低優先級：** 5. 根據需求新增更多 shadcn/ui 組件 6. 優化組件包裝方式

---

## 📝 待討論事項

在進行修改之前，請確認以下事項：

1. **是否要統一使用 Button 組件？**

   - 替換 `StatusFilter` 中的原生 `<button>`

2. **是否要使用 Card 組件？**

   - 重構 `OrderDetailPanel` 和 `StatCard`

3. **未使用的組件處理方式？**

   - Button, Card, Tabs 是否保留？

4. **是否需要新增其他組件？**

   - Dialog, Select, Dropdown Menu 等

5. **組件使用規範？**
   - 是否需要建立明確的使用指南？

---

**請確認以上事項後，我再進行相應的修改。**
