# 타로 콘텐츠 레지스트리 통합 - AI 코드 리뷰 요청

## 변경 개요

**목적**: 타로 퀴즈/투표 데이터를 중앙 레지스트리에 통합하여 별도 import 없이 사용 가능하게 함

**변경 일자**: 2024-12-25

---

## 1. 변경된 파일 목록

| 파일 | 변경 내용 |
|------|----------|
| `src/data/content/quizzes/tarot-quizzes.ts` | 타입 변환 (TarotQuiz → KnowledgeQuiz) |
| `src/data/content/polls/tarot-polls.ts` | 타입 변환 (Poll → VSPoll/ChoicePoll) |
| `src/data/content/quizzes/index.ts` | 레지스트리에 타로 퀴즈 등록 |
| `src/data/content/polls/index.ts` | 레지스트리에 타로 투표 등록 |
| `src/app/dashboard/components/ContentOverview.tsx` | 별도 import 제거, 레지스트리 사용 |

---

## 2. 상세 변경 내용

### 2.1 tarot-quizzes.ts

**Before:**
```typescript
interface TarotQuiz {
  id: string;
  type: 'knowledge';
  category: 'general';
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  difficulty: 1 | 2 | 3;
  points: number;
  tags: string[];
}

export const TAROT_QUIZZES: TarotQuiz[] = [...]
```

**After:**
```typescript
import type { KnowledgeQuiz } from '../types';

export const TAROT_KNOWLEDGE_QUIZZES: KnowledgeQuiz[] = [
  {
    id: 'tarot-quiz-001',
    category: 'tarot',  // 'general' → 'tarot'
    question: '...',
    options: [...],
    explanation: '...',
    difficulty: 1,
    tags: [...],
    // type, points 필드 제거 (KnowledgeQuiz에 없음)
  },
  // ... 22개 퀴즈
];

export const TAROT_QUIZZES = TAROT_KNOWLEDGE_QUIZZES; // 호환성
```

**변경 이유:**
- 커스텀 타입 대신 프로젝트 표준 타입 사용
- 레지스트리 통합을 위해 category를 'tarot'으로 지정
- `type`, `points` 필드는 KnowledgeQuiz에 없어 제거

---

### 2.2 tarot-polls.ts

**Before:**
```typescript
// 대시보드용 Poll 타입 사용
interface Poll {
  id: string;
  type: 'vs';
  category: 'general';
  question: string;
  options: { id: string; text: string; emoji?: string }[];
  tags: string[];
}
```

**After:**
```typescript
import type { VSPoll, ChoicePoll } from '../types';

export const TAROT_VS_POLLS: VSPoll[] = [
  {
    id: 'tarot-poll-001',
    category: 'tarot',
    question: '...',
    optionA: { id: 'a', text: '...', emoji: '...' },  // options[0] → optionA
    optionB: { id: 'b', text: '...', emoji: '...' },  // options[1] → optionB
    tags: [...],
  },
  // ... 15개 VS 투표
];

export const TAROT_CHOICE_POLLS: ChoicePoll[] = [
  {
    id: 'tarot-poll-011',
    category: 'tarot',
    question: '...',
    options: [...],  // 3개 이상 선택지
    tags: [...],
  },
  // ... 5개 Choice 투표
];
```

**변경 이유:**
- VSPoll은 `optionA`/`optionB` 구조 사용 (options 배열 아님)
- VS 투표와 Choice 투표 분리

---

### 2.3 quizzes/index.ts

**추가된 코드:**
```typescript
import { TAROT_KNOWLEDGE_QUIZZES } from './tarot-quizzes';

const KNOWLEDGE_QUIZ_REGISTRY: KnowledgeQuiz[][] = [
  CAT_KNOWLEDGE_QUIZZES,
  DOG_KNOWLEDGE_QUIZZES,
  RABBIT_KNOWLEDGE_QUIZZES,
  HAMSTER_KNOWLEDGE_QUIZZES,
  PLANT_KNOWLEDGE_QUIZZES,
  KIDS_ANIMAL_QUIZZES,
  LOVE_KNOWLEDGE_QUIZZES,
  FISH_KNOWLEDGE_QUIZZES,
  TAROT_KNOWLEDGE_QUIZZES,  // ← 추가
  SMALLPET_KNOWLEDGE_QUIZZES,
  BIRD_KNOWLEDGE_QUIZZES,
  REPTILE_KNOWLEDGE_QUIZZES,
];

export const ALL_KNOWLEDGE_QUIZZES: KnowledgeQuiz[] = KNOWLEDGE_QUIZ_REGISTRY.flat();
```

---

### 2.4 polls/index.ts

**추가된 코드:**
```typescript
import { TAROT_VS_POLLS, TAROT_CHOICE_POLLS } from './tarot-polls';

const POLL_REGISTRY: VSPoll[][] = [
  VS_POLLS_DATA,
  KIDS_VS_POLLS,
  TAROT_VS_POLLS,  // ← 추가
];

export const VS_POLLS: VSPoll[] = POLL_REGISTRY.flat();
export const CHOICE_POLLS: ChoicePoll[] = [
  ...CHOICE_POLLS_DATA,
  ...MONEY_POLLS,
  ...TAROT_CHOICE_POLLS,  // ← 추가
];
```

---

### 2.5 ContentOverview.tsx

**Before:**
```typescript
// 별도 import 필요
import { TAROT_QUIZZES } from '@/data/content/quizzes/tarot-quizzes';
import { TAROT_VS_POLLS, TAROT_CHOICE_POLLS } from '@/data/content/polls/tarot-polls';

// 하드코딩된 개수
<span>타로 퀴즈 {TAROT_QUIZZES.length}개</span>
```

**After:**
```typescript
// 레지스트리 배열만 import
import { ALL_KNOWLEDGE_QUIZZES, ALL_SCENARIO_QUIZZES } from '@/data/content/quizzes';
import { VS_POLLS, CHOICE_POLLS } from '@/data/content/polls';

// category 필터로 동적 집계
<span>타로 퀴즈 {ALL_KNOWLEDGE_QUIZZES.filter(q => q.category === 'tarot').length}개</span>
<span>투표 {VS_POLLS.filter(p => p.category === 'tarot').length +
        CHOICE_POLLS.filter(p => p.category === 'tarot').length}개</span>
```

---

## 3. 검증 결과

```
✅ 모든 검증 통과!

총 타로 콘텐츠:
   - 퀴즈: 22개
   - VS 투표: 15개
   - Choice 투표: 5개
   - 합계: 42개

검증 항목:
   - 퀴즈 레지스트리 등록: ✅
   - VS 투표 레지스트리 등록: ✅
   - Choice 투표 배열 추가: ✅
   - ContentOverview 레지스트리 사용: ✅
   - 빌드 성공: ✅
```

---

## 4. 리뷰 요청 사항

### 4.1 타입 일관성
- [ ] KnowledgeQuiz 타입에서 제거한 `type`, `points` 필드가 다른 곳에서 사용되지 않는지?
- [ ] VSPoll의 `optionA`/`optionB` 구조가 표준과 일치하는지?

### 4.2 레지스트리 패턴
- [ ] 다른 카테고리(cat, dog 등)도 동일한 패턴으로 등록되어 있는지?
- [ ] 레지스트리에 등록 순서가 중요한지?

### 4.3 호환성
- [ ] `TAROT_QUIZZES = TAROT_KNOWLEDGE_QUIZZES` alias가 필요한 곳이 있는지?
- [ ] 기존 타로 관련 코드가 이 변경으로 영향받는지?

### 4.4 성능
- [ ] `.filter(q => q.category === 'tarot')` 방식이 매번 실행되는데 메모이제이션 필요한지?

---

## 5. 파일 위치

```
src/data/content/
├── quizzes/
│   ├── index.ts           # 레지스트리 (수정됨)
│   └── tarot-quizzes.ts   # 타로 퀴즈 (수정됨)
├── polls/
│   ├── index.ts           # 레지스트리 (수정됨)
│   └── tarot-polls.ts     # 타로 투표 (수정됨)
└── types.ts               # 타입 정의 (참조)

src/app/dashboard/components/
└── ContentOverview.tsx    # 대시보드 (수정됨)

scripts/
├── verify-tarot-counts.mjs     # 검증 스크립트
└── verify-tarot-registry.ts    # 상세 검증 (TypeScript)
```

---

## 6. 관련 문서

- [types.ts](../../../src/data/content/types.ts) - 타입 정의
- [CLAUDE.md](../../../CLAUDE.md) - 프로젝트 규칙
