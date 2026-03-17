import { CalendarClock, Search } from "lucide-react";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";
import Badge from "@/ui/badge";
import Input from "@/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@/ui/popover";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  filter: SearchFilterState;
  placeholder?: string;
  className?: string;
}

/**
 * SearchInput - 搜尋輸入框分子組件
 * 聚焦時顯示搜尋建議（如「下個月繳費名單」快捷篩選）
 */
const SearchInput: React.FC<SearchInputProps> = (props) => {
  const { value, onChange, filter, placeholder = "搜尋...", className } = props;
  const [open, setOpen] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleSuggestionClick = useCallback(
    (item: SearchFilterOption) => {
      setOpen(false);
      filter.onSelect(item);
    },
    [filter]
  );

  return (
    <Popover open={open && !value && !filter.active} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div
          className={cn(
            "flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-xs",
            className
          )}
        >
          <Search className="h-4 w-4 shrink-0 text-gray-400" />

          {filter.active && (
            <Badge variant="warning" onClose={filter.onClear}>
              {filter.active.label}
            </Badge>
          )}

          <Input
            value={value}
            onChange={handleChange}
            onFocus={() => setOpen(true)}
            placeholder={filter.active ? "" : placeholder}
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
        {SEARCH_FILTER_OPTIONS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => handleSuggestionClick(item)}
            className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
          >
            <item.icon className="h-4 w-4 text-amber-500" />
            {item.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

// Types
type SearchFilterOption = {
  key: string;
  label: string;
  icon: React.FC<{ className?: string }>;
};

type SearchFilterState = {
  active: { key: string; label: string } | null;
  onSelect: (option: SearchFilterOption) => void;
  onClear: () => void;
};

SearchInput.displayName = "SearchInput";

export default SearchInput;

// Constants
const SEARCH_FILTER_OPTIONS: SearchFilterOption[] = [
  {
    key: "billing:next-month",
    label: "下個月繳費名單",
    icon: CalendarClock,
  },
];
