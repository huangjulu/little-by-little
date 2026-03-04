# Claude Code 專案規則 — little-by-little

## 修改前備份：強制使用 git worktree

### 適用範圍

任何**可能刪除或大幅改寫檔案**的操作，執行前必須先建立 worktree 備份節點，包含但不限於：

- 刪除檔案或目錄
- 重構（移動、重新命名多個檔案）
- Phase 級別的功能開發（同時修改 3 個以上檔案）
- DB migration 推送（`pnpm supabase db push`）
- 套件版本升級

### 標準流程

```bash
# 步驟 1：在操作前建立 worktree 備份節點
git add -A && git stash                          # 暫存所有未提交的變更
git worktree add .worktrees/backup-<MMDD-HHMM>  # 建立備份節點

# 步驟 2：執行修改（在主工作目錄）

# 步驟 3A：成功 → 清除 worktree
git worktree remove .worktrees/backup-<MMDD-HHMM>

# 步驟 3B：失敗 → 從備份節點還原測試
git worktree remove .worktrees/backup-<MMDD-HHMM> --force
git stash pop  # 或 git checkout 備份節點的檔案
```

### Token 節省原則

- worktree 是**本地操作**，不需要來回讀取大量檔案確認狀態
- 失敗時直接切換到備份節點重跑，不重新閱讀所有相關檔案
- 每次 Phase 開始前建立一個 worktree，Phase 完成驗證後再移除
- `.worktrees/` 已加入 `.gitignore`，不會被 commit

### 命名規範

```
.worktrees/backup-MMDD-HHMM   # 例：.worktrees/backup-0304-1430
```

---

## 程式碼品質原則

### SOLID + DRY

- **S**ingle Responsibility：每個函式 / hook / 元件只做一件事
- **O**pen/Closed：對擴充開放，對修改封閉（用組合而非改原始碼）
- **L**iskov Substitution：子類型可替換基礎類型（型別安全前提下）
- **I**nterface Segregation：不強迫消費端依賴不需要的介面
- **D**ependency Inversion：高層模組依賴抽象（interface / type），不依賴實作細節
- **DRY**：相同邏輯不重複撰寫，抽成共用函式或 hook

### function 宣告位置

- **模組層級的輔助函式**：放在 component / hook 定義的**下方**
  - `function` 宣告會被 hoisting，放下面不影響執行
  - 優點：主要邏輯（component / hook）在檔案頂部一目了然
- **`useEffect` 內的 callback**：使用具名函式（遵照 named-callbacks.mdc）
- **`useCallback` / `useMemo`**：可使用箭頭函式

```typescript
// ✅ 正確：輔助函式放下方
export function MyComponent() {
  useEffect(function fetchOnMount() {
    loadData();
  }, []);
  return <div />;
}

// 輔助函式在 component 下方（hoisting 保證可用）
function loadData() { ... }
function isValidStatus(v: unknown): v is Status { ... }
```

### 命名原則

- Hook 命名要直接反映**主要行為**，特別是錯誤處理或條件邏輯：
  - ✅ `useFaultTolerantQuery`（容錯 query）
  - ✅ `useNetworkAwareQuery`（感知網路狀態）
  - ❌ `useResilientQuery`（太中性，看不出處理什麼）

---

## Supabase CLI 規則

- 本專案已安裝 Supabase CLI（`supabase` in devDependencies）
- DB schema 變更一律優先使用：`pnpm supabase db push`
- 次選才是貼到 Supabase Dashboard SQL Editor

## 語言規則

- 所有回覆使用台灣式繁體中文
- 技術術語可保留英文原文
