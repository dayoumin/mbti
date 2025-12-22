# 퀴즈/투표 UX 개선 - 코드 리뷰 요청

> 작성일: 2024-12-22
> 작성자: Claude (AI)
> 상태: **자체 리뷰 완료, 외부 리뷰 대기**

---

## 1. 변경 개요

### 1.1 목적
- 퀴즈/투표 페이지의 "정보 과부하" 문제 해결
- "통계 비교" 중심으로 사용자 경험 개선
- 사용자가 원하는 것(안 푼 퀴즈)을 쉽게 찾을 수 있도록

### 1.2 핵심 인사이트
**학습이 아닌 "나와 다른 사람 비교"가 핵심 동기**
- 정답 맞히면 끝 → 정답 후 **다른 사람 분포** 강조
- 무한 스크롤 목록 → **핫 토픽/인기순** 먼저
- 참여 여부만 표시 → **몇 명 참여 + 결과 분포** 표시

### 1.3 변경 파일
| 파일 | 변경 내용 |
|------|----------|
| `src/components/ContentExplore.tsx` | 필터링, 통계 표시, 토글 UI, 스트릭/핫토픽/진행률 컴포넌트 |
| `src/services/ContentParticipationService.ts` | 스트릭 기능 추가 |
| `tests/e2e/content-explore.test.ts` | E2E 테스트 15개 추가 |

---

## 2. 주요 변경사항

### 2.1 "안 푼 것만 보기" 토글

**위치**: `ContentExplore.tsx` 750행, 1002-1024행

```typescript
// 상태 추가
const [showUncompletedOnly, setShowUncompletedOnly] = useState(false);

// 필터링 로직 (useMemo)
const filteredQuizzes = useMemo(() => {
  return ALL_KNOWLEDGE_QUIZZES.filter(q => {
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
    const isAnswered = participation.quizzes.some(pq => pq.quizId === q.id);
    const matchesCompletionFilter = !showUncompletedOnly || !isAnswered;
    return matchesCategory && matchesSearch && matchesCompletionFilter;
  });
}, [selectedCategory, searchQuery, showUncompletedOnly, participation.quizzes]);
```

**토글 UI (접근성 개선 완료)**:
```tsx
<button
  onClick={() => setShowUncompletedOnly(!showUncompletedOnly)}
  role="switch"
  aria-checked={showUncompletedOnly}
  aria-label="안 한 것만 보기"
  className={`flex items-center gap-2 px-3 py-1.5 rounded-full ...`}
>
  <div className="..." aria-hidden="true">
    <div className="..." /> {/* 토글 노브 */}
  </div>
  안 한 것만
</button>
```

**검증 완료**:
- [x] `useMemo` 의존성 배열 올바름
- [x] 필터링 로직 명확
- [x] 성능 이슈 없음 (퀴즈 24개, 투표 33개)
- [x] ARIA 속성 추가됨

---

### 2.2 퀴즈 통계 표시 (다른 사람들의 선택 분포)

**위치**: `ContentExplore.tsx` 404-437행

```typescript
{(() => {
  // 결정론적 mock 통계 (실제 API 연동 전)
  // hash를 한 번만 계산하여 재사용
  const CORRECT_BASE = 25;
  const CORRECT_RANGE = 30;
  const INCORRECT_BASE = 10;
  const INCORRECT_RANGE = 25;

  const hash = quiz.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const totalPercent = quiz.options.reduce((sum, o) => {
    return sum + (o.isCorrect ? CORRECT_BASE + (hash % CORRECT_RANGE) : INCORRECT_BASE + (hash % INCORRECT_RANGE));
  }, 0);

  return quiz.options.map((option) => {
    const basePercent = option.isCorrect
      ? CORRECT_BASE + (hash % CORRECT_RANGE)
      : INCORRECT_BASE + (hash % INCORRECT_RANGE);
    const percent = Math.round((basePercent / totalPercent) * 100);
    // ... 막대 렌더링
  });
})()}
```

**수정 완료**:
- [x] hash 중복 계산 → IIFE로 한 번만 계산
- [x] 매직 넘버 → 상수로 추출 (`CORRECT_BASE`, `CORRECT_RANGE` 등)

**남은 고려사항**:
- [ ] 실제 API 연동 시 이 코드 교체 필요
- [ ] 옵션 텍스트 없이 막대만 표시 → 어떤 옵션인지 알기 어려움?

---

### 2.3 투표 실제 통계 연동

**위치**: `ContentExplore.tsx` 509-526행

```typescript
useEffect(() => {
  if (voted && !realStats) {
    fetch(`/api/poll?pollId=${poll.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.totalVotes > 0) {
          const aOpt = data.options.find((o: { optionId: string }) => o.optionId === 'a');
          const bOpt = data.options.find((o: { optionId: string }) => o.optionId === 'b');
          setRealStats({
            a: aOpt?.percentage ?? 50,
            b: bOpt?.percentage ?? 50,
            total: data.totalVotes,
          });
        }
      })
      .catch(() => {/* 실패 시 fallback 유지 */});
  }
}, [voted, poll.id, realStats]);
```

**검증 완료**:
- [x] `realStats`가 의존성 배열에 포함되지만 `!realStats` 조건으로 1회만 실행 → 무한 루프 안전

**남은 고려사항**:
- [ ] 에러 처리가 단순 (콘솔 로그 없음) → 의도적 (fallback 유지)
- [ ] `totalVotes === 0`일 때 fallback 유지 → 의도적 (첫 투표자 경험)
- [ ] API 응답 타입 인터페이스 정의 권장

---

### 2.4 스트릭 배너 컴포넌트

**위치**: `ContentExplore.tsx` 48-102행

```typescript
function StreakBanner({ currentStreak, longestStreak, hasParticipatedToday }: StreakBannerProps) {
  if (currentStreak === 0 && !hasParticipatedToday) {
    return (/* "오늘 첫 참여를 시작하세요!" */);
  }
  return (/* "N일 연속 참여!" + 오늘 참여 완료 표시 */);
}
```

---

### 2.5 핫 토픽 섹션

**위치**: `ContentExplore.tsx` 152-222행

- 참여하지 않은 콘텐츠 중 인기순 3개 표시
- 인기도: ID 기반 결정론적 해시
- 퀴즈/투표 혼합

---

### 2.6 카테고리별 진행률

**위치**: `ContentExplore.tsx` 236-311행

- 각 카테고리별 완료/전체 개수 및 퍼센트 표시
- 100% 완료 시 "완료!" 배지
- 카테고리 클릭 시 해당 카테고리로 필터링

---

## 3. 코드 품질 평가

### 3.1 수정 완료 항목

| 항목 | 수정 전 | 수정 후 |
|------|---------|---------|
| hash 중복 계산 | `reduce` 내부에서 반복 | IIFE로 1회 계산 |
| 매직 넘버 | `25 + (hash % 30)` | `CORRECT_BASE + (hash % CORRECT_RANGE)` |
| 토글 접근성 | ARIA 없음 | `role="switch"`, `aria-checked`, `aria-label` 추가 |

### 3.2 성능

| 항목 | 상태 | 리스크 |
|------|------|--------|
| 필터링 | `useMemo`로 최적화 | 🟢 낮음 |
| API 호출 | 투표당 1회 (투표 후) | 🟢 낮음 |
| 퀴즈 통계 | IIFE 내 계산 | 🟢 낮음 |
| 스트릭/핫토픽 | 렌더링마다 계산 | 🟢 낮음 (데이터 적음) |

### 3.3 남은 개선 포인트

| 항목 | 우선순위 | 설명 |
|------|---------|------|
| API 응답 타입 | 🟡 중간 | `{ optionId: string }` 인라인 → 인터페이스 분리 |
| 퀴즈 옵션 텍스트 | 🟡 중간 | 막대만 표시 → 옵션 텍스트 추가 고려 |
| 퀴즈 실제 API | 🔴 높음 | mock 통계 → 실제 `/api/quiz` 호출 |

---

## 4. E2E 테스트 결과

```
15 passed (45.2s)

✅ "안 한 것만" 토글
  - 토글 표시
  - ARIA 속성 (role="switch", aria-checked, aria-label)
  - 상태 변경
  - 목록 필터링

✅ 퀴즈 통계
  - 정답 후 통계 막대 표시
  - 합계 100%

✅ 투표 통계
  - 탭 전환
  - 참여자 수 표시

✅ 기타
  - 카테고리 필터
  - 스트릭 배너
  - 핫 토픽 섹션
  - 카테고리별 진행률

✅ 접근성
  - 키보드 접근
  - aria-hidden 속성
```

**테스트 파일**: `tests/e2e/content-explore.test.ts`

---

## 5. 빌드 상태

```
✅ npm run build 성공
✅ 타입 에러 없음
✅ 린트 에러 없음
✅ E2E 테스트 15개 통과 (데스크탑)
```

---

## 6. 리뷰어에게

### 집중해서 봐주세요:
1. **전체적인 UX 흐름** - 사용자 관점에서 자연스러운지
2. **컴포넌트 구조** - ContentExplore.tsx가 너무 큰지 (1400줄+)
3. **스트릭 로직** - 날짜 계산이 정확한지

### 질문:
1. 퀴즈 통계에 옵션 텍스트도 표시해야 할까요?
2. ContentExplore.tsx를 분리해야 할까요? (StreakBanner, HotTopics, CategoryProgress)
3. 스트릭 끊김 알림을 추가해야 할까요?

---

## 7. 파일 위치 요약

```
src/components/ContentExplore.tsx     # 메인 컴포넌트 (1400줄+)
├── StreakBanner                      # 48-102행
├── HotTopicsSection                  # 152-222행
├── CategoryProgress                  # 236-311행
├── QuizCard                          # 317-441행
│   └── 통계 표시 (IIFE)              # 404-437행
├── PollCard                          # 489-610행
│   └── useEffect 통계 로딩           # 509-526행
└── ContentExplore (메인)             # 881-1186행
    ├── filteredQuizzes (useMemo)     # 1109-1117행
    ├── filteredPolls (useMemo)       # 1120-1128행
    └── 토글 UI                       # 1002-1024행

src/services/ContentParticipationService.ts  # 스트릭 데이터
tests/e2e/content-explore.test.ts            # E2E 테스트 15개
```

---

## 8. 다음 단계

| 항목 | 우선순위 | 상태 |
|------|---------|------|
| "안 푼 것만" 토글 | 높음 | ✅ 완료 |
| 퀴즈 통계 표시 | 높음 | ✅ 완료 (mock) |
| 투표 통계 연동 | 높음 | ✅ 완료 |
| 토글 접근성 | 중간 | ✅ 완료 |
| 스트릭 시스템 | 중간 | ✅ 완료 |
| 핫 토픽 섹션 | 중간 | ✅ 완료 |
| 카테고리 진행률 | 중간 | ✅ 완료 |
| 퀴즈 실제 API | 높음 | ⏳ 다음 |
| 컴포넌트 분리 | 낮음 | ⏳ 검토 필요 |
