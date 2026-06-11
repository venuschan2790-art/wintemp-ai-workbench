import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WINTEMP AI Workbench",
  description:
    "WINTEMP 品牌运营部内部使用的 AI 工作台，用于生成结构化 Prompt。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
