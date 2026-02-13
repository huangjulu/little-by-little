"use client";

import { Dialog } from "@/ui/dialog";
import type { DialogProps } from "@radix-ui/react-dialog";

interface ViewCreateOrderProps extends DialogProps {
  className?: string;
}

export const ViewCreateOrder: React.FC<ViewCreateOrderProps> = (props) => {
  return (
    <Dialog.Root open={props.open} onOpenChange={props.onOpenChange}>
      <Dialog.Content className={props.className}>
        <Dialog.Header>
          <Dialog.Title>建立新訂單</Dialog.Title>
          <Dialog.Description>請填寫訂單資訊以建立新訂單。</Dialog.Description>
        </Dialog.Header>
        <div className="py-4">
          <p className="text-sm text-gray-500">訂單表單內容將在此處顯示。</p>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

ViewCreateOrder.displayName = "ViewCreateOrder";
