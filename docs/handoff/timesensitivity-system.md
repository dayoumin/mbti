# timeSensitivity 시스템 핸드오프 문서

## 개요

콘텐츠 유효기간 관리 시스템. 트렌드/시의성 있는 콘텐츠의 만료 시점을 추적하고 관리자에게 갱신 필요성을 알림.

## 핵심 개념

### Sensitivity 레벨 (4단계)

| 레벨 | 유효기간 | 용도 |
|------|---------|------|
| `high` | 2년 | 빠르게 변하는 트렌드 (경제 상황, 유행어) |
| `medium` | 3년 | 중간 속도 변화 (추억/노스탤지어) |
| `low` | 4년 | 느린 변화 (연애 트렌드, 시즌 콘텐츠) |
| `none` | 무제한 | 불변 사실 (동물 지식, 심리 원리) |

### 데이터 구조

```typescript
// src/data/content/types.ts
interface TimeSensitivityMeta {
  sensitivity: 'high' | 'medium' | 'low' | 'none';
  sourceYear: number;  // 콘텐츠 생성 연도 (2025)
}

// 콘텐츠 아이템에 적용
interface ContentItem {
  id: string;
  // ...
  meta: {
    timeSensitivity: TimeSensitivityMeta;
    // 기타 meta 속성들
  };
}
```

## 파일 구조

```
src/data/content/
├── types.ts                    # TimeSensitivity 타입 정의, getValidityStatus() 함수
├── quizzes/
│   ├── bird-knowledge.ts       # sensitivity: 'none' (동물 지식)
│   ├── money-polls.ts          # sensitivity: 'high' (경제)
│   └── nostalgia-knowledge.ts  # sensitivity: 'medium' (추억)
├── polls/
│   ├── vs-polls.ts             # sensitivity: 'low' (밸런스게임)
│   └── ...
└── situation-reactions/
    ├── work.ts                 # sensitivity: 'low' (직장)
    └── ...
```

## 주요 함수

### getValidityStatus()

```typescript
// src/data/content/types.ts
function getValidityStatus(
  meta: TimeSensitivityMeta,
  currentDate: Date = new Date()
): ValidityStatus {
  // sensitivity + sourceYear 기반으로 만료일 계산
  // 반환: 'current' | 'needs_review' | 'outdated'
}
```

### 유효기간 계산 로직

```typescript
const VALIDITY_PERIODS = {
  high: 2,    // 2년
  medium: 3,  // 3년
  low: 4,     // 4년
  none: Infinity,
};

// 만료일 = sourceYear + VALIDITY_PERIODS[sensitivity]
// 예: { sensitivity: 'low', sourceYear: 2025 } → 2029년까지 유효
```

## UI 컴포넌트

### ContentValidityManager

**위치**: `src/app/dashboard/components/ContentStatusDashboard.tsx` (438번줄~)

**기능**:
- 상태별 요약 (유효/검토 필요/만료)
- 갱신 주기별 분포 차트
- 주의가 필요한 콘텐츠 목록

**접근 경로**: 대시보드 → 개요 → 콘텐츠 현황 → 스크롤 다운

## 검증 도구

### 커버리지 확인 스크립트

```bash
node scripts/check-timesensitivity.mjs
```

**출력**:
- 총 파일 수, 적용된 파일 수
- Sensitivity 분포 (none: 23개, low: 9개, ...)
- sourceYear 검증
- DEFAULT_TIME_SENSITIVITY 상수 누락 파일

### 테스트

```bash
npx tsx tests/timesensitivity.test.ts
```

**검증 항목**:
- 100% 커버리지 확인
- 예상 sensitivity vs 실제 비교
- sourceYear 2025 확인

## 콘텐츠에 적용하는 방법

### 방법 1: 직접 적용 (권장)

```typescript
// quizzes/example.ts
export const exampleQuizzes: Quiz[] = [
  {
    id: 'quiz-001',
    question: '질문?',
    // ...
    meta: {
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
      // 기타 meta
    },
  },
];
```

### 방법 2: DEFAULT 상수 사용

```typescript
const DEFAULT_TIME_SENSITIVITY = {
  timeSensitivity: { sensitivity: 'none' as const, sourceYear: 2025 },
};

export const quizzes: Quiz[] = [
  {
    id: 'quiz-001',
    meta: { ...DEFAULT_TIME_SENSITIVITY },
  },
];
```

## Sensitivity 레벨 선택 가이드

| 콘텐츠 유형 | 권장 레벨 | 이유 |
|------------|----------|------|
| 동물/식물 과학 지식 | `none` | 생물학적 사실은 변하지 않음 |
| 심리학 원리 | `none` | 학술적 기반, 장기 유효 |
| 타로/별자리 상식 | `none` | 전통적 해석 기반 |
| 연애/관계 트렌드 | `low` | 세대별 차이 있으나 느리게 변화 |
| 시즌/계절 콘텐츠 | `low` | 매년 반복되나 트렌드 영향 |
| 밸런스게임 | `low` | 유행 영향 있으나 보편적 |
| 재테크/경제 | `high` | 경제 상황에 따라 빠르게 변화 |
| 추억/노스탤지어 | `medium` | 세대별 공감대 변화 |

## 현재 상태 (2025-12-26)

- **커버리지**: 100% (34/34 파일)
- **sourceYear**: 모두 2025
- **분포**: none 23개, low 9개, medium 1개, high 1개

## 다음 단계 (TODO)

1. **대시보드 UI 확인**: ContentValidityManager가 렌더링되지 않는 이슈 조사
2. **자동 알림**: 만료 임박 콘텐츠 슬랙/이메일 알림
3. **갱신 워크플로우**: 만료된 콘텐츠 갱신 프로세스 정의
