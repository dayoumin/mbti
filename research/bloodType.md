# 혈액형 성격 테스트 리서치 결과

> 작성일: 2025-12-25
> 목적: bloodType 매칭 테스트의 학술적 근거 및 대중 스테레오타입 검증

---

## 1. 개요

| 항목 | 내용 |
|------|------|
| 테스트 유형 | matching |
| 제목 | 나의 혈액형 찾기 |
| 부제목 | 혈액형별 성향 테스트 |
| 테마 컬러 | bg-red-600 |
| 아이콘 | BloodTypeIcon |

---

## 2. 과학적 근거 (요약)

### 핵심 결론: 과학적 근거 없음 (유사과학)

| 연구 | 저자/기관 | 결론 |
|------|----------|------|
| 혈액형별 성격특징에 대한 믿음과 실제 성격과의 관계 (2005) | 조소현, 서은국, 노연정 (연세대) | Big Five 성격검사와 혈액형 간 **통계적으로 유의미한 관계 없음** |
| 일본 대규모 조사 (2020) | Kengo Nawata | 10,000명+ 조사 결과 혈액형이 성격 변이의 **0.3%만 설명** (통계 오차 수준) |
| 혈액형 유형학 연구 개관 (2007) | 류성일, 손영우 | 생화학적 가설 제시했으나 증명 안됨 |
| 대한혈액학회 (2008) | 한규섭 교수 | "혈액형 성격설을 믿는 곳은 한국과 일본뿐", 과학적 근거 없음 |

### 왜 사람들은 맞다고 느끼는가?

1. **바넘 효과 (Barnum Effect)**: 모호한 설명을 자신에게 맞다고 느끼는 심리
2. **자기충족적 예언 (Self-fulfilling Prophecy)**: 혈액형 성격을 믿는 사람들이 그에 맞게 자신을 보고함
3. **확증 편향**: 맞는 경우만 기억하고 틀린 경우는 무시

### 참고 논문/출처

1. 조소현, 서은국, 노연정. (2005). 혈액형별 성격특징에 대한 믿음과 실제 성격과의 관계. 한국심리학회지: 사회및성격, 19(4), 33-47.
   - URL: https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART000977772

2. 류성일, 손영우. (2007). 혈액형 유형학 연구에 대한 개관: 사회문화적, 행동과학적 및 생화학적 관점에서. 한국심리학회지: 사회및성격, 21(3), 27-55.
   - URL: https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART001077625

3. Nawata, K. (2020). ABO Blood Type and Personality Traits: Evidence from Large-scale Surveys in Japan.
   - URL: https://www.researchgate.net/publication/341879978_ABO_Blood_Type_and_Personality_Traits_Evidence_from_Large-scale_Surveys_in_Japan

4. Blood type personality theory - Wikipedia
   - URL: https://en.wikipedia.org/wiki/Blood_type_personality_theory

---

## 3. 대중적 스테레오타입

### 한국/일본에서의 혈액형별 성격 고정관념

#### A형
- **긍정**: 꼼꼼함, 성실함, 계획적, 책임감, 배려심, 완벽주의
- **부정**: 소심함, 우유부단, 걱정 많음, 내성적, 예민함
- **키워드**: 계획적, 꼼꼼, 소심, 완벽주의, 내향적

#### B형
- **긍정**: 자유분방, 창의적, 솔직함, 사교적, 낙천적
- **부정**: 변덕스러움, 마이웨이, 무책임, 참을성 부족, 자기중심적
- **키워드**: 즉흥적, 자유로움, 솔직, 마이웨이, 변덕

#### O형
- **긍정**: 대범함, 리더십, 사교적, 낙천적, 자신감, 유머
- **부정**: 대충대충, 질투심, 고집, 자기 과시
- **키워드**: 대범, 사교적, 리더십, 외향적, 긍정적

#### AB형
- **긍정**: 창의적, 냉철함, 합리적, 다재다능, 높은 지능
- **부정**: 이중적, 예측 불가, 냉정함, 거리감
- **키워드**: 4차원, 독특, 냉철, 이중성, 신비로움

---

## 4. 차원 설계 (구현됨)

| 키 | 이름 | 이모지 | 설명 | LOW | HIGH | 근거 |
|----|------|--------|------|-----|------|------|
| organized | 계획성 | 📋 | 꼼꼼함 vs 즉흥적 | 즉흥적 | 계획적 | A형 특성 |
| social | 사교성 | 🎉 | 내향 vs 외향 | 내향적 | 외향적 | O형 특성 |
| flexible | 유연성 | 🌊 | 원칙적 vs 융통성 | 원칙적 | 융통성 | B형 특성 |
| express | 표현력 | 💬 | 속마음 vs 직설적 | 속마음 | 직설적 | 감정 표현 |

---

## 5. 결과 유형 매핑

### 기본 4유형

| 결과 | 조건 | 스테레오타입 일치 |
|------|------|-----------------|
| A형 스타일 | organized: high, flexible: low | ✅ 계획적 + 원칙적 |
| B형 스타일 | flexible: high, express: high | ✅ 유연 + 솔직 |
| O형 스타일 | social: high, express: high | ✅ 사교적 + 표현력 |
| AB형 스타일 | organized: high, social: low | ✅ 계획적 + 내향적 |

### 혼합 8유형

| 결과 | 조건 | 설명 |
|------|------|------|
| A형에 가까운 O형 | organized: high, social: high | 계획적 + 사교적 |
| B형에 가까운 O형 | flexible: high, social: high | 자유로움 + 활발 |
| A형에 가까운 AB형 | organized: high, express: low | 완벽주의 + 내향 |
| 균형잡힌 만능형 | organized: medium, social: medium, flexible: medium | 상황 적응형 |
| B형에 가까운 A형 | organized: high, flexible: medium | 계획적 + 유연 |
| O형에 가까운 AB형 | social: high, express: low | 사교적 + 신중 |
| 내향적 B형 스타일 | flexible: high, social: low | 자유로움 + 조용 |
| 폭넓은 적응형 | {} (폴백) | 다양한 성향 |

---

## 6. 검증 결과

### 스테레오타입 일치 여부

- ✅ A형: 계획적, 꼼꼼, 원칙적 - **일치**
- ✅ B형: 자유로움, 즉흥적, 솔직 - **일치**
- ✅ O형: 사교적, 외향적, 표현력 - **일치**
- ✅ AB형: 계획적이면서 내향적 - **일치**

### 누락된 특성 (개선 고려사항)

| 특성 | 관련 혈액형 | 현재 반영 |
|------|-----------|----------|
| 리더십 | O형 | ❌ 미반영 (social로 부분 커버) |
| 논리성/합리성 | AB형 | ❌ 미반영 |
| 안정성/신경질적 | A형 | ❌ 미반영 |
| 끈기/집착 | A형 | ❌ 미반영 |

---

## 7. 주의사항 및 권장사항

### 법적/윤리적 고려

1. **블러드 하라스먼트 (ブラハラ)**
   - 일본에서 혈액형 차별로 인한 괴롭힘, 취업 차별 등 사회 문제화
   - 한국에서도 "B형 남자친구" 등 편견 존재

2. **면책 문구 권장**
   ```
   이 테스트는 재미를 위한 것으로, 과학적 근거가 없습니다.
   혈액형으로 사람을 판단하지 마세요!
   ```

### 콘텐츠 방향

- ✅ 엔터테인먼트/재미 목적으로 적합
- ⚠️ 진지한 성격 분석 용도로는 부적합
- ⚠️ 차별적 표현 주의 (특히 B형 관련)

---

## 8. 체크리스트

- [x] 4개 차원 설계 ✓
- [x] 기본 4유형 + 혼합 8유형 = 12개 결과 ✓
- [x] 대중 스테레오타입과 일치 ✓
- [x] 중간점수(3) 포함 질문 ✓
- [x] 모든 결과 도달 가능 ✓
- [ ] 면책 문구 추가 (권장)
- [ ] 리더십/논리성 차원 추가 고려 (선택)

---

## 9. 참고 링크

- [혈액형 성격설 - 나무위키](https://namu.wiki/w/혈액형%20성격설)
- [혈액형 성격설 - 위키백과](https://ko.wikipedia.org/wiki/혈액형_성격설)
- [Blood type personality theory - Wikipedia](https://en.wikipedia.org/wiki/Blood_type_personality_theory)
- [한국인의 혈액형 성격 특성](https://www.masksheets.com/ko/blogs/all/korean-blood-type-personality-traits)
