import { AuthProvider } from "@/providers/auth-provider";
import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "./globals.css";

const font = Comfortaa({
  subsets: ["cyrillic", "latin"],
});

export const metadata: Metadata = {
  title: "Pro Sebe Store",
  description: "Pro Sebe Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`light h-full w-full ${font.className}`}>
      <AuthProvider>
        <body>{children}</body>
      </AuthProvider>
    </html>
  );
}
