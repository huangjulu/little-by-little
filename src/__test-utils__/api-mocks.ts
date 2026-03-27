/**
 * 共用的 Next.js API route test mock — next/headers cookies
 *
 * 使用方式：在 test file 頂部（vi.mock 區塊）引用：
 *   vi.mock("next/headers", () => MOCK_NEXT_HEADERS);
 */
export const MOCK_NEXT_HEADERS = {
  cookies: () =>
    Promise.resolve({
      getAll: () => [],
      set: () => undefined,
    }),
};
