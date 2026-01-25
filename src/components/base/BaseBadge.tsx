import * as React from "react";
import { Badge, badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface BaseBadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  className?: string;
}

/**
 * BaseBadge - 統一的 Badge wrapper
 * 確保所有 Badge 組件都有一致的 className props 介面
 */
export const BaseBadge = React.forwardRef<HTMLSpanElement, BaseBadgeProps>(
  (props, ref) => {
    const { className, variant, asChild, ...restProps } = props;

    return (
      <Badge
        ref={ref}
        variant={variant}
        asChild={asChild}
        className={cn(className)}
        {...restProps}
      />
    );
  }
);

BaseBadge.displayName = "BaseBadge";
