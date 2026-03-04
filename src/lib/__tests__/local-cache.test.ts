import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  localCacheSet,
  localCacheGet,
  localCacheRemove,
} from "@/lib/local-cache";

const isString = (v: unknown): v is string => typeof v === "string";
const isNumber = (v: unknown): v is number => typeof v === "number";

describe("local-cache", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("localCacheSet", () => {
    it("應寫入 JSON 序列化的值", () => {
      localCacheSet("key", { name: "test" });
      expect(localStorage.getItem("key")).toBe('{"name":"test"}');
    });

    it("QuotaExceededError 發生時應靜默忽略", () => {
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("QuotaExceededError");
      });
      expect(() => localCacheSet("key", "value")).not.toThrow();
    });
  });

  describe("localCacheGet", () => {
    it("guard 通過時應回傳解析值", () => {
      localStorage.setItem("key", '"hello"');
      expect(localCacheGet("key", isString)).toBe("hello");
    });

    it("guard 失敗時應回傳 null", () => {
      localStorage.setItem("key", '"hello"');
      expect(localCacheGet("key", isNumber)).toBeNull();
    });

    it("key 不存在時應回傳 null", () => {
      expect(localCacheGet("nonexistent", isString)).toBeNull();
    });

    it("JSON 格式錯誤時應回傳 null", () => {
      localStorage.setItem("key", "not-valid-json{{{");
      expect(localCacheGet("key", isString)).toBeNull();
    });
  });

  describe("localCacheRemove", () => {
    it("應刪除指定的 key", () => {
      localStorage.setItem("key", "value");
      localCacheRemove("key");
      expect(localStorage.getItem("key")).toBeNull();
    });
  });
});
