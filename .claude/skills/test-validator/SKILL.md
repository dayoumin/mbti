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

## 품질 기준 (100점 만점)

| 항목 | 배점 | 기준 |
|------|------|------|
| 에러 0개 | 40점 | 필수 |
| 경고 0개 | 20점 | 권장 |
| 중간점수 비율 | 20점 | 40% 이상 |
| 결과 도달률 | 20점 | 100% |

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
