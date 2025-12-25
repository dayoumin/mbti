# 인사이트 시스템 설계 리뷰 요청

> 다른 AI(ChatGPT, Gemini 등)에게 리뷰 요청용 문서
> 작성일: 2024-12-25

---

## 리뷰 요청 사항

이 문서는 "활동 기반 자기 발견" 시스템의 설계입니다. 다음 관점에서 리뷰해주세요:

1. **컨셉의 차별화**: 일반 AI 채팅/MBTI 앱과 비교해 충분히 차별화되는가?
2. **심리학적 타당성**: 행동 데이터 → 성격 인사이트 도출의 과학적 근거가 충분한가?
3. **기술적 실현 가능성**: 제안된 아키텍처가 현실적인가?
4. **사용자 경험**: 해금 시스템이 동기부여에 효과적인가?
5. **비즈니스 관점**: 유료화 전략이 적절한가?
6. **빠진 것**: 추가로 고려해야 할 사항이 있는가?

---

## 1. 프로젝트 개요

### 1.1 앱 소개
- **유형**: 성격/심리 테스트 + 퀴즈/투표 앱
- **현재 보유**: 테스트 33개, 퀴즈 30개+, 투표 50개+, 상황반응 100개+
- **기술 스택**: Next.js, TypeScript, Turso(SQLite), localStorage

### 1.2 해결하려는 문제
```
기존 테스트 앱: 한 번 테스트 → 결과 → 끝 (재방문 이유 없음)
기존 AI 채팅: "나에 대해 분석해줘" → 사용자가 말한 것만 분석 (자기 인식 편향)

목표: 활동할수록 데이터가 쌓이고, 시간이 지나면 더 정확한 자기 이해
```

### 1.3 핵심 차별화
| 일반 AI 채팅 | 우리 앱 |
|------------|--------|
| 사용자가 "말한 것" 분석 | 사용자가 "행동한 것" 분석 |
| 한 번 대화로 끝 | 3개월간 데이터 축적 |
| 자기 인식 편향 그대로 | 무의식적 선택 패턴 발견 |

---

## 2. 인사이트 시스템 설계

### 2.1 7단계 점진적 해금

| 단계 | 인사이트 | 해금 조건 | 분석 방식 | 비용 |
|-----|---------|----------|----------|-----|
| 1 | 기본 성향 | 테스트 1개 | 단순 집계 | 무료 |
| 2 | 성격 조합 | 테스트 3개 | 룰 매칭 (60개) | 무료 |
| 3 | 판단 스타일 | 투표 10개 | 태그 집계 | 무료 |
| 4 | 관심사 지도 | 활동 15개 | 카테고리 집계 | 무료 |
| 5 | 관계 패턴 | 관계 활동 10개 | 룰 매칭 | 무료 |
| 6 | 숨은 패턴 | 활동 30개 | 교차 분석 | 무료 |
| 7 | AI 종합 분석 | 활동 20개+ | AI 생성 | **유료** |

### 2.2 인사이트 예시

**Stage 2: 성격 조합** (테스트 3개 완료 시)
```
💫 조용한 관찰자

"혼자만의 시간을 소중히 여기고,
 깊이 있는 관계를 선호해요.
 고양이처럼 독립적이지만,
 신뢰하는 사람에겐 따뜻해요."

기반: 고양이(독립형) + 갈등(회피형) + 커피(혼자형)

🔬 심리학 근거
Texas 대학 연구: 고양이 선호자는 개방성 +11%, 독립성 높음
```

**Stage 6: 숨은 패턴** (활동 30개 완료 시)
```
🎭 발견된 모순

"고양이 테스트에선 독립성을 중시하는데
 이상형 테스트에선 밀착형을 원해요.

 → 평소엔 혼자 시간이 필요하지만,
   연인에겐 깊은 친밀감을 원하는
   '선택적 친밀' 타입이에요."

⏰ 시간대 패턴
"밤 10시 이후 투표에서 '감성적' 선택이 40% 증가해요.
 피곤할 때 감정에 솔직해지시네요."
```

### 2.3 유도 메시지 흐름
```
테스트 1개 완료
→ "기본 성향" 즉시 해금
→ "테스트 2개 더 하면 '성격 조합' 해금!"

테스트 3개 완료
→ "성격 조합" 해금
→ "투표 10개 참여하면 '판단 스타일' 해금!"

...계속
```

---

## 3. 기술 아키텍처

### 3.1 3단계 분석 복잡도

```
        ┌───────────┐
        │  Level 3  │  AI 분석 (유료)
        │           │  - Claude API 호출
        └─────┬─────┘  - 비용: $0.01/회
              │
        ┌─────┴─────┐
        │  Level 2  │  룰 기반 (무료)
        │           │  - 60개 IF-THEN 규칙
        └─────┬─────┘  - 테스트 조합 매칭
              │
    ┌─────────┴─────────┐
    │     Level 1       │  단순 집계 (무료)
    │                   │  - 카운팅, 비율 계산
    └───────────────────┘  - 카테고리별 통계
```

### 3.2 태그 시스템

**투표 선택지 태그**:
```typescript
type DecisionTag =
  | 'practical' | 'emotional'    // 실용 vs 감성
  | 'safe' | 'adventurous'       // 안전 vs 모험
  | 'solo' | 'together'          // 혼자 vs 함께
  | 'direct' | 'indirect';       // 직접 vs 우회

// 예시
{
  question: "야식 먹을까 말까?",
  optionA: { text: "먹자!", tags: ['emotional', 'present-focused'] },
  optionB: { text: "참자...", tags: ['practical', 'future-focused'] }
}
```

**테스트 결과 태그**:
```typescript
const CAT_RESULT_TAGS = {
  "철학냥이": {
    personality: ['introverted', 'analytical', 'independent'],
    strength: ['깊은 사고', '관찰력'],
    growth: ['표현력', '사교성']
  }
};
```

### 3.3 룰 엔진 예시

```typescript
interface InsightRule {
  id: string;
  priority: number;
  conditions: {
    tests?: { [testKey: string]: { tags?: string[]; dimensions?: {...} } };
    decisionPattern?: { tag: string; minRatio: number }[];
    interests?: { category: string; minCount: number }[];
  };
  insight: {
    title: string;
    emoji: string;
    description: string;
    explanation?: string;
    actionTip?: string;
  };
  confidence: 'high' | 'medium' | 'low';
  source?: string;  // 심리학 연구 출처
}

// 예시 룰
{
  id: 'hidden-001',
  name: '선택적 친밀',
  conditions: {
    tests: {
      cat: { tags: ['independent'] },
      idealType: { tags: ['close-bonding'] }
    }
  },
  insight: {
    title: '독립과 친밀 사이',
    description: '평소엔 혼자 시간이 필요하지만, 연인에게는 깊은 친밀감을 원해요.',
    explanation: '고양이 성향(독립)과 이상형(밀착)의 대비'
  },
  confidence: 'high'
}
```

### 3.4 DB 스키마 (Turso)

```sql
-- 인사이트 규칙 저장
CREATE TABLE insight_rules (
  id TEXT PRIMARY KEY,
  priority INTEGER,
  conditions JSON,
  insight JSON,
  confidence TEXT,
  category TEXT,
  source TEXT
);

-- 결과-태그 매핑
CREATE TABLE result_tags (
  test_key TEXT,
  result_name TEXT,
  tags JSON,
  UNIQUE(test_key, result_name)
);

-- 사용자 인사이트 캐시
CREATE TABLE user_insights (
  user_id TEXT,
  insight_type TEXT,
  insight_data JSON,
  generated_at TIMESTAMP,
  UNIQUE(user_id, insight_type)
);

-- AI 분석 결과
CREATE TABLE ai_analyses (
  user_id TEXT,
  input_data JSON,
  output_text TEXT,
  model TEXT,
  cost_usd REAL,
  generated_at TIMESTAMP
);
```

---

## 4. 심리학적 근거

### 4.1 Big Five (OCEAN) 모델
- 가장 널리 검증된 성격 특성 모델
- 성실성 ↔ 직무 성과 상관: r=0.26
- 신경성: 정신 건강 문제의 가장 강력한 예측 인자

### 4.2 반려동물 선호와 성격 (Texas 대학 연구, 4,565명)
| 특성 | 강아지 선호 | 고양이 선호 |
|-----|-----------|-----------|
| 외향성 | +15% | - |
| 친화성 | +13% | - |
| 개방성 | - | +11% |
| 신경성 | - | +12% |

### 4.3 음료 선호와 성격 (2,000명 연구)
- 외향적 사람이 커피 선택 확률: 내향적 대비 **6.8배**
- p-value: 0.004 (통계적 유의성)

### 4.4 출처
- [Psychology Today - Dog vs Cat Owners](https://www.psychologytoday.com/us/blog/canine-corner/201002/personality-differences-between-dog-and-cat-owners)
- [Study Finds - Coffee or Tea Personality](https://studyfinds.org/coffee-or-tea-personality-revealed/)
- [Big Five - Simply Psychology](https://www.simplypsychology.org/big-five-personality.html)

---

## 5. 벤치마크

### 5.1 Spotify Wrapped
- 데이터를 "선물"처럼 포장
- 2022년부터 Listening Personality (MBTI 스타일 4글자) 도입
- Audio Aura, Sound Town 등 감성적 시각화

### 5.2 YouTube Recap (2025)
- AI 기반 성격 유형 카드
- "AI can make mistakes" 면책 문구
- 50개 컨셉 테스트 → 9라운드 피드백 후 출시

### 5.3 Crystal (B2B)
- 행동 데이터 → 성격 예측
- 성격 평가 시장: 2024년 $107억 → 2031년 $243억 (CAGR 12.7%)

---

## 6. 비용 분석

### 6.1 AI 분석 비용 (Claude Haiku 기준)
| 항목 | 수치 |
|-----|------|
| 입력 토큰 | ~2,000 |
| 출력 토큰 | ~500 |
| 1회 비용 | ~$0.01 |

### 6.2 월간 비용 추정
```
MAU 10,000 × AI 사용률 10% = 1,000회/월
1,000 × $0.01 = $10/월

MAU 100,000 × AI 사용률 10% = 10,000회/월
10,000 × $0.01 = $100/월
```

### 6.3 유료화 전략
- **무료**: 단계 1-6 (집계 + 룰 기반)
- **유료**: 단계 7 AI 종합 분석 리포트
- 예상 가격: 1,000~3,000원/회 또는 월 구독

---

## 7. 구현 로드맵

| Phase | 기간 | 내용 |
|-------|-----|------|
| 1 | 2주 | 태그 시스템 + InsightService 기본 |
| 2 | 2주 | 인사이트 1-4단계 (무료) |
| 3 | 2주 | 인사이트 5-6단계 + DB |
| 4 | 1주 | AI 분석 (유료) |

**총 7주**

---

## 8. 필요 리소스

| 항목 | 수량 | 용도 |
|-----|------|------|
| 인사이트 룰 | 60개 | 성격/라이프스타일/관계 조합 |
| 투표 태그 | 50개 | 판단 스타일 분석 |
| 테스트 결과 태그 | 100개 | 성격 조합 분석 |
| DB 테이블 | 6개 | 규칙, 태그, 캐시, 통계 |

---

## 9. 리스크

| 리스크 | 대응 |
|-------|------|
| 데이터 부족으로 분석 부정확 | 최소 데이터 요건 설정, "데이터 부족" 표시 |
| 해금 조건이 너무 높음 | A/B 테스트로 조정 |
| 인사이트가 뻔함 | 재미있는 표현, 구체적 예시 |
| 프라이버시 우려 | 로컬 저장 명시, 삭제 옵션 |
| 심리학적 정확도 의문 | 연구 출처 명시, "재미 목적" 면책 |

---

## 10. 리뷰 질문

### 컨셉
1. "행동 기반 분석"이 AI 채팅 대비 실제로 더 정확할까요?
2. 점진적 해금이 사용자 동기부여에 효과적일까요?
3. 7단계가 너무 많거나 적지 않을까요?

### 심리학
4. 반려동물/음료 선호 연구를 성격 분석에 적용하는 게 적절할까요?
5. 룰 60개로 충분한 커버리지가 나올까요?
6. "숨은 패턴" (교차 분석)의 심리학적 타당성은?

### 기술
7. 룰 기반 vs AI의 비율이 적절할까요?
8. 태그 시스템 설계가 확장 가능할까요?
9. 월 $10-100 AI 비용이 현실적일까요?

### 비즈니스
10. AI 분석만 유료화하는 전략이 적절할까요?
11. 무료 부분이 너무 많아서 전환율이 낮지 않을까요?
12. 경쟁 앱 대비 차별화가 충분할까요?

### 빠진 것
13. 추가로 고려해야 할 인사이트 유형이 있을까요?
14. 법적/윤리적 고려사항은?
15. 국제화(다국어) 시 고려할 점은?

---

## 관련 문서

- [INSIGHT_SYSTEM_MASTER.md](./INSIGHT_SYSTEM_MASTER.md) - 전체 설계서 (990줄)
- [INSIGHT_ENGINE_DESIGN.md](./INSIGHT_ENGINE_DESIGN.md) - 기술 엔진 설계 (688줄)
- [INSIGHT_UNLOCK_SYSTEM.md](./INSIGHT_UNLOCK_SYSTEM.md) - 해금 시스템 상세 (437줄)

---

## 피드백 요청 형식

리뷰 후 다음 형식으로 피드백 부탁드립니다:

```markdown
## 전반적 평가
- 점수: /10
- 한 줄 요약:

## 강점
1.
2.
3.

## 개선 필요
1.
2.
3.

## 우려 사항
1.
2.

## 추가 제안
1.
2.

## 질문에 대한 답변
- Q1:
- Q2:
...
```
