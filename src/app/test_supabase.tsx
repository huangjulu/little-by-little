import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const TestSupabase: React.FC = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: orders, error } = await supabase.from("orders").select("*");
  const { data } = await supabase.from("orders").select("*").single();
  console.log("data", data);

  if (error) {
    return (
      <div className="rounded border border-red-200 bg-red-50 p-4 text-red-800">
        <p className="font-medium">Supabase 查詢錯誤</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-2 text-sm text-gray-600">
        以下資料由 Server 向 Supabase 取得（不會出現在瀏覽器 Network 的
        supabase.co）
      </p>
      <ul className="list-disc pl-5">
        {orders?.map((order: Record<string, unknown>) => (
          <li key={String(order.id)}>{JSON.stringify(order)}</li>
        ))}
      </ul>
      {(!orders || orders.length === 0) && (
        <p className="text-sm text-gray-500">目前沒有資料</p>
      )}
    </div>
  );
};

export default TestSupabase;
