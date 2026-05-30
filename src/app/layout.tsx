import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "FinTrack — Personal Finance & Portfolio",
  description: "Track your finances and investment portfolio in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen antialiased">
        {/* Mobile-first centered viewport — max 390px matching spec */}
        <div className="relative mx-auto flex min-h-screen flex-col" style={{ maxWidth: "390px" }}>
          <main className="relative z-10 flex flex-1 flex-col pt-14">
            {children}
          </main>
          <NavBar />
        </div>
      </body>
    </html>
  );
}
