# 코드 리뷰 요청: ResultService Turso 마이그레이션

## 개요
테스트 결과 저장을 localStorage에서 Turso DB로 마이그레이션했습니다.
기존 Supabase 코드를 제거하고 Turso 기반으로 통합했습니다.

## 변경 목적
1. 테스트 결과를 서버에 저장하여 기기 간 데이터 유지
2. 결과 분포 조회 기능 추가 (다른 사람들은 어떤 유형인지)
3. 연령대/성별별 필터링 지원

## 변경된 파일

### 1. API 라우트 (신규)
**파일**: `src/app/api/test-results/route.ts`

```typescript
// POST: 테스트 결과 저장
POST /api/test-results
Body: { deviceId, testType, resultName, resultEmoji, scores, isDeepMode, parentInfo? }
Response: { success: true, id: "1" }

// GET: 내 결과 조회
GET /api/test-results?type=my-results&deviceId=xxx
Response: { results: [...] }

// GET: 결과 분포 조회
GET /api/test-results?type=distribution&testType=human
GET /api/test-results?type=distribution&testType=human&ageGroup=20s&gender=female
Response: { testType, total, distribution: [{ rank, resultName, count, percentage }], filter }

// GET: 내 결과 순위
GET /api/test-results?type=my-rank&testType=human&deviceId=xxx
Response: { hasResult, rank, percentage, ... }
```

### 2. TursoService 확장
**파일**: `src/services/TursoService.ts`

추가된 메서드:
- `saveTestResult()` - 테스트 결과 저장
- `getMyResults()` - 내 결과 조회
- `getResultDistribution()` - 분포 조회
- `getMyResultRank()` - 내 순위 조회

추가된 타입:
- `TestResult`
- `ResultDistribution`
- `MyResultRank`

### 3. ResultService 리팩토링
**파일**: `src/services/ResultService.ts`

변경 사항:
- Supabase 관련 코드 완전 제거 (145줄 → 80줄 감소)
- `saveResult()`: Turso 저장 + localStorage 백업
- `getMyResults()`: Turso 우선 조회, 실패 시 localStorage 폴백
- 신규: `getResultDistribution()`, `getMyResultRank()` 위임

### 4. UI 컴포넌트 (신규)
**파일**: `src/components/ResultDistribution.tsx`

기능:
- 결과 화면에서 "다른 사람들은?" 토글
- 연령대/성별 필터 탭
- 분포 바 차트 (TOP 5)
- 내 결과 하이라이트

### 5. 결과 화면 연동
**파일**: `src/app/page.tsx`

- `ResultDistribution` 컴포넌트 import 추가
- 결과 화면 하단에 분포 보기 섹션 추가

## 데이터 흐름

```
[테스트 완료]
    ↓
ResultService.saveResult()
    ↓
┌──────────────────────────────────┐
│ 1. TursoService.saveTestResult() │
│    → POST /api/test-results      │
│    → Turso DB INSERT             │
├──────────────────────────────────┤
│ 2. localStorage 백업             │
└──────────────────────────────────┘
    ↓
[결과 화면 표시]
    ↓
ResultDistribution 컴포넌트
    ↓
TursoService.getResultDistribution()
    → GET /api/test-results?type=distribution
    → Turso DB SELECT
```

## 테스트 결과

```
🧪 Test Results API 테스트
📍 Base URL: http://localhost:3000

1. POST /api/test-results - 결과 저장... ✅ PASS
2. POST - parentInfo 포함 저장... ✅ PASS
3. POST - 필수 필드 누락 시 400... ✅ PASS
4. GET ?type=my-results - 내 결과 조회... ✅ PASS
5. GET ?type=distribution - 결과 분포 조회... ✅ PASS
6. GET ?type=distribution&ageGroup=20s - 연령대별 분포... ✅ PASS
7. GET ?type=my-rank - 내 결과 순위... ✅ PASS
8. GET ?type=my-rank - 결과 없는 경우... ✅ PASS
9. GET ?type=my-results (no deviceId) - 400... ✅ PASS
10. GET ?type=distribution (no testType) - 400... ✅ PASS
11. 분포 순위 정렬 확인... ✅ PASS

📊 테스트 결과: 11 passed, 0 failed
✨ 모든 테스트 통과!
```

## 리뷰 결과 (2024-12-23 반영)

### 1. [Critical] deviceId 보안 - 현행 유지
- **결정**: UUID 추측이 어려워 실질 위험 낮음
- **보류**: 로그인 기능 추가 시 NextAuth 세션 연동으로 전환 예정
- **추후**: Rate Limiting 추가 고려

### 2. [High] Turso/localStorage 동기화 - 해결됨
- **변경**: `getMyResults()`에서 Turso + localStorage 병합
- **로직**: 중복 제거 후 시간순 정렬 (Turso 우선)
```typescript
const tursoKeys = new Set(tursoResults.map(r => `${r.testType}_${r.createdAt}`));
const uniqueLocalResults = localResults.filter(r => !tursoKeys.has(...));
const merged = [...tursoResults, ...uniqueLocalResults].sort(...);
```

### 3. [Medium] 분포 조회 폴백 - 해결됨
- **변경**: JOIN 실패 시 무필터 쿼리로 자동 폴백
- **UI**: 필터 결과 없을 시 "전체 보기로 전환" 버튼 표시

### 4. [Medium] UNIQUE 제약 충돌 - 해결됨
- **변경**: 클라이언트에서 동일 타임스탬프를 Turso/localStorage에 전달
- **충돌 처리**: UNIQUE 에러 시 `duplicate: true` 반환 (정상 응답)
- **타임스탬프 검증**: ISO 8601 형식만 허용, 비정상 시 서버에서 생성
```typescript
// route.ts - 타임스탬프 검증
if (clientTimestamp && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(clientTimestamp)) {
  timestamp = clientTimestamp;
} else {
  timestamp = new Date().toISOString();
}

// UNIQUE 충돌 시 중복으로 처리
catch (insertError) {
  if (errorMessage.includes('UNIQUE constraint')) {
    return { success: true, duplicate: true };
  }
}
```

### 5. [Low] 분포 UI 빈 상태 - 해결됨
- **변경**: 필터 적용 후 데이터 없을 시 메시지 표시
- **UX**: "20대 데이터가 아직 없습니다" + "전체 보기로 전환" 버튼

---

## 남은 고려사항

### 성능
- [ ] 분포 조회 시 매번 DB 쿼리 (캐싱 필요?)
- [ ] getMyResults()에서 Turso 실패 시 localStorage 폴백 (딜레이 발생)

### 보안
- [ ] 분포 API는 누구나 호출 가능 (rate limiting 필요?)

### 데이터
- [ ] 기존 localStorage 데이터 Turso 마이그레이션 (일회성 스크립트 필요?)

### 코드 구조
- [ ] TursoService에 타입 정의가 너무 많아짐 (별도 파일 분리?)

## 테스트 실행 방법

```bash
# 서버 실행
npm run dev

# 테스트 실행 (별도 터미널)
npx tsx tests/test-results-api.test.ts
```

## 관련 DB 스키마

```sql
-- scripts/setup-turso-schema.mjs 참조
CREATE TABLE IF NOT EXISTS test_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id TEXT NOT NULL,
  user_id TEXT,
  test_type TEXT NOT NULL,
  result_name TEXT NOT NULL,
  scores TEXT,
  parent_info TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(device_id, test_type, created_at)
);

CREATE TABLE IF NOT EXISTS user_demographics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id TEXT UNIQUE NOT NULL,
  user_id TEXT,
  age_group TEXT,
  gender TEXT,
  source TEXT DEFAULT 'bonus_question',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```
