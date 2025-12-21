# FeedbackService 코드 리뷰

**날짜**: 2024-12-21
**대상 파일**: `src/services/FeedbackService.ts`

---

## 핵심 문제: Supabase vs Turso 이원화

### 현재 상태

| 레이어 | 사용 중인 DB | 비고 |
|--------|-------------|------|
| **API Routes** (`/api/poll`, `/api/quiz`, `/api/feedback`) | Turso | `@/lib/turso` 사용 |
| **FeedbackService.ts** | Supabase | `@supabase/supabase-js` 직접 사용 |
| **TursoService.ts** | Turso (API 호출) | `/api/*` 경유 |
| **useContentParticipation.ts** | TursoService | 올바른 구현 |
| **ParticipationBridge.ts** | FeedbackService | 잘못된 연결 |

### 데이터 흐름 충돌

```
실제 데이터 저장:
  useContentParticipation → tursoService → /api/poll → Turso DB ✅

ParticipationBridge 경유:
  recordPollVote → feedbackService.savePollResponseWithAnalysis
    → localStorage만 저장 (line 564-599) ❌
    → Supabase 환경변수 없으면 DB 저장 안됨

FeedbackService 직접 호출:
  savePollResponse → Supabase 시도
    → 환경변수 없음 → localStorage 저장 (line 248)
    → Turso에 저장 안됨 ❌
```

---

## 발견된 문제점

### 1. [Critical] DB 이원화로 데이터 유실

**FeedbackService**는 Supabase 클라이언트를 직접 사용:
```typescript
// FeedbackService.ts:12
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// FeedbackService.ts:86-106
function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // ...
}
```

**API Routes**는 Turso 사용:
```typescript
// api/poll/route.ts:11
import { query } from '@/lib/turso';
```

**결과**:
- Supabase 환경변수가 없으면 FeedbackService는 localStorage만 사용
- Turso DB에는 데이터가 저장되지 않음
- 통계 조회 시 Turso 데이터와 FeedbackService 분석 결과 불일치

### 2. [High] Supabase 오류 시 폴백 없음

```typescript
// FeedbackService.ts:125-152
async saveFeedback(data: FeedbackData): Promise<SaveResult> {
  if (!supabase) {
    return this.saveToLocalStorage('mbti_feedback', data);  // 환경변수 없을 때만 폴백
  }
  try {
    // Supabase 저장 시도
    if (error) throw error;
    return { success: true };
  } catch (error) {
    // ❌ 실패 시 localStorage 폴백 없음 - 데이터 유실
    return { success: false, error: (error as Error).message };
  }
}
```

**동일 패턴**: `savePollResponse` (line 244), `saveQuizResponse` (line 335)

### 3. [High] 퀴즈 응답 덮어쓰기

```typescript
// FeedbackService.ts:605-630
async saveQuizResponseWithCategory(data: QuizResponseData & { category?: string }) {
  const filtered = existing.filter(
    (r: { quizId?: string }) => r.quizId !== data.quizId  // ❌ quizId만 비교
  );
  filtered.push({ ...data });  // 마지막 응답만 남음
}
```

**문제**:
- 같은 `quizId`의 다른 `questionIndex` 응답도 덮어씀
- 여러 문항 퀴즈에서 마지막 문항만 저장됨
- `getUserQuizAnalysis()` 결과 왜곡

### 4. [Medium] 투표 변경 정책 불일치

| 저장소 | 재투표 정책 |
|--------|------------|
| localStorage (`savePollToLocalStorage`) | **덮어쓰기 허용** (line 428) |
| Supabase (`savePollResponse`) | **무시** - `ignoreDuplicates: true` (line 262) |
| Turso API | **무시** - `ON CONFLICT DO NOTHING` (api/poll/route.ts:102) |

사용자 경험이 환경에 따라 달라짐.

### 5. [Medium] 소수 의견 판정 오류

```typescript
// FeedbackService.ts:571-574
if (selectedOption) {
  isMinority = selectedOption.percentage < 30;  // 반올림된 값 비교
}
```

예: 실제 29.6% → 반올림 30% → 소수 의견 아님으로 판정

### 6. [Medium] 분석 함수가 Turso 무시

```typescript
// FeedbackService.ts:452-497
async getUserPollAnalysis(): Promise<PollParticipationAnalysis> {
  // localStorage만 조회
  const stored = this.getFromLocalStorage('mbti_poll_responses');
  // Turso 데이터 미사용
}
```

**동일 패턴**: `getUserQuizAnalysis` (line 506)

로그인/다중 디바이스 환경에서 분석 결과 0으로 나옴.

### 7. [Low] hasVoted의 .single() 문제

```typescript
// FeedbackService.ts:318-324
const { data, error } = await supabase
  .from('mbti_poll_responses')
  .select('id')
  .eq('device_id', getDeviceId())
  .eq('poll_id', pollId)
  .single();  // ❌ 중복 row 있으면 에러
```

중복 row 존재 시 에러 → catch에서 `false` 반환 → 중복 투표 허용 가능

---

## 올바르게 동작 중인 코드

### useContentParticipation.ts (모범 사례)

```typescript
// TursoService를 통해 API 호출
await tursoService.savePollResponse(poll.id, choice);
await tursoService.saveQuizResponse(quiz.id, optionId, isCorrect);

// 통계도 TursoService 경유
const stats = await tursoService.getPollStats(pollId);
```

이 패턴이 올바름. FeedbackService를 사용하지 않고 TursoService만 사용.

---

## 권장 조치

### Option A: FeedbackService 제거 (권장)

1. **TursoService 확장**: FeedbackService의 분석 기능을 TursoService로 이동
2. **ParticipationBridge 수정**: FeedbackService 대신 TursoService 사용
3. **FeedbackService 삭제**: 코드 단순화

### Option B: FeedbackService를 Turso 기반으로 리팩토링

1. Supabase 클라이언트 제거
2. TursoService 또는 `/api/*` 호출로 변경
3. localStorage 폴백 유지 (오프라인 지원)

### 공통 수정 필요

| 문제 | 수정 방법 |
|------|----------|
| 퀴즈 덮어쓰기 | `quizId + questionIndex` 복합키로 필터링 |
| 투표 변경 정책 | 프로젝트 정책 결정 후 통일 |
| 소수 의견 판정 | raw count 기반 계산으로 변경 |
| hasVoted | `.single()` → `.maybeSingle()` |

---

## 질문 (정책 결정 필요)

1. **투표/퀴즈 재응답 허용 여부**?
   - 현재: 불일치 (localStorage 허용, DB 거부)
   - 권장: 통일 (보통 1회만 허용)

2. **사용자 분석 범위**?
   - 현재: localStorage만 (디바이스 단위)
   - 필요 시: Turso 조회 추가 (로그인 사용자 통합)

---

## 수정 완료 (2024-12-21)

### 변경 사항

1. **FeedbackService 제거**
   - `src/services/FeedbackService.ts` 삭제
   - 모든 사용처를 TursoService로 전환

2. **수정된 파일**
   | 파일 | 변경 내용 |
   |------|----------|
   | `FeedbackComments.tsx` | `feedbackService` → `tursoService` |
   | `ResultFeedback.tsx` | `feedbackService` → `tursoService` |
   | `RightSidebar.tsx` | `feedbackService` → `tursoService` |
   | `TodayRanking.tsx` | `feedbackService` → `tursoService` |
   | `TodayRankingModal.tsx` | `feedbackService` → `tursoService` |
   | `TodayRankingPreview.tsx` | `feedbackService` → `tursoService` |
   | `ParticipationBridge.ts` | TursoService + GamificationService 사용 |
   | `services/index.ts` | FeedbackService export 제거, TursoService 추가 |

3. **데이터 흐름 통일**
   ```
   모든 투표/퀴즈/피드백 → TursoService → /api/* → Turso DB
   사용자 통계 → GamificationService (localStorage 기반)
   ```

### 빌드 결과
- 빌드 성공 (에러 0, 경고 0)

### 남은 정책 결정 사항
1. 투표/퀴즈 재응답 허용 여부 (현재: DB에서 거부)
2. 사용자 분석 범위 확장 필요 시 Turso API 추가 개발
