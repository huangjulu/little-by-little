"use client";

import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { CalendarIcon as IconCalendar } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import Calendar from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

const DatePicker: React.FC<DatePickerProps> = (props) => {
  const { placeholder = "選擇日期" } = props;
  const [open, setOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    if (!date) {
      props.onChange?.(undefined);
      return;
    }
    props.onChange?.(date);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={props.id}
          type="button"
          disabled={props.disabled}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-left text-sm shadow-xs transition-[color,box-shadow] outline-none",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[0.1875rem]",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            !props.value && "text-muted-foreground",
            props.className
          )}
        >
          <span className="truncate">
            {props.value
              ? format(props.value, "yyyy/MM/dd", { locale: zhTW })
              : placeholder}
          </span>
          <IconCalendar className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={props.value}
          onSelect={handleSelect}
          defaultMonth={props.value}
        />
      </PopoverContent>
    </Popover>
  );
};

DatePicker.displayName = "DatePicker";

export default DatePicker;
