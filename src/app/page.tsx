"use client";

import { cn } from "@/lib/utils";
import { ViewOrder } from "@/features/order/view/ViewOrder";
import { AuthGate } from "@/features/auth/AuthGate";

export default function OrdersPage() {
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
