import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "말씀카드 제작소",
  description: "교회를 위한 말씀카드 제작 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&family=Noto+Serif+KR:wght@400;700&family=Gowun+Dodum&family=Gowun+Batang&family=Black+Han+Sans&family=Do+Hyeon&family=Jua&family=Gaegu&family=Nanum+Brush+Script&family=Nanum+Pen+Script&family=Single+Day&family=Poor+Story&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
