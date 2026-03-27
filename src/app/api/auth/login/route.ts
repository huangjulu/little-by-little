import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { apiError, apiOk } from "@/lib/api-response";
import { createClient } from "@/utils/supabase/server";

const GATE_PASSCODE = "1234";
const AUTH_EMAIL = "admin@lbl.local";
const AUTH_PASSWORD = "lbl-admin-1234";

export async function POST(request: NextRequest) {
  try {
    const body: { passcode: string } = await request.json();
    const { passcode } = body;

    if (passcode !== GATE_PASSCODE) {
      return apiError("驗證碼錯誤", 401);
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signInWithPassword({
      email: AUTH_EMAIL,
      password: AUTH_PASSWORD,
    });

    if (error) {
      console.error("Supabase auth error:", error.message);
      return apiError("登入失敗，請稍後再試");
    }

    return apiOk(null, { message: "驗證成功" });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "未知錯誤";
    console.error("Auth login error:", msg);
    return apiError("伺服器錯誤");
  }
}
