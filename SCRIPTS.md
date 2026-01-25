# NPM Scripts 說明

## 開發相關

### `npm run dev`

啟動開發伺服器

**注意**：由於設定了 `predev` 生命週期腳本，執行 `npm run dev` 會**自動**先執行 `format` 和 `lint`。

```bash
npm run dev
# 等同於：
# 1. npm run format (自動執行)
# 2. npm run lint (自動執行)
# 3. next dev (執行)
```

### `npm run dev:clean`

手動控制版本，明確執行 format → lint → dev 的順序

```bash
npm run dev:clean
```

### `npm run predev`

自動執行的預處理腳本（無需手動執行）

當執行 `npm run dev` 時，npm 會自動執行 `predev` 腳本。如果你想跳過預處理，可以直接執行 `next dev`。

## 程式碼品質

### `npm run format`

格式化所有檔案（會修改檔案）

```bash
npm run format
```

### `npm run format:check`

檢查格式化（不修改檔案，只檢查）

```bash
npm run format:check
```

### `npm run lint`

執行 ESLint 檢查

```bash
npm run lint
```

### `npm run lint:fix`

執行 ESLint 並自動修正可修正的錯誤

```bash
npm run lint:fix
```

### `npm run check`

檢查格式化 + ESLint（不修改檔案，只檢查）

```bash
npm run check
```

## 建置與部署

### `npm run build`

建立生產版本

```bash
npm run build
```

### `npm start`

啟動生產伺服器（需要先執行 `npm run build`）

```bash
npm start
```

## 使用建議

### 日常開發

```bash
# 推薦：自動格式化並檢查後啟動開發伺服器
npm run dev

# 或者使用明確版本
npm run dev:clean
```

### 提交前檢查

```bash
# 檢查但不修改檔案
npm run check

# 自動修正所有可修正的問題
npm run format
npm run lint:fix
```

### CI/CD 流程

```bash
# 在 CI 中使用檢查命令（不會修改檔案）
npm run check
```

## 注意事項

1. **`predev` 會自動執行**：每次執行 `npm run dev` 都會先執行 format 和 lint
2. **跳過預處理**：如果需要跳過，可以直接執行 `next dev`
3. **效能考量**：如果專案很大，format 和 lint 可能需要一些時間，請耐心等待
