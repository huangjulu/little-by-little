"use client";

import dynamic from "next/dynamic";

const Toaster = dynamic(() => import("sonner").then((m) => m.Toaster), {
  ssr: false,
});

const LazyToaster: React.FC = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      classNames: {
        toast: "rounded-xl border text-xs font-medium shadow-sm",
        info: "bg-blue-100/80 border-blue-200 text-blue-800",
        success: "bg-green-100/80 border-green-200 text-green-800",
        error: "bg-red-100/80 border-red-200 text-red-800",
        warning: "bg-yellow-100/80 border-yellow-200 text-yellow-800",
        loading: "bg-gray-100/80 border-gray-200 text-gray-600",
      },
    }}
  />
);

LazyToaster.displayName = "LazyToaster";

export default LazyToaster;
