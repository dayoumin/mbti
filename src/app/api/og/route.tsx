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

    // VS 투표용 파라미터
    const question = searchParams.get('question') || '';
    const optionA = searchParams.get('optionA') || '';
    const optionB = searchParams.get('optionB') || '';
    const emojiA = searchParams.get('emojiA') || '';
    const emojiB = searchParams.get('emojiB') || '';
    const percentA = searchParams.get('percentA') || '';
    const percentB = searchParams.get('percentB') || '';

    // Choice Poll용 파라미터 (JSON 배열)
    const optionsJson = searchParams.get('options') || '';

    // 타입별 렌더링
    if (type === 'result') {
      return renderResultCard(size, theme, result, emoji, desc);
    }

    if (type === 'poll') {
      return renderPollCard(size, question, optionA, optionB, emojiA, emojiB, percentA, percentB);
    }

    if (type === 'choice-poll') {
      return renderChoicePollCard(size, question, optionsJson);
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

// VS 투표 카드 이미지
function renderPollCard(
  size: { width: number; height: number },
  question: string,
  optionA: string,
  optionB: string,
  emojiA: string,
  emojiB: string,
  percentA: string,
  percentB: string
) {
  const hasResults = percentA && percentB;
  const pA = parseInt(percentA) || 50;
  const pB = parseInt(percentB) || 50;

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
          background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
          fontFamily: 'sans-serif',
          padding: '40px',
        }}
      >
        {/* VS 배지 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
          }}
        >
          <span
            style={{
              background: '#EF4444',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '999px',
              fontSize: '20px',
              fontWeight: 'bold',
            }}
          >
            VS 투표
          </span>
        </div>

        {/* 질문 */}
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: '40px',
            textAlign: 'center',
          }}
        >
          {question || '당신의 선택은?'}
        </h1>

        {/* 선택지 */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            alignItems: 'center',
          }}
        >
          {/* Option A */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '24px 40px',
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              minWidth: '200px',
            }}
          >
            <span style={{ fontSize: '56px', marginBottom: '12px' }}>
              {emojiA || '🅰️'}
            </span>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F2937' }}>
              {optionA || 'A'}
            </span>
            {hasResults && (
              <span style={{ fontSize: '24px', color: '#3B82F6', marginTop: '8px', fontWeight: 'bold' }}>
                {pA}%
              </span>
            )}
          </div>

          {/* VS */}
          <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#EF4444' }}>
            VS
          </span>

          {/* Option B */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '24px 40px',
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              minWidth: '200px',
            }}
          >
            <span style={{ fontSize: '56px', marginBottom: '12px' }}>
              {emojiB || '🅱️'}
            </span>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F2937' }}>
              {optionB || 'B'}
            </span>
            {hasResults && (
              <span style={{ fontSize: '24px', color: '#EF4444', marginTop: '8px', fontWeight: 'bold' }}>
                {pB}%
              </span>
            )}
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: '40px',
            padding: '16px 40px',
            background: '#F59E0B',
            borderRadius: '999px',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
          }}
        >
          나도 투표하기
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

// Choice Poll 카드 이미지 (다중 선택)
function renderChoicePollCard(
  size: { width: number; height: number },
  question: string,
  optionsJson: string
) {
  // options: [{text, emoji, percent}]
  let options: { text: string; emoji: string; percent: number }[] = [];
  try {
    options = optionsJson ? JSON.parse(decodeURIComponent(optionsJson)) : [];
  } catch {
    options = [];
  }

  const hasResults = options.some(o => o.percent > 0);
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

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
          background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)',
          fontFamily: 'sans-serif',
          padding: '40px',
        }}
      >
        {/* 배지 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
          }}
        >
          <span
            style={{
              background: '#6366F1',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '999px',
              fontSize: '20px',
              fontWeight: 'bold',
            }}
          >
            선택 투표
          </span>
        </div>

        {/* 질문 */}
        <h1
          style={{
            fontSize: '42px',
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: '32px',
            textAlign: 'center',
            maxWidth: '90%',
          }}
        >
          {question || '당신의 선택은?'}
        </h1>

        {/* 선택지 목록 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '80%',
            maxWidth: '600px',
          }}
        >
          {options.slice(0, 5).map((opt, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 24px',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <span style={{ fontSize: '32px', marginRight: '16px' }}>
                {opt.emoji || '📌'}
              </span>
              <span style={{ fontSize: '22px', fontWeight: '600', color: '#1F2937', flex: 1 }}>
                {opt.text}
              </span>
              {hasResults && (
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: colors[idx % colors.length] }}>
                  {opt.percent}%
                </span>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: '32px',
            padding: '14px 36px',
            background: '#6366F1',
            borderRadius: '999px',
            color: 'white',
            fontSize: '22px',
            fontWeight: 'bold',
          }}
        >
          나도 투표하기
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
