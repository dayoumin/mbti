import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chemi.app';

export const metadata: Metadata = {
  title: {
    default: "케미 테스트",
    template: "%s | 케미 테스트",
  },
  description: "재미로 보는 성격 테스트 - 나, 반려동물, 이상형 케미 분석",
  keywords: ["성격테스트", "케미테스트", "심리테스트", "반려동물", "이상형", "MBTI", "성격유형"],

  // Open Graph (카카오톡, 페이스북 등)
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteUrl,
    siteName: '케미 테스트',
    title: '케미 테스트 - 나의 케미를 찾아보세요',
    description: '재미로 보는 성격 테스트! 나는 어떤 유형? 나와 맞는 반려동물은? 나의 이상형은?',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: '케미 테스트',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: '케미 테스트',
    description: '재미로 보는 성격 테스트 - 나, 반려동물, 이상형 케미 분석',
    images: [`${siteUrl}/og-image.png`],
  },

  // 기타 메타 정보
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
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
