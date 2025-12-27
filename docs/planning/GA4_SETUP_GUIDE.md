# GA4 설정 가이드

## 1. Google Analytics 4 계정 생성 (15분)

### 1.1 GA4 계정 만들기
1. [Google Analytics](https://analytics.google.com) 접속
2. **"측정 시작"** 클릭
3. 계정 이름 입력 (예: "케미 테스트")
4. **"다음"** 클릭

### 1.2 속성 만들기
1. 속성 이름 입력 (예: "케미 앱")
2. 시간대: **한국 (GMT+9)**
3. 통화: **대한민국 원 (KRW)**
4. **"다음"** 클릭

### 1.3 비즈니스 정보
1. 업종: **엔터테인먼트 및 미디어**
2. 비즈니스 규모: **소규모**
3. 사용 목적: **사용자 행동 측정**
4. **"만들기"** 클릭

### 1.4 데이터 스트림 설정
1. 플랫폼 선택: **웹**
2. 웹사이트 URL: `https://chemi.app` (또는 개발 시 `http://localhost:3000`)
3. 스트림 이름: **케미 테스트 웹**
4. **"스트림 만들기"** 클릭

### 1.5 측정 ID 복사
```
측정 ID 형식: G-XXXXXXXXXX
```
- 데이터 스트림 상세 페이지에서 **측정 ID**를 복사합니다.
- 이 ID를 `.env.local` 파일에 추가할 예정입니다.

---

## 2. 환경변수 설정 (5분)

### 2.1 `.env.local` 파일 생성/수정

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 내용을 추가합니다.

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # 위에서 복사한 측정 ID 붙여넣기
```

**중요:**
- `NEXT_PUBLIC_` 접두사는 필수입니다 (클라이언트 사이드에서 접근 가능).
- `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.

### 2.2 개발 서버 재시작

환경변수 변경 후 개발 서버를 재시작해야 합니다.

```bash
# Ctrl+C로 서버 종료 후
npm run dev
```

---

## 3. 동작 확인 (10분)

### 3.1 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 3.2 GA4 실시간 리포트 확인

1. [Google Analytics](https://analytics.google.com) 접속
2. 왼쪽 메뉴: **보고서 > 실시간**
3. 브라우저에서 앱 사용 (테스트 시작, 완료 등)
4. 1-2분 후 실시간 리포트에 사용자 활동이 표시됨

**확인할 항목:**
- 활성 사용자 수 (1명으로 표시)
- 페이지뷰
- 이벤트 (web_vitals 등)

### 3.3 Chrome DevTools 콘솔 확인

1. 브라우저에서 **F12** 또는 **우클릭 > 검사**
2. **Network** 탭 선택
3. 필터에 `collect` 입력
4. 페이지 새로고침
5. `collect?v=2&...` 요청이 보이면 GA4가 정상 작동 중

**확인 사항:**
- Status: `200 OK`
- Request URL: `https://www.google-analytics.com/g/collect?...`
- Payload에 `tid=G-XXXXXXXXXX` 포함

---

## 4. 추적 이벤트 목록

현재 구현된 GA4 이벤트:

### 4.1 비즈니스 이벤트 (8개)

| 이벤트 | 카테고리 | 설명 |
|--------|----------|------|
| `test_start` | engagement | 테스트 시작 |
| `test_complete` | engagement | 테스트 완료 (소요 시간 포함) |
| `share` | engagement | 공유 버튼 클릭 (플랫폼별) |
| `quiz_answer` | engagement | 퀴즈 응답 (정답 여부) |
| `poll_vote` | engagement | 투표 참여 |
| `situation_reaction` | engagement | 상황 반응 참여 |
| `ranking_vote` | engagement | 랭킹 투표 |
| `page_dwell` | engagement | 페이지 체류 시간 |

### 4.2 성능 메트릭 (5개)

| 메트릭 | 카테고리 | 목표 | 설명 |
|--------|----------|------|------|
| `LCP` | performance | < 2.5s | Largest Contentful Paint (가장 큰 콘텐츠 렌더링) |
| `INP` | performance | < 200ms | Interaction to Next Paint (상호작용 반응성) |
| `CLS` | performance | < 0.1 | Cumulative Layout Shift (레이아웃 이동) |
| `FCP` | performance | < 1.8s | First Contentful Paint (첫 콘텐츠 렌더링) |
| `TTFB` | performance | < 600ms | Time to First Byte (서버 응답 시간) |

---

## 5. 이벤트 추적 코드 사용 예시

### 5.1 테스트 시작 추적

```typescript
import { trackTestStart } from '@/lib/analytics';

function handleTestStart() {
  trackTestStart('dog'); // 'dog', 'cat', 'human' 등
}
```

### 5.2 테스트 완료 추적

```typescript
import { trackTestComplete } from '@/lib/analytics';

function handleTestComplete() {
  const duration = Date.now() - startTime; // 밀리초
  trackTestComplete('dog', duration);
}
```

### 5.3 공유 버튼 클릭 추적

```typescript
import { trackShare } from '@/lib/analytics';

function handleKakaoShare() {
  trackShare('kakao', 'dog');
}

function handleLinkCopy() {
  trackShare('link');
}
```

### 5.4 퀴즈 응답 추적

```typescript
import { trackQuizAnswer } from '@/lib/analytics';

function handleQuizSubmit(quizId: string, userAnswer: string, correctAnswer: string) {
  const isCorrect = userAnswer === correctAnswer;
  trackQuizAnswer(quizId, isCorrect);
}
```

### 5.5 투표 참여 추적

```typescript
import { trackPollVote } from '@/lib/analytics';

function handlePollVote(pollId: string, option: string) {
  trackPollVote(pollId, option);
}
```

---

## 6. GA4 대시보드 활용

### 6.1 맞춤 보고서 만들기

1. GA4 > **탐색** 메뉴 클릭
2. **빈 보고서** 선택
3. 측정기준 추가:
   - 이벤트 이름
   - 이벤트 카테고리
   - 이벤트 라벨
4. 측정항목 추가:
   - 이벤트 수
   - 이벤트 값
5. 저장: **"테스트 참여 분석"**

### 6.2 주요 지표 모니터링

**사용자 행동:**
- 일별 활성 사용자 (DAU)
- 테스트 완료율 = `test_complete` / `test_start`
- 공유율 = `share` / `test_complete`
- 퀴즈 정답률 = `quiz_answer(value=1)` / `quiz_answer`

**성능:**
- LCP 평균값 (목표: < 2.5초)
- INP 평균값 (목표: < 200ms)
- CLS 평균값 (목표: < 0.1)

---

## 7. 프로덕션 배포 시 주의사항

### 7.1 Vercel 환경변수 설정

1. Vercel 대시보드 접속
2. 프로젝트 선택 > **Settings** > **Environment Variables**
3. 추가:
   - Key: `NEXT_PUBLIC_GA_ID`
   - Value: `G-XXXXXXXXXX`
   - Environments: **Production**, **Preview**, **Development** 모두 체크
4. **Save**

### 7.2 배포 후 확인

1. 배포 완료 후 실제 URL 접속 (예: `https://chemi.app`)
2. GA4 실시간 리포트에서 활동 확인
3. Chrome DevTools에서 `collect` 요청 확인

---

## 8. 비용

- **GA4 표준**: **완전 무료**
  - 이벤트 수: 무제한
  - 사용자 수: 무제한
  - 데이터 보관: 14개월 (최대 50개월까지 연장 가능)
- **GA4 360** (엔터프라이즈): $50,000/년
  - 월 10억 이벤트 이상 수집 필요 시

**현재 프로젝트는 GA4 표준으로 충분합니다.**

---

## 9. 문제 해결

### 9.1 실시간 리포트에 데이터가 안 보여요

**체크리스트:**
1. `.env.local`에 `NEXT_PUBLIC_GA_ID` 설정했나?
2. 개발 서버 재시작했나?
3. 브라우저에서 `http://localhost:3000` 접속했나?
4. Chrome DevTools > Network에서 `collect` 요청 보이나?
5. GA4 측정 ID가 정확한가? (G-XXXXXXXXXX 형식)

### 9.2 "GA_MEASUREMENT_ID is undefined" 에러

```bash
# .env.local 파일 확인
cat .env.local

# 파일이 없으면 생성
echo "NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX" > .env.local

# 개발 서버 재시작
npm run dev
```

### 9.3 Web Vitals 데이터가 안 보여요

Web Vitals는 실제 사용자 경험 후 수집됩니다.
- **LCP**: 페이지 로드 후 측정
- **INP**: 사용자가 버튼 클릭 등 상호작용 후 측정
- **CLS**: 페이지 이탈 시 측정

**최소 5-10회 페이지 뷰 후** GA4 탐색 보고서에서 확인 가능합니다.

---

## 10. 다음 단계

### Phase 1: 1개월 후 (사용자 1,000명 이상 시)

1. **전환 이벤트 설정**
   - `test_complete`를 전환 이벤트로 지정
   - 테스트별 완료율 분석

2. **맞춤 측정기준 추가**
   - 사용자 연령대
   - 테스트 유형별 선호도

3. **리마케팅 타겟 생성**
   - 테스트 완료했지만 공유 안 한 사용자
   - 퀴즈 참여율 높은 사용자

### Phase 2: 3개월 후 (사용자 5,000명 이상 시)

1. **GA4 + BigQuery 연동**
   - 무료 (월 10GB까지)
   - SQL로 복잡한 쿼리 가능
   - 머신러닝 분석 (예: 이탈 예측)

2. **A/B 테스트**
   - 결과 페이지 레이아웃 테스트
   - CTA 버튼 문구 테스트

---

## 참고 자료

- [GA4 공식 문서](https://support.google.com/analytics/answer/9304153)
- [Web Vitals 가이드](https://web.dev/vitals/)
- [Next.js Analytics 가이드](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [web-vitals NPM 패키지](https://github.com/GoogleChrome/web-vitals)
