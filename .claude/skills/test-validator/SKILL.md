---
name: test-validator
description: 테스트 데이터 검증 및 자동 수정. validate-test-data.mjs 실행, 빌드 확인, 에러 자동 수정. 테스트 생성/수정 후 필수 사용.
allowed-tools: Bash, Read, Edit, Write
---

# 테스트 데이터 검증기

## 목적
생성된 테스트 데이터의 품질을 검증하고, 문제 발견 시 자동으로 수정합니다.

## 검증 프로세스

### 1단계: 개별 테스트 검증
```bash
node scripts/validate-test-data.mjs {subject}
```

### 2단계: 전체 빌드 검증
```bash
npm run build
```

### 3단계: 에러/경고 자동 수정
- 에러 발생 시: 즉시 수정 후 재검증
- 경고 발생 시: 가능하면 수정

## 자동 수정 규칙

### 에러 (반드시 수정)

| 에러 | 원인 | 수정 방법 |
|------|------|----------|
| `empty condition` | `condition: {}` 사용 | 조건 2-3개 추가 |
| `unreachable result` | 조건 조합 불가능 | condition 조건 수정 |
| `missing dimension` | 차원 키 오타 | 올바른 키로 수정 |
| `type error` | 타입 불일치 | 인터페이스 맞춰 수정 |

### 경고 (권장 수정)

| 경고 | 원인 | 수정 방법 |
|------|------|----------|
| `5/1 scoring only` | 중간점수 없음 | score: 3 옵션 추가 |
| `low question count` | 차원당 질문 부족 | 질문 추가 |
| `duplicate condition` | 동일 조건 결과 존재 | 조건 차별화 |
| `low medium score ratio` | 중간점수 40% 미만 | score: 3 옵션 추가 |
| `missing tag mapping` | 태그 매핑 없음 | test-tag-mappings.ts에 추가 |
| `invalid tag value` | 유효하지 않은 태그 | insight-tags.ts 참조하여 수정 |

## 품질 기준 (100점 만점)

| 항목 | 배점 | 기준 |
|------|------|------|
| 에러 0개 | 30점 | 필수 |
| 경고 0개 | 20점 | 권장 |
| 중간점수 비율 | 15점 | 40% 이상 |
| 결과 도달률 | 15점 | 100% |
| 인사이트 태그 매핑 | 20점 | 필수 (Stage 3+) |

### 도달 가능성 정의
- **정의**: 각 결과의 condition 조합이 실제 응답으로 만들어질 수 있어야 함
- **검증**: `validate-test-data.mjs`가 "unreachable result" 경고 출력 시 실패
- **예시**: `{dim1: "high", dim2: "high"}`이면 dim1, dim2 모두 HIGH 레벨 도달 가능해야 함

**합격 기준**: 80점 이상

## 검증 출력 해석

```
✅ whiskey: 0 errors, 0 warnings
```
→ 통과

```
❌ whiskey: 2 errors, 3 warnings
  - [ERROR] Result "버번" has empty condition
  - [ERROR] Result "아이리쉬" is unreachable
  - [WARNING] Question 3 has only 5/1 scoring
```
→ 에러 먼저 수정, 경고 순차 수정

## 수정 후 재검증

```bash
# 1. 수정 적용 후
node scripts/validate-test-data.mjs {subject}

# 2. 에러 0개 확인 후 빌드
npm run build

# 3. 빌드 성공 확인
```

## ⚠️ 재시도 제한 (필수!)

| 시도 | 결과 | 다음 행동 |
|------|------|----------|
| 1회차 | 실패 | 에러 분석 후 수정 |
| 2회차 | 실패 | 다른 접근법 시도 |
| 3회차 | 실패 | **즉시 중단 + 사용자에게 보고** |

**3회 실패 시 보고 형식:**
```
❌ {subject} 검증 실패 (3회 시도)

## 반복된 에러
- {에러 내용}

## 시도한 수정
1. {첫 번째 시도}
2. {두 번째 시도}
3. {세 번째 시도}

## 권장 조치
- {수동으로 확인해야 할 부분}
```

## 완료 보고 형식

```
✅ {subject} 테스트 검증 완료
- 검증: validate-test-data 통과 (에러 0, 경고 0)
- 빌드: 성공
- 품질 점수: 100/100
- 수정 파일: {파일 목록}
```

## 실패 시 보고 형식

```
⚠️ {subject} 테스트 검증 실패
- 에러: {에러 목록}
- 경고: {경고 목록}
- 필요 조치: {구체적 수정 방법}
```

절대로 검증 실패 상태로 작업 종료 금지!

## 인사이트 태그 검증 ⭐

### 검증 대상
테스트 생성/수정 후 반드시 `test-tag-mappings.ts` 검증 필요

### 검증 항목

| 항목 | 확인 내용 | 실패 시 |
|------|----------|--------|
| 매핑 등록 | `TEST_TAG_MAPPINGS`에 subject 등록됨 | 매핑 추가 |
| 차원 완전성 | 모든 dimensions가 매핑에 포함됨 | 누락된 차원 추가 |
| 태그 유효성 | 모든 태그가 `insight-tags.ts`에 정의됨 | 유효한 태그로 교체 |
| high/low 대칭 | 각 차원에 high, low 모두 있음 | 누락된 레벨 추가 |
| countsAsRelationship | 연애/관계 테스트는 `true` | 설정 수정 |

### 검증 방법

```bash
# 1. 매핑 등록 확인
grep "{subject}" src/data/insight/test-tag-mappings.ts

# 2. 태그 유효성 확인 (insight-tags.ts 참조)
# - personality: extroverted, introverted, logical, emotional, planned, spontaneous...
# - decision: practical, sentimental, adventurous, safe, cautious, solo, together...
# - relationship: competing, avoiding, accommodating, collaborating, compromising...
# - lifestyle: active, homebody, frugal, splurger, morning-person, night-owl...
```

### SSOT 참조
**태그 정의**: `src/data/insight/insight-tags.ts`
- 이 파일에 정의된 태그만 사용 가능
- 오타 시 **타입 에러** 발생 (컴파일 시 감지)

### 태그 매핑 검증 체크리스트

```
□ TEST_TAG_MAPPINGS에 {subject} 등록됨
□ dimensions의 모든 키가 매핑에 포함됨
□ 각 차원에 high, low 태그 배열 있음
□ 모든 태그가 insight-tags.ts에 정의된 값
□ 연애/관계 테스트면 countsAsRelationship: true
□ 빌드 성공 (타입 에러 없음)
```

### 에러 예시 및 수정

```typescript
// ❌ 에러: 잘못된 태그값
social: {
  high: ['extrovert'],  // 오타! 'extroverted'여야 함
  low: ['introvert'],   // 오타! 'introverted'여야 함
}

// ✅ 수정
social: {
  high: ['extroverted', 'expressive'],
  low: ['introverted', 'reserved'],
}
```

```typescript
// ❌ 에러: 차원 누락
// dimensions에 'planning' 있는데 매핑에 없음

// ✅ 수정: 누락된 차원 추가
planning: {
  high: ['planned', 'structured'],
  low: ['spontaneous', 'flexible'],
}
```
