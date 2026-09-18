import type { Metadata } from "next";
import "./globals.css";
import { WebMcpTools } from "@/components/webmcp-tools";

export const metadata: Metadata = {
  title: "米兰博林外卖打包点心店｜Milano",
  description: "米兰博林外卖打包点心店，提供中式点心与外卖打包服务。浏览菜品菜单与门店信息。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased"><WebMcpTools />{children}</body>
    </html>
  );
}
