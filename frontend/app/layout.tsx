import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/providers/ThemeProvider";
import AriaLiveRegion from "@/components/layout/AriaLiveRegion";
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
  title: "Tracker Kasy - Zarządzaj swoimi finansami",
  description: "Aplikacja do śledzenia finansów osobistych",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AriaLiveRegion />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
