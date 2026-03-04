import * as z from "zod";

/**
 * 合約日期區間 schema
 */
const dateRangeSchema = z
  .object({
    from: z.date().optional(),
    to: z.date().optional(),
  })
  .optional();

/**
 * Create Order 表單 schema，對齊 Supabase orders + customers 結構
 * - orders: base_price, current_price, contract_start_date, contract_end_date, payment_deadline, next_billing_date
 * - customers.customer_info: customer_name, mobile_phone, community_name, house_unit
 */
export const createOrderSchema = z.object({
  // 必填：對應 customers.customer_info
  customerName: z.string().min(1, "客戶姓名為必填"),
  mobilePhone: z.string().min(1, "手機號碼為必填"),

  // 選填：對應 customers.customer_info
  communityName: z.string().optional(),
  houseUnit: z.string().optional(),

  // 選填：對應 orders（表單為 string，空字串表示未填）
  basePrice: z
    .string()
    .optional()
    .refine(
      (v) => !v || (!Number.isNaN(Number(v)) && Number(v) >= 0),
      "基礎價格不可為負"
    ),
  currentPrice: z
    .string()
    .optional()
    .refine(
      (v) => !v || (!Number.isNaN(Number(v)) && Number(v) >= 0),
      "目前價格不可為負"
    ),

  // 合約期間：使用日期區間選擇器
  contractDateRange: dateRangeSchema,

  // 單日選擇：使用 DatePicker
  paymentDeadline: z.date().optional(),
  nextBillingDate: z.date().optional(),
});

export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;

export type DateRangeValue = z.infer<typeof dateRangeSchema>;
