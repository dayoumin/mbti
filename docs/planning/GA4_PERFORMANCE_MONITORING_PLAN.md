# GA4 & 성능 모니터링 구현 계획

**작성일**: 2025-12-27
**목표**: 데이터 기반 의사결정을 위한 분석 인프라 구축
**시기**: 배포 후 즉시 (Phase 0) + 1개월 후 고도화 (Phase 1)

---

## 🎯 전체 목표

### 핵심 질문에 답하기
1. **어떤 테스트가 인기있나?** → GA4 이벤트
2. **사용자는 얼마나 오래 머무나?** → GA4 세션
3. **앱이 얼마나 빠른가?** → Web Vitals
4. **어디서 이탈하나?** → GA4 퍼널
5. **공유가 얼마나 되나?** → GA4 전환

---

## 📅 Phase 0: 배포 즉시 (필수)

**목표**: 기본 데이터 수집 시작
**소요 시간**: 2-3시간
**우선순위**: 🔴 높음

### 1️⃣ GA4 설치 (1시간)

#### Step 1: GA4 계정 생성
```
1. https://analytics.google.com 접속
2. "측정 시작" 클릭
3. 계정 이름: "MBTI 테스트 앱"
4. 속성 이름: "MBTI Production"
5. 보고 시간대: "대한민국"
6. 통화: "KRW"
7. 산업 카테고리: "엔터테인먼트"
```

#### Step 2: 데이터 스트림 생성
```
1. 플랫폼: "웹"
2. 웹사이트 URL: https://yourdomain.com
3. 스트림 이름: "MBTI Web"
4. 측정 ID 복사: G-XXXXXXXXXX
```

#### Step 3: Next.js 설치

**파일 생성**: `src/lib/gtag.ts`
```typescript
// Google Analytics 4 설정
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// 페이지뷰 추적
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// 이벤트 추적
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// TypeScript 타입 정의
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: any
    ) => void;
  }
}
```

**파일 수정**: `src/app/layout.tsx`
```typescript
import Script from 'next/script';
import { GA_MEASUREMENT_ID } from '@/lib/gtag';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Google Analytics 4 */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
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
      <body>{children}</body>
    </html>
  );
}
```

**환경변수 추가**: `.env.local`
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Vercel 환경변수 등록**:
```
1. Vercel Dashboard → Settings → Environment Variables
2. Key: NEXT_PUBLIC_GA_ID
3. Value: G-XXXXXXXXXX
4. Environments: Production, Preview, Development
```

#### Step 4: 핵심 이벤트 추가 (30분)

**파일 생성**: `src/lib/analytics.ts`
```typescript
import * as gtag from './gtag';

// 테스트 시작
export const trackTestStart = (testType: string) => {
  gtag.event({
    action: 'test_start',
    category: 'engagement',
    label: testType,
  });
};

// 테스트 완료
export const trackTestComplete = (testType: string, duration: number) => {
  gtag.event({
    action: 'test_complete',
    category: 'engagement',
    label: testType,
    value: Math.round(duration / 1000), // 초 단위
  });
};

// 결과 공유
export const trackShare = (testType: string, platform: string) => {
  gtag.event({
    action: 'share',
    category: 'conversion',
    label: `${testType}_${platform}`,
  });
};

// 퀴즈 참여
export const trackQuizAnswer = (quizId: string, isCorrect: boolean) => {
  gtag.event({
    action: 'quiz_answer',
    category: 'engagement',
    label: quizId,
    value: isCorrect ? 1 : 0,
  });
};

// 투표 참여
export const trackPollVote = (pollId: string, option: string) => {
  gtag.event({
    action: 'poll_vote',
    category: 'engagement',
    label: `${pollId}_${option}`,
  });
};
```

**사용 예시**: `src/app/page.js`
```typescript
import { trackTestStart, trackTestComplete } from '@/lib/analytics';

// 테스트 시작 시
const handleStart = () => {
  trackTestStart(subject);
  setScreen('test');
};

// 테스트 완료 시
const handleComplete = () => {
  const duration = Date.now() - startTime;
  trackTestComplete(subject, duration);
  // ...
};
```

---

### 2️⃣ Vercel Analytics 설치 (30분)

**Step 1: Vercel Analytics 활성화**
```
1. Vercel Dashboard → Analytics
2. "Enable Analytics" 클릭
3. 자동으로 Web Vitals 수집 시작
```

**Step 2: Next.js 통합**
```bash
npm install @vercel/analytics
```

**파일 수정**: `src/app/layout.tsx`
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Step 3: 커스텀 메트릭 추가 (선택)**
```typescript
import { track } from '@vercel/analytics';

// API 응답 시간 추적
const trackApiTime = (endpoint: string, duration: number) => {
  track('api_response_time', {
    endpoint,
    duration,
  });
};

// 예시: AI 리포트 생성 시간
const startTime = Date.now();
const report = await generateAIReport(data);
trackApiTime('ai_report', Date.now() - startTime);
```

---

### 3️⃣ 테스트 및 검증 (30분)

#### GA4 실시간 보고서 확인
```
1. GA4 → 보고서 → 실시간
2. 테스트 앱에서 몇 가지 작업 수행
3. 30초 이내 데이터 표시 확인
```

#### 체크리스트
- [ ] 페이지뷰 수집 확인
- [ ] test_start 이벤트 확인
- [ ] test_complete 이벤트 확인
- [ ] share 이벤트 확인
- [ ] Vercel Analytics 대시보드 확인
- [ ] Web Vitals 데이터 수집 확인

---

## 📅 Phase 1: 1개월 후 고도화 (1000명 달성 시)

**목표**: 심화 분석 및 자동화
**소요 시간**: 1-2일
**우선순위**: 🟡 중간

### 1️⃣ GA4 고급 이벤트 (3시간)

#### 퍼널 분석
```typescript
// 테스트 플로우 퍼널
export const trackFunnel = (step: string, testType: string) => {
  gtag.event({
    action: 'funnel_step',
    category: 'funnel',
    label: `${step}_${testType}`,
  });
};

// 사용 예시
trackFunnel('home', 'dog');           // 1단계: 홈
trackFunnel('test_start', 'dog');     // 2단계: 시작
trackFunnel('question_5', 'dog');     // 3단계: 5번 질문
trackFunnel('test_complete', 'dog');  // 4단계: 완료
trackFunnel('result_view', 'dog');    // 5단계: 결과 보기
trackFunnel('share', 'dog');          // 6단계: 공유
```

#### 사용자 속성
```typescript
// 사용자 세그먼트
export const setUserProperties = (properties: {
  completed_tests?: number;
  favorite_test?: string;
  total_quizzes?: number;
  streak_days?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', properties);
  }
};

// 사용 예시
setUserProperties({
  completed_tests: 5,
  favorite_test: 'dog',
  total_quizzes: 20,
  streak_days: 7,
});
```

#### 맞춤 측정기준
```typescript
// 결과 타입별 분석
export const trackResultType = (testType: string, resultKey: string) => {
  gtag.event({
    action: 'result_distribution',
    category: 'analytics',
    label: `${testType}_${resultKey}`,
  });
};

// 사용 예시
trackResultType('dog', 'golden_retriever'); // 결과 분포 추적
```

---

### 2️⃣ Web Vitals 심화 (2시간)

#### 커스텀 Web Vitals 수집
```typescript
// src/lib/web-vitals.ts
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';
import * as gtag from './gtag';

export function reportWebVitals() {
  onCLS((metric) => {
    gtag.event({
      action: 'web_vitals',
      category: 'performance',
      label: 'CLS',
      value: Math.round(metric.value * 1000),
    });
  });

  onFID((metric) => {
    gtag.event({
      action: 'web_vitals',
      category: 'performance',
      label: 'FID',
      value: Math.round(metric.value),
    });
  });

  onFCP((metric) => {
    gtag.event({
      action: 'web_vitals',
      category: 'performance',
      label: 'FCP',
      value: Math.round(metric.value),
    });
  });

  onLCP((metric) => {
    gtag.event({
      action: 'web_vitals',
      category: 'performance',
      label: 'LCP',
      value: Math.round(metric.value),
    });
  });

  onTTFB((metric) => {
    gtag.event({
      action: 'web_vitals',
      category: 'performance',
      label: 'TTFB',
      value: Math.round(metric.value),
    });
  });
}
```

#### 사용
```typescript
// src/app/layout.tsx
import { reportWebVitals } from '@/lib/web-vitals';

export default function RootLayout({ children }) {
  useEffect(() => {
    reportWebVitals();
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

---

### 3️⃣ 대시보드 통합 (3시간)

#### 내부 대시보드에 GA4 데이터 표시

**Google Analytics Data API 사용**
```bash
npm install @google-analytics/data
```

**파일 생성**: `src/app/api/analytics/route.ts`
```typescript
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY,
  },
});

export async function GET() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${process.env.GA_PROPERTY_ID}`,
    dateRanges: [
      {
        startDate: '7daysAgo',
        endDate: 'today',
      },
    ],
    dimensions: [
      {
        name: 'eventName',
      },
    ],
    metrics: [
      {
        name: 'eventCount',
      },
    ],
  });

  return Response.json(response);
}
```

---

## 📊 수집할 데이터 목록

### GA4 이벤트 (우선순위별)

#### 🔴 필수 (Phase 0)
| 이벤트 | 설명 | 파라미터 |
|--------|------|----------|
| `test_start` | 테스트 시작 | testType |
| `test_complete` | 테스트 완료 | testType, duration |
| `share` | 공유 클릭 | testType, platform |
| `quiz_answer` | 퀴즈 답변 | quizId, isCorrect |
| `poll_vote` | 투표 참여 | pollId, option |

#### 🟡 중요 (Phase 1)
| 이벤트 | 설명 | 파라미터 |
|--------|------|----------|
| `test_abandon` | 테스트 이탈 | testType, questionNumber |
| `result_view` | 결과 보기 | testType, resultKey |
| `insight_unlock` | 인사이트 해금 | stage |
| `ai_report_view` | AI 리포트 보기 | testType |
| `community_post_view` | 커뮤니티 글 보기 | postId |

#### 🟢 선택 (Phase 2)
| 이벤트 | 설명 | 파라미터 |
|--------|------|----------|
| `search` | 검색 | query |
| `filter` | 필터 사용 | category, value |
| `login` | 로그인 | method |
| `profile_view` | 프로필 보기 | userId |

---

### Web Vitals 메트릭

| 메트릭 | 목표 | 설명 |
|--------|------|------|
| **LCP** | < 2.5초 | 최대 콘텐츠풀 페인트 (로딩 성능) |
| **FID** | < 100ms | 최초 입력 지연 (반응성) |
| **CLS** | < 0.1 | 누적 레이아웃 이동 (시각적 안정성) |
| **FCP** | < 1.8초 | 최초 콘텐츠풀 페인트 |
| **TTFB** | < 0.8초 | 첫 바이트까지의 시간 (서버 응답) |

---

## 🎯 KPI 설정

### 사용자 행동 KPI
- **테스트 완료율**: > 70% (BuzzFeed 벤치마크)
- **공유율**: > 30% (완료자 중)
- **재방문율**: > 40% (7일 이내)
- **평균 세션 시간**: > 5분

### 성능 KPI
- **LCP**: < 2.5초 (Good)
- **FID**: < 100ms (Good)
- **CLS**: < 0.1 (Good)
- **페이지 로드 시간**: < 3초

### 콘텐츠 KPI
- **퀴즈 참여율**: > 50% (방문자 중)
- **투표 참여율**: > 40% (방문자 중)
- **AI 리포트 생성**: > 20% (테스트 완료자 중)

---

## 📋 구현 체크리스트

### Phase 0: 배포 즉시 (필수)
- [ ] GA4 계정 생성
- [ ] 측정 ID 발급 (G-XXXXXXXXXX)
- [ ] `src/lib/gtag.ts` 생성
- [ ] `src/lib/analytics.ts` 생성
- [ ] `layout.tsx`에 GA4 스크립트 추가
- [ ] 환경변수 설정 (`.env.local`, Vercel)
- [ ] 5개 핵심 이벤트 추가
- [ ] Vercel Analytics 설치
- [ ] `@vercel/analytics` 패키지 설치
- [ ] Web Vitals 자동 수집 확인
- [ ] 실시간 보고서 테스트
- [ ] 프로덕션 배포

### Phase 1: 1개월 후 (선택)
- [ ] 퍼널 분석 구현
- [ ] 사용자 속성 추가
- [ ] 맞춤 측정기준 설정
- [ ] Web Vitals 커스텀 수집
- [ ] GA4 Data API 연동
- [ ] 대시보드 통합
- [ ] 알림 설정 (성능 저하 시)
- [ ] 주간 리포트 자동화

---

## 📚 참고 자료

### GA4
- [GA4 공식 문서](https://developers.google.com/analytics/devguides/collection/ga4)
- [Next.js GA4 예제](https://github.com/vercel/next.js/tree/canary/examples/with-google-analytics)
- [GA4 이벤트 권장사항](https://support.google.com/analytics/answer/9267735)

### Vercel Analytics
- [Vercel Analytics 문서](https://vercel.com/docs/analytics)
- [Web Vitals 이해하기](https://web.dev/vitals/)
- [Core Web Vitals 최적화](https://nextjs.org/docs/advanced-features/measuring-performance)

---

## 🚀 다음 단계

1. **즉시**: Phase 0 구현 (2-3시간)
2. **배포 후 1주일**: 데이터 확인 및 조정
3. **1개월 후**: Phase 1 고도화 (1-2일)
4. **3개월 후**: 데이터 기반 의사결정 시작

---

**작성자**: Claude Sonnet 4.5
**최종 업데이트**: 2025-12-27
**상태**: 배포 대기 중
