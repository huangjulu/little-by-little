"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Order } from "../types";

const useCheckedOrders = (orders: Order[]) => {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const autoSelectRef = useRef(false);

  useEffect(
    function autoSelectOnce() {
      if (autoSelectRef.current && orders.length > 0) {
        setCheckedIds(new Set(orders.map((o) => o.id)));
        autoSelectRef.current = false;
      }
    },
    [orders]
  );

  const toggle = useCallback((id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setCheckedIds(new Set(orders.map((o) => o.id)));
  }, [orders]);

  const deselectAll = useCallback(() => {
    setCheckedIds(new Set());
  }, []);

  const selectByIds = useCallback((ids: string[]) => {
    setCheckedIds(new Set(ids));
  }, []);

  const scheduleAutoSelect = useCallback(() => {
    autoSelectRef.current = true;
  }, []);

  return {
    checkedIds,
    toggle,
    selectAll,
    deselectAll,
    selectByIds,
    scheduleAutoSelect,
  };
};

export default useCheckedOrders;
