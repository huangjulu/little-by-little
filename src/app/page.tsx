import { AuthGate } from "@/features/auth/AuthGate";
import ViewOrder from "@/features/order/view/ViewOrder";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
  return (
    <AuthGate>
      <div
        className={cn(
          "flex flex-1 flex-col bg-gray-100 px-4 py-8 text-gray-800 overflow-hidden"
        )}
      >
        <main
          className={cn(
            "mx-auto flex w-full max-w-6xl flex-1 flex-col overflow-hidden rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm"
          )}
        >
          <ViewOrder className="flex-1 overflow-hidden" />
        </main>
      </div>
    </AuthGate>
  );
}
