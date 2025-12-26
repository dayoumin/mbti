---
name: content-validator
description: 퀴즈/투표/토너먼트 콘텐츠 검증. 생성된 콘텐츠의 품질 검사 및 문제점 발견.
allowed-tools: Read, Bash, Grep, Glob
---

# 콘텐츠 검증기 (Quiz/Poll/Tournament)

## 목적
생성된 퀴즈/투표/토너먼트 콘텐츠의 품질을 검증합니다.

## 검증 명령어

```bash
node scripts/validate-content-structure.mjs
```

## 검증 항목

### 0. 팩트 참조 검증 (팩트 필요 카테고리) ⚠️ 중요!

**팩트 필요 카테고리 기준:**
- 반려동물 (수의학/건강 정보)
- 식물 (식물학 정보)
- 식품/음료 (섭취 관련 정보)

→ 정확한 목록: `src/data/content/types.ts`의 `FactRequiredCategory` 참조

이 카테고리의 **지식 퀴즈**는 반드시 팩트 참조가 필요합니다.

#### 🔒 TypeScript 빌드 타임 강제

**source 필드가 TypeScript 타입에서 필수로 설정되어 있습니다!**

```typescript
// types.ts에서 팩트 필요 카테고리는 source 필수
interface FactRequiredKnowledgeQuiz {
  category: FactRequiredCategory;  // types.ts 참조
  source: string;                   // 필수! 없으면 빌드 에러
  // ...
}
```

**빌드 에러 예시:**
```
error TS2741: Property 'source' is missing in type '{ id: string; category: "cat"; ... }'
but required in type 'FactRequiredKnowledgeQuiz'.
```

→ 팩트 필요 카테고리 지식 퀴즈에 source 없으면 **빌드 자체가 안 됨!**

#### 검증 항목

| 항목 | 에러/경고 | 기준 |
|------|----------|------|
| source 누락 | **빌드 에러** | 팩트 필요 카테고리는 TypeScript 타입에서 필수 |
| factRef 형식 오류 | 에러 | `{category}-fact-{000}` 형식 |
| 팩트 파일 미존재 | 경고 | `research/facts/{category}.md` 권장 |

**검증 로직:**
```javascript
// FactRequiredCategory 목록은 types.ts에서 가져옴
// 지식 퀴즈(knowledge)만 팩트 검증
if (quiz.type === 'knowledge' && isFactRequiredCategory(quiz.category)) {
  if (!quiz.source && !quiz.factRef) {
    errors.push('팩트 필요 카테고리 지식 퀴즈는 source 또는 factRef 필수');
  }
}
```

**팩트 참조 방법:**
```typescript
// 방법 1: source 필드 (간단)
{
  id: 'cat-k-001',
  question: '고양이 정상 체온은?',
  source: 'cat-fact-001',  // 팩트 ID 직접 참조
}

// 방법 2: factRef 필드 (상세)
{
  id: 'cat-k-001',
  question: '고양이 정상 체온은?',
  factRef: {
    factId: 'cat-fact-001',
    verifiedDate: '2024-12-24'
  }
}
```

**검증 출력 형식:**
```
## 팩트 참조 검증

✅ cat-k-001: source='cat-fact-001' 참조됨
❌ cat-k-002: 팩트 필요 카테고리인데 source/factRef 없음
⚠️ dog-k-001: source='dog-fact-999' 팩트 파일에서 ID 미확인

=== 팩트 참조 요약 ===
팩트 필요 카테고리 퀴즈: 15개
- 팩트 참조 있음: 12개 ✅
- 팩트 참조 없음: 3개 ❌ (에러)
```

### 1. 공통 검증

| 항목 | 에러/경고 | 기준 |
|------|----------|------|
| id 누락 | 에러 | 필수 |
| id 중복 | 에러 | 고유해야 함 |
| category 유효성 | 에러 | 허용된 값만 |
| question/title 누락 | 에러 | 필수 |
| options 최소 개수 | 에러 | 2개 이상 |
| **tags 누락** | **에러** | **필수 (추천 시스템)** |
| **tags 개수 부족** | **경고** | **3개 이상 권장** |
| tags 영어 사용 | 경고 | 한글 권장 |

> **연령 등급**: 검증기는 키워드를 감지하지 않음. AI가 생성 시점에 맥락 판단하여 meta 추가. 자세한 규칙은 하단 "연령 등급" 섹션 참조.

### 2. 퀴즈 검증 (type: 'knowledge')

| 항목 | 에러/경고 | 기준 |
|------|----------|------|
| 정답 없음 | 에러 | isCorrect: true 1개 필수 |
| 정답 여러 개 | 에러 | isCorrect: true 1개만 |
| explanation 누락 | 경고 | 권장 |
| difficulty 범위 | 경고 | 1, 2, 3 중 하나 권장 |
| points 범위 | 경고 | 10, 15, 20 권장 |

### 2.5. ⚠️ 내용 정확성 검증 (2중 체크 - 지식 퀴즈 필수!)

**content-generator가 자체 점검한 후에도 content-validator가 다시 한번 검증합니다.**

#### 검증 항목

| 항목 | 확인 내용 | 발견 시 |
|------|----------|--------|
| **정답 오류** | 정답으로 표시된 선택지가 실제로 틀림 | 에러 + 즉시 수정 |
| **애매한 오답** | 오답이 사실 맞을 수도 있음 | 경고 + 검토 요청 |
| **설명 불일치** | explanation이 정답과 다른 내용 | 에러 + 수정 |
| **숫자/단위 오류** | 체온, 수명, 용량 등 수치 틀림 | 에러 + 수정 |
| **오타** | 맞춤법, 띄어쓰기 오류 | 경고 + 수정 |

#### 검증 방법

```
1. 퀴즈 파일 읽기 (src/data/content/quizzes/*.ts)
2. 각 지식 퀴즈의 정답 확인:
   - 팩트 파일(research/facts/{category}.md)과 대조
   - 의심되면 웹검색으로 재확인
3. 오류 발견 시 즉시 수정
```

#### 검증 출력 형식

```
## 내용 정확성 검증 (2중 체크)

✅ cat-k-001: 정답 "38-39°C" 확인됨 (cat-fact-001과 일치)
✅ cat-k-002: 정답 "양파/파류" 확인됨 (독성 정보 일치)
❌ cat-k-003: 정답 오류! "35-36°C"는 사람 체온
   → 수정: "38-39°C"로 변경
⚠️ dog-k-005: 애매한 오답 - "7년"이 틀린 건 맞지만 품종별 차이 언급 필요
   → 설명 보완 권장

=== 내용 검증 요약 ===
검증 퀴즈: 50개
- 정확: 47개 ✅
- 수정됨: 2개 🔧
- 검토 필요: 1개 ⚠️
```

#### 팩트 교차 검증

```typescript
// source가 있는 경우 팩트 파일과 대조
if (quiz.source && quiz.source !== 'general-knowledge') {
  // research/facts/{category}.md에서 해당 팩트 ID 찾기
  // 퀴즈 정답과 팩트 내용 일치 여부 확인
}
```

#### 2중 체크 흐름

```
┌─────────────────────────────────────────────────────┐
│ content-generator                                   │
│ ├─ 퀴즈 생성                                        │
│ ├─ 자체 점검 (1차)                                  │
│ │   ├─ 정답 확인                                   │
│ │   ├─ 팩트 파일 대조                              │
│ │   └─ 오타 점검                                   │
│ └─ 저장                                            │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ content-validator (2차 검증)                        │
│ ├─ 구조 검증 (기존)                                 │
│ ├─ 내용 정확성 검증 (2중 체크) ← 새로 추가!         │
│ │   ├─ 정답 재확인                                 │
│ │   ├─ 팩트 파일 대조                              │
│ │   ├─ 웹검색 확인 (의심 시)                       │
│ │   └─ 오류 시 즉시 수정                           │
│ └─ 최종 보고                                        │
└─────────────────────────────────────────────────────┘
```

### 3. 시나리오 퀴즈 검증

| 항목 | 에러/경고 | 기준 |
|------|----------|------|
| questions 최소 개수 | 에러 | 3개 이상 |
| results 최소 개수 | 에러 | 2개 이상 |
| 점수 범위 갭 | 경고 | 연속해야 함 |
| 최대 점수 불일치 | 경고 | 계산된 값과 일치해야 함 |
| 도달 불가 등급 | 에러 | 모든 등급 도달 가능해야 함 |

### 4. 투표 검증

| 항목 | 에러/경고 | 기준 |
|------|----------|------|
| VS 옵션 개수 | 에러 | 정확히 2개 |
| choice 옵션 개수 | 경고 | 3-5개 권장 |
| emoji 누락 | 경고 | 권장 |

### 5. 상황별 반응 투표 검증 (situation-reaction)

| 항목 | 에러/경고 | 기준 |
|------|----------|------|
| id 필수 | 에러 | 필수 |
| situation 누락 | 에러 | 필수 |
| category 누락 | 에러 | 필수, 'relationship'/'work'/'social'/'awkward' 중 하나 |
| id-category 불일치 | 에러 | id에 포함된 category와 category 필드 일치 필수 |
| 옵션 tag 누락 | 에러 | 각 옵션에 tag 필수 |
| personalityMapping 누락 | 경고 | 성격별 통계용 권장 |
| tags 누락 | 경고 | 검색용 권장 |

### 6. 토너먼트 검증

| 항목 | 에러/경고 | 기준 |
|------|----------|------|
| 참가자 부족 | 에러 | contestants.length ≥ roundSize |
| roundSize 유효성 | 에러 | 4, 8, 16, 32, 64 중 하나 |
| 중복 contestant id | 에러 | 모두 고유해야 함 |
| description 누락 | 경고 | 각 참가자에 권장 |
| funFact 누락 | 경고 | 결과 화면용 권장 |
| tags 누락 | 경고 | 필터/검색용 권장 |
| 여유 참가자 없음 | 경고 | roundSize보다 많이 권장 |

## 점수 범위 검증 로직

```javascript
// 시나리오 퀴즈 최대 점수 계산
const maxPossibleScore = scenario.questions.reduce((sum, q) => {
  const maxPoints = Math.max(...q.options.map(o => o.points));
  return sum + maxPoints;
}, 0);

// 점수 범위 연속성 검증
const sortedResults = [...scenario.results].sort((a, b) => a.minScore - b.minScore);
let prevMax = -1;
for (const result of sortedResults) {
  if (result.minScore !== prevMax + 1 && prevMax !== -1) {
    console.warn(`점수 범위 갭: ${prevMax} ~ ${result.minScore}`);
  }
  prevMax = result.maxScore;
}
```

## 검증 결과 형식

```
=== 콘텐츠 샘플 검증 결과 ===

✅ 퀴즈 10개 검증 완료
✅ 시나리오 퀴즈 1개 검증 완료
✅ VS 투표 10개 검증 완료
✅ 선택 투표 5개 검증 완료
✅ 토너먼트 1개 검증 완료

=== 요약 ===
총 콘텐츠: 27
유효: 27
무효: 0
경고 있음: 3

=== ⚠️ 경고 목록 ===
[quiz] cat-quiz-005: [ 'tags 권장' ]
[scenario] cat-scenario-butler: [ '최대 가능 점수(80)와 최고 등급 maxScore(75) 불일치' ]
[tournament] cat-breed-worldcup-v1: [ '참가자 수가 정확히 라운드 수와 같음 - 여유 참가자 추가 권장' ]

✨ 검증 완료!
```

## 에러 수정 가이드

### 정답 없음 (퀴즈)
```diff
options: [
  { id: 'a', text: '선택지 A', isCorrect: false },
- { id: 'b', text: '선택지 B', isCorrect: false },
+ { id: 'b', text: '선택지 B', isCorrect: true },
  { id: 'c', text: '선택지 C', isCorrect: false },
]
```

### 점수 범위 갭 (시나리오)
```diff
results: [
  { minScore: 0, maxScore: 20, grade: 'C', ... },
- { minScore: 25, maxScore: 40, grade: 'B', ... },  // 21-24 갭 발생
+ { minScore: 21, maxScore: 40, grade: 'B', ... },  // 연속
  { minScore: 41, maxScore: 60, grade: 'A', ... },
]
```

### 참가자 부족 (토너먼트)
```diff
// 16강인데 참가자 14명
roundSize: 16,
contestants: [
  // ... 14명
+ { id: 'extra-1', name: '추가 참가자 1', ... },
+ { id: 'extra-2', name: '추가 참가자 2', ... },
]
```

## 검증 스크립트 위치

```
scripts/validate-content-structure.mjs
```

## 자동 수정 지원

검증기는 문제점을 발견만 합니다. 수정은 content-generator 스킬 또는 수동으로 진행합니다.

## ⚠️ 재시도 제한 (필수!)

| 시도 | 결과 | 다음 행동 |
|------|------|----------|
| 1회차 | 실패 | 에러 분석 후 수정 |
| 2회차 | 실패 | 다른 접근법 시도 |
| 3회차 | 실패 | **즉시 중단 + 사용자에게 보고** |

**3회 실패 시 보고 형식:**
```
❌ 콘텐츠 검증 실패 (3회 시도)

## 해결 안 된 에러
- {에러 목록}

## 시도한 수정
1. {첫 번째 시도}
2. {두 번째 시도}
3. {세 번째 시도}

## 권장 조치
- {수동으로 확인해야 할 부분}
```

## 연령 제한 검증

콘텐츠의 연령 제한 설정이 적절한지 확인:

| 필드 | 확인 사항 |
|------|----------|
| `isAdultOnly` | 성인 전용 콘텐츠에 설정되어 있는지 |
| `minAge` | 연령 제한 필요 콘텐츠에 설정 |
| `isSensitive` | 민감 주제 표시 여부 |

**⚠️ 내용 기반 검증 (키워드 매칭 아님)**
- 단순 키워드 포함 여부로 판단하지 않음
- 콘텐츠의 실제 맥락과 의도를 파악하여 검증

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

**검증 기준 요약:**
- 19금 콘텐츠인가? → `isAdultOnly: true`
- 20대 이상만 공감 가능한가? → `minAge: '20s'`
- 논쟁적이거나 불편할 수 있는가? → `isSensitive`

## 체크리스트

### 검증 전
- [ ] 파일이 올바른 위치에 있음
- [ ] TypeScript 타입 에러 없음 (`npm run build`)

### 검증 후
- [ ] 에러 0개
- [ ] 경고 검토 및 가능하면 수정
- [ ] 연령 제한 설정 적절성 확인
- [ ] **시간 민감도 설정 적절성 확인**
- [ ] 다시 빌드 확인

## 시간 민감도 검증 (Time Sensitivity) - 필수!

**모든 콘텐츠에 `meta.timeSensitivity` 설정 필수!** (대시보드에서 만료 관리됨)

### 검증 항목

| 항목 | 에러/경고 | 기준 |
|------|----------|------|
| **timeSensitivity 누락** | **경고** | **모든 신규 콘텐츠에 필수** |
| sourceYear 누락 | **에러** | timeSensitivity 있는데 연도 없음 |
| sensitivity 무효 | 에러 | high/medium/low/none 중 하나 |
| validUntil 형식 | 에러 | YYYY-MM 형식이 아님 |
| 만료된 콘텐츠 | **경고** | validUntil이 현재 날짜 이전 |
| 검토 필요 | **경고** | 유효기간 6개월 이내 |

### 민감도 레벨 기준

| 레벨 | 유효기간 | 적용 콘텐츠 |
|------|---------|------------|
| `high` | 2년 | 축의금, 선물 가격, 연봉, 물가, 통계 수치 |
| `medium` | 3년 | 연예인/셀럽, MZ 인식, 선호도, 유행어, 트렌드 |
| `low` | 4년 | 밸런스게임, 상황별 반응, 에티켓 |
| `none` | 무기한 | 동물 지식, MBTI, 성격, 과학적 사실 |

### AI 검증 규칙 (자동 판단)

**콘텐츠별 sensitivity 자동 판단:**

| 조건 | sensitivity | 예시 |
|------|-------------|------|
| 금액/가격/연봉/물가 언급 | `high` | "평균 축의금", "시급" |
| 연예인/셀럽/인물 기반 | `medium` | "이상형 월드컵", "최애 연예인" |
| 트렌드/유행/MZ/밈 언급 | `medium` | "요즘 MZ는", "유행어" |
| 통계/조사 결과 기반 | `medium` | "00% 선호", "인기순위" |
| 상황 판단/밸런스게임 | `low` | "이럴 때 나는?", "A vs B" |
| 동물 지식/품종/건강 | `none` | "고양이 정상 체온", "품종 특성" |
| 성격/심리/MBTI | `none` | "당신의 성격은?" |

### 검증 출력 형식

```
## 시간 민감도 검증

✅ cat-quiz-001: sensitivity='none', sourceYear=2025 → 무기한 유효
✅ celebrity-worldcup-001: sensitivity='medium', sourceYear=2025 → 유효 (2028-12까지)
✅ money-quiz-001: sensitivity='high', sourceYear=2025 → 유효 (2027-12까지)
⚠️ new-poll-002: timeSensitivity 누락 → 신규 콘텐츠는 필수!
   권장: meta: { timeSensitivity: { sensitivity: 'low', sourceYear: 2025 } }
⚠️ trend-poll-001: 유효기간 임박 (2025-06까지, 검토 필요)
❌ money-quiz-003: 만료됨 (2024-12, 노출 중지됨)

=== 시간 민감도 요약 ===
전체 콘텐츠: 100개
- timeSensitivity 설정됨: 50개
  - 유효: 45개 ✅
  - 검토 필요: 3개 ⚠️
  - 만료됨: 2개 ❌
- timeSensitivity 미설정: 50개 (신규는 필수 추가!)
```

### 대시보드 연동

설정된 timeSensitivity는 **대시보드 > 콘텐츠 현황 > 유효기간 관리**에서:
- 유효/검토필요/만료됨 상태 표시
- 만료 임박 콘텐츠 알림
- 갱신 주기별 분포 확인

### 자동 수정 제안

만료된 콘텐츠 발견 시:
```
❌ money-quiz-003: 만료됨 (sourceYear: 2023, sensitivity: high)

권장 조치:
1. 최신 데이터로 업데이트 후 sourceYear 변경
2. 또는 콘텐츠 삭제/비활성화
```

## 연령 등급 (Age Rating)

### 2단계 검증

| 단계 | 담당 | 방식 |
|------|------|------|
| 1. 스크립트 | `validate-content-structure.mjs` | 형식만 체크 (키워드 감지 안 함) |
| 2. AI 검증 | content-validator 스킬 실행 시 | **맥락 기반** 성인 콘텐츠 체크 |

### AI 검증 규칙 (필수!)

#### ⚠️ 핵심 원칙: 보수적 판정
```
애매하면 → all (10대 허용)
명백한 경우에만 → adult
```

**이유**: 10대가 콘텐츠 못 보면 안 됨. 바이럴 콘텐츠 차단되면 안 됨.

#### 명백한 adult (이것만 지적)
- **성적 콘텐츠**: 부부 잠자리, 성인 연애 상황
- **직접적 음주**: 술 마시기, 취함, 숙취, 술자리
- **실제 도박**: 베팅, 판돈, 돈 거는 행위

```
⚠️ "회식에서 술을 마시자" → adult 필요 (직접 음주)
```

#### all로 유지 (대부분)
- 언어적 유사: 술래잡기, 와인딩, 칵테일 드레스
- 음식/미용: 막걸리 빵, 맥주효모
- 회식 일반: 회식 참석, 회식 메뉴
- **그레이존**: "소주 vs 맥주 취향" → all (바이럴 우선)

```
✅ "술래잡기에서 누가 술래?" → all (놀이)
✅ "소주 vs 맥주 어떤 게 좋아?" → all (가벼운 질문)
```

### meta 필드 형식
```typescript
// 성인용
meta: { ageRating: 'adult', ageRestrictionReason: 'alcohol' }

// 10대 친화
meta: { ageRating: 'kids' }

// 일반 (생략 가능)
// meta 없으면 기본 'all'
```

### AI 검증 출력 형식
```
## 연령 등급 검증

✅ cat-quiz-001: 일반 콘텐츠 (meta 불필요)
✅ cat-quiz-002: 일반 콘텐츠 (meta 불필요)
⚠️ situation-reaction-work-003: "회식 술자리" 맥락 → adult 필요
   현재: meta 없음
   권장: meta: { ageRating: 'adult', ageRestrictionReason: 'alcohol' }
✅ situation-reaction-social-001: "술래잡기" → 일반 콘텐츠 (오탐 아님)
```
