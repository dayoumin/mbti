# Poll API & OG 이미지 코드 리뷰

## 작업 개요

**작업일**: 2024-12-24
**작업 내용**: Choice Poll(다중 선택 투표) API 확장 및 OG 이미지 추가
**관련 기능**: 투표, 통계, 공유, 댓글/대댓글

## 리뷰 후 수정 사항 (2차 리뷰 반영)

| 이슈 | 심각도 | 수정 내용 |
|-----|--------|----------|
| optionId 검증 클라이언트 의존 | 중간 | pollId prefix로 타입 자동 추론 (`choice-*` = Choice) |
| remainingPercent 음수 → 101% 가능 | 중간 | Largest Remainder Method 적용 (합계 정확히 100%) |
| OG decodeURIComponent 이중 적용 | 낮음 | 불필요한 디코딩 제거 |

### 검증 결과
```
node scripts/test-poll-api.mjs

[테스트 1] optionId 검증: 9/9 통과
[테스트 2] Choice 퍼센트 계산: 5/5 통과
[테스트 3] VS 퍼센트 계산: 4/4 통과
[테스트 4] 복수 선택 (allowMultiple): 6/6 통과
```

---

## 3차 업데이트: 복수 선택 (allowMultiple) 지원

### 변경 사항

| 항목 | 내용 |
|-----|------|
| DB 스키마 | `UNIQUE(device_id, poll_id)` → `UNIQUE(device_id, poll_id, option_id)` |
| POST 요청 | `optionIds` 배열 + `allowMultiple` 플래그 지원 |
| GET 응답 | `userVotes` 배열 반환 (하위 호환: `userVote` 유지) |

### API 변경

**POST /api/poll - 복수 선택 투표**
```json
{
  "deviceId": "xxx",
  "pollId": "choice-multi-001",
  "optionIds": ["a", "c", "e"],
  "allowMultiple": true
}
```

**GET /api/poll - 복수 선택 조회**
```json
{
  "pollId": "choice-multi-001",
  "pollType": "choice",
  "totalVotes": 100,
  "options": [...],
  "userVotes": ["a", "c", "e"],
  "userVote": "a"
}
```

### 동작 방식

| 조건 | 동작 |
|-----|------|
| `allowMultiple=false` (기본) | 기존 투표 있으면 거부 |
| `allowMultiple=true` | 여러 옵션 저장 가능, 같은 옵션만 중복 방지 |
| DB 제약 | `ON CONFLICT (device_id, poll_id, option_id) DO NOTHING` |

### 마이그레이션

```sql
-- scripts/migrations/002_allow_multiple_votes.sql
CREATE TABLE poll_responses_new (
  ...
  UNIQUE(device_id, poll_id, option_id)  -- 기존: UNIQUE(device_id, poll_id)
);
```

---

## 수정 파일 목록

| 파일 | 변경 내용 |
|-----|----------|
| `src/app/api/poll/route.ts` | Choice Poll 통계, 복수 선택, 버그 수정 |
| `src/app/api/og/route.tsx` | Choice Poll OG 이미지 렌더러 추가 |
| `src/data/content/types.ts` | ChoicePoll에 `allowMultiple` 필드 추가 |
| `scripts/migrations/002_allow_multiple_votes.sql` | DB 스키마 변경 |
| `scripts/test-poll-api.mjs` | 복수 선택 테스트 케이스 추가 |

---

## 1. Poll API 리뷰 (`src/app/api/poll/route.ts`)

### 1.1 API 엔드포인트 구조

```
POST /api/poll
├── action=create: 사용자 투표 생성 (VS만)
└── (기본): 투표 응답 저장

GET /api/poll
├── action=popular: 인기 투표 목록
├── action=my-polls: 본인 생성 투표 목록
├── pollId + type=vs (기본): VS 투표 통계
└── pollId + type=choice: Choice 투표 통계
```

### 1.2 핵심 로직 분석

#### VS Poll 통계 (line 300-332)
```typescript
// 퍼센트 계산: 반올림 오류 방지
const aPercent = totalVotes > 0 ? Math.round((aCount / totalVotes) * 100) : 50;
const bPercent = totalVotes > 0 ? 100 - aPercent : 50;
```
- **장점**: 합계 100% 보장
- **투표 없을 때**: 50:50 기본값 (적절함)

#### Choice Poll 통계 (line 254-297)
```typescript
// 옵션 개수 파라미터 (기본 5개)
const optionCount = parseInt(request.nextUrl.searchParams.get('optionCount') || '5');
const allOptionIds = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].slice(0, optionCount);

// 퍼센트 계산 (반올림 오차 보정)
let remainingPercent = 100;
const options = allOptionIds.map((optionId, idx) => {
  if (idx === allOptionIds.length - 1) {
    percentage = Math.max(0, remainingPercent);  // 마지막 옵션에서 보정
  } else {
    percentage = Math.round((count / totalVotes) * 100);
    remainingPercent -= percentage;
  }
});
```
- **장점**: 모든 옵션 반환 (투표 없어도), 합계 100% 보장
- **단점**: `optionCount` 파라미터 필요 (클라이언트 의존)

#### 콘텐츠 검토 (line 22-48)
```typescript
const bannedWords = [
  '시발', '씨발', '개새끼', '병신', ...
  '섹스', '야동', '포르노', ...
  '마약', '대마', ...
  '자살', '자해',
];
```
- **장점**: 기본적인 금지어 필터링
- **개선 필요**: 변형 표현 (ㅅㅂ, 씨-발 등) 미감지

### 1.3 발견된 이슈

| 심각도 | 이슈 | 설명 | 권장 조치 |
|--------|-----|------|----------|
| 낮음 | 클라이언트 의존 | `optionCount` 파라미터 필수 | 데이터에서 옵션 수 자동 감지 고려 |
| 낮음 | 금지어 우회 가능 | 변형 표현 미감지 | 정규식 패턴 추가 |
| 정보 | userVote 중복 쿼리 | VS/Choice 각각 쿼리 | 공통 함수로 추출 가능 |

### 1.4 잘된 점

- UPSERT로 중복 투표 안전 처리 (line 104-110)
- `userVote` 반환으로 UI에서 투표 상태 표시 가능
- 인기 투표 정렬 공식 명확 (`votes * 2 + likes * 3`)

---

## 2. OG 이미지 API 리뷰 (`src/app/api/og/route.tsx`)

### 2.1 지원 이미지 타입

| type | 용도 | 파라미터 |
|------|------|---------|
| `default` | 홈 OG | - |
| `result` | 테스트 결과 | test, result, emoji, desc |
| `poll` | VS 투표 | question, optionA/B, emojiA/B, percentA/B |
| `choice-poll` | Choice 투표 | question, options (JSON) |

### 2.2 핵심 로직 분석

#### Choice Poll 이미지 (line 413-549)
```typescript
function renderChoicePollCard(size, question, optionsJson) {
  let options = [];
  try {
    options = optionsJson ? JSON.parse(decodeURIComponent(optionsJson)) : [];
  } catch {
    options = [];
  }
  // ...렌더링
}
```

**options JSON 형식**:
```json
[
  {"text": "별자리 운세", "emoji": "⭐", "percent": 30},
  {"text": "띠별 운세", "emoji": "🐍", "percent": 25},
  ...
]
```

### 2.3 발견된 이슈

| 심각도 | 이슈 | 설명 | 권장 조치 |
|--------|-----|------|----------|
| 중간 | URL 길이 제한 | JSON이 길면 URL 초과 가능 | 옵션 5개 제한 유지 (현재 적용됨) |
| 낮음 | 한글 폰트 | Edge runtime에서 한글 깨짐 가능 | 배포 후 테스트 필요 |
| 정보 | 에러 핸들링 | JSON 파싱 실패 시 빈 배열 | 적절함 |

### 2.4 잘된 점

- 다양한 이미지 비율 지원 (OG, 인스타, 스토리, 카카오)
- 결과 있을 때만 퍼센트 표시 (`hasResults` 체크)
- 컬러 팔레트로 옵션별 구분 (`colors` 배열)

---

## 3. 연관 API 호환성

### 댓글 API (`/api/comments`)
```typescript
// 이미 poll 타입 지원
targetType: 'poll' | 'quiz' | 'test_result' | 'ranking'
```
- Choice Poll과 VS Poll 모두 `targetType=poll`로 사용 가능
- 대댓글 지원 (`parentId` 파라미터)

### 좋아요 API (`/api/likes`)
```typescript
// 이미 poll 타입 지원
targetType: 'comment' | 'post' | 'poll' | 'quiz'
```
- Choice Poll에도 동일하게 적용 가능

---

## 4. 테스트 시나리오

### 4.1 Poll API 테스트

```bash
# Choice Poll 통계 조회
GET /api/poll?pollId=choice-fortune-001&type=choice&optionCount=5&deviceId=xxx

# 예상 응답
{
  "pollId": "choice-fortune-001",
  "pollType": "choice",
  "totalVotes": 100,
  "options": [
    { "optionId": "a", "count": 30, "percentage": 30 },
    { "optionId": "b", "count": 25, "percentage": 25 },
    { "optionId": "c", "count": 20, "percentage": 20 },
    { "optionId": "d", "count": 15, "percentage": 15 },
    { "optionId": "e", "count": 10, "percentage": 10 }
  ],
  "userVote": "a"
}

# 투표 저장
POST /api/poll
{ "deviceId": "xxx", "pollId": "choice-fortune-001", "optionId": "c" }
```

### 4.2 OG 이미지 테스트

```
# Choice Poll OG 이미지
/api/og?type=choice-poll&question=가장 궁금한 운세는?&options=%5B%7B%22text%22%3A%22별자리%20운세%22%2C%22emoji%22%3A%22⭐%22%2C%22percent%22%3A30%7D%5D
```

---

## 5. 리뷰 요청 사항

### 5.1 코드 품질
- [ ] API 응답 구조 일관성
- [ ] 에러 핸들링 적절성
- [ ] 타입 안전성

### 5.2 보안
- [ ] deviceId 노출 위험 없는지
- [ ] SQL Injection 방지 (Prepared Statement 사용 중)
- [ ] 금지어 필터링 충분성

### 5.3 성능
- [ ] Choice Poll 쿼리 효율성
- [ ] OG 이미지 생성 속도 (Edge runtime)

### 5.4 확장성
- [ ] 옵션 8개 이상 투표 필요 시 대응
- [ ] 다국어 지원 고려

---

## 6. 관련 파일 경로

```
src/app/api/
├── poll/route.ts          # 투표 API (수정됨)
├── og/route.tsx           # OG 이미지 API (수정됨)
├── comments/route.ts      # 댓글 API (기존)
└── likes/route.ts         # 좋아요 API (기존)

src/data/content/polls/
└── choice-polls.ts        # Choice Poll 데이터 (기존)
```

---

## 7. 빌드 검증

```
✅ npm run build 성공
- TypeScript 컴파일 OK
- 타입 에러 없음
- Edge runtime 경고 있음 (정상)
```
