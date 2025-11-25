# 문제은행 시스템 설계

> 매번 다른 문제를 제시하여 재참여 유도 및 테스트 신뢰도를 높이는 시스템

---

## 1. 개요

### 1.1 문제 정의

현재 시스템의 한계:
- **고정된 질문**: 매번 동일한 질문이 동일한 순서로 제시됨
- **재참여 감소**: "이미 했던 테스트"라는 인식으로 재방문 저조
- **암기 가능**: 질문과 답변을 기억하여 원하는 결과 유도 가능

### 1.2 목표

| 목표 | 설명 |
|------|------|
| **다양성** | 매번 다른 질문 조합으로 신선함 유지 |
| **공정성** | 모든 차원이 균등하게 측정되도록 보장 |
| **확장성** | 새 질문 추가가 쉬운 구조 |
| **품질 보장** | 오류 없는 질문 생성 프로세스 |

---

## 2. 시스템 구조

### 2.1 문제은행 구조

```
questionBank: {
  human: {
    inssa: [
      { id: "h_inssa_01", q: "...", a: [...], tags: ["social", "party"] },
      { id: "h_inssa_02", q: "...", a: [...], tags: ["chat", "group"] },
      // ... 차원당 12~20개 질문
    ],
    adventure: [...],
    empathy: [...],
    plan: [...],
    mental: [...]
  },
  cat: { ... },
  dog: { ... }
}
```

### 2.2 질문 객체 스키마

```javascript
{
  id: string,           // 필수: 고유 ID (예: "h_inssa_01")
  q: string,            // 필수: 질문 텍스트
  dimension: string,    // 필수: 측정 차원
  a: [                  // 필수: 답변 배열 (정확히 2개)
    { text: string, score: 5 },  // 높은 점수
    { text: string, score: 1 }   // 낮은 점수
  ],
  tags: string[],       // 선택: 상황 태그 (중복 방지용)
  difficulty: 1|2|3,    // 선택: 난이도 (1=쉬움, 3=깊이있음)
  version: string       // 선택: 추가된 버전
}
```

### 2.3 목표 문제 수량

| 모드 | 차원 수 | 차원당 목표 | 총 문제 수 | 실제 출제 |
|------|---------|-------------|-----------|----------|
| Human | 5 | 15개 | 75개 | 차원당 3개 = 15문항 |
| Cat | 5 | 12개 | 60개 | 차원당 2-3개 = 12문항 |
| Dog | 6 | 10개 | 60개 | 차원당 2개 = 12문항 |
| **총합** | - | - | **195개** | - |

---

## 3. 랜덤 선택 알고리즘

### 3.1 기본 알고리즘

```javascript
function selectQuestions(mode, questionsPerDim = 3) {
  const bank = questionBank[mode];
  const selected = [];

  // 각 차원에서 균등하게 선택
  Object.keys(bank).forEach(dimension => {
    const pool = bank[dimension];
    const shuffled = shuffleArray([...pool]);
    const picked = shuffled.slice(0, questionsPerDim);
    selected.push(...picked);
  });

  // 전체 질문 순서 섞기
  return shuffleArray(selected);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
```

### 3.2 심화 모드 알고리즘

```javascript
function selectDeepQuestions(mode, alreadyUsedIds, questionsPerDim = 2) {
  const bank = questionBank[mode];
  const selected = [];

  Object.keys(bank).forEach(dimension => {
    // 이미 사용된 질문 제외
    const available = bank[dimension].filter(q => !alreadyUsedIds.includes(q.id));
    const shuffled = shuffleArray([...available]);
    const picked = shuffled.slice(0, questionsPerDim);
    selected.push(...picked);
  });

  return shuffleArray(selected);
}
```

### 3.3 태그 기반 다양성 보장

```javascript
function selectWithDiversity(pool, count, usedTags = new Set()) {
  const result = [];
  const available = [...pool];

  while (result.length < count && available.length > 0) {
    // 사용되지 않은 태그를 가진 질문 우선 선택
    const preferred = available.filter(q =>
      !q.tags?.some(tag => usedTags.has(tag))
    );

    const source = preferred.length > 0 ? preferred : available;
    const idx = Math.floor(Math.random() * source.length);
    const selected = source[idx];

    result.push(selected);
    selected.tags?.forEach(tag => usedTags.add(tag));
    available.splice(available.indexOf(selected), 1);
  }

  return result;
}
```

---

## 4. 질문 생성 프로세스

### 4.1 단계별 프로세스

```
1. 기획 단계
   └── 차원별 목표 질문 수 설정
   └── 상황 카테고리 정의

2. 초안 작성
   └── AI 또는 수동으로 질문 초안 생성
   └── JSON 스키마 준수 확인

3. 검증 단계
   └── 자동 검증 스크립트 실행
   └── 수동 품질 검토

4. 테스트 단계
   └── 실제 앱에서 테스트
   └── 피드백 수집

5. 등록
   └── 문제은행에 추가
   └── 버전 태깅
```

### 4.2 자동 검증 스크립트

```javascript
// scripts/validate-questions.mjs

function validateQuestion(q, index) {
  const errors = [];

  // 필수 필드 검증
  if (!q.id) errors.push(`[${index}] id 누락`);
  if (!q.q) errors.push(`[${index}] 질문 텍스트 누락`);
  if (!q.dimension) errors.push(`[${index}] dimension 누락`);

  // 답변 검증
  if (!q.a || q.a.length !== 2) {
    errors.push(`[${index}] 답변은 정확히 2개여야 함`);
  } else {
    if (!q.a[0].text || !q.a[1].text) {
      errors.push(`[${index}] 답변 텍스트 누락`);
    }
    const scores = q.a.map(a => a.score).sort();
    if (scores[0] !== 1 || scores[1] !== 5) {
      errors.push(`[${index}] 점수는 1과 5여야 함 (현재: ${scores})`);
    }
  }

  // 텍스트 품질 검증
  if (q.q && !q.q.endsWith('?')) {
    errors.push(`[${index}] 질문은 ?로 끝나야 함`);
  }
  if (q.q && q.q.length < 10) {
    errors.push(`[${index}] 질문이 너무 짧음`);
  }
  if (q.q && q.q.length > 100) {
    errors.push(`[${index}] 질문이 너무 긺 (100자 초과)`);
  }

  // 답변 길이 검증
  q.a?.forEach((ans, i) => {
    if (ans.text && ans.text.length > 50) {
      errors.push(`[${index}] 답변 ${i+1}이 너무 긺`);
    }
  });

  return errors;
}

function validateBank(bank) {
  const allErrors = [];
  const usedIds = new Set();

  Object.entries(bank).forEach(([mode, dimensions]) => {
    Object.entries(dimensions).forEach(([dim, questions]) => {
      questions.forEach((q, idx) => {
        // ID 중복 검사
        if (usedIds.has(q.id)) {
          allErrors.push(`[${mode}/${dim}] ID 중복: ${q.id}`);
        }
        usedIds.add(q.id);

        // 개별 질문 검증
        const errors = validateQuestion(q, `${mode}/${dim}/${idx}`);
        allErrors.push(...errors);
      });

      // 차원별 최소 질문 수 검사
      if (questions.length < 4) {
        allErrors.push(`[${mode}/${dim}] 질문 부족 (${questions.length}개, 최소 4개 필요)`);
      }
    });
  });

  return allErrors;
}
```

### 4.3 질문 생성 템플릿

새 질문 작성 시 아래 템플릿 사용:

```javascript
// 복사해서 사용하세요
{
  id: "{mode}_{dimension}_{번호}",  // 예: "h_inssa_15"
  q: "상황 설명 + 질문?",
  dimension: "{dimension}",
  a: [
    { text: "높은 점수 답변 (해당 차원이 강함)", score: 5 },
    { text: "낮은 점수 답변 (해당 차원이 약함)", score: 1 }
  ],
  tags: ["상황태그1", "상황태그2"]
}
```

---

## 5. 오류 방지 체크리스트

### 5.1 질문 작성 시

| # | 항목 | 확인 |
|---|------|------|
| 1 | ID가 고유한가? (중복 없음) | [ ] |
| 2 | dimension이 해당 모드에 존재하는 차원인가? | [ ] |
| 3 | 답변이 정확히 2개인가? | [ ] |
| 4 | 점수가 5와 1인가? (다른 점수 사용 안 함) | [ ] |
| 5 | 질문이 ?로 끝나는가? | [ ] |
| 6 | 양쪽 답변이 균형 잡혀 있는가? | [ ] |
| 7 | 한글 인코딩이 UTF-8인가? | [ ] |
| 8 | 기존 질문과 유사하지 않은가? | [ ] |

### 5.2 대량 생성 시

```bash
# 1. 검증 스크립트 실행
node scripts/validate-questions.mjs

# 2. 테스트 앱에서 확인
npm run dev

# 3. 모든 차원에서 질문이 출제되는지 확인
# 4. 점수 계산이 정상인지 확인
```

### 5.3 흔한 실수와 해결책

| 실수 | 증상 | 해결 |
|------|------|------|
| score 오타 | 결과가 한쪽으로 치우침 | 점수는 반드시 5 또는 1만 사용 |
| dimension 오타 | 해당 질문 점수가 집계 안 됨 | dimensions 객체의 키와 정확히 일치하는지 확인 |
| 답변 순서 혼동 | 높은 차원 선택 시 낮은 점수 | score: 5인 답변이 해당 차원 "높음"인지 확인 |
| 인코딩 깨짐 | 한글이 깨져서 표시됨 | Node.js 스크립트로 UTF-8 저장 |

---

## 6. 데이터 구조 마이그레이션

### 6.1 현재 구조 → 문제은행 구조

```javascript
// 현재: data.js
const CHEMI_DATA = {
  human: {
    questions: [...],      // 기본 질문
    questions_deep: [...], // 심화 질문
    ...
  }
}

// 목표: questionBank.js
const QUESTION_BANK = {
  human: {
    inssa: [
      // 기본 + 심화 + 신규 질문 모두 통합
    ],
    adventure: [...],
    ...
  }
}
```

### 6.2 마이그레이션 스크립트

```javascript
// scripts/migrate-to-bank.mjs
import fs from 'fs';

function migrateToBank(chemiData) {
  const bank = {};

  Object.entries(chemiData).forEach(([mode, modeData]) => {
    bank[mode] = {};
    const dims = Object.keys(modeData.dimensions);
    dims.forEach(dim => bank[mode][dim] = []);

    // 기본 질문 마이그레이션
    modeData.questions?.forEach((q, i) => {
      const id = `${mode[0]}_${q.dimension}_b${String(i+1).padStart(2,'0')}`;
      bank[mode][q.dimension].push({
        ...q,
        id,
        tags: ['basic']
      });
    });

    // 심화 질문 마이그레이션
    modeData.questions_deep?.forEach((q, i) => {
      const id = `${mode[0]}_${q.dimension}_d${String(i+1).padStart(2,'0')}`;
      bank[mode][q.dimension].push({
        ...q,
        id,
        tags: ['deep']
      });
    });
  });

  return bank;
}
```

---

## 7. 앱 통합

### 7.1 App.js 수정 사항

```javascript
// 기존
const questions = isDeepMode
  ? [...basicQuestions, ...deepQuestions]
  : basicQuestions;

// 변경
const [selectedQuestions, setSelectedQuestions] = useState([]);

const startTest = () => {
  const selected = selectQuestions(mode, 3); // 차원당 3문항
  setSelectedQuestions(selected);
  setStep("question");
};

const startDeepTest = () => {
  const usedIds = selectedQuestions.map(q => q.id);
  const deepSelected = selectDeepQuestions(mode, usedIds, 2);
  setSelectedQuestions([...selectedQuestions, ...deepSelected]);
  setQIdx(selectedQuestions.length);
  setIsDeepMode(true);
  setStep("question");
};
```

### 7.2 결과 화면 표시

```javascript
// 이번에 출제된 질문 ID 저장 (localStorage)
const saveQuestionHistory = (questionIds) => {
  const history = JSON.parse(localStorage.getItem('questionHistory') || '[]');
  history.push({
    date: new Date().toISOString(),
    ids: questionIds
  });
  // 최근 10회만 보관
  if (history.length > 10) history.shift();
  localStorage.setItem('questionHistory', JSON.stringify(history));
};
```

---

## 8. 품질 관리

### 8.1 질문 품질 등급

| 등급 | 기준 | 관리 |
|------|------|------|
| A | 검증 완료, 다수 테스트 통과 | 일반 출제 |
| B | 검증 완료, 테스트 필요 | 제한적 출제 (50% 확률) |
| C | 초안, 검토 필요 | 미출제 (개발용) |

### 8.2 주기적 검토

```
월간:
- 차원별 질문 수 확인
- 낮은 응답률 질문 검토
- 사용자 피드백 반영

분기별:
- 전체 질문 균형 점검
- 신규 질문 추가 계획
- 폐기 질문 정리
```

---

## 9. 구현 로드맵

### Phase 1: 기반 구축 (1주)
- [ ] 검증 스크립트 작성 (`validate-questions.mjs`)
- [ ] 마이그레이션 스크립트 작성 (`migrate-to-bank.mjs`)
- [ ] 기존 질문을 문제은행 구조로 변환

### Phase 2: 핵심 기능 (1주)
- [ ] 랜덤 선택 함수 구현
- [ ] App.js 통합
- [ ] 기본 테스트

### Phase 3: 질문 확장 (2주)
- [ ] Human: 차원당 15개 (총 75개)
- [ ] Cat: 차원당 12개 (총 60개)
- [ ] Dog: 차원당 10개 (총 60개)

### Phase 4: 고급 기능 (선택)
- [ ] 태그 기반 다양성 보장
- [ ] 질문 히스토리 추적
- [ ] A/B 테스트 지원

---

## 10. 임베딩 유사도 검사 시스템

### 10.1 도입 이유

**왜 자동화된 유사도 검사가 필요한가?**

| 방법 | 100개 | 300개 | 1000개 | 일관성 | 자동화 |
|------|-------|-------|--------|--------|--------|
| 사람이 직접 비교 | ✅ 가능 | ⚠️ 오래 걸림 | ❌ 불가 | ⚠️ 피로도에 따라 다름 | ❌ |
| AI (Claude) 판단 | ✅ 가능 | ⚠️ 컨텍스트 한계 | ❌ 불가 | ⚠️ 매번 다를 수 있음 | ❌ |
| Jaccard (키워드) | ✅ | ✅ | ✅ | ✅ | ✅ |
| **임베딩 (벡터)** | ✅ | ✅ | ✅ | ✅ | ✅ |

**핵심 문제:**
- **300개 이상 확장 예정**: 모드당 100개씩 = 총 300개
- **다른 앱에도 적용 계획**: 재사용 가능한 시스템 필요
- **지속적 추가**: 새 질문 추가 시마다 중복 검사 필요
- **CI/CD 통합**: `npm run check-similarity`로 자동 검증

**Jaccard vs 임베딩 차이:**

```
예시 1: 키워드가 다르지만 의미는 같은 경우
- "모임에서 새로운 사람을 만나면?"
- "파티에서 처음 보는 사람이 있으면?"
→ Jaccard: 0.15 (낮음, 키워드가 다름)
→ 임베딩: 0.85 (높음, 의미적으로 유사)

예시 2: 키워드는 같지만 의미가 다른 경우
- "새로운 음식을 먹으면?"
- "새로운 사람을 만나면?"
→ Jaccard: 0.40 (중간, '새로운' 공유)
→ 임베딩: 0.35 (낮음, 의미적으로 다름)
```

### 10.2 선택한 모델: Qwen3-Embedding-8B

| 항목 | Qwen3-Embedding-8B | OpenAI text-embedding-3-small |
|------|-------------------|-------------------------------|
| **MTEB 점수** | 70.58 (1위, 2025.06) | ~64.6% |
| **컨텍스트** | 32,000 토큰 | 8,192 토큰 |
| **다국어** | 100+ 언어 (한국어 ✅) | 영어 중심 |
| **비용** | **무료 (로컬)** | 유료 API |
| **설치** | Ollama로 간편 설치 | 클라우드 의존 |

**설치 방법:**
```bash
# Ollama 설치 후
ollama pull qwen3-embedding
```

### 10.3 사용 시점

```
┌─────────────────────────────────────────────────────────┐
│               질문 생성 워크플로우                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. 새 질문 작성                                         │
│         ↓                                               │
│  2. 기본 검증 (validate-questions.mjs)                  │
│     • 필수 필드, 점수 범위, 형식 검사                     │
│     • Jaccard 유사도 (키워드 기반)                       │
│         ↓                                               │
│  3. 임베딩 유사도 검사 (check-similarity.mjs)            │
│     • 벡터화 후 cosine similarity 계산                  │
│     • 임계값: 0.80 이상 → ⚠️ 경고                        │
│         ↓                                               │
│  4. 통과 시 data.js에 추가                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**검사하지 않는 경우:**
- 테스트 실행 시 (런타임)
- 결과 계산 시

### 10.4 임계값 설정

| 유사도 | 판정 | 조치 |
|--------|------|------|
| ≥ 0.90 | ❌ 오류 | 추가 불가, 중복으로 간주 |
| 0.80 ~ 0.89 | ⚠️ 경고 | 검토 필요, 다른 표현으로 수정 권장 |
| 0.70 ~ 0.79 | ℹ️ 정보 | 참고용, 의도적 유사 질문일 수 있음 |
| < 0.70 | ✅ 통과 | 충분히 다른 질문 |

### 10.5 스크립트 구조

```
scripts/
├── validate-questions.mjs    # 기본 검증 + Jaccard
├── check-similarity.mjs      # 임베딩 유사도 검사 (신규)
├── embed-questions.mjs       # 전체 질문 임베딩 생성 (신규)
└── embeddings/               # 캐시된 임베딩 벡터
    └── questions.json        # { "질문텍스트": [벡터] }
```

### 10.6 3단계 하이브리드 검사 전략

**왜 3단계 하이브리드인가?**

| 검사 방식 | 강점 | 약점 | 용도 |
|-----------|------|------|------|
| Jaccard | 빠름, 의존성 없음 | 의미적 유사성 못 잡음 | 1차 필터 |
| 임베딩 | 의미적 유사성 포착 | 문맥/의도/품질 이해 부족 | 2차 정밀 검사 |
| **AI (Claude)** | 문맥, 품질, 개선안 제시 | 대량 처리 비효율 | 3차 심층 리뷰 |

**AI가 잡을 수 있는 것 (임베딩이 못 잡는 것):**

| 문제 유형 | Jaccard | 임베딩 | AI |
|-----------|---------|--------|-----|
| 키워드는 다르지만 같은 의미 | ❌ | ✅ | ✅ |
| 질문이 너무 추상적/모호함 | ❌ | ❌ | ✅ |
| 두 답변이 구분하기 어려움 | ❌ | ❌ | ✅ |
| 문화적 맥락에 안 맞음 | ❌ | ❌ | ✅ |
| 차원(dimension)에 안 맞는 질문 | ❌ | ❌ | ✅ |
| 더 좋은 표현 제안 | ❌ | ❌ | ✅ |

**예시 - 임베딩은 통과하지만 AI가 잡는 경우:**

```
질문: "새로운 것을 시도할 때?"
답변1: "신나서 바로 해본다" (score: 5)
답변2: "조금 망설인다" (score: 1)

임베딩: ✅ 통과 (다른 질문과 유사도 낮음)
AI: ⚠️ "답변2가 너무 약함. '절대 안 해본다'로 대비를 키우면 좋겠음"
     ⚠️ "'새로운 것'이 모호함. '새로운 음식/장소/사람' 중 구체화 권장"
```

**3단계 검사 흐름:**

```
┌─────────────────────────────────────────────────────────┐
│                  3단계 하이브리드 검사                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1단계: Jaccard (빠른 필터) - 자동                       │
│  ────────────────────────                               │
│  • 모든 질문 쌍에 대해 Jaccard 계산                      │
│  • 임계값 0.45 이상 → 후보로 선정                        │
│  • 소요시간: ~10ms                                       │
│                                                         │
│  2단계: 임베딩 (정밀 검사) - 자동                        │
│  ────────────────────────                               │
│  • 차원이 같은 모든 쌍에 대해 임베딩 검사                │
│  • cosine similarity 0.80 이상 → 경고                   │
│  • 소요시간: ~2초 (캐시 있으면 더 빠름)                  │
│                                                         │
│  3단계: AI 리뷰 (심층 분석) - 요청 시                    │
│  ────────────────────────                               │
│  • 경고/오류 질문에 대해 AI에게 리뷰 요청                │
│  • 질문 품질, 답변 균형, 개선안 제시                     │
│  • 새 질문 추가 전 전체 리뷰 (선택적)                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**사용 시나리오:**

```bash
# 일상적 검증 (1+2단계)
$ node scripts/check-similarity.mjs

# 새 질문 대량 추가 전 (3단계 포함)
$ node scripts/check-similarity.mjs --output-for-review > review.txt
# → review.txt를 Claude에게 전달하여 품질 리뷰 요청
```

**검사 조합 결과:**

| Jaccard | 임베딩 | 판정 | 예시 |
|---------|--------|------|------|
| 높음 (≥0.6) | 높음 (≥0.8) | ❌ 확실한 중복 | "모임에서 나는?" vs "모임에서 나는?" |
| 높음 (≥0.6) | 낮음 (<0.8) | ⚠️ 표현만 유사 | "새로운 음식" vs "새로운 사람" |
| 낮음 (<0.6) | 높음 (≥0.8) | ⚠️ 의미적 중복 | "파티에서" vs "모임에서" (다른 단어, 같은 의미) |
| 낮음 (<0.6) | 낮음 (<0.8) | ✅ 통과 | 완전히 다른 질문 |

**Ollama 없이도 동작:**

```bash
# Ollama 있을 때: 하이브리드 검사
$ node scripts/check-similarity.mjs
🔍 Ollama 감지됨 → 하이브리드 모드

# Ollama 없을 때: Jaccard만 사용
$ node scripts/check-similarity.mjs
⚠️ Ollama 미감지 → Jaccard 전용 모드
   (임베딩 검사 건너뜀)
```

### 10.7 예상 결과 출력

```bash
$ node scripts/check-similarity.mjs

🔍 임베딩 유사도 검사 시작...
📊 총 122개 질문 분석 중...

⚠️ 유사한 질문 쌍 발견 (3개):

1. similarity: 0.87
   - human/questions[5]: "모임에서 새로운 사람을 만나면?"
   - human/questions_deep[12]: "파티에서 처음 보는 사람이 있으면?"
   → 권장: 상황을 더 차별화하세요

2. similarity: 0.83
   - cat/questions[3]: "새로운 간식이 나왔을 때?"
   - cat/questions_deep[8]: "처음 보는 음식이 앞에 있으면?"
   → 권장: 질문 의도나 상황을 변경하세요

✅ 검사 완료: 119개 통과, 3개 검토 필요
```

---

## 11. 참고: 상황 태그 목록

### Human 모드

| 카테고리 | 태그 예시 |
|----------|-----------|
| 사회 상황 | `party`, `meeting`, `chat`, `group`, `stranger` |
| 일상 | `weekend`, `morning`, `meal`, `travel` |
| 업무/학업 | `work`, `study`, `deadline`, `project` |
| 감정 | `stress`, `conflict`, `support`, `celebrate` |

### Cat 모드

| 카테고리 | 태그 예시 |
|----------|-----------|
| 환경 | `home`, `vet`, `outdoor`, `new_place` |
| 상호작용 | `owner`, `guest`, `other_cat`, `toy` |
| 일상 | `meal`, `sleep`, `play`, `groom` |

### Dog 모드

| 카테고리 | 태그 예시 |
|----------|-----------|
| 환경 | `home`, `park`, `cafe`, `vet` |
| 상호작용 | `owner`, `stranger`, `other_dog`, `child` |
| 활동 | `walk`, `training`, `play`, `rest` |

---

## 업데이트 이력

| 날짜 | 변경 내용 |
|------|-----------|
| 2025-01-25 | 문제은행 시스템 설계 문서 초안 작성 |
| 2025-01-26 | 10장 임베딩 유사도 검사 시스템 추가 (하이브리드 전략) |
