# 반려동물 매칭 테스트 재설계

## 1. 사전 조사 요약

### 1.1 업계 표준 접근 방식

#### PawsLikeMe (데이팅 앱 방식)
- **4가지 핵심 성격 사분면**: Energy, Confidence, Focus, Independence
- **정확도**: 55개 → 25개 질문으로 축소하면서 72% → 91% 정확도 달성
- **동물별 가중치 다름**: 강아지는 Energy/Focus 중심, 고양이는 Independence/Confidence 중심
- **출처**: [Daily Dot](https://www.dailydot.com/debug/pawslikeme-pet-rehoming-algorithm/)

#### 일반 펫 매칭 퀴즈들
- **20개 요소 평가**: 예산, 시간, 공간, 알레르기, 소음, 가족구성 등
- **3~5분 소요**: 10~20개 질문
- **결정 트리 + 점수 매칭 혼합** 방식 사용
- **출처**: [QuizExpo](https://www.quizexpo.com/what-pet-should-i-get-quiz/)

#### Dog Breed Selector
- **10개 핵심 요소**: 에너지, 그루밍, 훈련성, 운동량, 크기, 털빠짐 등
- **품종 데이터베이스 매칭**: 100+ 품종의 특성 DB와 교차 비교
- **출처**: [Rover](https://www.rover.com/blog/dog-breed-selector/)

### 1.2 핵심 인사이트

| 발견 | 현재 문제 | 해결 방향 |
|------|----------|----------|
| 동물 선택과 품종 선택은 별개 | petMatch에서 "강아지" → 끝 | 2단계 구조 (동물군 → 세부 품종) |
| 필터링 질문이 효과적 | 점수 합산만 사용 | 핵심 분기 질문 + 점수 매칭 혼합 |
| 동물별 가중치가 다름 | 모든 차원 동등 취급 | 동물별 중요 차원 차별화 |
| 알레르기/소음은 hard filter | soft scoring으로 처리 | 필터 질문으로 분리 |

---

## 2. 새로운 설계 방향

### 2.1 2단계 매칭 구조

```
[1단계] petMatch: 어떤 동물군이 맞는가?
         │
         ├── 강아지 → dogBreed (품종 추천)
         ├── 고양이 → catBreed (품종 추천)
         ├── 소동물 → smallPet (햄스터/토끼/기니피그 등)
         ├── 관상어 → fishType (어종 추천)
         ├── 새 → birdType (앵무새/카나리아 등)
         └── 파충류 → reptileType (도마뱀/거북이/뱀 등)
```

### 2.2 매칭 알고리즘 변경

**기존**: 점수 합산 → 레벨 변환 → 조건 매칭 (성격 테스트용)

**변경**: 필터링 + 가중치 점수 매칭 (매칭 테스트용)

```javascript
// 새로운 매칭 로직
function matchPet(answers) {
    // 1단계: Hard Filter (해당 안 되면 제외)
    let candidates = ALL_PETS;

    if (answers.allergy === 'fur') {
        candidates = candidates.filter(p => !p.hasFur);
        // → 관상어, 파충류만 남음
    }

    if (answers.noise === 'must_quiet') {
        candidates = candidates.filter(p => p.noiseLevel <= 2);
        // → 새, 강아지 제외
    }

    // 2단계: Weighted Scoring (남은 후보 중 점수 계산)
    for (const pet of candidates) {
        pet.score = 0;

        // 각 동물별로 중요한 차원에 가중치 부여
        for (const [dim, weight] of Object.entries(pet.weights)) {
            pet.score += answers[dim] * weight;
        }
    }

    // 3단계: 정렬 후 Top 1 반환
    return candidates.sort((a, b) => b.score - a.score)[0];
}
```

### 2.3 차원 재설계

#### 기존 차원 (5개)
- lifestyle (생활패턴)
- space (주거공간)
- time (돌봄시간)
- experience (경험도)
- interaction (교감욕구)

#### 새로운 차원 (7개)

| 차원 | 설명 | 질문 예시 |
|------|------|----------|
| **activity** | 활동량/에너지 | "평소 운동을 자주 하시나요?" |
| **space** | 공간 크기 | "집에 마당이나 베란다가 있나요?" |
| **time** | 돌봄 시간 | "하루에 반려동물과 보낼 수 있는 시간은?" |
| **noise** | 소음 허용도 | "반려동물 소리에 민감한 환경인가요?" |
| **touch** | 스킨십 욕구 | "안고 쓰다듬는 교감을 원하시나요?" |
| **care** | 관리 난이도 허용 | "정기적인 미용/청소가 가능한가요?" |
| **budget** | 예산 | "월 평균 반려동물 비용 예상은?" |

#### 필터 질문 (별도)
- **allergy**: 털 알레르기 여부 → 있으면 강아지/고양이/소동물 제외
- **housing**: 주거 형태 → 아파트면 대형견/앵무새 불리
- **family**: 가족 구성 → 어린 아이 있으면 특정 동물 불리

### 2.4 동물별 가중치

| 동물 | activity | space | time | noise | touch | care | budget |
|------|----------|-------|------|-------|-------|------|--------|
| 강아지 | **0.25** | 0.15 | **0.20** | 0.10 | **0.15** | 0.10 | 0.05 |
| 고양이 | 0.10 | 0.10 | **0.20** | 0.05 | 0.15 | 0.15 | 0.10 |
| 소동물 | 0.05 | **0.20** | 0.15 | 0.05 | 0.15 | **0.20** | 0.15 |
| 관상어 | 0.00 | 0.15 | 0.10 | 0.00 | 0.00 | **0.25** | 0.15 |
| 새 | 0.10 | 0.15 | **0.20** | **-0.20** | 0.15 | 0.10 | 0.10 |
| 파충류 | 0.05 | 0.15 | 0.10 | 0.00 | 0.05 | **0.25** | 0.15 |

**설명**:
- 숫자 = 해당 차원이 높을수록 이 동물에 적합
- 음수 = 해당 차원이 높을수록 부적합 (새: 소음 허용 낮으면 부적합)
- **굵게** = 핵심 차원

---

## 3. 질문 설계

### 3.1 질문 수

| 단계 | 질문 수 | 목적 |
|------|--------|------|
| petMatch 기본 | 10개 | 동물군 추천 (필터 2개 + 점수 8개) |
| petMatch 심화 | +8개 | 더 정확한 추천 |
| dogBreed | 8개 | 강아지 품종 추천 |
| catBreed | 6개 | 고양이 품종 추천 |
| smallPet | 6개 | 소동물 종류 추천 |
| fishType | 5개 | 관상어 종류 추천 |
| birdType | 6개 | 새 종류 추천 |
| reptileType | 5개 | 파충류 종류 추천 |

### 3.2 petMatch 질문 구조

#### 필터 질문 (처음 2개)

```javascript
// 이 질문들은 hard filter로 작용
{
    q: "털 알레르기가 있으신가요?",
    type: "filter",
    filterKey: "allergy",
    a: [
        { text: "없어요", value: "none" },
        { text: "약간 있어요", value: "mild" },
        { text: "심해요", value: "severe" }
    ]
}
```

#### 점수 질문 (8개)

```javascript
{
    q: "평소 얼마나 활동적인 편인가요?",
    dimension: "activity",
    a: [
        { text: "매일 운동하고 야외활동 좋아해요", score: 5 },
        { text: "가끔 산책 정도 해요", score: 3 },
        { text: "집에서 쉬는 게 좋아요", score: 1 }
    ]
}
```

### 3.3 세부 테스트 차원 (예: dogBreed)

| 차원 | 설명 | 결과 영향 |
|------|------|----------|
| size | 선호 크기 | 소형/중형/대형 분류 |
| energy | 에너지 레벨 | 활동적/온순 품종 |
| grooming | 그루밍 허용도 | 장모/단모 품종 |
| trainability | 훈련 의지 | 훈련 쉬운/독립적 품종 |
| purpose | 목적 | 반려/경비/작업 품종 |

---

## 4. 결과 구조

### 4.1 petMatch 결과 (1차)

```javascript
{
    name: "강아지",
    emoji: "🐕",
    desc: "충성스럽고 활발한 최고의 친구!",
    interpretation: "...",
    guide: "...",
    matchPoints: ["...", "..."],
    matchScore: 0.85,  // 매칭 점수
    nextTest: "dogBreed",  // 세부 테스트 연결
    alternativeResults: [  // 차순위 결과
        { name: "고양이", emoji: "🐱", score: 0.72 },
        { name: "소동물", emoji: "🐹", score: 0.65 }
    ]
}
```

### 4.2 dogBreed 결과 (2차)

```javascript
{
    name: "골든 리트리버",
    emoji: "🦮",
    category: "대형견",
    desc: "온순하고 가족적인 대표 반려견",
    traits: {
        energy: "high",
        grooming: "medium",
        trainability: "high",
        friendliness: "very_high"
    },
    interpretation: "활동적이고 가족을 사랑하는 당신에게 골든 리트리버는 최고의 동반자예요!",
    guide: "하루 1시간 이상 운동이 필요해요. 털빠짐이 있으니 주기적 빗질이 필요해요.",
    alternatives: [
        { name: "래브라도 리트리버", score: 0.92 },
        { name: "보더 콜리", score: 0.85 }
    ]
}
```

---

## 5. 데이터 구조

### 5.1 타입 확장

```typescript
// types.ts 확장

// 필터 질문 타입
interface FilterQuestion {
    q: string;
    type: 'filter';
    filterKey: string;
    a: { text: string; value: string }[];
}

// 점수 질문 타입 (기존)
interface ScoreQuestion {
    q: string;
    dimension: string;
    a: { text: string; score: number }[];
}

// 통합 질문 타입
type Question = FilterQuestion | ScoreQuestion;

// 매칭 결과 확장
interface MatchingResultLabel extends ResultLabel {
    matchScore?: number;
    nextTest?: string;
    alternativeResults?: { name: string; emoji: string; score: number }[];
    weights?: Record<string, number>;  // 차원별 가중치
    filters?: Record<string, string[]>;  // 필터 조건 (제외될 때)
}

// 세부 테스트 결과
interface BreedResult {
    name: string;
    emoji: string;
    category: string;
    traits: Record<string, string>;
    interpretation: string;
    guide: string;
    alternatives: { name: string; score: number }[];
}
```

### 5.2 SubjectKey 확장

```typescript
export type SubjectKey =
    // 기존
    | 'human' | 'cat' | 'dog' | 'rabbit' | 'hamster'
    | 'idealType' | 'plant' | 'petMatch' | 'coffee' | 'conflictStyle'
    // 신규 (세부 테스트)
    | 'dogBreed' | 'catBreed' | 'smallPet' | 'fishType' | 'birdType' | 'reptileType';
```

---

## 6. UI 흐름

### 6.1 결과 화면 개선

```
┌─────────────────────────────────────┐
│ 🏠                            🔗    │
├─────────────────────────────────────┤
│              🐕                     │
│          강아지                      │
│      ━━ happy TYPE ━━               │
│                                     │
│    "충성스럽고 활발한 최고의 친구!"   │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 매칭 점수: 85%                  ││
│  │ ████████████░░░░               ││
│  └─────────────────────────────────┘│
│                                     │
│  🎯 이런 분에게 추천해요            │
│  ✓ 매일 산책 가능한 분              │
│  ✓ 적극적인 교감을 원하는 분         │
│                                     │
│  💡 해석 | 📋 조언                  │
│  ─────────────────────────────────  │
│  [해석 내용...]                     │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🔍 어떤 품종이 맞을까?          ││
│  │    강아지 품종 테스트 하기 →    ││
│  └─────────────────────────────────┘│
│                                     │
│  ─────── 다른 추천 결과 ───────      │
│  🐱 고양이 (72%)  🐹 소동물 (65%)   │
│                                     │
└─────────────────────────────────────┘
```

### 6.2 세부 테스트 진입점

1. **결과 화면의 버튼**: "강아지 품종 테스트 하기 →"
2. **홈 화면**: petMatch 완료 후 세부 테스트 추천
3. **직접 선택**: 테스트 목록에서 세부 테스트 선택 (1차 건너뛰기)

---

## 7. 구현 계획

### Phase 1: petMatch 재설계 ✅ 완료 (2025-12-14)
1. [x] 차원 재정의 (6개: activity, space, time, noise, touch, care)
2. [x] 기존 조건 매칭 로직 활용 (조건 개수로 우선순위)
3. [x] 질문 작성 (10개 기본 + 8개 심화)
4. [x] 결과 라벨 재작성 (6개 동물군 + nextTest 연결)
5. [x] 커버리지 검증 완료

**커버리지 결과:**
- 강아지: 35.0% (인기 동물이라 높아도 OK)
- 고양이: 24.0% ✓
- 소동물: 15.1% ✓
- 관상어: 10.3% ✓
- 파충류: 10.2% ✓
- 새: 5.5% (소음 조건이 까다로워서 낮음)

### Phase 2: 세부 테스트 추가 (예정)
1. [ ] dogBreed 테스트 (8개 질문, 10+ 품종)
2. [ ] catBreed 테스트 (6개 질문, 8+ 품종)
3. [ ] smallPet 테스트 (6개 질문, 5+ 종류)
4. [ ] fishType 테스트 (5개 질문, 6+ 어종)
5. [ ] birdType 테스트 (6개 질문, 5+ 종류)
6. [ ] reptileType 테스트 (5개 질문, 5+ 종류)

### Phase 3: 연결 및 검증 (예정)
1. [ ] 1차 → 2차 테스트 UI 연결 (nextTest 버튼)
2. [ ] 실제 사용자 테스트
3. [ ] 피드백 기반 조건 조정

---

## 8. 세부 테스트 결과 초안

### 8.1 dogBreed (강아지 품종)

| 품종 | 크기 | 에너지 | 특징 |
|------|------|--------|------|
| 골든 리트리버 | 대형 | 높음 | 온순, 가족적 |
| 래브라도 리트리버 | 대형 | 높음 | 친근, 훈련 쉬움 |
| 보더 콜리 | 중형 | 매우 높음 | 지능 높음, 활동적 |
| 푸들 | 소/중/대 | 중간 | 저알레르기, 똑똑 |
| 말티즈 | 소형 | 낮음 | 애교, 실내생활 |
| 시츄 | 소형 | 낮음 | 온순, 실내생활 |
| 웰시코기 | 중형 | 높음 | 활발, 목양견 기질 |
| 비글 | 중형 | 높음 | 호기심, 후각 예민 |
| 프렌치 불독 | 소형 | 낮음 | 조용, 아파트 적합 |
| 시바견 | 중형 | 중간 | 독립적, 깔끔 |

### 8.2 catBreed (고양이 품종)

| 품종 | 성격 | 활동성 | 특징 |
|------|------|--------|------|
| 코리안 숏헤어 | 다양 | 중간 | 건강, 적응력 |
| 러시안 블루 | 도도 | 낮음 | 조용, 1인 가정 |
| 랙돌 | 온순 | 낮음 | 애교, 안기기 좋아함 |
| 아비시니안 | 활발 | 높음 | 호기심, 운동 필요 |
| 브리티시 숏헤어 | 온순 | 낮음 | 독립적, 조용 |
| 스코티시 폴드 | 온순 | 낮음 | 애교, 접힌 귀 |
| 노르웨이 숲 | 온순 | 중간 | 장모, 독립적 |
| 샴 | 활발 | 높음 | 수다쟁이, 교감 좋아함 |

### 8.3 smallPet (소동물)

| 종류 | 수명 | 관리 | 특징 |
|------|------|------|------|
| 골든 햄스터 | 2-3년 | 쉬움 | 야행성, 혼자 생활 |
| 드워프 햄스터 | 1.5-2년 | 쉬움 | 작음, 빠름 |
| 토끼 (네덜란드) | 8-12년 | 중간 | 온순, 사회적 |
| 토끼 (홀랜드롭) | 7-10년 | 중간 | 늘어진 귀, 애교 |
| 기니피그 | 5-7년 | 중간 | 사회적, 소리로 소통 |
| 친칠라 | 15-20년 | 어려움 | 수명 긺, 야행성 |
| 고슴도치 | 4-6년 | 중간 | 독특, 야행성 |

### 8.4 fishType (관상어)

| 어종 | 난이도 | 수조 크기 | 특징 |
|------|--------|----------|------|
| 베타 | 쉬움 | 소형 | 단독 사육, 화려함 |
| 구피 | 쉬움 | 소형 | 번식 쉬움, 화려함 |
| 네온테트라 | 쉬움 | 중형 | 군영, 아름다움 |
| 금붕어 | 쉬움 | 대형 | 수명 긺, 튼튼 |
| 엔젤피시 | 중간 | 대형 | 우아, 수질 민감 |
| 디스커스 | 어려움 | 대형 | 열대어의 왕, 고급 |

### 8.5 birdType (새)

| 종류 | 수명 | 소음 | 특징 |
|------|------|------|------|
| 잉꼬 | 10-15년 | 중간 | 말 배움, 활발 |
| 카나리아 | 10-15년 | 낮음 | 노래, 관상용 |
| 십자매/문조 | 5-10년 | 낮음 | 조용, 초보자용 |
| 코카티엘 | 15-25년 | 중간 | 휘파람, 애교 |
| 모란앵무 | 15-20년 | 높음 | 활발, 쌍으로 키움 |
| 회색앵무 | 40-60년 | 높음 | 말 잘함, 지능 높음 |

### 8.6 reptileType (파충류)

| 종류 | 난이도 | 크기 | 특징 |
|------|--------|------|------|
| 레오파드 게코 | 쉬움 | 소형 | 초보자 추천, 온순 |
| 크레스티드 게코 | 쉬움 | 소형 | 핸들링 좋음 |
| 비어디드래곤 | 중간 | 중형 | 온순, 교감 가능 |
| 옥수수뱀 | 쉬움 | 중형 | 온순, 초보자 추천 |
| 볼 파이톤 | 중간 | 중형 | 수줍음, 인기 많음 |
| 붉은귀 거북 | 중간 | 대형 | 수명 긺, 공간 필요 |

---

## 9. 참고 자료

- [PawsLikeMe Algorithm](https://www.dailydot.com/debug/pawslikeme-pet-rehoming-algorithm/)
- [QuizExpo Pet Quiz](https://www.quizexpo.com/what-pet-should-i-get-quiz/)
- [Rover Dog Breed Selector](https://www.rover.com/blog/dog-breed-selector/)
- [SPCA Adoption Questions](https://spcanevada.org/10-questions-to-ask-yourself-before-adopting-a-pet/)
- [Dog Adoption Questionnaire](https://topdogtips.com/dog-adoption-questionnaire/)

---

## 10. 결정 필요 사항

### Q1: 필터링 방식
- **옵션 A**: Hard filter (알레르기 있으면 털 동물 완전 제외)
- **옵션 B**: Soft penalty (알레르기 있으면 점수 감점)
- **추천**: A + B 혼합 (심한 알레르기는 제외, 약한 알레르기는 감점)

### Q2: 세부 테스트 필수 여부
- **옵션 A**: 1차만 완료해도 충분 (세부는 선택)
- **옵션 B**: 세부까지 해야 의미 있는 결과
- **추천**: A (세부는 "더 알아보기" 느낌)

### Q3: 기존 동물 테스트(cat, dog 등)와 통합
- **현재**: cat/dog은 "나는 어떤 고양이/강아지?" (성격 테스트)
- **petMatch**: "나에게 맞는 반려동물은?" (매칭 테스트)
- **결정 필요**: 두 테스트 목적이 다르므로 별도 유지? 통합?

### Q4: 매칭 점수 표시
- **옵션 A**: 백분율 (85%)
- **옵션 B**: 별점 (★★★★☆)
- **옵션 C**: 표시 안 함 (결과만)
- **추천**: A (투명성, 신뢰도)

---

## 다음 단계

1. **위 결정 사항 확정**
2. **petMatch 질문 작성** (기존 질문 재활용 + 신규)
3. **매칭 로직 구현** (필터 + 가중치)
4. **검증 스크립트** 작성
5. **UI 개선** (nextTest 버튼, 대안 결과 표시)
