import { Raleway } from "next/font/google";

import "./globals.css";

import type { Metadata } from "next";

const font = Raleway({ subsets: ["latin"] });

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
    <html lang="en">
      <body
        className={`dark bg-zinc-900 text-white h-full w-full ${font.className}`}
      >
        {children}
      </body>
    </html>
  );
}
