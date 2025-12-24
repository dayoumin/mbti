---
name: content-generator
description: 퀴즈/투표/토너먼트 콘텐츠 데이터 생성. 주어진 카테고리와 타입에 맞는 콘텐츠 생성 시 사용.
allowed-tools: Read, Write, Edit, Glob
---

# 콘텐츠 생성기 (Quiz/Poll/Tournament)

## 목적
주어진 카테고리와 콘텐츠 타입에 맞는 데이터를 생성합니다.

## 콘텐츠 타입별 구조

### 1. 지식 퀴즈 (Knowledge Quiz)

```typescript
interface Quiz {
  id: string;                    // "{category}-quiz-{번호}"
  type: 'knowledge';
  category: ContentCategory;
  question: string;              // 질문 (물음표로 끝남)
  options: {
    id: string;                  // 'a', 'b', 'c', 'd'
    text: string;                // 선택지 텍스트
    isCorrect: boolean;          // 정답 여부 (1개만 true)
  }[];
  explanation: string;           // 정답 해설 (왜 정답인지)
  difficulty: 1 | 2 | 3;         // 1: 쉬움, 2: 보통, 3: 어려움
  points: number;                // 난이도별: 10/15/20
  tags: string[];                // 검색용 태그 2-4개
}
```

**필수 규칙:**
- 선택지 3-4개
- 정답은 반드시 1개
- explanation은 정답 이유 + 추가 정보
- tags는 최소 2개

### 2. 시나리오 퀴즈 (Scenario Quiz)

```typescript
interface ScenarioQuiz {
  id: string;                    // "{category}-scenario-{주제}"
  category: ContentCategory;
  title: string;                 // "나의 집사 점수는?"
  subtitle?: string;             // 부제목
  emoji: string;                 // 대표 이모지
  themeColor: string;            // "bg-{color}-100"
  questions: {
    id: string;                  // "q1", "q2", ...
    situation?: string;          // 상황 설명 (선택)
    question: string;            // 질문
    options: {
      id: string;                // 'a', 'b', 'c'
      text: string;              // 선택지
      points: number;            // 0-10점
      feedback?: string;         // 선택 후 피드백 (선택)
    }[];
  }[];
  results: {
    minScore: number;            // 최소 점수
    maxScore: number;            // 최대 점수
    grade: string;               // "S", "A", "B", "C", "D"
    title: string;               // 등급 이름 "프로 집사"
    emoji: string;               // 등급 이모지
    description: string;         // 등급 설명
    tips?: string[];             // 개선 팁 (선택)
  }[];
}
```

**필수 규칙:**
- 질문 5-10개 권장
- 선택지당 0-10점
- results 점수 범위 연속 (갭 없음)
- 최대 점수 = 질문 수 × 최고 점수 옵션

### 3. VS 투표 (VS Poll)

```typescript
interface Poll {
  id: string;                    // "{category}-poll-{번호}"
  type: 'vs';
  category: ContentCategory;
  question: string;              // "A vs B, 어떤 게 더 좋아요?"
  options: [                     // 정확히 2개
    { id: 'a', text: string, emoji?: string },
    { id: 'b', text: string, emoji?: string }
  ];
  tags: string[];                // 2-3개
}
```

**필수 규칙:**
- 정확히 2개 선택지
- 질문에 "vs" 포함 권장
- 양쪽 다 매력적인 선택지

### 4. 선택 투표 (Choice Poll)

```typescript
interface Poll {
  id: string;
  type: 'choice';
  category: ContentCategory;
  question: string;
  options: {                     // 3-5개
    id: string;
    text: string;
    emoji?: string;
  }[];
  tags: string[];
}
```

### 5. 상황별 반응 투표 (Situation-Reaction)

```typescript
interface SituationReaction {
  id: string;                    // "situation-reaction-{category}-{번호}"
  type: 'situation-reaction';
  category: SituationCategory;   // 'relationship' | 'work' | 'social' | 'awkward'
  situation: string;             // 상황 설명 (1-2문장)
  question: string;              // "이럴 때 나는?"
  options: {
    id: string;                  // 'a', 'b', 'c', 'd'
    text: string;                // 반응 텍스트
    emoji: string;               // 반응 이모지
    tag: ReactionTag;            // 반응 유형 태그 (필수!)
  }[];
  personalityMapping?: {         // 성격 유형별 예상 반응 (통계용)
    [personalityType: string]: string;  // MBTI 등 -> optionId
  };
  tags: string[];                // 검색용 태그
}

type SituationCategory = 'relationship' | 'work' | 'social' | 'awkward';
type ReactionTag = 'cool' | 'emotional' | 'rational' | 'avoidant' |
                   'confrontational' | 'humorous' | 'caring' | 'passive';
```

**필수 규칙:**
- id 형식: `situation-reaction-{category}-{번호}` (category와 일치 필수!)
- 옵션 3-4개, 각 옵션에 tag 필수
- situation은 구체적이고 공감 가는 상황 (1-2문장)
- personalityMapping으로 MBTI/성격 유형과 연동 권장

**카테고리별 상황 예시:**
- `relationship`: 연애, 이별, 썸, 전애인
- `work`: 직장, 상사, 동료, 회의, 회식
- `social`: 친구 모임, SNS, 파티
- `awkward`: 어색한 순간, 민망한 상황

### 6. 토너먼트/월드컵 (Tournament)

```typescript
interface Tournament {
  id: string;                    // "{category}-worldcup-v{버전}"
  type: 'worldcup' | 'bracket';
  category: TournamentCategory;
  title: string;                 // "최애 고양이 품종 월드컵"
  subtitle: string;              // "16강"
  description: string;           // 설명
  emoji: string;                 // 대표 이모지
  themeColor: string;            // "bg-{color}-100"
  contestants: TournamentContestant[];
  roundSize: 4 | 8 | 16 | 32 | 64;
  status: 'draft' | 'active';
  createdAt: string;             // "YYYY-MM-DD"
  resultConfig: {
    showRanking: boolean;
    showWinRate: boolean;
    showSegmentComparison: boolean;
    shareMessage: string;        // "{winner}" 플레이스홀더 사용
  };
}

interface TournamentContestant {
  id: string;                    // 영문 kebab-case
  name: string;                  // 한글 이름
  emoji: string;                 // 이모지
  description: string;           // 1-2줄 설명
  tags?: string[];               // 분류 태그
  funFact?: string;              // 재미있는 사실 (결과 화면용)
}
```

**필수 규칙:**
- 참가자 수 ≥ roundSize
- 각 참가자 id 고유
- description 필수
- funFact 권장 (결과 화면 콘텐츠)

## 카테고리 목록

| 카테고리 | 설명 | 관련 테스트 |
|---------|------|------------|
| cat | 고양이 | cat, catBreed |
| dog | 강아지 | dog, dogBreed |
| rabbit | 토끼 | rabbit |
| hamster | 햄스터 | hamster |
| plant | 식물 | plant |
| love | 연애 | idealType, conflictStyle |
| personality | 성격 | human |
| lifestyle | 라이프스타일 | coffee, petMatch |
| food | 음식 | - |
| general | 일반 | - |

## 생성 프로세스 (3중 점검 체계)

```
[1단계] 생성 전 점검 → [2단계] 콘텐츠 생성 → [3단계] 생성 후 검증
                                                    ↓
                                              실패 시 수정 후 재검증
```

### 1단계: 생성 전 점검 (필수!)

#### 타입 정의 확인
```bash
# 새 콘텐츠 타입인 경우:
1. src/data/content/types.ts 확인
2. tags?: string[] 필드 있는지 확인
3. 없으면 타입 정의 먼저 수정!
```

#### 기존 데이터 참조
```bash
# 실제 서비스 데이터 확인
src/data/content/quizzes/      # 퀴즈
src/data/content/polls/        # 투표
src/data/content/types.ts      # 타입 정의

# 대시보드 샘플 (구조 참고용)
src/app/dashboard/data/content-samples.ts
src/app/dashboard/data/tournament-sample.ts
```

#### 기존 태그 확인 (일관성)
```bash
# 같은 카테고리의 기존 태그 패턴 확인
grep -h "tags:" src/data/content/quizzes/{category}*.ts
```

### 2단계: 콘텐츠 생성

#### 필수 체크 (생성 중)
- [ ] id 형식: `{category}-{type}-{번호}`
- [ ] **tags 3개 이상** (절대 누락 금지!)
- [ ] **첫 태그 = 카테고리명** (고양이, 강아지 등)
- [ ] 연령 등급 판단 (성인 주제면 meta 추가)
- [ ] 기존 태그와 일관성 유지

#### tags 필수 규칙
```typescript
// 반드시 포함:
tags: [
  '카테고리명',    // 첫 번째: 고양이, 강아지, 토끼 등
  '주제1',         // 두 번째: 행동, 건강, 음식 등
  '주제2',         // 세 번째: 구체적 키워드
  // 4-5개 권장
]

// 금지:
tags: []                    // 빈 배열 금지
tags: ['cat']               // 영문 금지
tags: ['퀴즈']              // 콘텐츠 유형 태그 금지
```

### 3단계: 생성 후 검증 (자동 실행)

```bash
# 1. 스크립트 검증
node scripts/validate-content-samples.mjs

# 2. 빌드 검증
npm run build

# 3. 에러 있으면 → 수정 후 재검증 (최대 3회)
```

#### 검증 실패 시
```
1회차 실패 → 에러 분석 후 수정
2회차 실패 → 다른 접근법 시도
3회차 실패 → 중단 + 사용자에게 보고
```

## 출력 위치

### 실제 서비스용 (ContentExplore에서 표시됨)
| 타입 | 파일 위치 |
|-----|----------|
| 퀴즈 | `src/data/content/quizzes/{category}.ts` |
| 투표 | `src/data/content/polls/vs-polls.ts`, `choice-polls.ts` |
| 상황별 반응 | `src/data/content/situation-reactions/{category}.ts` |

### 대시보드 샘플용 (문서화/검증용)
| 타입 | 파일 위치 |
|-----|----------|
| 샘플 | `src/app/dashboard/data/content-samples.ts` |
| 토너먼트 샘플 | `src/app/dashboard/data/tournament-sample.ts` |

## 연령 등급 (Age Rating)

콘텐츠 생성 시 **AI가 맥락을 판단**하여 적절한 연령 등급을 부여합니다.

### ⚠️ 핵심 원칙: 보수적 판정
```
애매하면 → all (10대 허용)
명백한 경우에만 → adult
```

**이유**:
- 10대 사용자가 많은 콘텐츠를 못 보면 안 됨
- 바이럴 잘 되는 콘텐츠가 차단되면 안 됨
- 과도한 필터링 = 사용자 경험 저하

### 등급 종류

| 등급 | 설명 | 예시 |
|------|------|------|
| `kids` | 10대에게 특히 적합 | 귀여운 동물 퀴즈, 학교 관련 |
| `all` (기본) | 모든 연령 적합 | **대부분의 콘텐츠** |
| `adult` | 성인 전용 (20세+) | **명백한** 성인 주제만 |

### 명백한 adult (이것만 차단)
- **성적 콘텐츠**: 부부 잠자리, 성인 연애 상황
- **직접적 음주**: 술 마시기, 취함, 숙취, 술자리
- **실제 도박**: 베팅, 판돈, 돈 거는 행위

### all로 유지 (대부분)
- 언어적 유사: 술래잡기, 와인딩, 칵테일 드레스
- 음식/미용: 막걸리 빵, 맥주효모 샴푸
- 회식 일반: 회식 참석, 회식 메뉴 (음주 언급 없음)
- 그레이존: "소주 vs 맥주 취향" → all (바이럴 잘 됨)

### 검수 상태 설정

**모호한 연령 제한이 필요한 콘텐츠는 검수 대기 상태로 생성:**

```typescript
{
  meta: {
    reviewStatus: 'pending',  // 검수 대기 (노출 안됨)
  }
}
```

| 상황 | reviewStatus | 노출 |
|------|-------------|------|
| 명확한 콘텐츠 | 생략 (자동 approved) | 즉시 |
| 연령 제한 모호 | `'pending'` | 인간 검수 후 |
| 명확한 19금 | `'approved'` + `isAdultOnly` | 즉시 (성인만) |

### meta 필드 추가 방법

```typescript
// 성인용 콘텐츠
{
  id: 'situation-reaction-work-003',
  question: '회식에서 상사가 술을 권한다',
  // ...
  meta: {
    ageRating: 'adult',
    ageRestrictionReason: 'alcohol'  // 'alcohol' | 'gambling'
  }
}

// 10대 친화 콘텐츠
{
  id: 'cat-quiz-cute-001',
  question: '고양이 발바닥 색깔은?',
  // ...
  meta: {
    ageRating: 'kids'  // 10대에게 30% 추천 점수 부스트
  }
}

// 일반 콘텐츠 (meta 생략 가능)
{
  id: 'cat-poll-001',
  question: '고양이 vs 강아지'
  // meta 없으면 기본 'all'
}
```

## 추천 시스템 (tags 필수!)

**중요**: 콘텐츠 100개 이상일 때 개인화 추천이 작동합니다.

### tags 작성 가이드

```typescript
// 좋은 예
tags: ['고양이', '품종', '성격', '입양']   // 구체적, 다양한 관점

// 나쁜 예
tags: ['cat']                              // 너무 적음, 영어
tags: ['퀴즈', '투표']                     // 콘텐츠 유형 (의미 없음)
```

### 태그 작성 규칙

| 규칙 | 설명 | 예시 |
|------|------|------|
| **최소 3개** | 추천 정확도 향상 | `['고양이', '건강', '간식', '치료']` |
| **한글 사용** | 일관성 유지 | `고양이` (O), `cat` (X) |
| **구체적** | 주제를 특정 | `아비시니안` (O), `동물` (X) |
| **다양한 관점** | 연관성 확장 | `['품종', '털', '성격', '입양']` |

### 카테고리별 권장 태그

| 카테고리 | 권장 태그 |
|---------|----------|
| `cat` | 품종, 성격, 건강, 간식, 행동, 역사 |
| `dog` | 품종, 훈련, 산책, 건강, 행동, 입양 |
| `lifestyle` | 취향, 습관, 음식, 음료, 계절, 날씨 |
| `love` | 연애, 성격, 소통, 갈등, 취향, MBTI |
| `personality` | 성격, 심리, 행동, 습관, 특성 |

### 태그 유사도로 추천 동작 방식

```
사용자가 '고양이 품종' 퀴즈 참여
    ↓
['고양이', '품종', '털', '성격'] 태그 기록
    ↓
유사 태그 가진 미참여 콘텐츠 우선 추천
    - 고양이 건강 퀴즈 (tags: ['고양이', '건강', '동물병원'])
    - 고양이 간식 투표 (tags: ['고양이', '간식', '먹이'])
```

## 품질 체크리스트

### 공통
- [ ] id 형식 정확
- [ ] category 유효
- [ ] 필수 필드 모두 있음
- [ ] **tags 3개 이상 (추천 시스템 필수!)**
- [ ] **연령 등급 적절 (성인 주제면 meta 추가)**
- [ ] 빌드 에러 없음
- [ ] 연령 제한 필요 시 meta 설정

### 퀴즈
- [ ] 정답 1개만 isCorrect: true
- [ ] explanation 있음
- [ ] tags 3개 이상 (필수!)

### 시나리오
- [ ] 점수 범위 연속
- [ ] 최대 점수 일치
- [ ] results 모두 도달 가능

### 투표
- [ ] VS는 정확히 2개 옵션
- [ ] choice는 3-5개 옵션

### 토너먼트
- [ ] contestants.length ≥ roundSize
- [ ] 중복 ID 없음
- [ ] description 모두 있음
