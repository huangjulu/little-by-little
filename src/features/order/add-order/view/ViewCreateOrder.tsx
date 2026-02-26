"use client";

import { useState } from "react";
import { Dialog } from "@/ui/dialog";
import type { DialogProps } from "@radix-ui/react-dialog";

interface ViewCreateOrderProps extends DialogProps {
  className?: string;
}

export const ViewCreateOrder: React.FC<ViewCreateOrderProps> = (props) => {
  const [formData, setFormData] = useState({
    customerName: "",
    mobilePhone: "",
    communityName: "",
    houseUnit: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order created:", formData);
    // TODO: Call API to create order
    if (props.onOpenChange) {
      props.onOpenChange(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog.Root open={props.open} onOpenChange={props.onOpenChange}>
      <Dialog.Content className={props.className} size="md">
        <Dialog.Header isClosable={true}>
          <Dialog.Title>建立新訂單</Dialog.Title>
          <Dialog.Description>請填寫訂單資訊以建立新訂單。</Dialog.Description>
        </Dialog.Header>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium mb-1">
              客戶名稱 *
            </label>
            <input
              id="customerName"
              type="text"
              required
              value={formData.customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="請輸入客戶名稱"
            />
          </div>
          <div>
            <label htmlFor="mobilePhone" className="block text-sm font-medium mb-1">
              電話 *
            </label>
            <input
              id="mobilePhone"
              type="tel"
              required
              value={formData.mobilePhone}
              onChange={(e) => handleChange("mobilePhone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="請輸入電話號碼"
            />
          </div>
          <div>
            <label htmlFor="communityName" className="block text-sm font-medium mb-1">
              社區名稱
            </label>
            <input
              id="communityName"
              type="text"
              value={formData.communityName}
              onChange={(e) => handleChange("communityName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="請輸入社區名稱"
            />
          </div>
          <div>
            <label htmlFor="houseUnit" className="block text-sm font-medium mb-1">
              戶/房號
            </label>
            <input
              id="houseUnit"
              type="text"
              value={formData.houseUnit}
              onChange={(e) => handleChange("houseUnit", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="請輸入戶/房號"
            />
          </div>
          <Dialog.Footer>
            <button
              type="button"
              onClick={() => props.onOpenChange?.(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
            >
              建立訂單
            </button>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

ViewCreateOrder.displayName = "ViewCreateOrder";
