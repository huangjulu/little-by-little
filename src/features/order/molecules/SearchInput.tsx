import { CalendarClock, Search } from "lucide-react";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";
import Input from "@/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@/ui/popover";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSuggestionSelect?: (key: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * SearchInput - 搜尋輸入框分子組件
 * 聚焦時顯示搜尋建議（如「下個月繳費名單」快捷篩選）
 */
const SearchInput: React.FC<SearchInputProps> = (props) => {
  const {
    value,
    onChange,
    onSuggestionSelect,
    placeholder = "搜尋...",
    className,
  } = props;
  const [open, setOpen] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleSuggestionClick = useCallback(
    (key: string) => {
      setOpen(false);
      onSuggestionSelect?.(key);
    },
    [onSuggestionSelect]
  );

  return (
    <Popover open={open && !value} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div
          className={cn(
            "flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-xs",
            className
          )}
        >
          <Search className="h-4 w-4 shrink-0 text-gray-400" />
          <Input
            value={value}
            onChange={handleChange}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400 border-0 shadow-none px-0 focus-visible:ring-0"
          />
        </div>
      </PopoverAnchor>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-72 p-2"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <p className="mb-1.5 px-2 text-[0.6875rem] font-medium text-gray-400">
          快速篩選
        </p>
        <button
          type="button"
          onClick={() => handleSuggestionClick("billing:next-month")}
          className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
        >
          <CalendarClock className="h-4 w-4 text-amber-500" />
          下個月繳費名單
        </button>
      </PopoverContent>
    </Popover>
  );
};

SearchInput.displayName = "SearchInput";

export default SearchInput;
