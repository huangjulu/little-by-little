import { describe, expect, it } from "vitest";

import { cn } from "../utils";

describe("cn — class name 合併", () => {
  it("合併多個 class 字串", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("後方 tailwind class 覆蓋前方衝突", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("處理 conditional class（falsy 值被忽略）", () => {
    expect(cn("px-2", false && "py-1", "text-sm")).toBe("px-2 text-sm");
  });

  it("處理 undefined 和 null 參數", () => {
    expect(cn("px-2", undefined, null, "py-1")).toBe("px-2 py-1");
  });

  it("空字串參數應被忽略", () => {
    expect(cn("px-2", "", "py-1")).toBe("px-2 py-1");
  });

  it("無參數時回傳空字串", () => {
    expect(cn()).toBe("");
  });

  it("處理陣列形式參數", () => {
    expect(cn(["px-2", "py-1"])).toBe("px-2 py-1");
  });

  it("合併 tailwind 的 variant class", () => {
    expect(cn("bg-red-100 text-red-800", "bg-green-100")).toBe(
      "text-red-800 bg-green-100"
    );
  });
});
