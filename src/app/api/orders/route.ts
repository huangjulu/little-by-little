import { NextRequest, NextResponse } from "next/server";

import type { Order, OrderStatus } from "@/features/order/order-types";
import { mockOrders } from "@/lib/mock-data";
// import { PrismaClient } from "@/generated/prisma";

/**
 * GET /api/orders
 * 取得訂單列表
 */
// const prisma = new PrismaClient();
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const keyword = searchParams.get("keyword");

    let filteredOrders = [...mockOrders];

    // 狀態篩選
    if (status && status !== "all") {
      const validStatuses: OrderStatus[] = [
        "pending",
        "paid",
        "running",
        "cancelled",
      ];
      if (validStatuses.includes(status as OrderStatus)) {
        filteredOrders = filteredOrders.filter(
          (order) => order.status === status
        );
      }
    }

    // 關鍵字篩選
    if (keyword) {
      const kw = keyword.toLowerCase().trim();
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.id.toLowerCase().includes(kw) ||
          order.customerName.toLowerCase().includes(kw) ||
          order.email.toLowerCase().includes(kw)
      );
    }

    return NextResponse.json(
      {
        error: false,
        data: filteredOrders,
        total: filteredOrders.length,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        error: true,
        message: "取得訂單列表失敗",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders
 * 建立新訂單
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 驗證必要欄位
    const requiredFields = ["customerName", "email", "items"];
    const missingFields = requiredFields.filter((field) => !(field in body));

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: true,
          message: `缺少必要欄位: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // 驗證 items
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        {
          error: true,
          message: "items 必須是非空陣列",
        },
        { status: 400 }
      );
    }

    // 計算總金額
    const total = body.items.reduce(
      (sum: number, item: { quantity: number; price: number }) =>
        sum + item.quantity * item.price,
      0
    );

    // 產生訂單 ID
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const orderId = `ORD-${dateStr}-${String(
      Math.floor(Math.random() * 1000)
    ).padStart(3, "0")}`;

    // 建立新訂單
    const newOrder: Order = {
      id: orderId,
      customerName: body.customerName,
      email: body.email,
      createdAt: now.toISOString(),
      total,
      status: "pending",
      items: body.items.map(
        (item: { name: string; quantity: number; price: number }) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })
      ),
    };

    // 在實際專案中，這裡應該要儲存到資料庫
    // 目前只是模擬，將新訂單加入到 mockOrders
    mockOrders.unshift(newOrder);

    return NextResponse.json(
      {
        error: false,
        data: newOrder,
        message: "訂單建立成功",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("建立訂單失敗:", error);
    return NextResponse.json(
      {
        error: true,
        message: "建立訂單失敗",
      },
      { status: 500 }
    );
  }
}
