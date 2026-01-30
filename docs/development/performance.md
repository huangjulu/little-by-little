# 效能優化與 Props 固定參照說明

## 已完成的優化

### 1. ✅ 使用 `useCallback` 記憶化事件處理函數

#### OrderTable.tsx

- 問題：`onClick={() => onSelectOrder?.(order.id)}` 每次渲染都創建新函數
- 解決：使用 `useCallback` 包裝 `handleOrderClick`，確保函數引用穩定
- 影響：避免 `OrderRow` 元件不必要的重新渲染

#### StatusFilter.tsx

- 問題：`onClick={() => onChange(option.value)}` 每次渲染都創建新函數
- 解決：使用 `useCallback` 包裝 `handleOptionClick`
- 影響：避免 `BaseButton` 元件不必要的重新渲染

#### SearchInput.tsx

- 問題：`onChange={(e) => onChange(e.target.value)}` 每次渲染都創建新函數
- 解決：使用 `useCallback` 包裝 `handleChange`
- 影響：確保 props 穩定引用，避免子元件重新渲染

### 2. ✅ 使用 `useMemo` 記憶化計算結果

#### OrderHeader.tsx

- 問題：`formatCurrency(totalRevenue)` 每次都創建新字串，雖然值相同但引用不同
- 解決：使用 `useMemo` 記憶化 `formattedRevenue`
- 影響：避免 `StatCard` 元件因為 value prop 引用變化而重新渲染

#### page.tsx

- 已使用 `useMemo` 記憶化 `filteredOrders`，避免不必要的重新計算

## Props 固定參照原則

### ✅ 已遵守的原則

1. **函數 Props 使用 `useCallback`**

   - 所有事件處理函數都使用 `useCallback` 包裝
   - 確保函數引用在依賴不變時保持穩定

2. **計算結果使用 `useMemo`**

   - 格式化字串、過濾陣列等計算結果都使用 `useMemo`
   - 確保值相同時引用也相同

3. **父元件傳遞的函數穩定**

   - `page.tsx` 中使用 `setKeyword`、`setStatusFilter`、`setSelectedId`
   - 這些是 `useState` 的 setter，React 保證引用穩定

4. # MVP Architecture Rules
   1. Every component must split into:
      - index.tsx (View: UI only, simple state like isOpen allowed)
      - use[Name]Presenter.ts (Logic: logic > 5 lines, formatting)
      - model.ts (Data: React-Query hooks)
   2. DO NOT use spread operators for presenter props. Pass as a single object.
   3. No useQuery/useMutation in View files. Move to model.ts.
   4. Types must be explicitly defined to avoid undefined errors.

### ⚠️ 可以接受的 Inline 函數

以下情況使用 inline 函數是合理的：

1. **Map 中的處理函數**

   ```typescript
   // OrderTable.tsx - 每個 order 需要不同的 id，使用 closure 是合理的
   orders.map((order) => (
     <OrderRow
       onClick={() => handleOrderClick(order.id)} // ✅ 可以接受
     />
   ));
   ```

2. **簡短的計算或判斷**
   ```typescript
   // 簡單的條件判斷，不需要記憶化
   className={isSelected ? "selected" : ""} // ✅ 可以接受
   ```

## 避免重複渲染的檢查清單

- ✅ 事件處理函數使用 `useCallback`
- ✅ 計算結果使用 `useMemo`
- ✅ Props 傳遞使用穩定引用
- ✅ 避免在 render 中創建新物件/陣列（除非使用 `useMemo`）
- ✅ 子元件使用 `React.memo`（如需要，未來可加入）

## 未來可進一步優化

1. **使用 `React.memo` 包裝純展示元件**

   - `OrderRow`、`OrderItemRow` 等純展示元件可以考慮使用 `React.memo`

2. **減少不必要的計算**

   - `pendingCount` 可以使用 `useMemo` 記憶化（目前是簡單計算，影響不大）

3. **虛擬化長列表**
   - 如果訂單列表很長，可以考慮使用 `react-window` 或 `react-virtual`
