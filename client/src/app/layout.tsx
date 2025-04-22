import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner"

import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Sitewatch",
  description: "Monitor you web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning  >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster  richColors />
        {children}
      </body>
    </html>
  );
}
