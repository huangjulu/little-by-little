"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import type { DialogProps } from "@radix-ui/react-dialog";

interface ViewCreateOrderProps extends DialogProps {
  className?: string;
}

export const ViewCreateOrder: React.FC<ViewCreateOrderProps> = (props) => {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className={props.className}>
        <DialogHeader>
          <DialogTitle>建立新訂單</DialogTitle>
          <DialogDescription>請填寫訂單資訊以建立新訂單。</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500">訂單表單內容將在此處顯示。</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

ViewCreateOrder.displayName = "ViewCreateOrder";
