import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import type { OrderStatus } from "@/features/order/types";
import type { UpdateOrderStatusParams } from "@/features/order/types";
import { apiError, apiOk } from "@/lib/api-response";
import { mapToOrder } from "@/lib/mappers/order-mapper";
import { createClient } from "@/utils/supabase/server";

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
      return apiError("訂單不存在", 404);
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("customers")
      .select("*, orders!inner(*)")
      .eq("id", customerId)
      .single();

    if (error || !data) {
      return apiError("訂單不存在", 404);
    }

    return apiOk(mapToOrder(data));
  } catch (error) {
    const msg = error instanceof Error ? error.message : "未知錯誤";
    console.error("取得訂單失敗:", msg);
    return apiError("取得訂單失敗");
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
      return apiError("訂單不存在", 404);
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const body: UpdateOrderStatusParams = await request.json();

    if (body.status) {
      const validStatuses: OrderStatus[] = ["active", "inactive"];
      if (!validStatuses.includes(body.status)) {
        return apiError(`無效的狀態: ${body.status}`, 400);
      }

      const { error } = await supabase
        .from("customers")
        .update({ order_status: body.status })
        .eq("id", customerId);

      if (error) {
        return apiError(error.message);
      }
    }

    const { data, error } = await supabase
      .from("customers")
      .select("*, orders!inner(*)")
      .eq("id", customerId)
      .single();

    if (error || !data) {
      return apiError("訂單不存在", 404);
    }

    return apiOk(mapToOrder(data), { message: "訂單更新成功" });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "未知錯誤";
    console.error("更新訂單失敗:", msg);
    return apiError("更新訂單失敗");
  }
}
