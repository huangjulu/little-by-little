import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Order } from "../../types";
import useCheckedOrders from "../useCheckedOrders";

// Helpers

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: "ORD-001",
    orderId: 1,
    customerName: "王小明",
    mobilePhone: "0912345678",
    communityName: "幸福社區",
    houseUnit: "A棟12樓",
    address: "台北市信義區",
    basePrice: 1000,
    currentPrice: 900,
    contractStartDate: "2026-01-01",
    contractEndDate: "2026-12-31",
    paymentDeadline: "2026-02-01",
    nextBillingDate: "2026-03-01",
    createdAt: "2026-01-01",
    status: "active",
    paymentStatus: "up_to_date",
    speed: "100M",
    billingPlan: "月繳",
    atmAccountNumber: "1234567890",
    projectCode: "PRJ-001",
    deposit: 0,
    priceDifference: 0,
    yearlyFee: null,
    yearlyBonusMonths: null,
    twoYearFee: null,
    twoYearBonusMonths: null,
    lastNoticeDownloadedAt: null,
    ...overrides,
  };
}

const ORDERS = [
  makeOrder({ id: "ORD-001" }),
  makeOrder({ id: "ORD-002" }),
  makeOrder({ id: "ORD-003" }),
];

// ─── toggle ──────────────────────────────────────────────────────────────────

describe("useCheckedOrders — toggle", () => {
  it("toggle 新增尚未勾選的 id", () => {
    const { result } = renderHook(() => useCheckedOrders(ORDERS));

    act(() => result.current.toggle("ORD-001"));

    expect(result.current.checkedIds.has("ORD-001")).toBe(true);
    expect(result.current.checkedIds.size).toBe(1);
  });

  it("toggle 移除已勾選的 id", () => {
    const { result } = renderHook(() => useCheckedOrders(ORDERS));

    act(() => result.current.toggle("ORD-001"));
    act(() => result.current.toggle("ORD-001"));

    expect(result.current.checkedIds.has("ORD-001")).toBe(false);
    expect(result.current.checkedIds.size).toBe(0);
  });

  it("toggle 多個不同 id", () => {
    const { result } = renderHook(() => useCheckedOrders(ORDERS));

    act(() => result.current.toggle("ORD-001"));
    act(() => result.current.toggle("ORD-002"));

    expect(result.current.checkedIds.size).toBe(2);
    expect(result.current.checkedIds.has("ORD-001")).toBe(true);
    expect(result.current.checkedIds.has("ORD-002")).toBe(true);
  });
});

// ─── selectAll ───────────────────────────────────────────────────────────────

describe("useCheckedOrders — selectAll", () => {
  it("selectAll 選取所有 orders 的 id", () => {
    const { result } = renderHook(() => useCheckedOrders(ORDERS));

    act(() => result.current.selectAll());

    expect(result.current.checkedIds.size).toBe(3);
    expect(result.current.checkedIds.has("ORD-001")).toBe(true);
    expect(result.current.checkedIds.has("ORD-002")).toBe(true);
    expect(result.current.checkedIds.has("ORD-003")).toBe(true);
  });
});

// ─── deselectAll ─────────────────────────────────────────────────────────────

describe("useCheckedOrders — deselectAll", () => {
  it("deselectAll 清除所有已勾選的 id", () => {
    const { result } = renderHook(() => useCheckedOrders(ORDERS));

    act(() => result.current.selectAll());
    act(() => result.current.deselectAll());

    expect(result.current.checkedIds.size).toBe(0);
  });
});

// ─── selectByIds ─────────────────────────────────────────────────────────────

describe("useCheckedOrders — selectByIds", () => {
  it("selectByIds 設定指定的 id 集合", () => {
    const { result } = renderHook(() => useCheckedOrders(ORDERS));

    act(() => result.current.selectByIds(["ORD-001", "ORD-003"]));

    expect(result.current.checkedIds.size).toBe(2);
    expect(result.current.checkedIds.has("ORD-001")).toBe(true);
    expect(result.current.checkedIds.has("ORD-002")).toBe(false);
    expect(result.current.checkedIds.has("ORD-003")).toBe(true);
  });
});

// ─── checkedIds 為 Set ──────────────────────────────────────────────────────

describe("useCheckedOrders — checkedIds 型別", () => {
  it("checkedIds 為 Set<string>", () => {
    const { result } = renderHook(() => useCheckedOrders(ORDERS));

    expect(result.current.checkedIds).toBeInstanceOf(Set);
  });

  it("初始狀態為空 Set", () => {
    const { result } = renderHook(() => useCheckedOrders(ORDERS));

    expect(result.current.checkedIds.size).toBe(0);
  });
});

// ─── 全選狀態判斷 ─────────────────────────────────────────────────────────────

describe("useCheckedOrders — 全選狀態", () => {
  it("selectAll 後 checkedIds.size 等於 orders.length", () => {
    const { result } = renderHook(() => useCheckedOrders(ORDERS));

    act(() => result.current.selectAll());

    const isAllChecked = result.current.checkedIds.size === ORDERS.length;
    expect(isAllChecked).toBe(true);
  });

  it("部分勾選時 checkedIds.size 不等於 orders.length", () => {
    const { result } = renderHook(() => useCheckedOrders(ORDERS));

    act(() => result.current.toggle("ORD-001"));

    const isAllChecked = result.current.checkedIds.size === ORDERS.length;
    expect(isAllChecked).toBe(false);
  });
});
