# Phase 2 Part 2: 응답 시간 수집 인프라 - 완료 보고서


## Critical ?? ??? 7?? (??)
1. ??? ???: `Date.now()`? ??? ?? ?? ??? ?? `performance.now()` ?? ??? ??? ?? ?? ??.
2. ????? ?? ??: ?? ??(???? ??/??) ?? ??(Z-score/IQR ?)? ?? ?? ?? ?? ??.
3. ???? ??? ??: `answers`? `responseTimes` ?? ??? ??? ? ?? ?? ?? ??.
4. API ?? ???: ?? silent filtering?? ?? ??/?? ?? ? ?? ?? ?? ?? ??.
5. localStorage/Turso ???: Turso ?? ? ?? ??/??? ???, ???? ?? ?? ?? ??.
6. ??? ?? ????: ?? ?? ?? ??? ??(??/?? ?? ??)? ?? ?? ?? ??.
7. ?? ??: ? ???? ?? ?? ??? ???? ??? ?? ?? ?? ?? ??.
## 🎉 완료! (2025-12-27)

**작업**: Phase 2 깊이 제공 - 응답 시간 수집 인프라 구현
**목적**: 각 질문별 응답 시간을 수집하여 향후 InsightService의 확신도 계산에 활용

---

## ✅ 완료된 작업

### 📁 수정 파일 (5개)

#### 1. src/data/types.ts ✅
**변경**: ResultMeta 인터페이스에 응답 시간 필드 추가

```typescript
interface ResultMeta {
  user_agent: string;
  screen_width: number;
  timestamp: number;
  // === 응답 시간 (Phase 2: 확신도 계산용) ===
  response_time_ms?: number[];  // 각 질문별 응답 시간 (밀리초)
}
```

**효과**: 타입 안전성 보장, TypeScript 컴파일 단계에서 구조 검증

---

#### 2. src/app/page.tsx ✅
**변경**: 8개 수정 사항

##### (1) useEffect import 추가 (L3)
```typescript
import { useState, useCallback, useEffect } from 'react';
```

##### (2) 상태 변수 추가 (L102-103)
```typescript
// 응답 시간 추적 (Phase 2: 확신도 계산용)
const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
const [responseTimes, setResponseTimes] = useState<number[]>([]);
```

**설계 결정**: Answer 인터페이스 수정 금지 → 별도 상태로 관리

##### (3) handleAnswer 수정 (L153-173)
```typescript
const handleAnswer = (dimension: string, scoreVal: number) => {
    // 응답 시간 계산
    const responseTime = questionStartTime
        ? Math.max(0, Math.min(3600000, Date.now() - questionStartTime)) // 0ms~1시간
        : 0;

    // 응답 시간 배열에 추가
    const newResponseTimes = [...responseTimes, responseTime];
    setResponseTimes(newResponseTimes);

    // 기존 로직...
    if (qIdx + 1 < maxQuestions) {
        setQIdx(qIdx + 1);
    } else {
        calculateResult(newScores, newResponseTimes); // 파라미터 추가
    }
};
```

**핵심 로직**:
- `Math.max(0, ...)`: 음수 방지
- `Math.min(3600000, ...)`: 1시간 초과 제한
- `questionStartTime === null`: 0ms 기록

##### (4) handleGoBack 수정 (L182)
```typescript
setResponseTimes(prev => prev.slice(0, -1)); // 응답 시간 롤백
```

**일관성**: answers 배열과 동기화 (함께 증가, 함께 감소)

##### (5) handleStartTest 초기화 (L149-150)
```typescript
setResponseTimes([]); // 응답 시간 초기화
setQuestionStartTime(null); // 타이머 초기화
```

##### (6) restart 초기화 (L262-263)
```typescript
setResponseTimes([]); // 응답 시간 초기화
setQuestionStartTime(null); // 타이머 초기화
```

##### (7) calculateResult 파라미터 추가 (L223)
```typescript
const calculateResult = (finalScores: Record<string, number>, finalResponseTimes: number[]) => {
    // ...
    await resultService.saveResult(mode, result, finalScores, isDeepMode, parentInfo || undefined, finalResponseTimes);
}
```

##### (8) useEffect 타이머 자동 시작 (L274-281)
```typescript
// 타이머 자동 시작: 질문 화면 진입 시 또는 질문 변경 시
useEffect(() => {
    if (step === 'question') {
        setQuestionStartTime(Date.now());
    } else {
        setQuestionStartTime(null);
    }
}, [step, qIdx]);
```

**효과**: 수동 타이머 관리 불필요, 모든 경로(다음/이전/딥모드) 자동 처리

---

#### 3. src/services/ResultService.ts ✅
**변경**: 6개 수정 사항

##### (1) TestResultData 인터페이스 (L34-39)
```typescript
meta: {
    user_agent: string;
    screen_width: number;
    timestamp: number;
    response_time_ms?: number[]; // 추가
};
```

##### (2) TestResultCamel 인터페이스 (L54-59)
```typescript
meta: {
    userAgent: string;
    screenWidth: number;
    timestamp: number;
    responseTimeMs?: number[]; // 추가
};
```

##### (3) saveResult 파라미터 추가 (L120-126)
```typescript
async saveResult(
    testType: string,
    result: ResultLabel,
    scores: Record<string, number>,
    isDeep = false,
    parentInfo?: { testType: string; resultName: string },
    responseTimes?: number[] // 추가
): Promise<SaveResult>
```

##### (4) TursoService 호출 (L134-142)
```typescript
const tursoResult = await tursoService.saveTestResult(
    testType,
    result.name,
    result.emoji,
    scores,
    isDeep,
    parentInfo,
    timestamp,
    responseTimes // 8번째 파라미터
);
```

##### (5) localStorage 저장 (L158-163)
```typescript
meta: {
    user_agent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
    screen_width: typeof window !== 'undefined' ? window.innerWidth : 0,
    timestamp: Date.now(),
    response_time_ms: responseTimes || [], // 추가
},
```

##### (6) camelCase 변환 (L222-227)
```typescript
meta: {
    userAgent: r.meta.user_agent,
    screenWidth: r.meta.screen_width,
    timestamp: r.meta.timestamp,
    responseTimeMs: r.meta.response_time_ms, // 추가
},
```

**중요**: Turso 데이터와 localStorage 데이터 병합 시 일관된 구조 유지

---

#### 4. src/services/TursoService.ts ✅
**변경**: 파라미터 및 요청 body 추가

##### saveTestResult 파라미터 (L337-345)
```typescript
async saveTestResult(
    testType: string,
    resultName: string,
    resultEmoji: string,
    scores: Record<string, number>,
    isDeepMode: boolean = false,
    parentInfo?: { testType: string; resultName: string },
    timestamp?: string,
    responseTimes?: number[] // 추가
): Promise<{ success: boolean; id?: string }>
```

##### API 요청 (L351-360)
```typescript
body: JSON.stringify({
    deviceId: getDeviceId(),
    testType,
    resultName,
    resultEmoji,
    scores,
    isDeepMode,
    parentInfo,
    timestamp,
    responseTimes, // 추가
}),
```

---

#### 5. src/app/api/test-results/route.ts ✅
**변경**: 요청 파싱 및 검증 로직 추가

##### 요청 body 파싱 (L27-36)
```typescript
const {
    deviceId,
    testType,
    resultName,
    resultEmoji,
    scores,
    isDeepMode,
    parentInfo,
    timestamp: clientTimestamp,
    responseTimes, // 추가
} = body;
```

##### 검증 로직 (L55-61)
```typescript
// Phase 2: 응답 시간 검증 (선택적)
let validatedResponseTimes: number[] | undefined;
if (responseTimes && Array.isArray(responseTimes)) {
    validatedResponseTimes = responseTimes
        .filter(t => typeof t === 'number' && t >= 0 && t <= 3600000) // 0ms ~ 1시간
        .map(t => Math.round(t)); // 정수로 변환
}
```

**검증 규칙**:
1. 배열 타입 확인
2. 숫자 타입만 허용
3. 0 ≤ t ≤ 3,600,000ms (1시간)
4. 반올림 (정수 변환)

##### DB 저장 (L72-77)
```typescript
JSON.stringify({
    emoji: resultEmoji,
    scores,
    isDeepMode,
    meta: validatedResponseTimes ? { response_time_ms: validatedResponseTimes } : undefined,
}),
```

**저장 전략**: scores JSON 내부에 meta 객체로 저장 (DB 스키마 변경 불필요)

---

## 🧪 검증 결과

### 1. 빌드 검증 ✅
```bash
npm run build
```
- TypeScript: ✅ 0 에러
- 콘텐츠: ✅ 439개 통과
- Next.js: ✅ 빌드 성공

### 2. 단위 테스트 ✅
```bash
npx vitest run tests/phase2-response-time.test.ts
```
**결과**: **22/22 통과 (100%)** 🎉

| 카테고리 | 테스트 | 상태 |
|----------|--------|------|
| 타이머 로직 | 4/4 | ✅ |
| 배열 관리 | 3/3 | ✅ |
| API 검증 | 5/5 | ✅ |
| 데이터 구조 | 3/3 | ✅ |
| 엣지 케이스 | 4/4 | ✅ |
| 통합 시나리오 | 3/3 | ✅ |

**테스트 커버리지**:
- ✅ 정상 응답 시간 계산
- ✅ 음수 방지 (null 처리)
- ✅ 1시간 초과 제한
- ✅ 배열 추가/제거/초기화
- ✅ API 검증 (범위, 타입, 반올림)
- ✅ localStorage/Turso 데이터 구조
- ✅ 뒤로가기 롤백
- ✅ 테스트 재시작

---

## 📊 데이터 흐름

```
사용자 액션                    상태 관리                  저장
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
질문 표시 (useEffect)  →  questionStartTime = now
    ↓
사용자 선택
    ↓
handleAnswer          →  responseTime = now - start
                      →  responseTimes.push(responseTime)
                      →  answers.push({qIdx, dim, score})
    ↓
마지막 질문?
    ↓
calculateResult       →  (finalScores, finalResponseTimes)
    ↓
resultService.saveResult  →  (mode, result, scores, ..., responseTimes)
    ↓
├─ TursoService       →  API POST /test-results
│                         { ..., responseTimes }
│                         ↓
│                     API route 검증 (0~3600000ms)
│                         ↓
│                     DB INSERT scores = JSON.stringify({
│                         emoji, scores, isDeepMode,
│                         meta: { response_time_ms }
│                     })
│
└─ localStorage       →  meta: { response_time_ms: [...] }
```

---

## 🎯 핵심 설계 결정

### 1. Answer 인터페이스 수정 금지
**이유**: 여러 곳에서 사용되어 변경 영향 범위가 큼
**해결**: 별도 상태 배열(`responseTimes`) 관리 → 마지막에 병합

### 2. useEffect로 타이머 자동 시작
**이유**: 수동 관리 시 다양한 경로(다음/이전/딥모드)에서 누락 위험
**해결**: `[step, qIdx]` 의존성 → 질문 변경마다 자동 시작

### 3. DB 스키마 변경 최소화
**이유**: ALTER TABLE 없이 즉시 배포
**해결**: scores JSON 내부에 meta 객체로 저장

### 4. 범위 제한 (0 ~ 3600000ms)
**이유**: 비정상 값(음수, 무한대) 방지
**해결**: `Math.max(0, Math.min(3600000, ...))`

### 5. 선택적 파라미터 (optional)
**이유**: 기존 코드 호환성 유지
**해결**: `responseTimes?: number[]` 모든 곳에서 선택적

---

## 🔍 Critical 리뷰 포인트 (다른 AI 검토 필요)

### 1. 타이머 정확도
**현재**: `Date.now()` 사용 (밀리초)
**질문**:
- Performance API (`performance.now()`) 사용이 더 정확한가?
- 사용자가 탭 전환 시 타이머 일시정지 필요?
- `document.visibilityState` 고려해야 하는가?

**참고**: `Date.now()`는 시스템 시간 변경 영향 받음

### 2. 응답 시간 아웃라이어 처리
**현재**: 1시간 초과만 제한
**질문**:
- 매우 느린 응답(예: 10분 이상)은 이상치로 처리해야 하는가?
- Z-score 또는 IQR 방식으로 아웃라이어 제거?
- 아니면 원본 데이터 그대로 저장 후 분석 단계에서 처리?

**현재 방식**: 원본 데이터 보존 (분석 단계 유연성)

### 3. 뒤로가기 롤백 정확성
**현재**: `slice(0, -1)` (마지막 항목만 제거)
**질문**:
- 사용자가 여러 번 뒤로가기 시 정확히 동기화되는가?
- `answers.length !== responseTimes.length` 상태 발생 가능성?
- 동기화 검증 로직 필요?

**현재 구현**: answers와 responseTimes 항상 1:1 대응 가정

### 4. API 검증 엄격성
**현재**: 범위 밖 값 필터링 (제거)
**질문**:
- 필터링 시 로그 기록 필요?
- 질문 개수와 배열 길이 불일치 시 에러 반환?
- 클라이언트 버그 감지를 위한 서버 검증 강화?

**현재 방식**: 조용한 필터링 (silent filtering)

### 5. localStorage와 Turso 불일치 가능성
**현재**: 동일 timestamp 사용하여 중복 방지
**질문**:
- Turso 실패 시 localStorage만 저장 → 나중에 동기화?
- 오프라인 모드 고려?
- pending 상태 플래그 추가 필요?

**현재**: Turso 실패 시 `pending: true` 반환 (기존 로직)

### 6. 확신도 계산 알고리즘
**현재**: 미구현 (데이터만 수집)
**질문**:
- 빠른 응답 = 높은 확신도 가중치?
- 느린 응답 = 신중한 선택 = 더 중요?
- 평균 대비 편차로 계산?

**향후 작업**: InsightService에서 활용

### 7. 성능 영향
**현재**: 매 답변마다 배열 스프레드 연산
**질문**:
- `[...responseTimes, newTime]` vs `push()` 성능 차이?
- 질문 개수(12~16개) 수준에서 유의미한가?
- useMemo/useCallback 최적화 필요?

**현재**: React 권장 패턴(immutability) 우선

---

## 📈 예상 효과

### 즉시 효과
- ✅ **데이터 수집 인프라 완성**: 모든 테스트 결과에 응답 시간 자동 저장
- ✅ **타입 안전성**: TypeScript로 구조 검증
- ✅ **테스트 커버리지**: 22개 단위 테스트

### 향후 활용 (Phase 2 후속)
- 📊 **확신도 계산**: 빠른 응답 → 높은 가중치
- 📊 **응답 패턴 분석**: "밤샘 활동" 감지 (timestamp + response_time)
- 📊 **질문 난이도 추정**: 평균 응답 시간으로 어려운 질문 식별
- 📊 **이상 행동 감지**: 너무 빠르거나 느린 응답 → 봇 필터링

### 비즈니스 임팩트 (예상)
- **인사이트 정밀도 향상**: 확신도 가중치로 더 정확한 분석
- **재방문율 +5~10%**: 개인화된 확신도 리포트
- **데이터 품질**: 응답 품질 검증 지표 확보

---

## 📝 학습 포인트

### 잘된 점 ✅
- ✅ **비침습적 설계**: Answer 인터페이스 수정 없이 별도 상태 관리
- ✅ **자동화**: useEffect로 타이머 수동 관리 불필요
- ✅ **DB 스키마 보존**: scores JSON 내부 저장으로 즉시 배포 가능
- ✅ **일관성**: answers와 responseTimes 병렬 관리 (동기화 유지)
- ✅ **테스트 주도**: 22개 단위 테스트로 모든 경로 검증

### 개선 영역 ⚠️
- ⚠️ **Performance API 검토**: `Date.now()` vs `performance.now()` 정확도 비교
- ⚠️ **아웃라이어 처리**: 분석 단계에서 이상치 제거 로직 필요
- ⚠️ **동기화 검증**: `answers.length === responseTimes.length` 체크 추가?
- ⚠️ **오프라인 모드**: Turso 실패 시 재시도 로직 강화?

---

## 🚀 다음 단계

### Phase 2 Part 3: 태그 매핑 확대 (다음 작업)
**목표**: 인사이트 태그 60개 → 100개 확장

**작업 내역**:
1. `src/data/insight/insight-tags.ts` 확장
2. `src/data/insight/test-tag-mappings.ts` 매핑 추가
3. 선택지별 태그 자동 추출 로직 강화

**예상 효과**: Stage 2~6 인사이트 정밀도 향상

### 선택적 후속 작업
- **응답 시간 시각화**: 대시보드에 평균 응답 시간 그래프
- **확신도 계산 구현**: InsightService Stage 7에서 활용
- **A/B 테스트**: 응답 시간 수집 on/off 효과 비교

---

## 📞 리뷰 요청 사항

### 외부 AI에게 검토 요청
**문서**: 이 파일 (`PHASE2_RESPONSE_TIME_SUMMARY.md`)

**Critical 리뷰 포인트**:
1. 타이머 정확도 (Date.now vs performance.now)
2. 응답 시간 아웃라이어 처리 전략
3. 뒤로가기 롤백 동기화 검증 필요성
4. API 검증 엄격성 (조용한 필터링 vs 에러 반환)
5. localStorage/Turso 불일치 시나리오
6. 확신도 계산 알고리즘 설계
7. 성능 영향 (배열 스프레드 vs push)

**질문**:
- 현재 구현에서 치명적 결함이 있는가?
- 프로덕션 배포 전 반드시 수정해야 할 부분은?
- 놓친 엣지 케이스가 있는가?

---

## 📋 체크리스트

### 코드 변경
- [x] types.ts: ResultMeta 타입 추가
- [x] page.tsx: 타이머 로직 (8개 수정)
- [x] ResultService.ts: 파라미터 및 저장 로직 (6개 수정)
- [x] TursoService.ts: API 요청 파라미터 추가
- [x] API route: 요청 파싱 및 검증 로직

### 검증
- [x] npm run build (빌드 성공)
- [x] 단위 테스트 22/22 통과
- [x] TypeScript 타입 에러 0개
- [x] 콘텐츠 검증 439개 통과

### 문서
- [x] 코드 리뷰 문서 작성
- [x] Critical 리뷰 포인트 정리
- [x] 데이터 흐름 다이어그램
- [x] 설계 결정 사항 문서화

---

**작성일**: 2025-12-27
**작성자**: Claude Sonnet 4.5
**Status**: ✅ Phase 2 Part 2 완료, 외부 AI 리뷰 준비 완료
