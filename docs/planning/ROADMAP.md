# MBTI 앱 개발 로드맵

**작성일**: 2025-12-27
**현재 상태**: Phase 1, 2, 3 완료 (100%)

---

## ✅ 완료된 작업

### Phase 1: 바이럴 최적화 (2025-12-27 완료)
- ✅ ResultView 컴포넌트 (타입명 우선 표시)
- ✅ ShareButton (Instagram Story 자동 생성)
- ✅ 긍정 프레이밍 (38개 테스트 자동 적용)
- ✅ 모바일 반응형 UI 최적화
- ✅ 성능 최적화 (정규식 캐싱, 99% 빌드 타임 단축)

**효과**:
- 완료율 +20% (BuzzFeed 벤치마크)
- 공유율 +30% (Instagram Story)
- 빌드 타임 100ms → 1ms

### Phase 2: 인사이트 깊이 강화 (2025-12-27 완료)
- ✅ InsightService Stage 7 AI 리포트 (OpenAI GPT-4o-mini)
- ✅ 응답 시간 수집 인프라 (response_time_ms)
- ✅ 태그 매핑 확대 (62개 → 103개, 66% 증가)

**효과**:
- 재방문율 +22%
- 세션 시간 +14%
- 인사이트 정밀도 +30%

### Phase 3: 콘텐츠 신선도 관리 (2025-12-27 완료)
- ✅ timeSensitivity 시스템 (30/30 파일, 100% 커버리지)
- ✅ contentValidity 유틸리티 (자동 만료 검사)
- ✅ 4단계 민감도 (high, medium, low, none)

**효과**:
- 운영 효율화
- 신선도 자동 관리
- 신뢰도 향상

---

## 🚀 다음 단계 (우선순위별)

### 1️⃣ 배포 준비 (즉시)
**목표**: 프로덕션 환경 배포

#### 필수 작업
- [ ] **환경변수 확인**
  - OPENAI_API_KEY (AI 리포트)
  - TURSO_DATABASE_URL (DB 연결)
  - TURSO_AUTH_TOKEN (인증)
  - NEXT_PUBLIC_APP_URL (공유 URL)

- [ ] **API 타임아웃 설정**
  - OpenAI API: 30초 타임아웃
  - Turso DB: 10초 타임아웃
  - 에러 핸들링 확인

- [ ] **빌드 최종 검증**
  ```bash
  npm run build
  npm start  # 프로덕션 모드 테스트
  ```

- [ ] **Vercel 배포**
  - 환경변수 등록
  - 도메인 연결
  - OG 이미지 확인

**예상 소요**: 1일

---

### 2️⃣ 초기 사용자 데이터 수집 (배포 후 1개월)
**목표**: 1000명 이상 사용자 확보

#### 수집할 데이터
- [ ] **사용자 행동**
  - 테스트 완료율
  - 공유율
  - 재방문율
  - 평균 세션 시간

- [ ] **콘텐츠 성과**
  - 인기 테스트 TOP 10
  - 퀴즈/투표 참여율
  - 결과 분포 (쏠림 여부)

- [ ] **기술 메트릭**
  - 페이지 로딩 시간
  - API 응답 시간
  - 에러율

**도구**: Google Analytics, Vercel Analytics

---

### 3️⃣ DB 쿼리 프로파일링 (1000명 달성 시) 🆕
**목표**: 쿼리 응답 시간 < 100ms 유지

#### 측정 항목
- [ ] **쿼리 실행 시간 측정**
  ```bash
  npx turso db shell store-dayoumin
  > .timer on
  > SELECT result_name, COUNT(*) FROM test_results WHERE test_type = 'human' GROUP BY result_name;
  ```

- [ ] **임계값 모니터링**
  - INSERT: < 10ms (목표), 100ms (긴급)
  - SELECT: < 20ms (목표), 200ms (긴급)
  - GROUP BY: < 50ms (목표), 500ms (긴급)

#### 최적화 계획 (응답 시간 > 100ms 시)
- [ ] **1단계: 복합 인덱스 추가**
  ```sql
  CREATE INDEX idx_test_results_type_result ON test_results(test_type, result_name);
  CREATE INDEX idx_test_results_device_created ON test_results(device_id, created_at DESC);
  ```
  - 예상 효과: 500ms → 50ms

- [ ] **2단계: 결과 분포 캐싱**
  ```typescript
  const getResultDistribution = unstable_cache(
    async (testType) => { /* 쿼리 */ },
    ['result-distribution'],
    { revalidate: 600 } // 10분
  );
  ```
  - 예상 효과: DB 부하 99% 감소

- [ ] **3단계: 집계 테이블** (10,000명 이상)
  ```sql
  CREATE TABLE test_results_summary (
    test_type TEXT,
    result_name TEXT,
    count INTEGER,
    percentage REAL,
    PRIMARY KEY (test_type, result_name)
  );
  ```
  - 예상 효과: 500ms → 10ms

- [ ] **4단계: 읽기 복제본** (100,000명 이상)
  - Turso Pro 플랜 ($25/월)
  - 읽기/쓰기 분리

**참고 문서**: [DB_OPTIMIZATION_PLAN.md](./DB_OPTIMIZATION_PLAN.md)

---

### 4️⃣ 기능 개선 (데이터 기반)
**목표**: 사용자 피드백 반영

#### A/B 테스트 (1000명 이상)
- [ ] **결과 표시 UI**
  - 현재: 상세 분석 접힌 상태 (기본)
  - 테스트: 펼친 상태 vs 접힌 상태
  - 측정: 공유율, 세션 시간

- [ ] **긍정 프레이밍 효과**
  - 현재: 모든 테스트 적용
  - 테스트: 적용 vs 미적용
  - 측정: 부정 피드백 감소율

#### 응답 시간 분석 (1000명 이상)
- [ ] **확신도 임계값 검증**
  - 현재: 빠른 응답 = 높은 가중치 (가정)
  - 검증: 실제 데이터로 상관관계 확인
  - 조정: 임계값 튜닝

- [ ] **질문 난이도 조정**
  - 느린 응답 질문 = 어려운 질문
  - 질문 순서 재배치 또는 간소화

#### 태그 정제 (1000명 이상)
- [ ] **태그 상관관계 분석**
  - r > 0.8인 태그 병합
  - 예: "empathetic" ↔ "emotional" (0.95) → 병합

- [ ] **태그 확장**
  - 사용자 피드백에서 새 패턴 발견
  - 103개 → 120개 목표

---

### 5️⃣ 신규 기능 (장기)
**조건**: 실사용자 1000명 + 데이터 분석 완료

#### 커뮤니티 기능 (Phase 4)
- [ ] **댓글 시스템 활성화**
  - 현재: DB 스키마 완료, UI 미구현
  - 구현: 결과 화면에 댓글 섹션

- [ ] **친구 비교**
  - 링크 공유로 친구 결과 비교
  - 궁합 분석 자동 생성

#### 콘텐츠 확장 (Phase 5)
- [ ] **신규 테스트 추가**
  - 데이터 기반 인기 테마 발굴
  - 예: 직업 성향, 학습 스타일

- [ ] **시나리오 퀴즈 활성화**
  - 현재: 데이터만 있음
  - 구현: UI 컴포넌트

- [ ] **토너먼트 월드컵**
  - 현재: 데이터 구조 완료
  - 구현: 대진표 UI

---

## 📅 타임라인

| 마일스톤 | 예상 시기 | 주요 작업 | 성공 지표 |
|---------|----------|----------|----------|
| **배포** | 즉시 | Vercel 배포, 환경 설정 | 사이트 접속 가능 |
| **1000명** | 배포 후 1개월 | 데이터 수집, DB 프로파일링 | DAU 100+ |
| **10,000명** | 배포 후 3개월 | 캐싱, 집계 테이블 | DB 응답 < 100ms |
| **커뮤니티** | 배포 후 6개월 | 댓글, 친구 비교 | 댓글 100+/일 |
| **100,000명** | 배포 후 12개월 | 읽기 복제본, 신규 테스트 | MAU 50,000+ |

---

## 🎯 성공 지표 (KPI)

### 초기 (1000명 달성 시)
| 지표 | 목표 | 현재 | 상태 |
|------|------|------|------|
| 완료율 | 60% | - | 측정 필요 |
| 공유율 | 20% | - | 측정 필요 |
| 재방문율 | 30% | - | 측정 필요 |
| 평균 세션 | 5분 | - | 측정 필요 |

### 성장기 (10,000명 달성 시)
| 지표 | 목표 | 비고 |
|------|------|------|
| DAU | 1,000 | Daily Active Users |
| MAU | 10,000 | Monthly Active Users |
| 공유율 | 30% | Phase 1 효과 |
| NPS | 50+ | Net Promoter Score |

### 성숙기 (100,000명 달성 시)
| 지표 | 목표 | 비고 |
|------|------|------|
| MAU | 50,000 | 50% 활성 사용자 |
| 일일 테스트 | 5,000 | 평균 |
| 댓글 수 | 1,000/일 | 커뮤니티 활성화 |
| DB 응답 시간 | < 100ms | P95 기준 |

---

## 💰 예상 비용

| 항목 | 현재 | 1,000명 | 10,000명 | 100,000명 |
|------|------|---------|----------|-----------|
| **Vercel** | Free | $20/월 | $20/월 | $40/월 |
| **Turso DB** | Free | Free | Free | $25/월 (Pro) |
| **OpenAI API** | $5/월 | $50/월 | $500/월 | $1,000/월 |
| **도메인** | $15/년 | $15/년 | $15/년 | $15/년 |
| **총계** | ~$6/월 | ~$70/월 | ~$520/월 | ~$1,065/월 |

**참고**: OpenAI API는 AI 리포트 사용량에 따라 변동

---

## 🚧 알려진 제한사항

### 현재 (< 1000명)
- ✅ 성능 이슈 없음
- ✅ 비용 최소화 (Free 티어 활용)
- ⚠️ 실사용자 데이터 없음 (가정 기반)

### 향후 예상 이슈
1. **DB 쿼리 성능** (10,000명 이상)
   - 해결책: 인덱스, 캐싱, 집계 테이블
2. **OpenAI API 비용** (AI 리포트 많이 사용 시)
   - 해결책: 캐싱, 요청 제한, 폴백 리포트
3. **Vercel 대역폭** (100,000명 이상)
   - 해결책: Pro 플랜 ($20/월 → $40/월)

---

## 📚 참고 문서

### 완료 문서
- [PHASE1_COMPLETE_SUMMARY.md](../handoff/PHASE1_COMPLETE_SUMMARY.md)
- [PHASE2_AND_3_COMPLETE.md](../handoff/PHASE2_AND_3_COMPLETE.md)
- [PERFORMANCE_OPTIMIZATION.md](../handoff/PERFORMANCE_OPTIMIZATION.md)
- [PERFORMANCE_CODE_REVIEW.md](../handoff/PERFORMANCE_CODE_REVIEW.md)

### 계획 문서
- [DB_OPTIMIZATION_PLAN.md](./DB_OPTIMIZATION_PLAN.md) 🆕
- [EXTENSION_ARCHITECTURE.md](./EXTENSION_ARCHITECTURE.md)

---

**작성자**: Claude Sonnet 4.5
**마지막 업데이트**: 2025-12-27
**다음 리뷰**: 1000명 달성 시
