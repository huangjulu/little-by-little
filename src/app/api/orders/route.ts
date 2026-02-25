import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { mapToOrder, type CustomerRow } from "@/lib/mappers/order-mapper";
import type { CreateOrderParams } from "@/features/order/orders-api";

/**
 * GET /api/orders
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const keyword = searchParams.get("keyword");

    let query = supabase
      .from("customers")
      .select("*, orders!inner(*)")
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("order_status", status);
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

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: true, message: error.message },
        { status: 500 }
      );
    }

    const rows: CustomerRow[] = data ?? [];
    const orders = rows.map(mapToOrder);

    return NextResponse.json(
      { error: false, data: orders, total: orders.length },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "未知錯誤";
    console.error("取得訂單列表失敗:", msg);
    return NextResponse.json(
      { error: true, message: "取得訂單列表失敗" },
      { status: 500 }
    );
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
      return NextResponse.json(
        { error: true, message: `缺少必要欄位: ${missingFields.join(", ")}` },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: true, message: orderError?.message ?? "建立訂單失敗" },
        { status: 500 }
      );
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
      return NextResponse.json(
        { error: true, message: customerError?.message ?? "建立客戶記錄失敗" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: false,
        data: mapToOrder(customerData),
        message: "訂單建立成功",
      },
      { status: 201 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "未知錯誤";
    console.error("建立訂單失敗:", msg);
    return NextResponse.json(
      { error: true, message: "建立訂單失敗" },
      { status: 500 }
    );
  }
}
