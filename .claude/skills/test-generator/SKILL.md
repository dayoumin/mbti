---
name: test-generator
description: 파싱된 리서치 데이터를 기반으로 TypeScript 테스트 데이터 파일 생성. 새 테스트 추가, subjects/*.ts 파일 생성 시 사용.
allowed-tools: Read, Write, Edit, Glob
---

# 테스트 데이터 생성기

## 목적
리서치 파서가 추출한 데이터를 실제 TypeScript 코드로 변환합니다.

## 생성할 파일 (8개)

### 1. 테스트 데이터 파일
```
src/data/subjects/{subject}.ts
```

### 2. 타입 정의 수정
```
src/data/types.ts → SubjectKey 유니온에 추가
```

### 3. 설정 추가
```
src/data/config.ts → SUBJECT_CONFIG에 추가
```

### 4. 인덱스 수정
```
src/data/index.ts → import + CHEMI_DATA + SUBJECT_KEYS
```

### 5. 아이콘 추가
```
src/components/Icons.js → {Subject}Icon 컴포넌트
```

### 6. 대시보드 아이콘 매핑
```
src/app/dashboard/page.tsx → TEST_ICONS 객체
```

### 7. 검증 스크립트 수정
```
scripts/validate-test-data.mjs → SUBJECTS 배열
```

### 8. 인사이트 태그 매핑 ⭐
```
src/data/insight/test-tag-mappings.ts → {SUBJECT}_TAG_MAPPING 추가
```

## 데이터 구조 템플릿

```typescript
import { SubjectData } from '../types';

export const {subject}Data: SubjectData = {
  title: "{title}",
  subtitle: "{subtitle}",
  themeColor: "{themeColor}",
  icon: "{Subject}Icon",

  dimensions: {
    // research-parser 출력 그대로 사용
  },

  questions: [
    // 각 차원당 최소 2개, 총 12-16개
    // 반드시 중간점수(3) 포함
    {
      q: "질문 텍스트?",
      dimension: "dimensionKey",
      a: [
        { text: "높은 선택", score: 5 },
        { text: "중간 선택", score: 3 },
        { text: "낮은 선택", score: 1 }
      ]
    }
  ],

  resultLabels: [
    // 8-16개 결과
    {
      name: "결과명",
      emoji: "🎯",
      desc: "한줄 설명",
      condition: { dim1: "high", dim2: "low" },  // 2-3개 조건
      mood: "happy",  // happy | cool | excited | calm
      color: "bg-xxx-300",
      interpretation: "상세 해석 텍스트",
      guide: "추천 가이드 텍스트",
      matchPoints: ["포인트1", "포인트2", "포인트3"]
    }
  ]
};
```

## 필수 규칙

### testType별 권장 수치

| testType | 차원 | 질문 | 결과 | 용도 |
|----------|------|------|------|------|
| **personality** | 5-6개 | 차원×3 (15-18) | 8-16개 | 성격 분석 |
| **matching** | 4-6개 | 차원×2-3 (10-15) | 8-12개 | 취향 매칭 |
| **situation** | 4-6개 | 차원×2 (10-12) | 6-10개 | 상황 대처 |

**리서치 파일의 구조에 따라 유연하게 적용**

### condition 규칙
- `condition: {}` 절대 금지 (도달 불가)
- 각 결과에 2-3개 조건 필수
- 모든 결과 유형 도달 가능해야 함

### 질문 규칙
- 각 차원당 최소 2개 질문
- testType에 따라 총 질문 수 결정 (위 표 참조)
- **중간점수(3) 옵션: 40% 이상 질문에 포함 필수**
- 리서치의 질문 예시 활용 + 추가 생성

### 스타일 규칙
- themeColor: Tailwind 클래스 (bg-xxx-100)
- color: Tailwind 클래스 (bg-xxx-300)
- mood: happy | cool | excited | calm 중 선택

## 아이콘 템플릿

```jsx
// Icons.js에 추가
export function {Subject}Icon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      {/* SVG 경로 */}
    </svg>
  );
}
```

## 인사이트 태그 매핑 ⭐

테스트 결과에서 인사이트 태그를 추출하기 위한 매핑을 추가합니다.

### 매핑 구조

```typescript
// src/data/insight/test-tag-mappings.ts

export const {SUBJECT}_TAG_MAPPING: TestTagMapping = {
  dimensions: {
    dim1: {
      high: ['extroverted', 'expressive'],  // HIGH 레벨일 때 태그
      low: ['introverted', 'reserved'],     // LOW 레벨일 때 태그
    },
    dim2: {
      high: ['planned', 'structured'],
      low: ['spontaneous', 'flexible'],
    },
    // ... 모든 차원
  },
  countsAsRelationship: false,  // 관계 테스트면 true
};

// TEST_TAG_MAPPINGS에 등록
export const TEST_TAG_MAPPINGS: Record<SubjectKey, TestTagMapping> = {
  // 기존...
  {subject}: {SUBJECT}_TAG_MAPPING,
};
```

### 태그 선택 가이드

**SSOT**: `src/data/insight/insight-tags.ts` 참조

| 카테고리 | 사용 가능한 태그 |
|---------|-----------------|
| personality | `extroverted`, `introverted`, `logical`, `emotional`, `planned`, `spontaneous`, `structured`, `independent`, `supportive`, `expressive`, `reserved` 등 |
| decision | `practical`, `sentimental`, `adventurous`, `safe`, `cautious`, `solo`, `together`, `direct`, `indirect` |
| relationship | `competing`, `avoiding`, `accommodating`, `collaborating`, `compromising`, `close-bonding`, `space-needing` |
| lifestyle | `active`, `homebody`, `frugal`, `splurger`, `morning-person`, `night-owl` |

### 차원 → 태그 매핑 원칙

1. **차원의 의미와 일치**: 차원이 측정하는 것과 태그가 일치해야 함
2. **high/low 대칭**: 반대 성향의 태그 쌍으로 구성
3. **2-3개 태그**: 각 레벨당 2-3개 태그 권장

**예시:**
```typescript
// 외향성 차원
social: {
  high: ['extroverted', 'together', 'expressive'],
  low: ['introverted', 'solo', 'reserved'],
}

// 계획성 차원
planning: {
  high: ['planned', 'structured', 'cautious'],
  low: ['spontaneous', 'flexible', 'adventurous'],
}
```

### countsAsRelationship 설정

| 테스트 유형 | 값 | 예시 |
|------------|-----|------|
| 연애/관계 테스트 | `true` | idealType, conflictStyle |
| 성격/취향 테스트 | `false` | human, coffee, whiskey |

## 체크리스트

- [ ] subjects/{subject}.ts 생성
- [ ] types.ts SubjectKey 추가
- [ ] config.ts SUBJECT_CONFIG 추가
- [ ] index.ts import/export 추가
- [ ] Icons.js 아이콘 추가
- [ ] dashboard/page.tsx TEST_ICONS 추가
- [ ] validate-test-data.mjs SUBJECTS 추가
- [ ] **test-tag-mappings.ts 태그 매핑 추가** ⭐
