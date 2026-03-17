import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import type { CreateOrderParams } from "@/features/order/types";
import { createClient } from "@/utils/supabase/server";

interface ImportError {
  index: number;
  message: string;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: ImportError[];
}

/**
 * POST /api/orders/import
 * 批量匯入訂單，每筆獨立 transaction
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: true, message: "無效的 JSON 格式" },
      { status: 400 }
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("orders" in body) ||
    !Array.isArray((body as Record<string, unknown>).orders)
  ) {
    return NextResponse.json(
      { error: true, message: "缺少 orders 陣列欄位" },
      { status: 400 }
    );
  }

  const orders = (body as { orders: CreateOrderParams[] }).orders;
  const result: ImportResult = { success: 0, failed: 0, errors: [] };

  if (orders.length === 0) {
    return NextResponse.json({ error: false, data: result }, { status: 200 });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 先同步驗證，收集待插入的項目
  const toInsert: { order: CreateOrderParams; index: number }[] = [];
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    const error = validateOrder(order, i);
    if (error) {
      result.failed++;
      result.errors.push(error);
    } else {
      toInsert.push({ order, index: i });
    }
  }

  // 批次平行插入（每批 10 筆並發）
  for (let start = 0; start < toInsert.length; start += BATCH_SIZE) {
    const batch = toInsert.slice(start, start + BATCH_SIZE);
    const outcomes = await Promise.allSettled(
      batch.map((item) => insertOrder(supabase, item.order, item.index))
    );

    for (const outcome of outcomes) {
      if (outcome.status === "fulfilled") {
        if (outcome.value) {
          result.failed++;
          result.errors.push(outcome.value);
        } else {
          result.success++;
        }
      } else {
        result.failed++;
        result.errors.push({
          index: batch[outcomes.indexOf(outcome)].index,
          message:
            outcome.reason instanceof Error
              ? outcome.reason.message
              : "未知錯誤",
        });
      }
    }
  }

  return NextResponse.json({ error: false, data: result }, { status: 200 });
}

// ─── 內部輔助函式 ────────────────────────────────────────────────────────────

const BATCH_SIZE = 10;

function validateOrder(
  order: CreateOrderParams,
  index: number
): ImportError | null {
  if (!order.customerName?.trim()) {
    return { index, message: "客戶姓名 為必填" };
  }
  if (!order.mobilePhone?.trim()) {
    return { index, message: "手機號碼 為必填" };
  }
  return null;
}

async function insertOrder(
  supabase: ReturnType<typeof createClient>,
  order: CreateOrderParams,
  index: number
): Promise<ImportError | null> {
  // 1. 建立 orders 記錄
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      base_price: order.basePrice ?? 0,
      current_price: order.currentPrice ?? 0,
      contract_start_date: order.contractStartDate ?? null,
      contract_end_date: order.contractEndDate ?? null,
      payment_deadline: order.paymentDeadline ?? null,
      next_billing_date: order.nextBillingDate ?? null,
    })
    .select()
    .single();

  if (orderError || !orderData) {
    return { index, message: orderError?.message ?? "建立訂單失敗" };
  }

  // 2. 建立 customers 記錄
  const { error: customerError } = await supabase
    .from("customers")
    .insert({
      customer_info: {
        customer_name: order.customerName,
        mobile_phone: order.mobilePhone,
        community_name: order.communityName ?? "",
        house_unit: order.houseUnit ?? "",
      },
      order_id: orderData.id,
      order_status: "active",
    })
    .select("*, orders!inner(*)")
    .single();

  if (customerError) {
    // rollback：刪除已建立的 order
    await supabase.from("orders").delete().eq("id", orderData.id);
    return { index, message: customerError.message ?? "建立客戶記錄失敗" };
  }

  return null;
}
