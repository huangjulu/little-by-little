-- 將 payment_status 值從 invoiced 改為 waiting_for_payment

-- 1. 移除舊 constraint
ALTER TABLE customers
  DROP CONSTRAINT IF EXISTS customers_payment_status_check;

-- 2. 更新現有資料
UPDATE customers
  SET payment_status = 'waiting_for_payment'
  WHERE payment_status = 'invoiced';

-- 3. 重建 constraint（invoiced → waiting_for_payment）
ALTER TABLE customers
  ADD CONSTRAINT customers_payment_status_check
  CHECK (payment_status IN ('up_to_date', 'waiting_for_payment', 'overdue'));

-- 4. 重建 RPC 函式，同步驗證邏輯
CREATE OR REPLACE FUNCTION batch_update_payment_status(
  p_customer_ids BIGINT[],
  p_new_status TEXT,
  p_update_billing BOOLEAN DEFAULT FALSE
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_updated INTEGER;
BEGIN
  -- 驗證 payment_status 值
  IF p_new_status NOT IN ('up_to_date', 'waiting_for_payment', 'overdue') THEN
    RAISE EXCEPTION 'Invalid payment_status: %', p_new_status;
  END IF;

  -- 更新 payment_status
  UPDATE customers
  SET payment_status = p_new_status
  WHERE id = ANY(p_customer_ids);

  GET DIAGNOSTICS v_updated = ROW_COUNT;

  -- 若需要續期：next_billing_date = payment_deadline + 1 day
  IF p_update_billing THEN
    UPDATE orders
    SET next_billing_date = payment_deadline + INTERVAL '1 day'
    WHERE id IN (
      SELECT order_id FROM customers WHERE id = ANY(p_customer_ids)
    )
    AND payment_deadline IS NOT NULL;
  END IF;

  RETURN json_build_object(
    'updated', v_updated,
    'status', p_new_status
  );
END;
$$;
