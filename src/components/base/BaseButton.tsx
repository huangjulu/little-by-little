import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface BaseButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  className?: string;
}

/**
 * BaseButton - 統一的 Button wrapper
 * 確保所有 Button 組件都有一致的 className props 介面
 */
export const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => {
    const { className, variant, size, asChild, ...restProps } = props;

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        asChild={asChild}
        className={cn(className)}
        {...restProps}
      />
    );
  }
);

BaseButton.displayName = "BaseButton";
