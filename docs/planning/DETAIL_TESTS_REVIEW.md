# petMatch 세부 테스트 구현 리뷰

## 개요

petMatch 테스트에서 동물 종류(강아지, 고양이, 소동물, 관상어, 새, 파충류) 결과 후 연결되는 **세부 추천 테스트** 6개를 구현했습니다.

## 구현된 세부 테스트

| 테스트 | 파일 | 결과 수 | 질문 수 | 차원 |
|--------|------|---------|---------|------|
| **dogBreed** | `subjects/dogBreed.ts` | 12개 품종 | 8+4(심화) | size, energy, grooming, training, independence |
| **catBreed** | `subjects/catBreed.ts` | 10개 품종 | 6+2(심화) | activity, affection, grooming, vocal, independence |
| **smallPet** | `subjects/smallPet.ts` | 7종 | 6+1(심화) | lifespan, handling, noise, space, social |
| **fishType** | `subjects/fishType.ts` | 8종 | 6+0(심화) | difficulty, tankSize, visual, social, maintenance |
| **birdType** | `subjects/birdType.ts` | 6종 | 7+1(심화) | noise, interaction, space, time, experience |
| **reptileType** | `subjects/reptileType.ts` | 6종 | 7+1(심화) | handling, space, feeding, maintenance, experience |

## 2단계 테스트 구조

```
petMatch (반려동물 매칭)
├── 강아지 선택 → dogBreed (품종 추천)
│   └── 골든 리트리버, 래브라도, 푸들, 말티즈, 시츄, 포메라니안...
├── 고양이 선택 → catBreed (품종 추천)
│   └── 코리안 숏헤어, 러시안 블루, 랙돌, 아비시니안, 브리티시 숏헤어...
├── 소동물 선택 → smallPet (종류 추천)
│   └── 골든 햄스터, 드워프 햄스터, 토끼, 기니피그, 친칠라, 고슴도치, 페럿
├── 관상어 선택 → fishType (종류 추천)
│   └── 베타, 구피, 네온테트라, 금붕어, 코리도라스, 엔젤피시, 디스커스, 플레코
├── 새 선택 → birdType (종류 추천)
│   └── 십자매/문조, 카나리아, 잉꼬, 코카티엘, 모란앵무, 회색앵무
└── 파충류 선택 → reptileType (종류 추천)
    └── 레오파드 게코, 크레스티드 게코, 비어디드래곤, 옥수수뱀, 볼 파이톤, 붉은귀 거북
```

## 결과 매칭 로직

### 점수 → 레벨 변환
```javascript
점수 비율 = 점수 / (문항수 × 5) × 100
- HIGH: 60% 이상
- MEDIUM: 40~60%
- LOW: 40% 이하
```

### 매칭 우선순위
1. **완전 매칭**: 모든 condition이 일치하는 결과 중 조건이 가장 많은 것
2. **부분 매칭**: 완전 매칭 없으면, 가장 많은 조건이 일치하는 결과
3. **폴백**: 아무것도 없으면 마지막 결과

## 각 테스트 상세

### 1. dogBreed (강아지 품종)

**차원 설명:**
| 차원 | 설명 | 예시 |
|------|------|------|
| size | 선호하는 크기 | low=소형, medium=중형, high=대형 |
| energy | 원하는 활동량 | low=조용한 실내견, high=활발한 운동견 |
| grooming | 털 관리 의향 | low=짧은털, high=풍성한털 |
| training | 훈련 관심도 | low=기본만, high=다양한훈련 |
| independence | 독립성 허용 | low=항상함께, high=혼자있어도OK |

**결과 품종 (12종):**
- 대형: 골든 리트리버, 래브라도 리트리버
- 중형: 웰시코기, 비글, 시바견, 보더 콜리
- 소형: 푸들, 말티즈, 시츄, 포메라니안, 프렌치 불독, 요크셔테리어

### 2. catBreed (고양이 품종)

**차원 설명:**
| 차원 | 설명 | 예시 |
|------|------|------|
| activity | 활동성 | low=얌전, high=활발 |
| affection | 애교도 | low=도도함, high=개냥이 |
| grooming | 털 관리 | low=단모, high=장모 |
| vocal | 수다 정도 | low=조용, high=수다쟁이 |
| independence | 독립성 | low=항상함께, high=혼자OK |

**결과 품종 (10종):**
코리안 숏헤어, 러시안 블루, 랙돌, 아비시니안, 브리티시 숏헤어, 스코티시 폴드, 샴, 페르시안, 먼치킨, 노르웨이 숲

### 3. smallPet (소동물)

**차원 설명:**
| 차원 | 설명 | 예시 |
|------|------|------|
| lifespan | 원하는 동반 기간 | low=2-3년, high=10년+ |
| handling | 스킨십 욕구 | low=바라보기만, high=자주안기 |
| noise | 야행성 허용 | low=낮활동, high=밤활동OK |
| space | 케이지 공간 | low=작은것, high=큰것 |
| social | 다마리 사육 | low=단독, high=다마리 |

**결과 종류 (7종):**
골든 햄스터, 드워프 햄스터, 토끼, 기니피그, 친칠라, 고슴도치, 페럿

### 4. fishType (관상어)

**차원 설명:**
| 차원 | 설명 | 예시 |
|------|------|------|
| difficulty | 사육 난이도 | low=초보OK, high=경험자용 |
| tankSize | 수조 크기 | low=10L이하, high=60L+ |
| visual | 시각적 효과 | low=심플, high=화려 |
| social | 군영 여부 | low=단독, high=군영 |
| maintenance | 관리 투자 | low=최소, high=정기적 |

**결과 종류 (8종):**
베타, 구피, 네온테트라, 금붕어, 코리도라스, 엔젤피시, 디스커스, 플레코

### 5. birdType (반려조)

**차원 설명:**
| 차원 | 설명 | 예시 |
|------|------|------|
| noise | 소음 허용 | low=조용한새, high=시끄러워도OK |
| interaction | 교감 정도 | low=바라보기, high=어깨에앉히기 |
| space | 새장 크기 | low=작은것, high=큰것 |
| time | 돌봄 시간 | low=30분이하, high=2시간+ |
| experience | 반려조 경험 | low=처음, high=경험자 |

**결과 종류 (6종):**
십자매/문조, 카나리아, 잉꼬, 코카티엘, 모란앵무, 회색앵무

### 6. reptileType (파충류)

**차원 설명:**
| 차원 | 설명 | 예시 |
|------|------|------|
| handling | 핸들링 욕구 | low=바라보기, high=자주만지기 |
| space | 사육장 크기 | low=30cm이하, high=90cm+ |
| feeding | 먹이 허용도 | low=채소만, high=살아있는벌레OK |
| maintenance | 온습도 관리 | low=간단히, high=철저히 |
| experience | 파충류 경험 | low=처음, high=경험자 |

**결과 종류 (6종):**
레오파드 게코, 크레스티드 게코, 비어디드래곤, 옥수수뱀, 볼 파이톤, 붉은귀 거북

## 시나리오 테스트 결과

| 시나리오 | 테스트 | 예상 결과 | 실제 결과 | 통과 |
|----------|--------|-----------|-----------|------|
| 초보자+소형견+조용 | dogBreed | 말티즈/시츄/프렌치 | 말티즈 | ✅ |
| 활동적+대형견+훈련열정 | dogBreed | 골든/래브라도/보더콜리 | 골든 리트리버 | ✅ |
| 바쁜직장인+독립적고양이 | catBreed | 러시안블루/브리티시/코숏 | 러시안 블루 | ✅ |
| 첫소동물+짧은수명OK | smallPet | 햄스터류 | 골든 햄스터 | ✅ |
| 첫어항+간단관리 | fishType | 베타/구피 | 베타 | ✅ |
| 첫반려조+조용함 | birdType | 십자매/문조/카나리아 | 십자매/문조 | ✅ |
| 첫파충류+핸들링원함 | reptileType | 레오파드게코/크레스티드 | 레오파드 게코 | ✅ |

**시나리오 테스트: 7/7 통과**

## 커버리지 분석 (해결)

검증 스크립트 기준으로 모든 결과가 **도달 가능**하도록 정리했습니다.

### 원인
- 결과 `condition` 중복/부분집합으로 인해 매칭 우선순위에서 항상 밀림
- 질문 수가 1~2개인 차원은 점수 체계(1/3/5, HIGH=60/LOW=40)상 `medium`이 도달 불가
- 커버리지 스크립트의 조합 생성이 단순화되어(차원별 점수를 대표값 1/3/5로만 처리) 일부 케이스가 과소 탐색됨

### 조치
- `scripts/test-detail-tests.mjs`: 차원별로 가능한 점수 조합을 모두 탐색해(level set) 커버리지 계산 정확도 개선
- 세부 테스트들의 `condition`에서 도달 불가 레벨/중복 패턴을 조정하여 모든 결과가 최소 1회 이상 선택되도록 수정

## 수정된 파일 목록

### 새로 생성된 파일
- `next-app/src/data/subjects/dogBreed.ts`
- `next-app/src/data/subjects/catBreed.ts`
- `next-app/src/data/subjects/smallPet.ts`
- `next-app/src/data/subjects/fishType.ts`
- `next-app/src/data/subjects/birdType.ts`
- `next-app/src/data/subjects/reptileType.ts`

### 수정된 파일
- `next-app/src/data/types.ts` - SubjectKey 확장
- `next-app/src/data/index.ts` - import/export 추가
- `next-app/src/data/config.ts` - SUBJECT_CONFIG 추가
- `next-app/src/data/subjects/petMatch.ts` - nextTest 필드 추가
- `next-app/src/app/dashboard/page.tsx` - TEST_ICONS 추가

### 검증 스크립트
- `scripts/test-detail-tests.mjs` - 세부 테스트 검증용

## 빌드 상태

```
✅ npm run build 성공
✅ TypeScript 컴파일 성공
✅ 시나리오 테스트 7/7 통과
✅ 커버리지 검증 6/6 통과
```

## 리뷰 요청 사항

1. **데이터 품질**: 각 테스트의 질문과 결과가 실제 반려동물 특성을 잘 반영하는가?
2. **커버리지**: 도달 불가능한 결과들의 condition 수정 방향
3. **사용자 경험**: petMatch → 세부 테스트 연결 흐름이 자연스러운가?
4. **확장성**: 향후 새로운 품종/종류 추가 시 구조가 적절한가?

## 다음 단계

1. UI에서 nextTest 연결 구현
2. 사용자 시나리오 정의 및 UX 플로우 설계
