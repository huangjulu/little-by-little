"use client";

import { Upload as IconUpload } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import ViewUploadOrder from "./view/ViewUploadOrder";

interface UploadOrderButtonProps {
  className?: string;
}

const UploadOrderButton: React.FC<UploadOrderButtonProps> = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer border border-gray-200 shadow-sm",
          "hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
          "disabled:pointer-events-none disabled:opacity-50",
          props.className
        )}
        aria-label="匯入訂單"
      >
        <IconUpload className="h-4 w-4" />
        匯入
      </button>

      {open && <ViewUploadOrder open={open} onOpenChange={setOpen} />}
    </>
  );
};

UploadOrderButton.displayName = "UploadOrderButton";

export default UploadOrderButton;
