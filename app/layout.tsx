import { Rubik } from "next/font/google";

import "./globals.css";

import type { Metadata } from "next";
import { AuthProvider } from "@/providers/auth-provider";

const font = Rubik({ subsets: ["cyrillic", "latin"] });

export const metadata: Metadata = {
  title: "Pro Sebe Store",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark h-full w-full ${font.className}`}>
      <AuthProvider>
        <body>{children}</body>
      </AuthProvider>
    </html>
  );
}
