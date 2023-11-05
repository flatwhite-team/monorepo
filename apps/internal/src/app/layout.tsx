import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "~/styles/globals.css";

import type { ReactNode } from "react";

import { TRPCReactProvider } from "./_providers/TRPCReactProvider";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "플랫화이트 상점관리",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className={["font-sans", fontSans.variable].join(" ")}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
