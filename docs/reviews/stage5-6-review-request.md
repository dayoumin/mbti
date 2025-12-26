# Stage 5-6 인사이트 구현 리뷰 요청

## 개요
- **작업자**: Claude (AI)
- **작업일**: 2024-12-26
- **목적**: 인사이트 시스템 Stage 5 (관계 패턴), Stage 6 (숨은 패턴) 구현

---

## 변경 파일 (4개)

### 신규 파일

#### 1. `src/data/insight/stage5-relationship-pattern.ts`
**역할**: Stage 5 관계 패턴 분석 로직

**주요 기능**:
- TKI 갈등 스타일 분석 (5가지: competing, avoiding, accommodating, collaborating, compromising)
- 3개 축 점수 계산:
  - 친밀도: close-bonding ↔ space-needing
  - 배려 방향: self-first ↔ other-first
  - 소통 스타일: assertive ↔ diplomatic
- 8개 관계 프로필 매칭

**리뷰 포인트**:
- [ ] TKI 모델 적용이 적절한가?
- [ ] 프로필 매칭 로직이 합리적인가?
- [ ] 축 점수 계산 공식이 올바른가?

---

#### 2. `src/data/insight/stage6-hidden-pattern.ts`
**역할**: Stage 6 숨은 패턴 분석 로직

**주요 기능**:
- **모순 패턴 발견**: 12개 규칙, 양쪽 태그가 모두 2개 이상이고 비율이 2배 이내면 "모순"
- **희귀 조합 발견**: 10개 규칙, 태그 조합이 통계적으로 드문 경우 표시
- **일관성 분석**: 0-100점, 상위 3개 태그 집중도 + 모순 개수 + 태그 다양성 기반

**리뷰 포인트**:
- [ ] 모순 판정 기준 (2개 이상, 2배 이내)이 적절한가?
- [ ] 희귀 조합 퍼센티지가 근거 있는가? (현재 추정치)
- [ ] 일관성 점수 공식이 합리적인가?

---

### 수정 파일

#### 3. `src/services/InsightService.ts`
**변경 내용**:
- import 추가 (stage5, stage6)
- `getStage5Insight()` 메서드 추가 (659-678줄)
- `getStage6Insight()` 메서드 추가 (685-702줄)

**리뷰 포인트**:
- [ ] Stage 해금 체크가 올바른가?
- [ ] 태그 충분성 체크 조건이 적절한가?

---

#### 4. `tests/insight-stage5-6.test.ts` (신규)
**테스트 수**: 48개 (모두 통과)

**커버리지**:
- Stage 5: TKI 정의, 프로필 정의, 점수 계산, 프로필 매칭, 결과 생성
- Stage 6: 모순 룰, 희귀 조합, 일관성 분석, 특성 추출, 결과 생성
- 통합: 3개 시나리오 테스트

---

## 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    InsightService                        │
│  getStage5Insight() ──→ generateRelationshipPatternResult│
│  getStage6Insight() ──→ generateHiddenPatternResult     │
└──────────────┬──────────────────────────────────────────┘
               │ getTagCounts()
               ▼
┌─────────────────────────────────────────────────────────┐
│                   Tag Counts                             │
│  { extroverted: 5, competing: 3, ... }                  │
└─────────────────────────────────────────────────────────┘
               ▲
               │ EventBus 구독
               │
┌─────────────────────────────────────────────────────────┐
│              test-tag-mappings.ts                        │
│  extractTagsFromTestResult(subject, result)             │
└─────────────────────────────────────────────────────────┘
```

---

## 해금 조건

| Stage | 해금 조건 | 데이터 소스 |
|-------|----------|------------|
| 5 관계 패턴 | 관계 활동 10개 | RELATIONSHIP_TAGS |
| 6 숨은 패턴 | 총 활동 30개 | 전체 태그 |

---

## 주요 설계 결정

### 1. TKI 갈등 모델 채택 (Stage 5)
- **이유**: 심리학적으로 검증된 모델 (40년+, 1천만 부 판매)
- **한계**: 연구 도구로서는 논란, 실용적 인사이트용으로 적합

### 2. 모순 판정 기준 (Stage 6)
```typescript
// 양쪽 모두 2개 이상 AND 비율 2배 이내
if (leftCount >= 2 && rightCount >= 2) {
  const ratio = max / min;
  if (ratio <= 2) → 모순으로 판정
}
```
- **이유**: 너무 느슨하면 노이즈, 너무 엄격하면 발견 없음
- **검토 필요**: 2배 기준이 적절한지

### 3. 일관성 점수 공식 (Stage 6)
```
기본 50점
+ 상위3개 태그가 60% 이상: +25점
+ 모순 0개: +15점
- 모순 3개 이상: -20점
- 태그 15종류 이상: -10점
```
- **리뷰 필요**: 가중치가 적절한지

---

## 테스트 결과

```
✓ tests/insight-stage5-6.test.ts (48 tests) 11ms

Test Files  1 passed
Tests       48 passed
```

---

## 빌드 결과

```
✓ Build succeeded
✓ No TypeScript errors
✓ All 48 tests passed
```

---

## 질문 사항

1. **희귀 조합 퍼센티지**: 현재 추정치로 설정 (3%~22%). 실제 데이터 기반으로 조정 필요?

2. **일관성 vs 다면성**: 현재 "일관성 낮음 = 다면적 성격"으로 긍정적 해석. 이 방향이 맞는가?

3. **태그 최소 개수**: Stage 6에서 최소 10개 태그 기록 필요로 설정. 적절한가?

---

## 관련 파일

- Stage 3-4 구현: [stage3-decision-style.ts](../../src/data/insight/stage3-decision-style.ts), [stage4-interest-map.ts](../../src/data/insight/stage4-interest-map.ts)
- 태그 SSOT: [insight-tags.ts](../../src/data/insight/insight-tags.ts)
- 테스트 태그 매핑: [test-tag-mappings.ts](../../src/data/insight/test-tag-mappings.ts)
