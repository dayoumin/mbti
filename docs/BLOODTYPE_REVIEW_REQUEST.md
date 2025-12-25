# 혈액형 테스트 코드 리뷰 요청

> 작성일: 2025-12-25
> 작성자: Claude Opus 4.5
> 목적: 다른 AI 리뷰어의 객관적 검토 요청

---

## 1. 프로젝트 개요

### 시스템 목적
- MBTI/성격 테스트 앱의 "혈액형 성향 매칭" 기능
- 사용자가 질문에 답하면 혈액형 스타일(A/B/O/AB형) 결과 제공
- **주의**: 과학적 근거 없음 (엔터테인먼트 목적)

### 기술 스택
- Next.js 16 + TypeScript
- Tailwind CSS
- 자체 매칭 알고리즘

---

## 2. 검토 대상 파일

### 메인 테스트 데이터
```
src/data/subjects/bloodType.ts (370줄)
```

### 리서치 문서
```
research/bloodType.md (176줄)
```

### 관련 콘텐츠
```
src/data/content/quizzes/bloodtype-scenario.ts (시나리오 퀴즈 10문항)
src/data/content/polls/bloodtype-vs-polls.ts (VS 투표 10개)
```

---

## 3. 핵심 구현 사항

### 3.1 차원 설계 (6개)

| 키 | 이름 | 설명 | 근거 |
|----|------|------|------|
| organized | 계획성 | 꼼꼼함 vs 즉흥적 | A형 특성 |
| social | 사교성 | 내향 vs 외향 | O형 특성 |
| flexible | 유연성 | 원칙적 vs 융통성 | B형 특성 |
| express | 표현력 | 속마음 vs 직설적 | 감정 표현 |
| logical | 논리성 | 감정적 vs 이성적 | AB형 특성 (신규) |
| stable | 안정성 | 예민함 vs 안정 | A형 특성 (신규) |

### 3.2 질문 구성 (18개)

- 각 차원당 3개 질문
- **모든 질문에 중간점수(3) 포함** → MEDIUM 레벨 도달 가능

### 3.3 결과 유형 (13개)

#### 기본 4유형 (주요 혈액형)

| 결과 | 조건 | 설계 의도 |
|------|------|-----------|
| A형 스타일 | organized: high, flexible: low | 계획적 + 원칙적 |
| B형 스타일 | flexible: high, express: high, organized: low | 자유 + 솔직 + 비계획 |
| O형 스타일 | social: high, stable: high, organized: low | 사교 + 안정 + 대범 |
| AB형 스타일 | logical: high, social: low, organized: high | 논리 + 내향 + 계획 |

**설계 원칙**: 3개 조건 중 최소 1개는 반대 방향(low)으로 설정하여 극단적 결과 방지

#### 혼합 8유형

| 결과 | 조건 | 특징 |
|------|------|------|
| A형에 가까운 O형 | organized: high, social: high | 계획적 리더 |
| B형에 가까운 O형 | flexible: high, social: high | 자유롭고 활발 |
| 논리적 A형 | organized: high, logical: high | 완벽주의 분석가 |
| 균형잡힌 만능형 | organized: medium, social: medium, flexible: medium | MEDIUM 조건 |
| 예민한 완벽주의자 | organized: high, stable: low | 섬세 + 계획 |
| 쿨한 개인주의자 | stable: high, social: low | 독립적 + 안정 |
| 솔직한 행동파 | express: high, flexible: high | 직설 + 유연 |
| 내향적 자유인 | flexible: high, social: low | 자유 + 조용 |

#### 폴백 1유형

| 결과 | 조건 | 비고 |
|------|------|------|
| 폭넓은 적응형 | `{}` (빈 조건) | 다른 결과에 매칭 안 될 때 |

---

## 4. 매칭 알고리즘

### 점수 → 레벨 변환
```
점수 비율 = 점수 / (문항수 × 5) × 100
- HIGH: 70% 이상
- MEDIUM: 30~70%
- LOW: 30% 이하
```

### 매칭 우선순위
1. **완전 매칭**: 모든 조건이 일치하는 결과 중 조건이 가장 많은 것
2. **부분 매칭**: 가장 많은 조건이 일치하는 결과
3. **폴백**: 마지막 결과 (`condition: {}`)

---

## 5. 검증 결과

### validate-test-data.mjs
```
✓ bloodType
  경고 (2):
    • [결과] 조건 없는 결과 유형 존재 (fallback만 가능) - 폭넓은 적응형
    • [결과] 도달 불가능한 결과 유형 - 폭넓은 적응형
  정보:
    • 6개 차원, 18개 질문
    • 13개 결과 유형
    • 점수 분포: 5/1=0, 5/2=0, 기타=18 (모든 질문에 중간점수 포함)

통과: 1, 실패: 0, 총 오류: 0, 경고: 2
```

**경고 설명**: "폭넓은 적응형"은 의도된 폴백 결과로, 다른 모든 결과에 매칭되지 않을 때만 사용됨.

### npm run build
```
✓ Compiled successfully
✓ Generating static pages (21/21)
```

---

## 6. 리뷰 요청 사항

### 6.1 로직 검토
- [ ] 매칭 조건이 한국/일본의 혈액형 스테레오타입과 일치하는가?
- [ ] 모든 결과 유형이 현실적으로 도달 가능한가?
- [ ] 극단적 결과(3x high)가 없는지 확인

### 6.2 UX 검토
- [ ] 질문이 자연스럽고 이해하기 쉬운가?
- [ ] 결과 설명(interpretation, guide)이 적절한가?
- [ ] 18문항이 적절한 분량인가? (참고: vonvon 앱은 9문항)

### 6.3 윤리적 검토
- [ ] 특정 혈액형에 대한 차별적 표현이 없는가? (특히 B형)
- [ ] "과학적 근거 없음" 면책이 충분한가?
- [ ] 블러드 하라스먼트 우려가 없는가?

### 6.4 기술적 검토
- [ ] TypeScript 타입 정의가 올바른가?
- [ ] 코드 구조가 다른 테스트(cat, dog 등)와 일관성 있는가?
- [ ] 테마 컬러(bg-red-600)가 적절한가?

---

## 7. 참고 자료

### 학술 연구
1. 조소현, 서은국, 노연정. (2005). 혈액형별 성격특징에 대한 믿음과 실제 성격과의 관계
   - 결론: Big Five 성격검사와 혈액형 간 통계적으로 유의미한 관계 없음

2. Nawata, K. (2020). ABO Blood Type and Personality Traits: Evidence from Large-scale Surveys in Japan
   - 결론: 혈액형이 성격 변이의 0.3%만 설명 (통계 오차 수준)

### 벤치마크 앱
- vonvon 혈액형 테스트: 9문항, 16결과

---

## 8. 피드백 요청

이 구현에 대해 다음 관점에서 피드백 부탁드립니다:

1. **논리적 오류**: 매칭 로직이나 조건 설계에 문제가 있는가?
2. **누락된 고려사항**: 놓친 edge case나 시나리오가 있는가?
3. **개선 제안**: 더 나은 설계 방안이 있다면?
4. **윤리적 우려**: 문제가 될 수 있는 표현이나 설계가 있는가?

---

*이 문서는 Claude Opus 4.5가 작성했으며, 객관적인 리뷰를 위해 다른 AI 리뷰어에게 제출됩니다.*
