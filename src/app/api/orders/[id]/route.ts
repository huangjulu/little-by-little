import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { mapToOrder } from "@/lib/mappers/order-mapper";
import type { OrderStatus } from "@/features/order/types";
import type { UpdateOrderStatusParams } from "@/features/order/types";

/**
 * GET /api/orders/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customerId = parseInt(id, 10);
    if (Number.isNaN(customerId)) {
      return NextResponse.json(
        { error: true, message: "訂單不存在" },
        { status: 404 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("customers")
      .select("*, orders!inner(*)")
      .eq("id", customerId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: true, message: "訂單不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: false, data: mapToOrder(data) },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "未知錯誤";
    console.error("取得訂單失敗:", msg);
    return NextResponse.json(
      { error: true, message: "取得訂單失敗" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/orders/[id]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customerId = parseInt(id, 10);
    if (Number.isNaN(customerId)) {
      return NextResponse.json(
        { error: true, message: "訂單不存在" },
        { status: 404 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const body: UpdateOrderStatusParams = await request.json();

    if (body.status) {
      const validStatuses: OrderStatus[] = ["active", "inactive"];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: true, message: `無效的狀態: ${body.status}` },
          { status: 400 }
        );
      }

      const { error } = await supabase
        .from("customers")
        .update({ order_status: body.status })
        .eq("id", customerId);

      if (error) {
        return NextResponse.json(
          { error: true, message: error.message },
          { status: 500 }
        );
      }
    }

    const { data, error } = await supabase
      .from("customers")
      .select("*, orders!inner(*)")
      .eq("id", customerId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: true, message: "訂單不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: false,
        data: mapToOrder(data),
        message: "訂單更新成功",
      },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "未知錯誤";
    console.error("更新訂單失敗:", msg);
    return NextResponse.json(
      { error: true, message: "更新訂單失敗" },
      { status: 500 }
    );
  }
}
