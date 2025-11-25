# 코드 리팩토링 계획

> MBTI® 용어 제거 및 "케미 테스트" 프레임워크로 전환
>
> ⚠️ **목표**: 법적으로 안전한 Big Five/Feline Five/C-BARQ 기반 시스템으로 마이그레이션

---

## 1. 리팩토링 대상 파일

### 1.1 파일별 변경 필요 사항

| 파일 | 우선순위 | 변경 범위 | 설명 |
|------|----------|-----------|------|
| **data.js** | 🔴 높음 | 전체 재작성 | 16가지 MBTI 유형 → 새로운 라벨 시스템 |
| **App.js** | 🔴 높음 | 대폭 수정 | 점수 계산 로직, UI 텍스트 변경 |
| **index.html** | 🟡 중간 | 제목/메타 | `<title>` 및 메타 태그 변경 |
| **components/TraitBar.js** | 🟡 중간 | 수정 | E/I, S/N 등 → 새 차원명 (인싸력 등) |
| **components/ModeTabs.js** | 🟢 낮음 | 소폭 수정 | 탭 텍스트 변경 (필요시) |
| **components/Icons.js** | ⚪ 없음 | 변경 없음 | 아이콘은 그대로 사용 |
| **dist/index.html** | 🟡 중간 | 빌드 후 | index.html 변경 후 재빌드 |
| **bundle.js** | 🟡 중간 | 빌드 후 | 모든 변경 완료 후 재번들링 |
| **test-mbti.js** | 🟢 낮음 | 파일명 변경 | test-chemi.js로 리네임 |

---

## 2. data.js 리팩토링

### 2.1 현재 구조 (문제점)

```javascript
// ❌ 현재: MBTI 16가지 유형 코드 사용
const results_cat = {
    "ISTJ": { title: "규칙 냥이", ... },
    "ISFJ": { title: "천사 냥이", ... },
    "ENFP": { title: "댕댕 냥이", ... },
    // ... 16가지 유형
};

// ❌ 현재: E/I, S/N, T/F, J/P 점수 체계
questions: [
    { q: "질문", type: "EI", a: [
        { text: "답변1", score: "E" },
        { text: "답변2", score: "I" }
    ]}
]
```

### 2.2 새로운 구조 (목표)

```javascript
// ✅ 새로운 구조: 차원별 점수 기반
const CHEMI_DATA = {
    human: {
        title: "내 맘 테스트",
        subtitle: "재미로 보는 성격 테스트 🔮",
        themeColor: "bg-[#BDE0FE]",
        icon: "HumanIcon",
        dimensions: {
            inssa: { name: "인싸력", emoji: "🎉", description: "사람들과 어울리는 에너지" },
            adventure: { name: "모험력", emoji: "🚀", description: "새로운 거 도전하는 힘" },
            empathy: { name: "공감력", emoji: "💕", description: "마음 읽어주는 능력" },
            plan: { name: "계획력", emoji: "📋", description: "착착 준비하는 능력" },
            mental: { name: "멘탈력", emoji: "💪", description: "흔들리지 않는 마음" }
        },
        questions: [
            {
                id: "human_inssa_01",
                dimension: "inssa",
                q: "동창회에서 어색한 친구들 사이에서 나는?",
                options: [
                    { text: "친한 친구 옆에 붙어있는다", score: 2 },
                    { text: "상황봐서 적당히 인사한다", score: 3 },
                    { text: "먼저 말 걸며 분위기 띄운다", score: 5 }
                ]
            },
            // ...
        ],
        resultLabels: [
            {
                id: "passion_mansoor",
                name: "열정 만수르",
                conditions: { inssa: "high", adventure: "high" },
                description: "일단 GO! 생각은 나중에!",
                emoji: "🔥",
                tips: ["새로운 도전을 두려워하지 마세요", "가끔은 쉬어가도 괜찮아요"]
            },
            // ...
        ]
    },
    cat: {
        title: "냥심 테스트",
        subtitle: "우리 냥이 마음 들여다보기 🐱",
        themeColor: "bg-[#FFD1DC]",
        icon: "CatFace",
        dimensions: {
            curious: { name: "호기심", emoji: "👀", description: "뭐든 궁금해!" },
            alert: { name: "경계심", emoji: "🔔", description: "항상 촉 세우는 중" },
            boss: { name: "보스력", emoji: "👑", description: "이 집의 주인은 나다냥" },
            random: { name: "변덕력", emoji: "🎲", description: "오늘 기분은 복불복" },
            cute: { name: "애교력", emoji: "😻", description: "츄르 앞에선 순둥이" }
        },
        questions: [/* ... */],
        resultLabels: [
            {
                id: "explorer_cute",
                name: "탐험가 애교냥",
                conditions: { curious: "high", cute: "high" },
                description: "뭐든 궁금하고 츄르면 최고!",
                emoji: "🐱",
                tips: ["새로운 장난감을 자주 바꿔주세요"]
            },
            // ...
        ]
    },
    dog: {
        title: "댕심 테스트",
        subtitle: "우리 댕댕이 마음 들여다보기 🐕",
        themeColor: "bg-[#C8E6C9]",
        icon: "DogFace",
        dimensions: {
            energy: { name: "에너지", emoji: "⚡", description: "우다다 파워!" },
            humanLove: { name: "집사 사랑", emoji: "🥰", description: "주인이 최고야!" },
            dogFriend: { name: "댕친력", emoji: "🐕‍🦺", description: "강아지 친구 사귀기" },
            focus: { name: "집중력", emoji: "🎯", description: "간식 앞에선 천재견" },
            brave: { name: "용감력", emoji: "🦁", description: "무서운 거 없다 멍!" },
            persist: { name: "끈기력", emoji: "🦴", description: "포기란 없다 멍!" }
        },
        questions: [/* ... */],
        resultLabels: [/* ... */]
    }
};

window.CHEMI_DATA = CHEMI_DATA;
```

### 2.3 점수 계산 방식 변경

**현재 (MBTI식):**
```javascript
// E vs I 이분법 → ENFP 같은 4글자 코드
const typeE = scores.E > scores.I ? "E" : "I";
const resultKey = typeE + typeS + typeT + typeJ; // "ENFP"
```

**새로운 방식 (스펙트럼):**
```javascript
// 각 차원별 0-100 점수
const scores = {
    inssa: 75,      // 인싸력 75점
    adventure: 60,  // 모험력 60점
    empathy: 80,    // 공감력 80점
    plan: 45,       // 계획력 45점
    mental: 70      // 멘탈력 70점
};

// 조건 기반 라벨 매칭
function getResultLabel(scores, resultLabels) {
    for (const label of resultLabels) {
        if (matchesConditions(scores, label.conditions)) {
            return label;
        }
    }
    return defaultLabel;
}
```

---

## 3. App.js 리팩토링

### 3.1 변수명 변경

| 현재 | 새로운 이름 | 설명 |
|------|-------------|------|
| `MBTI_DATA` | `CHEMI_DATA` | 전역 데이터 객체 |
| `finalType` | `resultLabel` | 결과 라벨 객체 |
| `calculateResult()` | `calculateChemi()` | 점수 계산 함수 |
| `scores: { E, I, S, N, T, F, J, P }` | `scores: { inssa, adventure, ... }` | 차원별 점수 |

### 3.2 UI 텍스트 변경

```javascript
// ❌ 현재
<p className="text-gray-500 mb-8">나의 성격을 MBTI로 알아보세요!</p>

// ✅ 변경
<p className="text-gray-500 mb-8">재미로 보는 성격 테스트 🔮</p>
```

### 3.3 결과 화면 변경

```javascript
// ❌ 현재: 4글자 유형 코드 표시
<span className="text-2xl font-bold">{finalType}</span> // "ENFP"

// ✅ 변경: 라벨 표시
<span className="text-2xl font-bold">{resultLabel.name}</span> // "열정 만수르"
```

---

## 4. TraitBar.js 리팩토링

### 4.1 현재 구조

```javascript
// E/I, S/N, T/F, J/P 비율 표시
<TraitBar label="E/I" leftLabel="E" rightLabel="I" leftScore={scores.E} rightScore={scores.I} />
```

### 4.2 새로운 구조

```javascript
// 차원별 점수 표시 (0-100)
<DimensionBar
    name="인싸력"
    emoji="🎉"
    score={75}
    maxScore={100}
/>

// 시각적 표현
// 인싸력 🎉 ████████░░ 80
```

---

## 5. index.html 변경

### 5.1 메타 태그

```html
<!-- ❌ 현재 -->
<title>MBTI 성격 테스트: 사람/고양이/개</title>

<!-- ✅ 변경 -->
<title>케미 테스트 - 재미로 보는 성격 테스트 🔮</title>
<meta name="description" content="나와 우리 펫의 성격을 알아보고 케미를 확인해보세요!" />
```

### 5.2 스크립트 참조

```html
<!-- data.js는 파일명 유지 (내용만 변경) -->
<script src="data.js"></script>
```

---

## 6. 마이그레이션 단계

### Phase 1: 데이터 구조 변환 (핵심)
1. [ ] data.js에 새로운 CHEMI_DATA 구조 작성
2. [ ] 기존 질문들을 새 차원에 맵핑
3. [ ] 결과 라벨 정의 (16가지 → 조건 기반)

### Phase 2: 점수 계산 로직 변경
4. [ ] App.js의 scores 상태 구조 변경
5. [ ] calculateChemi() 함수 작성
6. [ ] 결과 라벨 매칭 로직 구현

### Phase 3: UI 업데이트
7. [ ] TraitBar → DimensionBar 컴포넌트 수정
8. [ ] 결과 화면 UI 업데이트
9. [ ] 텍스트 전체 검토 및 변경

### Phase 4: 테스트 및 마무리
10. [ ] 전체 플로우 테스트
11. [ ] bundle.js 재생성
12. [ ] dist/ 업데이트

---

## 7. 기존 질문 차원 맵핑

### 7.1 사람 모드

| 기존 type | 새 dimension | 설명 |
|-----------|--------------|------|
| EI | inssa | 인싸력 (외향성) |
| SN | adventure | 모험력 (개방성) |
| TF | empathy | 공감력 (우호성) |
| JP | plan | 계획력 (성실성) |

### 7.2 고양이 모드

| 기존 type | 새 dimension | 설명 |
|-----------|--------------|------|
| EI | curious / cute | 호기심 + 애교력 |
| SN | random | 변덕력 |
| TF | cute / boss | 애교력 + 보스력 |
| JP | random | 변덕력 |

### 7.3 강아지 모드

| 기존 type | 새 dimension | 설명 |
|-----------|--------------|------|
| EI | dogFriend / humanLove | 댕친력 + 집사 사랑 |
| SN | focus | 집중력 |
| TF | humanLove | 집사 사랑 |
| JP | focus / persist | 집중력 + 끈기력 |

---

## 8. 결과 라벨 설계

### 8.1 라벨 결정 로직

```javascript
// 조건 기반 라벨 매칭
// high = 60점 이상, low = 40점 이하, medium = 그 사이

const resultLabels = [
    {
        id: "passion_mansoor",
        name: "열정 만수르",
        conditions: { inssa: "high", adventure: "high" },
        priority: 1  // 우선순위 (여러 조건 충족 시)
    },
    {
        id: "iron_planner",
        name: "철벽 플래너",
        conditions: { plan: "high", mental: "high" },
        priority: 2
    },
    // ...
];
```

### 8.2 결과 라벨 목록

**사람 (TERMINOLOGY.md 기준):**
- 열정 만수르 (인싸력↑ 모험력↑)
- 철벽 플래너 (계획력↑ 멘탈력↑)
- 분위기 메이커 (공감력↑ 인싸력↑)
- 안전 제일주의 (모험력↓ 계획력↑)
- 조용한 힐러 (공감력↑ 인싸력↓)

**고양이:**
- 탐험가 애교냥 (호기심↑ 애교력↑)
- 츤데레 보스냥 (보스력↑ 경계심↑)
- 자유로운 영혼냥 (변덕력↑ 호기심↑)
- 소파 위 귀족냥 (애교력↑ 호기심↓)
- 신비로운 닌자냥 (경계심↑ 애교력↓)

**강아지:**
- 해피 바이러스댕 (에너지↑ 집사사랑↑)
- 천재 경호댕 (집중력↑ 용감력↑)
- 파티 피플댕 (댕친력↑ 에너지↑)
- 노력파 우등댕 (끈기력↑ 집중력↑)
- 집순이 애착댕 (집사사랑↑ 댕친력↓)

---

## 9. 호환성 고려사항

### 9.1 기존 사용자 데이터
- LocalStorage에 저장된 기존 결과 처리 방안 필요
- 버전 플래그로 구분하거나 마이그레이션 유틸리티 제공

### 9.2 URL 구조
- 결과 공유 URL에 유형 코드 포함된 경우 처리
- 새로운 URL 스키마: `/result/{labelId}` 또는 쿼리 파라미터

---

## 10. 리스크 및 주의사항

| 리스크 | 대응 방안 |
|--------|-----------|
| 기존 16가지 결과 → 적은 수 라벨 | 조건 조합으로 다양한 라벨 생성 |
| 점수 계산 방식 변경 | 기존 질문 점수 재조정 필요 |
| UI 깨짐 가능성 | 컴포넌트별 테스트 필수 |

---

## 업데이트 이력

| 날짜 | 변경 내용 |
|------|-----------|
| 2025-01-XX | 초기 리팩토링 계획 작성 |
