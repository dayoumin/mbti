# 콘텐츠 현황 대시보드 코드 리뷰 요청

## 개요
콘텐츠 현황을 실시간으로 자동 집계하여 대시보드에서 확인할 수 있는 기능 추가

## 변경 파일 (3개)

### 1. ContentOverview.tsx (신규)
**위치**: `src/app/dashboard/components/ContentOverview.tsx`

**목적**:
- 모든 콘텐츠(퀴즈/투표/상황반응/운세) 개수를 실시간 자동 집계
- 카테고리별 분포 시각화
- 콘텐츠 추가 가이드 제공

**핵심 로직**:
```typescript
const stats = useMemo(() => {
  // 콘텐츠 타입별 통계 (퀴즈, 투표, 상황반응, 운세)
  const contentTypes = [
    { name: '퀴즈', count: ALL_KNOWLEDGE_QUIZZES.length + ALL_SCENARIO_QUIZZES.length + TAROT_QUIZZES.length, ... },
    { name: '투표', count: VS_POLLS.length + CHOICE_POLLS.length + TAROT_POLLS.length, ... },
    ...
  ];

  // 카테고리별 통계 (기존 QUIZ_STATS, POLL_STATS 활용)
  const categoryStats = Object.entries(CATEGORY_LABELS)
    .map(([cat, info]) => ({
      category,
      label: info.name,
      quizzes: knowledgeByCategory[category] + scenarioByCategory[category],
      polls: pollsByCategory[category],
      total: quizzes + polls,
    }))
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total);

  return { contentTypes, categoryStats, totalContent };
}, []);
```

**리뷰 포인트**:
1. `useMemo` 의존성 배열이 비어있음 - 데이터가 정적이므로 문제없지만 명시적으로 빈 배열 사용 의도 확인
2. 타로 퀴즈/투표를 별도 import하여 중복 카운트 가능성 검토
3. 카테고리별 통계에서 상황반응(situation-reactions)이 포함되지 않음

### 2. sidebar.tsx (수정)
**위치**: `src/app/dashboard/config/sidebar.tsx`

**변경점**:
- `Database` 아이콘 import 추가
- devtools 섹션에 `contentOverview` 메뉴 추가

```typescript
// 추가된 import
import { Database } from 'lucide-react';

// devtools 섹션 subTabs에 추가
{ key: 'contentOverview', label: '콘텐츠 현황', icon: <Database className="w-4 h-4" /> },
```

### 3. page.tsx (수정)
**위치**: `src/app/dashboard/page.tsx`

**변경점**:
- `ContentOverview` 컴포넌트 import
- 렌더링 조건 추가

```typescript
import ContentOverview from './components/ContentOverview';

// 렌더링
{activeCategory === 'devtools' && activeSubTab === 'contentOverview' && <ContentOverview />}
```

## 자동 반영 메커니즘

콘텐츠 추가 시 자동 반영되는 이유:
1. 각 콘텐츠 폴더의 `index.ts`에 레지스트리 패턴 사용
2. `ContentOverview`에서 이 레지스트리 배열을 직접 참조
3. 새 콘텐츠가 레지스트리에 등록되면 `.length`가 자동 업데이트

**예시 (polls/index.ts)**:
```typescript
const POLL_REGISTRY: VSPoll[][] = [
  VS_POLLS_DATA,
  KIDS_VS_POLLS,
  // 새 투표 추가 시 여기에 등록
];

export const VS_POLLS: VSPoll[] = POLL_REGISTRY.flat();
```

## 테스트 결과

```
1. 파일 존재 확인: ✅ 모두 존재
2. ContentOverview 검증:
   - useMemo 사용: ✅
   - 모든 콘텐츠 import: ✅
   - 통계 함수 사용: ✅
3. Sidebar 메뉴: ✅
4. 콘텐츠 개수:
   - Money Polls: 58개
   - Tarot Quizzes: 22개
   - Tarot Polls: 20개
5. 빌드: ✅ 성공
```

## 개선 제안 요청

1. **중복 카운트 문제**: 타로 퀴즈/투표가 별도 import되어 전체 통계에 중복 포함 가능성
2. **상황반응 미포함**: 카테고리별 통계에 situation-reactions 미반영
3. **확장성**: 새 콘텐츠 타입 추가 시 ContentOverview 수정 필요 - 자동화 가능?
4. **성능**: 대량 콘텐츠 시 filter/sort 비용 검토

## 질문

1. useMemo의 빈 의존성 배열이 적절한가?
2. 타로 데이터가 quizzes/polls의 통합 배열에 포함되어 있는지 확인 필요
3. 새 콘텐츠 타입 추가 시 더 자동화된 방법이 있는가?
