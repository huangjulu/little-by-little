import { NextResponse } from "next/server";

import type { ApiResponse } from "@/types/api";

export function apiOk<T>(
  data: T,
  opts?: { message?: string; total?: number; status?: number }
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { error: false, data, message: opts?.message, total: opts?.total },
    { status: opts?.status ?? 200 }
  );
}

const HTTP_INTERNAL_SERVER_ERROR = 500;

export function apiError(
  message: string,
  status = HTTP_INTERNAL_SERVER_ERROR
): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ error: true, message }, { status });
}
