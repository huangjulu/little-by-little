"use client";

import { cn } from "@/lib/utils";
import { ViewOrder } from "@/features/order/view/ViewOrder";
// import TestSupabase from "./test_supabase";
import { supabase } from "@/utils/supabase/client";
import { useEffect } from "react";
// import Dialog from "@/ui/dialog";

export default function OrdersPage() {
  const fetchOrders = async () => {
    const { data, error } = await supabase.from("orders").select("*");
    if (error) {
      console.error(error);
    }
    return data;
  };
  useEffect(function authorizeUserViaDialog() {});

  return (
    <div
      className={cn("flex min-h-screen bg-gray-100 px-4 py-8 text-gray-800")}
    >
      <main
        className={cn(
          "mx-auto w-full max-w-6xl rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm"
        )}
      >
        <ViewOrder />
        <button onClick={fetchOrders}>Fetch Orders</button>
      </main>
    </div>
  );
}

// const AuthorizeDialog: React.FC = () => {
//   return (
//     <Dialog.Root>
//       <Dialog.Content>
//         <Dialog.Header>"驗證使用者"</Dialog.Header>
//         <input type="text" placeholder="請輸入您的驗證碼" />
//         <Dialog.Footer></Dialog.Footer>
//       </Dialog.Content>
//     </Dialog.Root>
//   );
// };
