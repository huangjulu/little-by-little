import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import { IconOrder } from "@/icon/IconOrder";
import { IconFinance } from "@/icon/IconFinance";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "訂單管理系統",
  description: "訂單管理系統 - Order Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <div className="flex min-h-screen">
            <nav className="flex w-24 flex-col items-center gap-4 border-r bg-white py-6">
              <div className="mb-4 text-xs font-semibold text-gray-500">
                NAV
              </div>
              <Link
                href="/"
                className="group flex h-12 w-24 flex-col items-center justify-center rounded-md text-xs text-black hover:bg-green-100 hover:text-primary transition-colors"
              >
                <IconOrder className="h-6 w-6 text-black group-hover:text-primary" />
                <span className="mt-1">Orders</span>
              </Link>
              <Link
                href="/finance"
                className="group flex h-12 w-24 flex-col items-center justify-center rounded-md text-xs text-black hover:bg-green-100 hover:text-primary transition-colors"
              >
                <IconFinance className="h-6 w-6 text-black group-hover:text-primary" />
                <span className="mt-1">Finance</span>
              </Link>
            </nav>
            <main className="flex-1">{children}</main>
          </div>
        </QueryProvider>
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
      </body>
    </html>
  );
}
