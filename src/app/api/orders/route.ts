import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type {
  Order,
  OrderStatus,
  CustomerInfoData,
} from "@/features/order/order-types";

interface CustomerRow {
  id: number;
  customer_info: CustomerInfoData;
  order_id: number;
  order_status: string;
  created_at: string;
  orders: {
    id: number;
    base_price: number;
    current_price: number;
    contract_start_date: string;
    contract_end_date: string;
    payment_deadline: string;
    next_billing_date: string;
    created_at: string;
  };
}

function mapToOrder(row: CustomerRow): Order {
  const info = row.customer_info ?? {};
  const order = row.orders;
  return {
    id: String(row.id),
    orderId: row.order_id,
    customerName: info.customer_name ?? "",
    mobilePhone: info.mobile_phone ?? "",
    communityName: info.community_name ?? "",
    houseUnit: info.house_unit ?? "",
    basePrice: Number(order?.base_price ?? 0),
    currentPrice: Number(order?.current_price ?? 0),
    contractStartDate: order?.contract_start_date ?? "",
    contractEndDate: order?.contract_end_date ?? "",
    paymentDeadline: order?.payment_deadline ?? "",
    nextBillingDate: order?.next_billing_date ?? "",
    createdAt: row.created_at ?? "",
    status: (row.order_status as OrderStatus) ?? "inactive",
  };
}

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

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: true, message: error.message },
        { status: 500 }
      );
    }

    let orders = (data as CustomerRow[]).map(mapToOrder);

    if (keyword) {
      const kw = keyword.toLowerCase().trim();
      orders = orders.filter(
        (o) =>
          o.id.includes(kw) ||
          o.customerName.toLowerCase().includes(kw) ||
          o.mobilePhone.includes(kw) ||
          o.communityName.toLowerCase().includes(kw)
      );
    }

    return NextResponse.json(
      { error: false, data: orders, total: orders.length },
      { status: 200 }
    );
  } catch {
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
    const body = await request.json();

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
        customer_name: body.customerName,
        mobile_phone: body.mobilePhone,
        community_name: body.communityName ?? "",
        house_unit: body.houseUnit ?? "",
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
        data: mapToOrder(customerData as CustomerRow),
        message: "訂單建立成功",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("建立訂單失敗:", error);
    return NextResponse.json(
      { error: true, message: "建立訂單失敗" },
      { status: 500 }
    );
  }
}
