import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import type { CreateOrderParams } from "@/features/order/types";
import { apiError, apiOk } from "@/lib/api-response";
import { getNextMonthRange } from "@/features/order/billing/utils/billing-filter";
import { type CustomerRow, mapToOrder } from "@/lib/mappers/order-mapper";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/orders
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const billing = searchParams.get("billing");
    const keyword = searchParams.get("keyword");
    const pageStr = searchParams.get("page");
    const pageSizeStr = searchParams.get("pageSize");
    const page = Math.max(1, parseInt(pageStr ?? "1") || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(pageSizeStr ?? "20") || 20)
    );
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("customers")
      .select("*, orders!inner(*)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (status && status !== "all") {
      query = query.eq("order_status", status);
    }

    if (billing === "next-month") {
      const { start, end } = getNextMonthRange();
      query = query
        .gte("orders.next_billing_date", start)
        .lte("orders.next_billing_date", end);
    } else if (billing === "overdue") {
      const today = new Date().toISOString().split("T")[0];
      query = query.lt("orders.payment_deadline", today);
    }

    if (keyword) {
      const kw = keyword.trim();
      query = query.or(
        [
          `customer_info->>customer_name.ilike.%${kw}%`,
          `customer_info->>mobile_phone.ilike.%${kw}%`,
          `customer_info->>community_name.ilike.%${kw}%`,
        ].join(",")
      );
    }

    const { data, error, count } = await query;

    if (error) {
      return apiError(error.message);
    }

    const rows: CustomerRow[] = data ?? [];
    const orders = rows.map(mapToOrder);

    return apiOk(orders, { total: count ?? orders.length });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "未知錯誤";
    console.error("取得訂單列表失敗:", msg);
    return apiError("取得訂單列表失敗");
  }
}

/**
 * POST /api/orders
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const body: CreateOrderParams = await request.json();

    const requiredFields = ["customerName", "mobilePhone"];
    const missingFields = requiredFields.filter((f) => !(f in body));
    if (missingFields.length > 0) {
      return apiError(`缺少必要欄位: ${missingFields.join(", ")}`, 400);
    }

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        base_price: body.basePrice ?? 0,
        current_price: body.currentPrice ?? 0,
        contract_start_date: body.contractStartDate ?? null,
        contract_end_date: body.contractEndDate ?? null,
        payment_deadline: body.paymentDeadline ?? null,
        next_billing_date: body.nextBillingDate ?? null,
      })
      .select()
      .single();

    if (orderError || !orderData) {
      return apiError(orderError?.message ?? "建立訂單失敗");
    }

    const { data: customerData, error: customerError } = await supabase
      .from("customers")
      .insert({
        customer_info: {
          customer_name: body.customerName,
          mobile_phone: body.mobilePhone,
          community_name: body.communityName ?? "",
          house_unit: body.houseUnit ?? "",
        },
        order_id: orderData.id,
        order_status: "active",
      })
      .select("*, orders!inner(*)")
      .single();

    if (customerError || !customerData) {
      await supabase.from("orders").delete().eq("id", orderData.id);
      return apiError(customerError?.message ?? "建立客戶記錄失敗");
    }

    return apiOk(mapToOrder(customerData), {
      message: "訂單建立成功",
      status: 201,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "未知錯誤";
    console.error("建立訂單失敗:", msg);
    return apiError("建立訂單失敗");
  }
}
