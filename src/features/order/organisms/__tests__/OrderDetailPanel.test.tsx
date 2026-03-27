import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(cleanup);

import type { Order } from "../../types";
import OrderDetailPanel from "../OrderDetailPanel";

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

// ─── 訂單明細正確渲染 ────────────────────────────────────────────────────────

describe("OrderDetailPanel — 訂單明細正確渲染", () => {
  it("顯示訂單標題「訂單明細」", () => {
    render(<OrderDetailPanel order={makeOrder()} />);
    expect(screen.getByText("訂單明細")).toBeDefined();
  });

  it("顯示客戶姓名", () => {
    render(<OrderDetailPanel order={makeOrder({ customerName: "李大華" })} />);
    expect(screen.getByText("李大華")).toBeDefined();
  });

  it("顯示手機號碼", () => {
    render(
      <OrderDetailPanel order={makeOrder({ mobilePhone: "0987654321" })} />
    );
    expect(screen.getByText("0987654321")).toBeDefined();
  });

  it("顯示訂單 ID", () => {
    render(<OrderDetailPanel order={makeOrder({ id: "ORD-999" })} />);
    expect(screen.getByText("ORD-999")).toBeDefined();
  });

  it("顯示社區名稱與戶號", () => {
    render(
      <OrderDetailPanel
        order={makeOrder({ communityName: "陽光社區", houseUnit: "B棟3樓" })}
      />
    );
    expect(screen.getByText("陽光社區 B棟3樓")).toBeDefined();
  });

  it("顯示合約起始與到期日", () => {
    render(
      <OrderDetailPanel
        order={makeOrder({
          contractStartDate: "2026-01-01",
          contractEndDate: "2026-12-31",
        })}
      />
    );
    expect(screen.getByText("2026-01-01")).toBeDefined();
    expect(screen.getByText("2026-12-31")).toBeDefined();
  });

  it("顯示狀態 Badge", () => {
    render(<OrderDetailPanel order={makeOrder({ status: "active" })} />);
    expect(screen.getByText("啟用中")).toBeDefined();
  });
});

// ─── 下載按鈕 ────────────────────────────────────────────────────────────────

describe("OrderDetailPanel — 下載按鈕", () => {
  it("有 onDownload 時顯示下載按鈕", () => {
    render(<OrderDetailPanel order={makeOrder()} onDownload={() => {}} />);
    expect(screen.getByText("下載繳費通知")).toBeDefined();
  });

  it("無 onDownload 時不顯示下載按鈕", () => {
    render(<OrderDetailPanel order={makeOrder()} />);
    expect(screen.queryByText("下載繳費通知")).toBeNull();
  });

  it("點擊下載按鈕觸發 onDownload", () => {
    const onDownload = vi.fn();
    render(<OrderDetailPanel order={makeOrder()} onDownload={onDownload} />);

    fireEvent.click(screen.getByText("下載繳費通知"));

    expect(onDownload).toHaveBeenCalledTimes(1);
  });
});

// ─── className 傳遞 ──────────────────────────────────────────────────────────

describe("OrderDetailPanel — className 傳遞", () => {
  it("額外的 className 正確合併到 Card", () => {
    const { container } = render(
      <OrderDetailPanel order={makeOrder()} className="w-96" />
    );
    const card = container.firstElementChild!;
    expect(card.className).toContain("w-96");
  });
});

// ─── 欄位缺值時顯示 fallback ─────────────────────────────────────────────────

describe("OrderDetailPanel — 欄位缺值 fallback", () => {
  it("合約日期為空字串時顯示 '—'", () => {
    render(
      <OrderDetailPanel
        order={makeOrder({
          contractStartDate: "",
          contractEndDate: "",
          paymentDeadline: "",
          nextBillingDate: "",
        })}
      />
    );
    // 四個日期欄位都為空，應顯示 "—" fallback
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThanOrEqual(4);
  });
});
