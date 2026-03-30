import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import MockDebugPanelLoader from "@/components/mocks/MockDebugPanelLoader"; // ← changed
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
  title: "HITL Remediation Console",
  description: "Human-in-the-loop review for AI remediation actions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <Providers>
          {children}
          {process.env.NODE_ENV === "development" ? <MockDebugPanelLoader /> : null}  {/* ← changed */}
        </Providers>
      </body>
    </html>
  );
}