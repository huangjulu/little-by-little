import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/finance/revenue?month=2026-03
 * 回傳該月已確認繳費的收益加總
 */
export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month");

  if (!month || !isValidMonth(month)) {
    return NextResponse.json(
      { error: true, message: "month 參數格式必須為 YYYY-MM" },
      { status: 400 }
    );
  }

  const startDate = `${month}-01T00:00:00.000Z`;
  const [year, mon] = month.split("-").map(Number);
  const nextMonth =
    mon === 12
      ? `${year + 1}-01`
      : `${year}-${String(mon + 1).padStart(2, "0")}`;
  const endDate = `${nextMonth}-01T00:00:00.000Z`;

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("customers")
      .select("orders!inner(current_price)")
      .gte("paid_confirmed_at", startDate)
      .lt("paid_confirmed_at", endDate);

    if (error) {
      return NextResponse.json(
        { error: true, message: error.message },
        { status: 500 }
      );
    }

    const rows = data ?? [];
    const totalAmount = rows.reduce(
      (sum, row) => sum + ((row.orders as any)?.current_price ?? 0),
      0
    );

    return NextResponse.json(
      { error: false, data: { totalAmount, count: rows.length } },
      { status: 200 }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "未知錯誤";
    console.error("取得收益加總失敗:", msg);
    return NextResponse.json(
      { error: true, message: "取得收益加總失敗" },
      { status: 500 }
    );
  }
}

function isValidMonth(v: string): boolean {
  const match = v.match(/^(\d{4})-(\d{2})$/);
  if (!match) return false;
  const mon = parseInt(match[2]);
  return mon >= 1 && mon <= 12;
}
