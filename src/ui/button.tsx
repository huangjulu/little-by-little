import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 as IconLoader } from "lucide-react";

import { cn } from "@/lib/utils";

// ─── Props ───────────────────────────────────────────────────────────────────

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** 按鈕文字。icon-only 模式下自動成為 aria-label */
  label: string | string[];
  /** 前置 icon */
  icon?: React.ComponentType<{ className?: string }>;
  /** 只顯示 icon，label 隱藏為 aria-label */
  iconOnly?: boolean;
  /** 填滿容器寬度 */
  fullWidth?: boolean;
  /** 顯示 loading spinner，停用互動 */
  loading?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

const Button: React.FC<ButtonProps> = (props) => {
  const {
    label,
    icon: Icon,
    iconOnly = false,
    fullWidth = false,
    loading = false,
    variant,
    size,
    disabled,
    className,
    ...rest
  } = props;

  const resolvedLabel = Array.isArray(label) ? label.join("") : label;
  const isIconOnly = iconOnly && !!Icon;
  const isDisabled = disabled || loading;

  return (
    <button
      type={props.type ?? "button"}
      disabled={isDisabled}
      aria-label={isIconOnly ? resolvedLabel : undefined}
      className={cn(
        buttonVariants({ variant, size }),
        isIconOnly && iconOnlySizes[size ?? "md"],
        !isIconOnly && Icon && "pl-[calc(theme(spacing.3)*0.5)]",
        !isIconOnly &&
          Icon &&
          size === "sm" &&
          "pl-[calc(theme(spacing.2)*0.75)]",
        !isIconOnly &&
          Icon &&
          size === "lg" &&
          "pl-[calc(theme(spacing.4)*0.5)]",
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {loading ? (
        <IconLoader className={cn("animate-spin", iconSizes[size ?? "md"])} />
      ) : (
        Icon && <Icon className={iconSizes[size ?? "md"]} />
      )}
      {!isIconOnly && <span>{resolvedLabel}</span>}
    </button>
  );
};

Button.displayName = "Button";
export default Button;

// ─── Variants ────────────────────────────────────────────────────────────────

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5",
    "rounded-md font-medium text-sm",
    "transition-colors cursor-pointer",
    "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500",
    "disabled:opacity-50 disabled:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        primary: "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700",
        secondary:
          "bg-gray-800 text-white hover:bg-gray-700 active:bg-gray-900",
        tertiary:
          "bg-transparent text-blue-500 hover:bg-blue-50 active:bg-blue-100",
        critical: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
      },
      size: {
        sm: "min-h-[32px] py-1.5 px-3",
        md: "min-h-[36px] py-2 px-4",
        lg: "min-h-[44px] py-2.5 px-5",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  }
);

// ─── Icon sizes ──────────────────────────────────────────────────────────────

const iconSizes: Record<string, string> = {
  sm: "size-4",
  md: "size-4",
  lg: "size-5",
};

const iconOnlySizes: Record<string, string> = {
  sm: "min-h-[32px] min-w-[32px] !p-1.5",
  md: "min-h-[36px] min-w-[36px] !p-2",
  lg: "min-h-[44px] min-w-[44px] !p-2.5",
};
