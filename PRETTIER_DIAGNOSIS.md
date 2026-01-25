# Prettier 自動格式化診斷指南

## 步驟 1: 確認 Prettier 擴充功能已安裝

1. 按 `Ctrl + Shift + X` (Windows) 或 `Cmd + Shift + X` (Mac) 打開擴充功能面板
2. 搜尋 "Prettier - Code formatter"
3. 確認顯示 **已安裝** 且 **已啟用** (Enabled)
4. 如果沒有安裝，點擊「安裝」按鈕

**擴充功能 ID**: `esbenp.prettier-vscode`

## 步驟 2: 檢查 VS Code 狀態列

1. 打開任何一個 `.tsx` 或 `.ts` 檔案
2. 查看 VS Code **右下角**的狀態列
3. 應該會看到 "Prettier" 或格式化工具的圖示
4. 如果看到其他工具（如 "Default Formatter"），點擊它
5. 選擇 "Configure Default Formatter..."
6. 選擇 "Prettier - Code formatter"

## 步驟 3: 手動測試格式化

1. 打開 `src/components/orders/organisms/OrderFilters.tsx`
2. 故意打亂格式，例如：
   ```typescript
   // 故意移除縮排
   export const OrderFilters:React.FC<OrderFiltersProps>=({
   keyword,statusFilter,onKeywordChange,onStatusFilterChange,className})=>{
   ```
3. 按 `Shift + Alt + F` (Windows) 或 `Shift + Option + F` (Mac)
4. 如果檔案格式化了 → Prettier 工作正常，只是自動格式化設定有問題
5. 如果沒有格式化 → Prettier 擴充功能可能有問題

## 步驟 4: 檢查 VS Code 設定

1. 按 `Ctrl + ,` (Windows) 或 `Cmd + ,` (Mac) 打開設定
2. 搜尋 "format on save"
3. 確認 **Editor: Format On Save** 已勾選
4. 搜尋 "default formatter"
5. 確認 **Editor: Default Formatter** 設為 "Prettier - Code formatter"

## 步驟 5: 重新載入 VS Code

1. 按 `Ctrl + Shift + P` (Windows) 或 `Cmd + Shift + P` (Mac)
2. 輸入 "Reload Window"
3. 執行 "Developer: Reload Window"

## 步驟 6: 檢查輸出面板（診斷錯誤）

1. 按 `Ctrl + Shift + U` (Windows) 或 `Cmd + Shift + U` (Mac) 打開輸出面板
2. 在右上角下拉選單選擇 "Prettier"
3. 查看是否有錯誤訊息

## 步驟 7: 測試自動格式化

1. 打開 `src/components/orders/organisms/OrderFilters.tsx`
2. 故意打亂幾行格式
3. 按 `Ctrl + S` 儲存
4. 觀察檔案是否自動格式化

## 如果仍然無法運作

請執行以下命令檢查 Prettier 是否正常工作：

```bash
cd C:\Users\ruru\Projects\little-by-little
npx prettier --check src/components/orders/organisms/OrderFilters.tsx
```

如果命令執行成功但 VS Code 沒有自動格式化，可能是：

1. VS Code 的全域設定覆蓋了專案設定
2. 需要檢查 VS Code 的使用者設定檔 (User Settings)
