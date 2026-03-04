"use client";

import { cn } from "@/lib/utils";
import { ViewOrder } from "@/features/order/view/ViewOrder";
import { AuthGate } from "@/features/auth/AuthGate";
import { orderApi } from "@/features/order";
import { useEffect } from "react";

export default function OrdersPage() {
  // 為了避免 Supabase 的資料過期，我們需要每隔 7 天自動重新 fetch 一次資料
  useEffect(function automaticFetchOrdersEvery7days() {
    const interval = setInterval(() => {
      orderApi.getOrders.useQuery();
    }, 7 * 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthGate>
      <div
        className={cn("flex min-h-screen bg-gray-100 px-4 py-8 text-gray-800")}
      >
        <main
          className={cn(
            "mx-auto w-full max-w-6xl rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm"
          )}
        >
          <ViewOrder />
        </main>
      </div>
    </AuthGate>
  );
}
