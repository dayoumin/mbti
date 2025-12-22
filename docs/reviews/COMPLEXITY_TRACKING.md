# 복잡도 추적 문서

> 이 문서는 AI 리뷰가 필요한 복잡한 로직을 추적합니다.
> 리팩토링 시 우선순위 참고용으로 사용합니다.

## 최종 업데이트: 2024-12-22

---

## 필수 리뷰 대상 (복잡도 최상위)

### 1. GamificationService.ts ⭐⭐⭐⭐⭐
**파일**: `src/services/GamificationService.ts` (1,050줄)

**복잡한 이유:**
- 5-6단계 중첩 상태 관리 (expertProgress → subject → progress → streak)
- 배지 조건 체크 10개+ 카테고리
  - `checkBadgeCondition()` - 10개 카테고리
  - `checkExpertBadgeCondition()` - 7-8개 요구사항
  - `checkCommunityBadgeCondition()` - 5개 조건
  - `checkDuelBadgeCondition()` - 6개 조건
  - `checkSpecialBadgeCondition()` - 6개 특별 배지
- 스트릭 계산 로직 (날짜 비교, 연속성 추적)
- 깊은 병합 로직 (`load()` 함수)

**위험 포인트:**
- 새 필드 추가 시 병합 로직 누락 가능
- 스트릭 끊김 감지 경계 케이스
- localStorage 부분 로드 시 상태 불일치

**리뷰 체크리스트:**
- [ ] 배지 조건 완전성 검증
- [ ] 스트릭 로직 경계 케이스 테스트
- [ ] 상태 동기화 버그 확인

---

### 2. RankingService.ts ⭐⭐⭐⭐
**파일**: `src/services/RankingService.ts` (525줄)

**복잡한 이유:**
- 시즌 로직 3가지 타입 (yearly, quarterly, event)
- 3중 필터링과 정렬 데이터 집계
- 분기별 시작/종료일 계산

**위험 포인트:**
- 월 오프셋 버그 위험 (분기 계산)
- 하드코딩된 분기명 매핑
- 연도 변경 시나리오

**리뷰 체크리스트:**
- [ ] 분기 계산 정확성 검증
- [ ] 연도 전환 시나리오 테스트
- [ ] 빈 데이터 처리 확인

---

### 3. FeedbackService.ts ⭐⭐⭐⭐
**파일**: `src/services/FeedbackService.ts` (658줄)

**복잡한 이유:**
- localStorage vs Supabase 이중 처리
- Supabase 동적 쿼리 체인
- snake_case ↔ camelCase 변환
- 8개+ try-catch 블록

**위험 포인트:**
- Supabase 오류 시 폴백 로직
- 소수 의견 판정 30% 임계값 (하드코딩)
- 카테고리별 정확도 계산 (최소 3문제 조건)

**리뷰 체크리스트:**
- [ ] Supabase 오류 처리 검증
- [ ] 폴백 안정성 테스트
- [ ] 임계값 비즈니스 로직 확인

---

## 권장 리뷰 대상

### 4. NextActionService.ts ⭐⭐⭐
**파일**: `src/services/NextActionService.ts` (841줄)

**복잡한 이유:**
- 100+ 연결 규칙 (`TEST_TO_CONTENT`)
- 10개 이상 추천 메서드
- 시간대별 조건부 추천 (6개 시간 구간)

**위험 포인트:**
- 콘텐츠 맵 누락/중복
- 우선순위 충돌 해결 로직
- 객체 직접 수정 패턴

---

### 5. ResultService.ts ⭐⭐⭐
**파일**: `src/services/ResultService.ts` (426줄)

**복잡한 이유:**
- 3단계 추천 알고리즘 (`getRecommendedTest()`)
- 재귀 키 변환 함수 (`keysToCamel()`)
- Supabase 3레이어 폴백

**위험 포인트:**
- 깊은 중첩에서 성능 저하
- 무한 루프 위험
- 부모 테스트 매핑 로직

---

### 6. useContentParticipation.ts ⭐⭐⭐
**파일**: `src/components/content/useContentParticipation.ts` (302줄)

**복잡한 이유:**
- 레이스 컨디션 방지 (`currentPollIdRef`)
- 상태 복원 로직
- 다중 서비스 조정

**위험 포인트:**
- 빠른 UI 전환 시 동작 보증
- 로딩 상태 강제 리셋

---

### 7. ParticipationBridge.ts ⭐⭐⭐
**파일**: `src/services/ParticipationBridge.ts` (100+줄)

**복잡한 이유:**
- FeedbackService + GamificationService 통합
- 데이터 구조 변환

**위험 포인트:**
- 서비스 간 데이터 흐름 정합성
- 30% 임계값 하드코딩

---

## 구조 개선 필요 사항 (TODO)

> 아래 항목들은 향후 리팩토링 시 검토 필요

### ✅ 완료된 항목

#### 1. 하드코딩된 상수 중앙화 ✅ (2024-12-22)
**생성된 파일:**
```
src/config/
├── index.ts        # 통합 export
├── scoring.ts      # LEVEL_THRESHOLDS, BADGE_THRESHOLDS, SCORING, LEVELS
├── seasons.ts      # QUARTER_NAMES, SEASON_TYPES, getSeasonDisplayName()
└── testKeys.ts     # DETAIL_TEST_KEYS (기존)
```

**마이그레이션 완료:**
- `constants.ts` → `@/config` 참조로 변경 (하위 호환성 유지)
- `ParticipationBridge.ts` → `BADGE_THRESHOLDS.MINORITY_OPINION` 사용
- `MinorityVoteBadge.tsx` → `BADGE_THRESHOLDS.MINORITY_OPINION` 사용
- `RankingService.ts` → `getSeasonDisplayName()` 사용
- `data/utils.ts` → `@/config`에서 import

#### 2. localStorage 키 통합 ✅ (2024-12-22)
**생성된 파일:**
```typescript
// src/lib/storage.ts
export const STORAGE_KEYS = { ... };  // 20개 키 통합
export const LocalStorage = {
  get<T>(key, defaultValue): T { ... }
  set(key, value): boolean { ... }
  remove(key): boolean { ... }
  clearAll(): number { ... }
};
```

**마이그레이션 완료 (10개 서비스):**
- AuthService ✅ (LocalStorage 헬퍼도 적용)
- GamificationService ✅
- RankingService ✅
- ContentParticipationService ✅
- DemographicService ✅
- AnalyticsService ✅
- CareService ✅ (로컬 alias 패턴)
- PlantCareService ✅ (로컬 alias 패턴)
- FriendService ✅ (로컬 alias 패턴)
- ResultService ✅ (로컬 alias 패턴)

---

### 🟡 우선순위 중간 (여유 있을 때)

#### 3. Turso 클라이언트 통합
**문제**: TursoService가 이미 중앙화되어 있으나, 일부 서비스에서 직접 import 패턴 사용

**현황:** `src/services/TursoService.ts`로 대부분 통합됨 ✅

#### 4. API 에러 핸들링 표준화
**문제**: 30개+ API 라우트에서 동일한 try-catch 패턴 반복

**생성할 파일:**
```typescript
// src/lib/api-handler.ts
export function apiError(code: ApiErrorCode, details?: string) { ... }
export function apiSuccess<T>(data: T) { ... }
```

#### 5. ID 생성 패턴 통합
**문제**: 3곳에서 다른 방식으로 ID 생성

| 위치 | 패턴 |
|------|------|
| `ResultService.ts:307` | `Date.now() + '_' + Math.random()...` |
| `CareService.ts:31` | ``${Date.now()}-${Math.random()...}`` |
| `api/poll/route.ts:71` | `user-${Date.now()}-...` |

**생성할 파일:** `src/utils/id.ts`

### 🟢 우선순위 낮음 (나중에)

#### 6. 타입 정의 통합
**문제**: 8개 파일에 타입 분산

```
현재:
├── data/types.ts
├── data/care/types.ts
├── data/gamification/types.ts
├── data/content/types.ts
├── services/ResultService.ts (내부 타입)
├── services/TursoService.ts (내부 타입)
└── ...

통합 후:
src/types/
├── index.ts
├── api.ts
├── entities.ts
└── errors.ts
```

### 예상 효과

| 개선 항목 | 현재 | 개선 후 | 절감 |
|----------|------|--------|------|
| 상수 관리 포인트 | 15+ | 3 | 80% |
| localStorage 키 정의 | 11개 | 1개 | 91% |
| 에러 핸들링 패턴 | 30+ | 1개 | 97% |
| 코드 중복 라인 | ~500줄 | 제거 | - |

---

## 변경 이력

| 날짜 | 변경 내용 | 작성자 |
|------|----------|--------|
| 2024-12-22 | 상수 중앙화 완료 (src/config/), localStorage 키 통합 완료 (src/lib/storage.ts) | Claude |
| 2024-12-22 | 최초 작성 - 복잡도 분석 결과 기록 | Claude |

---

## 리뷰 완료 이력

| 날짜 | 파일 | 리뷰 결과 | 문서 링크 |
|------|------|----------|----------|
| 2024-12-21 | FeedbackService | 리팩토링 권장사항 도출 | [feedbackservice-refactor-for-review.md](2024-12-21-feedbackservice-refactor-for-review.md) |
| 2024-12-21 | 모바일 랭킹 | UI 개선 리뷰 | [mobile-ranking.md](2024-12-21-mobile-ranking.md) |
| 2024-12-21 | TSX 마이그레이션 | 마이그레이션 리뷰 | [tsx-migration.md](2024-12-21-tsx-migration.md) |