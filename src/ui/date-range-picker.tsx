"use client";

import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";

import Calendar from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const DateRangePicker: React.FC<DateRangePickerProps> = (props) => {
  const {
    value,
    onChange,
    placeholder = "選擇日期區間",
    className,
    disabled = false,
    id,
  } = props;
  const [open, setOpen] = useState(false);

  const handleSelect = (range: DateRange | undefined) => {
    if (!range) {
      onChange?.(undefined);
      return;
    }
    onChange?.({ from: range.from, to: range.to });
    // 僅在選完起始日與結束日後才關閉，讓使用者可完整操作兩次點選
    if (range.from != null && range.to != null) {
      setOpen(false);
    }
  };

  const calendarSelected: DateRange | undefined = value?.from
    ? { from: value.from, to: value.to }
    : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-left text-sm shadow-xs transition-[color,box-shadow] outline-none",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[0.1875rem]",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            !value?.from && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">
            {formatDateRange(value, placeholder)}
          </span>
          <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={value?.from}
          selected={calendarSelected}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

DateRangePicker.displayName = "DateRangePicker";

export default DateRangePicker;

// Types

/**
 * 寬鬆的日期區間型別，允許 from/to 皆為選填
 * 用於與 react-hook-form + zod schema 整合
 */
interface DateRangeValue {
  from?: Date;
  to?: Date;
}

interface DateRangePickerProps {
  value?: DateRangeValue;
  onChange?: (range: DateRangeValue | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

// Helpers

function formatDateRange(
  range: DateRangeValue | undefined,
  placeholder: string
): string {
  if (!range?.from) return placeholder;
  const { from, to } = range;
  const fromStr = format(from, "yyyy/MM/dd", { locale: zhTW });
  if (!to) return `${fromStr} ~ 選擇結束日`;
  return `${fromStr} ~ ${format(to, "yyyy/MM/dd", { locale: zhTW })}`;
}
