import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "케미 테스트",
  description: "재미로 보는 성격 테스트 - 나, 반려동물, 이상형 케미 분석",
  keywords: ["성격테스트", "케미테스트", "심리테스트", "반려동물", "이상형"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
