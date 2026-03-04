-- Atomic function to create an order and its associated customer in a single transaction.
-- This replaces the two-step insert in POST /api/orders to prevent orphaned order records.
--
-- HOW TO APPLY:
--   Option A: pnpm supabase db push
--   Option B: Paste into Supabase Dashboard → SQL Editor

CREATE OR REPLACE FUNCTION create_order_with_customer(
  p_customer_name       TEXT,
  p_mobile_phone        TEXT,
  p_community_name      TEXT    DEFAULT '',
  p_house_unit          TEXT    DEFAULT '',
  p_base_price          NUMERIC DEFAULT 0,
  p_current_price       NUMERIC DEFAULT 0,
  p_contract_start_date DATE    DEFAULT NULL,
  p_contract_end_date   DATE    DEFAULT NULL,
  p_payment_deadline    DATE    DEFAULT NULL,
  p_next_billing_date   DATE    DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id    BIGINT;
  v_customer_id BIGINT;
  v_result      JSON;
BEGIN
  INSERT INTO orders (
    base_price,
    current_price,
    contract_start_date,
    contract_end_date,
    payment_deadline,
    next_billing_date
  ) VALUES (
    p_base_price,
    p_current_price,
    p_contract_start_date,
    p_contract_end_date,
    p_payment_deadline,
    p_next_billing_date
  )
  RETURNING id INTO v_order_id;

  INSERT INTO customers (
    customer_info,
    order_id,
    order_status
  ) VALUES (
    jsonb_build_object(
      'customer_name',  p_customer_name,
      'mobile_phone',   p_mobile_phone,
      'community_name', p_community_name,
      'house_unit',     p_house_unit
    ),
    v_order_id,
    'active'
  )
  RETURNING id INTO v_customer_id;

  SELECT row_to_json(t) INTO v_result
  FROM (
    SELECT c.*, row_to_json(o.*) AS orders
    FROM customers c
    JOIN orders o ON o.id = c.order_id
    WHERE c.id = v_customer_id
  ) t;

  RETURN v_result;
END;
$$;
