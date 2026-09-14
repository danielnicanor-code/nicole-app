import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Chrome from "@/components/Chrome";
import AppSplash from "@/components/AppSplash";
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
  title: "Nicole App",
  description: "A simple personal finance tracker for Nicole.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nicole App",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#bf648f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <AppSplash />
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
