# VS Code 設定說明

這個資料夾包含了 VS Code 的專案設定檔，確保團隊成員使用一致的開發環境。

## 已安裝的擴充功能建議

開啟專案時，VS Code 會提示你安裝以下擴充功能：

- **Prettier** (`esbenp.prettier-vscode`) - 程式碼自動格式化
- **ESLint** (`dbaeumer.vscode-eslint`) - 程式碼品質檢查
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) - Tailwind 類別自動完成
- **TypeScript** (`ms-vscode.vscode-typescript-next`) - TypeScript 增強功能

## 自動格式化設定

- ✅ **儲存時自動格式化** (`editor.formatOnSave: true`)
- ✅ **貼上時自動格式化** (`editor.formatOnPaste: true`)
- ✅ **儲存時自動修正 ESLint 錯誤**

## 手動格式化

- **格式化單一檔案**：`Shift + Alt + F` (Windows) 或 `Shift + Option + F` (Mac)
- **格式化整個專案**：在終端機執行 `npm run format`
