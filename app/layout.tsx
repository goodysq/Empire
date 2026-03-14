import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = localFont({
  src: [
    { path: "../public/fonts/Cinzel-Regular.ttf", weight: "400" },
    { path: "../public/fonts/Cinzel-Bold.ttf", weight: "700" },
    { path: "../public/fonts/Cinzel-Black.ttf", weight: "900" },
  ],
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
  title: "帝国纪元 | Empire Chronicles",
  description: "纵横千古，逐鹿天下 - 史诗级移动端SLG策略游戏",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
