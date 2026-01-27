# 文件分類指南

本文檔說明專案文件的分類邏輯和組織方式。

## 📋 分類原則

文件分類遵循以下原則：

1. **按目標讀者分類** - 不同角色的開發者需要不同的文件
2. **按使用場景分類** - 快速開始、開發、故障排除等不同場景
3. **按內容類型分類** - API、架構、開發指南等不同類型

---

## 📁 分類結構

### 1. `getting-started/` - 快速開始

**目標讀者：** 新加入的開發者

**內容：**

- 專案快速開始指南
- 安裝和啟動說明
- 基本專案結構介紹

**文件：**

- `README.md` - 快速開始指南

**何時查看：**

- 第一次接觸專案時
- 需要了解如何啟動專案時

---

### 2. `architecture/` - 架構設計

**目標讀者：** 需要了解專案架構的開發者

**內容：**

- 專案架構設計說明
- 目錄結構規範
- 設計模式和最佳實踐

**文件：**

- `feature-structure.md` - Feature 結構規範

**何時查看：**

- 需要了解專案架構時
- 需要新增功能模組時
- 需要重構程式碼時

**未來可擴展：**

- `components-structure.md` - 組件架構說明
- `state-management.md` - 狀態管理架構
- `routing.md` - 路由架構

---

### 3. `api/` - API 文件

**目標讀者：** 前端開發者、後端開發者、API 使用者

**內容：**

- API 端點說明
- 請求/回應格式
- 錯誤處理
- 使用範例

**文件：**

- `orders.md` - 訂單 API 文件

**何時查看：**

- 需要了解 API 端點時
- 需要整合 API 時
- 需要測試 API 時

**未來可擴展：**

- `finance.md` - 財務 API 文件
- `history.md` - 歷史記錄 API 文件
- `customers.md` - 客戶 API 文件

---

### 4. `development/` - 開發指南

**目標讀者：** 正在開發功能的開發者

**內容：**

- 開發工具使用說明
- 開發流程和規範
- 效能優化指南
- 最佳實踐

**文件：**

- `react-query.md` - React Query 整合說明
- `scripts.md` - NPM Scripts 說明
- `performance.md` - 效能優化說明

**何時查看：**

- 需要了解開發工具時
- 需要了解開發流程時
- 需要優化效能時

**未來可擴展：**

- `testing.md` - 測試指南
- `styling.md` - 樣式指南
- `git-workflow.md` - Git 工作流程

---

### 5. `troubleshooting/` - 故障排除

**目標讀者：** 遇到問題的開發者

**內容：**

- 常見問題解決方案
- 故障排除步驟
- 診斷指南

**文件：**

- `prettier.md` - Prettier 故障排除

**何時查看：**

- 遇到格式化問題時
- 遇到其他開發問題時

**未來可擴展：**

- `build-errors.md` - 建置錯誤排除
- `runtime-errors.md` - 執行時錯誤排除
- `deployment.md` - 部署問題排除

---

## 🎯 分類決策流程

當需要新增文件時，請遵循以下決策流程：

### 步驟 1：確定目標讀者

- **新開發者** → `getting-started/`
- **架構設計者** → `architecture/`
- **API 使用者** → `api/`
- **開發者** → `development/`
- **遇到問題的開發者** → `troubleshooting/`

### 步驟 2：確定使用場景

- **快速開始** → `getting-started/`
- **了解架構** → `architecture/`
- **使用 API** → `api/`
- **開發功能** → `development/`
- **解決問題** → `troubleshooting/`

### 步驟 3：確定內容類型

- **架構設計** → `architecture/`
- **API 文件** → `api/`
- **開發指南** → `development/`
- **故障排除** → `troubleshooting/`

---

## 📝 文件命名規範

### 命名原則

1. **使用小寫字母和連字號**

   - ✅ `react-query.md`
   - ❌ `ReactQuery.md` 或 `react_query.md`

2. **使用描述性名稱**

   - ✅ `feature-structure.md`
   - ❌ `structure.md` 或 `rules.md`

3. **API 文件使用功能名稱**

   - ✅ `orders.md`
   - ❌ `order-api.md` 或 `api-orders.md`

4. **故障排除文件使用工具名稱**
   - ✅ `prettier.md`
   - ❌ `prettier-troubleshooting.md`

---

## 🔄 文件維護

### 更新時機

- **新增功能時** - 更新相關 API 文件
- **修改架構時** - 更新架構文件
- **發現問題時** - 更新故障排除文件
- **變更流程時** - 更新開發指南

### 維護原則

1. **保持最新** - 文件應該反映當前狀態
2. **及時更新** - 發現錯誤時立即修正
3. **定期檢查** - 每個版本發布前檢查文件
4. **團隊協作** - 鼓勵團隊成員更新文件

---

## 📊 文件統計

### 當前文件數量

- `getting-started/`: 1 個文件
- `architecture/`: 1 個文件
- `api/`: 1 個文件
- `development/`: 3 個文件
- `troubleshooting/`: 1 個文件

**總計：** 7 個文件

---

## 🚀 未來擴展建議

### 建議新增的文件

1. **架構設計**

   - `components-structure.md` - 組件架構說明
   - `state-management.md` - 狀態管理架構

2. **API 文件**

   - `finance.md` - 財務 API
   - `history.md` - 歷史記錄 API

3. **開發指南**

   - `testing.md` - 測試指南
   - `styling.md` - 樣式指南

4. **故障排除**
   - `build-errors.md` - 建置錯誤
   - `deployment.md` - 部署問題

---

## 💡 最佳實踐

1. **保持簡潔** - 文件應該簡潔明瞭
2. **提供範例** - 包含實際可用的範例
3. **定期更新** - 保持文件與程式碼同步
4. **團隊協作** - 鼓勵團隊成員貢獻文件

---

## 📚 參考資源

- [Documentation Best Practices](https://www.writethedocs.org/guide/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Technical Writing](https://developers.google.com/tech-writing)
