# Stage 7 AI 종합 분석 리뷰 요청

## 변경 개요

Stage 7 "AI 종합 분석" 로직을 구현했습니다. Stage 1-6 데이터를 수집하여 종합 리포트를 생성합니다.

## 변경 파일

- `src/data/insight/stage7-ai-analysis.ts` - 신규 (Stage 7 로직)
- `src/services/InsightService.ts` - getStage7Insight() 추가
- `tests/stage7-test.ts` - 테스트 코드

## 주요 구현

### 1. 타입 구조

```typescript
// AI 분석 입력
interface AIAnalysisInput {
  activitySummary: { totalTests, totalPolls, totalQuizzes, totalActivities, activeDays };
  insights: { stage1~6: Summary | null };
  tagDistribution: Array<{ tag, count, percentage, category }>;
}

// AI 분석 결과
interface AIAnalysisResult {
  coreIdentity: string;           // 핵심 정체성 한 문장
  keyTraits: Array<5>;            // 5가지 핵심 특성
  strengths: Array<3>;            // 강점 분석
  growthAreas: Array<2>;          // 성장 포인트
  relationshipStyle: {...};       // 관계 스타일
  hiddenPotential: {...};         // 숨겨진 가능성
  personalizedAdvice: Array<3>;   // 맞춤 조언
  meta: { generatedAt, dataPoints, confidenceLevel };
}
```

### 2. 핵심 함수

| 함수 | 역할 |
|------|------|
| `generateSystemPrompt()` | AI용 시스템 프롬프트 생성 |
| `generateUserPrompt(input)` | AI용 사용자 프롬프트 생성 |
| `generateFallbackReport(input)` | AI 없이 폴백 리포트 생성 |
| `summarizeStage2~6Result()` | Stage별 데이터 요약 변환 |

### 3. InsightService 통합

```typescript
getStage7Insight(): AIAnalysisResult | null {
  if (!this.isStageUnlocked(6)) return null;

  const input = this.buildAIAnalysisInput();  // Stage 1-6 데이터 수집
  return generateFallbackReport(input);        // 현재는 폴백 사용
}
```

### 4. 신뢰도 레벨

```typescript
confidenceLevel:
  - 'high': totalActivities >= 30
  - 'medium': totalActivities >= 15
  - 'low': totalActivities < 15
```

## 리뷰 포인트

### 1. 폴백 리포트 품질 (Medium)

현재 AI 없이 `generateFallbackReport()`로 리포트 생성:
- 태그 기반 정적 매핑 (`getCoreIdentityFromTag`, `getTraitNameFromTag` 등)
- Stage 인사이트 데이터 활용
- 하드코딩된 조언 메시지

**질문**: 폴백 품질이 충분한가? AI 연동 전까지 사용 가능한 수준인가?

### 2. 태그 매핑 누락 (Low) - ✅ 수정 완료

모든 태그 매핑 함수 업데이트 완료:
- `getCoreIdentityFromTag()`: 관계/소통/성향 태그 + interest-* 패턴 처리 추가
- `getTraitNameFromTag()`: 관계 스타일(TKI), 친밀도/배려, 소통 스타일, 성향 태그 추가
- `getEmojiFromTag()`: 동일 카테고리 이모지 매핑 추가
- `getTraitDescriptionFromTag()`: 모든 태그에 대한 설명 추가

추가된 태그:
- 관계 스타일: collaborating, competing, avoiding, accommodating, compromising
- 친밀도/배려: close-bonding, space-needing, self-first, other-first
- 소통 스타일: assertive, diplomatic, expressive, reserved
- 성향: optimistic, pessimistic, analytical, creative
- 관심사: interest-* 패턴 동적 처리 (animal, food, travel, music, sports, game, art, nature)

### 3. activeDays 미구현 (Low)

```typescript
activitySummary: {
  // ...
  activeDays: 1,  // TODO: 실제 활동 일수 추적
}
```

현재 하드코딩. 시간 데이터 저장이 없어서 구현 불가.

**질문**: 활동 일수 추적을 위해 시간 기록을 추가해야 하나?

### 4. Stage 7 해금 조건 (Info)

현재 설계:
```typescript
// insight-system.ts
{ id: 7, unlockCondition: { type: 'paid', requiredStage: 6 } }

// InsightService.ts - 현재 구현
if (!this.isStageUnlocked(6)) return null;  // Stage 6만 체크, 유료 체크 없음
```

유료 체크는 별도 레이어(API/결제)에서 처리 예정.

### 5. 프롬프트 길이 (Info)

테스트 데이터 기준:
- 시스템 프롬프트: ~400자
- 사용자 프롬프트: ~860자

AI API 호출 시 토큰 효율성 고려 필요.

## 테스트 결과

```
npx tsx tests/stage7-test.ts
총 10개 테스트: ✅ 10 통과, ❌ 0 실패
```

## 빌드 결과

```
npm run build → ✅ 성공
```

## 관련 파일

- `src/data/insight/stage6-hidden-pattern.ts` - Stage 6 참고
- `src/app/dashboard/data/insight-system.ts` - Stage 7 설계
- `tests/stage7-test.ts` - 테스트 케이스
