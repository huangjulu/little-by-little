import type { Order } from "@/types/order";

export const mockOrders: Order[] = [
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
