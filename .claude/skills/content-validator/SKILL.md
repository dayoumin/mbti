---
name: content-validator
description: 퀴즈/투표/토너먼트 콘텐츠 검증. 생성된 콘텐츠의 품질 검사 및 문제점 발견.
allowed-tools: Read, Bash, Grep, Glob
---

# 콘텐츠 검증기 (Quiz/Poll/Tournament)

## 목적
생성된 퀴즈/투표/토너먼트 콘텐츠의 품질을 검증합니다.

## 검증 명령어

```bash
node scripts/validate-content-samples.mjs
```

## 검증 항목

### 1. 공통 검증

| 항목 | 에러/경고 | 기준 |
|------|----------|------|
| id 누락 | 에러 | 필수 |
| id 중복 | 에러 | 고유해야 함 |
| category 유효성 | 에러 | 허용된 값만 |
| question/title 누락 | 에러 | 필수 |
| options 최소 개수 | 에러 | 2개 이상 |
| tags 누락 | 경고 | 권장 |

### 2. 퀴즈 검증 (type: 'knowledge')

| 항목 | 에러/경고 | 기준 |
|------|----------|------|
| 정답 없음 | 에러 | isCorrect: true 1개 필수 |
| 정답 여러 개 | 에러 | isCorrect: true 1개만 |
| explanation 누락 | 경고 | 권장 |
| difficulty 범위 | 에러 | 1, 2, 3 중 하나 |
| points 범위 | 경고 | 10, 15, 20 권장 |

### 3. 시나리오 퀴즈 검증

| 항목 | 에러/경고 | 기준 |
|------|----------|------|
| questions 최소 개수 | 에러 | 3개 이상 |
| results 최소 개수 | 에러 | 2개 이상 |
| 점수 범위 갭 | 경고 | 연속해야 함 |
| 최대 점수 불일치 | 경고 | 계산된 값과 일치해야 함 |
| 도달 불가 등급 | 에러 | 모든 등급 도달 가능해야 함 |

### 4. 투표 검증

| 항목 | 에러/경고 | 기준 |
|------|----------|------|
| VS 옵션 개수 | 에러 | 정확히 2개 |
| choice 옵션 개수 | 경고 | 3-5개 권장 |
| emoji 누락 | 경고 | 권장 |

### 5. 토너먼트 검증

| 항목 | 에러/경고 | 기준 |
|------|----------|------|
| 참가자 부족 | 에러 | contestants.length ≥ roundSize |
| roundSize 유효성 | 에러 | 4, 8, 16, 32, 64 중 하나 |
| 중복 contestant id | 에러 | 모두 고유해야 함 |
| description 누락 | 경고 | 각 참가자에 권장 |
| funFact 누락 | 경고 | 결과 화면용 권장 |
| tags 누락 | 경고 | 필터/검색용 권장 |
| 여유 참가자 없음 | 경고 | roundSize보다 많이 권장 |

## 점수 범위 검증 로직

```javascript
// 시나리오 퀴즈 최대 점수 계산
const maxPossibleScore = scenario.questions.reduce((sum, q) => {
  const maxPoints = Math.max(...q.options.map(o => o.points));
  return sum + maxPoints;
}, 0);

// 점수 범위 연속성 검증
const sortedResults = [...scenario.results].sort((a, b) => a.minScore - b.minScore);
let prevMax = -1;
for (const result of sortedResults) {
  if (result.minScore !== prevMax + 1 && prevMax !== -1) {
    console.warn(`점수 범위 갭: ${prevMax} ~ ${result.minScore}`);
  }
  prevMax = result.maxScore;
}
```

## 검증 결과 형식

```
=== 콘텐츠 샘플 검증 결과 ===

✅ 퀴즈 10개 검증 완료
✅ 시나리오 퀴즈 1개 검증 완료
✅ VS 투표 10개 검증 완료
✅ 선택 투표 5개 검증 완료
✅ 토너먼트 1개 검증 완료

=== 요약 ===
총 콘텐츠: 27
유효: 27
무효: 0
경고 있음: 3

=== ⚠️ 경고 목록 ===
[quiz] cat-quiz-005: [ 'tags 권장' ]
[scenario] cat-scenario-butler: [ '최대 가능 점수(80)와 최고 등급 maxScore(75) 불일치' ]
[tournament] cat-breed-worldcup-v1: [ '참가자 수가 정확히 라운드 수와 같음 - 여유 참가자 추가 권장' ]

✨ 검증 완료!
```

## 에러 수정 가이드

### 정답 없음 (퀴즈)
```diff
options: [
  { id: 'a', text: '선택지 A', isCorrect: false },
- { id: 'b', text: '선택지 B', isCorrect: false },
+ { id: 'b', text: '선택지 B', isCorrect: true },
  { id: 'c', text: '선택지 C', isCorrect: false },
]
```

### 점수 범위 갭 (시나리오)
```diff
results: [
  { minScore: 0, maxScore: 20, grade: 'C', ... },
- { minScore: 25, maxScore: 40, grade: 'B', ... },  // 21-24 갭 발생
+ { minScore: 21, maxScore: 40, grade: 'B', ... },  // 연속
  { minScore: 41, maxScore: 60, grade: 'A', ... },
]
```

### 참가자 부족 (토너먼트)
```diff
// 16강인데 참가자 14명
roundSize: 16,
contestants: [
  // ... 14명
+ { id: 'extra-1', name: '추가 참가자 1', ... },
+ { id: 'extra-2', name: '추가 참가자 2', ... },
]
```

## 검증 스크립트 위치

```
scripts/validate-content-samples.mjs
```

## 자동 수정 지원

검증기는 문제점을 발견만 합니다. 수정은 content-generator 스킬 또는 수동으로 진행합니다.

## ⚠️ 재시도 제한 (필수!)

| 시도 | 결과 | 다음 행동 |
|------|------|----------|
| 1회차 | 실패 | 에러 분석 후 수정 |
| 2회차 | 실패 | 다른 접근법 시도 |
| 3회차 | 실패 | **즉시 중단 + 사용자에게 보고** |

**3회 실패 시 보고 형식:**
```
❌ 콘텐츠 검증 실패 (3회 시도)

## 해결 안 된 에러
- {에러 목록}

## 시도한 수정
1. {첫 번째 시도}
2. {두 번째 시도}
3. {세 번째 시도}

## 권장 조치
- {수동으로 확인해야 할 부분}
```

## 체크리스트

### 검증 전
- [ ] 파일이 올바른 위치에 있음
- [ ] TypeScript 타입 에러 없음 (`npm run build`)

### 검증 후
- [ ] 에러 0개
- [ ] 경고 검토 및 가능하면 수정
- [ ] 다시 빌드 확인
