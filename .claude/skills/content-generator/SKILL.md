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

### 5. 토너먼트/월드컵 (Tournament)

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
# 기존 샘플 확인
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

| 타입 | 파일 위치 |
|-----|----------|
| 퀴즈 | `src/app/dashboard/data/quizzes/{category}.ts` |
| 시나리오 | `src/app/dashboard/data/scenarios/{category}-{topic}.ts` |
| 투표 | `src/app/dashboard/data/polls/{category}.ts` |
| 토너먼트 | `src/app/dashboard/data/tournaments/{category}-{topic}.ts` |

## 품질 체크리스트

### 공통
- [ ] id 형식 정확
- [ ] category 유효
- [ ] 필수 필드 모두 있음
- [ ] 빌드 에러 없음

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
