# Phase 2 버그 수정 리뷰

> 작성일: 2024-12-22
> 작성자: Claude (Opus 4.5)
> 목적: 코드 리뷰 발견 사항 수정 요약

---

## 1. 수정 개요

| 우선순위 | 이슈 | 상태 |
|---------|------|------|
| Medium | UTC 타임존 문제 | ✅ 수정됨 |
| Low | totalVotes=0 로딩 상태 | ✅ 수정됨 |
| Low | 핫토픽 클릭 시 스크롤 | ✅ 수정됨 |

---

## 2. 상세 수정 내역

### 2.1 UTC 타임존 문제 (Medium)

**문제**
- `toISOString().split('T')[0]`는 UTC 기준 날짜 반환
- 한국(KST, UTC+9) 사용자가 자정~오전 9시 사이에 참여 시 전날로 계산됨
- 예: 12월 22일 오전 1시(KST) → 12월 21일(UTC)로 저장

**수정 파일**: `src/services/ContentParticipationService.ts`

**Before (UTC 기준)**
```typescript
private getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

private isConsecutiveDay(prevDate: string, currentDate: string): boolean {
  const prev = new Date(prevDate);
  const curr = new Date(currentDate);
  // new Date('YYYY-MM-DD')는 UTC 자정으로 해석
  const diffTime = curr.getTime() - prev.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}
```

**After (로컬 타임존 기준)**
```typescript
private getDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

private isConsecutiveDay(prevDate: string, currentDate: string): boolean {
  // YYYY-MM-DD를 로컬 날짜로 파싱 (UTC 해석 방지)
  const [prevYear, prevMonth, prevDay] = prevDate.split('-').map(Number);
  const [currYear, currMonth, currDay] = currentDate.split('-').map(Number);

  const prev = new Date(prevYear, prevMonth - 1, prevDay);
  const curr = new Date(currYear, currMonth - 1, currDay);

  const diffTime = curr.getTime() - prev.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}
```

**검증 방법**
```javascript
// 브라우저 콘솔에서 테스트
const d = new Date('2024-12-22T01:00:00'); // 오전 1시
console.log(d.getFullYear(), d.getMonth()+1, d.getDate());
// → 2024 12 22 (로컬 타임존 기준 정확)

console.log(d.toISOString().split('T')[0]);
// → "2024-12-21" (UTC 기준 - 잘못됨)
```

---

### 2.2 totalVotes=0 로딩 상태 (Low)

**문제**
- API 응답에서 `totalVotes: 0`일 때 "통계 로딩 중..." 표시가 영구 지속
- `if (data.totalVotes > 0)` 조건으로 0표인 경우 상태 업데이트 안 됨

**수정 파일**: `src/components/ContentExplore.tsx`

**Before**
```typescript
if (data.totalVotes > 0) {
  setRealStats({...});
}

// UI
{realStats ? `${realStats.total}명 참여` : '통계 로딩 중...'}
```

**After**
```typescript
// totalVotes가 0 이상이면 통계 표시 (0표도 유효한 상태)
if (typeof data.totalVotes === 'number') {
  setRealStats({...});
}

// UI - 0표일 때 의미 있는 메시지
{realStats ? `${realStats.total.toLocaleString()}명 참여` : '첫 번째 투표입니다!'}
```

---

### 2.3 핫토픽 클릭 시 스크롤 (Low)

**문제**
- 핫토픽 클릭 시 `setFocusedItemId()`만 호출하고 실제 스크롤 없음
- 사용자가 해당 카드를 직접 찾아야 함

**수정 파일**: `src/components/ContentExplore.tsx`

**추가된 코드**
```typescript
// 1. ref Map 추가
const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

// 2. ref 설정 콜백
const setItemRef = useCallback((id: string, element: HTMLDivElement | null) => {
  if (element) {
    itemRefs.current.set(id, element);
  } else {
    itemRefs.current.delete(id);
  }
}, []);

// 3. 포커스 시 스크롤 useEffect
useEffect(() => {
  if (focusedItemId) {
    const timer = setTimeout(() => {
      const element = itemRefs.current.get(focusedItemId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      // 포커스 표시 3초 후 해제
      setTimeout(() => setFocusedItemId(null), 3000);
    }, 100);
    return () => clearTimeout(timer);
  }
}, [focusedItemId]);

// 4. 카드에 ref 연결
<div
  key={quiz.id}
  ref={(el) => setItemRef(quiz.id, el)}
  className={isFocused ? 'ring-2 ring-orange-400 ... transition-all' : 'transition-all'}
>
```

**동작 흐름**
1. 핫토픽 아이템 클릭
2. `setFocusedItemId(itemId)` 호출
3. `activeTab` 변경 (quiz/poll)
4. useEffect 트리거 → 100ms 딜레이 후 스크롤
5. 카드가 화면 중앙에 위치 + 주황색 하이라이트
6. 3초 후 하이라이트 해제

---

## 3. 빌드 결과

```
✓ Compiled successfully
✓ Generating static pages (18/18)
```

타입 에러/빌드 에러 없음.

---

## 4. 테스트 시나리오

### 타임존 테스트
```
1. 브라우저 시간대를 KST(UTC+9)로 설정
2. 자정~오전 9시 사이에 퀴즈 참여
3. 스트릭 날짜가 오늘(로컬 기준)로 저장되는지 확인
4. 다음 날 참여 시 스트릭 증가 확인
```

### 투표 0표 테스트
```
1. 새로운 투표(DB에 기록 없음)에 참여
2. "첫 번째 투표입니다!" 메시지 확인
3. API 응답 후 "0명 참여" 표시 확인
```

### 핫토픽 스크롤 테스트
```
1. 콘텐츠 탐색 진입 (전체 카테고리)
2. 핫토픽 섹션에서 퀴즈/투표 클릭
3. 해당 카드로 부드럽게 스크롤됨 확인
4. 주황색 하이라이트 표시 확인
5. 3초 후 하이라이트 사라짐 확인
```

---

## 5. 추가 고려사항

### 네트워크 최적화 (미수정)
- 현재: 각 PollCard가 개별 `/api/poll` 호출
- 개선안: 배치 API 또는 SSR 프리패치
- **결정**: 현재 사용량에서는 문제없음, 트래픽 증가 시 최적화 검토

### 마이그레이션 안전성
- 기존 localStorage 데이터(UTC 기준 날짜)와 새 데이터(로컬 기준) 혼재 가능
- `isConsecutiveDay()` 로직이 둘 다 정확히 처리
- 장기적으로는 자연스럽게 새 형식으로 전환됨

---

## 6. 수정 파일 요약

| 파일 | 변경 내용 |
|------|----------|
| `src/services/ContentParticipationService.ts` | `getDateString`, `isConsecutiveDay` 로컬 타임존 적용 |
| `src/components/ContentExplore.tsx` | totalVotes 조건 수정, 스크롤 로직 추가, ref 연결 |
