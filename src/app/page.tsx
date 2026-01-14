"use client";

import { useMemo, useState } from "react";

type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

type Order = {
  id: string;
  customerName: string;
  email: string;
  createdAt: string;
  total: number;
  status: OrderStatus;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
};

const mockOrders: Order[] = [
  {
    id: "ORD-240101-001",
    customerName: "王小明",
    email: "xiaoming@example.com",
    createdAt: "2026-01-10T10:21:00Z",
    total: 1680,
    status: "pending",
    items: [
      { name: "Standard Plan", quantity: 1, price: 980 },
      { name: "Add-on A", quantity: 1, price: 700 },
    ],
  },
  {
    id: "ORD-240101-002",
    customerName: "林小姐",
    email: "lin@example.com",
    createdAt: "2026-01-09T14:10:00Z",
    total: 2990,
    status: "paid",
    items: [{ name: "Pro Plan", quantity: 1, price: 2990 }],
  },
  {
    id: "ORD-240101-003",
    customerName: "陳大雄",
    email: "chen@example.com",
    createdAt: "2026-01-08T09:05:00Z",
    total: 1290,
    status: "shipped",
    items: [{ name: "Basic Plan", quantity: 1, price: 1290 }],
  },
  {
    id: "ORD-240101-004",
    customerName: "Demo 取消訂單",
    email: "cancel@example.com",
    createdAt: "2026-01-07T17:40:00Z",
    total: 800,
    status: "cancelled",
    items: [{ name: "Add-on B", quantity: 2, price: 400 }],
  },
];

const statusLabel: Record<OrderStatus, string> = {
  pending: "待付款",
  paid: "已付款",
  shipped: "已出貨",
  cancelled: "已取消",
};

const statusChipStyle: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-100",
  paid: "bg-emerald-50 text-emerald-800 ring-emerald-100",
  shipped: "bg-blue-50 text-blue-800 ring-blue-100",
  cancelled: "bg-zinc-100 text-zinc-500 ring-zinc-200 line-through",
};

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function OrdersPage() {
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [selectedId, setSelectedId] = useState<string | null>(mockOrders[0]?.id ?? null);

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      const matchStatus =
        statusFilter === "all" ? true : order.status === statusFilter;

      const kw = keyword.trim().toLowerCase();
      const matchKeyword =
        kw.length === 0
          ? true
          : order.id.toLowerCase().includes(kw) ||
            order.customerName.toLowerCase().includes(kw) ||
            order.email.toLowerCase().includes(kw);

      return matchStatus && matchKeyword;
    });
  }, [keyword, statusFilter]);

  const selectedOrder = filteredOrders.find((o) => o.id === selectedId) ?? filteredOrders[0] ?? null;

  const totalRevenue = useMemo(
    () =>
      mockOrders
        .filter((o) => o.status === "paid" || o.status === "shipped")
        .reduce((sum, o) => sum + o.total, 0),
    []
  );

  const pendingCount = mockOrders.filter((o) => o.status === "pending").length;

  return (
    <div className="flex min-h-screen bg-zinc-50 px-4 py-8 text-zinc-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-zinc-200 backdrop-blur-sm">
        {/* Header */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              訂單管理
            </h1>
            <p className="text-sm text-zinc-500">
              查看訂單狀態、基本明細與金額概況。後續可接上實際 API。
            </p>
          </div>
          <div className="flex gap-3 text-sm">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2">
              <div className="text-xs text-zinc-500">有效營收（已付款＋已出貨）</div>
              <div className="mt-1 font-semibold">
                {formatCurrency(totalRevenue)}
              </div>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-2">
              <div className="text-xs text-amber-700">待處理訂單</div>
              <div className="mt-1 text-right text-lg font-semibold text-amber-800">
                {pendingCount}
              </div>
            </div>
          </div>
        </header>

        {/* Filters */}
        <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-xs">
            <span className="text-zinc-400">🔍</span>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="以 訂單編號 / 客戶姓名 / Email 搜尋"
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>狀態</span>
            <div className="flex gap-1 rounded-full bg-white p-1 text-xs ring-1 ring-zinc-200">
              {[
                { value: "all", label: "全部" },
                { value: "pending", label: "待付款" },
                { value: "paid", label: "已付款" },
                { value: "shipped", label: "已出貨" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    setStatusFilter(item.value as "all" | OrderStatus)
                  }
                  className={`rounded-full px-3 py-1 transition-colors ${
                    statusFilter === item.value
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Layout: List + Detail */}
        <section className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
          {/* Orders table */}
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <div className="border-b border-zinc-100 px-4 py-2 text-xs text-zinc-500">
              共 {filteredOrders.length} 筆訂單
            </div>
            <div className="max-h-[480px] overflow-auto text-sm">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10 bg-zinc-50 text-xs text-zinc-500">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">訂單編號</th>
                    <th className="px-3 py-2 text-left font-medium">客戶</th>
                    <th className="px-3 py-2 text-left font-medium">建立時間</th>
                    <th className="px-3 py-2 text-right font-medium">金額</th>
                    <th className="px-3 py-2 text-center font-medium">狀態</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedId(order.id)}
                      className={`cursor-pointer border-b border-zinc-50 align-middle text-xs transition-colors hover:bg-zinc-50 ${
                        selectedOrder?.id === order.id
                          ? "bg-zinc-50/80"
                          : "bg-white"
                      }`}
                    >
                      <td className="px-3 py-3 font-mono text-[11px] text-zinc-700">
                        {order.id}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">
                            {order.customerName}
                          </span>
                          <span className="truncate text-[11px] text-zinc-400">
                            {order.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[11px] text-zinc-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-3 py-3 text-right text-xs font-semibold">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[10px] font-medium ring-1 ${statusChipStyle[order.status]}`}
                        >
                          {statusLabel[order.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center text-xs text-zinc-400"
                      >
                        找不到符合條件的訂單，試試調整搜尋關鍵字或狀態。
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail panel */}
          <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold">訂單明細</h2>
                <p className="text-xs text-zinc-500">
                  點選左側列表中的任一筆訂單查看細節。
                </p>
              </div>
              {selectedOrder && (
                <span
                  className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[10px] font-medium ring-1 ${statusChipStyle[selectedOrder.status]}`}
                >
                  {statusLabel[selectedOrder.status]}
                </span>
              )}
            </div>

            {selectedOrder ? (
              <div className="space-y-4 text-xs">
                <div className="space-y-1 rounded-lg border border-zinc-200 bg-white px-3 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-zinc-500">
                      {selectedOrder.id}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {formatDate(selectedOrder.createdAt)}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between gap-2">
                    <div>
                      <div className="text-xs font-medium">
                        {selectedOrder.customerName}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {selectedOrder.email}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-zinc-500">訂單金額</div>
                      <div className="text-sm font-semibold">
                        {formatCurrency(selectedOrder.total)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 rounded-lg border border-zinc-200 bg-white px-3 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-700">
                      內含品項
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      共 {selectedOrder.items.length} 筆
                    </span>
                  </div>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={`${selectedOrder.id}-${index}`}
                        className="flex items-center justify-between text-[11px] text-zinc-600"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-zinc-700">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            數量 × {item.quantity}
                          </span>
                        </div>
                        <span className="font-mono text-[11px]">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-100/70 px-3 py-3 text-[11px] text-zinc-500">
                  <p className="mb-1 font-medium text-zinc-600">
                    接上真實 API 的建議
                  </p>
                  <ul className="list-disc space-y-1 pl-4">
                    <li>以 `/api/orders` 取得列表（支援分頁、狀態與關鍵字查詢）。</li>
                    {/* <li>點選列表後，以 `/api/orders/{id}` 取得單筆明細。</li> */}
                    <li>後續可以在這裡加上「變更狀態」、「備註欄位」、「操作紀錄」等元件。</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center text-xs text-zinc-400">
                目前沒有符合條件的訂單。
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
