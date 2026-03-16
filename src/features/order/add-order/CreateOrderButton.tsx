import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

import ViewCreateOrder from "./view/ViewCreateOrder";

interface CreateOrderButtonProps {
  onClick: () => void;
  className?: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

/**
 * CreateOrderForm - 建立訂單按鈕分子組件
 */
const CreateOrderForm: React.FC<CreateOrderButtonProps> = (props) => {
  return (
    <>
      <button
        type="button"
        onClick={props.onClick}
        className={cn(
          "flex items-center justify-center rounded-md p-1.5 font-medium transition-colors cursor-pointer border border-gray-200 shadow-sm",
          "hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
          "disabled:pointer-events-none disabled:opacity-50",
          props.className
        )}
        aria-label="建立新訂單"
      >
        <Plus className="h-5 w-5" />
      </button>

      {props.open && (
        <ViewCreateOrder open={props.open} onOpenChange={props.setOpen} />
      )}
    </>
  );
};

CreateOrderForm.displayName = "CreateOrderForm";

export default CreateOrderForm;
