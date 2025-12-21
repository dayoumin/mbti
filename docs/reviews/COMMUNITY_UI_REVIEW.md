# 커뮤니티 UI 개선 - AI 리뷰 요청

## 개요
Reddit, X/Twitter, Discord, 에브리타임 패턴을 참고하여 커뮤니티 페이지 UI를 개선했습니다.

**작업자**: Claude Opus 4.5
**작업일**: 2025-12-21
**최종 커밋**: (리뷰 피드백 반영 후)

## 리뷰 피드백 반영 내역

| 이슈 | 심각도 | 해결 |
|------|--------|------|
| getTodayTopic 하이드레이션 불일치 | High | `useTodayTopic` 커스텀 훅으로 전환 (useEffect 내 계산) |
| randomBadge 빈 ID 에러 | Medium | optional chaining + fallback 추가 |
| HOT TOP3 정렬 성능 | Medium | 주석으로 확장성 고려사항 명시 (현재 데이터 규모에서는 OK) |

---

## 변경 사항 요약

### 1. 레이아웃 변경
- **Before**: 단일 컬럼, 게시물 목록만 표시
- **After**: 2단 레이아웃 (메인 콘텐츠 + 우측 사이드바)

```
┌─────────────────────────────────────────────────────┐
│ Header (검색 + 카테고리 필터)                        │
├─────────────────────────────────┬───────────────────┤
│ Main Content                    │ Sidebar (xl+)     │
│ ┌─────────────────────────────┐ │ ┌───────────────┐ │
│ │ EngagementBanner            │ │ │ HOT 게시물    │ │
│ │ (오늘의 토론 주제)           │ │ │ TOP3          │ │
│ └─────────────────────────────┘ │ ├───────────────┤ │
│ ┌─────────────────────────────┐ │ │ 활발한 유저   │ │
│ │ PostCard (리치 버전)        │ │ ├───────────────┤ │
│ │ - 아바타                     │ │ │ 인기 태그     │ │
│ │ - HOT 배지                   │ │ ├───────────────┤ │
│ │ - 테스트 결과 배지           │ │ │ 커뮤니티 통계 │ │
│ └─────────────────────────────┘ │ └───────────────┘ │
│ ...                             │                   │
└─────────────────────────────────┴───────────────────┘
```

### 2. 새로 추가된 컴포넌트

#### CommunitySidebar (L40-196)
```tsx
function CommunitySidebar({ posts }: { posts: typeof MOCK_COMMUNITY_POSTS }) {
  // HOT 게시물 TOP3 (좋아요 순 정렬)
  const hotPosts = useMemo(() => {
    return [...posts].sort((a, b) => b.likes - a.likes).slice(0, 3);
  }, [posts]);

  // 인기 태그 추출
  // 커뮤니티 통계 집계
  // ...
}
```

**포함 위젯**:
- HOT 게시물 TOP3 (좋아요 순)
- 활발한 유저 (Mock 데이터)
- 인기 태그 + 오늘의 토론 태그
- 커뮤니티 통계 (오늘 글, 좋아요, 댓글)

#### EngagementBanner (L201-227)
```tsx
function EngagementBanner() {
  const todayTopic = getTodayTopic(); // 날짜 기반 로테이션

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 ...">
      {/* 오늘의 토론 주제 + 참여하기 버튼 */}
    </div>
  );
}
```

**특징**:
- 매일 다른 주제 표시 (날짜 기반 인덱스 계산)
- 참여 유도 CTA 버튼

#### PostCard (L237-301)
```tsx
function PostCard({ post, onClick }: PostCardProps) {
  const isHot = post.likes >= 50 || post.comments >= 20;
  const randomBadge = testBadges[post.id.charCodeAt(post.id.length - 1) % testBadges.length];

  return (
    <button className="...">
      {isHot && <div>🔥 HOT</div>}
      {/* 아바타, 카테고리, 작성자, 통계, 테스트 배지 */}
    </button>
  );
}
```

**리치 요소**:
- 작성자 아바타 (이니셜 기반)
- HOT 배지 (likes >= 50 or comments >= 20)
- 테스트 결과 배지 (postId 기반 일관된 할당)

---

## 핵심 로직

### 1. 오늘의 주제 로테이션
```tsx
const getTodayTopic = () => {
  const today = new Date();
  const index = (today.getDate() + today.getMonth()) % DAILY_TOPICS.length;
  return DAILY_TOPICS[index];
};
```
- 날짜 + 월로 인덱스 계산
- 같은 날은 항상 같은 주제

### 2. HOT 판정 기준
```tsx
const isHot = post.likes >= 50 || post.comments >= 20;
```
- 좋아요 50개 이상 OR 댓글 20개 이상

### 3. 테스트 결과 배지 할당
```tsx
const randomBadge = testBadges[post.id.charCodeAt(post.id.length - 1) % testBadges.length];
```
- postId의 마지막 문자 charCode로 결정
- 같은 게시물은 항상 같은 배지

---

## 반응형 처리

| 화면 | 사이드바 | 레이아웃 |
|------|----------|----------|
| < xl (1280px) | 숨김 | 단일 컬럼 |
| >= xl | 표시 (w-80) | 2단 (flex gap-6) |

```tsx
// 사이드바
<aside className="hidden xl:block w-80 flex-shrink-0">
  <div className="sticky top-4 space-y-4">
    ...
  </div>
</aside>
```

---

## 리뷰 요청 포인트

### 1. 성능
- [ ] `useMemo` 사용이 적절한가?
- [ ] PostCard의 randomBadge 계산을 useMemo로 감싸야 하나?

### 2. 접근성
- [ ] 시맨틱 태그 사용이 적절한가? (`<section>`, `<aside>`)
- [ ] 키보드 네비게이션 고려가 필요한가?

### 3. 확장성
- [ ] 실제 API 연동 시 구조 변경이 필요한가?
- [ ] 페이지네이션/무한스크롤 추가 시 구조가 적합한가?

### 4. UX
- [ ] HOT 판정 기준(likes >= 50 or comments >= 20)이 적절한가?
- [ ] 테스트 배지 랜덤 할당 방식이 괜찮은가?

---

## 수정된 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/components/CommunityBoard.tsx` | 전면 재작성 (428줄) |
| `src/app/page.js` | 2단 레이아웃 래퍼 추가 |

---

## 테스트 결과

```
✅ getTodayTopic: 날짜 기반 로테이션 동작
✅ HOT 판정: 경계값 정확 (49/19 = false, 50/20 = true)
✅ HOT TOP3 정렬: 좋아요 내림차순
✅ 랜덤 배지: postId 기반 일관된 배지
✅ 통계 집계: reduce 정상
✅ 카테고리 필터링: all/개별 정상
✅ 빌드: 성공
```

---

## 참고한 UI 패턴

| 서비스 | 참고 요소 |
|--------|----------|
| Reddit | 사이드바 위젯 (규칙, 관련 커뮤니티, 20개 커스텀 위젯) |
| X/Twitter | 트렌딩 토픽, 커뮤니티 노트 |
| Discord | 포럼 채널 태그, 구조화된 토론 |
| 에브리타임 | 익명 커뮤니티, HOT 게시물 강조 |
