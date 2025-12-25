# 게이미피케이션 + 인사이트 시스템 구현 계획

> 버전: 1.0 | 작성일: 2024-12-25
> 상태: 진행 중 (Phase 0 일부 완료)

---

## 1. 현재 상태

### 1.1 완료된 작업

| 작업 | 파일 | 커밋 | 비고 |
|------|------|------|------|
| SSOT 원칙 적용 | `CLAUDE.md` | e1204d2 | 문서화 |
| 포인트 중앙화 | `src/data/gamification/points.ts` | e1204d2 | POINTS, STREAK_BONUS, INSIGHT_UNLOCK |
| GamificationService 리팩토링 | `src/services/GamificationService.ts` | e1204d2 | 10개 하드코딩 → POINTS 상수 |
| 해금 조건 구조화 | `src/app/dashboard/data/insight-system.ts` | e1204d2 | UnlockCondition 인터페이스 |
| 이벤트 네이밍 문서화 | `src/services/AnalyticsService.ts` | e1204d2 | 주석 추가 |

### 1.2 기존 인프라

| 항목 | 상태 | 위치 |
|------|------|------|
| 게이미피케이션 서비스 | ✅ 운영 중 | `src/services/GamificationService.ts` |
| 배지 시스템 | ✅ 정의됨 | `src/data/gamification/badges.ts` |
| 레벨 시스템 | ✅ 정의됨 | `src/data/gamification/levels.ts` |
| 인사이트 설계서 | ✅ 완료 | `docs/planning/INSIGHT_SYSTEM_MASTER.md` |
| 대시보드 UI | ✅ 기본 | `src/app/dashboard/components/InsightSystem.tsx` |

### 1.3 미완료 (AI 리뷰 피드백)

| 이슈 | 심각도 | 상태 | 해결 방안 |
|------|--------|------|----------|
| 이벤트 버스 없음 | High | ⏳ | UserActivityEvent 스키마 정의 |
| 멱등성 키 없음 | High | ⏳ | idempotencyKey 추가 |
| 해금 임계값 하드코딩 | Medium | ⏳ | DB 테이블 분리 (런타임 조정) |
| 하위 대체 보상 없음 | Medium | ⏳ | "진행 중" 게이지 + 작은 보상 |
| UI 밀도 과다 | Medium | ⏳ | 모바일 축소 뷰 |
| Stage 7 티저 없음 | Low | ⏳ | 블러 미리보기 + CTA |

---

## 2. 아키텍처 설계

### 2.1 이벤트 버스 구조

```
┌─────────────────────────────────────────────────────────────┐
│                     발생 소스                                │
│  [QuizComponent] [PollComponent] [TestComponent] [QAComponent]│
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  UserActivityService                         │
│  • 이벤트 정규화                                              │
│  • 멱등성 체크 (idempotencyKey)                              │
│  • 이벤트 발행 (EventBus)                                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐
│ GamificationSvc │ │ InsightSvc  │ │ AnalyticsSvc    │
│ • XP 계산       │ │ • 태그 집계  │ │ • 이벤트 로깅   │
│ • 배지 체크     │ │ • 해금 체크  │ │ • 지표 계산     │
│ • 레벨업       │ │ • 룰 매칭    │ │                 │
└─────────────────┘ └─────────────┘ └─────────────────┘
```

### 2.2 이벤트 스키마

```typescript
// src/types/events.ts (신규)

interface UserActivityEvent {
  // 식별자
  id: string;                    // UUID v4
  idempotencyKey: string;        // userId + activityType + contentId + timestamp(분 단위)
  traceId: string;               // 요청 추적용

  // 메타
  schemaVersion: '1.0';
  occurredAt: string;            // ISO 8601
  source: 'web' | 'app';

  // 주체
  userId: string;
  sessionId: string;

  // 활동
  activityType: ActivityType;
  payload: ActivityPayload;
}

type ActivityType =
  | 'test_complete'
  | 'quiz_solve'
  | 'poll_vote'
  | 'qa_answer'
  | 'qa_adopted'
  | 'post_write'
  | 'comment_write'
  | 'like_give'
  | 'like_receive'
  | 'daily_visit'
  | 'duel_complete';

interface ActivityPayload {
  contentId: string;
  contentType: 'test' | 'quiz' | 'poll' | 'qa' | 'post' | 'comment' | 'duel';
  category: string;              // 카테고리 (cat, dog, relationship 등)
  tags: string[];                // 인사이트용 태그

  // 활동별 추가 정보
  result?: 'correct' | 'wrong';  // 퀴즈
  score?: number;                // 점수
  testResult?: string;           // 테스트 결과명
  dimensions?: Record<string, number>;  // 차원별 점수
  won?: boolean;                 // 대결
}
```

### 2.3 보상 설정 (SSOT)

```typescript
// src/data/gamification/rewards.ts (신규)

export const ACTIVITY_REWARDS = {
  test_complete:  { xp: 20, insightPoints: 3 },
  quiz_solve:     { xp: 10, insightPoints: 1 },  // 정답 기준
  quiz_wrong:     { xp: 2,  insightPoints: 1 },  // 오답도 참여 보상
  poll_vote:      { xp: 5,  insightPoints: 1 },
  qa_answer:      { xp: 10, insightPoints: 2 },
  qa_adopted:     { xp: 50, insightPoints: 5 },
  post_write:     { xp: 5,  insightPoints: 1 },
  comment_write:  { xp: 2,  insightPoints: 0 },
  like_receive:   { xp: 5,  insightPoints: 0 },
  daily_visit:    { xp: 5,  insightPoints: 0 },
  duel_win:       { xp: 15, insightPoints: 2 },
  duel_lose:      { xp: 5,  insightPoints: 1 },
} as const;

// 카테고리별 가중치 (인사이트 집계용)
export const CATEGORY_WEIGHTS = {
  relationship: 1.5,  // 관계 활동은 Stage 5 해금에 가중치
  personality: 1.2,   // 성격 테스트 가중치
  default: 1.0,
} as const;
```

### 2.4 해금 조건 (런타임 조정 가능)

```typescript
// src/data/gamification/unlock-thresholds.ts (신규)

// 기본값 (하드코딩 폴백)
export const DEFAULT_UNLOCK_THRESHOLDS = {
  stage_1: { minTests: 1 },
  stage_2: { minTests: 3 },
  stage_3: { minPolls: 10 },
  stage_4: { minActivities: 15 },
  stage_5: { minRelationshipActivities: 10 },
  stage_6: { minActivities: 30 },
  stage_7: { stage6: true, paid: true },
} as const;

// DB에서 오버라이드 가능 (Turso)
// unlock_thresholds 테이블에서 로드하여 런타임 조정
```

---

## 3. 구현 로드맵

### Phase 0: 기반 정리 (완료 + 진행 중)

| 작업 | 상태 | 담당 |
|------|------|------|
| SSOT 원칙 적용 | ✅ 완료 | - |
| points.ts 생성 | ✅ 완료 | - |
| GamificationService 리팩토링 | ✅ 완료 | - |
| 이벤트 스키마 정의 | ⏳ 대기 | Week 1 |
| UserActivityService 구현 | ⏳ 대기 | Week 1 |

### Phase 1: 이벤트 버스 + 기반 서비스 (2주)

**Week 1: 이벤트 시스템**

```
[ ] src/types/events.ts - 이벤트 스키마 정의
[ ] src/services/EventBus.ts - 이벤트 발행/구독
[ ] src/services/UserActivityService.ts - 이벤트 정규화 + 멱등성
[ ] src/data/gamification/rewards.ts - 보상 설정 (SSOT)
```

**Week 2: 서비스 연동**

```
[ ] GamificationService 이벤트 구독 연동
[ ] InsightService 기본 구조
[ ] 태그 집계 로직 (localStorage 기반)
```

### Phase 2: 게이미피케이션 완성 (2주)

**Week 3: XP + 레벨**

```
[ ] XP 계산 로직 (ACTIVITY_REWARDS 기반)
[ ] 레벨업 알림 UI
[ ] 프로필 게이지 표시
```

**Week 4: 배지 + 등급**

```
[ ] 배지 획득 조건 체크 개선
[ ] 배지 알림 UI
[ ] 전문가 트랙 진행률 표시
```

### Phase 3: 인사이트 Stage 1-4 (2주)

**Week 5: Stage 1-2**

```
[ ] Stage 1: 기본 성향 (즉시 표시)
[ ] Stage 2: 성격 조합 (룰 15개)
[ ] 해금 유도 UI
```

**Week 6: Stage 3-4 + 태그**

```
[ ] 투표 태그 추가 (50개)
[ ] Stage 3: 판단 스타일
[ ] Stage 4: 관심사 지도
[ ] 진행률 게이지 UI
```

### Phase 4: 인사이트 Stage 5-6 (2주)

**Week 7: Stage 5**

```
[ ] 관계 태그 확장
[ ] Stage 5: 관계 패턴 (룰 10개)
[ ] Turso DB 마이그레이션
```

**Week 8: Stage 6 + 티저**

```
[ ] Stage 6: 숨은 패턴 (룰 10개)
[ ] 시간대 분석 로직
[ ] Stage 7 블러 미리보기 (티저)
```

### Phase 5: AI 분석 + 유료화 (1주)

**Week 9:**

```
[ ] AI 프롬프트 최적화
[ ] Stage 7: AI 종합 분석
[ ] 결제 연동 (선택)
[ ] 비용 모니터링
```

---

## 4. 주요 파일 구조 (예정)

```
src/
├── types/
│   └── events.ts           # 이벤트 스키마 (신규)
├── data/
│   └── gamification/
│       ├── points.ts       # 포인트 설정 (완료)
│       ├── rewards.ts      # 활동별 보상 (신규)
│       ├── unlock-thresholds.ts  # 해금 조건 (신규)
│       ├── badges.ts       # 배지 정의 (기존)
│       └── levels.ts       # 레벨 정의 (기존)
├── services/
│   ├── EventBus.ts         # 이벤트 버스 (신규)
│   ├── UserActivityService.ts  # 활동 이벤트 (신규)
│   ├── GamificationService.ts  # 게이미피케이션 (수정 완료)
│   ├── InsightService.ts   # 인사이트 (신규)
│   └── AnalyticsService.ts # 분석 (기존)
└── components/
    ├── insights/           # 인사이트 UI (신규)
    │   ├── InsightCard.tsx
    │   ├── UnlockProgress.tsx
    │   └── StageTeaser.tsx
    └── gamification/       # 게이미피케이션 UI (신규)
        ├── LevelBadge.tsx
        ├── XPProgress.tsx
        └── BadgeNotification.tsx
```

---

## 5. DB 스키마 (Turso)

```sql
-- 1. 해금 임계값 (런타임 조정용)
CREATE TABLE unlock_thresholds (
  stage TEXT PRIMARY KEY,
  thresholds JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 이벤트 로그 (멱등성 체크 + 분석용)
CREATE TABLE user_activity_events (
  id TEXT PRIMARY KEY,
  idempotency_key TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  payload JSON NOT NULL,
  occurred_at TIMESTAMP NOT NULL,
  processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_activity (user_id, activity_type),
  INDEX idx_idempotency (idempotency_key)
);

-- 3. 인사이트 룰
CREATE TABLE insight_rules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  priority INTEGER DEFAULT 50,
  conditions JSON NOT NULL,
  insight JSON NOT NULL,
  confidence TEXT CHECK(confidence IN ('high', 'medium', 'low')),
  category TEXT NOT NULL,
  active INTEGER DEFAULT 1,
  version INTEGER DEFAULT 1
);

-- 4. 사용자 인사이트 캐시
CREATE TABLE user_insights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  insight_type TEXT NOT NULL,
  insight_data JSON NOT NULL,
  matched_rules JSON,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  UNIQUE(user_id, insight_type)
);
```

---

## 6. 성공 지표

### 6.1 게이미피케이션

| 지표 | 목표 | 측정 |
|------|------|------|
| 일일 활동 수 | +20% | 이벤트 집계 |
| 7일 리텐션 | +15% | 재방문률 |
| 배지 획득률 | 50%+ | 1개 이상 획득 사용자 |

### 6.2 인사이트

| 지표 | 목표 | 측정 |
|------|------|------|
| 인사이트 페이지 진입 | 30%+ | 메인 대비 |
| Stage 6 해금률 | 15%+ | 30개 활동 달성 |
| AI 분석 전환률 | 5%+ | 유료 |

---

## 7. 리스크 및 대응

| 리스크 | 영향 | 대응 |
|--------|------|------|
| 이벤트 중복 처리 | 포인트 오류 | idempotencyKey로 방지 |
| 해금 조건 동시 이탈 | 리텐션 하락 | 하위 대체 보상 + 게이지 |
| AI 비용 폭발 | 예산 초과 | 캐싱 + 일일 한도 |
| 룰 엔진 복잡도 | 유지보수 어려움 | 룰 버전 관리 + 우선순위 |

---

## 8. 체크리스트

### Phase 0 완료 조건
- [x] SSOT 원칙 문서화
- [x] points.ts 생성
- [x] GamificationService 하드코딩 제거
- [x] UnlockCondition 구조체
- [ ] 이벤트 스키마 정의 (다음)
- [ ] rewards.ts 생성 (다음)

### Phase 1 완료 조건
- [ ] EventBus 구현
- [ ] UserActivityService 구현
- [ ] 멱등성 테스트 통과
- [ ] GamificationService 이벤트 연동
- [ ] InsightService 기본 구조

---

## 9. 참고 문서

| 문서 | 설명 |
|------|------|
| [INSIGHT_SYSTEM_MASTER.md](./INSIGHT_SYSTEM_MASTER.md) | 7단계 인사이트 상세 설계 |
| [EXTENSION_ARCHITECTURE.md](./EXTENSION_ARCHITECTURE.md) | Supabase 스키마/인사이트 설계 |
| [src/data/gamification/points.ts](../../src/data/gamification/points.ts) | 포인트 설정 (SSOT) |
| [src/app/dashboard/data/insight-system.ts](../../src/app/dashboard/data/insight-system.ts) | 해금 조건/태그 정의 |

---

*마지막 업데이트: 2024-12-25*
