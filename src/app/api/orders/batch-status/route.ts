import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import type { PaymentStatus } from "@/features/order/types";
import { apiError, apiOk } from "@/lib/api-response";
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
  let body: BatchStatusBody;
  try {
    body = await request.json();
  } catch {
    return apiError("無效的 JSON 格式", 400);
  }

  if (!body.ids || !Array.isArray(body.ids)) {
    return apiError("ids 必須為陣列", 400);
  }

  if (
    !body.paymentStatus ||
    !VALID_PAYMENT_STATUSES.includes(body.paymentStatus)
  ) {
    return apiError(
      `paymentStatus 必須為 ${VALID_PAYMENT_STATUSES.join(" | ")}`,
      400
    );
  }

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
      return apiError(error.message);
    }

    return apiOk(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "未知錯誤";
    console.error("批量更新狀態失敗:", msg);
    return apiError("批量更新狀態失敗");
  }
}
