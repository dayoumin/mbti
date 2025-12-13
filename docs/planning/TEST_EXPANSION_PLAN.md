# 테스트 확장 계획

> 테스트 종류가 많아질 때를 대비한 아키텍처 및 UI/UX 설계

---

## 1. 테스트 타입 분류 체계

### 1.1 현재 구조

```
TEST_TYPES = {
    personality: "성격 테스트",   // 나/동물의 성격 분석
    matching: "매칭 테스트"       // 나에게 맞는 것 추천
}
```

### 1.2 확장 예정 타입

| 타입 | 설명 | 예시 | 결과 형태 |
|------|------|------|----------|
| `personality` | 성격/특성 분석 | 사람, 고양이, 강아지 | 라벨 + 점수 그래프 |
| `matching` | 추천/매칭 | 이상형, 식물, 반려동물 | 라벨 + 매칭 포인트 |
| `fortune` | 운세/점술 | 별자리, 타로 | 오늘의 운세 + 조언 |
| `compatibility` | 궁합/상성 | 혈액형 궁합, 별자리 궁합 | 두 요소 비교 |
| `quiz` | 퀴즈/점수형 | 상식 퀴즈 | 점수 + 등급 |

### 1.3 타입별 데이터 구조 차이

```javascript
// personality / matching - 현재 구조
{
    dimensions: { ... },
    questions: [ ... ],
    resultLabels: [ ... ]
}

// fortune - 날짜 기반
{
    signs: { aries: {...}, taurus: {...} },  // 12궁
    dailyFortune: function(sign, date) { ... },
    compatibility: { ... }
}

// compatibility - 조합 기반
{
    types: ['A', 'B', 'O', 'AB'],
    matrix: {
        'A-A': { score: 80, desc: '...' },
        'A-B': { score: 60, desc: '...' }
    }
}

// quiz - 정답 기반
{
    questions: [
        { q: '...', options: [...], correct: 2, points: 10 }
    ],
    grades: [
        { min: 90, label: '천재', desc: '...' }
    ]
}
```

---

## 2. UI/UX 스케일링 전략

### 2.1 탭 개수 임계점

| 그룹 내 개수 | 현재 UI | 개선 방안 |
|-------------|---------|----------|
| 1-4개 | 가로 버튼 | 유지 |
| 5-7개 | 가로 스크롤 | 2줄 그리드 고려 |
| 8개 이상 | 복잡함 | 서브 카테고리 or 별도 페이지 |

### 2.2 그룹(타입) 수 증가 시

| 그룹 수 | 현재 UI | 개선 방안 |
|--------|---------|----------|
| 2-3개 | 세로 나열 | 유지 |
| 4-5개 | 스크롤 필요 | 탭/아코디언 전환 |
| 6개 이상 | 복잡함 | 홈 페이지 분리 |

### 2.3 단계별 UI 전환 계획

**Phase A (현재)**: 단일 페이지 + 그룹핑 탭
```
┌────────────────────────────────────┐
│ 🧠 성격 테스트                      │
│ [사람][고양이][강아지][토끼][햄스터]  │
│                                    │
│ 💫 매칭 테스트                      │
│ [이상형][식물]                      │
└────────────────────────────────────┘
```

**Phase B (타입 4개 이상)**: 탭 전환 방식
```
┌────────────────────────────────────┐
│ [성격] [매칭] [운세] [궁합]          │ ← 상단 탭
├────────────────────────────────────┤
│ 선택된 탭의 테스트 목록              │
└────────────────────────────────────┘
```

**Phase C (테스트 20개 이상)**: 홈 페이지 분리
```
홈 → 카테고리 선택 → 테스트 선택 → 테스트 진행
```

---

## 3. 추가 예정 테스트 목록

### 3.1 매칭 테스트 (matching)

| 테스트 | 설명 | 차원 | 우선순위 |
|--------|------|------|----------|
| 반려동물 매칭 | 나에게 맞는 반려동물 | lifestyle, space, activity, time, allergy | P1 |
| 커피 매칭 | 나에게 맞는 커피 | bitter, sweet, caffeine, temperature, mood | P1 |
| 여행지 매칭 | 나에게 맞는 여행 스타일 | activity, budget, social, climate, culture | P2 |
| 취미 매칭 | 나에게 맞는 취미 | indoor, creative, social, physical, cost | P2 |
| 직업 매칭 | 나에게 맞는 직업 유형 | social, creative, analytical, physical, leadership | P3 |

### 3.2 운세 테스트 (fortune)

| 테스트 | 설명 | 입력 | 우선순위 |
|--------|------|------|----------|
| 별자리 운세 | 오늘의 별자리 운세 | 생년월일 | P2 |
| 타로 | 랜덤 카드 뽑기 | 질문 선택 | P3 |
| 사주/띠 | 띠별 운세 | 생년 | P3 |

### 3.3 궁합 테스트 (compatibility)

| 테스트 | 설명 | 입력 | 우선순위 |
|--------|------|------|----------|
| 혈액형 궁합 | 두 사람의 혈액형 궁합 | A/B/O/AB × 2 | P2 |
| 별자리 궁합 | 두 사람의 별자리 궁합 | 별자리 × 2 | P2 |
| MBTI 궁합 | 두 사람의 MBTI 궁합 | 16유형 × 2 | P3 (상표 주의) |

### 3.4 성격 테스트 (personality)

| 테스트 | 설명 | 차원 | 우선순위 |
|--------|------|------|----------|
| 새 | 반려조류 성격 | social, vocal, active, smart, cuddly | P3 |
| 물고기 | 관상어 성격 | active, social, hardy, colorful | P3 |

---

## 4. 데이터 구조 표준화

### 4.1 공통 필드 (모든 테스트)

```javascript
{
    // 필수
    title: "테스트 제목",
    subtitle: "부제목",
    themeColor: "bg-xxx-xxx",

    // 선택
    icon: "IconName",           // SUBJECT_CONFIG에서 관리
    references: { ... }         // 학술 근거
}
```

### 4.2 타입별 필수 필드

```javascript
// personality, matching
{
    dimensions: { ... },
    questions: [ ... ],
    questions_deep: [ ... ],    // 선택
    resultLabels: [ ... ]
}

// fortune
{
    signs: { ... },             // 또는 cards, animals 등
    getResult: function(input, date) { ... }
}

// compatibility
{
    types: [ ... ],
    matrix: { ... },
    getCompatibility: function(type1, type2) { ... }
}

// quiz
{
    questions: [ ... ],         // correct 필드 포함
    grades: [ ... ]
}
```

### 4.3 SUBJECT_CONFIG 확장

```javascript
const SUBJECT_CONFIG = {
    // 기존
    human: { testType: "personality", ... },

    // 추가 예정
    petMatch: {
        testType: "matching",
        inputType: "questions",     // questions | select | date
        ...
    },
    zodiac: {
        testType: "fortune",
        inputType: "date",          // 생년월일 입력
        ...
    },
    bloodType: {
        testType: "compatibility",
        inputType: "select",        // 두 개 선택
        ...
    }
}
```

---

## 5. 결과 포맷 확장

### 5.1 현재 resultFormat

| 값 | 용도 | UI |
|----|------|-----|
| `simple` | 사람 성격 | 해석 + 조언 |
| `tabs` | 동물 성격 | 탭(해석/육아팁) |
| `matching` | 매칭 | 매칭포인트 + 탭 |

### 5.2 추가 예정 resultFormat

| 값 | 용도 | UI |
|----|------|-----|
| `fortune` | 운세 | 오늘의 운세 + 행운 아이템 + 조언 |
| `compatibility` | 궁합 | 점수 + 강점/약점 + 조언 |
| `quiz` | 퀴즈 | 점수 + 등급 + 오답 해설 |

---

## 6. 구현 우선순위

### Phase 1: 매칭 테스트 확장 (P1)
1. 반려동물 매칭
2. 커피 매칭

### Phase 2: 운세/궁합 추가 (P2)
3. 별자리 운세
4. 혈액형 궁합
5. 별자리 궁합
6. 여행지 매칭

### Phase 3: UI 스케일링 (타입 4개 이상 시)
7. ModeTabs → 탭 전환 방식 리팩토링
8. 홈 페이지 분리 검토

### Phase 4: 추가 테스트 (P3)
9. 취미 매칭
10. 타로
11. 새/물고기 성격

---

## 7. 기술적 고려사항

### 7.1 코드 분리
- 타입별 결과 렌더러 컴포넌트 분리
- `components/results/PersonalityResult.js`
- `components/results/MatchingResult.js`
- `components/results/FortuneResult.js`

### 7.2 데이터 로딩
- 테스트 수 증가 시 lazy loading 고려
- 현재: 모든 데이터 초기 로드
- 개선: 선택한 테스트만 동적 로드

### 7.3 상태 관리
- 현재: React useState로 충분
- 테스트 20개 이상 시: Context 또는 Zustand 고려

---

## 업데이트 이력

| 날짜 | 변경 내용 |
|------|-----------|
| 2025-12-11 | 초기 작성 - 테스트 확장 계획 |
