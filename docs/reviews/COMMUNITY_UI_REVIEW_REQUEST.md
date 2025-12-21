# 커뮤니티 UI 개선 - 검토 요청

## 작업 개요

| 항목 | 내용 |
|------|------|
| **작업자** | Claude Opus 4.5 |
| **작업일** | 2025-12-21 |
| **커밋** | 5e6a196 (초기), e9e4a89 (리뷰 반영) |
| **참고 패턴** | Reddit, X/Twitter, Discord, 에브리타임 |

---

## 변경 파일

| 파일 | 변경 내용 | 줄 수 |
|------|----------|-------|
| `src/components/CommunityBoard.tsx` | 전면 재작성 | ~530줄 |
| `src/app/page.js` | 2단 레이아웃 래퍼 추가 | 일부 |

---

## 주요 변경 사항

### 1. 레이아웃

**Before**: 단일 컬럼 (게시물 목록만)
**After**: 2단 레이아웃 (메인 + 우측 사이드바)

```
┌──────────────────────────────────────────────────────┐
│ Header (검색 + 카테고리 필터)                         │
├──────────────────────────────────┬───────────────────┤
│ Main (flex-1)                    │ Sidebar (w-80)    │
│ ┌──────────────────────────────┐ │ ┌───────────────┐ │
│ │ EngagementBanner             │ │ │ HOT 게시물    │ │
│ │ 오늘의 토론 주제              │ │ │ TOP3          │ │
│ └──────────────────────────────┘ │ ├───────────────┤ │
│ ┌──────────────────────────────┐ │ │ 활발한 유저   │ │
│ │ PostCard (리치 버전)         │ │ ├───────────────┤ │
│ │ - 아바타                      │ │ │ 인기 태그     │ │
│ │ - HOT 배지                    │ │ ├───────────────┤ │
│ │ - 테스트 결과 배지            │ │ │ 커뮤니티 통계 │ │
│ └──────────────────────────────┘ │ └───────────────┘ │
└──────────────────────────────────┴───────────────────┘
```

### 2. 새 컴포넌트

| 컴포넌트 | 역할 | 위치 |
|----------|------|------|
| `useTodayTopic` | 오늘의 주제 (하이드레이션 안전 + 플리커 방지) | L30-42 |
| `CommunitySidebar` | 우측 사이드바 (HOT/유저/태그/통계) | L56-228 |
| `PostDetailSidebar` | 게시글 상세 사이드바 | L233-451 |
| `EngagementBanner` | 오늘의 토론 주제 배너 (스켈레톤 포함) | L456-498 |
| `PostCard` | 리치 게시물 카드 | L503-558 |

### 3. 리뷰 피드백 반영

| 이슈 | 심각도 | 해결 |
|------|--------|------|
| getTodayTopic 하이드레이션 | High | `useTodayTopic` 훅으로 전환 (useEffect 내 계산) |
| useTodayTopic 플리커 | Medium | 초기값 `null` + 스켈레톤 UI로 플리커 방지 |
| stats 날짜 계산 | High | `todayDateStr` 상태 + useEffect로 분리 |
| randomBadge 빈 ID 에러 | Medium | `post.id?.length > 0` optional chaining + fallback |
| HOT TOP3 정렬 성능 | Medium | 주석으로 확장성 고려사항 명시 |

---

## 핵심 로직

### 1. 하이드레이션 안전한 날짜 계산 + 플리커 방지

```tsx
// useTodayTopic 훅 (하이드레이션 안전 + 플리커 방지)
function useTodayTopic() {
  const [topic, setTopic] = useState<typeof DAILY_TOPICS[0] | null>(null); // 초기값: null (로딩 중)

  useEffect(() => {
    // 클라이언트에서만 날짜 기반 계산
    const today = new Date();
    const index = (today.getDate() + today.getMonth()) % DAILY_TOPICS.length;
    setTopic(DAILY_TOPICS[index]);
  }, []);

  return topic; // null이면 아직 준비 안됨 → 스켈레톤 표시
}

// EngagementBanner에서 스켈레톤 처리
if (!todayTopic) {
  return <SkeletonBanner />; // 플리커 방지
}

// stats 날짜 계산
const [todayDateStr, setTodayDateStr] = useState<string>('');
useEffect(() => {
  setTodayDateStr(new Date().toISOString().split('T')[0]);
}, []);
```

### 2. 빈 ID 가드

```tsx
// Before: 에러 발생 가능
const randomBadge = testBadges[post.id.charCodeAt(post.id.length - 1) % testBadges.length];

// After: 안전
const badgeIndex = post.id?.length > 0
  ? post.id.charCodeAt(post.id.length - 1) % testBadges.length
  : 0;
const randomBadge = testBadges[badgeIndex];
```

### 3. HOT 판정 기준

```tsx
const isHot = post.likes >= 50 || post.comments >= 20;
```

### 4. HOT TOP3 정렬 (확장성 주석 포함)

```tsx
// HOT 게시물 (좋아요 순 TOP 3)
// 참고: 현재 Mock 데이터(~5개)에서는 full sort가 충분함
// 대규모 데이터(100+) 시 partial selection 또는 서버 사이드 정렬 권장
const hotPosts = useMemo(() => {
  return [...posts].sort((a, b) => b.likes - a.likes).slice(0, 3);
}, [posts]);
```

---

## 반응형 처리

| 화면 | 사이드바 | 글쓰기 버튼 |
|------|----------|-------------|
| < xl (1280px) | 숨김 (`hidden xl:block`) | FAB (원형) |
| >= xl | 표시 (w-80/w-72) | 텍스트 포함 버튼 |

```tsx
// 사이드바
<aside className="hidden xl:block w-80 flex-shrink-0">
  <div className="sticky top-4 space-y-4">...</div>
</aside>

// 글쓰기 버튼
<button className="fixed bottom-24 right-6 xl:bottom-6
  w-14 h-14 rounded-full
  xl:w-auto xl:h-auto xl:px-5 xl:py-3 xl:rounded-xl xl:gap-2">
  <PenSquare className="w-5 h-5" />
  <span className="hidden xl:inline text-sm font-bold">글쓰기</span>
</button>
```

---

## 검토 요청 포인트

### 1. 성능

- [ ] `useMemo` 사용이 적절한가? (hotPosts, relatedPosts, popularTags, stats)
- [ ] 대규모 데이터 시 추가 최적화 필요한가?

### 2. 접근성

- [ ] 시맨틱 태그 사용 적절한가? (`<aside>`, `<section>`, `<article>`)
- [ ] 키보드 네비게이션 추가 필요한가?
- [ ] ARIA 레이블 추가 필요한가?

### 3. UX

- [ ] HOT 기준 (likes >= 50 or comments >= 20) 적절한가?
- [ ] 테스트 배지 랜덤 할당 방식 괜찮은가?
- [ ] 게시글 상세 사이드바 정보 구성 적절한가?

### 4. 확장성

- [ ] 실제 API 연동 시 구조 변경 필요한가?
- [ ] 페이지네이션/무한스크롤 추가 시 구조 적합한가?
- [ ] 글쓰기 기능 연동 시 고려사항?

### 5. 코드 구조

- [ ] 컴포넌트 분리 적절한가? (5개 내부 컴포넌트)
- [ ] Props drilling 문제 없는가?
- [ ] 타입 정의 충분한가?

---

## 테스트 결과

| 항목 | 결과 |
|------|------|
| 빌드 | ✅ 성공 |
| 하이드레이션 | ✅ 에러 없음 (useEffect로 분리) |
| 빈 ID 처리 | ✅ fallback 적용 |
| 반응형 | ✅ xl 브레이크포인트 동작 |

---

## 참고 UI 패턴

| 서비스 | 참고 요소 |
|--------|----------|
| Reddit | 사이드바 위젯, HOT 게시물, 커뮤니티 통계 |
| X/Twitter | 트렌딩 토픽, 참여 유도 |
| Discord | 포럼 채널 태그, 관련 글 |
| 에브리타임 | 익명 커뮤니티, 인기 글 강조 |
