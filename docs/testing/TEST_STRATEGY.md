# 테스트 전략 문서

> 작성일: 2025-12-21
> 상태: 계획 단계 (구현 대기)

## 1. 현황 분석

### 1.1 서비스 목록 (17개)

| 서비스 | 역할 | 복잡도 | 테스트 현황 |
|--------|------|--------|-------------|
| **GamificationService** | 배지, 포인트, 스트릭, 전문가 트랙 | 높음 | ✅ test-gamification-service.mjs |
| **DemographicService** | 인구통계 수집, 인사이트 생성 | 중간 | ⚠️ 로직 복사본 테스트 (리팩토링 필요) |
| **CareService** | 반려동물/식물 케어 프로필/스케줄 | 높음 | ❌ 없음 |
| ResultService | 테스트 결과 저장/조회 | 중간 | ❌ 없음 |
| RankingService | 랭킹 투표/통계 | 중간 | ❌ 없음 |
| FeedbackService | 피드백, 퀴즈, 투표 | 중간 | ❌ 없음 |
| ProfileService | 사용자 프로필 | 낮음 | ❌ 없음 |
| NextActionService | 다음 행동 추천 | 낮음 | ❌ 없음 |
| AuthService | 인증/통합 | 중간 | ⚠️ auth-merge.spec.ts (일부) |
| FriendService | 친구 초대/비교 | 중간 | ❌ 없음 |
| ContentParticipationService | 콘텐츠 참여 추적 | 낮음 | ❌ 없음 |
| AnalyticsService | 분석 이벤트 | 낮음 | ❌ 없음 |
| KakaoShareService | 카카오 공유 | 낮음 | ❌ 없음 |
| TursoService | DB 연동 | 높음 | ⚠️ test-supabase.mjs (이름 불일치) |
| PlantCareService | (레거시) 식물 케어 | - | CareService로 마이그레이션 |
| ParticipationBridge | 참여 상태 브릿지 | 낮음 | ❌ 없음 |

### 1.2 테스트 파일 구조

```
scripts/
├── test-*.mjs           # 수동 실행 테스트 (21개)
├── validate-*.mjs       # 데이터 검증 (2개)

tests/
├── *.spec.ts            # Playwright 기반 테스트 (3개)
```

### 1.3 현재 문제점

1. **테스트 커버리지 불균형**: 17개 서비스 중 3개만 테스트
2. **DemographicService 테스트가 로직 복사본**: 실제 서비스 변경 시 테스트와 불일치 가능
3. **CareService 테스트 없음**: 새로 추가된 복잡한 서비스
4. **통합 테스트 부재**: 서비스 간 연동 검증 없음
5. **자동화 부족**: 대부분 수동 실행 필요

---

## 2. 테스트 우선순위

### 2.1 우선순위 기준

1. **복잡도**: 로직이 복잡할수록 버그 가능성 높음
2. **사용 빈도**: 자주 사용되는 기능일수록 중요
3. **신뢰성 요구**: 데이터 저장/계산 정확성이 중요한 서비스
4. **변경 빈도**: 자주 수정되는 코드는 회귀 테스트 필요

### 2.2 우선순위 목록

| 순위 | 서비스 | 이유 | 예상 작업량 |
|------|--------|------|-------------|
| 1 | **CareService** | 테스트 없음, 복잡한 CRUD/스케줄 로직 | 높음 |
| 2 | **DemographicService** | 리팩토링 필요, 인사이트 로직 검증 | 중간 |
| 3 | **GamificationService** | 보완 필요 (expertProgress, community) | 중간 |
| 4 | ResultService | 데이터 저장 신뢰성 | 중간 |
| 5 | RankingService | 통계 계산 정확성 | 중간 |

---

## 3. 서비스별 테스트 계획

### 3.1 CareService (신규 작성)

**파일**: `scripts/test-care-service.mjs`

**테스트 케이스**:

```
1. 프로필 관리
   ├── addProfile: 프로필 생성 + 기본 스케줄 자동 생성
   ├── updateProfile: 프로필 수정
   ├── deleteProfile: 프로필 삭제 + 연관 스케줄/로그 삭제
   └── getProfiles: 타입별 필터링

2. 스케줄 관리
   ├── addSchedule: 스케줄 생성 + nextDue 계산
   ├── updateSchedule: 스케줄 수정
   ├── getFrequencyDays: 빈도별 일수 계산 (daily/weekly/custom 등)
   └── 타입별 기본 주기 적용

3. 케어 완료
   ├── completeCare: 완료 로그 생성 + nextDue 업데이트
   ├── getLogs: 프로필별 로그 조회
   └── 잘못된 scheduleId 처리

4. 오늘의 할 일
   ├── getTodayTasks: 전체 태스크 (정렬 검증)
   ├── getDueTasks: 오늘/지난 태스크만
   ├── getUpcomingTasks: N일 이내 태스크
   └── isOverdue 플래그 검증

5. 통계
   ├── getStats: 전체 통계 계산
   ├── careByType: 타입별 케어 횟수
   └── streak: 연속 케어 일수

6. 테스트 결과 연동
   ├── createProfileFromTestResult: 테스트 결과로 프로필 생성
   ├── getCareTypeFromTest: 테스트 → 케어 타입 매핑
   └── linkTestResult: 기존 프로필에 테스트 결과 연동

7. 마이그레이션
   └── migrateFromPlantCareService: 레거시 데이터 마이그레이션
```

### 3.2 DemographicService (리팩토링)

**파일**: `scripts/test-demographic-service.mjs` (기존 파일 수정)

**변경 사항**:
- 로직 복사 → 실제 서비스 import
- ESM import 문제 해결 (tsx 사용)

**테스트 케이스**:

```
1. 데이터 저장/조회
   ├── saveDemographic: localStorage 저장
   ├── getDemographic: 조회
   ├── 부분 업데이트 (ageGroup만, gender만)
   └── 잘못된 데이터 무시

2. 상태 확인
   ├── hasAgeGroup: 연령대 존재 여부
   ├── hasGender: 성별 존재 여부
   └── hasFullDemographic: 둘 다 있는지

3. 인사이트 생성 (핵심)
   ├── getInsight: 시드 데이터 매칭
   ├── 슬러그 변환 (toResultSlug)
   │   ├── 공백 → 하이픈
   │   ├── 이모지 제거
   │   └── 특수문자 처리
   ├── 해시 기반 일관성 (같은 입력 → 같은 결과)
   ├── 희귀 판정 (≤20%)
   └── 성별 'other' 처리 (라벨에서 제외)

4. 서버 동기화
   └── syncToServer: 실패해도 로컬 저장 유지 (mock fetch)
```

### 3.3 GamificationService (보완)

**파일**: `scripts/test-gamification-service.mjs` (기존 파일 확장)

**추가 테스트 케이스**:

```
1. 전문가 트랙 (expertProgress)
   ├── updateExpertProgress: test/quiz/poll별 업데이트
   ├── 카테고리 자동 매핑 (catBreed → cat)
   ├── 전문가 스트릭 (lastActiveDate 기반)
   └── 티어 승급 조건 검증

2. 커뮤니티 활동 (community)
   ├── recordAnswerWrite: 답변 작성 + 스트릭 반영
   ├── recordAnswerAdopted: 채택 (스트릭 미반영)
   ├── recordLikeReceived: 좋아요 받음
   └── recordLikeGiven: 좋아요 줌 + 스트릭 반영

3. 특별 배지 (special)
   ├── animal-explorer: 4종 Bronze 달성
   ├── animal-expert: 4종 Silver 달성
   ├── zookeeper: 7종 Gold 달성
   └── all-rounder: 9개 대상 Silver

4. 일일 미션
   ├── getDailyMissionStatus: 미션 상태 계산
   └── 목표값(target) 비교 검증
```

---

## 4. 통합 테스트 시나리오

### 4.1 테스트 완료 → 배지 획득 → 프로필 반영

```
시나리오: 사용자가 고양이 테스트 완료
1. ResultService.saveResult() 호출
2. GamificationService.recordTestComplete('cat') 호출
   → 포인트 20점 추가
   → expertProgress.cat 업데이트
   → 첫 테스트 배지 체크
3. CareService.createProfileFromTestResult() 호출 (선택적)
   → 케어 프로필 생성
   → 기본 스케줄 자동 생성

검증:
- ResultService에 결과 저장됨
- GamificationService에 testsCompleted 증가
- expertProgress.cat.testsCompleted에 'main' 추가
- (조건 충족 시) 'first-test' 배지 획득
```

### 4.2 연속 활동 → 스트릭 배지

```
시나리오: 3일 연속 활동
Day 1: recordVisit() → currentStreak=1
Day 2: recordQuizAnswer() → currentStreak=2
Day 3: recordPollVote() → currentStreak=3
   → 'streak-3' 배지 획득

검증:
- streak.currentStreak === 3
- streak.longestStreak === 3
- badges에 'streak-3' 포함
```

---

## 5. 테스트 실행 방법

### 5.1 개별 서비스 테스트

```bash
# CareService
node scripts/test-care-service.mjs

# DemographicService
npx tsx scripts/test-demographic-service.mjs

# GamificationService
node scripts/test-gamification-service.mjs
```

### 5.2 전체 테스트 (향후 추가)

```bash
# package.json에 스크립트 추가 예정
npm run test:services
```

### 5.3 CI 통합 (향후)

```yaml
# .github/workflows/test.yml
- name: Run service tests
  run: |
    node scripts/test-gamification-service.mjs
    node scripts/test-care-service.mjs
    npx tsx scripts/test-demographic-service.mjs
```

---

## 6. 테스트 작성 가이드

### 6.1 파일 구조

```javascript
/**
 * {ServiceName} 테스트
 *
 * 실행: node scripts/test-{service-name}.mjs
 */

// Mock localStorage
const storage = new Map();
global.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear(),
};
global.window = { localStorage: global.localStorage };

// 테스트 유틸
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    storage.clear(); // 각 테스트 전 초기화
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`❌ ${name}`);
    console.log(`   ${e.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

// ========== 테스트 시작 ==========

// ... 테스트 코드

// ========== 결과 출력 ==========
console.log(`\n통과: ${passed}, 실패: ${failed}`);
if (failed > 0) process.exit(1);
```

### 6.2 핵심 원칙

1. **각 테스트는 독립적**: storage.clear()로 초기화
2. **실제 서비스 import**: 로직 복사 금지
3. **경계값 테스트**: 빈 데이터, 잘못된 입력, 최대값
4. **실패 시 명확한 메시지**: 무엇이 왜 실패했는지

---

## 7. 체크리스트

### 구현 전 체크

- [ ] CareService 테스트 파일 생성
- [ ] DemographicService 테스트 리팩토링
- [ ] GamificationService 테스트 보완
- [ ] 통합 테스트 시나리오 작성

### 구현 후 체크

- [ ] 모든 테스트 통과
- [ ] npm run build 성공
- [ ] 새 기능 추가 시 테스트 동시 작성

---

## 8. 향후 계획

1. **Phase 1** (현재): 계획 수립 완료
2. **Phase 2**: CareService 테스트 작성
3. **Phase 3**: DemographicService 리팩토링
4. **Phase 4**: 통합 테스트 추가
5. **Phase 5**: CI 자동화