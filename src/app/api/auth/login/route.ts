import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

const GATE_PASSCODE = "1234";
const AUTH_EMAIL = "admin@lbl.local";
const AUTH_PASSWORD = "lbl-admin-1234";

export async function POST(request: NextRequest) {
  try {
    const body: { passcode: string } = await request.json();
    const { passcode } = body;

    if (passcode !== GATE_PASSCODE) {
      return NextResponse.json(
        { error: true, message: "驗證碼錯誤" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signInWithPassword({
      email: AUTH_EMAIL,
      password: AUTH_PASSWORD,
    });

    if (error) {
      console.error("Supabase auth error:", error.message);
      return NextResponse.json(
        { error: true, message: "登入失敗，請稍後再試" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: false, message: "驗證成功" },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "未知錯誤";
    console.error("Auth login error:", msg);
    return NextResponse.json(
      { error: true, message: "伺服器錯誤" },
      { status: 500 }
    );
  }
}
