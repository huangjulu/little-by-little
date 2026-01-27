import { NextRequest, NextResponse } from "next/server";
import type { OrderStatus } from "@/features/order/order-types";
import { mockOrders } from "@/lib/mock-data";

/**
 * GET /api/orders/[id]
 * 取得單筆訂單
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = mockOrders.find((o) => o.id === id);

    if (!order) {
      return NextResponse.json(
        {
          error: true,
          message: "訂單不存在",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: false,
        data: order,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        error: true,
        message: "取得訂單失敗",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/orders/[id]
 * 更新訂單狀態
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const orderIndex = mockOrders.findIndex((o) => o.id === id);

    if (orderIndex === -1) {
      return NextResponse.json(
        {
          error: true,
          message: "訂單不存在",
        },
        { status: 404 }
      );
    }

    // 驗證狀態
    if (body.status) {
      const validStatuses: OrderStatus[] = [
        "pending",
        "paid",
        "shipped",
        "cancelled",
      ];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          {
            error: true,
            message: `無效的狀態: ${body.status}`,
          },
          { status: 400 }
        );
      }

      mockOrders[orderIndex].status = body.status;
    }

    return NextResponse.json(
      {
        error: false,
        data: mockOrders[orderIndex],
        message: "訂單更新成功",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        error: true,
        message: "更新訂單失敗",
      },
      { status: 500 }
    );
  }
}
