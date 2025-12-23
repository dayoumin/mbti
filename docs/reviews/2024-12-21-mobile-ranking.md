# 코드 리뷰 요청: 모바일 랭킹 UI 추가

## 변경 개요
모바일 화면에 사용자의 테스트 결과 랭킹을 표시하는 기능 추가

## 변경 파일

### 1. src/components/Dashboard.tsx

**변경 1: import 정리**
- import 순서 정리 (React → Lucide → Data/Config → Services → Components)
- 미사용 import 제거 (`MAIN_TEST_KEYS`, `UserGameStats`)
- 타입 정의를 import 아래 별도 섹션으로 분리

**변경 2: 모바일 섹션에 MyRankingMini 추가**
```tsx
{/* 모바일/태블릿: 디스커버리 피드 */}
<div className="lg:hidden">
    <TodayRankingPreview
        onClick={() => setRankingModalState({ isOpen: true, defaultTab: 'polls' })}
    />
    <MyRankingMini
        onOpenRanking={() => setRankingModalState({ isOpen: true, defaultTab: 'results' })}
    />
</div>
```

**변경 3: 랭킹 모달 상태 개선**
```tsx
// 기존: boolean 상태
const [showRankingModal, setShowRankingModal] = useState(false);

// 변경: defaultTab 포함
const [rankingModalState, setRankingModalState] = useState<{
    isOpen: boolean;
    defaultTab: 'polls' | 'results';
}>({ isOpen: false, defaultTab: 'polls' });
```

### 2. src/components/TodayRankingModal.tsx

**변경: defaultTab prop 추가**
```tsx
interface TodayRankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'polls' | 'results';  // 추가
}

// 모달이 열릴 때 defaultTab으로 초기화
useEffect(() => {
  if (isOpen) {
    setActiveTab(defaultTab);
  }
}, [isOpen, defaultTab]);
```

### 3. src/components/Sidebar.tsx (별도 변경)

**변경: 추천 테스트 정렬을 실제 API 데이터 기반으로 개선**
- 기존: `demographicService.getRecommendedCategories()` 기반 정적 우선순위
- 변경: `/api/ranking?type=popular-tests` API 호출로 실제 인기순 반영
- 폴백: API 실패 시 `POPULAR_TESTS` 사용

---

## 수정 완료 사항

| 항목 | 상태 |
|------|------|
| import 순서 정리 | ✅ |
| 미사용 import 제거 | ✅ |
| MyRankingMini → results 탭으로 열기 | ✅ |
| TodayRankingPreview → polls 탭으로 열기 | ✅ |

---

## 리뷰 포인트

### 1. UX 관점
- [ ] TodayRankingPreview(투표 랭킹)와 MyRankingMini(내 결과 순위)가 연속 배치됨. 시각적 구분 충분한가?
- [ ] 결과가 없는 사용자는 MyRankingMini가 표시되지 않음 (null 반환). 빈 상태 안내 필요한가?

### 2. 성능 관점
- [ ] Sidebar.tsx에서 컴포넌트 마운트마다 `/api/ranking` 호출. 캐싱 필요한가?
- [ ] MyRankingMini는 내부에서 `resultService.getMyResults()` 호출. Dashboard와 Sidebar 양쪽에서 중복 호출 가능

### 3. 코드 관점
- [ ] TodayRankingModal의 useEffect 두 개가 `isOpen`을 의존성으로 가짐. 순서 의존성 확인 필요

---

## 관련 컴포넌트 참조

| 컴포넌트 | 역할 | 위치 |
|---------|------|------|
| `MyRankingMini` | 내 테스트 결과의 카테고리별 순위 표시 | 사이드바(PC), 대시보드(모바일) |
| `TodayRankingPreview` | 오늘의 투표 랭킹 미니 프리뷰 | 대시보드(모바일) |
| `TodayRankingModal` | 투표+결과 랭킹 상세 모달 (탭 전환) | 대시보드 |
| `RankingTab` | 테스트 결과 랭킹 전체 뷰 (page.tsx용) | page.tsx에서 모달로 사용 |

---

## 빌드 상태
✅ `npm run build` 성공
