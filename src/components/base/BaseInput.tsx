import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface BaseInputProps extends React.ComponentProps<"input"> {
  className?: string;
}

/**
 * BaseInput - 統一的 Input wrapper
 * 確保所有 Input 組件都有一致的 className props 介面
 */
export const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  (props, ref) => {
    const { className, ...restProps } = props;

    return <Input ref={ref} className={cn(className)} {...restProps} />;
  }
);

BaseInput.displayName = "BaseInput";
