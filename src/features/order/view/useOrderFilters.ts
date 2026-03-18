"use client";

import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";
import { useCallback, useMemo } from "react";

import type { StatusFilterValue } from "../types";

const PAGE_SIZE = 20;
const STATUS_OPTIONS = ["all", "active", "inactive"] as const;

const useOrderFilters = () => {
  const [keyword, setKeyword] = useQueryState(
    "keyword",
    parseAsString.withDefault("")
  );
  const [status, setStatus] = useQueryState(
    "status",
    parseAsStringLiteral(STATUS_OPTIONS).withDefault("all")
  );
  const [selectedId, setSelectedId] = useQueryState("orderId", parseAsString);
  const [billing, setBilling] = useQueryState("billing", parseAsString);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const isBillingMode = billing === "next-month";
  const isOverdueMode = billing === "overdue";

  const handleFiltersChange = useCallback(
    (patch: Partial<{ keyword: string; status: StatusFilterValue }>) => {
      if (patch.keyword !== undefined) void setKeyword(patch.keyword);
      if (patch.status !== undefined) void setStatus(patch.status);
      void setPage(1);
    },
    [setKeyword, setStatus, setPage]
  );

  const searchFilter = useMemo(
    () => ({
      active: isBillingMode
        ? { key: "billing:next-month", label: "下個月繳費名單" }
        : isOverdueMode
        ? { key: "billing:overdue", label: "逾期客戶名單" }
        : null,
      onSelect: (option: { key: string }) => {
        if (
          option.key === "billing:next-month" ||
          option.key === "billing:overdue"
        ) {
          const value =
            option.key === "billing:next-month" ? "next-month" : "overdue";
          void setBilling(value);
          void setSelectedId(null);
          void setKeyword("");
          void setPage(1);
        }
      },
      onClear: () => {
        void setBilling(null);
        void setPage(1);
      },
    }),
    [
      isBillingMode,
      isOverdueMode,
      setBilling,
      setSelectedId,
      setKeyword,
      setPage,
    ]
  );

  return {
    keyword,
    status,
    selectedId,
    billing,
    page,
    isBillingMode,
    pageSize: PAGE_SIZE,
    searchFilter,
    handleFiltersChange,
    setPage,
  };
};

export default useOrderFilters;
