# 타입 시스템 및 Hydration 에러 수정 - 코드 리뷰

> 작성일: 2024-12-23
> 작성자: Claude (AI)
> 상태: **리뷰 요청**

---

## 1. 문제 요약

| 문제 | 증상 | 근본 원인 |
|------|------|----------|
| 타입 에러 반복 | `questions_deep` 접근 시 에러 | CHEMI_DATA 타입 미지정 |
| Hydration 에러 | SSR/CSR 불일치 | localStorage 초기값 차이 |
| condition 규칙 혼란 | `condition: {}`이 언제 허용되는지 불명확 | 문서와 실제 로직 불일치 |

---

## 2. 수정 내용

### 2.1 CHEMI_DATA 타입 단언 (index.ts)

**변경 전:**
```typescript
export const CHEMI_DATA = {
    human: HUMAN_DATA,
    cat: CAT_DATA,
    ...
};
```

**변경 후:**
```typescript
const _CHEMI_DATA = {
    human: HUMAN_DATA,
    cat: CAT_DATA,
    ...
};

// 타입 단언으로 통일 - 선택적 필드(questions_deep 등) 접근 시 타입 에러 방지
export const CHEMI_DATA = _CHEMI_DATA as unknown as Record<SubjectKey, SubjectData>;
```

**이유:**
- 각 데이터 파일이 타입 없이 리터럴로 정의됨
- TypeScript가 각 파일마다 다른 타입으로 추론
- `questions_deep` 같은 선택적 필드 접근 시 타입 에러 발생
- 모든 파일에 타입 추가는 과도한 작업 → 중앙에서 타입 단언으로 해결

---

### 2.2 TodayQuizPoll Hydration 수정

**변경 전:**
```typescript
const [participation, setParticipation] = useState(
  contentParticipationService.getParticipation()  // SSR에서 빈 값, CSR에서 localStorage 값
);
```

**변경 후:**
```typescript
const DEFAULT_PARTICIPATION = {
  quizzes: [],
  polls: [],
  stats: { totalQuizAnswered: 0, totalCorrect: 0, totalPollVoted: 0, lastParticipatedAt: null }
};

const [participation, setParticipation] = useState(DEFAULT_PARTICIPATION);
const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
  setParticipation(contentParticipationService.getParticipation());
}, []);

// 클라이언트에서만 조건부 렌더링
const hasActivity = isClient && (stats.totalQuizAnswered > 0 || ...);
```

**이유:**
- SSR에서 `contentParticipationService.getParticipation()` 호출 시 빈 값
- CSR에서 localStorage에서 값 로드
- 초기 HTML과 클라이언트 HTML 불일치 → Hydration 에러

---

### 2.3 CLAUDE.md 규칙 수정

**변경 전:**
```
- `condition: {}`은 사용 금지 - 완전 매칭 대상에서 제외됨
```

**변경 후:**
```
- `condition: {}`은 마지막 결과(폴백)에만 허용 - 완전/부분 매칭 실패 시 선택됨
```

**이유:**
- 실제 `matchResultLabel()` 로직 분석 결과:
  - 완전 매칭: `condition: {}` 스킵 (조건 개수 0)
  - 부분 매칭: `matchCount = 0`이므로 선택 안됨
  - 폴백: `resultLabels[resultLabels.length - 1]` 반환
- 따라서 `condition: {}`는 마지막 결과로 사용하면 "어디에도 해당 안됨" 케이스 처리 가능
- idealType.ts의 "밸런스 연인"이 이 패턴 사용 중

---

## 3. 추가 개선: 안 푼 콘텐츠 우선 표시

**TodayQuizPoll 로직 변경:**

```typescript
// Before: 날짜 기반 고정 선택
function getTodayQuiz(): KnowledgeQuiz | null {
  const dayIndex = ...;
  return ALL_QUIZZES[dayIndex % ALL_QUIZZES.length];
}

// After: 안 푼 것 우선, 날짜 기반 선택
function getTodayQuiz(answeredIds: string[]): KnowledgeQuiz | null {
  const unanswered = ALL_QUIZZES.filter(q => !answeredIds.includes(q.id));
  if (unanswered.length > 0) {
    const dayIndex = ...;
    return unanswered[dayIndex % unanswered.length];
  }
  return null;  // 모두 완료
}
```

---

## 4. 파일 변경 목록

| 파일 | 변경 내용 |
|------|----------|
| `src/data/index.ts` | CHEMI_DATA 타입 단언 추가 |
| `src/components/TodayQuizPoll.tsx` | Hydration 수정 + 안 푼 콘텐츠 우선 표시 |
| `CLAUDE.md` | condition 규칙 수정 (3곳) |

---

## 5. 리뷰 포인트

### 5.1 타입 단언 안전성

```typescript
export const CHEMI_DATA = _CHEMI_DATA as unknown as Record<SubjectKey, SubjectData>;
```

- `unknown`을 통한 강제 캐스팅은 타입 안전성을 일부 포기
- 대안: 각 데이터 파일에 `as SubjectData` 추가 (20+ 파일 수정 필요)
- 현재 방식이 실용적이지만, 데이터 파일에 오류가 있으면 런타임에서 발견됨

**질문**: 각 데이터 파일에 타입 명시를 추가하는 것이 나을까요?

### 5.2 Hydration 패턴 일관성

프로젝트 내 다른 컴포넌트들도 동일한 패턴 사용해야 할 수 있음:

```typescript
// 잠재적 문제가 있는 컴포넌트들
src/components/ContentExplore.tsx:1120  // useState(contentParticipationService...)
src/components/content/useContentParticipation.ts:71  // useState(() => service...)
```

**질문**: 이 컴포넌트들도 동일하게 수정해야 할까요?

### 5.3 condition 규칙 명확성

"마지막 결과에만 허용"이 validate-test-data.mjs에서 검증되는지 확인 필요

---

## 6. 테스트 체크리스트

```
[x] npm run build 성공
[ ] Hydration 에러 없이 페이지 로드 확인
[ ] 이미 푼 퀴즈/투표 대신 새 콘텐츠 표시 확인
[ ] 모든 퀴즈 완료 시 "퀴즈 마스터" 카드 표시 확인
[ ] 다른 타입 에러 없는지 전체 빌드로 확인
```

---

## 7. 빌드 결과

```
✅ npm run build 성공
✅ TypeScript 타입 에러 없음
⏳ Hydration 에러 테스트 필요 (브라우저 확인)
```
