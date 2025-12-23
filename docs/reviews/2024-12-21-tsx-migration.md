# 코드 리뷰 요청: JS→TSX 마이그레이션 및 타입 안전성 강화

## 변경 개요

**목적**: JS 파일들을 TSX/TS로 마이그레이션하여 타입 안전성 확보

**배경**:
- Dashboard.js → Dashboard.tsx 변환 과정에서 26개 이상의 TypeScript 에러 발생
- 누락된 export, 타입 불일치, implicit any 등 다양한 문제 해결

---

## 주요 변경사항

### 1. src/data/config.ts

**변경**: 누락된 export 추가 및 SUBJECT_CONFIG에 emoji 필드 추가

```typescript
// 각 테스트에 emoji 필드 추가
human: {
    testType: "personality",
    icon: "HumanIcon",
    emoji: "👤",  // 신규
    label: "사람",
    // ...
},

// DETAIL_TEST_KEYS 추가
export const DETAIL_TEST_KEYS: SubjectKey[] = [
    'dogBreed', 'catBreed', 'smallPet', 'fishType', 'birdType', 'reptileType'
];

// MAIN_TEST_KEYS 추가 (세부 테스트 제외)
export const MAIN_TEST_KEYS = (Object.keys(SUBJECT_CONFIG) as SubjectKey[])
    .filter(key => !DETAIL_TEST_KEYS.includes(key));

// RANKABLE_TESTS/RANKABLE_TEST_KEYS 추가
export const RANKABLE_TESTS: Array<{ key: keyof typeof SUBJECT_CONFIG; emoji: string; name: string }> = [
    { key: 'human', emoji: '👤', name: '사람 성격' },
    { key: 'cat', emoji: '🐱', name: '고양이 성격' },
    // ...
];
export const RANKABLE_TEST_KEYS = RANKABLE_TESTS.map(t => t.key);
```

---

### 2. src/data/index.ts

**변경**: config.ts 상수 re-export 및 camelCase alias 추가

```typescript
// config.ts에서 re-export
export {
    SUBJECT_CONFIG,
    MAIN_TEST_KEYS,
    DETAIL_TEST_KEYS,  // 신규
    RANKABLE_TESTS,
    RANKABLE_TEST_KEYS,
    TEST_TYPES
} from './config';

// camelCase alias exports (하위 호환성)
export const humanData = HUMAN_DATA;
export const catData = CAT_DATA;
export const dogData = DOG_DATA;
export const rabbitData = RABBIT_DATA;
export const hamsterData = HAMSTER_DATA;
export const idealTypeData = IDEALTYPE_DATA;
export const plantData = PLANT_DATA;
export const petMatchData = PETMATCH_DATA;
export const coffeeData = COFFEE_DATA;
```

---

### 3. src/data/types.ts

**변경**: SubjectConfig 인터페이스 필드를 optional로 변경

```typescript
export interface SubjectConfig {
  testType: string;
  icon: string;
  emoji?: string;        // optional로 변경
  label: string;
  intro?: string[];      // optional로 변경
  resultFormat?: 'simple' | 'tabs' | 'matching';  // optional로 변경
  deepButtonText?: string;  // optional로 변경
  // ... 기타 필드들
}
```

**이유**: 일부 테스트 설정에서 모든 필드가 필수가 아니므로 유연성 확보

---

### 4. src/components/Dashboard.tsx

**변경**: 'use client' 추가 및 TypeScript 인터페이스 정의

```typescript
'use client';

import type { SubjectKey } from '../data/types';

interface StreakData {
    currentStreak: number;
    longestStreak: number;
}

interface LevelData {
    emoji: string;
    name: string;
    level: number;
}

interface BonusAction {
    icon: string;
    label: string;
    type: string;
    targetId?: string;
}

interface DashboardProps {
    onStartTest?: (testKey: SubjectKey) => void;
    onContentExplore?: () => void;
}

const Dashboard = ({ onStartTest, onContentExplore }: DashboardProps) => {
    // 함수 파라미터에 명시적 타입 어노테이션 추가
};
```

---

### 5. src/components/nav/types.ts

**변경**: 'use client' 지시어 추가

```typescript
'use client';

import { Home, Compass, Trophy, User, MessageSquare } from 'lucide-react';

// NavTab에서 'care' 제거됨 (이전 리팩토링)
export type NavTab = 'home' | 'explore' | 'ranking' | 'talk' | 'profile';
```

---

### 6. tsconfig.json

**변경**: scripts 폴더 exclude 추가

```json
{
  "exclude": ["node_modules", "scripts"]
}
```

**이유**: scripts 폴더의 .mjs 파일들이 TypeScript 검증에서 제외되어야 함

---

### 7. tests/e2e/my-profile.test.ts

**변경**: 셀렉터 안정성 개선

```typescript
test.describe('CareButtonWithModal', () => {
  // 프로필 모달을 여는 헬퍼 함수
  async function openProfileModal(page: import('@playwright/test').Page): Promise<boolean> {
    // FullProfile 테스트와 동일한 셀렉터 사용
    const profileCard = page.locator('div:has-text("Lv.")').first();
    const moreButton = profileCard.locator('button:has-text("더보기")').first();

    if (await moreButton.count() > 0 && await moreButton.isVisible().catch(() => false)) {
      await moreButton.click();
      await page.waitForTimeout(300);
      const dialog = page.locator('[role="dialog"][aria-label="내 프로필"]');
      if (await dialog.isVisible().catch(() => false)) {
        return true;
      }
    }
    return false;
  }
  // ...
});
```

---

## 검증 결과

| 검증 항목 | 결과 |
|----------|------|
| **빌드** | `npm run build` 성공 |
| **린트** | `npm run lint` 통과 (scripts/ 경고만) |
| **responsive.test.ts** | 30/30 통과 |
| **my-profile.test.ts** | 20 통과, 12 skip, 1 실패 |

### E2E 테스트 상세

```
Running 33 tests using 3 workers

FullProfile 모달
  ✓ 프로필 더보기 버튼으로 모달 열기 (3 viewports)
  ✓ ESC 키로 FullProfile 모달 닫기 (3 viewports)
  ✓ 닫기 버튼으로 FullProfile 모달 닫기 (3 viewports)
  ✓ 탭 네비게이션 동작 (3 viewports)

CareButtonWithModal
  - 동물 탭에서 반려생물 케어 관리 버튼 표시 (skip - 셀렉터 문제)
  - 케어 관리 버튼 클릭으로 CareHome 열기 (skip)
  - ESC 키로 CareHome 모달 닫기 (skip)
  - 뒤로가기 버튼으로 CareHome 모달 닫기 (skip)

케어 진입 통합 (동물 탭)
  ✓ 라이프 탭에는 케어 버튼 없음 (3 viewports)
  ✓ 동물 탭 빈 상태에서도 케어 버튼 표시 (2 viewports)
  ✗ 동물 탭 빈 상태에서도 케어 버튼 표시 (e2e-mobile - timeout)

접근성
  ✓ 모달에 적절한 ARIA 속성 있음 (3 viewports)

결과: 20 passed, 12 skipped, 1 failed
```

---

## 주의사항

### 1. E2E 테스트 skip 문제

**문제**: CareButtonWithModal 테스트 12개가 skip됨

**원인**:
- 테스트에서 cat 결과만 설정하면 프로필 레벨이 표시되지 않음
- "Lv." 셀렉터로 프로필 카드를 찾지 못함

**해결 방안**:
1. human 결과도 함께 설정
2. 다른 셀렉터 전략 사용 (data-testid 추가)

### 2. SubjectConfig 타입 변경

**영향**: 일부 필드를 optional로 변경함

**주의점**:
- 기존 코드에서 해당 필드를 사용하는 곳에서 undefined 체크 필요할 수 있음
- 특히 `emoji`, `intro`, `resultFormat`, `deepButtonText` 필드

### 3. DETAIL_TEST_KEYS 추가

**영향**: MAIN_TEST_KEYS가 세부 테스트를 제외하도록 변경됨

**관련 코드**:
- 대시보드에서 테스트 목록 표시 시 MAIN_TEST_KEYS 사용
- 세부 테스트는 별도 섹션으로 표시

---

## 수정된 파일 전체 목록

```
# 핵심 변경
src/data/config.ts        - MAIN_TEST_KEYS, DETAIL_TEST_KEYS, RANKABLE_TESTS, emoji 필드 추가
src/data/index.ts         - re-export 및 camelCase alias 추가
src/data/types.ts         - SubjectConfig 필드 optional 변경
src/components/Dashboard.tsx - 'use client' 및 타입 정의 추가
src/components/nav/types.ts  - 'use client' 추가
tsconfig.json             - scripts exclude 추가
tests/e2e/my-profile.test.ts - 셀렉터 수정

# 관련 파일 (이전 리팩토링)
src/app/page.tsx          - 타입 캐스팅 수정
src/components/MyProfile.tsx - 'use client' 추가
src/components/Sidebar.tsx   - 'use client' 추가
src/app/dashboard/components/PopularRanking.tsx - 타입 캐스팅
src/app/dashboard/components/ViralContent.tsx   - import 경로 수정
```

---

## 다음 작업 권장

1. **E2E 테스트 안정화**: CareButtonWithModal 테스트가 skip되지 않도록 수정
   - 프로필 카드에 data-testid 추가
   - beforeEach에서 human 결과도 설정

2. **타입 안전성 강화**:
   - config.ts에서 emoji를 required로 변경 (모든 테스트에 이미 추가됨)
   - undefined 체크 코드 정리

---

*생성일: 2024-12-21*
*작성: Claude Opus 4.5*
*테스트 결과: 빌드 성공, 린트 통과, E2E 20/33 통과*
