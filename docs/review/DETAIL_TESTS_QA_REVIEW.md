# 세부 테스트 질문/답변/결과 검토 문서

> petMatch 결과에서 연결되는 6개 세부 테스트의 품질 검토용 문서입니다.

---

## 1. dogBreed (강아지 품종)

### 기본 정보
- **연결**: petMatch → "강아지" 결과 후
- **차원**: 5개 (size, energy, grooming, training, independence)
- **질문**: 8개 기본 + 4개 심화
- **결과**: 12개 품종

### 질문 목록

| # | 질문 | 차원 | 답변 옵션 (점수) |
|---|------|------|-----------------|
| 1 | 어떤 크기의 강아지를 원하시나요? | size | 소형견(1) / 중형견(3) / 대형견(5) |
| 2 | 집 공간은 어느 정도인가요? | size | 원룸(1) / 일반 아파트(3) / 마당 있는 집(5) |
| 3 | 강아지와 얼마나 활동적으로 지내고 싶나요? | energy | 조용히(1) / 적당한 산책(3) / 매일 운동(5) |
| 4 | 하루에 산책 시간은 얼마나 가능한가요? | energy | 30분 이하(1) / 30분~1시간(3) / 1시간 이상(5) |
| 5 | 털 빠짐에 대한 생각은? | grooming | 최소화 중요(1) / 어느 정도 OK(3) / 상관없음(5) |
| 6 | 미용샵 방문이나 빗질에 시간을 투자할 수 있나요? | grooming | 최소한(1) / 가끔 OK(3) / 정기적 가능(5) |
| 7 | 강아지 훈련에 얼마나 관심 있나요? | training | 기본만(1) / 기본 훈련 잘(3) / 다양한 훈련(5) |
| 8 | 강아지가 혼자 있는 시간이 얼마나 될까요? | independence | 항상 함께(1) / 낮에 혼자(3) / 혼자 시간 김(5) |

### 심화 질문

| # | 질문 | 차원 | 답변 옵션 (점수) |
|---|------|------|-----------------|
| 1 | 강아지를 키우는 주된 목적은? | energy | 힐링(1) / 동반자(3) / 함께 운동(5) |
| 2 | 아이나 다른 반려동물이 있나요? | training | 없음(3) / 어린 아이(1) / 다른 동물(5) |
| 3 | 강아지 경험이 있나요? | training | 처음(1) / 어릴 때(3) / 여러 마리(5) |
| 4 | 알레르기 걱정이 있나요? | grooming | 저알레르기 필요(1) / 약간(3) / 없음(5) |

### 결과 매칭 조건

| 품종 | 조건 | 대상 사용자 |
|------|------|------------|
| 골든 리트리버 | size:high, energy:high, grooming:high | 넓은 공간, 활동적, 털 관리 OK |
| 래브라도 리트리버 | size:high, energy:high, grooming:medium | 활동적 가정, 첫 대형견 |
| 푸들 | grooming:high, training:high | 알레르기, 미용 투자, 훈련 열정 |
| 말티즈 | size:low, energy:low, independence:low | 아파트, 항상 함께, 애교 원함 |
| 시츄 | size:low, energy:low, independence:high | 조용한 환경, 첫 강아지, 실내 생활 |
| 포메라니안 | size:low, energy:medium, grooming:high | 활발한 소형견, 털 관리 즐김 |
| 웰시코기 | size:high, energy:high, training:medium | 활동적, 귀여운 외모, 훈련 관심 |
| 프렌치 불독 | size:low, energy:low, grooming:low, independence:high | 아파트, 조용함, 운동량 적음 |
| 비글 | size:high, energy:high, independence:high | 활동적, 야외활동, 독립적 성격 이해 |
| 시바견 | size:high, energy:medium, independence:high | 독립적, 깔끔함, 경험자 |
| 보더 콜리 | size:high, energy:high, training:high | 매우 활동적, 훈련 열정, 독스포츠 |
| 요크셔테리어 | size:low, grooming:high, energy:high | 알레르기, 우아한 외모, 소형견 |

### 검토 포인트
- [x] 질문이 차원을 잘 반영하는가?
- [x] 답변 옵션이 명확한 스펙트럼인가?
- [x] 결과 조건이 합리적인가?
- [ ] **검토 필요**: 시바견이 size:high인데 실제로 중형견 - medium이 맞지 않을까?
- [ ] **검토 필요**: 웰시코기도 중형견인데 size:high로 설정됨

---

## 2. catBreed (고양이 품종)

### 기본 정보
- **연결**: petMatch → "고양이" 결과 후
- **차원**: 5개 (activity, affection, grooming, vocal, independence)
- **질문**: 6개 기본 + 2개 심화
- **결과**: 10개 품종

### 질문 목록

| # | 질문 | 차원 | 답변 옵션 (점수) |
|---|------|------|-----------------|
| 1 | 어떤 스타일의 고양이를 원하시나요? | activity | 조용히(1) / 가끔 놀이(3) / 활발히(5) |
| 2 | 고양이와 어떤 관계를 원하나요? | affection | 도도함(1) / 가끔 애교(3) / 항상 붙어있는 개냥이(5) |
| 3 | 고양이가 무릎에 앉는 것을 좋아하시나요? | affection | 부담스러움(1) / 가끔 OK(3) / 매일 원함(5) |
| 4 | 털 관리에 대한 생각은? | grooming | 단모종(1) / 적당히(3) / 장모종 매력(5) |
| 5 | 고양이 울음소리에 대한 생각은? | vocal | 조용함(1) / 적당히(3) / 수다쟁이 OK(5) |
| 6 | 고양이가 혼자 있는 시간은? | independence | 항상 함께(1) / 낮에 혼자(3) / 혼자 시간 김(5) |

### 심화 질문

| # | 질문 | 차원 | 답변 옵션 (점수) |
|---|------|------|-----------------|
| 1 | 첫 고양이인가요? | activity | 처음(1) / 어릴 때(3) / 여러 마리(5) |
| 2 | 다른 반려동물이나 아이가 있나요? | affection | 없음(3) / 다른 고양이(5) / 강아지/아이(1) |

### 결과 매칭 조건

| 품종 | 조건 | 대상 사용자 |
|------|------|------------|
| 코리안 숏헤어 | activity:high, grooming:low, independence:high | 유기묘 입양, 관리 쉬움, 건강함 |
| 러시안 블루 | activity:low, vocal:low, independence:high | 조용한 환경, 1인 가구, 차분함 |
| 랙돌 | affection:high, activity:low, grooming:high | 스킨십, 개냥이, 장모종 |
| 아비시니안 | activity:high, affection:medium, independence:low | 활동적, 놀이, 다묘 가정 |
| 브리티시 숏헤어 | activity:low, independence:high, grooming:low | 직장인, 독립적, 조용함 |
| 스코티시 폴드 | affection:high, activity:low, vocal:low | 온순함, 접힌 귀, 애교 |
| 샴 | vocal:high, affection:high, activity:high | 소통, 집에 자주 있음, 활발함 |
| 페르시안 | activity:low, grooming:high, vocal:low | 조용함, 장모종, 관리 투자 |
| 먼치킨 | activity:high, affection:high, grooming:low | 독특한 외모, 애교, 활발함 |
| 노르웨이 숲 | grooming:high, independence:high, activity:high | 대형, 독립적, 장모종 |

### 검토 포인트
- [x] 질문이 차원을 잘 반영하는가?
- [x] 답변 옵션이 명확한 스펙트럼인가?
- [x] 결과 조건이 합리적인가?
- [ ] **검토 필요**: 스코티시 폴드 건강 문제 언급이 충분한가?

---

## 3. smallPet (소동물)

### 기본 정보
- **연결**: petMatch → "소동물" 결과 후
- **차원**: 5개 (lifespan, handling, noise, space, social)
- **질문**: 6개 기본 + 1개 심화
- **결과**: 7종

### 질문 목록

| # | 질문 | 차원 | 답변 옵션 (점수) |
|---|------|------|-----------------|
| 1 | 소동물과 얼마나 오래 함께하고 싶나요? | lifespan | 2-3년(1) / 5년 이상(3) / 10년 이상(5) |
| 2 | 소동물을 손에 올리고 만지고 싶나요? | handling | 바라보기만(1) / 가끔(3) / 자주(5) |
| 3 | 야행성 동물도 괜찮나요? | noise | 낮에 활동(1) / 상관없음(3) / 밤도 OK(5) |
| 4 | 밤에 쳇바퀴 소리가 나도 괜찮나요? | noise | 조용해야(1) / 다른 방이면 OK(3) / 상관없음(5) |
| 5 | 사육장을 얼마나 크게 둘 수 있나요? | space | 작은 케이지(1) / 중형(3) / 큰 케이지/방 한쪽(5) |
| 6 | 여러 마리를 함께 키우고 싶나요? | social | 한 마리(1) / 상관없음(3) / 여러 마리(5) |

### 결과 매칭 조건

| 종류 | 조건 | 대상 사용자 |
|------|------|------------|
| 골든 햄스터 | lifespan:low, handling:high, noise:high, social:low | 첫 소동물, 볼주머니, 단독 |
| 드워프 햄스터 | lifespan:low, handling:low, noise:high, space:low | 작은 공간, 관찰용, 빠름 |
| 토끼 | lifespan:high, handling:high, space:high, noise:low | 오래 함께, 스킨십, 조용함 |
| 기니피그 | lifespan:high, handling:high, social:high, noise:low | 여러 마리, 소리 소통, 온순 |
| 친칠라 | lifespan:high, handling:low, noise:high, space:high | 오래 함께, 부드러운 털, 경험자 |
| 고슴도치 | lifespan:high, handling:low, noise:high, social:low | 독특함, 단독, 야행성 |
| 페럿 | lifespan:high, handling:high, space:high, social:high | 활발함, 놀이, 다마리 |

### 검토 포인트
- [x] 야행성/주행성 구분이 잘 되어 있는가?
- [x] 수명 기대치가 반영되어 있는가?
- [ ] **검토 필요**: noise 차원명이 "활동시간"인데 실제로 "야행성 허용도"에 가까움 - 혼란 가능

---

## 4. fishType (관상어)

### 기본 정보
- **연결**: petMatch → "관상어" 결과 후
- **차원**: 5개 (difficulty, tankSize, visual, social, maintenance)
- **질문**: 6개 기본 + 0개 심화
- **결과**: 8종

### 질문 목록

| # | 질문 | 차원 | 답변 옵션 (점수) |
|---|------|------|-----------------|
| 1 | 관상어 경험이 있나요? | difficulty | 처음(1) / 금붕어 정도(3) / 열대어 경험(5) |
| 2 | 어느 정도 크기의 수조를 둘 수 있나요? | tankSize | 작은 어항 10L(1) / 중형 30-60L(3) / 대형 60L+(5) |
| 3 | 어떤 스타일의 물고기를 원하나요? | visual | 심플(1) / 예쁜 색상(3) / 화려하고 우아함(5) |
| 4 | 수조 인테리어에 관심 있나요? | visual | 간단히(1) / 적당히(3) / 아쿠아스케이핑(5) |
| 5 | 여러 마리가 함께 헤엄치는 모습을 보고 싶나요? | social | 한 마리 OK(1) / 몇 마리(3) / 군영(5) |
| 6 | 물갈이와 수질 관리에 시간을 쓸 수 있나요? | maintenance | 최소한(1) / 주 1회(3) / 정기적(5) |

### 결과 매칭 조건

| 종류 | 조건 | 대상 사용자 |
|------|------|------------|
| 베타 | difficulty:low, tankSize:low, social:low | 첫 관상어, 작은 공간, 단독 |
| 구피 | difficulty:low, tankSize:low, social:high | 초보자, 번식, 다양한 색상 |
| 네온테트라 | difficulty:low, tankSize:high, social:high, visual:high | 군영, 수초 수조, 아쿠아스케이핑 |
| 금붕어 | difficulty:low, tankSize:high, maintenance:high | 전통적, 오래 함께, 히터 없이 |
| 코리도라스 | difficulty:low, tankSize:high, social:high, maintenance:low | 청소부, 귀여움, 합사 |
| 엔젤피시 | difficulty:high, tankSize:high, visual:high | 우아함, 중급자, 존재감 |
| 디스커스 | difficulty:high, tankSize:high, visual:high, maintenance:high | 상급자, 가장 아름다움, 정성 |
| 플레코 | difficulty:low, tankSize:high, maintenance:low, visual:low | 청소부, 이끼 제거, 야행성 |

### 검토 포인트
- [x] 난이도별 적절한 분류인가?
- [x] 수조 크기 조건이 현실적인가?
- [ ] **검토 필요**: 금붕어가 difficulty:low인데 실제로 관리가 까다로운 편 - medium이 적절할 수 있음

---

## 5. birdType (반려조)

### 기본 정보
- **연결**: petMatch → "새" 결과 후
- **차원**: 5개 (noise, interaction, space, time, experience)
- **질문**: 7개 기본 + 1개 심화
- **결과**: 6종

### 질문 목록

| # | 질문 | 차원 | 답변 옵션 (점수) |
|---|------|------|-----------------|
| 1 | 새 울음소리에 대한 생각은? | noise | 조용함(1) / 지저귐 OK(3) / 시끄러워도 OK(5) |
| 2 | 새가 말을 따라하면 좋겠나요? | noise | 조용한 게 좋음(1) / 간단한 소리(3) / 말 따라하기(5) |
| 3 | 새와 어떤 관계를 원하나요? | interaction | 바라보기(1) / 손에 올리기(3) / 어깨에 앉히기(5) |
| 4 | 새에게 재주를 가르치고 싶나요? | interaction | 그냥 있어줘도(1) / 간단히(3) / 다양한 재주(5) |
| 5 | 새장을 얼마나 크게 둘 수 있나요? | space | 작은 새장(1) / 중형(3) / 큰 새장/방사(5) |
| 6 | 매일 새와 보낼 수 있는 시간은? | time | 30분 이하(1) / 1-2시간(3) / 2시간 이상(5) |
| 7 | 반려조 경험이 있나요? | experience | 처음(1) / 어릴 때(3) / 여러 새(5) |

### 결과 매칭 조건

| 종류 | 조건 | 대상 사용자 |
|------|------|------------|
| 십자매/문조 | noise:low, interaction:low, experience:low | 첫 반려조, 조용함, 관찰용 |
| 카나리아 | noise:high, interaction:low, space:low | 노랫소리, 핸들링 없이, 작은 새 |
| 잉꼬 | noise:high, interaction:high, space:low, experience:low | 초보 핸들링, 작은 앵무, 애교 |
| 코카티엘 | noise:high, interaction:high, time:high, experience:high | 다정함, 휘파람, 스킨십 |
| 모란앵무 | noise:high, interaction:high, space:high | 활발함, 화려함, 장난감 |
| 회색앵무 | noise:high, interaction:high, time:high, space:high, experience:high | 말하는 새, 오래 함께, 경험자 |

### 검토 포인트
- [x] 소음 허용도 기준이 명확한가?
- [x] 초보자/경험자 구분이 적절한가?
- [ ] **검토 필요**: 카나리아가 noise:high인데 "노래"이지 "시끄러움"은 아님 - 해석 혼란 가능

---

## 6. reptileType (파충류)

### 기본 정보
- **연결**: petMatch → "파충류" 결과 후
- **차원**: 5개 (handling, space, feeding, maintenance, experience)
- **질문**: 7개 기본 + 1개 심화
- **결과**: 6종

### 질문 목록

| # | 질문 | 차원 | 답변 옵션 (점수) |
|---|------|------|-----------------|
| 1 | 파충류를 손에 올리고 싶나요? | handling | 바라보기(1) / 가끔(3) / 자주(5) |
| 2 | 사육장을 얼마나 크게 둘 수 있나요? | space | 30cm 이하(1) / 60cm(3) / 90cm 이상(5) |
| 3 | 사육장 인테리어에 관심 있나요? | space | 심플(1) / 적당히(3) / 바이오액티브(5) |
| 4 | 벌레 먹이에 대한 생각은? | feeding | 절대 안 됨(1) / 밀웜/귀뚜라미 OK(3) / 살아있는 벌레 OK(5) |
| 5 | 쥐나 핑키(새끼쥐) 먹이는 괜찮나요? | feeding | 절대 안 됨(1) / 냉동 쥐 OK(3) / 괜찮음(5) |
| 6 | 온도/습도 관리에 대한 생각은? | maintenance | 간단히(1) / 히터/조명 OK(3) / 철저히(5) |
| 7 | 파충류 경험이 있나요? | experience | 처음(1) / 조금(3) / 여러 종류(5) |

### 결과 매칭 조건

| 종류 | 조건 | 대상 사용자 |
|------|------|------------|
| 레오파드 게코 | handling:high, space:low, feeding:high, experience:low | 첫 파충류, 핸들링, 귀여움 |
| 크레스티드 게코 | handling:high, space:low, feeding:low, experience:low | 벌레 없이, 초보자, 귀여움 |
| 비어디드래곤 | handling:high, space:high, feeding:high, maintenance:high | 교감, 주간 활동, 친화력 |
| 옥수수뱀 | handling:high, space:high, feeding:high, experience:high | 뱀 입문, 핸들링, 다양한 색상 |
| 볼 파이톤 | handling:high, space:high, feeding:high, maintenance:high, experience:high | 다양한 모프, 장수, 습도 관리 |
| 붉은귀 거북 | handling:low, space:high, feeding:low, maintenance:high | 거북이, 수생 환경, 관찰 |

### 검토 포인트
- [x] 먹이 허용도(벌레/쥐) 질문이 중요하게 다뤄지는가?
- [x] 초보자 추천(레오파드 게코, 크레스티드 게코)이 적절한가?
- [ ] **검토 필요**: 옥수수뱀이 experience:high인데 실제로 초보 추천종 - low가 맞지 않을까?

---

## 전체 검토 요약

### 확인된 이슈

| # | 테스트 | 이슈 | 심각도 | 제안 |
|---|--------|------|--------|------|
| 1 | dogBreed | 시바견/웰시코기 size:high → 실제 중형견 | 낮음 | medium으로 변경 고려 |
| 2 | smallPet | noise 차원명이 "활동시간"인데 야행성 허용도 | 낮음 | 차원명을 "야행성"으로 변경 고려 |
| 3 | fishType | 금붕어 difficulty:low → 실제 관리 까다로움 | 중간 | medium으로 변경 고려 |
| 4 | birdType | 카나리아 noise:high → "노래"이지 "시끄러움" 아님 | 낮음 | 해석 설명 추가 고려 |
| 5 | reptileType | 옥수수뱀 experience:high → 실제 초보 추천종 | 중간 | low로 변경 고려 |

### 전체 통계

| 테스트 | 질문 수 | 결과 수 | 커버리지 | 빌드 |
|--------|---------|---------|----------|------|
| dogBreed | 8+4 | 12 | 100% | ✓ |
| catBreed | 6+2 | 10 | 100% | ✓ |
| smallPet | 6+1 | 7 | 100% | ✓ |
| fishType | 6+0 | 8 | 100% | ✓ |
| birdType | 7+1 | 6 | 100% | ✓ |
| reptileType | 7+1 | 6 | 100% | ✓ |

### 검토 요청 사항

1. **데이터 정확성**: 각 결과의 condition이 실제 동물 특성과 일치하는가?
2. **사용자 경험**: 질문 흐름이 자연스러운가?
3. **결과 설명**: interpretation, guide, matchPoints가 유용한가?
4. **이슈 처리**: 위 5개 이슈 중 수정이 필요한 것은?

---

*생성일: 2025-12-14*
*검증 스크립트: `scripts/test-detail-tests.mjs`*
