# Phase 2 코드 리뷰 - 스트릭/핫토픽/진행률 구현

> 작성일: 2024-12-22
> 작성자: Claude (Opus 4.5)
> 목적: 다른 AI 리뷰어를 위한 코드 변경 요약

---

## 1. 변경 개요

### 목적
퀴즈/투표 참여 UX 개선 - 게이미피케이션 요소 추가

### 수정 파일
| 파일 | 변경 내용 |
|------|----------|
| `src/services/ContentParticipationService.ts` | 스트릭 데이터 구조 및 로직 추가 |
| `src/components/ContentExplore.tsx` | 3개 UI 컴포넌트 추가 |

---

## 2. ContentParticipationService.ts 변경

### 2.1 추가된 타입

```typescript
export interface StreakData {
  currentStreak: number;          // 현재 연속 참여 일수
  longestStreak: number;          // 최장 연속 참여 일수
  lastParticipationDate: string | null;  // 마지막 참여 날짜 (YYYY-MM-DD)
  streakHistory: string[];        // 참여 날짜 기록 (최근 30일)
}
```

### 2.2 추가된 메서드

| 메서드 | 접근성 | 역할 |
|--------|--------|------|
| `getDateString(date?)` | private | Date → YYYY-MM-DD 문자열 변환 |
| `isConsecutiveDay(prev, curr)` | private | 두 날짜가 연속(1일 차이)인지 확인 |
| `isSameDay(date1, date2)` | private | 두 날짜가 같은 날인지 확인 |
| `updateStreak()` | private | 참여 시 스트릭 업데이트 |
| `getStreak()` | public | 스트릭 데이터 조회 (끊김 감지 포함) |
| `hasParticipatedToday()` | public | 오늘 참여 여부 확인 |

### 2.3 로직 흐름

```
참여 기록 → updateStreak() 호출 → saveToStorage()
                 ↓
    [오늘 이미 참여?] → Yes → 스킵
           ↓ No
    [어제 참여?] → Yes → currentStreak++
           ↓ No
    스트릭 끊김 → currentStreak = 1

조회 시: getStreak() → [마지막 참여가 어제 이전?] → currentStreak = 0 반환
```

### 2.4 잠재적 이슈

1. **타임존 문제**
   - `toISOString().split('T')[0]`는 UTC 기준
   - 한국 사용자가 밤 12시 직후 참여 시 날짜가 다르게 계산될 수 있음
   - **권장**: 로컬 타임존 기준으로 변경 검토

2. **마이그레이션**
   - 기존 사용자의 localStorage에 `streak` 필드가 없음
   - `getStreak()`에서 `!this.data.streak` 체크로 대응됨 ✓

3. **히스토리 정합성**
   - `streakHistory`는 별도 용도 없이 저장만 됨
   - 캘린더 뷰 등 UI 구현 시 활용 가능

---

## 3. ContentExplore.tsx 변경

### 3.1 추가된 컴포넌트

#### StreakBanner (라인 54-102)
```
목적: 연속 참여 일수 표시
Props: currentStreak, longestStreak, hasParticipatedToday

상태별 UI:
- currentStreak=0 && !hasParticipatedToday → 회색 유도 배너
- hasParticipatedToday=true → 주황 배너 + 체크 아이콘
- hasParticipatedToday=false → 연한 주황 배너 + "오늘 참여하면..." 문구
```

#### HotTopicsSection (라인 152-222)
```
목적: 인기 콘텐츠 3개 표시
로직:
1. 참여하지 않은 퀴즈/투표 필터링
2. ID 해시 기반 결정론적 인기도 점수 계산
3. 상위 3개 표시

주의: 실제 통계가 아닌 mock 데이터 사용
```

#### CategoryProgress (라인 236-311)
```
목적: 카테고리별 완료율 그리드
로직:
1. 퀴즈/투표별 카테고리 추출
2. 각 카테고리의 전체/완료 개수 계산
3. 진행률 바 + 완료 배지 표시

성능: useMemo로 최적화됨
```

### 3.2 메인 컴포넌트 변경

```typescript
// 추가된 상태
const [focusedItemId, setFocusedItemId] = useState<string | null>(null);

// 스트릭 데이터 (컴포넌트 렌더링마다 재계산)
const streak = contentParticipationService.getStreak();
const hasParticipatedToday = contentParticipationService.hasParticipatedToday();
```

### 3.3 UI 배치

```
ContentExplore
└── 메인 콘텐츠 영역
    ├── StreakBanner (퀴즈/투표 탭에서만)
    ├── HotTopicsSection (전체 카테고리 + !showUncompletedOnly)
    ├── CategoryProgress (전체 카테고리 + !showUncompletedOnly)
    └── 퀴즈/투표 카드 목록
```

### 3.4 잠재적 이슈

1. **성능**
   - `getStreak()`, `hasParticipatedToday()`가 렌더링마다 호출됨
   - 현재는 문제없지만, 데이터 커지면 useMemo 고려

2. **포커스 아이템 스크롤**
   - `focusedItemId` 설정은 하지만 실제 스크롤은 구현 안 됨
   - 핫토픽 클릭 시 해당 카드로 스크롤 필요

3. **타입 안전성**
   - `CATEGORY_LABELS[cat as ContentCategory]`에서 타입 단언 사용
   - 존재하지 않는 카테고리 시 undefined 가능 (optional chaining으로 대응)

---

## 4. 테스트 시나리오

### 스트릭 로직 검증
```
1. 첫 참여 → currentStreak: 1
2. 같은 날 재참여 → currentStreak: 1 (변동 없음)
3. 다음 날 참여 → currentStreak: 2
4. 하루 건너뛰고 참여 → currentStreak: 1 (리셋)
5. 3일 건너뛰고 조회 → currentStreak: 0 (끊김 표시)
```

### UI 검증
```
1. 퀴즈 탭 진입 → 스트릭 배너 표시
2. 퀴즈 정답 → 스트릭 배너 업데이트 (체크 아이콘)
3. 전체 카테고리 → 핫토픽 + 진행률 표시
4. 특정 카테고리 선택 → 핫토픽 + 진행률 숨김
5. "안 한 것만" 토글 → 핫토픽 + 진행률 숨김
```

---

## 5. 리뷰 요청 사항

1. **타임존 처리**: UTC vs 로컬 시간 문제 검토
2. **스크롤 동작**: 핫토픽 클릭 시 해당 카드로 스크롤 구현 여부
3. **성능**: 대량 데이터 시 useMemo 추가 필요성
4. **접근성**: 스크린 리더 지원 검토

---

## 6. 빌드 결과

```
✓ Compiled successfully
✓ Generating static pages (18/18)
```

타입 에러/빌드 에러 없음.
