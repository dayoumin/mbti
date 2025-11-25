# 디자인 시스템

> 케미 테스트 앱의 UI 컴포넌트, 스타일 가이드, 로직 규칙을 정의합니다.

---

## 1. 컬러 시스템

### 1.1 모드별 테마 컬러

| 모드 | 테마 컬러 | Tailwind 클래스 | 용도 |
|------|-----------|-----------------|------|
| Human | 하늘색 | `bg-[#BDE0FE]` | 버튼, 프로그레스 바 |
| Cat | 핑크 | `bg-[#FFD1DC]` | 버튼, 프로그레스 바 |
| Dog | 노랑 | `bg-[#FFC95F]` | 버튼, 프로그레스 바 |

### 1.2 결과 카드 배경색

| 색상 | 클래스 | 사용 예시 |
|------|--------|-----------|
| 파랑 계열 | `bg-blue-100`, `bg-blue-200` | 차분한, 논리적 |
| 분홍 계열 | `bg-pink-100`, `bg-pink-200` | 따뜻한, 감성적 |
| 보라 계열 | `bg-purple-100`, `bg-purple-200` | 신비로운, 철학적 |
| 노랑 계열 | `bg-yellow-100` | 활발한, 창의적 |
| 초록 계열 | `bg-green-100` | 평화로운, 치유 |
| 주황 계열 | `bg-orange-100` | 열정적, 모험적 |
| 빨강 계열 | `bg-red-100` | 액션, 도전적 |
| 회색 계열 | `bg-gray-100` | 중립적, 균형 |
| 인디고 계열 | `bg-indigo-100`, `bg-indigo-200` | 전략적, 리더 |

### 1.3 기본 컬러

```css
/* 텍스트 */
--text-primary: #1F2937;     /* gray-800 */
--text-secondary: #6B7280;   /* gray-500 */
--text-muted: #9CA3AF;       /* gray-400 */

/* 배경 */
--bg-body: #F8FAFC;          /* slate-50 */
--bg-card: #FFFFFF;
--bg-border: #4A4A4A;

/* 상태 */
--color-success: #10B981;    /* emerald-500 */
--color-warning: #F59E0B;    /* amber-500 */
--color-error: #EF4444;      /* red-500 */
```

---

## 2. 타이포그래피

### 2.1 폰트

```css
font-family: 'Jua', sans-serif;
```

- **Jua**: 메인 폰트 (Google Fonts)
- 둥글고 친근한 느낌의 한글 폰트

### 2.2 크기 체계

| 용도 | 클래스 | 크기 |
|------|--------|------|
| 페이지 타이틀 | `text-3xl` | 30px |
| 결과 타이틀 | `text-2xl` | 24px |
| 질문 번호 | `text-xl` | 20px |
| 버튼/선택지 | `text-lg` | 18px |
| 본문 | `text-base` | 16px |
| 설명/캡션 | `text-sm` | 14px |
| 힌트 | `text-xs` | 12px |

---

## 3. 컴포넌트

### 3.1 Doodle Border (손그림 스타일 버튼)

```css
.doodle-border {
    border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
    border: 3px solid #4A4A4A;
    box-shadow: 4px 4px 0px #4A4A4A;
    transition: all 0.2s;
}

.doodle-border:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px #4A4A4A;
}
```

### 3.2 프로그레스 바

```jsx
<div className="w-full bg-gray-200 rounded-full h-4 border-2 border-gray-800">
    <div
        className={`${themeColor} h-full rounded-full border-r-2 border-gray-800`}
        style={{ width: `${progress}%` }}
    />
</div>
```

### 3.3 모달 오버레이

```css
.modal-overlay {
    background-color: rgba(0, 0, 0, 0.5);
}
```

### 3.4 아이콘 컴포넌트

| 컴포넌트 | 파일 | mood 속성 |
|----------|------|-----------|
| `HumanIcon` | `components/Icons.js` | happy, sad, excited, cool |
| `CatFace` | `components/Icons.js` | happy, sad, excited, cool |
| `DogFace` | `components/Icons.js` | happy, sad, excited, cool |
| `Capsule` | `components/Icons.js` | - |

---

## 4. 애니메이션

### 4.1 Shake (로딩 시 캡슐)

```css
@keyframes shake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    25% { transform: translate(-1px, -2px) rotate(-1deg); }
    50% { transform: translate(-3px, 0px) rotate(1deg); }
    75% { transform: translate(1px, -2px) rotate(-1deg); }
    100% { transform: translate(1px, 1px) rotate(0deg); }
}

.animate-shake {
    animation: shake 0.2s infinite;
}
```

### 4.2 Pop (화면 전환)

```css
@keyframes pop {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}

.animate-pop {
    animation: pop 0.5s ease-out forwards;
}
```

### 4.3 Progress Bar Fill

```css
.progress-bar-fill {
    transition: width 0.5s ease-in-out;
}
```

---

## 5. 레이아웃

### 5.1 메인 컨테이너

```jsx
<div className="w-full max-w-md mx-auto">
    <div className="w-full h-full bg-white rounded-3xl shadow-xl
                    overflow-hidden flex flex-col p-6 relative
                    border-4 border-gray-800"
         style={{ minHeight: '600px' }}>
        {/* 콘텐츠 */}
    </div>
</div>
```

### 5.2 반응형 브레이크포인트

| 크기 | 최대 너비 | 용도 |
|------|-----------|------|
| Mobile | 100% | 기본 |
| Card | `max-w-md` (448px) | 테스트 카드 |
| Modal | `max-w-sm` (384px) | 팝업 모달 |

---

## 6. 점수 계산 로직

### 6.1 점수 체계

```javascript
// 각 답변 점수
const SCORE = {
    HIGH: 5,    // 해당 차원 높음
    LOW: 1      // 해당 차원 낮음
};

// (선택적) 중간 점수
const SCORE_EXTENDED = {
    VERY_HIGH: 5,
    HIGH: 4,
    NEUTRAL: 3,
    LOW: 2,
    VERY_LOW: 1
};
```

### 6.2 레벨 판정

```javascript
function getScoreLevel(score, maxScore) {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 60) return "high";
    if (percentage <= 40) return "low";
    return "medium";
}
```

| 백분율 | 레벨 | 의미 |
|--------|------|------|
| 60% 이상 | `high` | 해당 특성 강함 |
| 41% ~ 59% | `medium` | 중간 |
| 40% 이하 | `low` | 해당 특성 약함 |

### 6.3 차원별 정규화

```javascript
// ⚠️ 중요: 차원별 질문 수가 다르면 각각 정규화 필요
const dimCounts = {};
questions.forEach(q => {
    dimCounts[q.dimension] = (dimCounts[q.dimension] || 0) + 1;
});

// 각 차원별 최대 점수 = 질문 수 × 5
const maxScore = dimCounts[dim] * 5;
```

### 6.4 결과 매칭

```javascript
// 조건 기반 매칭
{
    name: "에너자이저",
    condition: { inssa: "high", adventure: "high", empathy: "high" },
    // ...
}

// 매칭 우선순위:
// 1. 완전 일치 (모든 조건 충족)
// 2. 부분 일치 (가장 많이 일치하는 결과)
// 3. 기본값 (마지막 항목)
```

---

## 7. 질문 생성 규칙

### 7.1 질문 구조

```javascript
{
    q: "질문 텍스트?",           // 상황 설명 + 질문
    dimension: "차원키",         // inssa, adventure 등
    a: [
        { text: "선택지 1", score: 5 },  // 해당 차원 높음
        { text: "선택지 2", score: 1 }   // 해당 차원 낮음
    ]
}
```

### 7.2 차원별 질문 수 기준

| 모드 | 차원당 최소 | 권장 | 비고 |
|------|-------------|------|------|
| Human | 6개 | 9개 | 기본 3 + 심화 6 |
| Cat | 4개 | 7개 | 기본 2-3 + 심화 4-5 |
| Dog | 4개 | 6개 | 기본 2 + 심화 4 |

### 7.3 질문 작성 체크리스트

- [ ] 상황 기반 질문인가? (추상적 특성 직접 질문 X)
- [ ] 양쪽 선택지가 동등하게 매력적인가?
- [ ] 한국어가 자연스러운가?
- [ ] 대상(사람/고양이/강아지)에 맞는 표현인가?
- [ ] 기존 질문과 중복되지 않는가?
- [ ] 측정하려는 차원이 명확한가?

### 7.4 금지 패턴

```javascript
// ❌ MBTI식 대조쌍
"파티 vs 독서" // 직접 비교 금지

// ❌ 추상적 특성 직접 질문
"나는 외향적이다" // 자기 평가 금지

// ❌ 유도 질문
"사람들은 나를 좋아한다" // 사회적 바람직성 유도 금지
```

---

## 8. 결과 라벨 규칙

### 8.1 라벨 구조

```javascript
{
    name: "결과 이름",           // 2-4글자 권장
    emoji: "🎉",                // 대표 이모지 1개
    desc: "한 줄 설명",          // 15자 이내
    condition: {                // 매칭 조건
        차원1: "high/medium/low",
        차원2: "high/medium/low"
    },
    interpretation: "심층 해석", // 2-3문장
    guide: "조언/팁",           // 2-3문장
    mood: "happy/sad/excited/cool",  // 아이콘 표정
    color: "bg-색상-100"        // 배경색
}
```

### 8.2 조건 설계 가이드

- **2-3개 차원**만 조건에 포함 (너무 많으면 매칭 어려움)
- **핵심 특성**만 조건으로 지정
- **fallback 라벨** 필수 (모든 medium인 경우 대비)

### 8.3 결과 수 기준

| 모드 | 최소 | 권장 | 비고 |
|------|------|------|------|
| Human | 12개 | 16개 | 다양한 조합 커버 |
| Cat | 8개 | 10개 | 고양이 특성 반영 |
| Dog | 8개 | 10개 | 강아지 특성 반영 |

---

## 9. 데이터 관리 규칙

### 9.1 data.js 수정 금지 원칙

⚠️ **절대 금지**: Claude Code의 Edit/Write 도구로 `data.js` 직접 수정

| 도구 | 사용 가능 여부 | 이유 |
|------|---------------|------|
| Edit | ❌ 금지 | UTF-8 한글 인코딩 손상 |
| Write | ❌ 금지 | 파일 전체 덮어쓰기 위험 |
| Node.js 스크립트 | ✅ 권장 | 인코딩 안전, 검증 가능 |

### 9.2 data.js 수정 워크플로우

```
┌─────────────────────────────────────────────────────────┐
│  data.js 수정이 필요한 경우                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. 검증 먼저 실행                                       │
│     node scripts/validate-questions.mjs                 │
│                                                         │
│  2. 오류가 있으면?                                       │
│     ├─ 기존 오류 → fix-data-errors.mjs 실행             │
│     └─ 새 오류 → fix-data-errors.mjs에 수정 로직 추가   │
│                                                         │
│  3. 새 질문 추가가 필요하면?                             │
│     → scripts/add-questions.mjs 작성 (아래 템플릿 참조)  │
│                                                         │
│  4. 수정 후 반드시 재검증                                │
│     node scripts/validate-questions.mjs                 │
│     → 오류 0개 확인 후 커밋                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 9.3 질문 추가 스크립트 템플릿

```javascript
// scripts/add-questions.mjs 예시
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '..', 'data.js');

let content = fs.readFileSync(dataPath, 'utf8');

// 새 질문 정의
const newQuestion = `,
            {
                q: "질문 텍스트?",
                dimension: "차원키",  // inssa, curious, energy 등
                a: [
                    { text: "높은 점수 답변", score: 5 },
                    { text: "낮은 점수 답변", score: 1 }
                ]
            }`;

// 삽입 위치 찾기 (예: cat questions_deep 끝)
const mode = 'cat';  // human, cat, dog
const target = 'questions_deep';  // questions 또는 questions_deep

const modeStart = content.indexOf(`${mode}: {`);
const targetStart = content.indexOf(`${target}: [`, modeStart);
const nextSection = content.indexOf('resultLabels:', modeStart);
const insertPos = content.lastIndexOf(']', nextSection);

// 삽입
content = content.slice(0, insertPos) + newQuestion + content.slice(insertPos);

// 저장
fs.writeFileSync(dataPath, content, 'utf8');
console.log('✅ 질문 추가 완료');
```

### 9.4 스크립트 목록

```
scripts/
├── transform-data.mjs      # MBTI → CHEMI_DATA 구조 변환 (초기 1회)
├── fix-data-errors.mjs     # 알려진 데이터 오류 자동 수정
├── validate-questions.mjs  # 질문 데이터 검증 (수정 전후 필수 실행)
└── add-questions.mjs       # (필요시) 새 질문 추가용 템플릿
```

### 9.5 검증 스크립트 오류 유형

| 오류 유형 | 원인 | 해결 |
|----------|------|------|
| `답변은 정확히 2개여야 함` | 답변 배열 손상 | git checkout 후 재변환 |
| `두 답변의 점수가 같으면 안 됨` | score 오타 | fix-data-errors.mjs에 수정 추가 |
| `기본 질문 부족` | 차원별 최소 미달 | 새 질문 추가 스크립트 작성 |
| `잘못된 dimension` | 오타 또는 미존재 키 | dimension 키 확인 후 수정 |

### 9.6 차원(Dimension) 키 참조

**Human**: `inssa`, `adventure`, `empathy`, `plan`, `mental`
**Cat**: `curious`, `alert`, `boss`, `random`, `cute`
**Dog**: `energy`, `humanLove`, `dogFriend`, `focus`, `brave`, `persist`

### 9.7 git checkout 후 복구 절차

```bash
# data.js가 원본(MBTI 구조)으로 돌아간 경우:
node scripts/transform-data.mjs   # CHEMI_DATA로 변환
node scripts/fix-data-errors.mjs  # 알려진 오류 수정
node scripts/validate-questions.mjs  # 검증 (오류 0개 확인)
```

---

## 10. 향후 확장 예정

### 10.1 UI 컴포넌트
- [ ] 결과 공유 버튼 (카카오톡, 트위터)
- [ ] 결과 이미지 저장 (html2canvas)
- [ ] 궁합 비교 모달
- [ ] 스켈레톤 로딩

### 10.2 로직
- [ ] 결과 히스토리 저장 (localStorage)
- [ ] A/B 테스트 질문 로테이션
- [ ] 익명 통계 수집

### 10.3 접근성
- [ ] 키보드 네비게이션
- [ ] 스크린 리더 지원
- [ ] 고대비 모드

---

## 업데이트 이력

| 날짜 | 변경 내용 |
|------|-----------|
| 2025-01-25 | 초기 디자인 시스템 문서 작성 |
| 2025-01-25 | 9장 데이터 관리 규칙 대폭 확장 (워크플로우, 스크립트 템플릿, 오류 유형) |
