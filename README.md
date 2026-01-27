# Little by Little - 訂單管理系統

這是一個使用 [Next.js](https://nextjs.org) 建立的訂單管理系統專案。

## 🚀 快速開始

詳細的快速開始指南，請查看 [docs/getting-started/README.md](./docs/getting-started/README.md)

### 快速指令

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

開發伺服器會在 [http://localhost:3000](http://localhost:3000) 啟動。

## 📚 文件

所有專案文件已整理在 `docs/` 目錄下：

- 📖 [文件索引](./docs/README.md) - 完整的文件目錄
- 🚀 [快速開始](./docs/getting-started/README.md) - 新手上路指南
- 🏗️ [架構設計](./docs/architecture/) - 專案架構說明
- 🔌 [API 文件](./docs/api/) - API 端點文件
- 💻 [開發指南](./docs/development/) - 開發相關文件
- 🔧 [故障排除](./docs/troubleshooting/) - 問題解決指南

## 🛠️ 技術棧

- **框架**: Next.js 15 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **UI 組件**: shadcn/ui
- **狀態管理**: TanStack React Query
- **表單處理**: React Hook Form (如需要)

## 📁 專案結構

```
src/
├── app/              # Next.js App Router
├── components/       # 共享組件
│   ├── ui/          # shadcn/ui 組件
│   └── shared/      # 跨功能共享組件
├── features/        # 功能模組
│   └── order/       # 訂單功能
├── lib/             # 工具函數
└── providers/       # Context Providers
```

詳細的架構說明請查看 [Feature 結構規範](./docs/architecture/feature-structure.md)

## 🔗 相關資源

- [Next.js 官方文檔](https://nextjs.org/docs)
- [React Query 官方文檔](https://tanstack.com/query/latest)
- [Tailwind CSS 官方文檔](https://tailwindcss.com/docs)
- [shadcn/ui 官方文檔](https://ui.shadcn.com/)

## 📝 授權

本專案為內部專案，僅供團隊使用。
