import type { Metadata } from "next";
import { IBM_Plex_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
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
      className={`${ibmPlexSans.variable} ${dmMono.variable} h-full`}
    >
      <body className="min-h-screen flex flex-col" style={{ fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif" }}>
        <main className="flex-1 pb-28">
          {children}
        </main>
        <NavBar />
      </body>
    </html>
  );
}
