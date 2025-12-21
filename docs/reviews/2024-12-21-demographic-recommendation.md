# 코드 리뷰 요청: 연령/성별 기반 추천 테스트 로직

## 변경 개요

**목적**: 사이드바의 "추천 테스트"가 하드코딩된 순서가 아닌, 실제 사용자 참여 데이터 기반으로 연령/성별별 인기순을 보여주도록 개선

**변경 파일**:
1. `src/app/api/ranking/route.ts` - 테스트별 인기순 API 추가
2. `src/components/Sidebar.tsx` - 실제 데이터 기반 추천 로직 적용

---

## 1. API 변경 (route.ts)

### 추가된 엔드포인트

```
GET /api/ranking?type=popular-tests
GET /api/ranking?type=popular-tests&ageGroup=20s&gender=female
```

### 변경 코드

```typescript
// 테스트별 인기순 (참여 수 기반)
if (type === 'popular-tests') {
  let sql: string;
  let args: unknown[] = [];

  const hasAgeFilter = ageGroup && VALID_AGE_GROUPS.includes(ageGroup as typeof VALID_AGE_GROUPS[number]);
  const hasGenderFilter = gender && VALID_GENDERS.includes(gender as typeof VALID_GENDERS[number]);

  if (hasAgeFilter || hasGenderFilter) {
    // 연령대/성별 필터가 있는 경우 - demographics 테이블 조인
    const conditions: string[] = [];
    if (hasAgeFilter) conditions.push('ud.age_group = ?');
    if (hasGenderFilter) conditions.push('ud.gender = ?');

    sql = `
      SELECT
        tr.test_type,
        COUNT(*) as count
      FROM test_results tr
      INNER JOIN user_demographics ud ON tr.device_id = ud.device_id
      WHERE ${conditions.join(' AND ')}
      GROUP BY tr.test_type
      ORDER BY count DESC
      LIMIT ?
    `;
    args = [];
    if (hasAgeFilter) args.push(ageGroup);
    if (hasGenderFilter) args.push(gender);
    args.push(limit);
  } else {
    // 전체 인기순
    sql = `
      SELECT
        test_type,
        COUNT(*) as count
      FROM test_results
      GROUP BY test_type
      ORDER BY count DESC
      LIMIT ?
    `;
    args = [limit];
  }

  const result = await query(sql, args);

  const popularTests = result.rows.map(row => ({
    testType: row.test_type as string,
    count: row.count as number,
    emoji: getTestEmoji(row.test_type as string),
  }));

  return NextResponse.json({
    popularTests,
    ageGroup: ageGroup || 'all',
    gender: gender || 'all',
  });
}
```

### 검토 포인트

1. **SQL 인젝션 방지**: 파라미터화된 쿼리 사용, VALID_AGE_GROUPS/VALID_GENDERS 화이트리스트 검증
2. **INNER JOIN 사용**: demographics 정보가 없는 사용자는 필터링됨 - 의도된 동작인가?
3. **인덱스 필요성**: `test_results.test_type`, `user_demographics.device_id` 인덱스 확인 필요

---

## 2. Sidebar 변경 (Sidebar.tsx)

### 변경 전 (하드코딩)

```typescript
// 추천 테스트: 인기 테스트 우선 + 완료하지 않은 것
const notCompletedPopular = POPULAR_TESTS.filter(key => !completedKeys.includes(key));
const notCompletedOther = MAIN_TEST_KEYS.filter(key =>
  !completedKeys.includes(key) && !POPULAR_TESTS.includes(key)
);
const allRecommended = [...notCompletedPopular, ...notCompletedOther];
```

### 변경 후 (실제 데이터 기반)

```typescript
// 추천 테스트: 실제 참여 데이터 기반 인기순
const demographic = demographicService.getDemographic();
const ageGroup = demographic?.ageGroup;
const gender = demographic?.gender;

// 1. 연령 제한 필터링 (예: alcohol은 20대 이상만)
const ageFilteredTests = filterTestsByAge(MAIN_TEST_KEYS, ageGroup);

// 2. 완료하지 않은 테스트만
const notCompleted = ageFilteredTests.filter(key => !completedKeys.includes(key));

// 3. 실제 참여 데이터 기반 인기순 가져오기
let popularTestOrder: string[] = [];
let label = '인기순';

try {
  // 연령/성별 정보가 있으면 해당 그룹의 인기순, 없으면 전체 인기순
  const params = new URLSearchParams({ type: 'popular-tests', limit: '20' });
  if (ageGroup) params.set('ageGroup', ageGroup);
  if (gender && gender !== 'other') params.set('gender', gender);

  const res = await fetch(`/api/ranking?${params.toString()}`);
  if (res.ok) {
    const data = await res.json();
    popularTestOrder = (data.popularTests || []).map((t: { testType: string }) => t.testType);

    // 맞춤 라벨 설정
    if (ageGroup || gender) {
      label = demographicService.getRecommendationLabel() || '인기순';
    }
  }
} catch (e) {
  console.warn('Failed to fetch popular tests:', e);
}

// 4. 인기순으로 정렬 (API 데이터 우선, 없으면 POPULAR_TESTS 폴백)
const popularityOrder = popularTestOrder.length > 0 ? popularTestOrder : POPULAR_TESTS;
const sortedRecommended = notCompleted.sort((a, b) => {
  const aIdx = popularityOrder.indexOf(a);
  const bIdx = popularityOrder.indexOf(b);
  // 인기 목록에 없으면 맨 뒤로
  const aPriority = aIdx >= 0 ? aIdx : 1000;
  const bPriority = bIdx >= 0 ? bIdx : 1000;
  return aPriority - bPriority;
});

setRecommendedTests(sortedRecommended);
setRecommendLabel(label);
```

### 검토 포인트

1. **API 호출 위치**: useEffect 내에서 매번 호출 - 캐싱이나 SWR 사용 고려?
2. **에러 핸들링**: API 실패 시 `POPULAR_TESTS` 폴백 - 적절한가?
3. **gender === 'other' 처리**: 성별 필터에서 제외 - 의도된 동작인가?
4. **Array.sort() 원본 변경**: `notCompleted.sort()`는 원본 배열을 변경함 - `[...notCompleted].sort()` 권장?

---

## 동작 흐름

```
사용자 접속
    ↓
demographicService.getDemographic()로 연령/성별 확인
    ↓
┌─────────────────────────────────────────────────────┐
│ 연령/성별 정보 있음                                    │
│   → /api/ranking?type=popular-tests&ageGroup=20s    │
│      &gender=female                                  │
│   → "20대 여성에게 인기" 라벨                          │
├─────────────────────────────────────────────────────┤
│ 연령/성별 정보 없음                                    │
│   → /api/ranking?type=popular-tests                 │
│   → "인기순" 라벨                                     │
├─────────────────────────────────────────────────────┤
│ API 실패                                             │
│   → POPULAR_TESTS 하드코딩 폴백                       │
│   → "인기순" 라벨                                     │
└─────────────────────────────────────────────────────┘
    ↓
filterTestsByAge()로 연령 제한 테스트 필터링
(예: alcohol은 20대 미만에게 숨김)
    ↓
완료한 테스트 제외
    ↓
인기순으로 정렬하여 표시
```

---

## 테스트 시나리오

| 시나리오 | 예상 결과 |
|---------|----------|
| 신규 사용자 (연령/성별 없음) | 전체 인기순, "인기순" 라벨 |
| 20대 여성 | 20대 여성 인기순, "20대 여성에게 인기" 라벨 |
| 10대 | alcohol 테스트 제외됨 |
| API 장애 시 | POPULAR_TESTS 폴백 |
| 모든 테스트 완료 | 빈 목록 (추천 섹션 숨김) |

---

## 잠재적 이슈

1. **Cold Start 문제**: 데이터가 적을 때 인기순이 왜곡될 수 있음 → POPULAR_TESTS 폴백으로 대응
2. ~~**캐싱 없음**: 매 렌더링마다 API 호출~~ → ✅ sessionStorage 5분 캐싱 추가됨
3. ~~**demographics 없는 사용자**: INNER JOIN으로 필터링됨~~ → ✅ 해결됨 (아래 참조)

---

## 리뷰 결과 (2024-12-21)

### 해결된 이슈

| 이슈 | 해결 방법 |
|------|----------|
| INNER JOIN으로 demographics 없는 사용자 제외 | 필터 없을 때는 전체 test_results 조회 (JOIN 없음), 필터 있을 때만 INNER JOIN |
| user_demographics 중복 집계 | UPSERT로 device_id당 1행 보장됨 (ON CONFLICT) |
| Array.sort() 원본 변형 | `[...notCompleted].sort()`로 복사 후 정렬 |
| indexOf O(n²) 성능 | `Map`으로 인덱스 캐시하여 O(n)으로 개선 |
| 매 렌더링 API 호출 | sessionStorage 5분 캐싱 추가 |

### API 동작 정리

```
/api/ranking?type=popular-tests
  → 필터 없음: test_results 전체 집계 (demographics 무관)
  → ageGroup=20s: INNER JOIN으로 20대만 집계
  → gender=female: INNER JOIN으로 여성만 집계
```

### 남은 고려사항

1. **Cold Start**: 현재 POPULAR_TESTS 폴백으로 대응, 추후 최소 샘플 수 기준 추가 가능
2. **HTTP 캐시**: 서버 레벨 캐싱은 미적용 (sessionStorage로 충분할 수 있음)

---

## 최종 리뷰 (2024-12-21)

### 추가 수정 사항

| 이슈 | 해결 방법 |
|------|----------|
| limit 파라미터 NaN 검증 | `Number.isNaN()` 체크 + 기본값 10, 범위 1~50 제한 |
| by-age N+1 쿼리 문제 | 단일 쿼리 2개로 변경 (연령대별 결과 + 총 수) |
| 유효하지 않은 필터 응답 | 검증 실패 시 응답에 'all'로 명시 |

### 코드 품질 확인

- ✅ SQL 인젝션 방지: 파라미터화된 쿼리 + 화이트리스트 검증
- ✅ 에러 핸들링: try-catch + 폴백 로직
- ✅ 성능 최적화: Map 인덱스 캐시, sessionStorage 캐싱, N+1 해결
- ✅ 원본 배열 보호: `[...array].sort()` 사용

### 의도된 동작 확인

| 동작 | 설명 |
|------|------|
| `gender === 'other'` 필터 제외 | 'other' 선택자는 성별 기반 추천이 적절하지 않음 |
| INNER JOIN 사용 | 필터 적용 시 해당 그룹만 집계하는 것이 정확한 동작 |
| 필터 없음 시 전체 조회 | demographics 없는 사용자도 포함하여 전체 인기순 제공 |

### 리뷰 완료

모든 주요 이슈가 해결되었으며, 코드가 프로덕션 준비 상태입니다.

---

## 2차 리뷰 (2024-12-21)

### 검토된 이슈

| 이슈 | 심각도 | 결론 |
|------|--------|------|
| demographics 변경 시 추천 새로고침 안됨 | Medium | ✅ 현재 UX에서는 문제 없음 (demographics는 첫 수집 후 변경 UI 없음) |
| popular-tests INNER JOIN으로 demographics 없는 사용자 제외 | Medium | ✅ 의도된 동작 (필터 적용 시 분류 불가 사용자 제외는 논리적) |
| gender=other 캐시 키 불일치 | Low | ✅ 수정됨 - `effectiveGender` 변수로 통일 |
| sessionStorage JSON 파싱 에러 처리 | Low | ✅ 수정됨 - 경고 로그 + 손상된 캐시 자동 제거 |

### 수정 내용 (Sidebar.tsx)

```typescript
// Before: 캐시 키와 API 요청 파라미터 불일치
const cacheKey = `popular_tests_${ageGroup || 'all'}_${gender || 'all'}`;
if (gender && gender !== 'other') params.set('gender', gender);

// After: effectiveGender로 통일
const effectiveGender = gender && gender !== 'other' ? gender : null;
const cacheKey = `popular_tests_${ageGroup || 'all'}_${effectiveGender || 'all'}`;
if (effectiveGender) params.set('gender', effectiveGender);

// JSON 파싱 에러 처리 추가
try {
  popularTestOrder = JSON.parse(cached);
} catch (parseError) {
  console.warn('Corrupted popular tests cache, clearing:', parseError);
  sessionStorage.removeItem(cacheKey);
  sessionStorage.removeItem(`${cacheKey}_expiry`);
}
```

### 향후 고려사항

- 프로필 수정 기능 추가 시 demographics 변경 후 Sidebar 새로고침 필요
- 현재는 `useEffect([], [])` 유지 (첫 로드에만 실행)

---

## 3차 리뷰 (2024-12-21)

### 발견된 이슈

| 파일 | 이슈 | 심각도 |
|------|------|--------|
| `MyResultsContext.tsx` | 마운트 시 1회만 로드, 새 테스트 완료 후 갱신 안됨 | Medium |
| `MyRankingMini.tsx` | `myResults.length` 감소 시 `currentIndex` 범위 초과 가능 | Low |

### 해결 방법

| 이슈 | 해결 |
|------|------|
| Context 자동 갱신 | `chemi:resultSaved` 이벤트 구독 추가 (line 78-86) |
| currentIndex 범위 초과 | `myResults.length` 변경 시 clamp 로직 추가 (line 68-73) |

### 수정 코드

**MyResultsContext.tsx**
```typescript
useEffect(() => {
  loadResults();

  // 새 테스트 결과 저장 시 자동 갱신
  const handleResultSaved = () => {
    loadResults();
  };

  window.addEventListener('chemi:resultSaved', handleResultSaved);
  return () => {
    window.removeEventListener('chemi:resultSaved', handleResultSaved);
  };
}, [loadResults]);
```

**MyRankingMini.tsx**
```typescript
// myResults 변경 시 currentIndex 범위 초과 방지
useEffect(() => {
  if (myResults.length > 0 && currentIndex >= myResults.length) {
    setCurrentIndex(myResults.length - 1);
  }
}, [myResults.length, currentIndex]);
```

### 동작 확인

- ✅ 새 테스트 완료 시 `chemi:resultSaved` 이벤트로 자동 갱신
- ✅ 결과 삭제/변경 시에도 `currentIndex`가 유효 범위 유지
