import { AuthProvider } from "@/providers/auth-provider";
import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
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
        <body>
          <NextTopLoader
            showAtBottom={true}
            height={2}
            zIndex={2 ** 64}
            color={"#000"}
          />
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
