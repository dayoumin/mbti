# 인사이트 시스템 통합 리뷰 요청

> 다른 AI(ChatGPT, Claude, Perplexity)에게 보낼 최종 검토 요청문
> 작성일: 2024-12-25
> 두 개의 딥리서치 결과를 통합

---

## 프로젝트 배경

성격 테스트/퀴즈/투표 앱에서 **사용자가 활동할수록 자신에 대해 알게 되는** 인사이트 시스템을 설계했습니다.

### 핵심 차별화
| 일반 AI 채팅 | 우리 앱 |
|-------------|--------|
| "나 분석해줘" → 한 번 대화로 끝 | 테스트+퀴즈+투표 → 데이터 축적 |
| 사용자가 "말한 것" 분석 | 사용자가 "행동한 것" 분석 |
| 자기 인식 편향 그대로 | 무의식적 선택 패턴 발견 |

---

## 두 개의 딥리서치 결과 요약

### A. Claude 조사 결과

**1. 심리학적 근거**
- Big Five: 2024년 메타분석 (43,715명) - 가장 검증된 모델
- TKI: Test-retest 0.61-0.68 - 실용적 인사이트용 적합
- 반려동물-성격: Texas 대학 4,565명 - 개 주인 외향성+15%, 고양이 주인 개방성+11%

**2. 게이미피케이션**
- 게이미피케이션 앱 리텐션 +22%
- 퀴즈 완료율 78% (비주얼 스토리텔링 결합 시)

**3. 기술 선택**
- 룰 엔진: json-rules-engine 권장
- DB: SQLite JSON + Generated Column
- LLM 비용: Claude Haiku $0.01/분석, 월 $10-50

**4. 비즈니스**
- 프리미엄 전환율 벤치마크: 3-5% (좋음), 6-8% (훌륭)
- 16Personalities: 월 1,710만 방문

---

### B. Gemini 딥리서치 결과

**1. 심리학적 근거 (더 상세)**
- 암묵적 프로파일링이 자기보고식보다 생태학적 타당도 높음
- 사회적 바람직성 편향(Social Desirability Bias) 감소
- 반려동물:
  - 개 선호 남성: 지배성↑, 공격성↑
  - 개 선호 여성: 지배성↑, 공격성↓
  - 고양이 선호: 자립성↑, 지배성↓
- 커피:
  - 블랙: 성실성↑, 어둠의 3요소와 약한 양의 상관
  - 라떼: 친화성↑, 심리적 위안 추구
- 사회적 배터리:
  - 외향인: 도파민 보상 시스템 활성
  - 내향인: 기저 각성 수준 높아 과부하 쉬움

**2. 기술 아키텍처 (더 상세)**
- SQLite JSONB + 가상 생성 컬럼 (Virtual Generated Columns)
- json_each()로 태그 배열 고속 순회
- 책임 연쇄 패턴으로 룰 우선순위 제어
- LLM 페르소나 프롬프팅: 구체적 역할 부여로 출력 품질 향상
- TOON/YAML로 JSON 대비 토큰 30-40% 절감
- 컨텍스트 캐싱으로 비용 90% 절감

**3. UX 전략 (더 상세)**
- 점진적 공개: Hick's Law 기반 의사결정 시간 단축
- 가변적 보상: 스키너 상자 이론으로 습관 강화
- 사회적 고리: "친구도 스트레스 높아요" 같은 트리거

**4. 시장 분석**
- 점성술/성격 분석 앱 시장: 2033년 298억 달러
- Co-Star 성공 요인: '팩트 폭력' 스타일, 공유 욕구 자극
- The Pattern: Bonds 기능으로 대인 관계 분석

---

## 최종 설계 통합

### 7단계 점진적 해금

| 단계 | 인사이트 | 해금 조건 | 방식 | 비용 |
|-----|---------|----------|-----|-----|
| 1 | 기본 성향 | 테스트 1개 | 집계 | 무료 |
| 2 | 성격 조합 | 테스트 3개 | 룰 매칭 | 무료 |
| 3 | 판단 스타일 | 투표 10개 | 태그 집계 | 무료 |
| 4 | 관심사 지도 | 활동 15개 | 집계 | 무료 |
| 5 | 관계 패턴 | 관계 활동 10개 | 룰 매칭 | 무료 |
| 6 | 숨은 패턴 | 활동 30개 | 룰 매칭 | 무료 |
| 7 | AI 종합 분석 | 활동 20개+ | AI 생성 | **유료** |

### 태그 시스템

```typescript
// 성격 태그 (Big Five 기반)
PERSONALITY_TAGS = [
  'extroverted', 'introverted', 'ambiverted',
  'logical', 'emotional', 'intuitive', 'analytical',
  'planned', 'spontaneous', 'flexible', 'structured',
  'independent', 'collaborative', 'supportive', 'leading',
  'resilient', 'sensitive'
]

// 결정 태그 (투표용)
DECISION_TAGS = [
  'practical', 'emotional',
  'safe', 'adventurous',
  'solo', 'together',
  'direct', 'indirect',
  'present-focused', 'future-focused'
]

// 관계 태그 (TKI 기반)
RELATIONSHIP_TAGS = [
  'expressive', 'reserved',
  'competing', 'avoiding', 'accommodating', 'collaborating', 'compromising',
  'close-bonding', 'space-needing',
  'self-first', 'other-first'
]
```

### 룰 엔진 구조

```typescript
interface InsightRule {
  id: string;
  name: string;
  priority: number;  // 낮을수록 우선
  category: 'personality' | 'lifestyle' | 'relationship' | 'hidden';
  confidence: 'high' | 'medium' | 'low';
  source?: string;  // 심리학 연구 출처

  conditions: {
    tests?: { [testKey: string]: { results?: string[]; tags?: string[] } };
    decisionPattern?: { tag: string; minRatio: number }[];
    interests?: { category: string; minCount: number }[];
  };

  insight: {
    title: string;
    emoji: string;
    description: string;
    actionTip?: string;
  };
}
```

**계획: 60개 룰**
- 성격 기본: 15개
- 성격 조합: 15개
- 라이프스타일: 10개
- 관계: 10개
- 숨은 패턴: 10개

### 기술 스택

| 영역 | 선택 | 이유 |
|-----|------|------|
| 룰 엔진 | json-rules-engine | all/any/not 조건, 비동기 팩트, 우선순위 |
| DB | Turso (SQLite) + JSONB | 가상 컬럼 + 인덱스로 O(log N) 검색 |
| LLM | Claude Haiku | $0.01/분석, 캐싱으로 90% 절감 가능 |

### DB 스키마

```sql
-- 투표 태그
CREATE TABLE polls (
  id TEXT PRIMARY KEY,
  option_a_tags JSON,
  option_b_tags JSON
);

-- 사용자 인사이트 캐시
CREATE TABLE user_insights (
  id INTEGER PRIMARY KEY,
  user_id TEXT NOT NULL,
  insight_type TEXT GENERATED ALWAYS AS (json_extract(insight_data, '$.type')) VIRTUAL,
  insight_data JSON NOT NULL
);
CREATE INDEX idx_user_type ON user_insights(user_id, insight_type);

-- 룰 저장
CREATE TABLE insight_rules (
  id TEXT PRIMARY KEY,
  priority INTEGER,
  conditions JSON,
  insight JSON,
  active INTEGER DEFAULT 1
);
```

### 비즈니스 모델

- **무료**: Stage 1-6 (룰 기반)
- **유료**: Stage 7 AI 분석
- **가격**: 1회 $2.99-4.99 / 월 $4.99-9.99 / 연 $29.99-49.99
- **목표 전환율**: 3-5%

### 구현 로드맵

| Phase | 기간 | 내용 |
|-------|-----|------|
| 1 | 2주 | 태그 시스템 + 룰 엔진 기반 |
| 2 | 2주 | Stage 1-4 인사이트 + 해금 UI |
| 3 | 2주 | Stage 5-6 + Turso 마이그레이션 |
| 4 | 1주 | AI 분석 + 결제 연동 |

---

## 검토 요청 사항

### 1. 설계 완성도
- 7단계 해금 조건이 적절한가요? (1→3→10→15→10→30→20+)
- 60개 룰로 충분한 커버리지가 가능할까요?
- 태그 분류가 심리학적으로 타당한가요?

### 2. 기술적 우려
- json-rules-engine이 60개 룰 처리에 충분한가요?
- SQLite JSON + 가상 컬럼 조합의 성능 병목은?
- LLM 캐싱 전략에서 놓친 부분은?

### 3. 비즈니스 리스크
- AI 분석만 유료화하면 전환율이 너무 낮지 않을까요?
- 경쟁사 대비 차별점이 명확한가요?
- 콜드 스타트 문제(초기 데이터 부족)는?

### 4. UX/심리적 고려
- "숨은 패턴"에서 부정적 인사이트 노출 시 주의점은?
- 사회적 배터리 고갈 사용자를 위한 UX 가이드는?
- 게이미피케이션이 과도해지면 본질(인사이트)이 희석되지 않을까요?

### 5. 확장성
- 다국어 지원 시 태그/룰 구조의 확장성은?
- 새 테스트/카테고리 추가 시 룰 업데이트 자동화는?

---

## 답변 형식

```markdown
## 영역별 평가

### 1. 설계 완성도
**점수**: ?/10
**강점**: ...
**보완점**: ...

### 2. 기술적 우려
**점수**: ?/10
...

(각 영역 반복)

## 종합 평가
- 전체 점수: ?/100
- 즉시 구현 가능 여부: 예/아니오
- 권장 수정 사항 (우선순위순):
  1. ...
  2. ...
```

---

## 참고 파일

| 파일 | 내용 |
|------|------|
| docs/planning/INSIGHT_SYSTEM_MASTER.md | 마스터 설계서 (990줄) |
| research/INSIGHT_RESEARCH_CLAUDE_FINDINGS.md | Claude 리서치 결과 |
| src/app/dashboard/data/insight-system.ts | 대시보드용 데이터 통합 |

---

*이 문서를 ChatGPT, Claude, Perplexity에 복사하여 최종 검토를 요청하세요.*
