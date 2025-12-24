# AI 리뷰 요청: 팩트 기반 콘텐츠 생성 시스템

> 작성일: 2024-12-24
> 리뷰 요청 대상: 다른 AI (Claude, ChatGPT, Gemini 등)

---

## 1. 변경 목적

퀴즈/투표 콘텐츠 생성 시 **수의학/식물학 등 정확도가 필요한 정보**를
검증된 팩트 DB에서 참조하도록 워크플로우 개선.

### 해결하려는 문제
- AI가 바로 퀴즈 생성 → 수치/사실 오류 가능성
- 출처 없이 생성 → 검증 불가
- 기존 퀴즈와 정보 불일치 가능

---

## 2. 변경 파일 목록

### 신규 생성 (6개)
| 파일 | 설명 |
|------|------|
| `research/facts/README.md` | 팩트 DB 사용 가이드 |
| `research/facts/cat.md` | 고양이 팩트 6개 |
| `research/facts/dog.md` | 강아지 팩트 5개 |
| `research/facts/plant.md` | 식물 팩트 7개 |
| `.claude/skills/fact-collector/SKILL.md` | 팩트 수집 스킬 |
| `src/app/dashboard/components/FactManager.tsx` | 팩트 관리 UI |

### 수정 (2개)
| 파일 | 변경 내용 |
|------|----------|
| `.claude/agents/content-creator.md` | 팩트 참조 워크플로우 추가 (2단계, 7단계) |
| `src/app/dashboard/page.tsx` | 팩트 DB 탭 추가 |

---

## 3. 핵심 설계

### 3.1 워크플로우

```
콘텐츠 생성 요청
    ↓
1단계: 요청 분석 (카테고리, 타입, 수량)
    ↓
2단계: 팩트 필요 여부 판단
    ├─ 불필요 (연애, 심리) → 4단계로
    └─ 필요 (동물, 식물, 식품)
           ↓
       research/facts/{category}.md 확인
       ├─ 있음 → 참조해서 생성
       └─ 없음 → 웹검색 → 팩트 저장 → 생성
    ↓
3단계: 중복 확인
    ↓
4단계: 콘텐츠 생성 (source 필드에 팩트 ID)
    ↓
5단계: 자체검증
    ↓
6단계: 파일 저장
    ↓
7단계: 팩트 파일 업데이트 (usedIn 추가)
    ↓
8단계: 시스템 검증
    ↓
9단계: 빌드 확인
```

### 3.2 팩트 필요 카테고리

| 카테고리 | 팩트 필수 | 이유 |
|----------|----------|------|
| cat, dog, rabbit, hamster | O | 수의학 정보 |
| plant | O | 식물학 정보 |
| coffee, alcohol | O | 식품/음료 정보 |
| love, relationship, personality | X | 주관적/심리적 |

### 3.3 팩트 파일 포맷

```markdown
## {category}-fact-{번호}: {제목}
- **값**: 구체적 수치/사실
- **출처**: 출처명 (기관/논문)
- **URL**: https://...
- **검증일**: YYYY-MM-DD
- **사용된 콘텐츠**: content-id-1, content-id-2
- **비고**: 추가 설명
```

### 3.4 신뢰도 기준

| 출처 유형 | 신뢰도 | 예시 |
|----------|--------|------|
| 학술 논문/저널 | 최상 | PubMed, 수의학 저널 |
| 공식 기관 | 상 | AAHA, AAFP, AKC, RHS, NASA |
| 전문 병원 | 상 | VCA Hospitals, 대학병원 |
| 전문 매체 | 중 | Scientific American |
| 일반 웹사이트 | 하 | 블로그 (교차검증 필수) |

### 3.5 검증 상태 기준

| 검증일 경과 | 상태 | 대시보드 표시 |
|------------|------|--------------|
| 90일 이내 | fresh | 녹색 "검증됨" |
| 90-180일 | aging | 노란색 "재검증 권장" |
| 180일 초과 | stale | 빨간색 "재검증 필요" |

---

## 4. 리뷰 요청 사항

### 4.1 워크플로우 적절성
- 팩트 확인 → 생성 흐름이 합리적인가?
- 9단계가 너무 많은가? 간소화 가능한가?

### 4.2 팩트 파일 포맷
- 필요한 필드가 빠지지 않았는가?
- 추가로 필요한 메타데이터가 있는가?

### 4.3 신뢰도 기준
- 출처 유형별 신뢰도 분류가 적절한가?
- 교차 검증 기준 (2개 이상 출처)이 충분한가?

### 4.4 검증 주기
- 90일/180일 기준이 적절한가?
- 카테고리별로 다른 주기가 필요한가? (의료 정보는 더 짧게?)

### 4.5 확장성
- 새 카테고리 추가 시 문제 없는가?
- 팩트 수가 많아지면 (100개+) 성능 문제 없는가?

### 4.6 대시보드 기능
- 팩트 관리에 필요한 기능이 충분한가?
- 추가로 필요한 기능이 있는가?

---

## 5. 개선 완료 사항 (v2)

모든 초기 한계점이 해결되었습니다:

### 5.1 팩트 참조 타입 시스템 (완료)

```typescript
// src/data/content/types.ts

// 팩트 필요 카테고리 타입
export type FactRequiredCategory =
  | 'cat' | 'dog' | 'rabbit' | 'hamster'  // 반려동물
  | 'plant'                                // 식물
  | 'coffee' | 'alcohol';                  // 식품/음료

// 팩트 ID 타입 (Template Literal Type)
export type FactId = `${FactRequiredCategory}-fact-${string}`;
// 예: 'cat-fact-001', 'dog-fact-002'

// 팩트 참조 인터페이스
export interface FactReference {
  factId: FactId;           // 팩트 ID
  verifiedDate?: string;    // 검증일 (YYYY-MM-DD)
}

// KnowledgeQuiz에 factRef 필드 추가
export interface KnowledgeQuiz {
  // ...기존 필드
  source?: string;              // 레거시: 일반 출처 문자열
  factRef?: FactReference;      // 신규: 팩트 DB 참조
}
```

### 5.2 팩트 파일 파싱 API (완료)

```typescript
// src/app/api/facts/route.ts
// GET /api/facts
// - research/facts/*.md 파일을 자동 파싱
// - 카테고리별 팩트 목록 반환
// - 통계 정보 포함 (카테고리 수, 전체 팩트 수)
```

### 5.3 팩트 ID 자동 생성 유틸리티 (완료)

```typescript
// src/utils/fact.ts

// 팩트 ID 생성
generateFactId('cat', 7);  // → 'cat-fact-007'

// 팩트 ID 파싱
parseFactId('cat-fact-007');  // → { category: 'cat', number: 7 }

// 다음 ID 번호 계산
getNextFactNumber(['cat-fact-001', 'cat-fact-002'], 'cat');  // → 3

// 검증 상태 확인
getVerificationStatus('2024-10-01');  // → 'fresh' | 'aging' | 'stale'

// 팩트 마크다운 생성
generateFactMarkdown('cat-fact-007', {
  title: '고양이 정상 체온',
  value: '38.0~39.2°C',
  source: 'AAFP',
  verifiedDate: '2024-12-24'
});
```

### 5.4 FactManager 동적 데이터 로딩 (완료)

```typescript
// src/app/dashboard/components/FactManager.tsx
// - API에서 팩트 데이터 동적 로딩
// - 로딩/에러/빈 상태 처리
// - 검색 기능 (ID, 제목, 값, 출처, 사용 콘텐츠)
// - 카테고리별 통계 표시

---

## 6. 테스트 방법

```bash
# 빌드 검증
npm run build

# 대시보드에서 팩트 탭 확인
# 개발 > 팩트 DB
```

---

## 7. 관련 파일 전체 경로

```
d:\Projects\MBTI\
├── research/
│   └── facts/
│       ├── README.md
│       ├── cat.md
│       ├── dog.md
│       └── plant.md
├── .claude/
│   ├── agents/
│   │   └── content-creator.md (수정)
│   └── skills/
│       └── fact-collector/
│           └── SKILL.md (신규)
├── src/
│   ├── data/content/
│   │   └── types.ts (수정 - FactId, FactReference 타입 추가)
│   ├── utils/
│   │   ├── fact.ts (신규 - 팩트 ID 유틸리티)
│   │   └── index.ts (수정 - export 추가)
│   └── app/
│       ├── api/facts/
│       │   └── route.ts (신규 - MD 파싱 API)
│       └── dashboard/
│           ├── page.tsx (수정 - 팩트 탭 추가)
│           └── components/
│               └── FactManager.tsx (신규 - API 연동)
```

---

## 8. 팩트 참조 강제 검증 시스템 (v3 신규!)

### 8.1 문제 인식

> "팩트체크 대상인데 skill을 사용 안 하는 경우를 어떻게 감지하나?"

기존 시스템은 fact-collector 스킬 사용을 **문서화**만 했지, **강제하지 않았습니다**.

### 8.2 해결책: 다중 레이어 검증

| 레이어 | 위치 | 역할 |
|--------|------|------|
| 1. 스킬 문서 | `.claude/skills/content-validator/SKILL.md` | AI에게 규칙 안내 |
| 2. 검증 스크립트 | `scripts/validate-content-samples.mjs` | 자동 검출 |
| 3. 대시보드 | `AutomationSystem.tsx` | 시각화 및 모니터링 |

### 8.3 검증 스크립트 변경

```javascript
// validate-content-samples.mjs
const FACT_REQUIRED_CATEGORIES = ['cat', 'dog', 'rabbit', 'hamster', 'plant', 'coffee', 'alcohol'];

// 지식 퀴즈(knowledge)만 팩트 검증
if (quiz.type === 'knowledge' && FACT_REQUIRED_CATEGORIES.includes(quiz.category)) {
  if (!quiz.source && !quiz.factRef) {
    errors.push(`팩트 필요 카테고리(${quiz.category}) 지식 퀴즈는 source 또는 factRef 필수`);
  }
}
```

### 8.4 검증 결과 출력

```
=== 📚 팩트 참조 검증 ===
팩트 필요 카테고리 퀴즈: 15개
✓ 팩트 참조 있음: 12개 ✅
✗ 팩트 참조 없음: 3개 ❌

=== ❌ 에러 목록 ===
[quiz] cat-quiz-001: 팩트 필요 카테고리(cat) 지식 퀴즈는 source 또는 factRef 필수
```

### 8.5 대시보드 개선

`AutomationSystem.tsx`의 Skills 탭에서:
- fact-collector 스킬 추가
- Subagent ↔ Skill 관계도에 팩트 필요 카테고리 안내 추가

---

## 9. 변경 요약 (v3)

| 항목 | v1 (초기) | v2 | v3 (현재) |
|------|----------|-----|----------|
| 팩트 데이터 소스 | 하드코딩 | MD 파일 파싱 API | 동일 |
| 타입 안전성 | `string` | `FactId` Template Literal | 동일 |
| ID 생성 | 수동 | 자동 (`generateFactId`) | 동일 |
| 검증 상태 | UI만 | 유틸리티 함수 | 동일 |
| **팩트 참조 강제** | ❌ | ❌ | ✅ 검증 스크립트 |
| **미사용 감지** | ❌ | ❌ | ✅ 에러로 표시 |
| **대시보드 시각화** | ❌ | 일부 | ✅ 완료 |

---

## 10. 추가 리뷰 요청 사항 (v3)

### 10.1 팩트 참조 강제 정책
- 지식 퀴즈에만 강제하는 것이 맞는가?
- 시나리오 퀴즈, 투표에도 팩트 참조가 필요한 경우가 있는가?

### 10.2 검증 시점
- 현재: 검증 스크립트 실행 시 (수동)
- 개선 필요: 빌드 시 자동 검증? CI/CD 통합?

### 10.3 경고 vs 에러
- 현재: 팩트 미참조 = 에러
- 레거시 콘텐츠에는 너무 엄격한가?
- 신규 콘텐츠만 에러, 기존은 경고로 분리?
