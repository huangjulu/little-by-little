// ─── Public API ────────────────────────────────────────────────────────────────

export function localCacheSet<T>(key: string, value: T): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // QuotaExceededError または其他儲存錯誤：靜默忽略
  }
}

export function localCacheGet<T>(
  key: string,
  guard: (v: unknown) => v is T
): T | null {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return guard(parsed) ? parsed : null;
  } catch {
    // JSON 解析錯誤：回傳 null
    return null;
  }
}

export function localCacheRemove(key: string): void {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // 靜默忽略
  }
}

// ─── 模組層級常數（hoisting 保證上方函式可用） ────────────────────────────────

const isBrowser = typeof window !== "undefined";
