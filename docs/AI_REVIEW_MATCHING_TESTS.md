# 매칭 테스트 결과 검토 요청

## 검토 목적
MBTI 스타일 심리테스트 앱의 4개 매칭 테스트(식물, 반려동물, 커피, 이상형)의 결과 적절성 및 개선사항 검토

## 매칭 시스템 작동 방식

### 점수 체계
- 각 질문은 특정 dimension에 매핑
- 답변별 점수: 1~5점
- 최종 점수를 3단계로 분류: high(60%↑), medium(40~60%), low(40%↓)

### 결과 매칭 로직
```javascript
// condition 예시
{ "care": "high", "light": "medium", "space": "high" }

// 사용자 점수가 condition의 모든 조건을 만족하면 해당 결과 매칭
// 여러 결과가 매칭되면 첫 번째 결과 반환
// 아무것도 매칭 안 되면 마지막 결과(폴백) 반환
```

---

## 1. 식물 매칭 (plant.js)

### 차원(Dimensions) - 5개
| 키 | 이름 | 설명 |
|----|------|------|
| care | 관리력 | 식물 돌봄에 쓸 수 있는 시간과 관심 |
| light | 채광 | 집의 햇빛 환경 |
| water | 물주기 | 물주기 습관과 성향 |
| space | 공간 | 식물을 둘 공간 크기 |
| style | 취향 | 선호하는 식물 스타일 (화려한↔미니멀) |

### 현재 결과 (10개)
| # | 결과명 | condition | 대상 |
|---|--------|-----------|------|
| 1 | 몬스테라 | care:high, light:medium, space:high | 넓은 공간, 적극 관리 |
| 2 | 스투키 | care:low, water:low | 초보자, 방치형 |
| 3 | 포토스 | light:low, care:medium | 어두운 공간 |
| 4 | 스킨답서스 | space:low, light:low, care:low | 좁고 어두운 공간, 초보 |
| 5 | 다육이 | water:low, space:low, style:low | 미니멀, 작은 공간 |
| 6 | 아레카야자 | care:high, light:high, space:high | 넓고 밝은 공간, 적극 관리 |
| 7 | 산세베리아 | care:low, light:medium | 중간 채광, 관리 쉬움 |
| 8 | 허브 | care:high, light:high, style:high | 실용적, 요리용 |
| 9 | 홍콩야자 | care:medium, space:high, light:medium | 넓은 공간, 중급자 |
| 10 | 칼라테아 | care:high, water:high, style:high | 화려한 취향, 습도 관리 |

### 검토 요청 사항
1. **커버리지 갭**: 아래 조합에 해당하는 결과가 없음
   - light:high + care:low (햇빛 좋지만 관리 귀찮음) → 선인장/알로에?
   - water:high + care:low (물은 자주 주지만 다른 관리 싫음) → 행운목?
   - style:medium 조건 사용 없음

2. **결과 적절성**: 각 식물이 condition에 맞는 추천인지 검증 필요

3. **추가 제안**: 더 추가하면 좋을 식물 종류?

---

## 2. 반려동물 매칭 (petMatch.js)

### 차원(Dimensions) - 5개
| 키 | 이름 | 설명 |
|----|------|------|
| lifestyle | 생활패턴 | 활동량과 외출 빈도 |
| space | 주거공간 | 집의 크기와 환경 |
| time | 돌봄시간 | 반려동물에게 쓸 수 있는 시간 |
| experience | 경험도 | 반려동물 양육 경험 |
| interaction | 교감욕구 | 원하는 교감 수준 |

### 현재 결과 (8개)
| # | 결과명 | condition | 대상 |
|---|--------|-----------|------|
| 1 | 활발한 강아지 | lifestyle:high, space:high, time:high, experience:high, interaction:high | 모든 조건 최상 |
| 2 | 얌전한 소형견 | lifestyle:medium, space:low, time:medium, interaction:high | 아파트, 애교 선호 |
| 3 | 도도한 고양이 | lifestyle:low, time:low, interaction:medium | 바쁜 직장인 |
| 4 | 응석쟁이 고양이 | lifestyle:low, space:low, time:medium, interaction:high | 좁은 공간, 교감 원함 |
| 5 | 귀여운 토끼 | space:low, time:low, interaction:medium | 조용한 힐링 |
| 6 | 활발한 햄스터 | space:low, time:low, experience:low | 첫 반려동물 |
| 7 | 느긋한 물고기 | time:low, interaction:low, experience:low | 바라보는 힐링 |
| 8 | 똑똑한 앵무새 | time:high, interaction:high, experience:high | 적극 교감, 경험자 |

### 검토 요청 사항
1. **조건 과다 문제**: "활발한 강아지"가 5개 조건 모두 high → 매칭 확률 매우 낮음
   - experience:high 제거하면 더 현실적?
   - 또는 조건을 3개로 줄이기?

2. **커버리지 갭**:
   - lifestyle:high + space:low (활동적이지만 원룸) → 고슴도치? 페릿?
   - experience:high + time:low (경험 많지만 바쁨) → 거북이?

3. **현실성 검증**: 각 동물의 실제 사육 조건과 condition이 일치하는지?

4. **추가 제안**: 기니피그, 고슴도치, 거북이 등 추가 필요?

---

## 3. 커피 매칭 (coffee.js)

### 차원(Dimensions) - 5개
| 키 | 이름 | 설명 |
|----|------|------|
| bitter | 쓴맛 | 쓴맛 선호도 |
| sweet | 단맛 | 단맛 선호도 |
| caffeine | 카페인 | 카페인 필요 정도 |
| temperature | 온도 | 뜨거운 vs 차가운 선호 |
| mood | 분위기 | 커피 마시는 상황/기분 (집중↔여유) |

### 현재 결과 (9개)
| # | 결과명 | condition | 대상 |
|---|--------|-----------|------|
| 1 | 진한 에스프레소 | bitter:high, sweet:low, caffeine:high | 커피 마니아 |
| 2 | 클래식 아메리카노 | bitter:medium, sweet:low, caffeine:high | 매일 커피 |
| 3 | 부드러운 카페라떼 | bitter:low, sweet:medium, caffeine:medium, temperature:high | 쓴맛 부담 |
| 4 | 달콤한 바닐라 라떼 | bitter:low, sweet:high, caffeine:low | 디저트 커피 |
| 5 | 아이스 콜드브루 | temperature:low, bitter:medium, caffeine:high | 얼죽아 |
| 6 | 진한 카페모카 | sweet:high, bitter:medium, caffeine:medium | 커피+초콜릿 |
| 7 | 여유로운 플랫화이트 | bitter:high, sweet:low, mood:low, caffeine:high | 커피숍 여유 |
| 8 | 카페인 프리 허브티 | caffeine:low, bitter:low, mood:low | 카페인 민감 |
| 9 | 트렌디한 아인슈페너 | bitter:high, sweet:high, temperature:low, caffeine:high | 쓴맛+단맛 |

### 검토 요청 사항
1. **mood 차원 활용 부족**: 9개 결과 중 2개만 mood 사용
   - mood:high (집중/일) 상황 추천 음료 없음
   - 상황별 추천 강화 필요?

2. **허브티 포함 적절성**: 커피 매칭인데 허브티가 결과에 있음
   - 제거? 또는 "커피가 안 맞을 수 있어요" 메시지 강화?

3. **커버리지 갭**:
   - caffeine:low + bitter:medium (디카페인이지만 커피맛) → 디카페인 아메리카노?
   - sweet:high + temperature:high (달달+뜨거운) → 핫초코? 달달한 핫라떼?

4. **실제 주문 연결성**: 결과를 보고 카페에서 바로 주문 가능한지?

---

## 4. 이상형 매칭 (idealType.js)

### 차원(Dimensions) - 5개
| 키 | 이름 | 설명 |
|----|------|------|
| passion | 열정 | 연애 온도 (연락빈도, 기념일 등) |
| commit | 헌신 | 관계 진지도 |
| close | 친밀 | 밀착 정도 (거리감) |
| express | 표현 | 감정 표현 방식 |
| active | 활동 | 데이트 스타일 (야외↔집) |

### 현재 결과 (8개)
| # | 결과명 | condition | 대상 |
|---|--------|-----------|------|
| 1 | 다정다감 연인 | passion:high, express:high, close:high | 스킨십, 애정표현 |
| 2 | 든든한 버팀목 | commit:high, close:high | 진지하고 헌신적 |
| 3 | 열정적인 로맨티스트 | passion:high, active:high | 설렘, 서프라이즈 |
| 4 | 자유로운 동반자 | close:low, commit:medium | 개인 공간 존중 |
| 5 | 편안한 베스트프렌드 | passion:low, close:medium, express:low | 친구같은 편안함 |
| 6 | 액티브 파트너 | active:high, passion:medium | 함께 활동 |
| 7 | 진지한 소울메이트 | commit:high, express:high | 깊은 대화 |
| 8 | 밸런스 연인 | {} (빈 조건) | 폴백/기본값 |

### 검토 요청 사항
1. **폴백 문제**: "밸런스 연인"의 조건이 빈 객체 `{}`
   - 아무것도 매칭 안 되면 자동 선택됨
   - 의도적 폴백인지, 명시적 조건 필요한지?
   - 제안: `{ passion:"medium", commit:"medium", ... }` 로 명시?

2. **커버리지 갭**:
   - passion:high + commit:low (열정적이지만 가벼운) → "썸의 달인"?
   - express:low + close:high (말없지만 붙어있기) → "묵묵한 애인"?
   - active:low + commit:high (집순이 진지파) → "안정적 홈바디"?

3. **실용성 문제**:
   - 다른 매칭(식물/동물/커피)은 "이거 사세요"가 가능
   - 이상형은 "이런 사람 찾으세요"가 추상적
   - guide에 "첫 만남에서 확인할 구체적 질문" 추가 필요?

4. **결과 해석 방향**:
   - 현재: "당신의 이상형은 OO입니다"
   - 대안: "당신은 OO 스타일의 연애를 원합니다" (자기 이해 중심)
   - 어떤 방향이 더 적절?

---

## 종합 검토 요청

### A. 조건 설계 적절성
각 결과의 condition 개수와 조합이 적절한지:
- 조건이 너무 많으면 (4개 이상) 매칭 확률 낮음
- 조건이 너무 적으면 (1개) 차별화 어려움
- 권장: 2~3개 조건

### B. 결과 다양성
현재 결과 수가 충분한지:
- 식물: 10개
- 반려동물: 8개
- 커피: 9개
- 이상형: 8개

### C. 실용성
테스트 결과가 실제 선택/행동에 도움이 되는지:
- 구체적 제품/대상 추천
- 관리법/가이드 제공
- 주의사항 안내

### D. 추가/수정 제안
각 테스트별로 추가하거나 수정하면 좋을 결과가 있다면 제안해주세요.

---

## 데이터 파일 위치
- `data/subjects/plant.js`
- `data/subjects/petMatch.js`
- `data/subjects/coffee.js`
- `data/subjects/idealType.js`

## 관련 문서
- [CLAUDE.md](../CLAUDE.md) - 프로젝트 구조 및 차원 설명
- [QUESTION_DESIGN.md](planning/QUESTION_DESIGN.md) - 질문 설계 원칙
