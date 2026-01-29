"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export default function FinancePage() {
  return (
    <div
      className={cn(
        "flex min-h-screen bg-gray-100 px-4 py-8 text-gray-800",
        "items-center justify-center"
      )}
    >
      <main
        className={cn(
          "mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-4 rounded-2xl bg-white/80 p-8 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm"
        )}
      >
        <h1 className="text-2xl font-semibold tracking-tight">財務管理</h1>
        <p className="text-sm text-gray-500">
          Finance 頁面目前為預留位置，等待後續功能規劃。
        </p>
      </main>
    </div>
  );
}
