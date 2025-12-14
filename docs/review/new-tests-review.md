# 과일/술/빵 테스트 AI 리뷰 요청

## 1. 개요

새로 추가된 3개의 매칭 테스트에 대한 검토 요청입니다.

- **과일 테스트** (`fruit.ts`): 사용자에게 맞는 과일 추천
- **술 테스트** (`alcohol.ts`): 사용자에게 맞는 술 추천
- **빵 테스트** (`bread.ts`): 사용자에게 맞는 빵 추천

## 2. 공통 구조

### 2.1 데이터 형식
```typescript
interface SubjectData {
  title: string;           // 테스트 제목
  subtitle: string;        // 부제목
  themeColor: string;      // 테마 색상 (Tailwind)
  icon: string;            // 아이콘 컴포넌트명
  testType: string;        // "matching" | "personality"
  dimensions: Record<string, Dimension>;  // 측정 차원
  questions: Question[];   // 기본 질문 (12개)
  questions_deep: Question[];  // 심화 질문 (18개)
  resultLabels: ResultLabel[];  // 결과 유형 (12개)
}
```

### 2.2 점수 산출 로직
- 각 질문은 5점/1점 이분법 (높으면 5, 낮으면 1)
- 차원별 점수 합산 → 백분율로 레벨 판정
  - 60% 이상: HIGH
  - 40% 이하: LOW
  - 그 사이: MEDIUM

### 2.3 결과 매칭 로직
1. **완전 매칭**: 결과의 모든 조건이 사용자 레벨과 일치 (조건 수가 많은 것 우선)
2. **부분 매칭**: 완전 매칭 없으면, 가장 많은 조건이 일치하는 결과 선택

---

## 3. 과일 테스트 (fruit.ts)

### 3.1 차원 (5개)
| 키 | 이름 | 설명 |
|----|------|------|
| sweet | 단맛 | 단맛을 얼마나 좋아하나요 |
| sour | 신맛 | 신맛을 얼마나 좋아하나요 |
| texture | 식감 | 아삭한 vs 부드러운 식감 |
| convenience | 편의성 | 먹기 편한 정도 |
| season | 계절 | 선호하는 계절감 |

### 3.2 질문 분포
- sweet: 3개 / sour: 2개 / texture: 3개 / convenience: 2개 / season: 2개

### 3.3 결과 (12개)
| 이름 | 조건 |
|------|------|
| 🍓 달콤한 딸기 | sweet:high, sour:low, texture:low |
| 🍊 상큼한 오렌지 | sour:high, sweet:medium, convenience:low |
| 🍎 아삭한 사과 | texture:high, sweet:medium, convenience:high |
| 🍌 편한 바나나 | convenience:low, texture:low, sweet:high |
| 🍉 시원한 수박 | season:low, sweet:high, texture:medium |
| 🍇 새콤한 청포도 | sour:high, texture:high, sweet:low |
| 🥭 달콤한 망고 | sweet:high, texture:low, convenience:high |
| 🫐 건강한 블루베리 | convenience:low, sweet:medium, sour:medium |
| 🍐 시원한 배 | texture:high, sour:low, season:high |
| 🍊 달콤한 귤 | season:high, convenience:low, sweet:high |
| 🥝 상큼한 키위 | sour:high, sweet:low, texture:low |
| 🍑 아삭한 복숭아 | sweet:high, texture:high, season:low |

### 3.4 검토 요청 사항
1. 질문의 자연스러움 및 이해도
2. 결과 조건의 논리적 적절성 (예: 딸기가 sweet:high, texture:low가 맞는지)
3. 결과 설명문(interpretation, guide)의 품질
4. 추가하면 좋을 결과 유형이 있는지

---

## 4. 술 테스트 (alcohol.ts)

### 4.1 차원 (5개)
| 키 | 이름 | 설명 |
|----|------|------|
| strength | 도수 | 술의 강도 선호 |
| sweet | 단맛 | 달콤한 정도 |
| social | 분위기 | 술 마시는 상황 (혼술 vs 회식) |
| taste | 맛 성향 | 복잡한 vs 깔끔한 맛 |
| style | 스타일 | 술을 즐기는 방식 |

### 4.2 질문 분포
- strength: 3개 / sweet: 2개 / social: 2개 / taste: 3개 / style: 2개

### 4.3 결과 (12개)
| 이름 | 조건 |
|------|------|
| 🍺 시원한 생맥주 | strength:low, social:high, taste:low |
| 🍶 깔끔한 소주 | strength:high, taste:low, social:high |
| 🍹 달달한 칵테일 | sweet:high, strength:low, social:high |
| 🍷 풍미 있는 와인 | taste:high, style:high, sweet:low |
| 🥃 깊은 위스키 | strength:high, taste:high, style:high |
| 🍶 전통 막걸리 | taste:medium, sweet:high, style:low |
| 🧊 청량한 하이볼 | strength:medium, sweet:medium, social:medium |
| 🥂 우아한 샴페인 | social:high, sweet:low, taste:medium |
| 🍶 혼술의 정석 사케 | social:low, taste:high, strength:medium |
| 🍺 시원한 소맥 | social:high, strength:low, taste:high |
| 🍑 달콤한 과일주 | sweet:high, strength:low, taste:low |
| 🍺 감성의 수제 맥주 | taste:high, style:medium, strength:low |

### 4.4 검토 요청 사항
1. 술 관련 질문의 적절성 (민감한 표현은 없는지)
2. 결과 조건의 논리적 적절성 (예: 소주가 strength:high가 맞는지)
3. 20세 미만 대상 적절성 고려
4. 추가하면 좋을 결과 유형이 있는지

---

## 5. 빵 테스트 (bread.ts)

### 5.1 차원 (5개)
| 키 | 이름 | 설명 |
|----|------|------|
| sweet | 단맛 | 단 빵 vs 담백한 빵 |
| texture | 식감 | 바삭 vs 촉촉 |
| filling | 속재료 | 속이 꽉 찬 vs 심플한 |
| meal | 용도 | 식사용 vs 간식용 |
| style | 스타일 | 클래식 vs 트렌디 |

### 5.2 질문 분포
- sweet: 3개 / texture: 3개 / filling: 2개 / meal: 2개 / style: 2개

### 5.3 결과 (12개)
| 이름 | 조건 |
|------|------|
| 🍞 달콤한 크림빵 | sweet:high, filling:high, texture:low |
| 🥐 바삭한 크루아상 | texture:high, sweet:low, style:high |
| 🧈 담백한 소금빵 | sweet:low, texture:high, filling:low |
| 🥪 든든한 샌드위치 | meal:high, filling:high, sweet:low |
| 🍰 촉촉한 생크림 케이크 | sweet:high, texture:low, style:medium |
| 🫘 고소한 단팥빵 | filling:high, sweet:medium, style:low |
| 🥯 쫄깃한 베이글 | texture:high, meal:high, sweet:low |
| 🥖 바삭한 바게트 | texture:high, filling:low, meal:high |
| 🍞 폭신한 식빵 | meal:high, texture:low, style:low |
| 🍫 달달한 초코빵 | sweet:high, style:high, texture:low |
| 🧇 트렌디한 크로플 | style:high, texture:high, sweet:medium |
| 🧄 따뜻한 마늘빵 | filling:high, texture:medium, sweet:low |

### 5.4 검토 요청 사항
1. 질문의 자연스러움 및 이해도
2. 결과 조건의 논리적 적절성
3. 빵 종류 선정의 다양성 (한국적 vs 서양적 균형)
4. 추가하면 좋을 결과 유형이 있는지

---

## 6. 기술적 검증 결과

```
🧪 테스트 검증 결과:
- 과일: 오류 0, 경고 0 ✅
- 술: 오류 0, 경고 0 ✅
- 빵: 오류 0, 경고 0 ✅

모든 12개 결과에 도달 가능 확인
극단 케이스(모두 HIGH/LOW) 테스트 통과
```

---

## 7. 리뷰 요청 항목 요약

1. **질문 품질**: 자연스럽고 이해하기 쉬운지
2. **결과 논리성**: 조건과 결과가 논리적으로 맞는지
3. **결과 설명문**: interpretation, guide 텍스트 품질
4. **matchPoints**: 추천 대상 설명이 적절한지
5. **누락된 유형**: 추가하면 좋을 결과가 있는지
6. **문화적 적절성**: 한국 사용자 대상으로 적절한지
7. **민감성 검토**: 술 테스트의 경우 특히 주의 필요

---

## 8. 파일 위치

- 과일: `src/data/subjects/fruit.ts`
- 술: `src/data/subjects/alcohol.ts`
- 빵: `src/data/subjects/bread.ts`
- 설정: `src/data/config.ts` (SUBJECT_CONFIG에 추가됨)
- 타입: `src/data/types.ts` (SubjectKey에 추가됨)
- 아이콘: `src/components/Icons.js` (FruitIcon, AlcoholIcon, BreadIcon)
