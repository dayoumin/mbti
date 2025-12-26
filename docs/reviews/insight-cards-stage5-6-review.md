# InsightCards Stage 5-6 UI 연동 리뷰 요청

## 변경 개요

InsightCards 컴포넌트에 Stage 5 (관계 패턴), Stage 6 (숨은 패턴) 카드 UI를 추가했습니다.

## 변경 파일

- `src/components/InsightCards.tsx`

## 주요 변경사항

### 1. 타입/import 추가
```typescript
import { Heart, Eye } from 'lucide-react';
import type { RelationshipPatternResult } from '@/data/insight/stage5-relationship-pattern';
import type { HiddenPatternResult } from '@/data/insight/stage6-hidden-pattern';
```

### 2. stageConfigs 확장
```typescript
const stageConfigs = [
  { stage: 1, title: '기본 성향', emoji: '🧠' },
  { stage: 2, title: '성격 조합', emoji: '🔗' },
  { stage: 3, title: '판단 스타일', emoji: '⚖️' },
  { stage: 4, title: '관심사 지도', emoji: '🗺️' },
  { stage: 5, title: '관계 패턴', emoji: '💕' },  // 신규
  { stage: 6, title: '숨은 패턴', emoji: '🔮' },  // 신규
];
```

### 3. Stage 5-6 인사이트 로드
```typescript
if (insightService.isStageUnlocked(5)) {
  setStage5Result(insightService.getStage5Insight());
}
if (insightService.isStageUnlocked(6)) {
  setStage6Result(insightService.getStage6Insight());
}
```

### 4. Stage5Card 컴포넌트
- 색상: rose-pink 그라디언트
- 아이콘: Heart
- 표시 정보:
  - 프로필명 (e.g., "따뜻한 연결자")
  - TKI 갈등 스타일 (e.g., "경쟁형")
  - 친밀도/배려 해석 뱃지

### 5. Stage6Card 컴포넌트
- 색상: violet-purple 그라디언트
- 아이콘: Eye
- 표시 정보:
  - 일관성 점수 (e.g., "일관성 75%")
  - 첫 번째 모순 패턴 (있을 경우)
  - 희귀 조합 뱃지 (최대 2개)

### 6. null 에러 처리 (중요!)
```typescript
// Stage가 해금되었는데 result가 null이면 버그 → 에러 표시
if (!result) {
  console.error('[Stage5Card] Result is null but stage is unlocked - data inconsistency');
  return (
    <div className="w-full bg-red-50 rounded-2xl p-4 border border-red-300">
      <div className="flex items-center gap-2 text-red-700">
        <span>⚠️</span>
        <span className="font-medium">Stage 5 데이터 오류</span>
      </div>
      <p className="text-sm text-red-600 mt-1">getStage5Insight() returned null</p>
    </div>
  );
}
```

## 리뷰 포인트

### 1. 에러 처리 방식
- 현재: null일 때 빨간 에러 카드 + console.error
- 대안: throw Error? 또는 Sentry 연동?
- 질문: 개발 중 에러 발견 목적으로 적절한가?

### 2. StageCard props 구조
- 현재: stage2Rules, stage3Result, stage4Result, stage5Result, stage6Result 개별 전달
- 대안: `stageResults: Record<number, unknown>` 같은 통합 구조?
- 질문: Stage 7 추가 시 props가 계속 늘어나는 문제

### 3. 컴포넌트 분리
- 현재: InsightCards.tsx 한 파일에 모든 StageCard 포함 (~700줄)
- 대안: `InsightCards/Stage1Card.tsx` 등 분리?
- 질문: 현재 규모에서 분리가 필요한가?

### 4. 색상 일관성
- Stage 1: purple-pink
- Stage 2: blue-purple
- Stage 3: amber-orange
- Stage 4: green-teal
- Stage 5: rose-pink
- Stage 6: violet-purple
- 질문: Stage 5의 rose-pink가 Stage 1의 purple-pink와 유사함

### 5. result 타입 체크
```typescript
// 이전 (문제)
{result?.profile.nameKr || '분석 중...'}

// 현재 (개선)
if (!result) { return <ErrorCard />; }
{result.profile.nameKr}
```
- 질문: Stage 3, 4도 동일 패턴 적용 필요?

## 테스트 결과

```
npx tsx tests/stage5-6-test.ts
총 15개 테스트: ✅ 15 통과, ❌ 0 실패
```

## 빌드 결과

```
npm run build → ✅ 성공
```

## 관련 파일

- `src/data/insight/stage5-relationship-pattern.ts` - Stage 5 로직
- `src/data/insight/stage6-hidden-pattern.ts` - Stage 6 로직
- `src/services/InsightService.ts` - getStage5Insight(), getStage6Insight()
- `tests/stage5-6-test.ts` - Stage 5-6 테스트
