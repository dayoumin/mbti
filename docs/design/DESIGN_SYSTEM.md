# 디자인 시스템

> 케미 테스트 앱의 UI 컴포넌트, 스타일 가이드, 로직 규칙을 정의합니다.
> 업데이트: 2025-12-26 (대시보드 실제 사용 패턴 반영)

---

## 1. 컬러 시스템 (다크/라이트 모드 지원)

### 1.0 CSS 변수 기반 디자인 토큰

다크/라이트 모드를 지원하기 위해 CSS 변수 기반의 디자인 토큰 시스템을 구축했습니다. `src/app/globals.css`에 정의된 CSS 변수를 사용하면 테마 변경 시 모든 컴포넌트가 자동으로 업데이트됩니다.

#### 라이트 모드 (기본)
```css
:root {
    /* Backgrounds */
    --bg-primary: #f8fafc;
    --bg-secondary: #ffffff;
    --bg-card: #f8fafc;
    --bg-glass: rgba(255, 255, 255, 0.85);
    
    /* Text */
    --text-primary: #0f172a;
    --text-secondary: #334155;
    --text-muted: #64748b;
    
    /* Brand Colors */
    --brand-primary: #6366f1;
    --brand-secondary: #a855f7;
    --brand-accent: #ec4899;
    
    /* Borders */
    --border-subtle: #e2e8f0;
    --border-default: #cbd5e1;
    --border-glass: rgba(255, 255, 255, 0.6);
    
    /* Semantic Colors */
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
}
```

#### 다크 모드
```css
.dark {
    /* Backgrounds */
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --bg-card: #1e293b;
    --bg-glass: rgba(30, 41, 59, 0.85);
    
    /* Text */
    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
    --text-muted: #94a3b8;
    
    /* Brand Colors */
    --brand-primary: #818cf8;
    --brand-secondary: #c084fc;
    --brand-accent: #f472b6;
    
    /* Borders */
    --border-subtle: #334155;
    --border-default: #475569;
    --border-glass: rgba(255, 255, 255, 0.1);
    
    /* Semantic Colors */
    --success: #34d399;
    --warning: #fbbf24;
    --danger: #f87171;
}
```

#### 사용 방법
```jsx
// 테마 변경 (body 또는 최상위 요소에 .dark 클래스 추가)
document.body.classList.toggle('dark');

// CSS 변수 사용 (Tailwind v4 @theme 디렉티브로 자동 매핑됨)
<div className="bg-bg-primary text-text-primary border-border-subtle">
```

### 1.1 브랜드 컬러

### 1.1 브랜드 컬러

| 이름 | 값 | 용도 |
|------|-----|------|
| Brand Primary | `#6366f1` | 메인 액션, 로고, 타이틀 |
| Brand Secondary | `#8b5cf6` | 보조 강조 |
| Brand Accent | `#ec4899` | 액센트 |
| Warning | `#ffd166` | 경고, 스트릭 |
| Danger | `#ff6b6b` | 오류, 삭제 |
| Success | `#7CFF8A` | 성공, 완료 |

### 1.2 그라디언트 (대시보드 실제 사용 패턴)

```css
/* 브랜드 그라디언트 */
--gradient-primary: linear-gradient(135deg, #6366f1, #8b5cf6);  /* indigo-violet */
--gradient-accent: linear-gradient(135deg, #6366f1, #ec4899);  /* indigo-pink */
--gradient-warm: linear-gradient(135deg, #f59e0b, #ea580c);     /* amber-orange - HOT 배지 */
--gradient-success: linear-gradient(135deg, #10b981, #14b8a6);   /* emerald-teal - 완료/NEW 배지 */
```

### 1.3 테스트별 테마 컬러 (실제 사용 패턴)

| 테스트 | 주 색상 | Tailwind |
|--------|---------|----------|
| Human | 인디고 | `indigo-500` |
| Cat | 핑크 | `pink-400` |
| Dog | 앰버 | `amber-400` |
| Rabbit | 로즈 | `rose-400` |
| Hamster | 오렌지 | `orange-400` |
| IdealType | 핑크 | `pink-500` |
| Plant | 그린 | `green-500` |
| Coffee | 앰버 | `amber-600` |
| Tea | 그린 | `green-500` |

---

## 2. 타이포그래피

### 2.1 폰트

```css
font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont,
             system-ui, Roboto, "Helvetica Neue", "Segoe UI",
             "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif;
```

### 2.2 크기 체계

> **원칙: Tailwind 표준 토큰만 사용. `text-[Npx]` 수동 지정 금지.**

| 용도 | Tailwind | 크기 | 비고 |
|------|----------|------|------|
| 페이지 타이틀 | `text-3xl` / `text-4xl` | 30-36px |
| 섹션 타이틀 | `text-2xl` | 24px |
| 카드 타이틀 | `text-xl` | 20px |
| 버튼/선택지 | `text-lg` | 18px |
| 강조 본문 | `text-base` | 16px |
| 본문 | `text-sm` | 14px | 기본 본문 크기 |
| 캡션/힌트/배지 | `text-xs` | 12px | **최소 크기** |

### 2.3 폰트 웨이트

| 용도 | Tailwind | 웨이트 | 비고 |
|------|----------|------|------|
| 타이틀, 강조 | `font-black` (900) | |
| 버튼, 레이블 | `font-bold` (700) | |
| 본문 | `font-medium` (500) | |
| 힌트 | `font-normal` (400) | |

---

## 3. 컴포넌트 스타일

### 3.1 Glass Card (메인 스타일)

```css
.glass-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}
```

**Tailwind 패턴:**
```jsx
<div className="bg-white/80 backdrop-blur-xl rounded-xl border-white/60 shadow-sm">
```

### 3.2 버튼

#### Primary (그라디언트)

```jsx
<button className="bg-gradient-primary text-white font-bold py-3 px-6 rounded-lg shadow-brand hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all">
```

#### Secondary (투명)

```jsx
<button className="glass-card text-slate-700 font-medium py-2.5 px-5 rounded-lg border border-white/60 hover:bg-white hover:border-brand transition-all">
```

#### Ghost

```jsx
<button className="text-slate-500 hover:bg-slate-100/50 hover:text-slate-800 rounded-lg py-2 transition-colors">
```

### 3.3 카드 아이템

```jsx
<button className="group flex flex-col items-center gap-1.5 p-2
                   rounded-xl bg-white/60 hover:bg-white
                   border border-white/60 hover:border-indigo-200
                   transition-all duration-200
                   hover:shadow-sm hover:-translate-y-0.5">
```

### 3.4 배지/칩

#### HOT 배지

```jsx
<span className="bg-gradient-warm text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
```

#### NEW 배지

```jsx
<span className="bg-gradient-success text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
```

#### 완료 배지

```jsx
<span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
```

### 3.5 프로그레스 바

```jsx
<div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
    <div className="h-full bg-gradient-primary rounded-full transition-all duration-700"
         style={{ width: `${percent}%` }} />
</div>
```

### 3.6 모달 오버레이

```jsx
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm
                flex items-center justify-center z-50">
```

---

## 4. 애니메이션

### 4.1 기본 애니메이션

```css
/* Fade In Up */
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
    animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Scale In (모달/팝업) */
@keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}

.animate-scale-in {
    animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```

### 4.2 호버 트랜지션

```jsx
{/* 카드 호버 */}
className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"

{/* 아이콘 스케일 */}
className="group-hover:scale-110 transition-transform duration-300"

{/* 버튼 클릭 */}
className="active:scale-95 transition-transform"
```

---

## 5. 레이아웃

### 5.1 메인 컨테이너 (대시보드)

```jsx
{/* 대시보드 (반응형) */}
<div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto w-full px-4">

{/* 테스트 카드 (고정) */}
<div className="glass-card rounded-[2.5rem] w-full max-w-md min-h-[750px]">
```

### 5.2 그리드

```jsx
{/* 테스트 목록: 모바일 4열 → 태블릿 5열 → PC 6열 */}
<div className="grid gap-1.5 grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
```

---

## 6. 아이콘

### 6.1 커스텀 아이콘 (SVG)

| 컴포넌트 | 용도 | mood 속성 |
|----------|------|-----------|
| `HumanIcon` | 사람 테스트 | happy, sad, excited, cool |
| `CatFace` | 고양이 테스트 | happy, sad, excited, cool |
| `DogFace` | 강아지 테스트 | happy, sad, excited, cool |

### 6.2 Lucide Icons

```jsx
import { ChevronRight, User, Star, Flame, Heart } from 'lucide-react';

<ChevronRight className="w-4 h-4 text-slate-400" />
```

---

## 7. 점수 계산 로직

### 7.1 점수 체계

```javascript
const SCORE = {
    HIGH: 5,    // 해당 차원 높음
    LOW: 1      // 해당 차원 낮음
};
```

### 7.2 레벨 판정

```javascript
function getScoreLevel(score, maxScore) {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 60) return "high";
    if (percentage <= 40) return "low";
    return "medium";
}
```

### 7.3 결과 매칭 우선순위

1. **완전 매칭**: 모든 조건이 일치하는 결과 중 조건이 가장 많은 것
2. **부분 매칭**: 가장 많은 조건이 일치하는 결과
3. **폴백**: 마지막 항목

---

## 8. 데이터 파일 구조

```
src/data/
├── types.ts           # 타입 정의 (SubjectKey, Question, ResultLabel)
├── config.ts          # SUBJECT_CONFIG, TEST_TYPES
├── constants.ts       # CHEMI_CONSTANTS
├── utils.ts           # matchResultLabel, getScoreLevel
├── subjects/          # 테스트별 데이터
│   ├── human.ts
│   ├── cat.ts
│   ├── dog.ts
│   └── ...
└── index.ts           # CHEMI_DATA 통합 export
```

---

## 9. 신규 테스트 추가

### 9.1 파일 수정 순서

1. `src/data/subjects/{subject}.ts` - 데이터 생성
2. `src/data/types.ts` - SubjectKey 추가
3. `src/data/config.ts` - SUBJECT_CONFIG 추가
4. `src/data/index.ts` - export 추가
5. `src/components/Icons.tsx` - 아이콘 추가 (필요시)

### 9.2 검증

```bash
npm run build    # 타입 검증 + 빌드
```

---

## 10. 대시보드 디자인 일관성 개선 (2025-12-26)

### 10.1 마이그레이션 개요

대시보드 컴포넌트의 디자인 일관성을 개선하기 위해 다음 4단계로 진행:

1. **Phase 1**: 디자인 토큰 정의 (완료)
2. **Phase 2**: 컴포넌트 스타일 마이그레이션 (완료)
3. **Phase 3**: 문서 업데이트 (진행 중)
4. **Phase 4**: 사용하지 않는 스타일 정리 (대기 중)

### 10.2 디자인 토큰 (Phase 1)

| 토큰 | Tailwind 클래스 | 용도 |
|-------|---------------|------|
| `--gradient-primary` | `bg-gradient-brand-primary` | 브랜드 그라디언트 (indigo-violet) |
| `--radius-md` | `rounded-md` | 표준 둥근 모서리 |
| `--shadow-sm` | `shadow-sm` | 표준 그림자 |
| `--shadow-brand` | `shadow-brand` | 브랜드 그림자 (호버 시) |
| `--border-subtle` | `border-subtle` | 표준 테두리 |
| `--glass-card` | `glass-card` | 글래스모피즘 카드 배경 |

### 10.3 마이그레이션 완료 컴포넌트 (Phase 2)

| 컴포넌트 | 경로 | 변경 내용 |
|----------|------|----------|
| **TestCard** | `src/components/TestCard.tsx` | `rounded-md`, `border-subtle`, `shadow-sm`, `hover:shadow-brand` 적용 |
| **HeroBanner** (HeroCard) | `src/components/HeroBanner.tsx` | `bg-slate-50`, `rounded-md`, `border-subtle`, `hover:shadow-brand` 적용 |
| **TodayQuizPoll** | `src/components/TodayQuizPoll.tsx` | `bg-slate-50`, `rounded-md`, `border-subtle`, `bg-gradient-brand-primary` 적용 |
| **DiscoveryFeed** | `src/components/DiscoveryFeed.tsx` | `glass-card`, `rounded-md`, `bg-gradient-brand-primary`, `shadow-brand` 적용 |

### 10.4 변경 전후 비교

#### 변경 전 (불일치 예시)
```jsx
// 다양한 그라디언트 패턴
className="bg-gradient-to-br from-indigo-500 to-purple-500"
className="bg-gradient-to-br from-indigo-500 to-pink-500"
className="bg-gradient-to-br from-emerald-500 to-teal-500"

// 다양한 둥근 모서리
className="rounded-xl"
className="rounded-2xl"
className="rounded-[1.25rem]"
className="rounded-[1.5rem]"

// 다양한 그림자
className="shadow-sm"
className="shadow-md"
className="shadow-lg"
className="shadow-xl"
```

#### 변경 후 (일관성 적용)
```jsx
// 통일된 그라디언트 패턴
className="bg-gradient-brand-primary"

// 통일된 둥근 모서리
className="rounded-md"

// 통일된 그림자
className="shadow-sm"        // 기본
className="hover:shadow-brand" // 호버 시
```

### 10.5 다음 단계 (Phase 4)

다음 컴포넌트들도 동일한 패턴으로 마이그레이션 필요:

- `FeedTestCard.tsx`
- `QuizWidget.tsx`
- `PollWidget.tsx`
- `TalkPreview.tsx`
- `DailyContentCards.tsx`
- 기타 대시보드 컴포넌트

### 10.5 추가 마이그레이션 완료 컴포넌트

| 컴포넌트 | 경로 | 변경 내용 |
|----------|------|----------|
| **FeedTestCard** | `src/components/FeedTestCard.tsx` | `glass-card`, `rounded-md`, `border-subtle` 적용 |
| **QuizWidget** | `src/components/content/QuizWidget.tsx` | `glass-card`, `rounded-md`, `border-subtle`, `bg-gradient-brand-primary` 적용 |
| **PollWidget** | `src/components/content/PollWidget.tsx` | `glass-card`, `rounded-md`, `border-subtle`, `bg-gradient-brand-primary` 적용 |
| **TalkPreview** | `src/components/TalkPreview.tsx` | `glass-card`, `rounded-md`, `border-subtle` 적용 |

---

## 업데이트 이력

| 날짜 | 변경 내용 |
|------|-----------|
| 2025-01-25 | 초기 디자인 시스템 문서 작성 |
| 2025-12-14 | Pretendard 폰트, Glassmorphism 스타일로 전면 업데이트 |
| 2025-12-26 | 대시보드 실제 사용 패턴 반영 (DESIGN_SYSTEM.md 업데이트) |
| 2025-12-26 | 대시보드 디자인 일관성 개선 (Phase 1-3 완료, 추가 컴포넌트 마이그레이션 완료) |
| 2025-12-26 | 대시보드 디자인 일관성 개선 (Phase 1-3 완료) |
