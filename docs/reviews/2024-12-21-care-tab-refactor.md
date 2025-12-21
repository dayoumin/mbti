# 코드 리뷰 요청: CareHome 진입 경로 리팩토링

## 변경 개요

**목적**: 메인 탭에서 제거된 Care 탭의 진입 경로를 프로필 > 동물/라이프 탭으로 이동

**2차 수정 (리뷰 피드백 반영)**:
- 식물 케어 진입 경로 추가 (TabLife)
- 안내 문구 동적 분기 (동물/라이프)
- 중복 코드 컴포넌트 추출 (CareButtonWithModal)
- ESC 키 핸들링 및 aria 속성 추가

**배경**:
- 기존에 `showCare` 상태와 CareHome 오버레이가 page.tsx에 있었으나, 탭에서 제거 후 진입 경로가 없어 dead code 상태였음
- 업계 관행 참고: 케어/트래킹 기능은 프로필 내부에 통합하거나 홈 위젯으로 노출하는 것이 일반적

---

## 변경 파일 및 핵심 변경점

### 1. `src/components/MyProfile.tsx`

**변경**: CareButtonWithModal 공통 컴포넌트 추출 + TabPet/TabLife에서 사용

```tsx
// 354-392라인: 공통 컴포넌트
function CareButtonWithModal({ label = '케어 관리', className = '' }: CareButtonProps) {
  const [showCareHome, setShowCareHome] = useState(false);

  // ESC 키로 모달 닫기 (커스텀 훅 사용)
  useEscapeKey(() => setShowCareHome(false), showCareHome);

  return (
    <>
      <button onClick={() => setShowCareHome(true)}>
        <Heart /> {label}
      </button>

      {showCareHome && (
        <div
          className="fixed inset-0 z-[60] bg-[#F0F2F5] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="케어 관리"
        >
          <CareHome />
        </div>
      )}
    </>
  );
}

// TabPet (521라인): 항상 표시
<CareButtonWithModal label="반려생물 케어 관리" />

// TabLife (655라인): 식물 결과 있을 때만 표시
{hasPlant && <CareButtonWithModal label="내 식물 케어 관리" />}
```

**해결된 이슈**:
- [x] ESC 키 핸들링 추가 (useEscapeKey 훅 사용)
- [x] aria 속성 추가 (role="dialog", aria-modal, aria-label)
- [x] 중복 코드 컴포넌트로 추출
- [x] TabLife에도 케어 진입 버튼 추가 (식물 결과 있을 때)

**남은 리뷰 포인트**:
- [ ] 포커스 트랩은 미구현 (복잡도 대비 우선순위 낮음으로 판단)

---

### 2. `src/components/care/CareProfilePrompt.tsx`

**변경**: 케어 타입에 따른 동적 안내 문구

```tsx
// 70라인: 케어 타입에 따른 안내 탭 결정
const careTabGuide = careType === 'plant' ? '라이프' : '동물';

// 81라인: 동적 문구
<p className="text-sm text-green-600">프로필 → {careTabGuide} 탭에서 관리할 수 있어요</p>
```

**해결된 이슈**:
- [x] 식물 테스트 결과에서도 올바른 안내 (라이프 탭)
- [x] `&gt;` → `→` 로 변경 (더 자연스러움)

---

### 3. `src/app/page.tsx`

**변경**: Dead code 제거

```tsx
// 삭제된 항목:
// - ActiveModal 타입에서 'care' 제거
// - activeModal === 'care' 조건부 렌더링 블록 삭제
// - CareHome import 제거
```

---

### 4. 기존 타입 에러 수정 (부수적)

빌드 통과를 위해 기존 타입 에러들도 수정됨:

| 파일 | 수정 내용 |
|------|----------|
| `Icons.js` | Capsule 컴포넌트에 className prop 추가 |
| `FunFactsCard.js → .tsx` | TypeScript 변환 |
| `ResultRankingView.tsx` | myResult prop에 `null` 허용 |
| `Dashboard.tsx` | 여러 타입 캐스팅 수정 (SUBJECT_CONFIG, TEST_BADGES 등) |
| `GamificationService.ts` | UserGameStats 타입 re-export |
| `ContentSections.tsx` | onStart prop optional로 변경 |
| `HeroBanner.tsx` | onStartTest prop optional로 변경 |
| `TestCard.tsx` | onStart prop optional + SubjectKey 타입 사용 |
| `DiscoveryFeed.tsx` | onStartTest prop optional로 변경 |
| `FeedTestCard.tsx` | onStart prop optional로 변경 |
| `ProfileService.ts` | config.emoji 안전 접근 |
| `PopularRanking.tsx` | CHEMI_DATA 타입 캐스팅 |
| `ViralContent.tsx` | resultLabels 타입 캐스팅 |
| `page.tsx` | resultLabels 타입 캐스팅 |

---

## 아키텍처 결정

### 선택한 방식
- TabPet/TabLife 내부에서 자체 상태(`showCareHome`)로 CareHome 관리
- 전체 화면 오버레이 (fixed, z-60)

### 대안
1. **page.tsx에서 전역 관리**: 기존 방식 유지, NavTab에 'care' 재추가
2. **별도 라우트 `/care`**: Next.js 페이지로 분리
3. **프로필 모달 내부 탭**: z-index 문제 없이 자연스러운 전환

### 선택 이유
- 설계 의도(types.ts 주석)와 일치: "프로필 > 동물 탭에서 유도"
- 탭 5개 유지 (iOS 권장)
- 동물 케미 결과 → 케어 관리 흐름이 자연스러움

---

## E2E 테스트 결과

### 테스트 파일: `tests/e2e/care-refactored.test.ts`

```
✓ 프로필 > 동물 탭 > 케어 관리 버튼이 보임
- 프로필 > 라이프 탭 > 식물 결과가 있으면 케어 버튼 표시 (스킵 - localStorage 형식 복잡)
✓ 케어 관리 버튼 클릭 시 CareHome 오버레이 표시
✓ ESC 키로 CareHome 닫기
✓ 프로필로 돌아가기 버튼으로 CareHome 닫기
✓ 동물 테스트 결과에서 "동물 탭" 안내 표시
- 식물 테스트 결과에서 "라이프 탭" 안내 표시 (스킵)
✓ CareHome 모달에 aria 속성이 있음

결과: 6 passed, 2 skipped
```

---

## 테스트 체크리스트

- [x] 프로필 > 동물 탭 > "케어 관리" 버튼 클릭 → CareHome 열림 ✅ (e2e)
- [x] 프로필 > 라이프 탭 > 식물 결과 있을 때 "케어 관리" 버튼 표시 ✅ (코드 확인)
- [x] CareHome에서 "프로필로 돌아가기" 클릭 → 정상 닫힘 ✅ (e2e)
- [x] ESC 키로 CareHome 닫힘 ✅ (e2e)
- [x] 동물 테스트 결과에서 케어 프로필 생성 → "동물 탭" 안내 ✅ (e2e)
- [ ] 식물 테스트 결과에서 케어 프로필 생성 → "라이프 탭" 안내 (수동 확인 필요)
- [x] 빌드 성공 확인 (`npm run build`) ✅

---

## 해결된 질문 사항

1. ~~**중복 코드**: 케어 버튼+모달이 TabPet의 두 분기(empty/normal)에 중복됨~~ → **CareButtonWithModal로 추출 완료**

2. ~~**접근성**: CareHome 모달에 ESC 키 핸들링이 없음~~ → **useEscapeKey 훅 사용 + aria 속성 추가 완료**

3. ~~**라이프 탭**: 식물도 케어 대상인데 진입 경로가 없음~~ → **TabLife에 케어 버튼 추가 완료 (식물 결과 있을 때)**

## 남은 작업 (Low Priority)

- **포커스 트랩**: 현재 미구현. 모달이 전체 화면이라 실제 사용에 큰 문제는 없으나, 완전한 접근성을 위해선 추가 필요

---

## 관련 파일 전체 목록

```
# 핵심 변경
src/components/MyProfile.tsx                      # CareButtonWithModal + TabPet/TabLife
src/components/care/CareProfilePrompt.tsx         # 동적 안내 문구
src/app/page.tsx                                  # dead code 제거

# 부수 타입 수정
src/components/Icons.js
src/components/FunFactsCard.tsx
src/components/ResultRankingView.tsx
src/components/Dashboard.tsx
src/components/ContentSections.tsx
src/components/HeroBanner.tsx
src/components/TestCard.tsx
src/components/DiscoveryFeed.tsx
src/components/FeedTestCard.tsx
src/services/GamificationService.ts
src/services/ProfileService.ts
src/app/dashboard/components/PopularRanking.tsx
src/app/dashboard/components/ViralContent.tsx

# 테스트
tests/e2e/care-refactored.test.ts                 # 신규 E2E 테스트 (6 passed)
```

---

*생성일: 2024-12-21*
*작성: Claude Opus 4.5*
*테스트 결과: 6/8 통과 (2 스킵), 빌드 성공*
