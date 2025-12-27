import type { Metadata } from "next";
import "./globals.css";
import UTMInitializer from "@/components/UTMInitializer";
import { ToastProvider } from "@/components/Toast";
import { SessionProvider } from "@/components/auth";
import { MyResultsProvider } from "@/contexts/MyResultsContext";
import WebVitalsReporter from "@/components/WebVitalsReporter";
import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/gtag";

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
        url: `${siteUrl}/api/og`,
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
    images: [`${siteUrl}/api/og`],
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
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Google Analytics 4 */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className="antialiased bg-gray-50 min-h-screen" suppressHydrationWarning>
        <SessionProvider>
          <MyResultsProvider>
            <ToastProvider>
              <UTMInitializer />
              <WebVitalsReporter />
              {children}
            </ToastProvider>
          </MyResultsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
