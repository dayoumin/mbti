# 이상형 매칭 테스트 계획서

## 개요

현재 "성격 분석" 테스트와 달리, **이상형 테스트**는 "매칭/추천" 형태의 새로운 패턴입니다.

### 현재 테스트 vs 이상형 테스트

| 항목 | 현재 (성격 분석) | 이상형 (매칭형) |
|------|-----------------|----------------|
| **목적** | 나/반려동물의 성격 파악 | 나와 맞는 유형 추천 |
| **질문 방식** | "당신은 어떤가요?" | "어떤 게 좋아요?" |
| **결과** | 성격 유형 라벨 | 매칭 대상 추천 |
| **차원** | 성격 특성 (Big Five 등) | 선호도/가치관 |

---

## 이상형 테스트 유형 분석

### 1. 연애 이상형 테스트

**학술 기반**: 애착 이론 (Attachment Theory), 사랑의 삼각 이론 (Sternberg)

**차원 설계안**:
```
dimensions:
  - passion: 열정 선호도 (뜨거운 ↔ 차분한)
  - commitment: 헌신 기대치 (진지한 ↔ 가벼운)
  - intimacy: 친밀감 스타일 (밀착형 ↔ 독립형)
  - communication: 소통 방식 (표현적 ↔ 과묵한)
  - lifestyle: 라이프스타일 (액티브 ↔ 홈바디)
```

**결과 예시**:
- "다정다감 연인" - 친밀감 높고 표현적인 상대 선호
- "든든한 연인" - 헌신도 높고 안정적인 상대 선호
- "자유로운 연인" - 독립성 존중하는 상대 선호

### 2. 반려식물 매칭 테스트

**특징**: 사용자의 라이프스타일을 분석해 맞는 식물 추천

**차원 설계안**:
```
dimensions:
  - waterCare: 물주기 빈도 (자주 ↔ 드물게)
  - lightNeed: 햇빛 환경 (양지 ↔ 음지)
  - spaceSize: 공간 여유 (넓음 ↔ 좁음)
  - careLevel: 관리 정성 (많이 ↔ 적게)
  - growthPref: 성장 선호 (빠름 ↔ 느림)
```

**결과 예시**:
- "다육이가 딱!" - 물주기 드물고 양지 환경
- "몬스테라 추천" - 간접광, 중간 관리
- "스투키와 함께" - 방치형, 어두운 환경

### 3. 직장/팀 케미 테스트

**학술 기반**: DISC, 벨빈 팀 역할 이론

**차원 설계안**:
```
dimensions:
  - leadership: 리더십 스타일 (주도적 ↔ 서포트)
  - decision: 의사결정 (빠름 ↔ 신중함)
  - teamwork: 협업 방식 (협동 ↔ 개인)
  - feedback: 피드백 선호 (직접적 ↔ 우회적)
  - stress: 스트레스 대처 (도전 ↔ 안정)
```

---

## 구현 방향

### Option A: 현재 앱 확장 (권장)

현재 SUBJECT_CONFIG 아키텍처를 활용하되, 결과 형식만 다르게 처리

```javascript
// data.js - SUBJECT_CONFIG
idealType: {
    icon: "HeartIcon",
    label: "이상형",
    intro: ["나의 이상형은?", "어떤 사람이 맞을까?"],
    resultFormat: "matching",  // 새로운 형식
    deepButtonText: "이상형"
}
```

**App.js에 추가할 로직**:
```javascript
{subjectConfig.resultFormat === 'matching' && (
    <MatchingResult result={finalResult} />
)}
```

### Option B: 별도 앱

이상형 테스트만을 위한 별도 앱 생성
- 장점: 특화된 UX
- 단점: 코드 중복

---

## 결과 표시 방식 차이

### 현재 (성격 분석형)
```
┌─────────────────────────────┐
│  🐱 보스 고양이              │
│                             │
│  "내가 곧 규칙이다냥"         │
│                             │
│  [심층 해석] [육아 팁]        │
└─────────────────────────────┘
```

### 이상형 (매칭형)
```
┌─────────────────────────────┐
│  💕 당신의 이상형은...        │
│                             │
│  🌟 "다정다감 연인"          │
│                             │
│  매칭 포인트:                │
│  ✓ 감정 표현을 잘 하는 사람   │
│  ✓ 함께 시간을 보내는 걸 좋아함│
│  ✓ 배려심이 깊은 사람        │
│                             │
│  [케미 분석] [연애 팁]        │
└─────────────────────────────┘
```

---

## 구현 우선순위

| 순위 | 테스트 유형 | 난이도 | 예상 작업 |
|------|------------|--------|----------|
| 1 | 연애 이상형 | 중간 | 차원 설계, 질문 작성, 매칭 결과 UI |
| 2 | 반려식물 매칭 | 쉬움 | 현재 패턴과 유사, 결과만 다름 |
| 3 | 직장 케미 | 어려움 | 복잡한 차원, 팀 매칭 로직 |

---

## 연애 이상형 테스트 상세 설계

### 차원 (5개)

| 키 | 이름 | 설명 | 낮음 | 높음 |
|----|------|------|------|------|
| passion | 열정 | 연애 온도 | 차분하고 담백한 | 뜨겁고 적극적인 |
| commit | 헌신 | 관계 진지도 | 가볍고 자유로운 | 진지하고 깊은 |
| close | 친밀 | 밀착 정도 | 독립적인 | 붙어다니는 |
| express | 표현 | 감정 표현 | 과묵한 | 애정 표현 풍부 |
| active | 활동 | 데이트 스타일 | 집에서 | 밖에서 활동 |

### 질문 예시 (기본 12개)

```javascript
questions: [
    // passion
    {
        q: "연인에게 받고 싶은 연락 빈도는?",
        dimension: "passion",
        a: [
            { text: "수시로! 뭐해? 밥 먹었어?", score: 5 },
            { text: "필요할 때만 하면 돼", score: 1 }
        ]
    },
    {
        q: "기념일에 대한 생각은?",
        dimension: "passion",
        a: [
            { text: "100일, 200일... 다 챙기고 싶어!", score: 5 },
            { text: "생일이랑 연말 정도면 충분해", score: 1 }
        ]
    },
    // commit
    {
        q: "연애를 시작할 때 나는?",
        dimension: "commit",
        a: [
            { text: "결혼까지 생각하고 시작해", score: 5 },
            { text: "일단 만나보고 결정해", score: 1 }
        ]
    },
    // ... 등
]
```

### 결과 라벨 예시 (8개)

```javascript
resultLabels: [
    {
        name: "다정다감 연인",
        emoji: "🥰",
        desc: "따뜻한 말과 행동으로 사랑을 표현하는 상대",
        condition: { passion: "high", express: "high", close: "high" },
        matchPoints: [
            "매일 연락하며 안부를 묻는 사람",
            "스킨십과 애정 표현이 풍부한 사람",
            "함께하는 시간을 중요하게 여기는 사람"
        ],
        interpretation: "당신은 감정적 교감과 따뜻한 소통을 중요시해요...",
        guide: "첫 만남에서 상대방이 얼마나 적극적으로 대화하는지..."
    },
    // ...
]
```

---

## 반려식물 매칭 상세 설계

### 차원 (5개)

| 키 | 이름 | 설명 |
|----|------|------|
| water | 물주기 | 식물 관리 빈도 |
| light | 햇빛 | 집의 채광 환경 |
| space | 공간 | 키울 수 있는 공간 크기 |
| care | 정성 | 관리에 투자할 시간 |
| growth | 성장 | 빠른 성장 vs 천천히 |

### 결과 예시

```javascript
resultLabels: [
    {
        name: "다육이 친구",
        emoji: "🌵",
        desc: "물 적게, 햇빛 많이! 초보자 맞춤",
        plants: ["에케베리아", "알로에", "선인장"],
        careTips: "일주일에 한 번 물주기, 양지 추천"
    },
    {
        name: "몬스테라 메이트",
        emoji: "🌿",
        desc: "인테리어 효과 만점! 중급자용",
        plants: ["몬스테라", "필로덴드론", "고무나무"],
        careTips: "흙이 마르면 물주기, 간접광 추천"
    },
    // ...
]
```

---

## 기술적 고려사항

### 1. resultFormat 확장

```javascript
// SUBJECT_CONFIG
resultFormat: "simple" | "tabs" | "matching" | "plant"
```

### 2. App.js 결과 렌더링 분기

```javascript
const ResultContent = ({ format, result, config }) => {
    switch (format) {
        case 'simple':
            return <SimpleResult result={result} />;
        case 'tabs':
            return <TabsResult result={result} />;
        case 'matching':
            return <MatchingResult result={result} />;
        case 'plant':
            return <PlantResult result={result} />;
    }
};
```

### 3. 새로운 결과 필드

```javascript
// 매칭형 결과 라벨
{
    name: "다정다감 연인",
    matchPoints: ["특징1", "특징2", "특징3"],  // 새 필드
    plants: ["식물1", "식물2"],  // 식물 매칭용
    // 기존 필드도 유지
    interpretation: "...",
    guide: "..."
}
```

---

## 다음 단계

### Phase 1: 연애 이상형 테스트 (2-3시간)
1. [ ] HeartIcon 아이콘 추가
2. [ ] 차원 및 질문 데이터 작성
3. [ ] 결과 라벨 8개 설계
4. [ ] `resultFormat: "matching"` 처리 로직 추가
5. [ ] MatchingResult 컴포넌트 구현

### Phase 2: 반려식물 매칭 (1-2시간)
1. [ ] PlantIcon 아이콘 추가
2. [ ] 차원 및 질문 데이터 작성
3. [ ] 결과 라벨 (식물 추천) 설계
4. [ ] PlantResult 컴포넌트 구현

---

## 참고 자료

- 애착 이론: Bowlby, J. (1969)
- 사랑의 삼각 이론: Sternberg, R. J. (1986)
- 연애 스타일: Lee, J. A. (1973) - Colors of Love
