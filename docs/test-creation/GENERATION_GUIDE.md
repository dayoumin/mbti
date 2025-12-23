# 테스트 생성 가이드라인

> AI(Claude Code)가 `research/{subject}.md`를 읽고 테스트 데이터를 생성할 때 따르는 규칙입니다.

---

## 0. 리서치 → 코드 필드 매핑

### 리서치 파일(RESEARCH_RESULT.md) → TypeScript 코드 변환 규칙

| 리서치 섹션 | 리서치 필드 | 코드 위치 | 코드 필드 |
|-------------|-------------|-----------|-----------|
| **1. 개요** | themeColor | root | `themeColor` |
| **3. 차원** | 키 | dimensions.{key} | key 자체 |
| **3. 차원** | 이름 | dimensions.{key} | `name` |
| **3. 차원** | 이모지 | dimensions.{key} | `emoji` |
| **3. 차원** | 설명 | dimensions.{key} | `desc` |
| **4. 결과** | 이름 | resultLabels[] | `name` |
| **4. 결과** | 이모지 | resultLabels[] | `emoji` |
| **4. 결과** | 한줄 설명 | resultLabels[] | `desc` |
| **4. 결과** | 조건 | resultLabels[] | `condition` |
| **4. 결과** | mood | resultLabels[] | `mood` |
| **4. 결과** | color | resultLabels[] | `color` |
| **4. 결과** | 해석 | resultLabels[] | `interpretation` |
| **4. 결과** | 가이드 | resultLabels[] | `guide` |
| **4. 결과** | 매치 포인트 | resultLabels[] | `matchPoints` |
| **5. 질문** | 질문 내용 | questions[] | `q` |
| **5. 질문** | 차원 키 | questions[] | `dimension` |
| **5. 질문** | HIGH(5) 선택지 | questions[].a[] | `{ text, score: 5 }` |
| **5. 질문** | MEDIUM(3) 선택지 | questions[].a[] | `{ text, score: 3 }` |
| **5. 질문** | LOW(1) 선택지 | questions[].a[] | `{ text, score: 1 }` |

### 변환 예시

**리서치 (research/whiskey.md):**
```markdown
## 3. 차원
| 키 | 이름 | 이모지 | 설명 | LOW | HIGH | 근거 |
|----|------|--------|------|-----|------|------|
| smoky | 스모키 | 🔥 | 피티/스모키 정도 | 깔끔함 | 강한 피트향 | Wishart |

## 4. 결과
#### 결과 1: 아일라 싱글몰트 🏴󠁧󠁢󠁳󠁣󠁴󠁿
- **조건**: `{ smoky: "high", body: "high" }`
- **mood**: cool
- **color**: `bg-slate-700`
```

**생성된 코드 (src/data/subjects/whiskey.ts):**
```typescript
dimensions: {
    smoky: { name: "스모키", emoji: "🔥", desc: "피티/스모키 정도" }
},
resultLabels: [
    {
        name: "아일라 싱글몰트",
        emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
        condition: { smoky: "high", body: "high" },
        mood: "cool",
        color: "bg-slate-700",
        // ... 나머지 필드
    }
]
```

---

## 1. 생성 워크플로우

```
┌─────────────────────────────────────────────────────────────┐
│                   Test Generation Flow                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. 리서치 파일 읽기                                          │
│     research/{subject}.md                                    │
│                                                              │
│  2. 차원(Dimensions) 생성                                     │
│     - 리서치의 "3. 차원 설계" 섹션 참고                        │
│     - 5-6개 차원, 각각 name/emoji/desc                        │
│                                                              │
│  3. 질문(Questions) 생성                                      │
│     - 리서치의 "5. 질문 설계 가이드" 참고                      │
│     - 차원당 2-3개, 총 12-16개                                │
│     - 중간 점수(3) 옵션 필수 포함                              │
│                                                              │
│  4. 결과(ResultLabels) 생성                                   │
│     - 리서치의 "4. 결과 유형" 참고                             │
│     - 8-16개, 각각 2-3개 조건                                  │
│     - condition: {} 사용 금지                                  │
│                                                              │
│  5. 검증 실행                                                 │
│     node scripts/validate-test-data.mjs {subject}            │
│     npm run build                                            │
│                                                              │
│  6. 문제 있으면 자동 수정 후 재검증                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 데이터 구조 규칙

### 2.1 파일 구조

```typescript
// src/data/subjects/{subject}.ts

import { SubjectData } from '../types';

export const {subject}Data: SubjectData = {
    title: "테스트 제목",           // 예: "나의 위스키 찾기"
    subtitle: "부제목",             // 예: "어떤 위스키가 나와 맞을까?"
    themeColor: "bg-{color}-{shade}", // Tailwind 색상
    icon: "{Subject}Icon",          // Icons.js에 정의된 아이콘
    testType: "matching",           // "personality" | "matching"
    dimensions: { ... },
    questions: [ ... ],
    questions_deep: [ ... ],        // 선택: 심층 질문
    resultLabels: [ ... ]
};
```

### 2.2 차원(Dimensions) 규칙

```typescript
dimensions: {
    // 키는 camelCase, 영문 소문자
    dimKey: {
        name: "차원명",      // 한글, 2-4자
        emoji: "🎯",        // 1개 이모지
        desc: "설명"        // 한글, 10-20자
    }
}
```

**체크리스트:**
- [ ] 5-6개 차원
- [ ] 키가 중복되지 않음
- [ ] 모든 차원에 질문이 있음

### 2.3 질문(Questions) 규칙

```typescript
questions: [
    {
        q: "질문 내용?",           // 물음표로 끝남
        dimension: "dimKey",       // 유효한 차원 키
        a: [
            { text: "높은 선택", score: 5 },
            { text: "중간 선택", score: 3 },  // ← 필수!
            { text: "낮은 선택", score: 1 }
        ]
    }
]
```

**점수 규칙:**
| 패턴 | 의미 | 권장 비율 |
|------|------|----------|
| 5/3/1 | 3단계 선택 | 40%+ |
| 5/1 | 2단계 선택 | 60% 이하 |
| 5/4/2/1 | 4단계 선택 | 선택적 |

**체크리스트:**
- [ ] 총 12-16개 질문
- [ ] 차원당 2-3개 질문 (균형)
- [ ] 40% 이상 질문에 중간 점수(3) 포함
- [ ] 모든 질문이 물음표로 끝남
- [ ] 중복 질문 없음

### 2.4 결과(ResultLabels) 규칙

```typescript
resultLabels: [
    {
        name: "결과 이름",           // 한글, 3-8자
        emoji: "🎯",                // 1개 이모지
        desc: "한줄 설명",           // 15-30자
        condition: {                 // 필수! 2-3개 조건
            dim1: "high",           // "high" | "medium" | "low"
            dim2: "low"
        },
        mood: "happy",              // 결과 분위기
        color: "bg-{color}-{shade}",// Tailwind 색상
        interpretation: "해석...",   // 50-100자
        guide: "가이드...",          // 50-100자
        matchPoints: [              // matching 테스트 필수
            "추천 포인트 1",
            "추천 포인트 2",
            "추천 포인트 3"
        ]
    }
]
```

**조건(condition) 규칙:**

| 규칙 | 설명 |
|------|------|
| `condition: {}` 금지 | 빈 조건은 도달 불가 |
| 2-3개 조건 권장 | 너무 적으면 구분 안 됨, 너무 많으면 도달 어려움 |
| 중복 조건 금지 | 같은 조건 조합의 결과가 2개 이상 있으면 안 됨 |
| 모든 레벨 사용 | high/medium/low 골고루 사용 |

**체크리스트:**
- [ ] 8-16개 결과
- [ ] 모든 결과에 2-3개 조건
- [ ] `condition: {}` 없음
- [ ] 중복 조건 없음
- [ ] 모든 결과가 도달 가능

---

## 3. 품질 기준

### 3.1 필수 통과 기준 (빌드 실패 = 수정 필수)

| 검증 | 기준 |
|------|------|
| 구조 검증 | 필수 필드 모두 있음 |
| 차원 검증 | 모든 질문이 유효한 차원 참조 |
| 타입 검증 | TypeScript 빌드 통과 |

### 3.2 권장 기준 (경고 = 가능하면 수정)

| 검증 | 기준 | 허용 범위 |
|------|------|----------|
| 차원 균형 | 차원별 문항 수 차이 | ±1개 |
| 점수 다양성 | 중간 점수(3) 포함 질문 | 40%+ |
| 도달 가능성 | 모든 결과 도달 가능 | 100% |
| 조건 다양성 | 중복 조건 없음 | 0개 |

### 3.3 품질 점수 (100점 만점)

```
품질 점수 =
  + 기본 점수 50점 (필수 기준 통과)
  + 차원 균형 15점 (모든 차원 ±1개 이내)
  + 점수 다양성 15점 (40%+ 중간 점수)
  + 도달 가능성 15점 (100% 도달 가능)
  + 근거 있음 5점 (리서치 기반)
```

**목표: 85점 이상**

---

## 4. 검증 명령어

### 4.1 기본 검증

```bash
# 특정 테스트 검증
node scripts/validate-test-data.mjs {subject}

# 전체 테스트 검증
node scripts/validate-test-data.mjs

# 빌드 검증
npm run build
```

### 4.2 검증 결과 해석

| 아이콘 | 의미 | 조치 |
|--------|------|------|
| ✓ | 통과 | - |
| ✗ | 오류 | 필수 수정 |
| 경고 | 권장사항 | 가능하면 수정 |

### 4.3 자동 수정 가이드

| 경고 유형 | 수정 방법 |
|----------|----------|
| "도달 불가능한 결과" | condition 조건 수정 또는 질문 점수 조정 |
| "5/1 이분법만 사용" | 일부 질문에 중간 점수(3) 옵션 추가 |
| "차원별 문항 수 불균형" | 부족한 차원에 질문 추가 |
| "중복 조건" | 결과 중 하나의 조건 변경 |
| "조건 없는 결과" | condition에 2-3개 조건 추가 |

---

## 5. 파일 수정 체크리스트

새 테스트 추가 시 수정할 파일:

| # | 파일 | 수정 내용 |
|---|------|----------|
| 1 | `src/data/subjects/{subject}.ts` | 테스트 데이터 생성 |
| 2 | `src/data/types.ts` | SubjectKey에 추가 |
| 3 | `src/data/config.ts` | SUBJECT_CONFIG에 추가 |
| 4 | `src/data/index.ts` | import + CHEMI_DATA에 추가 |
| 5 | `src/components/Icons.js` | 아이콘 컴포넌트 추가 |
| 6 | `src/app/dashboard/page.tsx` | TEST_ICONS에 추가 |
| 7 | `scripts/validate-test-data.mjs` | SUBJECTS에 추가 |

---

## 6. 예시: 리서치 → 테스트 변환

### 리서치 파일 (research/whiskey.md)

```markdown
## 3. 차원 설계
| 키 | 이름 | 양극단 |
|----|------|--------|
| smoky | 스모키 | 깔끔함 ↔ 피티/스모키 |
| sweet | 단맛 | 드라이 ↔ 달콤함 |
| body | 바디 | 가벼움 ↔ 풀바디 |
| fruity | 과일향 | 없음 ↔ 강함 |
| spicy | 스파이시 | 부드러움 ↔ 스파이시 |
```

### 생성된 테스트 (src/data/subjects/whiskey.ts)

```typescript
export const whiskeyData: SubjectData = {
    title: "나의 위스키 찾기",
    subtitle: "어떤 위스키가 나와 맞을까?",
    themeColor: "bg-amber-800",
    icon: "WhiskeyIcon",
    testType: "matching",
    dimensions: {
        smoky: { name: "스모키", emoji: "🔥", desc: "피티/스모키 정도" },
        sweet: { name: "단맛", emoji: "🍯", desc: "달콤한 정도" },
        body: { name: "바디", emoji: "💪", desc: "묵직한 정도" },
        fruity: { name: "과일향", emoji: "🍎", desc: "과일 풍미" },
        spicy: { name: "스파이시", emoji: "🌶️", desc: "매콤한 정도" }
    },
    questions: [
        {
            q: "스모키한 향을 좋아하나요?",
            dimension: "smoky",
            a: [
                { text: "네, 강한 피트향이 좋아요", score: 5 },
                { text: "살짝 스모키한 정도가 좋아요", score: 3 },
                { text: "깔끔한 게 좋아요", score: 1 }
            ]
        },
        // ... 12-16개 질문
    ],
    resultLabels: [
        {
            name: "아일라 싱글몰트",
            emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
            desc: "강렬한 피트향의 스코틀랜드 위스키",
            condition: { smoky: "high", body: "high" },
            mood: "cool",
            color: "bg-slate-700",
            interpretation: "당신은 강렬하고 개성 있는 맛을 추구하는 위스키 마니아...",
            guide: "라프로익, 아드벡, 라가불린을 추천드려요...",
            matchPoints: [
                "강한 개성을 좋아하는 분",
                "위스키 경험이 많은 분",
                "스모키한 향을 즐기는 분"
            ]
        },
        // ... 8-16개 결과
    ]
};
```

---

## 7. 완료 보고 형식

```
✅ {subject} 테스트 생성 완료

## 생성된 데이터
- 차원: {n}개
- 질문: {n}개 (중간점수 포함 {n}개, {%}%)
- 결과: {n}개

## 검증 결과
- validate-test-data: 에러 0, 경고 {n}
- 빌드: 성공

## 수정한 파일
- src/data/subjects/{subject}.ts (생성)
- src/data/types.ts (SubjectKey 추가)
- src/data/config.ts (SUBJECT_CONFIG 추가)
- src/data/index.ts (import/export 추가)
- src/components/Icons.js (아이콘 추가)
- scripts/validate-test-data.mjs (SUBJECTS 추가)

## 품질 점수
- 차원 균형: ✓
- 점수 다양성: {%}%
- 도달 가능성: 100%
- 총점: {n}/100

## 리서치 기반
- 출처: research/{subject}.md
- 주요 참고: {출처 목록}
```
