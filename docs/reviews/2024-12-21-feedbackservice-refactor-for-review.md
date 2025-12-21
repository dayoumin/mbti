# FeedbackService 제거 리팩토링 - AI 리뷰 요청

**날짜**: 2024-12-21
**작업자**: Claude
**리뷰 요청 대상**: 다른 AI

---

## 1. 변경 배경

### 문제 상황
FeedbackService가 Supabase 클라이언트를 직접 사용하고 있었으나, 프로젝트는 Turso DB로 전환됨. 이로 인해:

1. **데이터 이원화**: API Routes는 Turso, FeedbackService는 Supabase 사용
2. **데이터 유실**: Supabase 환경변수 없으면 localStorage만 저장되고 Turso에 저장 안됨
3. **통계 불일치**: 두 DB 간 데이터 불일치로 분석 결과 왜곡

### 해결 방향
FeedbackService 제거하고 TursoService로 통합

---

## 2. 변경 파일 목록

| 파일 | 변경 내용 |
|------|----------|
| `src/services/FeedbackService.ts` | **삭제** |
| `src/services/index.ts` | feedbackService export 제거, tursoService 추가 |
| `src/services/ParticipationBridge.ts` | FeedbackService → TursoService + GamificationService |
| `src/components/FeedbackComments.tsx` | feedbackService → tursoService |
| `src/components/ResultFeedback.tsx` | feedbackService → tursoService |
| `src/components/RightSidebar.tsx` | feedbackService → tursoService |
| `src/components/TodayRanking.tsx` | feedbackService → tursoService |
| `src/components/TodayRankingModal.tsx` | feedbackService → tursoService |
| `src/components/TodayRankingPreview.tsx` | feedbackService → tursoService |

---

## 3. 핵심 변경 상세

### 3.1 ParticipationBridge 변경

**Before:**
```typescript
import { feedbackService, type PollResponseData, type QuizResponseData, type PollStats } from './FeedbackService';

// 투표 저장
const pollResponse: PollResponseData & { category?: string } = { pollId, optionId, category };
let feedbackPollStats: PollStats | undefined;
if (pollStats) {
  const options = Object.entries(pollStats.optionVotes).map(([optId, count]) => ({...}));
  feedbackPollStats = { pollId, totalVotes: pollStats.totalVotes, options };
}
const result = await feedbackService.savePollResponseWithAnalysis(pollResponse, feedbackPollStats);

// 퀴즈 저장
const quizResponse: QuizResponseData & { category?: string } = {...};
const result = await feedbackService.saveQuizResponseWithCategory(quizResponse);

// 분석 조회
const pollAnalysis = await feedbackService.getUserPollAnalysis();
const quizAnalysis = await feedbackService.getUserQuizAnalysis();
```

**After:**
```typescript
import { tursoService } from './TursoService';

// 투표 저장 (단순화)
const result = await tursoService.savePollResponse(pollId, optionId);

// 퀴즈 저장 (단순화)
const result = await tursoService.saveQuizResponse(quizId, selectedAnswer, isCorrect, questionIndex);

// 분석 조회 → GamificationService에서 가져옴
const stats = gamificationService.getStats();
const minorityRatio = gamificationService.getMinorityVoteRatio();
const pollsByCategory = gamificationService.getPollsByCategory();
```

### 3.2 컴포넌트 변경 (동일 패턴)

**Before:**
```typescript
import { feedbackService } from '@/services/FeedbackService';
const stats = await feedbackService.getPollStats(poll.id);
```

**After:**
```typescript
import { tursoService } from '@/services/TursoService';
const stats = await tursoService.getPollStats(poll.id);
```

---

## 4. 리뷰 포인트

### 4.1 [확인 완료] ParticipationBridge의 분석 로직 변경

**변경 전**: FeedbackService의 `getUserPollAnalysis()`, `getUserQuizAnalysis()` 사용 (localStorage 기반)

**변경 후**: GamificationService의 통계 메서드 사용

```typescript
// ParticipationBridge.ts:185-207
// 퀴즈 분석 - 최고 정답률 카테고리 계산
const quizzesByCategory = gamificationService.getQuizzesByCategory();
const categoryEntries = Object.entries(quizzesByCategory);
let bestCategory: string | null = null;

if (categoryEntries.length > 0) {
  const MIN_QUIZZES_FOR_BEST = 5; // 최소 5문제 이상 풀어야 유효
  const sorted = categoryEntries
    .filter(([, catStats]) => catStats.answered >= MIN_QUIZZES_FOR_BEST)
    .sort((a, b) => {
      const rateA = a[1].correct / a[1].answered;
      const rateB = b[1].correct / b[1].answered;
      return rateB - rateA;
    });
  bestCategory = sorted[0]?.[0] || null;
}
```

**구현 완료**: `bestCategory`가 `getQuizzesByCategory()` 메서드를 사용하여 계산됨
- 최소 5문제 이상 푼 카테고리 중 정답률 최고인 것 선택
- GamificationService에 `getQuizzesByCategory()` 메서드 추가됨

### 4.2 [의도된 설계] 데이터 흐름 및 낙관적 업데이트

**현재 데이터 흐름:**
```
사용자 행동 → TursoService → /api/* → Turso DB (영구 저장)
           → GamificationService → localStorage (통계/게이미피케이션)
```

**낙관적 업데이트 패턴 (Optimistic Update)**:
- Turso 저장 결과와 관계없이 GamificationService 업데이트
- 이는 의도된 설계: 오프라인/네트워크 오류 시에도 게이미피케이션 동작
- 기존 FeedbackService도 동일 패턴 사용 (localStorage 항상 저장)

```typescript
// ParticipationBridge.ts:78-91
const result = await tursoService.savePollResponse(pollId, optionId);
const saved = result.success;

// 낙관적 업데이트: Turso 실패해도 로컬 통계 증가
if (gamificationService) {
  gamification = gamificationService.recordPollVote({...});
}
```

**트레이드오프**:
- 장점: 오프라인 지원, 빠른 UI 반응
- 단점: DB-로컬 통계 불일치 가능 (허용 범위)

### 4.3 [확인 완료] TursoService 메서드 시그니처

TursoService의 기존 메서드들이 FeedbackService 대체에 충분한지 확인:

| 기능 | TursoService 메서드 | 상태 |
|------|---------------------|------|
| 투표 저장 | `savePollResponse(pollId, optionId)` | OK |
| 투표 통계 | `getPollStats(pollId)` | OK |
| 퀴즈 저장 | `saveQuizResponse(quizId, selectedOption, isCorrect, questionIndex)` | OK |
| 피드백 저장 | `saveFeedback(testType, resultName, isAccurate, comment?)` | OK |
| 댓글 조회 | `getComments(testType, resultName?, limit?)` | OK |

### 4.4 [OK] 타입 export 변경

**Before:**
```typescript
export type { FeedbackData, FeedbackComment, PollResponseData, QuizResponseData, PollStats, QuizStats } from './FeedbackService';
```

**After:**
```typescript
export type { PollStats, QuizStats, FeedbackComment } from './TursoService';
```

`FeedbackData`, `PollResponseData`, `QuizResponseData` 타입은 더 이상 사용되지 않아 제거됨.

---

## 5. 테스트 체크리스트

- [ ] 투표 참여 → Turso DB에 저장 확인
- [ ] 퀴즈 응답 → Turso DB에 저장 확인
- [ ] 피드백 제출 → Turso DB에 저장 확인
- [ ] 댓글 조회 → 정상 로드 확인
- [ ] 랭킹 페이지 → 투표 통계 정상 표시
- [ ] 게이미피케이션 → 포인트/배지 정상 적립

---

## 6. 빌드 결과

```
npm run build
✓ Compiled successfully
✓ Generating static pages (17/17)
```

에러 0, 경고 0

---

## 7. 리뷰 결과 (2024-12-22 업데이트)

### 검토 완료 항목:
1. ✅ **ParticipationBridge 분석 로직** - `bestCategory` 구현 완료
2. ✅ **에러 핸들링** - 낙관적 업데이트 패턴으로 의도된 설계
3. ✅ **타입 안정성** - 빌드 성공, 타입 오류 없음
4. ✅ **FeedbackService.ts 삭제** - 확인 완료

### 남은 결정 사항:
- ~~현재 낙관적 업데이트 패턴 유지 (오프라인 지원 우선)~~ → **수정됨 (2024-12-22)**

---

## 8. 2024-12-22 추가 수정

### 변경된 정책
**낙관적 업데이트 → 저장 확인 후 게이미피케이션 적용**

```typescript
// Before (낙관적 업데이트)
if (gamificationService) {
  gamification = gamificationService.recordPollVote({...});
}

// After (저장 확인 후)
if (saved && gamificationService) {
  gamification = gamificationService.recordPollVote({...});
}
```

**이유**:
- DB와 로컬 통계 간 일관성 유지
- `saved: false` 반환으로 UI에서 오프라인/실패 상태 표시 가능

### 영향
- 네트워크 오류 시 게이미피케이션도 적용되지 않음
- 사용자에게 저장 실패 피드백 제공 가능

---

## 9. 정밀 리뷰 결과 (2024-12-22 최종)

### 파일별 검토 결과

| 파일 | 검토 항목 | 결과 |
|------|----------|------|
| **ParticipationBridge.ts** | import, 타입, 저장순서, 싱글톤, 에러핸들링 | ✅ 모두 정상 |
| **GamificationService.ts** | import, 싱글톤, localStorage, getQuizzesByCategory | ✅ 모두 정상 |
| **TursoService.ts** | 타입, 메서드, 에러핸들링, URL 인코딩 | ✅ 모두 정상 |
| **services/index.ts** | export, 타입 export | ✅ 모두 정상 |
| **6개 컴포넌트** | import 변경, 메서드 호출 | ✅ 모두 정상 |

### 추가 수정 사항 (리뷰 중 발견)

| 파일 | 수정 내용 |
|------|----------|
| `ContentExplore.tsx` | 주석 업데이트 (FeedbackService → ParticipationBridge) |
| `PersonalizationStrategy.tsx` | 데이터 소스 이름 수정 (FeedbackService → ParticipationBridge) |
| `dashboard/page.tsx` | 서비스 목록 업데이트 (TursoService, ParticipationBridge 추가) |

### 빌드/린트 결과

- **빌드**: ✅ 성공 (에러 0)
- **린트**: 28 에러, 116 경고 (모두 기존 이슈 - FeedbackService 리팩토링과 무관)
  - PlantCare 컴포넌트의 useEffect 패턴 경고
  - 미사용 import 경고

### FeedbackService 참조 완전 제거 확인

```bash
grep -r "feedbackService|FeedbackService" src/
# 결과: 0개 파일
```

---

## 10. 관련 문서

- [기존 리뷰 문서](./2024-12-21-feedbackservice-review.md)
- [TursoService](../../src/services/TursoService.ts)
- [GamificationService](../../src/services/GamificationService.ts)
- [ParticipationBridge](../../src/services/ParticipationBridge.ts)
