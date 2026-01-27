# 快速開始指南

歡迎加入專案！本指南將幫助你快速上手。

## 📋 前置需求

- Node.js 18+
- npm 或 yarn 或 pnpm
- Git

## 🚀 安裝與啟動

### 1. 安裝依賴

```bash
npm install
```

### 2. 啟動開發伺服器

```bash
npm run dev
```

開發伺服器會在 [http://localhost:3000](http://localhost:3000) 啟動。

**注意：** 執行 `npm run dev` 會自動執行格式化和 lint 檢查。

### 3. 開啟瀏覽器

打開 [http://localhost:3000](http://localhost:3000) 查看應用程式。

---

## 📁 專案結構

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── page.tsx          # 首頁
│   └── layout.tsx        # 根佈局
├── components/            # 共享組件
│   ├── ui/               # shadcn/ui 組件
│   └── shared/           # 跨功能共享組件
├── features/             # 功能模組
│   └── order/            # 訂單功能
│       ├── atoms/        # 原子組件
│       ├── molecules/    # 分子組件
│       ├── organisms/    # 有機體組件
│       ├── order-types.ts
│       ├── orders-api.ts
│       └── useOrders.ts
├── lib/                  # 工具函數
│   ├── formatters.ts    # 格式化函數
│   ├── mock-data.ts     # 模擬資料
│   └── utils.ts         # 通用工具
└── providers/           # Context Providers
    └── QueryProvider.tsx
```

---

## 🛠️ 常用指令

### 開發

```bash
# 啟動開發伺服器（自動格式化 + lint）
npm run dev

# 啟動開發伺服器（不執行格式化）
npm run dev:clean

# 格式化程式碼
npm run format

# Lint 檢查
npm run lint

# 修正 Lint 錯誤
npm run lint:fix
```

### 建置

```bash
# 建置生產版本
npm run build

# 啟動生產伺服器
npm run start
```

### 測試

```bash
# 執行測試
npm test
```

---

## 📚 下一步

1. **了解專案架構**

   - 閱讀 [Feature 結構規範](../architecture/feature-structure.md)

2. **了解開發工具**

   - 閱讀 [React Query 整合說明](../development/react-query.md)
   - 閱讀 [NPM Scripts 說明](../development/scripts.md)

3. **了解 API**
   - 閱讀 [訂單 API 文件](../api/orders.md)

---

## ❓ 遇到問題？

- **格式化問題**：查看 [Prettier 故障排除](../troubleshooting/prettier.md)
- **其他問題**：查看專案 README.md 或詢問團隊成員

---

## 🔗 相關資源

- [Next.js 官方文檔](https://nextjs.org/docs)
- [React Query 官方文檔](https://tanstack.com/query/latest)
- [Tailwind CSS 官方文檔](https://tailwindcss.com/docs)
