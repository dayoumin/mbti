# 관련 콘텐츠 시스템 설계 (v2)

## 목표

사용자가 퀴즈/투표/상황별 반응/테스트를 완료하면 **관련 콘텐츠 추천**을 보여주어 추가 참여를 유도한다.

## 현재 상태

| 콘텐츠 타입 | 관련 콘텐츠 | UI 표시 |
|------------|------------|---------|
| Quiz (지식 퀴즈) | ✅ 구현됨 (inline) | ✅ quiz 탭 |
| Poll (VS 투표) | ✅ 구현됨 (inline) | ✅ poll 탭 |
| SituationReaction | ❌ 없음 | ❌ 없음 |
| Test (심리/매칭) | NextTestRecommendation | ✅ 결과 페이지 |

### 문제점

1. **코드 중복**: PollCard, QuizCard에 동일한 관련 콘텐츠 로직 중복
2. **SituationReaction 미노출**: 데이터는 있지만 UI가 없음
3. **스타일/reason 누락 위험**: 공통화 시 타입별 스타일 유지 필요
4. **스크롤 제약**: 필터된 목록 내에서만 추천해야 스크롤 동작

---

## 설계

### 핵심 원칙

1. **RelatedContentSection**: 공통 UI 컴포넌트 (타입별 스타일 포함)
2. **필터 내 추천**: 현재 렌더된 목록 내에서만 추천 (스크롤 보장)
3. **기존 확장**: NextTestRecommendation 확장, 새 컴포넌트 최소화
4. **SituationReaction 통합**: poll 탭에 함께 표시

---

## 구현 계획

### Phase 1: RelatedContentSection 공통 컴포넌트

```typescript
// src/components/content/RelatedContentSection.tsx

interface RelatedItem {
  id: string;
  title: string;           // question, situation 등
  emoji?: string;
  category: string;
  reason?: string;         // "태그 일치: 축의금, 결혼"
}

interface RelatedContentSectionProps {
  items: RelatedItem[];
  onSelect: (id: string) => void;
  contentType: 'quiz' | 'poll' | 'situation';  // 타입별 스타일
  title?: string;           // "비슷한 퀴즈 3개 더보기"
  maxVisible?: number;      // 기본 3
}

// 타입별 스타일 매핑
const TYPE_STYLES = {
  quiz: { color: 'orange', icon: Lightbulb },
  poll: { color: 'purple', icon: Vote },
  situation: { color: 'blue', icon: MessageCircle },
};
```

### Phase 2: ContentRecommendationService 확장

```typescript
// 기존
getSimilarQuizzes(target, all, limit)
getSimilarPolls(target, all, limit)

// 추가
getSimilarSituationReactions(
  target: SituationReaction,
  all: SituationReaction[],
  limit: number
): RecommendationResult<SituationReaction>[]

// 유사도 계산: 태그 + SituationCategory 일치
```

### Phase 3: Quiz/Poll 카드 리팩토링

**Before (현재):**
```typescript
// QuizCard 내부에 ~40줄 관련 콘텐츠 로직
const relatedQuizzes = useMemo(() => { ... });
{showResult && relatedQuizzes.length > 0 && (
  <div className="mt-3">
    <button onClick={() => setShowRelated(!showRelated)}>...</button>
    {showRelated && relatedQuizzes.map(...)}
  </div>
)}
```

**After:**
```typescript
// QuizCard
{showResult && (
  <RelatedContentSection
    items={relatedQuizzes}
    onSelect={handleScrollTo}
    contentType="quiz"
  />
)}
```

### Phase 4: SituationReaction 통합

**옵션 A: Poll 탭에 통합** (권장)
- 투표와 상황별 반응을 하나의 탭에서 표시
- 기존 필터 UI 재사용
- SituationCategory → ContentCategory 매핑 필요

```typescript
// ContentExplore.tsx poll 탭
{activeTab === 'poll' && (
  <>
    {/* 기존 투표 */}
    {filteredPolls.map(poll => <PollCard ... />)}

    {/* 상황별 반응 (투표 형태로 표시) */}
    {filteredSituations.map(situation => (
      <SituationReactionCard
        situation={situation}
        allSituations={filteredSituations}
        answeredIds={participation.situations}
        onAnswer={handleSituationAnswer}
      />
    ))}
  </>
)}
```

**SituationCategory → ContentCategory 매핑:**
```typescript
const SITUATION_TO_CONTENT_CATEGORY = {
  relationship: 'love',      // 연애 카테고리
  work: 'lifestyle',         // 라이프스타일
  social: 'relationship',    // 관계 카테고리
  awkward: 'general',        // 일반
};
```

### Phase 5: NextTestRecommendation 확장

**현재:**
- 랜덤 또는 단순 추천

**확장:**
- 같은 카테고리 테스트 우선
- 완료하지 않은 테스트만
- "비슷한 테스트" 문구 추가

```typescript
// NextTestRecommendation 수정
interface Props {
  currentTestKey: SubjectKey;
  completedTests: SubjectKey[];
  // reason 표시 추가
}

// 추천 로직 개선
function getRelatedTests(current: SubjectKey, completed: SubjectKey[]) {
  const currentConfig = SUBJECT_CONFIG[current];
  const sameCategory = Object.entries(SUBJECT_CONFIG)
    .filter(([key, config]) =>
      config.category === currentConfig.category &&
      !completed.includes(key as SubjectKey)
    );
  return sameCategory.slice(0, 3);
}
```

---

## 데이터 흐름

### Quiz/Poll/Situation

```
ContentExplore
├── participation state (완료한 항목 관리)
├── filteredQuizzes/Polls/Situations (현재 필터된 목록)
│
├── QuizCard
│   ├── allQuizzes={filteredQuizzes}
│   ├── answeredIds={participation.quizzes}
│   └── <RelatedContentSection contentType="quiz" />
│
├── PollCard
│   └── <RelatedContentSection contentType="poll" />
│
└── SituationReactionCard (NEW)
    └── <RelatedContentSection contentType="situation" />
```

### Test 결과

```
page.js (결과 화면)
├── ResultCard
└── NextTestRecommendation (확장)
    ├── currentTestKey
    ├── completedTests
    └── 같은 카테고리 우선 추천
```

---

## 파일 변경 목록

| 파일 | 변경 |
|------|------|
| `src/components/content/RelatedContentSection.tsx` | **NEW** |
| `src/components/content/SituationReactionCard.tsx` | **NEW** |
| `src/services/ContentRecommendationService.ts` | SituationReaction 추가 |
| `src/components/ContentExplore.tsx` | 리팩토링 + Situation 통합 |
| `src/components/NextTestRecommendation.tsx` | 확장 (카테고리 기반) |
| `src/data/content/types.ts` | 매핑 함수 추가 (필요시) |

---

## 작업 순서

| 순서 | 작업 | 의존성 |
|------|------|--------|
| 1 | RelatedContentSection 공통 컴포넌트 | 없음 |
| 2 | ContentRecommendationService 확장 | 없음 |
| 3 | QuizCard, PollCard 리팩토링 | 1 |
| 4 | SituationReactionCard 생성 + poll 탭 통합 | 1, 2 |
| 5 | NextTestRecommendation 확장 | 없음 |
| 6 | 빌드 검증 | 전체 |

---

## 검증 항목

- [ ] 빌드 성공 (`npm run build`)
- [ ] Quiz 관련 콘텐츠 클릭 → 스크롤 이동
- [ ] Poll 관련 콘텐츠 클릭 → 스크롤 이동
- [ ] SituationReaction poll 탭에 표시
- [ ] SituationReaction 관련 콘텐츠 동작
- [ ] 테스트 결과에서 같은 카테고리 테스트 추천
- [ ] 완료한 콘텐츠는 추천에서 제외
- [ ] 타입별 스타일 (색상, 아이콘) 유지

---

## 리뷰 지적사항 해결

| 지적 | 해결 방안 |
|------|----------|
| SituationCategory ≠ ContentCategory | 매핑 함수로 변환 |
| SituationReaction UI 없음 | poll 탭에 통합 |
| 테스트 추천 중복 | NextTestRecommendation 확장 (새 컴포넌트 X) |
| 스타일/reason 누락 | RelatedItem에 reason 포함, 타입별 스타일 매핑 |
| 스크롤 대상 없음 | 필터된 목록 내에서만 추천 |
