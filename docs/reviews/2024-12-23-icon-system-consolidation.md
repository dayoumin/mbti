# 아이콘 시스템 통합 코드 리뷰 요청

**날짜**: 2024-12-23
**작업자**: Claude (AI)
**리뷰 요청 대상**: 다른 AI 또는 개발자

---

## 변경 목적

새 테스트 추가 시 아이콘을 4곳에서 각각 수정해야 하는 문제 해결.
**한 곳(config.ts)만 수정하면 대시보드 전체에 적용**되도록 통합.

---

## 변경 전 문제점

```
새 테스트 추가 시 아이콘 수정 필요한 파일:
1. src/data/config.ts         - icon 필드 (SVG 컴포넌트명)
2. src/components/Icons.tsx   - SVG 컴포넌트 + IconMap
3. src/app/dashboard/page.tsx - TEST_ICONS 객체 (lucide-react)
4. src/app/dashboard/config/sidebar.tsx - TEST_ICONS 객체 (중복!)
```

- page.tsx와 sidebar.tsx에 **동일한 TEST_ICONS가 중복 정의**됨
- 새 테스트 추가 시 누락하기 쉬움 (실제로 7개 테스트 아이콘 누락 발생)

---

## 변경 후 구조

```
config.ts (단일 소스)
    ↓ lucideIcon 필드
sidebar.tsx (getTestIcon 함수)
    ↓ import
page.tsx (사용)
```

### 수정 파일 5개

| 파일 | 변경 내용 |
|------|----------|
| `src/data/types.ts` | SubjectConfig에 `lucideIcon?: string` 필드 추가 |
| `src/data/config.ts` | 모든 테스트에 `lucideIcon` 필드 추가 (25개) |
| `src/app/dashboard/config/sidebar.tsx` | TEST_ICONS → `getTestIcon()` 함수로 교체 |
| `src/app/dashboard/page.tsx` | TEST_ICONS 제거, `getTestIcon()` import 사용 |
| `CLAUDE.md` | 신규 테스트 추가 가이드 업데이트 (7개→5개) |

---

## 핵심 코드

### 1. types.ts - 타입 정의
```typescript
export interface SubjectConfig {
  testType: string;
  icon: string;
  lucideIcon?: string;  // 대시보드용 lucide-react 아이콘명 (신규)
  emoji?: string;
  label: string;
  // ...
}
```

### 2. config.ts - 단일 소스
```typescript
export const SUBJECT_CONFIG: Record<SubjectKey, SubjectConfig> = {
    human: {
        testType: "personality",
        icon: "HumanIcon",        // 결과 페이지용 SVG
        lucideIcon: "Brain",      // 대시보드용 lucide-react (신규)
        emoji: "👤",
        label: "사람",
        // ...
    },
    // 25개 테스트 모두 동일 패턴
};
```

### 3. sidebar.tsx - 아이콘 유틸 함수
```typescript
import { SUBJECT_CONFIG } from '@/data';
import { LucideIcon, Brain, Cat, Dog, /* ... */ } from 'lucide-react';

// lucide-react 아이콘 매핑 (문자열 -> 컴포넌트)
const LUCIDE_ICON_MAP: Record<string, LucideIcon> = {
  Brain, Cat, Dog, Rabbit, Puzzle, Heart, Flower2, Star, Coffee,
  CupSoda, HeartHandshake, Apple, Wine, Croissant, Sparkle, Leaf,
  UtensilsCrossed, Soup, Fish, Bird, Bug,
};

// config.ts의 lucideIcon 필드를 읽어 아이콘 렌더링
export function getTestIcon(key: SubjectKey, className = "w-5 h-5"): React.ReactNode {
  const config = SUBJECT_CONFIG[key];
  const iconName = config?.lucideIcon;
  const IconComponent = iconName ? LUCIDE_ICON_MAP[iconName] : null;

  if (IconComponent) {
    return <IconComponent className={className} />;
  }
  // 폴백: 기본 아이콘
  return <Star className={className} />;
}
```

### 4. page.tsx - 사용
```typescript
import { getTestIcon } from './config/sidebar';

// 사용 예:
<span className="text-[var(--db-brand)]">{getTestIcon(key)}</span>
<span className="text-[var(--db-brand)]">{getTestIcon(selectedTest)}</span>
```

---

## 리뷰 결과 (2024-12-23 2차)

### 지적 사항 및 수정

| 지적 | 심각도 | 수정 내용 |
|------|--------|----------|
| getTestIcon이 sidebar.tsx에 있어 page.tsx가 sidebar에 의존 | Low | `src/utils/testIcons.tsx`로 분리 |
| lucideIcon 누락 시 폴백 경고 없음 | Medium | 개발 환경에서 console.warn 추가 |
| verify 스크립트가 SubjectKey 개수 검증 안 함 | Medium | types.ts SubjectKey 개수와 비교 추가 |

### 최종 구조

```
src/utils/testIcons.tsx      ← getTestIcon() + LUCIDE_ICON_MAP (핵심)
    ↑ import
src/app/dashboard/config/sidebar.tsx  ← re-export만
    ↑ import
src/app/dashboard/page.tsx   ← 사용
```

### 검증 결과
```
📊 types.ts SubjectKey 개수: 25개
✅ config.ts에서 25개 테스트의 lucideIcon 발견
✅ SubjectKey 개수와 lucideIcon 개수 일치 (25개)
✅ 모든 사용 아이콘이 LUCIDE_ICON_MAP에 존재
✅ 모든 검증 통과!
```

## 남은 한계점

1. **여전히 2곳 수정 필요**: 새 아이콘 종류 사용 시 config.ts + testIcons.tsx
   - 동적 import 가능하지만 async 렌더링 필요 (trade-off)
2. **lucideIcon 타입이 string**: 잘못된 아이콘명 입력 시 런타임에서만 발견
   - 해결안: 검증 스크립트를 CI에 추가

---

## 테스트 방법

### 1. 빌드 테스트
```bash
npm run build
# 결과: 성공 (2024-12-23 확인)
```

### 2. 수동 검증
1. `npm run dev` 실행
2. `/dashboard` 접속
3. 테스트 관리 > 테스트 목록에서 아이콘 확인
4. 각 테스트 선택 시 아이콘 표시 확인

### 3. 새 테스트 추가 시뮬레이션
config.ts에 lucideIcon만 추가하고 대시보드에서 표시되는지 확인:
```typescript
// config.ts에만 추가
newTest: {
    lucideIcon: "Coffee",  // 이것만 추가하면
    // ...
}
// → 대시보드에 자동 반영되어야 함
```

---

## 남은 개선 사항

1. **LUCIDE_ICON_MAP 동기화 문제**: config.ts에 새 lucideIcon 추가 시 sidebar.tsx의 LUCIDE_ICON_MAP에도 추가 필요
   - 개선안: 런타임 경고 또는 TypeScript strict 타입으로 강제

2. **아이콘 미리보기**: 대시보드에서 사용 가능한 lucide 아이콘 목록 표시

---

## 결론

- **목표 달성**: 4곳 → 1곳으로 통합 (신규 테스트 시 config.ts만 수정)
- **단, LUCIDE_ICON_MAP 추가는 별도 필요** (새 아이콘 종류 사용 시)
- **빌드 테스트 통과**: 타입 에러 없음
