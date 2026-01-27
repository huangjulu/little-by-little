import * as React from "react";
import { useCallback } from "react";
import { BaseInput } from "@/components/base";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * SearchInput - 搜尋輸入框分子組件
 */
export const SearchInput: React.FC<SearchInputProps> = (props) => {
  const { value, onChange, placeholder = "搜尋...", className } = props;

  // 使用 useCallback 記憶化處理函數，確保 props 穩定引用
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div
      className={cn(
        "flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-xs",
        className
      )}
    >
      <span className="text-gray-400">🔍</span>
      <BaseInput
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400 border-0 shadow-none px-0 focus-visible:ring-0"
      />
    </div>
  );
};

SearchInput.displayName = "SearchInput";
