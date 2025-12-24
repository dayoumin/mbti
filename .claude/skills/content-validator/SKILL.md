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
node scripts/validate-content-samples.mjs
```

## 검증 항목

### 0. 팩트 참조 검증 (팩트 필요 카테고리) ⚠️ 중요!

**팩트 필요 카테고리**: `cat`, `dog`, `rabbit`, `hamster`, `plant`, `coffee`, `alcohol`

이 카테고리의 **지식 퀴즈**는 반드시 팩트 참조가 필요합니다.

| 항목 | 에러/경고 | 기준 |
|------|----------|------|
| source/factRef 누락 | **에러** | 팩트 필요 카테고리 지식 퀴즈는 팩트 참조 필수 |
| factRef 형식 오류 | 에러 | `{category}-fact-{000}` 형식 |
| 팩트 파일 미존재 | 경고 | `research/facts/{category}.md` 권장 |

**검증 로직:**
```javascript
const FACT_REQUIRED_CATEGORIES = ['cat', 'dog', 'rabbit', 'hamster', 'plant', 'coffee', 'alcohol'];

// 지식 퀴즈(knowledge)만 팩트 검증
if (quiz.type === 'knowledge' && FACT_REQUIRED_CATEGORIES.includes(quiz.category)) {
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
scripts/validate-content-samples.mjs
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
- [ ] 다시 빌드 확인

## 연령 등급 (Age Rating)

### 2단계 검증

| 단계 | 담당 | 방식 |
|------|------|------|
| 1. 스크립트 | `validate-content-samples.mjs` | 형식만 체크 (키워드 감지 안 함) |
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
