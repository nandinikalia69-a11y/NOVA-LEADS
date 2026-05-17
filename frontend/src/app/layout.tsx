import type { Metadata } from "next";
import { Space_Grotesk, Rajdhani } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ServiceHive Data Vault",
  description: "Next-Gen AI-powered Lead Intelligence & Sales Analytics Platform.",
};

import ReactQueryProvider from "@/lib/react-query";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { MobileDock } from "@/components/ui/MobileDock";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${rajdhani.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans scanlines">
        <ReactQueryProvider>
          {children}
          <CommandPalette />
          <MobileDock />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
