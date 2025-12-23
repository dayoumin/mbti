# 메인 화면 UI 개선 - 코드 리뷰

> 작성일: 2024-12-23
> 작성자: Claude (AI)
> 상태: **리뷰 요청**

---

## 1. 변경 개요

### 목적
테스트 결과 화면에서 사용자의 다음 행동을 유도하는 UI 개선

### 핵심 변경
- ContentActions 컴포넌트를 2x2 그리드 카드 레이아웃으로 재설계
- 4개 액션 카드: 퀴즈, 투표, 친구 비교, 랭킹
- 결과 화면의 중복 버튼 제거 및 통합

---

## 2. 변경 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/components/ContentActions.tsx` | 전체 재작성 - 2x2 그리드 레이아웃, 새 props 추가 |
| `src/app/page.tsx` | ContentActions에 새 props 연결, 중복 버튼 제거, import 정리 |

---

## 3. ContentActions.tsx 변경 상세

### 3.1 Props 확장

```typescript
// Before
interface ContentActionsProps {
    testType: string;
    onQuizClick?: (category?: string) => void;
    onPollClick?: (category?: string) => void;
}

// After
interface ContentActionsProps {
    testType: string;
    onQuizClick?: (category?: string) => void;
    onPollClick?: (category?: string) => void;
    onCompareClick?: () => void;  // 신규
    onRankingClick?: () => void;  // 신규
}
```

### 3.2 레이아웃 변경

```
Before:                    After:
┌─────────┐ ┌─────────┐    ┌─────────┐ ┌─────────┐
│ 퀴즈    │ │ 투표    │    │ 퀴즈    │ │ 투표    │
└─────────┘ └─────────┘    ├─────────┤ ├─────────┤
                           │ 친구비교 │ │ 랭킹    │
                           └─────────┘ └─────────┘
```

### 3.3 카드 디자인

각 카드는 동일한 구조:
- 아이콘 + 라벨 헤더
- 설명 텍스트 (2줄 제한)
- 하단 메타 정보/화살표

색상 매핑:
- 퀴즈: indigo (파란색 계열)
- 투표: purple (보라색 계열)
- 친구 비교: amber (주황색 계열)
- 랭킹: emerald (초록색 계열)

---

## 4. page.tsx 변경 상세

### 4.1 중복 버튼 제거

```jsx
// 제거된 버튼들 (ContentActions로 통합)
<button onClick={() => openModal('ranking')}>내 순위 확인하기</button>
<button onClick={() => openModal('friendCompare')}>친구와 비교하기</button>
```

### 4.2 ContentActions 연결

```jsx
<ContentActions
    testType={mode}
    onQuizClick={() => { openModal('contentExplore'); setActiveNavTab('explore'); }}
    onPollClick={() => { openModal('contentExplore'); setActiveNavTab('explore'); }}
    onCompareClick={() => openModal('friendCompare')}  // 신규
    onRankingClick={() => openModal('ranking')}        // 신규
/>
```

### 4.3 Import 정리

```typescript
// Before
import { ..., Trophy, ArrowRight, Users, MessageSquare, ... } from 'lucide-react';

// After (Users 제거 - 더 이상 사용 안함)
import { ..., Trophy, ArrowRight, MessageSquare, ... } from 'lucide-react';
```

---

## 5. 리뷰 포인트

### 5.1 확인 필요 사항

| 항목 | 상태 | 비고 |
|------|------|------|
| 빌드 성공 | ✅ | `npm run build` 통과 |
| 타입 에러 | ✅ | 없음 |
| 카드 반응형 | ⚠️ | 모바일에서 2x2 그리드 확인 필요 |
| 접근성 | ⚠️ | 버튼 aria-label 확인 필요 |

### 5.2 개선 제안

1. **카드 크기 일관성**
   - 현재 `min-h-[2rem]`으로 설명 영역 고정
   - 긴 텍스트에서 레이아웃 깨짐 확인 필요

2. **조건부 렌더링 순서**
   - 퀴즈/투표 콘텐츠가 없을 때 친구비교/랭킹만 표시되면 그리드가 1행만 됨
   - 의도한 동작인지 확인 필요

3. **애니메이션**
   - 현재 hover 애니메이션만 있음
   - 카드 등장 애니메이션 추가 고려

---

## 6. 테스트 체크리스트

```
[ ] 테스트 완료 후 결과 화면에서 4개 카드 표시 확인
[ ] 각 카드 클릭 시 올바른 모달/화면 열림 확인
[ ] 모바일에서 2x2 그리드 레이아웃 확인
[ ] 퀴즈/투표 데이터 없는 테스트에서 카드 표시 확인
[ ] 공유 버튼(카드 저장, 카카오)이 상단에 유지되는지 확인
```

---

## 7. 관련 문서

- 기획 문서: [docs/reviews/2024-12-22-content-ux-redesign.md](2024-12-22-content-ux-redesign.md)
- 이전 코드 리뷰: [docs/reviews/2024-12-22-content-ux-code-review.md](2024-12-22-content-ux-code-review.md)

---

## 8. 빌드 결과

```
✅ npm run build 성공
✅ TypeScript 타입 에러 없음
⏳ E2E 테스트 미실행 (수동 확인 권장)
```
