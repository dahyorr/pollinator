import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import HeaderNavbar from "@/components/HeaderNavbar";
import Head from "next/head";
import Script from "next/script";
import dayjs from "dayjs";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pollinator",
  description: "Create and share polls instantly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <HeaderNavbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
