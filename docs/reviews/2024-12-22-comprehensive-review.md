# 서비스 레이어 종합 코드 리뷰

**날짜**: 2024-12-22
**리뷰 대상**: ParticipationBridge, RankingService, TursoService, GamificationService

---

## 1. 아키텍처 개요

```
사용자 행동
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  ParticipationBridge (투표/퀴즈 통합 처리)                    │
│  - TursoService 호출 (서버 저장)                              │
│  - saved === true 시에만 GamificationService 호출             │
└─────────────────────────────────────────────────────────────┘
    │                                    │
    ▼                                    ▼
┌─────────────────────┐    ┌─────────────────────────────────┐
│  TursoService       │    │  GamificationService            │
│  - /api/* 호출      │    │  - localStorage 기반            │
│  - Turso DB 저장    │    │  - 포인트/배지/스트릭 관리       │
└─────────────────────┘    └─────────────────────────────────┘
    │
    ▼
┌─────────────────────┐
│  Turso DB (서버)     │
└─────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  RankingService (랭킹 투표)                                  │
│  - localStorage 기반 (Turso 전환 예정)                       │
│  - 시즌별 투표 통계                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. ParticipationBridge.ts 리뷰

### 2.1 현재 상태: OK

| 항목 | 상태 | 설명 |
|------|------|------|
| FeedbackService 의존성 | 제거됨 | TursoService로 전환 완료 |
| 저장 실패 시 게이미피케이션 | 수정됨 | `saved === true`일 때만 적용 |
| JSDoc | 수정됨 | `questionIndex` 파라미터 추가 |

### 2.2 코드 분석

```typescript
// line 88: 저장 성공 시에만 게이미피케이션 적용 (수정됨)
if (saved && gamificationService) {
  gamification = gamificationService.recordPollVote({...});
}
```

### 2.3 잠재적 이슈

| 이슈 | 심각도 | 설명 |
|------|--------|------|
| 오프라인 지원 없음 | Low | 저장 실패 시 로컬 큐잉 없음, 나중에 재시도 불가 |

### 2.4 개선 제안 (향후)

```typescript
// 오프라인 지원 추가 시
if (!saved) {
  // 로컬 큐에 저장, 온라인 복귀 시 재시도
  offlineQueue.add({ type: 'poll', data: { pollId, optionId } });
}
```

---

## 3. RankingService.ts 리뷰

### 3.1 현재 상태: 개선됨

| 항목 | 상태 | 설명 |
|------|------|------|
| totalAllTimeVotes | 수정됨 | 전체 시즌 합계로 변경 |
| 과거 시즌 조회 | 추가됨 | `getSeasonSummaryById()`, `getAvailableSeasons()`, `getYearlyTrend()` |
| startDate optional | 수정됨 | event 시즌은 undefined 반환 |
| 시즌 정렬 | **수정됨 (3차)** | Q4 > Q3 > Q2 > Q1 > yearly > event 순 (내림차순) |
| getYearlyTrend | 개선됨 | `Promise.all()` 병렬 처리 |

### 3.2 시즌 정렬 수정 (2024-12-22)

```typescript
// Before (버그): priority(typeA) - priority(typeB) → Q1이 Q4보다 앞
// After (수정): priority(typeB) - priority(typeA) → Q4가 Q1보다 앞
const priority = (t: string) => {
  if (t.startsWith('Q')) return 10 + parseInt(t.replace('Q', ''), 10); // Q4=14, Q1=11
  if (t === 'yearly') return 5;
  return 0; // event
};
return priority(typeB) - priority(typeA); // 내림차순
```

### 3.3 잔여 이슈

| 이슈 | 심각도 | 설명 |
|------|--------|------|
| 레이스 컨디션 | Medium | localStorage read-modify-write 패턴 (Turso 전환 시 해결) |
| 이벤트 시즌 ID 고정 | Low | `${year}-event-current` 형태 (다중 이벤트 필요 시 수정) |
| 투표 ID 충돌 가능성 | Low | `Date.now()` + 짧은 랜덤 (확률 낮음) |

### 3.3 getSeasonStartDate 일관성

```typescript
// getSeasonSummary()에서 사용 (line 387)
startDate: this.getSeasonStartDate(seasonType),  // 현재 시점 기준

// getSeasonSummaryById()에서 사용 (line 474)
startDate: this.getSeasonStartDateFromId(seasonId),  // seasonId 기준
```

두 메서드가 다른 유틸리티 사용 - 의도된 설계 (현재 시즌 vs 과거 시즌)

---

## 4. TursoService.ts 리뷰

### 4.1 현재 상태: OK

| 항목 | 상태 | 설명 |
|------|------|------|
| API 호출 | 안정적 | 모든 에러 catch, 실패 시 기본값 반환 |
| 타입 안전성 | OK | 명확한 인터페이스 정의 |
| deviceId 관리 | OK | 공통 유틸리티 사용 |

### 4.2 API 메서드 목록

| 메서드 | 용도 |
|--------|------|
| `savePollResponse()` | 투표 저장 |
| `getPollStats()` | 투표 통계 조회 |
| `saveQuizResponse()` | 퀴즈 응답 저장 |
| `getQuizStats()` | 퀴즈 통계 조회 |
| `saveFeedback()` | 피드백 저장 |
| `getComments()` | 댓글 조회 |
| `addComment()` | 댓글 작성 |
| `toggleLike()` | 좋아요 토글 |

### 4.3 잠재적 이슈

| 이슈 | 심각도 | 설명 |
|------|--------|------|
| points 파라미터 미사용 | Info | `saveQuizResponse`의 points가 기본값 0 |
| 재시도 로직 없음 | Low | 네트워크 오류 시 단순 실패 반환 |

---

## 5. GamificationService.ts 리뷰

### 5.1 현재 상태: OK

| 항목 | 상태 | 설명 |
|------|------|------|
| 통계 추적 | 완전함 | 퀴즈, 투표, 테스트, 커뮤니티, 대결 |
| 배지 시스템 | 완전함 | 전문가 트랙, 스트릭, 특별 배지 |
| 스트릭 관리 | 안정적 | 미래 날짜 방어, 로컬 타임존 사용 |
| localStorage | 안정적 | 깊은 병합으로 마이그레이션 안전 |

### 5.2 주요 메서드

| 메서드 | 용도 |
|--------|------|
| `recordQuizAnswer()` | 퀴즈 응답 기록 + 포인트/배지 |
| `recordPollVote()` | 투표 참여 기록 + 포인트/배지 |
| `getStats()` | 전체 통계 조회 |
| `getQuizzesByCategory()` | 카테고리별 퀴즈 통계 |
| `getPollsByCategory()` | 카테고리별 투표 통계 |
| `getMinorityVoteRatio()` | 소수 의견 비율 |

### 5.3 잠재적 이슈

없음 - 안정적인 상태

---

## 6. 데이터 흐름 검증

### 6.1 투표 플로우

```
1. 사용자가 투표 클릭
2. ParticipationBridge.recordPollVote() 호출
3. TursoService.savePollResponse() → /api/poll → Turso DB
4. saved === true 시 GamificationService.recordPollVote() → localStorage
5. 결과 반환: { saved, isMinority, gamification }
```

### 6.2 퀴즈 플로우

```
1. 사용자가 퀴즈 응답
2. ParticipationBridge.recordQuizAnswer() 호출
3. TursoService.saveQuizResponse() → /api/quiz → Turso DB
4. saved === true 시 GamificationService.recordQuizAnswer() → localStorage
5. 결과 반환: { saved, isCorrect, gamification }
```

### 6.3 랭킹 투표 플로우

```
1. 사용자가 랭킹 투표
2. RankingService.vote() 호출
3. localStorage에 저장 (향후 Turso 전환)
4. 결과 반환: { success, id }
```

---

## 7. 수정 완료 사항 요약

| 파일 | 수정 내용 |
|------|----------|
| `ParticipationBridge.ts` | saved 체크 추가, JSDoc 보완 |
| `RankingService.ts` | totalAllTimeVotes 수정, 과거 시즌 조회, startDate optional, 시즌 정렬 개선, 병렬 처리 |
| `index.ts` | FeedbackService 제거, tursoService 추가 |

---

## 8. 남은 작업 (향후)

| 작업 | 우선순위 | 설명 |
|------|----------|------|
| RankingService Turso 전환 | **High** | 레이스 컨디션 해결 (멀티탭 투표 충돌 방지) |
| 시즌 헬퍼 테스트 추가 | Medium | getSeasonSummaryById, getAvailableSeasons, getYearlyTrend 테스트 |
| 오프라인 큐잉 | Low | 저장 실패 시 로컬 큐, 온라인 복귀 시 재시도 |
| 이벤트 시즌 개선 | Low | 다중 이벤트 지원 필요 시 |
| 투표 ID 개선 | Low | UUID 사용 고려 |

### 레이스 컨디션 상세 (RankingService.saveVote)

**현재 문제**:
```typescript
// 1. 탭 A: votes 읽기 [v1, v2]
// 2. 탭 B: votes 읽기 [v1, v2]
// 3. 탭 A: votes 쓰기 [v1, v2, v3]
// 4. 탭 B: votes 쓰기 [v1, v2, v4]  ← v3 유실!
```

**해결 방법**: Turso 전환 시 서버 트랜잭션으로 해결
- localStorage는 동기 API지만 탭 간 동시 접근 시 경합 발생
- 서버에서 INSERT 처리하면 충돌 없음

---

## 9. 빌드 결과

```
npm run build
✓ Compiled successfully
✓ Generating static pages (17/17)
에러 0, 경고 0
```

---

## 10. 결론

**현재 서비스 레이어는 안정적인 상태입니다.**

- FeedbackService → TursoService 전환 완료
- 게이미피케이션 상태 동기화 문제 해결 (saved 체크)
- RankingService 버그 수정 및 기능 확장
- 모든 빌드 테스트 통과

향후 Turso 전환 시 RankingService의 StorageProvider만 교체하면 됩니다.
