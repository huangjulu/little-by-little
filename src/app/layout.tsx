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
            <div className="flex h-screen md:flex-row flex-col">
              <nav className="fixed z-30 bg-white shadow-sm no-scrollbar overflow-x-hidden md:left-0 md:top-0 md:h-screen md:right-auto md:w-16 md:flex-col md:items-center md:justify-start md:gap-4 md:px-3 md:py-4 bottom-0 left-0 right-0 flex flex-row items-center justify-around px-2 py-2 border-t md:border-t-0 md:border-r border-gray-200">
                <div className="mb-4 text-xs font-semibold text-gray-500 hidden md:block">
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
              <main className="flex-1 md:pl-16 pb-16 md:pb-0 flex flex-col overflow-hidden">
                {children}
              </main>
            </div>
          </QueryProvider>
        </NuqsAdapter>
        <LazyToaster />
      </body>
    </html>
  );
}
