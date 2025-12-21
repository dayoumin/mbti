# 커뮤니티 UI 개선 - 최종 리뷰 요청

## 작업 개요

| 항목 | 내용 |
|------|------|
| **작업자** | Claude Opus 4.5 |
| **작업일** | 2025-12-21 |
| **파일** | `src/components/CommunityBoard.tsx` (~830줄) |
| **참고 패턴** | Reddit, X/Twitter, Discord, 에브리타임 |

---

## 레이아웃 구조

```
┌──────────────────────────────────────────────────────┐
│ Header (검색 + 카테고리 필터)                         │
├──────────────────────────────────┬───────────────────┤
│ Main (flex-1)                    │ Sidebar (w-80)    │
│ ┌──────────────────────────────┐ │ ┌───────────────┐ │
│ │ EngagementBanner             │ │ │ HOT 게시물    │ │
│ │ 오늘의 토론 주제 + 스켈레톤   │ │ │ TOP3          │ │
│ └──────────────────────────────┘ │ ├───────────────┤ │
│ ┌──────────────────────────────┐ │ │ 활발한 유저   │ │
│ │ PostCard (리치 버전)         │ │ ├───────────────┤ │
│ │ - 아바타, HOT 배지            │ │ │ 인기 태그     │ │
│ │ - 테스트 결과 배지            │ │ ├───────────────┤ │
│ └──────────────────────────────┘ │ │ 커뮤니티 통계 │ │
│ ...                              │ └───────────────┘ │
├──────────────────────────────────┴───────────────────┤
│ FAB: 글쓰기 버튼 (모바일: 원형, PC: 텍스트 포함)      │
└──────────────────────────────────────────────────────┘
```

---

## 컴포넌트 구조

| 컴포넌트 | 역할 |
|----------|------|
| `useDebounce` | 검색어 debounce 훅 (300ms) |
| `useTodayTopic` | 하이드레이션 안전 + 플리커 방지 훅 |
| `CommunitySidebar` | 우측 사이드바 (HOT/유저/태그/통계) + 태그 클릭 필터링 |
| `PostDetailSidebar` | 게시글 상세 사이드바 + 준비 중 토스트 |
| `EngagementBanner` | 오늘의 토론 + 스켈레톤 UI |
| `PostCard` | 리치 게시물 카드 |
| `CommunityBoard` | 메인 컴포넌트 + 검색/필터링 |

---

## 핵심 로직

### 1. 검색 debounce

```tsx
// 검색 debounce 훅
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// 사용
const debouncedSearchQuery = useDebounce(searchQuery, 300);

const filteredPosts = useMemo(() => {
  // debouncedSearchQuery로 필터링
}, [activeCategory, debouncedSearchQuery]);
```

### 2. 하이드레이션 안전 + 플리커 방지

```tsx
function useTodayTopic() {
  const [topic, setTopic] = useState<typeof DAILY_TOPICS[0] | null>(null);

  useEffect(() => {
    const today = new Date();
    const index = (today.getDate() + today.getMonth()) % DAILY_TOPICS.length;
    setTopic(DAILY_TOPICS[index]);
  }, []);

  return topic;
}

// 스켈레톤으로 플리커 방지
if (!todayTopic) {
  return <div className="animate-pulse">...</div>;
}
```

### 3. 인기 태그 클릭 → 카테고리 필터

```tsx
// POST_CATEGORY_LABELS에서 동적 생성 (하드코딩 제거)
const tagToCategoryMap = useMemo(() => {
  return Object.fromEntries(
    Object.entries(POST_CATEGORY_LABELS).map(([key, label]) =>
      [`#${label.replace('/', '')}`, key]
    )
  ) as Record<string, PostCategory>;
}, []);

// 태그 클릭 시 카테고리 변경
<button onClick={() => {
  const category = tagToCategoryMap[tag];
  if (category) onCategoryChange(category);
}}>
```

### 4. 토스트 알림 (메모리 누수 방지)

```tsx
const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

const showToastMessage = (message: string) => {
  if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  setShowToast(message);
  toastTimerRef.current = setTimeout(() => {
    setShowToast(null);
    toastTimerRef.current = null;
  }, 2000);
};

// cleanup
useEffect(() => {
  return () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  };
}, []);

// 토스트 UI (role="status"만 사용 - aria-live 암시)
{showToast && (
  <div role="status" className="...">
    {showToast}
  </div>
)}
```

### 5. 빈 검색 결과 UX

```tsx
{filteredPosts.length === 0 && (
  <div className="...">
    <p>{debouncedSearchQuery.trim() ? '검색 결과가 없습니다' : '게시글이 없습니다'}</p>
    {debouncedSearchQuery.trim() && (
      <button onClick={() => setSearchQuery('')}>
        검색어 지우기
      </button>
    )}
  </div>
)}
```

---

## 적용된 개선 사항

| 이슈 | 심각도 | 해결 |
|------|--------|------|
| getTodayTopic 하이드레이션 | High | `useTodayTopic` 훅으로 전환 |
| useTodayTopic 플리커 | Medium | 초기값 `null` + 스켈레톤 UI |
| stats 날짜 계산 | High | `todayDateStr` useEffect 분리 |
| randomBadge 빈 ID | Medium | optional chaining + fallback |
| HOT TOP3 성능 | Medium | 주석으로 확장성 설명 |
| 글쓰기 버튼 접근성 | Low | `aria-label` 추가 |
| **검색 기능 미구현** | Medium | ✅ `searchQuery` 상태 + debounce 필터링 |
| **검색 debounce 없음** | Medium | ✅ `useDebounce` 훅 (300ms) |
| **빈 결과 UX** | Low | ✅ "검색 결과가 없습니다" + 검색어 지우기 버튼 |
| **인기 태그 클릭 없음** | Medium | ✅ `onCategoryChange` 콜백 (동적 매핑) |
| **팔로우/다른 글 보기 없음** | Low | ✅ "준비 중" 토스트 알림 |
| **토스트 메모리 누수** | Medium | ✅ `useRef` + cleanup |
| **토스트 접근성** | Low | ✅ `role="status"` 추가 |

---

## 테스트 결과

| 항목 | 결과 |
|------|------|
| 빌드 | ✅ 성공 |
| 하이드레이션 | ✅ 에러 없음 |
| 빈 ID 처리 | ✅ fallback 동작 |
| 스켈레톤 UI | ✅ 플리커 없음 |
| 반응형 | ✅ xl 브레이크포인트 동작 |
| 접근성 | ✅ aria-label, role="status" |
| 검색 debounce | ✅ 300ms 딜레이 동작 |
| 태그 클릭 | ✅ 카테고리 필터 연동 |
| 토스트 | ✅ 2초 후 자동 사라짐 |
| 메모리 누수 | ✅ cleanup 정상 |

---

## 검토 요청 포인트 (모두 해결됨)

### 1. 성능
- [x] 검색 debounce 추가 (300ms)
- [x] `useMemo` 적절히 사용

### 2. 접근성
- [x] 시맨틱 태그 사용 (`<aside>`, `<section>`, `<article>`)
- [x] 토스트 `role="status"` 추가

### 3. UX
- [x] 빈 검색 결과 시 안내 메시지
- [x] 검색어 지우기 버튼
- [x] 준비 중 기능 토스트 알림

---

## 참고 UI 패턴

| 서비스 | 참고 요소 |
|--------|----------|
| Reddit | 사이드바 위젯, HOT 게시물, 커뮤니티 통계 |
| X/Twitter | 트렌딩 토픽, 참여 유도 |
| Discord | 포럼 채널 태그, 관련 글 |
| 에브리타임 | 익명 커뮤니티, 인기 글 강조 |
