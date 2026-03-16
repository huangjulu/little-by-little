import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Badge: React.FC<BadgeProps> = (props) => {
  const Comp = props.asChild ? Slot : "span";
  const size = props.size ?? "md";

  return (
    <Comp
      data-slot="badge"
      className={cn(
        badgeVariants({ variant: props.variant, size }),
        props.className
      )}
      {...restProps(props)}
    >
      {props.children}
      {props.onClose && (
        <button
          type="button"
          onClick={props.onClose}
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-full transition-colors hover:bg-black/10",
            CLOSE_BUTTON_SIZE[size]
          )}
          aria-label="移除"
        >
          <X className={CLOSE_ICON_SIZE[size]} />
        </button>
      )}
    </Comp>
  );
};

// Types
interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  onClose?: () => void;
}

Badge.displayName = "Badge";

export default Badge;

// Helpers
function restProps(props: BadgeProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { className, variant, size, asChild, onClose, ...rest } = props;
  return rest;
}

// Variants
const badgeVariants = cva(
  [
    "inline-flex items-center justify-center rounded-full border-transparent font-medium",
    "w-fit whitespace-nowrap shrink-0 overflow-hidden ring-1",
    "[&>svg]:pointer-events-none",
    "transition-[color,box-shadow]",
  ],
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-500 ring-gray-200",
        success: "bg-green-100 text-green-800 ring-green-200",
        info: "bg-blue-100 text-blue-800 ring-blue-200",
        warning: "bg-amber-100 text-amber-800 ring-amber-200",
        alert: "bg-red-100 text-red-800 ring-red-200",
      },
      size: {
        sm: "px-2 py-0.5 text-xs gap-1 [&>svg]:size-3",
        md: "px-3 py-1.5 text-sm gap-1.5 [&>svg]:size-3.5",
        lg: "px-4 py-2 text-base gap-2 [&>svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// Close button size mappings
const CLOSE_BUTTON_SIZE: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "ml-0.5 -mr-0.5 p-0.5",
  md: "ml-1 -mr-1 p-0.5",
  lg: "ml-1.5 -mr-1.5 p-1",
};

const CLOSE_ICON_SIZE: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "size-3",
  md: "size-3.5",
  lg: "size-4",
};
