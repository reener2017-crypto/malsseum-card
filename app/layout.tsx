import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "말씀카드 제작소 | 교회 말씀카드 무료 제작",
  description: "성경 말씀을 아름다운 카드로 만들어보세요. 교회 주보, SNS, 카카오톡 공유에 딱 맞는 말씀카드를 무료로 제작할 수 있습니다.",
  keywords: ["말씀카드", "성경카드", "교회", "성경구절", "카드제작", "무료"],
  openGraph: {
    title: "말씀카드 제작소 | 교회 말씀카드 무료 제작",
    description: "성경 말씀을 아름다운 카드로 만들어보세요. 무료로 제작하고 바로 다운로드!",
    url: "https://www.versecard.kr",
    siteName: "말씀카드 제작소",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "말씀카드 제작소",
    description: "성경 말씀을 아름다운 카드로 만들어보세요. 무료로 제작하고 바로 다운로드!",
  },
  metadataBase: new URL("https://www.versecard.kr"),
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
