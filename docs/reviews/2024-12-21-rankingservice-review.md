# RankingService 코드 리뷰 및 수정

**날짜**: 2024-12-21
**대상 파일**: `src/services/RankingService.ts`

---

## 발견된 이슈 및 해결

### 1. [High] totalAllTimeVotes 버그 - 해결됨

**이전 코드**:
```typescript
// 이름: "전체 시즌" 투표 수
// 실제: 현재 분기만 조회
const allSeasonVotes = await this.provider.getVotes(getCurrentSeasonId('quarterly'));
const totalAllTimeVotes = allSeasonVotes.length;
```

**수정 코드**:
```typescript
// 전체 투표 수 계산 (모든 시즌)
const allVotes = await this.provider.getAllVotes();
const totalAllTimeVotes = allVotes.length;

// 현재 시즌 투표 수 (별도 제공)
const currentSeasonVotes = await this.provider.getVotes(getCurrentSeasonId('quarterly'));
const currentSeasonVotesCount = currentSeasonVotes.length;
```

---

### 2. [Medium] 과거 시즌 조회 불가 - 해결됨

**추가된 메서드**:

| 메서드 | 설명 |
|--------|------|
| `getSeasonSummaryById(seasonId)` | 특정 시즌 요약 조회 |
| `getAvailableSeasons()` | 데이터가 있는 시즌 목록 |
| `getYearlyTrend(year)` | 연간 분기별 추이 (마케팅용) |

**사용 예시**:
```typescript
// 과거 시즌 조회
const q1Summary = await rankingService.getSeasonSummaryById('2024-Q1');

// 사용 가능한 시즌 목록
const seasons = await rankingService.getAvailableSeasons();
// [{ seasonId: '2024-Q4', seasonName: '2024 4분기 (연말)', seasonType: 'quarterly' }, ...]

// 연간 변동 데이터 (마케팅용)
const trend2024 = await rankingService.getYearlyTrend(2024);
// [{ seasonId: '2024-Q1', totalVotes: 150, participantCount: 45 }, ...]
```

---

### 3. [Medium] seasonId 기반 날짜 계산 - 해결됨

**추가된 유틸리티**:
```typescript
private parseSeasonType(seasonId: string): SeasonType
private getSeasonStartDateFromId(seasonId: string): string
private getSeasonEndDateFromId(seasonId: string): string | undefined
```

이제 과거 시즌 조회 시에도 정확한 시작/종료 날짜 반환.

---

### 4. [Low] 레이스 컨디션 - 미해결 (Turso 전환 시 해결 예정)

localStorage의 read-modify-write 패턴은 멀티탭에서 데이터 충돌 가능.
Turso 전환 시 서버 트랜잭션으로 해결 예정.

---

### 5. [Low] 이벤트 시즌 ID 고정 - 미해결

현재: `${year}-event-current` 고정
향후: 다중 이벤트 지원 시 `${year}-event-${eventId}` 형태로 변경 필요

---

## API 변경 사항

### getDashboardStats() 반환값 변경

```typescript
// Before
{
  totalAllTimeVotes: number;  // 실제로는 현재 분기만
  ...
}

// After
{
  totalAllTimeVotes: number;     // 전체 시즌 합계 (수정됨)
  currentSeasonVotes: number;    // 현재 분기 투표 수 (신규)
  ...
}
```

### 새로운 메서드

| 메서드 | 설명 |
|--------|------|
| `getSeasonSummaryById(seasonId)` | 특정 시즌 요약 |
| `getAvailableSeasons()` | 사용 가능한 시즌 목록 |
| `getYearlyTrend(year)` | 연간 분기별 추이 |

---

## 빌드 결과

- 빌드 성공 (에러 0)

---

## 2차 리뷰 (2024-12-22)

### 추가 수정 사항

| 이슈 | 심각도 | 해결 방법 |
|------|--------|----------|
| Gamification이 Turso 저장 실패해도 적용됨 | Medium | `saved === true`일 때만 게이미피케이션 기록 |
| Event season startDate가 빈 문자열 반환 | Medium | `startDate?: string` (optional)로 변경, undefined 반환 |
| getAvailableSeasons 정렬 순서 | Low | 연도 → 분기 → yearly → event 순 정렬 |
| getYearlyTrend 순차 호출 | Low | `Promise.all()` 병렬 처리 |
| recordQuizAnswer JSDoc 누락 | Low | `@param questionIndex` 추가 |

### 수정된 파일

| 파일 | 변경 |
|------|------|
| `ParticipationBridge.ts` | 저장 성공 시에만 gamification 기록, JSDoc 보완 |
| `RankingService.ts` | startDate optional, 시즌 정렬 개선, 병렬 처리 |

---

## 질문에 대한 답변

1. **Gamification을 saved 여부에 게이트해야 하는가?**
   - Yes, `saved === true`일 때만 게이미피케이션 적용
   - 저장 실패 시 `saved: false` 반환하여 UI에서 오프라인 상태 표시 가능

2. **Event season 날짜를 어떻게 표현할 것인가?**
   - `startDate?: string` (optional)로 변경
   - event 시즌은 `undefined` 반환

3. **퀴즈 points를 Turso에 저장할 것인가?**
   - 현재: 기본값 0으로 저장
   - 향후 필요 시 points 파라미터 활용 가능

---

## 내부 검토용 대시보드 활용

| 기능 | 메서드 | 용도 |
|------|--------|------|
| 과거 시즌 데이터 | `getSeasonSummaryById()` | 시즌 선택 드롭다운 |
| 연간 변동 차트 | `getYearlyTrend()` | 마케팅용 트렌드 시각화 |
| 시즌 목록 | `getAvailableSeasons()` | 시즌 필터 UI |
