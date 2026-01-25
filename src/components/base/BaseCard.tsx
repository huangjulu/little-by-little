import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BaseCardProps extends React.ComponentProps<"div"> {
  className?: string;
}

interface BaseCardHeaderProps extends React.ComponentProps<"div"> {
  className?: string;
}

interface BaseCardTitleProps extends React.ComponentProps<"div"> {
  className?: string;
}

interface BaseCardDescriptionProps extends React.ComponentProps<"div"> {
  className?: string;
}

interface BaseCardContentProps extends React.ComponentProps<"div"> {
  className?: string;
}

interface BaseCardFooterProps extends React.ComponentProps<"div"> {
  className?: string;
}

interface BaseCardActionProps extends React.ComponentProps<"div"> {
  className?: string;
}

/**
 * BaseCard - 統一的 Card wrapper 系列
 * 確保所有 Card 組件都有一致的 className props 介面
 */
export const BaseCard = React.forwardRef<HTMLDivElement, BaseCardProps>(
  (props, ref) => {
    const { className, ...restProps } = props;

    return <Card ref={ref} className={cn(className)} {...restProps} />;
  }
);

BaseCard.displayName = "BaseCard";

export const BaseCardHeader = React.forwardRef<
  HTMLDivElement,
  BaseCardHeaderProps
>((props, ref) => {
  const { className, ...restProps } = props;

  return <CardHeader ref={ref} className={cn(className)} {...restProps} />;
});

BaseCardHeader.displayName = "BaseCardHeader";

export const BaseCardTitle = React.forwardRef<
  HTMLDivElement,
  BaseCardTitleProps
>((props, ref) => {
  const { className, ...restProps } = props;

  return <CardTitle ref={ref} className={cn(className)} {...restProps} />;
});

BaseCardTitle.displayName = "BaseCardTitle";

export const BaseCardDescription = React.forwardRef<
  HTMLDivElement,
  BaseCardDescriptionProps
>((props, ref) => {
  const { className, ...restProps } = props;

  return <CardDescription ref={ref} className={cn(className)} {...restProps} />;
});

BaseCardDescription.displayName = "BaseCardDescription";

export const BaseCardContent = React.forwardRef<
  HTMLDivElement,
  BaseCardContentProps
>((props, ref) => {
  const { className, ...restProps } = props;

  return <CardContent ref={ref} className={cn(className)} {...restProps} />;
});

BaseCardContent.displayName = "BaseCardContent";

export const BaseCardFooter = React.forwardRef<
  HTMLDivElement,
  BaseCardFooterProps
>((props, ref) => {
  const { className, ...restProps } = props;

  return <CardFooter ref={ref} className={cn(className)} {...restProps} />;
});

BaseCardFooter.displayName = "BaseCardFooter";

export const BaseCardAction = React.forwardRef<
  HTMLDivElement,
  BaseCardActionProps
>((props, ref) => {
  const { className, ...restProps } = props;

  return <CardAction ref={ref} className={cn(className)} {...restProps} />;
});

BaseCardAction.displayName = "BaseCardAction";
