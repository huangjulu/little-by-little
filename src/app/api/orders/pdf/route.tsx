import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

import BillingNoticePDF from "@/features/order/billing/BillingNoticePDF";
import type { Order } from "@/features/order/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { orders: Order[] };

    if (!body.orders || body.orders.length === 0) {
      return NextResponse.json(
        { error: true, message: "orders 不可為空" },
        { status: 400 }
      );
    }

    const buffer = await renderToBuffer(
      <BillingNoticePDF orders={body.orders} />
    );

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="billing-notice.pdf"',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "PDF 產生失敗";
    return NextResponse.json({ error: true, message }, { status: 500 });
  }
}
