import * as React from "react";
import { IconPlus } from "@/icon/IconPlus";
import { cn } from "@/lib/utils";

interface CreateOrderButtonProps {
  onClick?: () => void;
  className?: string;
}

/**
 * CreateOrderButton - 建立訂單按鈕分子組件
 */
export const CreateOrderButton: React.FC<CreateOrderButtonProps> = (props) => {
  const { onClick, className } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors",
        "hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      aria-label="建立新訂單"
    >
      <IconPlus className="h-5 w-5" />
    </button>
  );
};

CreateOrderButton.displayName = "CreateOrderButton";
