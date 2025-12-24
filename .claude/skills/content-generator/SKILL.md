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

## 생성 프로세스

### 1단계: 카테고리 및 타입 확인
- 사용자 요청에서 카테고리 파악
- 생성할 콘텐츠 타입 결정

### 2단계: 기존 데이터 참조
```bash
# 실제 서비스 데이터 확인
src/data/content/quizzes/      # 퀴즈
src/data/content/polls/        # 투표
src/data/content/types.ts      # 타입 정의

# 대시보드 샘플 (구조 참고용)
src/app/dashboard/data/content-samples.ts
src/app/dashboard/data/tournament-sample.ts
```

### 3단계: 콘텐츠 생성
- 해당 타입의 구조에 맞게 생성
- ID 규칙 준수
- 필수 필드 모두 포함

### 4단계: 검증
```bash
node scripts/validate-content-samples.mjs
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

## 검수 상태 설정 (중요!)

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

## 연령 제한 설정 (ContentMeta)

콘텐츠 생성 시 연령 제한이 필요하면 `meta` 필드 추가:

```typescript
{
  // 콘텐츠 데이터...
  meta: {
    reviewStatus: 'pending',     // 모호한 경우 검수 대기
    isAdultOnly: true,           // 성인 전용 (19금만)
    minAge: '20s',               // 최소 연령 ('10s' | '20s' | '30s' | '40s+')
    allowedAges: ['20s', '30s'], // 허용 연령 목록
    isSensitive: true,           // 민감 주제
  }
}
```

**⚠️ 내용 기반 판단 (키워드 매칭 아님)**
- 콘텐츠의 실제 맥락과 의도를 파악하여 설정
- 단순 키워드 포함 여부로 판단하지 않음

**isAdultOnly 적용 기준 (엄격함):**
✅ 적용해야 함:
- 성적 내용, 야한 농담
- 부부 관계, 19금 주제
- 음주 행동/상태 묘사 ("취하면...", "술에 취해서...")

❌ 적용하지 않음:
- 소주 vs 맥주 (단순 선호 비교)
- 회식 참석 여부 (직장 상황)
- 술값 지출 비교 (소비 패턴)

**minAge 적용 기준:**
- 음주 관련 선호 → `minAge: '20s'`
- 직장/회식 맥락 → `minAge: '20s'`
- 연애/결혼 주제 → `minAge: '20s'`

**판단 기준 요약:**
- 19금 콘텐츠인가? → `isAdultOnly: true`
- 20대 이상만 공감 가능한가? → `minAge: '20s'`
- 논쟁적이거나 불편할 수 있는가? → `isSensitive`

## 품질 체크리스트

### 공통
- [ ] id 형식 정확
- [ ] category 유효
- [ ] 필수 필드 모두 있음
- [ ] 빌드 에러 없음
- [ ] 연령 제한 필요 시 meta 설정

### 퀴즈
- [ ] 정답 1개만 isCorrect: true
- [ ] explanation 있음
- [ ] tags 2개 이상

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
