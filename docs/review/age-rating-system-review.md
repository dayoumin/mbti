# 연령 등급 시스템 AI 리뷰 요청

## 1. 변경 개요

### 배경
- 퀴즈/투표 콘텐츠에 연령 제한 기능 필요 (술, 도박 관련)
- 기존 키워드 기반 검증 → 오탐(false positive) 문제 발생
  - 예: "술래잡기", "와인딩 로드", "칵테일 드레스"가 성인 콘텐츠로 오분류

### 해결책
- **AI 기반 2단계 검증**으로 전환
  1. 스크립트: 형식만 검증 (meta 필드 존재 여부)
  2. AI: 맥락 기반 성인 콘텐츠 체크

---

## 2. 연령 등급 체계

### 등급 종류
| 등급 | 대상 | 동작 |
|------|------|------|
| `kids` | 10대 친화 | 10대 사용자에게 30% 추천 점수 부스트 |
| `all` (기본) | 전체 연령 | 모두에게 표시 (meta 없으면 기본값) |
| `adult` | 성인 전용 | 10대 및 연령 미확인 사용자 차단 |

### 메타 필드 형식
```typescript
// 성인용
meta: { ageRating: 'adult', ageRestrictionReason: 'alcohol' | 'gambling' | 'sexual' }

// 10대 친화
meta: { ageRating: 'kids' }

// 일반 (생략 가능)
// meta 없으면 기본 'all'
```

### 레거시 호환
```typescript
// 이전 형식도 지원
meta: { isAdultOnly: true }      // adult와 동일
meta: { minAge: '20s' }          // 20대 이상만
```

---

## 3. 주요 코드 변경

### 3.1 TodayQuizPoll.tsx - 연령 변경 감지
```typescript
// 문제: 사용자가 연령 설정 변경해도 UI가 업데이트되지 않음
// 해결: 프로필 업데이트 이벤트 리스너 추가

const [ageVersion, setAgeVersion] = useState(0);

useEffect(() => {
  const handleProfileUpdate = () => {
    setAgeVersion(v => v + 1);
    userPreferenceService.reload();
  };
  window.addEventListener('chemi:profileUpdated', handleProfileUpdate);
  return () => window.removeEventListener('chemi:profileUpdated', handleProfileUpdate);
}, []);

// useMemo 의존성에 ageVersion 추가
const filteredQuizCount = useMemo(() => ..., [participation.quizzes.length, ageVersion]);
const todayQuizzes = useMemo(() => ..., [answeredQuizIds, timeSlotSeed, ageVersion]);
```

### 3.2 validate-content-samples.mjs - 키워드 검증 제거
```javascript
// 변경 전: 키워드로 성인 콘텐츠 감지
const adultKeywords = ['술', '음주', '도박', ...];

// 변경 후: 형식만 검증 (키워드 감지 제거)
// 연령 등급은 AI가 생성 시점에 판단하여 meta에 추가
```

### 3.3 SKILL 문서 업데이트
- **content-generator**: 생성 시 연령 등급 판단 가이드 추가
- **content-validator**: AI 검증 규칙 추가

---

## 4. 판정 원칙 (중요!)

### 핵심 원칙: 보수적 판정
```
애매하면 → all (10대 허용)
명백한 경우에만 → adult
```

**이유**:
- 10대 사용자가 많은 콘텐츠를 못 보면 안 됨
- 바이럴 잘 되는 콘텐츠가 차단되면 안 됨
- 과도한 필터링 = 사용자 경험 저하

### 명백한 adult (이것만 차단)
| 유형 | 예시 | 판정 |
|------|------|------|
| **성적 콘텐츠** | 부부 잠자리, 성인 연애 상황 | adult |
| **직접적 음주** | 술 마시기, 취함, 숙취, 술자리 | adult |
| **실제 도박** | 베팅, 판돈, 돈 거는 행위 | adult |

### all로 유지 (대부분의 콘텐츠)
| 유형 | 예시 | 이유 |
|------|------|------|
| 언어적 유사 | 술래잡기, 와인딩, 칵테일 드레스 | 놀이/도로/패션 |
| 음식/미용 | 막걸리 빵, 맥주효모 샴푸 | 음주 아님 |
| 색상/비유 | 와인색, 맥주 거품 같은 | 표현일 뿐 |
| 관용구 | 포커 페이스 | 도박 아님 |
| 장소/가정 | 경마장 맛집, 로또 당첨되면 | 행위 없음 |
| **회식 일반** | 회식 참석, 회식 메뉴 | 음주 언급 없음 |

### 그레이존 → all 유지
| 텍스트 | 판정 | 이유 |
|--------|------|------|
| 와인 추천해줘 | all | 마시는 맥락 불분명 |
| 맥주 맛있어? | all | 직접 음주 아님 |
| 소주 vs 맥주 취향 | **all** | 바이럴 잘 됨, 가벼운 질문 |

**예외**: 명백히 음주 행위면 adult
- "와인 한잔 하면서" → adult (마시는 중)
- "숙취 해소법" → adult (음주 후 상태)

---

## 5. 검증 방식 명확화

### 실제 운영 (AI 맥락 판단)
```
콘텐츠 생성 요청
    ↓
AI가 전체 텍스트를 읽고 맥락 이해
    ↓
"회식에서 술을 권한다" → 음주 맥락 → meta: { ageRating: 'adult' } 추가
"칵테일 드레스 추천" → 패션 맥락 → meta 불필요 (all)
    ↓
검증 시에도 AI가 맥락 읽고 누락된 meta 지적
```

**핵심**: 패턴 매칭이 아닌 **AI의 맥락 이해**에 의존

### 테스트 스크립트 (시뮬레이션)
`test-age-rating.mjs`의 패턴은 **AI 판단을 자동 테스트**하기 위한 시뮬레이션:
- 프로덕션에서 패턴 매칭 실행 X
- AI가 올바르게 판단하는지 검증용
- Edge case 문서화 목적

### 테스트 결과: 52개 통과
- 연령 필터링: 15개
- 맥락 분류: 37개 (성인용 18, 오탐방지 16, 복합 3)

---

## 6. 리뷰 요청 사항

### 6.1 로직 검토
- [ ] 오탐 방지 규칙이 충분한가?
- [ ] 성인용 판정 기준이 적절한가?
- [ ] 누락된 케이스가 있는가?

### 6.2 엣지 케이스 추가 제안
- 현재 테스트에 없는 경계 사례 제안 환영

### 6.3 구현 검토
- [ ] 이벤트 기반 연령 변경 감지 방식 적절한가?
- [ ] useMemo 의존성 관리 정확한가?

---

## 7. 관련 파일

| 파일 | 역할 |
|------|------|
| [TodayQuizPoll.tsx](../../src/components/TodayQuizPoll.tsx) | 연령 제한 UI |
| [validate-content-samples.mjs](../../scripts/validate-content-samples.mjs) | 형식 검증 |
| [test-age-rating.mjs](../../scripts/test-age-rating.mjs) | 테스트 스크립트 |
| [content-generator SKILL.md](../../.claude/skills/content-generator/SKILL.md) | 생성 가이드 |
| [content-validator SKILL.md](../../.claude/skills/content-validator/SKILL.md) | 검증 가이드 |

---

## 8. 후속 작업

- [ ] 실제 콘텐츠에 meta 필드 적용
- [ ] UserPreferenceService에 연령 기반 추천 가중치 적용
- [ ] 대시보드에 연령 통계 추가
