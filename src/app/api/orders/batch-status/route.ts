import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import type { PaymentStatus } from "@/features/order/types";
import { createClient } from "@/utils/supabase/server";

const VALID_PAYMENT_STATUSES: PaymentStatus[] = [
  "up_to_date",
  "waiting_for_payment",
  "overdue",
];

interface BatchStatusBody {
  ids: string[];
  paymentStatus: PaymentStatus;
  updateBillingDate?: boolean;
}

/**
 * PATCH /api/orders/batch-status
 * 批量更新 payment_status（含可選的 billing date 續期）
 */
export async function PATCH(request: NextRequest) {
  // Guard 1: request body 必須是合法 JSON
  let body: BatchStatusBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: true, message: "無效的 JSON 格式" },
      { status: 400 }
    );
  }

  // Guard 2: ids 必須存在且為陣列
  if (!body.ids || !Array.isArray(body.ids)) {
    return NextResponse.json(
      { error: true, message: "ids 必須為陣列" },
      { status: 400 }
    );
  }

  // Guard 3: paymentStatus 必須是允許的枚舉值
  if (
    !body.paymentStatus ||
    !VALID_PAYMENT_STATUSES.includes(body.paymentStatus)
  ) {
    return NextResponse.json(
      {
        error: true,
        message: `paymentStatus 必須為 ${VALID_PAYMENT_STATUSES.join(" | ")}`,
      },
      { status: 400 }
    );
  }

  // 去重 + 轉數字
  const uniqueIds = [...new Set(body.ids)].map(Number).filter(Number.isFinite);

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.rpc("batch_update_payment_status", {
      p_customer_ids: uniqueIds,
      p_new_status: body.paymentStatus,
      p_update_billing: body.updateBillingDate ?? false,
    });

    if (error) {
      return NextResponse.json(
        { error: true, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: false, data }, { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "未知錯誤";
    console.error("批量更新狀態失敗:", msg);
    return NextResponse.json(
      { error: true, message: "批量更新狀態失敗" },
      { status: 500 }
    );
  }
}
