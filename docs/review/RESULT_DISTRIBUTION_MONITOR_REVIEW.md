# 결과 분포 모니터링 시스템 - AI 코드 리뷰 요청

## 개요
테스트 결과 분포를 모니터링하고 이상(쏠림/희귀/미출현)을 감지하는 대시보드 기능

## 변경 파일

### 1. API 엔드포인트
**파일**: `src/app/api/test-results/route.ts`

```typescript
// 14-18줄: 임계값 중앙화
const THRESHOLDS = {
  HIGH: 40,  // 40% 이상 = 쏠림
  LOW: 1,    // 1% 미만 = 희귀
} as const;

// 323-327줄: 정의된 결과 후보군 가져오기 (미출현 감지용)
const getExpectedResults = (testType: string): string[] => {
  const data = CHEMI_DATA[testType as keyof typeof CHEMI_DATA];
  if (!data?.resultLabels) return [];
  return data.resultLabels.map(r => r.name);
};

// 334-340줄: 미출현 결과 병합
const allResults = [...items];
expectedResults.forEach(name => {
  if (!existingResults.has(name)) {
    allResults.push({ resultName: name, count: 0 });
  }
});

// 363-369줄: 알림 생성 (ZERO 포함)
if (d.count === 0 && expectedResults.includes(d.resultName)) {
  alerts.push({ type: 'zero', resultName: d.resultName, percentage: 0 });
}

// 392-397줄: 응답에 thresholds 포함
return NextResponse.json({
  totalTests: distributions.length,
  totalAlerts,
  distributions,
  thresholds: THRESHOLDS, // UI에서 동일 기준 사용
});
```

### 2. 대시보드 컴포넌트
**파일**: `src/app/dashboard/components/ResultDistributionMonitor.tsx`

```typescript
// 33-36줄: Thresholds 인터페이스 추가
interface Thresholds {
  HIGH: number;
  LOW: number;
}

// 56줄: 재시도 시 에러 초기화
setError(null);  // 재시도 시 에러 초기화

// 69줄: 서버 임계값 사용 (폴백 제공)
const thresholds = data?.thresholds ?? { HIGH: 40, LOW: 1 };

// 76-81줄: 타입 안전한 getTestType
const getTestType = (testType: string): 'personality' | 'matching' | 'unknown' => {
  const config = SUBJECT_CONFIG[testType as keyof typeof SUBJECT_CONFIG];
  const type = config?.testType;
  if (type === 'personality' || type === 'matching') return type;
  return 'unknown';
};

// 83-93줄: unknown 타입 처리
const getTestTypeBadge = (testType: string) => {
  const type = getTestType(testType);
  switch (type) {
    case 'personality':
      return { label: '성격', className: 'bg-purple-100 text-purple-600' };
    case 'matching':
      return { label: '매칭', className: 'bg-blue-100 text-blue-600' };
    default:
      return { label: '기타', className: 'bg-gray-100 text-gray-600' };
  }
};

// 299-301줄: zero 알림 메시지 렌더링
{alert.type === 'zero' && (
  <>"{alert.resultName}" 결과가 한 번도 안 나옴 → condition 조건 불가능 여부 확인</>
)}
```

### 3. 테스트 스크립트
**파일**: `scripts/test-distribution-monitor.mjs`

4개 테스트 케이스:
1. getExpectedResults 로직 시뮬레이션
2. 알림 분류 로직 (HIGH/LOW/ZERO)
3. 미출현 결과 병합 로직
4. 임계값 경계 테스트

## 이전 리뷰에서 수정된 이슈

| 우선순위 | 이슈 | 해결 방법 |
|----------|------|-----------|
| HIGH | 미출현(0%) 알림 미동작 | CHEMI_DATA.resultLabels로 정의된 결과 가져와 DB 결과와 병합 |
| MEDIUM | 재시도 시 에러 상태 유지 | setError(null) 추가 |
| MEDIUM | 임계값 하드코딩 불일치 | API에서 thresholds 응답, UI에서 사용 |
| LOW | unknown 테스트 타입 → 매칭 | getTestTypeBadge에서 '기타' 반환 |
| LOW | zero 알림 메시지 미렌더링 | 조건문 추가 |

## 리뷰 포인트

### 1. 로직 정확성
- [ ] getExpectedResults가 모든 테스트 타입에서 정상 동작하는가?
- [ ] CHEMI_DATA에 resultLabels가 없는 테스트 타입 처리가 적절한가?
- [ ] 소수점 비율(0.5% 등) 처리가 정확한가?

### 2. 성능
- [ ] 전체 테스트 GROUP BY 쿼리 → 데이터 증가 시 성능?
- [ ] CHEMI_DATA 매번 참조 → 캐싱 필요?

### 3. 확장성
- [ ] 새 테스트 타입 추가 시 자동 지원되는가?
- [ ] 임계값 조정이 필요할 때 어디를 수정해야 하는가? (현재: API만)

### 4. 누락된 기능
- [ ] 기간별 필터 (최근 7일/30일)?
- [ ] CSV 내보내기?
- [ ] 자동 알림 (Slack/이메일)?

## 테스트 결과

```
🧪 결과 분포 모니터링 통합 테스트
============================================================
📋 테스트 1: getExpectedResults 로직 시뮬레이션 - 5/5 통과
📋 테스트 2: 알림 분류 로직 - 7/7 통과
📋 테스트 3: 미출현 결과 병합 로직 - 3/3 통과
📋 테스트 4: 임계값 경계 테스트 - 6/6 통과
============================================================
✅ 통과: 21
❌ 실패: 0
🎉 모든 테스트 통과!
```

## 빌드 상태
- ✅ `npm run build` 성공 (21/21 페이지)

## 관련 파일
- API: `src/app/api/test-results/route.ts` (290-398줄)
- 컴포넌트: `src/app/dashboard/components/ResultDistributionMonitor.tsx` (전체)
- 테스트: `scripts/test-distribution-monitor.mjs`
- 사이드바: `src/app/dashboard/config/sidebar.tsx` (116줄)
