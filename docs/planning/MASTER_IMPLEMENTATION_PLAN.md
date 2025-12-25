# 마스터 구현 계획

> 버전: 1.0 | 작성일: 2024-12-25
> 상태: 활성 (병렬 진행 중)

---

## 1. 프로젝트 현황

### 1.1 운영 중인 시스템

| 시스템 | 상태 | 파일 |
|--------|------|------|
| 테스트 엔진 | ✅ 운영 | `src/data/subjects/*.ts` |
| 퀴즈/투표 | ✅ 운영 | `src/data/content/**/*.ts` |
| 게이미피케이션 | ✅ 운영 | `src/services/GamificationService.ts` |
| 결과 저장 | ✅ 운영 | `src/services/ResultService.ts` |
| 대시보드 | ✅ 운영 | `src/app/dashboard/` |

### 1.2 콘텐츠 현황

| 타입 | 수량 | 상태 |
|------|------|------|
| 테스트 | 12개 | ✅ 충분 |
| 퀴즈 | ~250개 | ⚠️ 확충 중 |
| 투표 | ~150개 | ⚠️ 확충 중 |
| 상황반응 | ~30개 | ⚠️ 확충 필요 |

### 1.3 미완료 시스템

| 시스템 | 상태 | 문서 |
|--------|------|------|
| 인사이트 엔진 | 📋 설계 완료 | `INSIGHT_SYSTEM_MASTER.md` |
| 이벤트 버스 | 📋 설계 완료 | `GAMIFICATION_INSIGHT_IMPLEMENTATION.md` |
| 태그 시스템 | ⏳ 일부 구현 | 콘텐츠에 태그 추가 필요 |

---

## 2. 병렬 작업 트랙

### Track A: 콘텐츠 확충 (진행 중)

**목표**: 인사이트 분석에 충분한 데이터 확보

| 카테고리 | 현재 | 목표 | 우선순위 |
|----------|------|------|----------|
| 퀴즈 | ~250개 | 500개 | High |
| 투표 | ~150개 | 300개 | High |
| 상황반응 | ~30개 | 100개 | Medium |

**작업 규칙**:
- 새 콘텐츠에 태그 필수 포함
- `research/facts/` 리서치 기반 생성
- 빌드 검증 필수

**충돌 영역**: 없음 (독립 폴더)

---

### Track B: UI 개발 (진행 중)

**목표**: 사용자 경험 완성

| 컴포넌트 | 상태 | 우선순위 |
|----------|------|----------|
| 테스트 UI | ✅ 완료 | - |
| 퀴즈 UI | ✅ 완료 | - |
| 투표 UI | ✅ 완료 | - |
| 결과 공유 | ⏳ 개선 중 | High |
| 인사이트 UI | ⏳ 대기 | Medium |

**충돌 영역**: `src/components/` (독립 파일)

---

### Track C: 시스템 개발 (대기)

**목표**: 게이미피케이션 + 인사이트 완성

#### Phase 0: 기반 정리 ✅ 완료

| 작업 | 상태 | 커밋 |
|------|------|------|
| SSOT 원칙 적용 | ✅ | e1204d2 |
| points.ts 생성 | ✅ | e1204d2 |
| GamificationService 리팩토링 | ✅ | e1204d2 |
| UnlockCondition 구조체 | ✅ | e1204d2 |

#### Phase 1: 이벤트 버스 ✅ 완료

| 작업 | 상태 | 커밋 |
|------|------|------|
| src/types/events.ts - 이벤트 스키마 | ✅ | 93358fb |
| src/services/EventBus.ts - 이벤트 발행/구독 | ✅ | 93358fb |
| src/services/UserActivityService.ts - 활동 이벤트 | ✅ | 93358fb |
| src/data/gamification/rewards.ts - 보상 설정 (SSOT) | ✅ | 93358fb |

**충돌 영역**: 없음 (신규 파일)

#### Phase 2: 인사이트 Stage 1-2 ✅ 완료

| 작업 | 상태 | 커밋 |
|------|------|------|
| test-tag-mappings.ts - 태그 매핑 시스템 | ✅ | 8234045 |
| InsightService.ts - 인사이트 분석 서비스 | ✅ | 79c936d |
| stage2-rules.ts - 성격 조합 룰 15개 | ✅ | 5ca34f9 |
| 테스트 243개 통과 | ✅ | - |

**테스트 현황**:
- event-bus-test: 65 통과
- tag-mapping-test: 38 통과
- insight-service-test: 43 통과
- stage2-rules-test: 97 통과

#### Phase 2 계속: Stage 3-4 (진행 예정)

```
[ ] 투표 태그 추가 (인사이트용)
[ ] Stage 3: 판단 스타일 룰
[ ] Stage 4: 관심사 지도 룰
[ ] 인사이트 UI 컴포넌트
```

**충돌 영역**: 콘텐츠 파일에 태그 추가 시 주의

#### Phase 3: 인사이트 Stage 5-7 (Week 7-9)

```
[ ] Stage 5: 관계 패턴
[ ] Stage 6: 숨은 패턴
[ ] Stage 7: AI 종합 분석 (유료)
```

**충돌 영역**: 없음

---

## 3. 충돌 방지 규칙

### 3.1 폴더별 담당

| 폴더 | Track A | Track B | Track C |
|------|---------|---------|---------|
| `src/data/content/` | ✅ 담당 | - | 태그만 |
| `src/data/subjects/` | ✅ 담당 | - | 태그만 |
| `src/components/` | - | ✅ 담당 | 인사이트 UI |
| `src/services/` | - | - | ✅ 담당 |
| `src/types/` | - | - | ✅ 담당 |

### 3.2 공유 파일 수정 시

| 파일 | 수정 전 확인 |
|------|-------------|
| `src/data/content/types.ts` | 타입 추가만, 기존 수정 금지 |
| `src/data/config.ts` | 키 추가만, 기존 수정 금지 |
| `src/data/gamification/points.ts` | SSOT, Track C만 수정 |

---

## 4. 콘텐츠 생성 가이드

### 4.1 퀴즈 생성

```typescript
// 필수 구조
{
  id: 'category-k-001',
  category: 'category',
  question: '질문?',
  options: [
    { id: 'a', text: '선택지', isCorrect: boolean },
    // ...
  ],
  explanation: '해설',
  difficulty: 1 | 2 | 3,
  tags: ['category', '관련태그'],
  source: 'fact-id',  // research/facts 참조
  meta: {
    ageRating: 'all' | 'adult',
    // adult인 경우 ageRestrictionReason 필수
  }
}
```

### 4.2 투표 생성

```typescript
// 필수 구조 (인사이트 태그 포함)
{
  id: 'vs-category-001',
  category: 'category',
  question: 'A vs B?',
  optionA: {
    id: 'a',
    text: 'A',
    emoji: '...',
    tags: { decision: ['practical'], personality: ['planned'] }
  },
  optionB: {
    id: 'b',
    text: 'B',
    emoji: '...',
    tags: { decision: ['emotional'], personality: ['spontaneous'] }
  },
  tags: ['category', '관련태그']
}
```

### 4.3 태그 참조

> 태그 정의: `src/app/dashboard/data/insight-system.ts`

| 태그 유형 | 용도 |
|----------|------|
| PERSONALITY_TAGS | 성격 분류 |
| DECISION_TAGS | 판단 스타일 분석 |
| RELATIONSHIP_TAGS | 관계 패턴 분석 |

---

## 5. 검증 체크리스트

### 콘텐츠 추가 시

```bash
# 1. 빌드 검증
npm run build

# 2. 콘텐츠 검증 (자동 실행됨)
# prebuild에서 validate-content-files.mjs 실행

# 3. 커밋
git add . && git commit -m "feat(content): ..."
```

### 시스템 수정 시

```bash
# 1. 빌드 검증
npm run build

# 2. 타입 체크
npx tsc --noEmit

# 3. 관련 테스트 (있는 경우)
node scripts/test-*.mjs

# 4. 커밋
git add . && git commit -m "feat/fix/refactor: ..."
```

---

## 6. 관련 문서 맵

```
docs/planning/
├── MASTER_IMPLEMENTATION_PLAN.md    ← 현재 문서 (마스터)
│
├── 인사이트 시스템
│   ├── INSIGHT_SYSTEM_MASTER.md     - 7단계 인사이트 상세 설계
│   ├── INSIGHT_UNLOCK_SYSTEM.md     - 해금 시스템 상세
│   └── INSIGHT_ENGINE_DESIGN.md     - 룰 엔진 설계
│
├── 게이미피케이션
│   └── GAMIFICATION_INSIGHT_IMPLEMENTATION.md - 구현 계획
│
├── 리텐션
│   └── RETENTION_LOOP_PLAN.md       - 재방문 전략
│
└── 아키텍처
    └── EXTENSION_ARCHITECTURE.md    - DB 스키마/Supabase
```

---

## 7. 우선순위 결정 기준

### 지금 해야 할 것

1. **콘텐츠 확충** - 인사이트 분석에 데이터 필요
2. **태그 추가** - 새 콘텐츠에 태그 필수
3. **UI 개선** - 결과 공유 등

### 나중에 해도 되는 것

1. **이벤트 버스** - 콘텐츠 충분해지면
2. **인사이트 Stage 5-7** - 복잡한 분석
3. **AI 분석** - 유료화 시점에

### 병렬 진행 가능

- Track A (콘텐츠) + Track B (UI) → 충돌 없음
- Track A + Track C (시스템) → Phase 2 태그 작업 시 주의

---

## 8. 다음 액션

### 즉시

1. wine-knowledge.ts 커밋 (미완료)
2. 콘텐츠 작업 계속

### Track C 시작 시

1. `src/types/events.ts` 생성
2. `src/data/gamification/rewards.ts` 생성
3. EventBus 구현

---

*마지막 업데이트: 2024-12-25*
