# Phase 2: 코드 리뷰 체크리스트 (다른 AI 검토용)

## 📋 리뷰 요청 개요

**작업**: Phase 2 깊이 제공 (InsightService 완성)
**파트**: 3개 (AI 리포트 + 응답 시간 수집 + 태그 확대)
**검증**: 38/38 테스트 통과, 빌드 성공
**배포**: 조건부 가능 (매핑 작업 필요)

**리뷰 목적**: 프로덕션 배포 전 Critical 이슈 발견

---

## 🔍 Part 1: AI 리포트 (InsightService Stage 7)

### 파일 위치
- **메인**: [src/services/InsightService.ts](../../src/services/InsightService.ts) (L750-970, ~220줄)
- **테스트**: [tests/phase2-review.test.ts](../../tests/phase2-review.test.ts)
- **문서**: [docs/handoff/PHASE2_COMPLETE_SUMMARY.md](./PHASE2_COMPLETE_SUMMARY.md)

### Critical 리뷰 포인트 (7개)

#### 1. OpenAI API 에러 핸들링 (L823-870)

**현재 구현**:
```typescript
try {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ /* ... */ }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return this.validateAndFormatAIResult(data.choices[0].message.content, input);
} catch (error) {
  console.error('[InsightService] AI 리포트 생성 실패:', error);
  return this.generateFallbackReport(input);
}
```

**질문**:
1. **타임아웃 설정 필요?**
   - 현재: 무제한 대기
   - 제안: `AbortController` + 30초 타임아웃?

2. **Rate limit 별도 처리?**
   - 현재: 일반 에러로 처리 → 폴백
   - 제안: 429 응답 시 재시도? (exponential backoff)

3. **JSON.parse 실패 시 재시도?**
   - 현재: 1회 시도 실패 → 폴백
   - 제안: 프롬프트에 "JSON만 반환" 강조 + 재시도 1회?

**판단 요청**: 타임아웃/재시도 로직이 필요한가?

---

#### 2. 신뢰도 계산 기준 적절성 (L911-919)

**현재 구현**:
```typescript
calculateConfidenceLevel(input: AIAnalysisInput): 'high' | 'medium' | 'low' {
  const total = input.activitySummary.totalActivities;
  if (total >= 30) return 'high';
  if (total >= 10) return 'medium';
  return 'low';
}
```

**질문**:
1. **30/10 기준 적절?**
   - 근거: 경험적 가정 (검증 없음)
   - 제안: 실사용자 분포 분석 후 조정?

2. **활동 종류별 가중치?**
   - 현재: 테스트/퀴즈/투표 동일 가중치
   - 제안: 테스트 1.5배, 퀴즈 1.0배, 투표 0.5배?

3. **활동 일수 고려?**
   - 현재: 총 개수만
   - 제안: `totalActivities / activeDays` (밀도)도 고려?

**판단 요청**: 가중치 차등 적용이 필요한가?

---

#### 3. 프롬프트 엔지니어링 최적화 (L833-883)

**현재 프롬프트** (일부):
```typescript
const prompt = `당신은 심리 분석 전문가입니다. 다음 활동 데이터를 바탕으로 사용자의 성격을 분석해주세요.

## 활동 요약
- 총 테스트: ${input.activitySummary.totalTests}개
- 총 퀴즈: ${input.activitySummary.totalQuizzes}개
...

## 분석 요청
다음 JSON 형식으로 응답해주세요:
{
  "coreIdentity": "핵심 정체성 (한 문장)",
  "keyTraits": [
    { "trait": "특성명", "emoji": "이모지", "description": "설명", "strength": "very-strong" }
  ],
  ...
}
`;
```

**질문**:
1. **토큰 최적화?**
   - 현재: ~500 토큰 (요청) + ~800 토큰 (응답) = 1300 토큰
   - 제안: 불필요한 설명 제거로 ~400 토큰?

2. **Few-shot 예시 추가?**
   - 현재: 없음
   - 제안: 1개 예시 추가 → 응답 품질 향상?

3. **JSON Schema 명시?**
   - 현재: 텍스트 설명만
   - 제안: `response_format: { type: "json_object" }` 사용?

**판단 요청**: Few-shot 예시가 비용 대비 효과적인가?

---

#### 4. 응답 검증 범위 (L885-909)

**현재 검증**:
```typescript
validateAndFormatAIResult(content: string, input: AIAnalysisInput): AIAnalysisResult {
  const parsed = JSON.parse(content);

  // 필수 필드 확인
  if (!parsed.coreIdentity || !parsed.keyTraits || /* ... */) {
    throw new Error('AI 응답이 필수 필드를 포함하지 않음');
  }

  // 배열 길이 제한
  if (parsed.keyTraits.length > 5) parsed.keyTraits = parsed.keyTraits.slice(0, 5);

  return parsed;
}
```

**질문**:
1. **문자열 길이 제한?**
   - 현재: 무제한
   - 제안: `coreIdentity.length <= 100`, `description.length <= 200`?

2. **유해 콘텐츠 필터링?**
   - 현재: 없음
   - 제안: 금지어 리스트 체크?

3. **이모지 유효성 검사?**
   - 현재: 없음
   - 제안: `/\p{Emoji}/u` 정규식 검증?

**판단 요청**: 유해 콘텐츠 필터링이 필요한가? (OpenAI 자체 필터 충분?)

---

#### 5. API 비용 최적화

**현재 사용**:
- 모델: `gpt-4o-mini`
- 요청당: ~1300 토큰 = $0.00026 (입력 $0.15/1M, 출력 $0.60/1M)
- DAU 1000명 가정: $0.26/일 = $95/년

**질문**:
1. **캐싱 전략?**
   - 제안: 동일 활동 데이터 → 24시간 캐시?

2. **모델 다운그레이드?**
   - 제안: `gpt-3.5-turbo` 사용 (70% 비용 절감)?

3. **배치 처리?**
   - 제안: 여러 요청 묶어서 처리?

**판단 요청**: 캐싱으로 비용 절감 가능한가?

---

#### 6. 응답 품질 모니터링

**현재 상태**: 품질 측정 없음

**제안**:
```typescript
// 응답 품질 로깅
const qualityMetrics = {
  hasAllFields: true,
  avgTraitDescLength: 85,
  sentimentScore: 0.8, // 긍정성
  responseTime: 2300, // ms
};

// 품질 저하 감지
if (qualityMetrics.avgTraitDescLength < 50) {
  console.warn('[InsightService] AI 응답 품질 저하 감지');
}
```

**판단 요청**: 품질 모니터링 인프라 필요한가?

---

#### 7. A/B 테스트 인프라

**현재 상태**: A/B 테스트 불가능

**제안**:
```typescript
// 버전 관리
const AI_REPORT_VERSION = 'v1.0';

// 실험군 분리
const useAI = input.activitySummary.totalActivities >= 10 && Math.random() < 0.5;
if (useAI) {
  return this.generateAIReport(input); // 실험군
} else {
  return this.generateFallbackReport(input); // 대조군
}

// 메트릭 수집
logABTestMetric({
  version: AI_REPORT_VERSION,
  group: useAI ? 'ai' : 'fallback',
  userId: input.activitySummary.userId,
});
```

**판단 요청**: A/B 테스트가 즉시 필요한가? (데이터 수집 후?)

---

## 🔍 Part 2: 응답 시간 수집

### 파일 위치
- **메인**: [src/app/page.tsx](../../src/app/page.tsx) (L102-103, L153-173, L223-238, L274-281)
- **서비스**: [src/services/ResultService.ts](../../src/services/ResultService.ts), [src/services/TursoService.ts](../../src/services/TursoService.ts)
- **API**: [src/app/api/test-results/route.ts](../../src/app/api/test-results/route.ts) (L55-60)
- **테스트**: [tests/phase2-response-time.test.ts](../../tests/phase2-response-time.test.ts)
- **문서**: [docs/handoff/PHASE2_RESPONSE_TIME_SUMMARY.md](./PHASE2_RESPONSE_TIME_SUMMARY.md)

### Critical 리뷰 포인트 (7개)

#### 1. 타이머 정확도 (page.tsx L274-281)

**현재 구현**:
```typescript
useEffect(() => {
  if (step === 'question') {
    setQuestionStartTime(Date.now()); // ← Date.now() 사용
  } else {
    setQuestionStartTime(null);
  }
}, [step, qIdx]);
```

**질문**:
1. **`Date.now()` vs `performance.now()`?**
   - Date.now(): 시스템 시간 (사용자가 시계 조정 시 영향)
   - performance.now(): 고정 기준점 (더 정확, 소수점)

2. **탭 전환 시 타이머 일시정지?**
   - 현재: 계속 진행
   - 제안: `document.visibilitychange` 이벤트로 일시정지?

**판단 요청**: `performance.now()` 전환이 필요한가?

---

#### 2. 아웃라이어 처리 (API route.ts L57-60)

**현재 구현**:
```typescript
validatedResponseTimes = responseTimes
  .filter(t => typeof t === 'number' && t >= 0 && t <= 3600000) // 1시간 초과 제거
  .map(t => Math.round(t));
```

**질문**:
1. **Z-score 필터링?**
   - 제안: `(t - mean) / stdDev > 3` 시 제거?

2. **IQR 방식?**
   - 제안: Q1 - 1.5*IQR ~ Q3 + 1.5*IQR 범위만 허용?

3. **질문별 정규화?**
   - 제안: `(개인 응답 - 질문 평균) / 표준편차`?

**판단 요청**: 통계적 아웃라이어 제거가 필요한가?

---

#### 3. 뒤로가기 동기화 (page.tsx L182)

**현재 구현**:
```typescript
const handleGoBack = () => {
  if (answers.length === 0) return;
  // ...
  setAnswers(prev => prev.slice(0, -1));
  setResponseTimes(prev => prev.slice(0, -1)); // ← 동기화
};
```

**질문**:
1. **동기화 검증 로직?**
   - 현재: 가정 (항상 동일 길이)
   - 제안: `if (answers.length !== responseTimes.length)` 경고?

2. **여러 번 뒤로가기?**
   - 제안: 최대 10회 제한?

**판단 요청**: 동기화 검증이 필요한가? (디버깅 모드만?)

---

#### 4. API 검증 엄격성 (route.ts L55-60)

**현재**: Silent filtering (범위 밖 값 제거)

**대안**: 에러 반환
```typescript
if (responseTimes.some(t => t < 0 || t > 3600000)) {
  return NextResponse.json(
    { error: 'Invalid response times detected' },
    { status: 400 }
  );
}
```

**판단 요청**: 클라이언트 버그 감지를 위해 엄격한 검증 필요?

---

#### 5. localStorage/Turso 불일치 (ResultService.ts L134-177)

**현재 시나리오**:
1. Turso 저장 실패
2. localStorage만 저장
3. `pending: true` 반환

**질문**:
1. **재시도 로직?**
   - 제안: 다음 테스트 시 pending 데이터 재전송?

2. **오프라인 모드?**
   - 제안: Service Worker로 대기열 관리?

**판단 요청**: 재시도 로직이 즉시 필요한가?

---

#### 6. 확신도 계산 알고리즘

**현재**: 미구현 (데이터만 수집)

**제안**:
```typescript
// 빠른 응답 = 확신도 높음?
const avgResponseTime = responseTimes.reduce((a,b)=>a+b,0) / responseTimes.length;

if (avgResponseTime < 2000) {
  confidenceWeight = 1.5; // ← 가정
} else if (avgResponseTime > 10000) {
  confidenceWeight = 1.2; // ← 가정
}
```

**질문**:
1. **빠른 응답 = 충동적 vs 확신?**
   - 심리학 문헌 근거?

2. **느린 응답 = 신중 vs 우유부단?**
   - 맥락 의존적?

**판단 요청**: 응답 시간 → 확신도 변환이 타당한가?

---

#### 7. 성능 영향 (page.tsx L162)

**현재 구현**:
```typescript
const newResponseTimes = [...responseTimes, responseTime]; // 배열 스프레드
setResponseTimes(newResponseTimes);
```

**대안**:
```typescript
setResponseTimes(prev => {
  const arr = [...prev];
  arr.push(responseTime);
  return arr;
});
```

**질문**: 질문 12~16개 수준에서 성능 차이 유의미한가?

**판단 요청**: 최적화 불필요? (React 권장 패턴 우선)

---

## 🔍 Part 3: 태그 확대

### 파일 위치
- **메인**: [src/data/insight/insight-tags.ts](../../src/data/insight/insight-tags.ts)
- **문서**: [docs/handoff/PHASE2_TAG_EXPANSION_REVIEW.md](./PHASE2_TAG_EXPANSION_REVIEW.md)

### Critical 리뷰 포인트 (5개)

#### 1. 태그 입도 적절성

**현재**: 100개 태그 (62개 → 100개)

**질문**:
1. **너무 많아서 혼란?**
   - 사용자 노출: 상위 10개만
   - 개발자: 카테고리별 분리

2. **유지보수 복잡도?**
   - 제안: 문서화 강화?

**판단 요청**: 100개가 적정선인가? (축소 필요?)

---

#### 2. 태그 간 상관관계

**잠재적 중복**:
- `spontaneous` ↔ `quick-decisive` (빠른 결정 = 즉흥?)
- `deliberate` ↔ `planned` (신중 = 계획?)
- `extroverted` ↔ `socially-confident` (외향 = 자신감?)

**제안**:
```python
# 실사용자 1000명 데이터로 상관계수 계산
import pandas as pd
corr_matrix = df.corr()
high_corr_pairs = corr_matrix[corr_matrix > 0.8]
```

**판단 요청**: 상관관계 분석 후 병합이 필요한가?

---

#### 3. 검증되지 않은 임계값

**가정**:
- `quick-decisive`: 응답 시간 < 2초
- `night-owl`: 22시~6시 활동 60%+

**제안**:
- 실사용자 분포 분석
- 백분위 기반 (상위/하위 20%)
- 문화권별 차이 고려

**판단 요청**: 임계값 A/B 테스트 우선순위?

---

#### 4. 매핑 미완료 (Critical)

**현재 상태**: ❌ test-tag-mappings.ts 없음

**영향**: 🔴 신규 태그가 실제로 수집되지 않음

**작업량**: 38개 테스트 × 12개 질문 = 456개 매핑

**판단 요청**:
- 수작업 vs 자동 생성 스크립트?
- 우선순위 테스트부터 순차 작업?

---

#### 5. 심리학적 타당성

**검증 필요**:
- `quick-decisive`: 인지 스타일 이론 근거?
- `empathetic`: Big Five 친화성 검증됨 ✅
- `instinctive`: 직감 vs 충동 구분?

**제안**: 심리학자 자문 or 문헌 조사

**판단 요청**: 전문가 리뷰 예산 확보 가능?

---

## 📋 종합 리뷰 체크리스트

### High Priority (배포 전 필수)

- [ ] **Part 1**: OpenAI API 타임아웃 설정 (30초)
- [ ] **Part 2**: performance.now() 전환 검토
- [ ] **Part 3**: test-tag-mappings.ts 작성 (456개)

### Medium Priority (데이터 수집 후)

- [ ] **Part 1**: 신뢰도 계산 가중치 조정 (A/B 테스트)
- [ ] **Part 2**: 응답 시간 임계값 검증 (1000명 데이터)
- [ ] **Part 3**: 태그 상관관계 분석 (r > 0.8 병합)

### Low Priority (향후 개선)

- [ ] **Part 1**: 프롬프트 Few-shot 예시 추가
- [ ] **Part 2**: localStorage 재시도 로직
- [ ] **Part 3**: 심리학 전문가 리뷰

---

## 🎯 리뷰 결과 기대

**질문**:
1. 프로덕션 배포 가능한가?
2. Critical 이슈가 있는가?
3. 우선순위 조정이 필요한가?

**요청 사항**:
- 각 Critical 포인트에 대한 판단
- 배포 전 필수 수정 항목 리스트
- 추가 테스트 케이스 제안

---

**작성일**: 2025-12-27
**작성자**: Claude Sonnet 4.5
**검토 요청 대상**: 다른 AI (Claude, GPT, Gemini 등)
**예상 검토 시간**: 30~60분
