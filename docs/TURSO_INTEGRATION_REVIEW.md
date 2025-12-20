# Turso DB 통합 - AI 리뷰 요청

## 1. 개요

### 목적
- 기존 localStorage 기반 데이터를 Turso (Edge SQLite) DB로 마이그레이션
- 투표, 퀴즈, 댓글, 좋아요 등 사용자 인터랙션 데이터 영구 저장
- 향후 게시판, 친구 시스템 등 확장 대비

### 기술 스택
- **DB**: Turso (libSQL 기반 Edge SQLite)
- **서버**: Next.js 16 API Routes
- **클라이언트**: TursoService (fetch로 API 호출)

---

## 2. 아키텍처

```
[브라우저]
    ↓ fetch
[TursoService.ts] ──→ [/api/poll, /api/quiz, ...] ──→ [Turso DB]
                           ↓ import
                      [lib/turso.ts]
```

### 왜 이 구조인가?
- `@libsql/client`는 Node.js 환경에서만 동작
- 브라우저에서 직접 DB 접근 불가 → API 라우트 필수
- TursoService는 API 호출 래퍼 역할

---

## 3. 파일 구조

```
src/
├── lib/
│   └── turso.ts              # 서버용 Turso 클라이언트
├── services/
│   └── TursoService.ts       # 브라우저용 API 호출 서비스
├── app/api/
│   ├── poll/route.ts         # 투표 저장/통계
│   ├── quiz/route.ts         # 퀴즈 저장/통계
│   ├── feedback/route.ts     # 피드백 저장/조회
│   ├── comments/route.ts     # 통합 댓글
│   └── likes/route.ts        # 좋아요 토글
└── components/
    └── content/
        ├── QuizWidget.tsx    # 퀴즈 UI (tursoService 사용)
        ├── PollWidget.tsx    # 투표 UI (tursoService 사용)
        └── ...

scripts/
├── setup-turso-schema.mjs    # 기본 테이블 생성
└── update-turso-schema.mjs   # 확장 테이블 생성 (댓글, 좋아요 등)
```

---

## 4. 데이터베이스 스키마

### 핵심 테이블

```sql
-- 사용자 프로필 (device_id 기반 익명 사용자)
user_profiles (
  id, device_id UNIQUE, user_id, nickname, avatar,
  badges, points, level, first_visit, last_visit,
  visit_count, created_at, updated_at
)

-- 투표 응답 (사용자당 투표당 1회)
poll_responses (
  id, device_id, poll_id, option_id, created_at,
  UNIQUE(device_id, poll_id)
)

-- 퀴즈 응답 (사용자당 문제당 1회)
quiz_responses (
  id, device_id, quiz_id, question_index,
  selected_option, is_correct, points, created_at,
  UNIQUE(device_id, quiz_id, question_index)
)

-- 피드백 (테스트 결과 정확도)
feedback (
  id, device_id, test_type, result_name,
  is_accurate, comment, created_at
)

-- 통합 댓글 (다형성 - target_type으로 구분)
comments (
  id, device_id, target_type, target_id,
  content, parent_id, likes, created_at, updated_at
)

-- 좋아요 (다형성)
likes (
  id, device_id, target_type, target_id, created_at,
  UNIQUE(device_id, target_type, target_id)
)
```

### target_type 값
- **comments**: `poll`, `quiz`, `test_result`, `ranking`
- **likes**: `comment`, `post`, `poll`, `quiz`

---

## 5. API 상세

### POST /api/poll
```typescript
// 요청
{ deviceId, pollId, optionId }

// 동작
INSERT ... ON CONFLICT(device_id, poll_id) DO NOTHING

// 응답
{ success: true }
```

### GET /api/poll?pollId=xxx
```typescript
// 응답
{
  pollId: "xxx",
  totalVotes: 150,
  options: [
    { optionId: "a", count: 80, percentage: 53 },
    { optionId: "b", count: 70, percentage: 47 }
  ]
}
```

### POST /api/comments
```typescript
// 요청
{ deviceId, targetType, targetId, content, parentId? }

// 응답
{ success: true, id: 123 }
```

### POST /api/likes (토글)
```typescript
// 요청
{ deviceId, targetType, targetId }

// 동작: 있으면 삭제, 없으면 추가

// 응답
{ success: true, action: "added"|"removed", liked: true|false }
```

---

## 6. 클라이언트 서비스 (TursoService)

```typescript
class TursoServiceClass {
  // 투표
  async savePollResponse(pollId, optionId): Promise<{ success }>
  async getPollStats(pollId): Promise<PollStats>

  // 퀴즈
  async saveQuizResponse(quizId, selectedOption, isCorrect, ...): Promise<{ success }>
  async getQuizStats(quizId): Promise<QuizStats>

  // 피드백
  async saveFeedback(testType, resultName, isAccurate, comment?): Promise<{ success }>
  async getFeedbackStats(testType): Promise<FeedbackStats>

  // 댓글
  async addComment(targetType, targetId, content, parentId?): Promise<{ success, id? }>
  async getTargetComments(targetType, targetId, limit?, offset?): Promise<CommentsResponse>
  isMyComment(comment): boolean

  // 좋아요
  async toggleLike(targetType, targetId): Promise<{ success, liked }>
  async getLikeInfo(targetType, targetId): Promise<{ count, liked }>
}

export const tursoService = new TursoServiceClass();
```

---

## 7. 컴포넌트 사용 예시

```typescript
// PollWidget.tsx
import { tursoService } from '@/services/TursoService';

const handleVote = async (choice: 'a' | 'b') => {
  setSelectedOption(choice);

  // Turso에 저장
  await tursoService.savePollResponse(poll.id, choice);

  // 통계 로드
  const stats = await tursoService.getPollStats(poll.id);
  setPollResults({
    a: stats.options.find(o => o.optionId === 'a')?.percentage || 50,
    b: stats.options.find(o => o.optionId === 'b')?.percentage || 50,
    total: stats.totalVotes,
  });
};
```

---

## 8. 리뷰 요청 사항

### 8.1 아키텍처
- [ ] API 라우트 구조가 적절한가?
- [ ] 서비스 레이어 분리가 명확한가?
- [ ] 에러 처리 전략이 일관적인가?

### 8.2 보안
- [ ] SQL 인젝션 방어 (파라미터 바인딩)
- [ ] 입력값 검증 충분한가?
- [ ] deviceId 기반 인증의 한계점?

### 8.3 스키마
- [ ] 테이블 정규화 수준 적절한가?
- [ ] 인덱스 설계 적절한가?
- [ ] 다형성 패턴 (target_type) 괜찮은가?

### 8.4 확장성
- [ ] 게시판, 친구 시스템 추가 시 스키마 변경 필요?
- [ ] 대용량 데이터 처리 대비?
- [ ] 나중에 Supabase로 마이그레이션 용이한가?

### 8.5 코드 품질
- [ ] TypeScript 타입 정의 충분한가?
- [ ] 중복 코드 있는가?
- [ ] 테스트 필요한 부분?

---

## 9. 알려진 이슈

### 해결됨
- ✅ quiz_responses 중복 저장 → UNIQUE 인덱스 + ON CONFLICT 추가
- ✅ 스키마 중복 (devices vs user_profiles) → user_profiles로 통합
- ✅ 좋아요 API 누락 → /api/likes 추가

### 미해결/개선 가능
- ⚠️ 댓글 좋아요 시 comments.likes 카운트 동기화 (트랜잭션 미사용)
- ⚠️ API Rate Limiting 없음
- ⚠️ deviceId 스푸핑 가능 (보안 취약점)

---

## 10. 테스트 결과

```bash
# 빌드
npm run build  # ✅ 성공

# API 라우트 등록
/api/poll      # ✅
/api/quiz      # ✅
/api/feedback  # ✅
/api/comments  # ✅
/api/likes     # ✅

# DB 연결 테스트
poll 저장/조회      # ✅
quiz 저장/조회      # ✅
comment 저장/조회   # ✅
like 토글          # ✅
```

---

## 11. 관련 파일 전체 목록

```
# 서버
src/lib/turso.ts
src/app/api/poll/route.ts
src/app/api/quiz/route.ts
src/app/api/feedback/route.ts
src/app/api/comments/route.ts
src/app/api/likes/route.ts

# 클라이언트
src/services/TursoService.ts
src/components/content/QuizWidget.tsx
src/components/content/PollWidget.tsx
src/components/content/ContentWidgetContainer.tsx

# 스키마
scripts/setup-turso-schema.mjs
scripts/update-turso-schema.mjs

# 환경설정
.env.local (TURSO_DATABASE_URL, TURSO_AUTH_TOKEN)
```
