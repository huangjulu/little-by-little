import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { IconFinance } from "@/icon/IconFinance";
import { IconLogo } from "@/icon/IconLogo";
import { IconOrder } from "@/icon/IconOrder";
import { QueryProvider } from "@/providers/QueryProvider";
import LazyToaster from "@/ui/LazyToaster";
import NaviItemWithPopover from "@/ui/NaviItemWithPopover";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased md:overflow-hidden`}
      >
        <NuqsAdapter>
          <QueryProvider>
            <div className="flex min-h-screen">
              <nav className="flex flex-col items-center gap-2 px-3 py-4 bg-white shadow-sm sticky z-30 h-full no-scrollbar overflow-x-hidden">
                <div className="mb-4 text-xs font-semibold text-gray-500">
                  <IconLogo />
                </div>
                <NaviItemWithPopover
                  href="/"
                  icon={<IconOrder />}
                  label="Orders"
                  className="w-full"
                />
                <NaviItemWithPopover
                  href="/finance"
                  icon={<IconFinance />}
                  label="Finance"
                  className="w-full"
                />
              </nav>
              <main className="flex-1">{children}</main>
            </div>
          </QueryProvider>
        </NuqsAdapter>
        <LazyToaster />
      </body>
    </html>
  );
}
