import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// 이미지 비율 설정
const RATIOS = {
  default: { width: 1200, height: 630 },   // OG 기본 (1.91:1)
  square: { width: 1080, height: 1080 },   // 인스타 피드 (1:1)
  story: { width: 1080, height: 1920 },    // 인스타/틱톡 스토리 (9:16)
  kakao: { width: 800, height: 400 },      // 카카오톡 (2:1)
};

// 테스트별 테마 색상
const TEST_THEMES: Record<string, { bg: string; accent: string; emoji: string }> = {
  human: { bg: '#FFF7ED', accent: '#EA580C', emoji: '🧠' },
  cat: { bg: '#FDF4FF', accent: '#A855F7', emoji: '🐱' },
  dog: { bg: '#FEF9C3', accent: '#CA8A04', emoji: '🐕' },
  rabbit: { bg: '#ECFDF5', accent: '#059669', emoji: '🐰' },
  hamster: { bg: '#FFF1F2', accent: '#E11D48', emoji: '🐹' },
  idealType: { bg: '#FDF2F8', accent: '#DB2777', emoji: '💕' },
  plant: { bg: '#F0FDF4', accent: '#16A34A', emoji: '🌿' },
  petMatch: { bg: '#EFF6FF', accent: '#2563EB', emoji: '🐾' },
  coffee: { bg: '#FEF3C7', accent: '#92400E', emoji: '☕' },
  conflictStyle: { bg: '#F5F3FF', accent: '#7C3AED', emoji: '🤝' },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 파라미터 파싱
    const type = searchParams.get('type') || 'default';      // 이미지 타입
    const test = searchParams.get('test') || 'human';        // 테스트 종류
    const result = searchParams.get('result') || '';         // 결과 이름
    const emoji = searchParams.get('emoji') || '';           // 결과 이모지
    const ratio = (searchParams.get('ratio') || 'default') as keyof typeof RATIOS;
    const desc = searchParams.get('desc') || '';             // 설명

    // 크기 설정
    const size = RATIOS[ratio] || RATIOS.default;

    // 테마 색상
    const theme = TEST_THEMES[test] || TEST_THEMES.human;

    // 타입별 렌더링
    if (type === 'result') {
      return renderResultCard(size, theme, result, emoji, desc);
    }

    // 기본: 홈 OG 이미지
    return renderHomeCard(size);
  } catch (e) {
    console.error('OG Image Error:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}

// 홈 OG 이미지
function renderHomeCard(size: { width: number; height: number }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FFF7ED 0%, #FECACA 50%, #FDF4FF 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 로고 영역 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <span style={{ fontSize: '72px' }}>🐕</span>
          <span style={{ fontSize: '72px' }}>🐱</span>
          <span style={{ fontSize: '72px' }}>🧠</span>
        </div>

        {/* 타이틀 */}
        <h1
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          케미테스트
        </h1>

        {/* 서브타이틀 */}
        <p
          style={{
            fontSize: '32px',
            color: '#6B7280',
            textAlign: 'center',
          }}
        >
          나와 반려동물의 성격 궁합 테스트
        </p>

        {/* CTA */}
        <div
          style={{
            marginTop: '40px',
            padding: '16px 48px',
            background: '#EA580C',
            borderRadius: '999px',
            color: 'white',
            fontSize: '28px',
            fontWeight: 'bold',
          }}
        >
          테스트 시작하기
        </div>
      </div>
    ),
    { ...size }
  );
}

// 결과 카드 이미지
function renderResultCard(
  size: { width: number; height: number },
  theme: { bg: string; accent: string; emoji: string },
  result: string,
  emoji: string,
  desc: string
) {
  const isVertical = size.height > size.width;
  const displayEmoji = emoji || theme.emoji;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.bg,
          fontFamily: 'sans-serif',
          padding: isVertical ? '80px 40px' : '40px 60px',
        }}
      >
        {/* 상단: 이모지 */}
        <div
          style={{
            fontSize: isVertical ? '120px' : '96px',
            marginBottom: '24px',
          }}
        >
          {displayEmoji}
        </div>

        {/* 결과 이름 */}
        <h1
          style={{
            fontSize: isVertical ? '56px' : '48px',
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          {result || '나의 성격 유형'}
        </h1>

        {/* 설명 */}
        {desc && (
          <p
            style={{
              fontSize: isVertical ? '28px' : '24px',
              color: '#6B7280',
              textAlign: 'center',
              maxWidth: '80%',
              lineHeight: 1.4,
            }}
          >
            {desc}
          </p>
        )}

        {/* CTA */}
        <div
          style={{
            marginTop: isVertical ? '60px' : '40px',
            padding: '16px 40px',
            background: theme.accent,
            borderRadius: '999px',
            color: 'white',
            fontSize: isVertical ? '24px' : '20px',
            fontWeight: 'bold',
          }}
        >
          나도 테스트하기
        </div>

        {/* 브랜드 */}
        <p
          style={{
            position: 'absolute',
            bottom: '24px',
            fontSize: '18px',
            color: '#9CA3AF',
          }}
        >
          chemi-test.vercel.app
        </p>
      </div>
    ),
    { ...size }
  );
}
