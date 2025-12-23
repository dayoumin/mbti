# Content DB Migration 코드 리뷰

- 리뷰 요청: 2024-12-23
- 작성: Codex (AI)

## 개요
퀴즈/투표/시나리오/토너먼트 콘텐츠를 Turso(LibSQL)로 이관하고, DB 조회 실패 시 코드 내 샘플 데이터로 폴백하는 구조를 리뷰했다.

---

## 1. DB 스키마 리뷰

**파일**: `scripts/migrations/001_content_tables.sql`

### 테이블/뷰 요약
| 대상 | PK 타입 | JSON 필드 | 인덱스 |
| --- | --- | --- | --- |
| quizzes | TEXT(id) | options, tags | category, type, status |
| scenario_quizzes | TEXT(id) | questions, results | category, status |
| polls | TEXT(id) | options, tags | category, type, status |
| tournaments | TEXT(id) | contestants, result_config | category, status |
| v_quiz_stats | - | - | quiz_responses, quizzes |
| v_poll_stats | - | - | poll_responses, polls, likes |

### 검토 포인트
- PK 타입이 TEXT다. 사람이 읽기 쉬운 ID라는 장점이 있지만, 충돌/정책 관리가 필요하다. UUID로 갈지, 현재 네이밍 룰을 고정할지 명확히 해야 한다.
- JSON 필드는 TEXT로 저장되어 파싱 오버헤드가 있고, JSON 구조에 대한 제약이 없다. JSON1 함수 사용 계획과 유효성 검증 방식이 필요하다.
- 목록 조회는 `status = 'active'` + `category` 필터에 `created_at DESC` 정렬을 사용한다. 현 인덱스는 분리되어 있어 복합 인덱스(예: `(status, category, created_at)`)가 필요할 수 있다.
- status 값은 CHECK 제약이 없다. 잘못된 상태값이 들어오면 조회/통계에 누락될 수 있다.
- 통계 뷰는 `quiz_responses`, `poll_responses`, `likes`를 참조한다. 해당 테이블의 FK/인덱스 존재 여부를 확인해야 한다.

---

## 2. ContentService 리뷰

**파일**: `src/services/ContentService.ts`

### 주요 구조
- DB 조회 실패 또는 빈 결과일 때 코드 내 샘플 데이터로 폴백한다.
- CRUD는 단건 쿼리 위주이며 트랜잭션을 사용하지 않는다.
- 캐싱 계층이 없다.

### 이슈/우려
- 폴백 로직이 "DB 빈 결과"와 "DB 에러"를 같은 결과로 처리한다. 운영 장애가 조용히 숨겨질 수 있다.
- 업데이트/삭제 시 affected rows 확인이 없다. 존재하지 않는 ID라도 성공으로 응답할 수 있다.
- JSON 파싱은 row 단에서 바로 수행된다. 데이터가 손상되면 런타임 예외가 발생할 수 있다.
- 동일 요청이 잦은 콘텐츠는 매번 DB 호출이 발생한다. 캐싱 부재로 비용이 증가할 수 있다.
- 복수 쿼리가 필요한 작업(예: related insert)에는 트랜잭션이 필요하지만 현재 구조에 없다.

---

## 3. API 라우트 리뷰

**파일**: `src/app/api/content/route.ts`

### 우려 사항 (일부 해결됨)
- ~~인증이 없어서 누구나 POST/PUT/DELETE 가능하다.~~ **해결됨** (2024-12-23)
- 입력 검증이 최소 수준(필수 필드 존재 여부). 스키마 검증이 없다.
- enum 값, JSON 구조, 길이 제한 등 유효성 검증이 없다.
- rate limit 없음 (인증 추가로 일부 완화)

---

## 4. 테스트 리뷰

**파일**: `scripts/test-content-service.mjs`, `scripts/test-content-api.mjs`

### 현황
- 총 102개 테스트 통과 (서비스 45개, API 57개)
- 실제 DB/HTTP를 사용하는 통합 테스트 위주
- 인증 테스트 3개 추가됨 (2024-12-23)

### 부족한 부분
- ContentService 단위 테스트 부재(메서드 단위, 에러 분기 검증 없음)
- DB 에러/타임아웃/트랜잭션 롤백 시나리오 테스트 없음
- 입력 검증 실패 케이스 테스트 부족

---

## 5. 주요 질문 (다른 AI에게)
1. 폴백 로직에서 "DB 빈 결과"와 "DB 에러"를 같이 처리해도 되는가?
2. polls 테이블이 기존 user_polls와 혼동되지 않는가?
3. 관리자 인증은 어떻게 구현할 계획인가?
4. 콘텐츠가 많아지면 캐싱이 필요할까?

---

## 6. 완료된 개선 사항

### API 인증 추가 (2024-12-23)
- POST/PUT/DELETE에 관리자 권한 체크 추가
- 인증 방식:
  1. **세션 기반**: NextAuth 로그인 + `ADMIN_EMAILS` 환경변수
  2. **API Secret**: `Authorization: Bearer {CONTENT_API_SECRET}` 헤더
- 환경변수: `.env.local`에 `CONTENT_API_SECRET` 추가

### 추가 개선 (2024-12-23)
- `.env.example`에 `ADMIN_EMAILS`, `CONTENT_API_SECRET` 문서화
- `ADMIN_EMAILS` 파싱에 trim/lowercase 처리 추가
- 잘못된 Bearer 토큰 테스트 케이스 추가 (총 58개 API 테스트)

---

## 7. 남은 개선 권장 사항 (우선순위 중간)
1. 입력 검증 강화 - Zod 스키마 등
2. UPDATE 결과 확인 - affected rows 체크
3. 복합 인덱스 추가 - 데이터 많아지면

---

## 관련 파일
```
scripts/
├── migrations/001_content_tables.sql  # DB 스키마
├── seed-content.mjs                   # 샘플 데이터
├── test-content-service.mjs           # DB 테스트
└── test-content-api.mjs               # API 테스트
src/
├── services/ContentService.ts         # 핵심 서비스
└── app/api/content/route.ts           # REST API
```
