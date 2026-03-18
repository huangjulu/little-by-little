-- 新增「最近下載繳費通知時間」欄位
ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS last_notice_downloaded_at TIMESTAMPTZ DEFAULT NULL;

-- 更新 RPC：改狀態為 waiting_for_payment 時同步記錄下載時間
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

  -- 更新 payment_status（若改為 waiting_for_payment 則同步記錄下載時間）
  UPDATE customers
  SET
    payment_status = p_new_status,
    last_notice_downloaded_at = CASE
      WHEN p_new_status = 'waiting_for_payment' THEN NOW()
      ELSE last_notice_downloaded_at
    END
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
