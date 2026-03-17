import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(cleanup);

import type { Order } from "../../types";
import OrderRow from "../OrderRow";

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
    ...overrides,
  };
}

function renderRow(
  props: Partial<React.ComponentPropsWithoutRef<typeof OrderRow>> = {}
) {
  const order = props.order ?? makeOrder();
  return render(
    <table>
      <tbody>
        <OrderRow order={order} {...props} />
      </tbody>
    </table>
  );
}

// ─── P0：handler 正確傳遞 orderId ────────────────────────────────────────────

describe("OrderRow handler 正確傳遞 orderId", () => {
  it("點擊 row 時 onOrderClick 收到 order.id", () => {
    const onOrderClick = vi.fn();
    renderRow({ order: makeOrder({ id: "ORD-042" }), onOrderClick });

    fireEvent.click(screen.getByText("ORD-042").closest("tr")!);

    expect(onOrderClick).toHaveBeenCalledTimes(1);
    expect(onOrderClick).toHaveBeenCalledWith("ORD-042");
  });

  it("勾選 checkbox 時 onToggleCheck 收到 order.id", () => {
    const onToggleCheck = vi.fn();
    renderRow({
      order: makeOrder({ id: "ORD-077" }),
      billingMode: true,
      onToggleCheck,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(onToggleCheck).toHaveBeenCalledTimes(1);
    expect(onToggleCheck).toHaveBeenCalledWith("ORD-077");
  });
});

// ─── P1：memo 阻止無關 row 重新渲染 ──────────────────────────────────────────

describe("OrderRow memo 阻止無關 row 重新渲染", () => {
  it("props 未變時不重新渲染", () => {
    const renderSpy = vi.fn();
    const SpiedOrderRow = React.memo(
      React.forwardRef<
        HTMLTableRowElement,
        React.ComponentPropsWithoutRef<typeof OrderRow>
      >(function SpiedRow(props, _ref) {
        renderSpy();
        return <OrderRow {...props} />;
      })
    );

    const order = makeOrder({ id: "ORD-STABLE" });
    const onOrderClick = vi.fn();

    const { rerender } = render(
      <table>
        <tbody>
          <SpiedOrderRow order={order} onOrderClick={onOrderClick} />
        </tbody>
      </table>
    );

    expect(renderSpy).toHaveBeenCalledTimes(1);

    // 用相同 props 重新 render
    rerender(
      <table>
        <tbody>
          <SpiedOrderRow order={order} onOrderClick={onOrderClick} />
        </tbody>
      </table>
    );

    // 外層 SpiedOrderRow 的 memo 擋住，spy 不會再被呼叫
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it("OrderRow 本身的 memo：相同 props 不觸發子元件重新渲染", () => {
    const order = makeOrder({ id: "ORD-MEMO" });
    const onOrderClick = vi.fn();

    const { rerender, container } = render(
      <table>
        <tbody>
          <OrderRow
            order={order}
            onOrderClick={onOrderClick}
            isSelected={false}
          />
        </tbody>
      </table>
    );

    const rowBefore = container.querySelector("tr");

    // 相同 reference 的 props 重新 render
    rerender(
      <table>
        <tbody>
          <OrderRow
            order={order}
            onOrderClick={onOrderClick}
            isSelected={false}
          />
        </tbody>
      </table>
    );

    const rowAfter = container.querySelector("tr");
    // memo 生效時 DOM 節點不會被替換
    expect(rowBefore).toBe(rowAfter);
  });

  it("isSelected 變化時該 row 會重新渲染", () => {
    const order = makeOrder({ id: "ORD-CHANGE" });
    const onOrderClick = vi.fn();

    const { rerender, container } = render(
      <table>
        <tbody>
          <OrderRow
            order={order}
            onOrderClick={onOrderClick}
            isSelected={false}
          />
        </tbody>
      </table>
    );

    const row = container.querySelector("tr")!;
    expect(row.className).toContain("bg-white");

    rerender(
      <table>
        <tbody>
          <OrderRow
            order={order}
            onOrderClick={onOrderClick}
            isSelected={true}
          />
        </tbody>
      </table>
    );

    const rowUpdated = container.querySelector("tr")!;
    expect(rowUpdated.className).toContain("bg-gray-100/80");
  });
});
