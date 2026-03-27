import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

afterEach(cleanup);

import { statusBadgeVariant, statusLabel } from "../../constants";
import type { OrderStatus } from "../../types";
import StatusBadge from "../StatusBadge";

// ─── 各狀態正確渲染 label ────────────────────────────────────────────────────

describe("StatusBadge — 各狀態顯示正確文字", () => {
  const statuses: OrderStatus[] = ["active", "inactive"];

  statuses.forEach((status) => {
    it(`status="${status}" 顯示 "${statusLabel[status]}"`, () => {
      render(<StatusBadge status={status} />);
      expect(screen.getByText(statusLabel[status])).toBeDefined();
    });
  });
});

// ─── 各狀態正確套用 variant ──────────────────────────────────────────────────

describe("StatusBadge — 各狀態套用正確的 Badge variant 樣式", () => {
  it("active 套用 success variant（綠色系）", () => {
    const { container } = render(<StatusBadge status="active" />);
    const badge = container.querySelector("[data-slot='badge']")!;

    expect(statusBadgeVariant.active).toBe("success");
    expect(badge.className).toContain("bg-green-100");
    expect(badge.className).toContain("text-green-800");
  });

  it("inactive 套用 default variant（灰色系）", () => {
    const { container } = render(<StatusBadge status="inactive" />);
    const badge = container.querySelector("[data-slot='badge']")!;

    expect(statusBadgeVariant.inactive).toBe("default");
    expect(badge.className).toContain("bg-gray-100");
    expect(badge.className).toContain("text-gray-500");
  });
});

// ─── className 傳遞 ─────────────────────────────────────────────────────────

describe("StatusBadge — className 傳遞", () => {
  it("額外的 className 正確合併", () => {
    const { container } = render(
      <StatusBadge status="active" className="mt-2" />
    );
    const badge = container.querySelector("[data-slot='badge']")!;

    expect(badge.className).toContain("mt-2");
  });
});
