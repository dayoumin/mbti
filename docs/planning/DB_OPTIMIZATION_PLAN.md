# 데이터베이스 최적화 계획

**작성일**: 2025-12-27
**실행 시점**: 실사용자 1000명 이상 달성 시
**목표**: 쿼리 응답 시간 < 100ms 유지

---

## 📊 현재 상태 (2025-12-27)

### 데이터베이스 환경
- **플랫폼**: Turso (libSQL)
- **위치**: AWS ap-northeast-1 (서울)
- **연결**: libsql://store-dayoumin.aws-ap-northeast-1.turso.io
- **클라이언트**: @libsql/client (Edge 환경 지원)

### 현재 인덱스 설정
```sql
-- quizzes 테이블
CREATE INDEX idx_quizzes_category ON quizzes(category);
CREATE INDEX idx_quizzes_type ON quizzes(type);
CREATE INDEX idx_quizzes_status ON quizzes(status);

-- polls 테이블
CREATE INDEX idx_polls_category ON polls(category);
CREATE INDEX idx_polls_type ON polls(type);
CREATE INDEX idx_polls_status ON polls(status);

-- tournaments 테이블
CREATE INDEX idx_tournaments_category ON tournaments(category);
CREATE INDEX idx_tournaments_status ON tournaments(status);

-- test_results 테이블 (예상)
CREATE INDEX idx_test_results_device_id ON test_results(device_id);
CREATE INDEX idx_test_results_test_type ON test_results(test_type);
CREATE INDEX idx_test_results_created_at ON test_results(created_at);
```

### 현재 쿼리 패턴
| API 엔드포인트 | 쿼리 | 빈도 | 예상 부하 |
|---------------|------|------|----------|
| `/api/test-results` (POST) | INSERT | 높음 | 사용자당 평균 5회 |
| `/api/test-results?type=distribution` | SELECT + GROUP BY | 중간 | 결과 화면마다 1회 |
| `/api/test-results?type=my-results` | SELECT WHERE device_id | 낮음 | 프로필 조회 시 |
| `/api/poll` | INSERT | 중간 | 투표당 1회 |
| `/api/quiz` | INSERT | 중간 | 퀴즈당 1회 |

**참고**: 현재는 데이터 양이 적어 성능 이슈 없음

---

## 🎯 1000명 이상 시 예상되는 문제

### 데이터 증가량 예측
| 사용자 수 | 테스트 결과 | 투표 응답 | 퀴즈 응답 | 총 레코드 |
|----------|------------|----------|----------|----------|
| 1,000 | 5,000 | 10,000 | 5,000 | 20,000 |
| 10,000 | 50,000 | 100,000 | 50,000 | 200,000 |
| 100,000 | 500,000 | 1,000,000 | 500,000 | 2,000,000 |

**병목 지점 예상**:
1. **결과 분포 조회** (GROUP BY 쿼리)
   - 현재: `SELECT result_name, COUNT(*) FROM test_results WHERE test_type = ? GROUP BY result_name`
   - 10,000명: ~50,000 레코드 스캔 → 50ms (예상)
   - 100,000명: ~500,000 레코드 스캔 → **500ms** (❌ 느림)

2. **내 결과 순위 계산** (전체 분포 + 순위)
   - 전체 분포 계산 후 클라이언트에서 순위 찾기
   - 100,000명: 1초 이상 소요 예상

3. **연령/성별 필터 조회** (JOIN 쿼리)
   - `test_results` + `user_demographics` JOIN
   - 인덱스 없으면 풀 스캔

---

## 🔍 쿼리 프로파일링 계획

### 1단계: 쿼리 성능 측정 (1000명 달성 시)

#### 측정 항목
```sql
-- 1. 결과 분포 쿼리 (가장 빈번)
EXPLAIN QUERY PLAN
SELECT result_name, COUNT(*) as count
FROM test_results
WHERE test_type = 'human'
GROUP BY result_name
ORDER BY count DESC;

-- 2. 내 결과 조회
EXPLAIN QUERY PLAN
SELECT id, test_type, result_name, scores, created_at
FROM test_results
WHERE device_id = 'xxx'
ORDER BY created_at DESC;

-- 3. 연령/성별 필터 (JOIN)
EXPLAIN QUERY PLAN
SELECT tr.result_name, COUNT(*) as count
FROM test_results tr
INNER JOIN user_demographics ud ON tr.device_id = ud.device_id
WHERE tr.test_type = 'human' AND ud.age_group = '20s'
GROUP BY tr.result_name;
```

#### 측정 도구
```bash
# Turso CLI로 쿼리 실행 시간 측정
npx turso db shell store-dayoumin

> .timer on
> SELECT result_name, COUNT(*) FROM test_results WHERE test_type = 'human' GROUP BY result_name;
# Run Time: real 0.045 user 0.012345 sys 0.006789
```

#### 기준값
| 쿼리 유형 | 목표 응답 시간 | 경고 임계값 | 긴급 임계값 |
|----------|--------------|-----------|----------|
| INSERT | < 10ms | 50ms | 100ms |
| SELECT (단일) | < 20ms | 100ms | 200ms |
| GROUP BY | < 50ms | 200ms | 500ms |
| JOIN | < 100ms | 500ms | 1000ms |

---

### 2단계: 인덱스 최적화 (응답 시간 > 100ms 시)

#### 추가 인덱스 후보
```sql
-- 1. 복합 인덱스 (test_type + result_name)
-- 목적: GROUP BY 쿼리 최적화
CREATE INDEX idx_test_results_type_result ON test_results(test_type, result_name);

-- 효과: test_type 필터링 후 result_name GROUP BY 가속
-- Before: 500ms → After: 50ms (예상)

-- 2. 복합 인덱스 (device_id + created_at)
-- 목적: 내 결과 조회 + 정렬 최적화
CREATE INDEX idx_test_results_device_created ON test_results(device_id, created_at DESC);

-- 효과: ORDER BY created_at DESC 정렬 생략
-- Before: 200ms → After: 20ms (예상)

-- 3. JOIN 최적화 인덱스
-- 목적: user_demographics JOIN 가속
CREATE INDEX idx_demographics_device ON user_demographics(device_id);
CREATE INDEX idx_demographics_age_gender ON user_demographics(age_group, gender);

-- 효과: JOIN + 필터링 최적화
-- Before: 1000ms → After: 100ms (예상)
```

#### 인덱스 크기 예측
| 인덱스 | 레코드 수 (100,000명) | 예상 크기 | 비고 |
|--------|---------------------|----------|------|
| idx_test_results_type_result | 500,000 | ~50MB | 복합 인덱스 |
| idx_test_results_device_created | 500,000 | ~40MB | 복합 인덱스 + 정렬 |
| 총계 | - | ~100MB | 허용 범위 |

---

### 3단계: 쿼리 리팩토링 (인덱스로 해결 안 될 시)

#### 1. 결과 분포 캐싱 (서버 측)
```typescript
// Before: 매번 GROUP BY 쿼리
async function getResultDistribution(testType: string) {
  const results = await query(`
    SELECT result_name, COUNT(*) as count
    FROM test_results
    WHERE test_type = ?
    GROUP BY result_name
  `, [testType]);
  return results;
}

// After: 10분 캐싱
import { unstable_cache } from 'next/cache';

const getResultDistribution = unstable_cache(
  async (testType: string) => {
    const results = await query(/* 동일 */);
    return results;
  },
  ['result-distribution'], // 캐시 키
  { revalidate: 600 } // 10분마다 갱신
);
```

**효과**:
- 10분 동안 동일 쿼리 재사용
- DB 부하 99% 감소
- 응답 시간: 500ms → 0ms (캐시 히트)

#### 2. 내 결과 순위 계산 방식 변경
```typescript
// Before: 전체 분포 가져온 후 클라이언트에서 순위 계산
const distribution = await getResultDistribution(testType);
const myRank = distribution.findIndex(d => d.resultName === myResult) + 1;

// After: SQL에서 직접 순위 계산
const myRank = await query(`
  SELECT
    COUNT(*) FILTER (WHERE count > my_count) + 1 as rank
  FROM (
    SELECT result_name, COUNT(*) as count
    FROM test_results
    WHERE test_type = ?
    GROUP BY result_name
  )
  WHERE (SELECT COUNT(*) FROM test_results WHERE test_type = ? AND result_name = ?) as my_count
`, [testType, testType, myResult]);
```

**효과**:
- 클라이언트 측 계산 제거
- 네트워크 전송량 감소 (분포 전체 → 순위만)
- 응답 시간: 1000ms → 200ms (예상)

#### 3. 집계 테이블 (Materialized View 대안)
```sql
-- 집계 테이블 생성 (매시간 갱신)
CREATE TABLE test_results_summary (
  test_type TEXT,
  result_name TEXT,
  count INTEGER,
  percentage REAL,
  updated_at TEXT,
  PRIMARY KEY (test_type, result_name)
);

-- 크론 작업으로 매시간 갱신
INSERT OR REPLACE INTO test_results_summary
SELECT
  test_type,
  result_name,
  COUNT(*) as count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY test_type), 1) as percentage,
  datetime('now') as updated_at
FROM test_results
GROUP BY test_type, result_name;
```

**효과**:
- GROUP BY 쿼리 → 단순 SELECT
- 응답 시간: 500ms → 10ms
- 단점: 실시간성 떨어짐 (1시간 지연)

---

### 4단계: 아키텍처 변경 (10만명 이상 시)

#### 읽기 전용 복제본 (Read Replica)
```typescript
// 마스터: 쓰기 전용
const masterClient = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// 복제본: 읽기 전용 (분산)
const replicaClient = createClient({
  url: process.env.TURSO_REPLICA_URL, // 별도 엔드포인트
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// 쓰기는 마스터, 읽기는 복제본
async function saveTestResult(data) {
  return masterClient.execute(/* INSERT */);
}

async function getResultDistribution(testType) {
  return replicaClient.execute(/* SELECT */);
}
```

**효과**:
- 읽기/쓰기 분리로 병목 해소
- 복제본 여러 개로 읽기 부하 분산
- 단점: 복제 지연 (수초)

---

## 📋 실행 체크리스트

### 1000명 달성 시 (즉시 실행)
- [ ] Turso CLI로 쿼리 실행 시간 측정
  ```bash
  npx turso db shell store-dayoumin
  > .timer on
  > SELECT result_name, COUNT(*) FROM test_results WHERE test_type = 'human' GROUP BY result_name;
  ```
- [ ] 응답 시간 기록 (Spreadsheet/Notion)
- [ ] 임계값 초과 여부 확인 (> 100ms)

### 응답 시간 > 100ms 시 (1단계 최적화)
- [ ] 복합 인덱스 추가
  ```sql
  CREATE INDEX idx_test_results_type_result ON test_results(test_type, result_name);
  ```
- [ ] 재측정 후 개선 확인

### 응답 시간 > 200ms 시 (2단계 최적화)
- [ ] 결과 분포 캐싱 (10분)
- [ ] 내 결과 순위 SQL 계산 변경
- [ ] 재측정 후 개선 확인

### 10,000명 달성 시 (3단계 최적화)
- [ ] 집계 테이블 도입 (매시간 갱신)
- [ ] 크론 작업 설정 (Vercel Cron)
- [ ] 재측정 후 개선 확인

### 100,000명 달성 시 (아키텍처 변경)
- [ ] Turso 읽기 전용 복제본 설정
- [ ] 읽기/쓰기 클라이언트 분리
- [ ] 모니터링 대시보드 구축

---

## 🔧 모니터링 설정 (향후)

### 쿼리 성능 모니터링
```typescript
// src/lib/turso.ts에 추가
export async function query(sql: string, args?: unknown[]) {
  const start = Date.now();
  const client = getTursoClient();
  const result = await client.execute({ sql, args: args as never[] });
  const elapsed = Date.now() - start;

  // 100ms 이상 걸린 쿼리 로깅
  if (elapsed > 100) {
    console.warn('[SLOW QUERY]', {
      sql: sql.substring(0, 100),
      elapsed,
      timestamp: new Date().toISOString()
    });
  }

  // 프로덕션: 외부 모니터링 서비스로 전송 (Sentry, DataDog 등)
  if (process.env.NODE_ENV === 'production' && elapsed > 500) {
    // Sentry.captureMessage('Slow DB query', { extra: { sql, elapsed } });
  }

  return result;
}
```

### 대시보드 메트릭
- 평균 쿼리 시간 (P50, P95, P99)
- 느린 쿼리 TOP 10
- 테이블별 레코드 수
- 인덱스 사용률

---

## 💡 권장 타임라인

| 사용자 수 | 예상 도달 시기 | 최적화 작업 | 우선순위 |
|----------|--------------|------------|---------|
| **1,000** | 배포 후 1개월 | 쿼리 프로파일링 + 인덱스 추가 | 🔴 긴급 |
| **10,000** | 배포 후 3개월 | 캐싱 + 집계 테이블 | 🟡 중간 |
| **100,000** | 배포 후 6개월 | 읽기 복제본 + 모니터링 | 🟢 낮음 |

---

## 📝 요약

### 현재 상태 (< 1000명)
- ✅ 기본 인덱스 설정 완료
- ✅ 성능 이슈 없음
- ✅ 추가 최적화 불필요

### 1000명 이상 시 할 일
1. **즉시**: 쿼리 실행 시간 측정
2. **> 100ms**: 복합 인덱스 추가
3. **> 200ms**: 캐싱 + 쿼리 리팩토링
4. **> 10,000명**: 집계 테이블
5. **> 100,000명**: 읽기 복제본

### 예상 비용
- 인덱스 추가: $0 (Turso 무료 플랜 내)
- 캐싱: $0 (Next.js 내장)
- 집계 테이블: $0 (크론 작업)
- 읽기 복제본: ~$25/월 (Turso Pro 플랜)

---

**작성자**: Claude Sonnet 4.5
**검토 필요 시점**: 실사용자 1000명 달성 시
**참고 문서**: [PERFORMANCE_OPTIMIZATION.md](../handoff/PERFORMANCE_OPTIMIZATION.md)
