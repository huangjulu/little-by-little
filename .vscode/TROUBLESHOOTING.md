# Prettier 自動格式化故障排除

## 快速檢查清單 ✅

### 1. 確認 Prettier 擴充功能已安裝

- [ ] 按 `Ctrl + Shift + X` 打開擴充功能
- [ ] 搜尋 "Prettier - Code formatter"
- [ ] 確認狀態顯示「已啟用」或「已安裝」

### 2. 檢查右下角狀態列

- [ ] 打開 `.tsx` 或 `.ts` 檔案
- [ ] 查看右下角是否顯示 "Prettier"
- [ ] 如果顯示其他工具，點擊並選擇 Prettier

### 3. 手動測試格式化

- [ ] 打開任何檔案
- [ ] 按 `Shift + Alt + F` (Windows) 或 `Shift + Option + F` (Mac)
- [ ] 確認檔案是否格式化

### 4. 重新載入 VS Code

- [ ] 按 `Ctrl + Shift + P`
- [ ] 輸入 "Reload Window"
- [ ] 執行重新載入

## 如果仍然無法運作

### 方法 1: 檢查使用者設定是否覆蓋專案設定

1. 按 `Ctrl + Shift + P`
2. 輸入 "Preferences: Open User Settings (JSON)"
3. 檢查是否有以下設定衝突：
   ```json
   {
     "editor.formatOnSave": false, // 如果這裡是 false，會覆蓋專案設定
     "editor.defaultFormatter": "其他工具" // 如果有設定其他工具
   }
   ```

### 方法 2: 使用命令面板手動格式化

1. 按 `Ctrl + Shift + P`
2. 輸入 "Format Document"
3. 選擇 "Format Document"
4. 如果出現選擇格式化工具，選擇 "Prettier"

### 方法 3: 檢查 Prettier 輸出日誌

1. 按 `Ctrl + Shift + U` 打開輸出面板
2. 在右上角下拉選單選擇 "Prettier"
3. 查看是否有錯誤訊息

### 方法 4: 檢查檔案是否被忽略

確認 `.prettierignore` 沒有排除你的檔案。

## 終極解決方案

如果以上方法都無效，可以嘗試：

1. **完全重新安裝 Prettier 擴充功能**

   - 解除安裝 Prettier 擴充功能
   - 關閉 VS Code
   - 重新打開 VS Code
   - 重新安裝 Prettier 擴充功能

2. **使用命令列格式化作為備用**

   ```bash
   npm run format
   ```

3. **檢查 VS Code 版本**
   - Prettier 擴充功能需要 VS Code 1.60.0 或更高版本
