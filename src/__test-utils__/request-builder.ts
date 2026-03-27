import { NextRequest } from "next/server";

const BASE = "http://localhost:3000";

/** 建構 GET NextRequest，可帶 searchParams */
export function getRequest(
  path: string,
  params?: Record<string, string>
): NextRequest {
  const url = new URL(path, BASE);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  return new NextRequest(url, { method: "GET" });
}

/** 建構 JSON body NextRequest（POST / PATCH / PUT / DELETE） */
export function jsonRequest(
  path: string,
  method: string,
  body: unknown
): NextRequest {
  return new NextRequest(new URL(path, BASE), {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** 建構 raw body NextRequest（用於測試 invalid JSON） */
export function rawRequest(
  path: string,
  method: string,
  body: string
): NextRequest {
  return new NextRequest(new URL(path, BASE), {
    method,
    headers: { "Content-Type": "application/json" },
    body,
  });
}
