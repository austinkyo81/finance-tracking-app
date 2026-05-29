import type { Metadata } from "next";
import { Syne, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "FinTrack — Personal Finance & Portfolio",
  description: "Track your finances and investment portfolio in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${dmMono.variable} h-full`}
      style={{ backgroundColor: "#0b0f1a" }}
    >
      <body className="min-h-full flex flex-col relative" style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif" }}>
        <NavBar />
        <main className="flex-1 relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
