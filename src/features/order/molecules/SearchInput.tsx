import {
  AlertTriangle as IconAlertTriangle,
  CalendarClock as IconCalendarClock,
  Search as IconSearch,
} from "lucide-react";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";
import Badge from "@/ui/badge";
import Input from "@/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@/ui/popover";

type SearchFilterState = {
  active: Pick<SearchFilterOption, "key" | "label"> | null;
  onSelect: (option: SearchFilterOption) => void;
  onClear: () => void;
};

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  filter: SearchFilterState;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = (props) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange(e.target.value);
    },
    [props.onChange]
  );

  return (
    <PopoverSuggestion
      suppressed={!!props.value || !!props.filter.active}
      onSelect={props.filter.onSelect}
    >
      <div
        className={cn(
          "flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-xs",
          props.className
        )}
      >
        <IconSearch className="h-4 w-4 shrink-0 text-gray-400" />

        {props.filter.active && (
          <Badge
            variant={
              props.filter.active.key === "billing:overdue" ? "alert" : "info"
            }
            onClose={props.filter.onClear}
            icon={getFilterIcon(props.filter.active.key)}
          >
            {props.filter.active.label}
          </Badge>
        )}

        <Input
          value={props.value}
          onChange={handleChange}
          placeholder={props.placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400 border-0 shadow-none px-0 focus-visible:ring-0"
        />
      </div>
    </PopoverSuggestion>
  );
};

SearchInput.displayName = "SearchInput";

export default SearchInput;

type SearchFilterOption = {
  key: string;
  label: string;
  icon: React.FC<{ className?: string }>;
};

interface PopoverSuggestionProps {
  suppressed: boolean;
  onSelect: (option: SearchFilterOption) => void;
  children: React.ReactNode;
}

const PopoverSuggestion: React.FC<PopoverSuggestionProps> = (props) => {
  const [open, setOpen] = useState(false);

  const handleSuggestionClick = useCallback(
    (item: SearchFilterOption) => {
      setOpen(false);
      props.onSelect(item);
    },
    [props.onSelect]
  );

  return (
    <Popover open={open && !props.suppressed} onOpenChange={setOpen}>
      <PopoverAnchor
        asChild
        onFocus={(e: React.FocusEvent) => {
          if (e.target instanceof HTMLInputElement) setOpen(true);
        }}
      >
        {props.children}
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
        {SEARCH_FILTER_OPTIONS.map((item, index) => (
          <div key={item.key}>
            {index > 0 && <hr className="my-1 border-gray-100" />}
            <button
              type="button"
              onClick={() => handleSuggestionClick(item)}
              className="flex w-full items-center gap-2.5 rounded-md p-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
            >
              <item.icon className="h-4 w-4 text-blue-600" />
              {item.label}
            </button>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

PopoverSuggestion.displayName = "PopoverSuggestion";

// Helpers
function getFilterIcon(key: string): React.ReactNode {
  const option = SEARCH_FILTER_OPTIONS.find((o) => o.key === key);
  if (!option) return null;
  const Icon = option.icon;
  return <Icon />;
}

// Constants
const SEARCH_FILTER_OPTIONS: SearchFilterOption[] = [
  {
    key: "billing:next-month",
    label: "下個月繳費名單",
    icon: IconCalendarClock,
  },
  {
    key: "billing:overdue",
    label: "逾期客戶名單",
    icon: IconAlertTriangle,
  },
];
