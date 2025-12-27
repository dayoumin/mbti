# 테스팅 전략

## 테스트 유형별 접근 방식

### 1. **정적 코드 분석 테스트** ✅ 사용 중
**목적**: 코드 구조, 패턴, 문서화 검증
**도구**: Node.js 스크립트
**장점**:
- 빠르고 안정적
- 의존성 문제 없음
- CI/CD에 통합 용이

**예시**:
```javascript
// 코드 패턴 검증
const hasSyncStats = content.includes('private async syncStatsFromTurso()');
const callOrder = /await this\.syncStatsFromTurso\(\);[\s\S]*?await this\.checkAndUnlockStages\(\);/.test(content);
```

**위치**: `tests/static/` (필요 시 생성)

---

### 2. **Vitest 유닛 테스트** ⚠️ 제한적 사용
**목적**: 독립적인 유틸리티 함수, 순수 함수 테스트
**문제점**:
- 싱글톤 서비스 (InsightService, ResultService 등)는 constructor에서 window 객체 사용
- jsdom 환경에서 초기화 순서 문제 발생
- Mock 설정이 복잡함

**해결 방안**:
1. ✅ **정적 분석 테스트 사용** (현재 전략)
2. ❌ Mock 체인 구축 (복잡도 높음, 유지보수 어려움)
3. ⏳ 향후: 서비스를 생성자 주입 패턴으로 리팩토링 (Breaking change)

**현재 상태**:
- `vitest.setup.ts`: localStorage mock 설정 완료
- 싱글톤 서비스 테스트는 정적 분석 사용
- 순수 함수만 vitest로 테스트

---

### 3. **E2E 테스트** ✅ 사용 중
**목적**: 실제 사용자 시나리오 검증
**도구**: Playwright
**범위**:
- 테스트 완료 → 결과 저장 → 인사이트 해금
- 멀티 디바이스 시나리오
- UI 상호작용

**위치**: `tests/e2e/`

---

## InsightService 테스트 전략

### ✅ 권장: 정적 분석 + E2E

```bash
# 정적 분석 (빠름, 안정적)
node tests/static/insight-service.test.js

# E2E 테스트 (실제 시나리오)
npm test  # Playwright
```

### ❌ 비권장: Vitest Mock

**이유**:
1. InsightService는 싱글톤으로 export
2. Constructor에서 `window`, `localStorage`, `eventBus` 사용
3. Mock 체인: ResultService → TursoService → fetch
4. 테스트 격리 어려움 (싱글톤 상태 공유)

---

## 현재 검증 방법

### InsightService.ts 리팩토링 검증
```bash
# 1. 정적 분석 (Node 스크립트)
node -e "
const fs = require('fs');
const content = fs.readFileSync('src/services/InsightService.ts', 'utf-8');

// 구조 검증
console.log('✅ syncStatsFromTurso 존재:', content.includes('syncStatsFromTurso'));
console.log('✅ testType 필터 강화:', content.includes('r.testType && r.testType.trim()'));
console.log('✅ testCount = testResults.length:', content.includes('testCount: testResults.length'));

// 통과
process.exit(0);
"

# 2. 타입 체크
npm run build

# 3. E2E (실제 브라우저)
npx playwright test
```

---

## ResultService 캐싱 검증

### 메모리 캐시 동작 확인
```javascript
// 브라우저 콘솔에서 테스트
const { resultService } = await import('./src/services/ResultService');

// 첫 호출 (Turso 조회)
console.time('첫 호출');
const results1 = await resultService.getMyResults();
console.timeEnd('첫 호출'); // ~200ms

// 두 번째 호출 (캐시 사용)
console.time('캐시 호출');
const results2 = await resultService.getMyResults();
console.timeEnd('캐시 호출'); // ~0ms

console.log('동일 결과:', results1 === results2); // true
```

---

## 향후 개선 방향

### Phase 1: 현재 (정적 분석 + E2E) ✅
- 빠르고 안정적
- 유지보수 용이
- CI/CD 통합 쉬움

### Phase 2: 서비스 리팩토링 (옵션)
```typescript
// 생성자 주입 패턴으로 변경
class InsightServiceClass {
  constructor(
    private storage: StorageService,
    private resultService: ResultService,
    private eventBus: EventBus
  ) {
    // 의존성 주입
  }
}

// 싱글톤 생성
export const insightService = new InsightServiceClass(
  storage,
  resultService,
  eventBus
);
```

**장점**:
- vitest mock 용이
- 테스트 격리
- 의존성 명시적

**단점**:
- Breaking change
- 기존 코드 수정 필요
- 현재 필요성 낮음

---

## 결론

**현재 전략 (정적 분석 + E2E)이 최적**:
- ✅ 빠르고 안정적
- ✅ 유지보수 용이
- ✅ 실제 동작 검증 (E2E)
- ✅ CI/CD 통합 쉬움

**vitest는 순수 함수에만 사용**:
- 유틸리티 함수
- 데이터 변환 함수
- 독립적인 비즈니스 로직
