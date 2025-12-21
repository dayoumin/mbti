# GamificationService 코드 리뷰 수정 사항

## 개요
- 날짜: 2024-12-21
- 대상 파일: `src/services/GamificationService.ts`, `src/services/ParticipationBridge.ts`
- 리뷰 기반: 이전 AI 리뷰에서 발견된 3가지 이슈

---

## 수정 1: Expert 배지 테스트 조건 강화

### 문제
- `testsCompleted.length`만 체크하여 디테일 테스트만으로 Bronze/Silver 조건 충족 가능
- 의도: "기본 테스트 완료" 후 세부 테스트 진행

### 수정 내용 (GamificationService.ts:824-831)
```typescript
// 기존
if (req.test && progress.testsCompleted.length === 0) return false;
if (req.detailTest && progress.testsCompleted.length < 2) return false;

// 수정
if (req.test && !progress.testsCompleted.includes('main')) return false;
if (req.detailTest) {
  const detailTests = progress.testsCompleted.filter(t => t !== 'main');
  if (detailTests.length < 1) return false;
}
```

### 동작 변경
| 등급 | 기존 | 수정 후 |
|------|------|---------|
| Bronze | 아무 테스트 1개 | 'main' 테스트 필수 |
| Silver+ | 아무 테스트 2개 | 'main' + 세부 테스트 1개 |

---

## 수정 2: 스트릭 미래 날짜 처리

### 문제
- `lastActivityDate`가 미래인 경우(기기 시간 변경/타임존 이동) 스트릭 즉시 끊김
- 사용자 경험 저하 가능

### 수정 내용

#### 전역 스트릭 (GamificationService.ts:653-656)
```typescript
// 미래 날짜인 경우 무시 (기기 시간 변경/타임존 이동 대응)
if (lastActivityDate && lastActivityDate > today) {
  return;
}
```

#### 전문가 트랙 스트릭 (GamificationService.ts:415-416)
```typescript
} else if (progress.lastActiveDate && progress.lastActiveDate > today) {
  // 미래 날짜인 경우 무시 (기기 시간 변경/타임존 이동 대응)
}
```

### 동작 변경
- 미래 날짜 감지 시: 스트릭 상태 유지, 업데이트 스킵
- 정상 날짜로 돌아오면: 기존 로직대로 스트릭 처리

---

## 수정 3: ParticipationBridge 타입 에러 수정

### 문제
- `stats.quizAnswered` → 존재하지 않는 속성
- 빌드 실패

### 수정 내용 (ParticipationBridge.ts:187-190)
```typescript
// 기존
total: stats.quizAnswered,
correct: stats.quizCorrect,
correctRate: stats.quizAnswered > 0 ? ...

// 수정
total: stats.quizzesAnswered,
correct: stats.quizzesCorrect,
correctRate: stats.quizzesAnswered > 0 ? ...
```

---

## 추가 구현: bestCategory 기능

### 배경
- `getParticipationSummary()`에서 `bestCategory: null` 하드코딩
- GamificationService에 `quizzesByCategory` 데이터 존재하나 조회 메서드 없음

### 구현 내용

#### 1. GamificationService에 조회 메서드 추가 (Line 452-455)
```typescript
// 카테고리별 퀴즈 현황 조회
getQuizzesByCategory(): Record<string, { answered: number; correct: number }> {
  return { ...this.stats.quizzesByCategory };
}
```

#### 2. ParticipationBridge에서 bestCategory 계산 (Line 185-207)
```typescript
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

### 동작
- 카테고리별 퀴즈 5문제 이상 풀어야 bestCategory 후보
- 후보 중 정답률 가장 높은 카테고리 반환
- 후보 없으면 `null`

---

## 검증
- 빌드: `npm run build` 성공
- 타입 체크: 통과

---

## 2차 리뷰 수정 (추가)

### 수정 4: recordVisit() 미래 날짜 가드 추가

**문제**: `updateStreak()`에는 미래 날짜 가드가 있지만, `recordVisit()`은 `streakUpdated: true` 반환

**수정** (GamificationService.ts:466-469):
```typescript
// 미래 날짜인 경우 무시 (기기 시간 변경/타임존 이동 대응)
if (lastActivity && lastActivity > today) {
  return { points: 0, streakUpdated: false, newBadges: [] };
}
```

---

### 수정 5: minorityCount 직접 참조

**문제**: 반올림 재계산으로 ±1 오차 발생

**수정** (ParticipationBridge.ts:184):
```typescript
// 기존
minorityCount: Math.round((stats.pollsVoted * minorityRatio) / 100),

// 수정
minorityCount: stats.minorityVotes || 0,
```

---

### 수정 6: getQuizzesByCategory() 깊은 복사

**문제**: 얕은 복사로 중첩 객체 참조 공유 → 외부 변형 시 내부 오염

**수정** (GamificationService.ts:452-459):
```typescript
// 카테고리별 퀴즈 현황 조회 (깊은 복사로 외부 변형 방지)
getQuizzesByCategory(): Record<string, { answered: number; correct: number }> {
  const result: Record<string, { answered: number; correct: number }> = {};
  for (const [key, value] of Object.entries(this.stats.quizzesByCategory)) {
    result[key] = { ...value };
  }
  return result;
}
```

---

### 미수정: SSR 환경에서 요약 0 반환

**판단**: 의도된 동작
- ParticipationBridge는 클라이언트 전용 서비스
- `participationBridge` export 자체가 `typeof window !== 'undefined'` 조건부
- 서버 분석값(FeedbackService)은 제거됨 (TursoService로 마이그레이션 중)

---

## 리뷰 요청 사항
1. Expert 배지 조건 변경이 기존 사용자 데이터에 영향 없는지 확인
2. 스트릭 미래 날짜 무시 정책이 적절한지 검토
3. bestCategory 최소 문제 수(5개) 임계값 적절성 검토
