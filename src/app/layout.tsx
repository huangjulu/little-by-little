import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import { IconOrder } from "@/icon/IconOrder";
import { IconFinance } from "@/icon/IconFinance";
import "./globals.css";
import { cn } from "@/lib/utils";
import { IconLogo } from "@/icon/IconLogo";

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
                <IconLogo />
              </div>
              <NaviItem
                href="/"
                icon={<IconOrder />}
                label="Orders"
                className="w-full"
              />
              <NaviItem
                href="/finance"
                icon={<IconFinance />}
                label="Finance"
                className="w-full"
              />
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

interface NaviItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

const NaviItem: React.FC<NaviItemProps> = (props) => {
  return (
    <Link
      href={props.href}
      className={cn(
        "flex w-full items-center justify-center rounded-md hover:bg-green-100 transition-colors",
        props.className
      )}
    >
      {props.icon}
    </Link>
  );
};
