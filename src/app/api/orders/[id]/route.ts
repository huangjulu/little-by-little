import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { mapToOrder, type CustomerRow } from "@/lib/mappers/order-mapper";
import type { OrderStatus } from "@/features/order/order-types";

/**
 * GET /api/orders/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("customers")
      .select("*, orders!inner(*)")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: true, message: "訂單不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: false, data: mapToOrder(data as CustomerRow) },
      { status: 200 }
    );
  } catch {
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
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const body = await request.json();

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
        .eq("id", id);

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
      .eq("id", id)
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
        data: mapToOrder(data as CustomerRow),
        message: "訂單更新成功",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: true, message: "更新訂單失敗" },
      { status: 500 }
    );
  }
}
