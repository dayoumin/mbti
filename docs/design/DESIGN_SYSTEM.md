# 디자인 시스템

> 케미 테스트 앱의 UI 컴포넌트, 스타일 가이드, 로직 규칙을 정의합니다.

---

## 1. 컬러 시스템

### 1.1 브랜드 컬러

| 이름 | 값 | 용도 |
|------|-----|------|
| Brand Primary | `#7aa2ff` | 메인 액션, 링크 |
| Brand Secondary | `#55e6c1` | 보조 강조 |
| Warning | `#ffd166` | 경고, 스트릭 |
| Danger | `#ff6b6b` | 오류, 삭제 |
| Success | `#7CFF8A` | 성공, 완료 |

### 1.2 라이트 테마 (메인 앱)

```css
/* 배경 */
--bg-body: #F0F2F5;          /* 페이지 배경 */
--bg-card: rgba(255,255,255,0.85);  /* 카드 배경 (glass) */

/* 텍스트 */
--text-primary: #1E293B;     /* slate-800 */
--text-secondary: #64748B;   /* slate-500 */
--text-muted: #94A3B8;       /* slate-400 */

/* 그라디언트 */
--gradient-primary: linear-gradient(to right, #6366f1, #8b5cf6);  /* indigo-purple */
--gradient-warm: linear-gradient(to right, #f59e0b, #ea580c);     /* amber-orange */
```

### 1.3 다크 테마 (개발자 대시보드)

```css
--db-bg: #0b0f19;
--db-panel: #0f1629;
--db-text: #e8eefc;
--db-muted: #a9b4d0;
--db-line: #223055;
--db-brand: #7aa2ff;
```

### 1.4 테스트별 테마 컬러

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

- **Pretendard**: 메인 폰트 (가변 폰트)
- 깔끔하고 현대적인 한글 폰트
- CDN: `cdn.jsdelivr.net/gh/orioncactus/pretendard`

### 2.2 크기 체계

| 용도 | Tailwind | 크기 |
|------|----------|------|
| 페이지 타이틀 | `text-3xl` / `text-4xl` | 30-36px |
| 섹션 타이틀 | `text-2xl` | 24px |
| 카드 타이틀 | `text-xl` | 20px |
| 버튼/선택지 | `text-lg` | 18px |
| 본문 | `text-base` / `text-sm` | 14-16px |
| 캡션 | `text-xs` | 12px |
| 힌트/배지 | `text-[10px]` / `text-[11px]` | 10-11px |

### 2.3 폰트 웨이트

| 용도 | Tailwind |
|------|----------|
| 타이틀, 강조 | `font-black` (900) |
| 버튼, 레이블 | `font-bold` (700) |
| 본문 | `font-medium` (500) |
| 힌트 | `font-normal` (400) |

---

## 3. 컴포넌트 스타일

### 3.1 Glass Card (메인 스타일)

```css
.glass-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}
```

**Tailwind 패턴:**
```jsx
<div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm">
```

### 3.2 버튼

**Primary (그라디언트)**
```jsx
<button className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white
                   rounded-xl py-4 font-bold shadow-lg
                   hover:shadow-indigo-500/30 hover:-translate-y-0.5
                   active:scale-95 transition-all">
```

**Secondary (투명)**
```jsx
<button className="bg-white/60 hover:bg-white/90 text-slate-700
                   border border-white/60 rounded-xl py-3
                   shadow-sm hover:shadow-md backdrop-blur-sm">
```

**Ghost**
```jsx
<button className="text-slate-500 hover:bg-slate-100/50 hover:text-slate-800
                   rounded-lg py-2 transition-colors">
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

```jsx
{/* HOT 배지 */}
<span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white
                 text-[8px] font-bold px-1 py-0.5 rounded-full">

{/* NEW 배지 */}
<span className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white
                 text-[8px] font-bold px-1 py-0.5 rounded-full">

{/* 완료 배지 */}
<span className="bg-emerald-100 text-emerald-700
                 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
```

### 3.5 프로그레스 바

```jsx
<div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500
                    rounded-full transition-all duration-700"
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
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
    animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Bounce In (Toast) */
@keyframes bounceIn {
    0% { opacity: 0; transform: translate(-50%, -20px) scale(0.9); }
    50% { transform: translate(-50%, 5px) scale(1.02); }
    100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
}
.animate-bounce-in {
    animation: bounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Bounce Slight (아이콘) */
@keyframes bounceSlight {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
}
.animate-bounce-slight {
    animation: bounceSlight 2s ease-in-out infinite;
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

### 5.1 메인 컨테이너

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

{/* 2열 그리드 */}
<div className="grid grid-cols-2 gap-3">
```

### 5.3 반응형 브레이크포인트

| 크기 | Tailwind | 용도 |
|------|----------|------|
| Mobile | `sm:` (640px) | 기본 |
| Tablet | `md:` (768px) | 2열 확장 |
| Desktop | `lg:` (1024px) | 사이드바 표시 |

---

## 6. 아이콘

### 6.1 커스텀 아이콘 (SVG)

| 컴포넌트 | 용도 | mood 속성 |
|----------|------|-----------|
| `HumanIcon` | 사람 테스트 | happy, sad, excited, cool |
| `CatFace` | 고양이 테스트 | happy, sad, excited, cool |
| `DogFace` | 강아지 테스트 | happy, sad, excited, cool |
| `RabbitFace` | 토끼 테스트 | happy, sad, excited, cool |
| `HamsterFace` | 햄스터 테스트 | happy, sad, excited, cool |
| `Capsule` | 로딩 | - |

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

## 업데이트 이력

| 날짜 | 변경 내용 |
|------|-----------|
| 2025-01-25 | 초기 디자인 시스템 문서 작성 |
| 2025-12-14 | Pretendard 폰트, Glassmorphism 스타일로 전면 업데이트 |
