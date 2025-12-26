---
name: content-generator
description: 퀴즈/투표/토너먼트 콘텐츠 데이터 생성. 주어진 카테고리와 타입에 맞는 콘텐츠 생성 시 사용.
allowed-tools: Read, Write, Edit, Glob
---

# 콘텐츠 생성기 (Quiz/Poll/Reaction)

## 담당 범위

**이 스킬은 참여형/스낵 콘텐츠(3종)를 생성합니다:**

| 타입 | 설명 | 이 스킬 담당 |
|------|------|-------------|
| Test | 성향 테스트 (다차원) | ❌ → `신규 테스트 추가` 섹션 참조 |
| Matching | 궁합 테스트 | ❌ → `신규 테스트 추가` 섹션 참조 |
| **Quiz** | 지식 퀴즈 (정답 있음) | ✅ |
| **Poll** | 투표 (VS, 선택) | ✅ |
| **Reaction** | 상황별 반응 | ✅ |

> 전체 콘텐츠 분류는 CLAUDE.md "콘텐츠 타입 (5종)" 참조

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
- **팩트 필요 카테고리는 source 필수** (아래 참조)

### 팩트 필요 카테고리 (source 필수!)

**팩트 필요 카테고리 기준:**
- 반려동물 (수의학/건강 정보)
- 식물 (식물학 정보)
- 식품/음료 (섭취 관련 정보)

→ 정확한 목록: `src/data/content/types.ts`의 `FactRequiredCategory` 참조

이 카테고리의 **지식 퀴즈**는 TypeScript 타입에서 `source` 필드가 필수입니다.
빌드 시 source 없으면 **컴파일 에러** 발생!

```typescript
// ✅ 올바른 예 (팩트 필요 카테고리)
{
  id: 'cat-k-001',
  category: 'cat',        // 팩트 필요 카테고리
  question: '고양이 정상 체온은?',
  source: 'cat-fact-001', // 필수!
  // ...
}

// ✅ 팩트 파일이 없는 경우
{
  id: 'rabbit-k-001',
  category: 'rabbit',
  question: '토끼 행동의 의미는?',
  source: 'general-knowledge', // 팩트 파일 없으면 이렇게
  // ...
}

// ❌ 빌드 에러 (source 누락)
{
  id: 'cat-k-002',
  category: 'cat',
  question: '고양이 수염 역할은?',
  // source 없음 → 타입 에러!
}
```

**source 값 규칙:**
- 팩트 파일 있음: `{category}-fact-{번호}` (예: `cat-fact-001`)
- 팩트 파일 없음: `'general-knowledge'`
- 팩트 파일 위치: `research/facts/{category}.md`

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
  optionA: {
    id: 'a',
    text: string,
    emoji: string,
    insightTags?: InsightTags    // 인사이트 태그 (Stage 3+)
  };
  optionB: {
    id: 'b',
    text: string,
    emoji: string,
    insightTags?: InsightTags    // 인사이트 태그 (Stage 3+)
  };
  tags: string[];                // 2-3개
}
```

**필수 규칙:**
- 정확히 2개 선택지
- 질문에 "vs" 포함 권장
- 양쪽 다 매력적인 선택지

### InsightTags (인사이트용 태그)

**목적**: 사용자 선택에서 성향 분석 데이터 수집 (Stage 3-4)

```typescript
interface InsightTags {
  personality?: PersonalityTag[];   // 성격 태그
  decision?: DecisionTag[];         // 판단 스타일 태그
  relationship?: RelationshipTag[]; // 관계 패턴 태그
  interest?: InterestTag[];         // 관심사 태그 (Stage 4)
  lifestyle?: LifestyleTag[];       // 라이프스타일 태그 (Stage 4)
}
```

**태그 유효값 (SSOT: `src/data/insight/insight-tags.ts`)**

| 카테고리 | 유효 태그 |
|---------|----------|
| personality | `extroverted`, `introverted`, `logical`, `emotional`, `planned`, `spontaneous`, `structured`, `independent`, `supportive`, `expressive`, `reserved` 등 |
| decision | `practical`, `sentimental`, `adventurous`, `safe`, `cautious`, `solo`, `together`, `direct`, `indirect`, `present-focused`, `future-focused` |
| relationship | `competing`, `avoiding`, `accommodating`, `collaborating`, `compromising`, `close-bonding`, `space-needing`, `assertive`, `diplomatic` |
| interest | `interest-cat`, `interest-dog`, `interest-plant`, `interest-coffee`, `interest-love` 등 (category에서 자동 추가됨) |
| lifestyle | `active`, `homebody`, `frugal`, `splurger`, `morning-person`, `night-owl`, `creative`, `consuming` |

**insightTags 적용 대상:**
- love 카테고리: 필수! (연애 스타일 분석)
- lifestyle 카테고리: 권장 (성향 분석)
- 기타 카테고리: 선택 (관심사는 category에서 자동 추가)

**예시:**
```typescript
{
  id: 'vs-love-style-001',
  category: 'love',
  question: '연애 스타일은?',
  optionA: {
    id: 'a',
    text: '밀당 (설렘 중요)',
    emoji: '🎭',
    insightTags: { decision: ['indirect'], personality: ['emotional'] },
  },
  optionB: {
    id: 'b',
    text: '직진 (솔직함 중요)',
    emoji: '🚀',
    insightTags: { decision: ['direct', 'practical'] },
  },
  tags: ['love', 'relationship', '연애스타일'],
}
```

**주의:**
- 태그값은 반드시 insight-tags.ts에 정의된 값만 사용!
- 오타 입력 시 **컴파일 에러** 발생 (타입 강제)
- `interest-*` 태그는 category에서 자동 추가되므로 수동 입력 불필요

**insightTags 최소 3개 규칙 (인사이트 품질 보장):**
```typescript
// ✅ 올바른 예 (3개 이상)
insightTags: { decision: ['adventurous', 'sentimental'], personality: ['expressive'] }
insightTags: { personality: ['planned', 'structured'], lifestyle: ['morning-person'] }

// ❌ 경고 발생 (2개만)
insightTags: { decision: ['safe'], personality: ['reserved'] }  // 2개 → 경고

// 합산 기준:
// - 모든 카테고리의 태그를 합산하여 3개 이상
// - decision: 2개 + personality: 1개 = 3개 ✅
```

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
    tag: ReactionTag;            // 반응 유형 태그 (필수! → 자동 insightTags 변환)
    insightTags?: InsightTags;   // 추가 인사이트 태그 (선택, tag와 병합)
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

### ReactionTag → InsightTags 자동 매핑

**ReactionTag는 자동으로 InsightTags로 변환됩니다:**

| ReactionTag | 자동 매핑되는 InsightTags |
|-------------|--------------------------|
| `cool` | personality: reserved, resilient / decision: practical |
| `emotional` | personality: emotional, expressive, sensitive |
| `rational` | personality: logical, analytical / decision: practical |
| `avoidant` | relationship: avoiding / personality: reserved |
| `confrontational` | relationship: competing, assertive / decision: direct |
| `humorous` | personality: expressive / decision: indirect |
| `caring` | personality: supportive / relationship: accommodating, other-first |
| `passive` | relationship: accommodating / personality: reserved |

**추가 태그가 필요하면 insightTags 사용:**
```typescript
{
  id: 'a',
  text: '솔직하게 말한다',
  emoji: '😤',
  tag: 'confrontational',  // 자동: competing, assertive, direct
  insightTags: {
    decision: ['solo'],    // 추가: 혼자 결정 성향
  }
}
// 최종 태그: competing, assertive, direct, solo
```

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
src/app/dashboard/data/dashboard-content.ts
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
node scripts/validate-content-structure.mjs

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
| 샘플 | `src/app/dashboard/data/dashboard-content.ts` |
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

## 자체 점검 (생성 직후)

**생성 후 파일 저장 전 아래 체크리스트 확인:**

### 체크리스트

```
□ ID가 기존과 중복되지 않는가?
□ 정답이 실제로 맞는가?
□ 수치/단위가 정확한가?
□ 팩트 파일(source)과 일치하는가?
□ 오타가 없는가?
□ tags가 3개 이상인가?
```

### 오류 발견 시

즉시 수정 후 저장

### 빌드 검증

```bash
npm run build
```

**상세 검증은 content-auditor 에이전트가 담당** (2차 검증)

## index.ts 등록 (단일 등록 방식)

### 퀴즈 등록 (QUIZ_REGISTRY)

```typescript
// src/data/content/quizzes/index.ts
// 1. import 추가
import { {CATEGORY}_KNOWLEDGE_QUIZZES } from './{category}-knowledge';

// 2. QUIZ_REGISTRY에 한 줄 추가
const QUIZ_REGISTRY = {
  // 기존...
  {category}: {
    knowledge: {CATEGORY}_KNOWLEDGE_QUIZZES,
    scenario: {CATEGORY}_SCENARIO_QUIZZES,  // 있으면
  },
};

// 3. export 블록에 추가
export {
  // 기존...
  {CATEGORY}_KNOWLEDGE_QUIZZES,
};
```

### 투표 등록 (분리 시)

```typescript
// src/data/content/polls/index.ts
// 분리 전: vs-polls.ts에 직접 추가
// 분리 후: POLL_REGISTRY에 추가
```

## 완료 보고 형식

```
✅ {콘텐츠 유형} {N}개 생성 완료

## 생성된 콘텐츠
- {id-001}: {제목/질문}
- {id-002}: {제목/질문}
...

## 자체 검증 결과
- ID 중복: 없음 ✅
- 팩트 참조: {N}개 모두 참조됨 ✅
- 빌드: 성공 ✅
- 콘텐츠 검증: 에러 0, 경고 N개

## 저장 위치
- {파일 경로}

## index.ts 등록
- QUIZ_REGISTRY에 추가됨 ✅
```

## 품질 체크리스트

### 공통
- [ ] id 형식 정확
- [ ] **id 중복 없음 (기존 ID 확인 필수!)**
- [ ] category 유효
- [ ] 필수 필드 모두 있음
- [ ] **tags 3개 이상 (추천 시스템 필수!)**
- [ ] **연령 등급 적절 (성인 주제면 meta 추가)**
- [ ] **⚠️ timeSensitivity 필수! (모든 콘텐츠)**
- [ ] 빌드 에러 없음
- [ ] **index.ts에 등록됨**

## 시간 민감도 (Time Sensitivity) - 필수!

**모든 콘텐츠에 timeSensitivity 설정 필수!** (대시보드에서 만료 관리됨)

### 민감도 레벨

| 레벨 | 유효기간 | 예시 |
|------|---------|------|
| `high` | 2년 | 축의금 평균, 물가, 연봉, 금액/수치 기반 |
| `medium` | 3년 | 연예인, 유행어, MZ 인식, 선호도 조사, 트렌드 |
| `low` | 4년 | 밸런스게임, 상황별 반응, 에티켓 |
| `none` | 무기한 | 동물 지식, MBTI, 성격, 과학적 사실 |

### 자동 판단 규칙 (AI 필수!)

**콘텐츠 생성 시 아래 기준으로 자동 설정:**

| 조건 | sensitivity | 예시 |
|------|-------------|------|
| 금액/가격/연봉/물가 언급 | `high` | "평균 축의금", "시급" |
| 연예인/셀럽/인물 기반 | `medium` | "이상형 월드컵", "최애 연예인" |
| 트렌드/유행/MZ/밈 언급 | `medium` | "요즘 MZ는", "유행어" |
| 통계/조사 결과 기반 | `medium` | "00% 선호", "인기순위" |
| 상황 판단/밸런스게임 | `low` | "이럴 때 나는?", "A vs B" |
| 동물 지식/품종/건강 | `none` | "고양이 정상 체온", "품종 특성" |
| 성격/심리/MBTI | `none` | "당신의 성격은?" |

### 설정 방법

```typescript
// 모든 콘텐츠에 meta.timeSensitivity 추가!
{
  id: 'celebrity-worldcup-001',
  category: 'entertainment',
  question: '최애 연예인은?',
  meta: {
    timeSensitivity: {
      sensitivity: 'medium',   // 연예인 = medium
      sourceYear: 2025,        // 생성 연도
      // validUntil 자동계산: 2028-12
    }
  }
}
```

### sourceYear 규칙

- **항상 현재 연도 사용** (2025년이면 2025)
- 과거 데이터 기반이면 해당 연도 사용

### 대시보드 연동

설정된 timeSensitivity는 **대시보드 > 콘텐츠 현황 > 유효기간 관리**에서:
- 유효/검토필요/만료됨 상태 표시
- 만료 임박 콘텐츠 알림
- 갱신 주기별 분포 확인

### 퀴즈
- [ ] 정답 1개만 isCorrect: true
- [ ] explanation 있음
- [ ] tags 3개 이상 (필수!)
- [ ] **팩트 필요 카테고리는 source 있음**

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
