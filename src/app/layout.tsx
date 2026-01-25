import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "sonner";
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
        <QueryProvider>{children}</QueryProvider>
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
