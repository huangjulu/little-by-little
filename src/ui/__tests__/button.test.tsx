import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Plus as IconPlus } from "lucide-react";
import { afterEach, describe, expect, it, vi } from "vitest";

import Button from "../button";

afterEach(cleanup);

describe("Button", () => {
  // ─── 基本 render ────────────────────────────────────────────────────────

  it("render label 文字", () => {
    render(<Button label="確認" />);
    expect(screen.getByRole("button").textContent).toBe("確認");
  });

  it("label 為 string[] 時合併顯示", () => {
    render(<Button label={["確認", "下載"]} />);
    expect(screen.getByRole("button").textContent).toBe("確認下載");
  });

  it("預設 type 為 button（非 submit）", () => {
    render(<Button label="確認" />);
    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("可覆蓋 type 為 submit", () => {
    render(<Button label="送出" type="submit" />);
    expect(screen.getByRole("button").getAttribute("type")).toBe("submit");
  });

  // ─── Variants ──────────────────────────────────────────────────────────

  it("預設 variant 為 secondary（bg-gray-800）", () => {
    render(<Button label="預設" />);
    expect(screen.getByRole("button").className).toContain("bg-gray-800");
  });

  it("primary variant 套用 bg-blue-500", () => {
    render(<Button label="主要" variant="primary" />);
    expect(screen.getByRole("button").className).toContain("bg-blue-500");
  });

  it("tertiary variant 套用 text-blue-500", () => {
    render(<Button label="次要" variant="tertiary" />);
    expect(screen.getByRole("button").className).toContain("text-blue-500");
  });

  it("critical variant 套用 bg-red-600", () => {
    render(<Button label="刪除" variant="critical" />);
    expect(screen.getByRole("button").className).toContain("bg-red-600");
  });

  // ─── Sizes ─────────────────────────────────────────────────────────────

  it("sm 套用 min-h-[32px]", () => {
    render(<Button label="小" size="sm" />);
    expect(screen.getByRole("button").className).toContain("min-h-[32px]");
  });

  it("md（預設）套用 min-h-[36px]", () => {
    render(<Button label="中" />);
    expect(screen.getByRole("button").className).toContain("min-h-[36px]");
  });

  it("lg 套用 min-h-[44px]", () => {
    render(<Button label="大" size="lg" />);
    expect(screen.getByRole("button").className).toContain("min-h-[44px]");
  });

  // ─── Icon ──────────────────────────────────────────────────────────────

  it("icon + text 同時顯示", () => {
    render(<Button label="下載" icon={IconPlus} />);
    const btn = screen.getByRole("button");
    expect(btn.querySelector("svg")).not.toBeNull();
    expect(btn.textContent).toContain("下載");
  });

  it("iconOnly 模式：label 成為 aria-label，不顯示文字", () => {
    render(<Button label="新增訂單" icon={IconPlus} iconOnly />);
    const btn = screen.getByRole("button");
    expect(btn.getAttribute("aria-label")).toBe("新增訂單");
    // 按鈕內不應有文字 node（只有 svg）
    const textContent = btn.textContent?.trim() ?? "";
    expect(textContent).toBe("");
  });

  // ─── States ────────────────────────────────────────────────────────────

  it("disabled 時 button 被停用", () => {
    render(<Button label="停用" disabled />);
    expect(screen.getByRole("button").hasAttribute("disabled")).toBe(true);
  });

  it("loading 時 button 被停用且顯示 spinner", () => {
    render(<Button label="載入中" loading />);
    const btn = screen.getByRole("button");
    expect(btn.hasAttribute("disabled")).toBe(true);
    expect(btn.querySelector(".animate-spin")).not.toBeNull();
  });

  it("loading 時隱藏原本的 icon", () => {
    render(<Button label="載入" icon={IconPlus} loading />);
    const btn = screen.getByRole("button");
    const svgs = btn.querySelectorAll("svg");
    // 只有 spinner 的 svg
    expect(svgs.length).toBe(1);
    expect(svgs[0].classList.contains("animate-spin")).toBe(true);
  });

  // ─── fullWidth ─────────────────────────────────────────────────────────

  it("fullWidth 套用 w-full", () => {
    render(<Button label="全寬" fullWidth />);
    expect(screen.getByRole("button").className).toContain("w-full");
  });

  // ─── onClick ───────────────────────────────────────────────────────────

  it("onClick 正確觸發", () => {
    const handleClick = vi.fn();
    render(<Button label="點我" onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  // ─── className 合併 ────────────────────────────────────────────────────

  it("額外 className 合併到 button", () => {
    render(<Button label="自訂" className="flex-1" />);
    expect(screen.getByRole("button").className).toContain("flex-1");
  });
});
