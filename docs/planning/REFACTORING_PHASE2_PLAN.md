# Phase 2: ContentExplore.tsx 분리 계획

## 📊 현재 상태 분석

### 파일 구조
- **파일**: `src/components/ContentExplore.tsx`
- **총 라인 수**: 1,708줄
- **컴포넌트 개수**: 12개 (메인 1개 + 서브 11개)
- **탭 개수**: 3개 (Quiz, Poll, Community)

### 컴포넌트 목록

| # | 컴포넌트 | 라인 범위 | 라인 수 | 역할 |
|---|----------|----------|---------|------|
| 1 | StreakBanner | 67-127 | 60줄 | 스트릭 상태 배너 |
| 2 | HotTopicItem | 129-161 | 32줄 | 인기 토픽 아이템 |
| 3 | HotTopicsSection | 163-245 | 82줄 | 인기 토픽 섹션 |
| 4 | CategoryProgress | 247-343 | 96줄 | 카테고리별 진행률 |
| 5 | QuizCard | 345-566 | 221줄 | 퀴즈 카드 (답변 포함) |
| 6 | PollCard | 568-788 | 220줄 | 투표 카드 (투표 포함) |
| 7 | TipCard | 790-854 | 64줄 | 팁 카드 |
| 8 | QnACard | 856-913 | 57줄 | Q&A 카드 |
| 9 | DebateCard | 915-1013 | 98줄 | 토론 카드 |
| 10 | CommunityContent | 1015-1092 | 77줄 | 커뮤니티 탭 컨테이너 |
| 11 | ContentDiscoverySidebar | 1094-1193 | 99줄 | 디스커버리 사이드바 |
| 12 | ContentExplore (메인) | 1195-1708 | 513줄 | 메인 컨테이너 |

---

## 🎯 분리 전략

### 목표 구조

```
src/components/content/
├── ContentExplore.tsx              # 메인 (150줄 목표)
└── explore/
    ├── StreakBanner.tsx            # 60줄
    ├── HotTopicsSection.tsx        # 120줄 (HotTopicItem 포함)
    ├── CategoryProgress.tsx        # 100줄
    ├── QuizTab.tsx                 # 350줄 (QuizCard 포함)
    ├── PollTab.tsx                 # 350줄 (PollCard 포함)
    ├── CommunityTab.tsx            # 300줄 (TipCard, QnACard, DebateCard 포함)
    └── ContentDiscoverySidebar.tsx # 100줄
```

**총 7개 파일** (메인 제외 6개)

---

## 📝 상세 분리 계획

### 1. StreakBanner.tsx
**경로**: `src/components/content/explore/StreakBanner.tsx`

**Props**:
```typescript
interface StreakBannerProps {
  currentStreak: number;
  longestStreak: number;
  hasParticipatedToday: boolean;
}
```

**의존성**:
- `lucide-react`: Flame, Zap

**복잡도**: 낮음 (단순 표시 컴포넌트)

---

### 2. HotTopicsSection.tsx
**경로**: `src/components/content/explore/HotTopicsSection.tsx`

**내용**:
- HotTopicItem (내부 컴포넌트)
- HotTopicsSection (메인)

**Props**:
```typescript
interface HotTopicsSectionProps {
  quizzes: KnowledgeQuiz[];
  polls: VSPoll[];
  participation: ContentParticipationData | null;
  onQuizClick: (quizId: string) => void;
  onPollClick: (pollId: string) => void;
}
```

**로직**:
- 인기 퀴즈/투표 선정 (참여율 기준)
- 상위 5개 표시

**복잡도**: 중간

---

### 3. CategoryProgress.tsx
**경로**: `src/components/content/explore/CategoryProgress.tsx`

**Props**:
```typescript
interface CategoryProgressProps {
  quizzes: KnowledgeQuiz[];
  polls: VSPoll[];
  participation: ContentParticipationData | null;
  activeTab: 'quiz' | 'poll';
  onCategoryClick: (category: ContentCategory) => void;
}
```

**로직**:
- 카테고리별 참여 통계 계산
- 진행률 바 표시

**복잡도**: 중간

---

### 4. QuizTab.tsx
**경로**: `src/components/content/explore/QuizTab.tsx`

**내용**:
- QuizCard (퀴즈 카드 + 답변 로직)
- QuizTab (퀴즈 목록 + 필터링)

**Props**:
```typescript
interface QuizTabProps {
  quizzes: KnowledgeQuiz[];
  participation: ContentParticipationData | null;
  selectedCategory: ContentCategory | 'all';
  onAnswer: (quizId: string, userAnswer: string, isCorrect: boolean) => void;
  onNextAction?: (action: NextAction) => void;
}
```

**주요 기능**:
1. 퀴즈 필터링 (카테고리, 응답 여부)
2. QuizCard 컴포넌트 (221줄)
   - 답변 선택 UI
   - 정답 표시
   - 해설 표시
   - 다음 액션 추천
3. 관련 콘텐츠 추천

**복잡도**: 높음

---

### 5. PollTab.tsx
**경로**: `src/components/content/explore/PollTab.tsx`

**내용**:
- PollCard (투표 카드 + 투표 로직)
- PollTab (투표 목록 + 필터링)

**Props**:
```typescript
interface PollTabProps {
  polls: VSPoll[];
  participation: ContentParticipationData | null;
  selectedCategory: ContentCategory | 'all';
  onVote: (pollId: string, option: string) => void;
  onNextAction?: (action: NextAction) => void;
}
```

**주요 기능**:
1. 투표 필터링
2. PollCard 컴포넌트 (220줄)
   - 투표 선택 UI
   - 결과 표시 (바 차트)
   - 소수 의견 배지
   - 다음 액션 추천
3. 관련 콘텐츠 추천

**복잡도**: 높음

---

### 6. CommunityTab.tsx
**경로**: `src/components/content/explore/CommunityTab.tsx`

**내용**:
- TipCard (64줄)
- QnACard (57줄)
- DebateCard (98줄)
- CommunityContent (77줄)

**Props**:
```typescript
interface CommunityTabProps {
  tips: Tip[];
  questions: Question[];
  debates: Debate[];
  activeSubTab: 'tips' | 'qna' | 'debate';
  onSubTabChange: (tab: 'tips' | 'qna' | 'debate') => void;
  onNextAction?: (action: NextAction) => void;
}
```

**주요 기능**:
1. 서브 탭 관리 (Tips/Q&A/Debate)
2. 각 타입별 카드 컴포넌트
3. 댓글 시스템 통합

**복잡도**: 중간

---

### 7. ContentDiscoverySidebar.tsx
**경로**: `src/components/content/explore/ContentDiscoverySidebar.tsx`

**Props**:
```typescript
interface ContentDiscoverySidebarProps {
  onNavigate?: (target: string) => void;
  onStartTest?: (key: string) => void;
}
```

**주요 기능**:
- 추천 테스트 표시
- 랭킹/커뮤니티 링크
- 인기 토픽

**복잡도**: 낮음

---

### 8. ContentExplore.tsx (메인)
**경로**: `src/components/ContentExplore.tsx`

**역할**: 탭 관리 + 공통 상태 관리

**주요 로직**:
1. 탭 상태 (Quiz/Poll/Community)
2. 카테고리 필터 상태
3. 참여 데이터 로드
4. 이벤트 핸들러 통합

**목표 라인 수**: 150줄

---

## 🔄 마이그레이션 단계

### Step 1: 타입 정의 분리
**작업**:
- `src/components/content/explore/types.ts` 생성
- 공통 Props 인터페이스 정의

### Step 2: 유틸 함수 분리
**작업**:
- `src/components/content/explore/utils.ts` 생성
- `SITUATION_TO_CONTENT_CATEGORY` 등 상수 이동

### Step 3: 단순 컴포넌트 분리 (1-3)
**순서**:
1. StreakBanner.tsx
2. HotTopicsSection.tsx
3. ContentDiscoverySidebar.tsx

**검증**: 각 파일 생성 후 import 확인

### Step 4: 복잡 컴포넌트 분리 (4-6)
**순서**:
1. CategoryProgress.tsx
2. QuizTab.tsx (QuizCard 포함)
3. PollTab.tsx (PollCard 포함)
4. CommunityTab.tsx (3개 카드 포함)

**검증**: 각 파일 생성 후 기능 테스트

### Step 5: 메인 컴포넌트 정리
**작업**:
- ContentExplore.tsx에서 서브 컴포넌트 제거
- import문 정리
- 탭 라우팅 로직만 유지

**검증**: 전체 빌드 + 기능 테스트

---

## ✅ 검증 체크리스트

### 각 단계마다 실행

**빌드 테스트**:
```bash
npm run build
```

**파일 크기 확인**:
```bash
wc -l src/components/content/explore/*.tsx
```

**import 경로 검증**:
- 모든 import가 올바른지 확인
- 순환 참조 없는지 확인

### 최종 검증

**기능 테스트**:
1. [ ] 퀴즈 탭: 퀴즈 목록 표시, 답변 제출
2. [ ] 투표 탭: 투표 목록 표시, 투표 제출
3. [ ] 커뮤니티 탭: Tip/Q&A/Debate 표시
4. [ ] 스트릭 배너: 연속 참여 표시
5. [ ] 인기 토픽: 클릭 시 해당 콘텐츠로 이동
6. [ ] 카테고리 필터: 필터링 동작
7. [ ] 관련 콘텐츠: 추천 표시
8. [ ] 다음 액션: 추천 표시

**코드 품질**:
- [ ] 타입 에러 0개
- [ ] 빌드 성공
- [ ] 각 파일 300줄 이하 (QuizTab, PollTab, CommunityTab 제외)
- [ ] import 정리됨
- [ ] 주석 적절함

---

## 🚨 주의사항

### Props 전달 복잡도
**문제**: 깊은 Props drilling 발생 가능

**해결책**:
- 필요시 Context API 도입 고려
- 현재는 Props drilling 유지 (단순함)

### 상태 관리
**문제**: 여러 컴포넌트가 공통 상태 공유

**해결책**:
- ContentExplore에서 상태 관리
- 자식 컴포넌트는 Props로 받음

### 파일 크기
**목표**: 각 파일 200-350줄

**예외**:
- QuizTab, PollTab: 350줄까지 허용 (카드 포함)
- CommunityTab: 300줄까지 허용 (3개 카드 포함)

---

## 📅 예상 소요 시간

| 단계 | 작업 | 예상 시간 |
|------|------|----------|
| Step 1 | 타입/유틸 분리 | 30분 |
| Step 2 | 단순 컴포넌트 3개 | 1시간 |
| Step 3 | CategoryProgress | 30분 |
| Step 4 | QuizTab | 1시간 |
| Step 5 | PollTab | 1시간 |
| Step 6 | CommunityTab | 1시간 |
| Step 7 | 메인 정리 | 30분 |
| Step 8 | 테스트 | 30분 |
| **합계** | | **6-7시간** |

---

## 🎯 성공 기준

### Before/After 비교

| 지표 | Before | After | 목표 달성 |
|------|--------|-------|----------|
| 파일 개수 | 1개 | 8개 | ✅ |
| 메인 파일 크기 | 1,708줄 | ~150줄 | ✅ -91% |
| 최대 파일 크기 | 1,708줄 | ~350줄 | ✅ -80% |
| 평균 파일 크기 | 1,708줄 | ~215줄 | ✅ -87% |
| 빌드 성공 | ✅ | ✅ | ✅ |
| 기능 동작 | ✅ | ✅ | ✅ |

---

## 📝 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2025-12-27 | 1.0 | Phase 2 계획 수립 |
