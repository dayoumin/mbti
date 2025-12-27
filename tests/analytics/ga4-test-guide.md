# GA4 이벤트 추적 테스트 가이드

## 🚀 즉시 확인 방법 (개발 서버)

### 1단계: 개발 서버 실행
```bash
npm run dev
```

### 2단계: Chrome DevTools 열기
1. 브라우저에서 `http://localhost:3000` 접속
2. **F12** 또는 **우클릭 > 검사**
3. **Network** 탭 선택
4. 필터에 `collect` 입력

### 3단계: 이벤트 발생시키기

| 동작 | 확인할 이벤트 | 파라미터 |
|------|-------------|---------|
| 테스트 시작 버튼 클릭 | `test_start` | `event_label=dog` |
| 테스트 완료 | `test_complete` | `event_label=dog`, `value=45` (초) |
| 카카오톡 공유 | `share` | `event_label=kakao_dog` |
| URL 복사 | `share` | `event_label=link_dog` |
| 퀴즈 정답 선택 | `quiz_answer` | `event_label=quiz_001`, `value=1` |
| 투표 참여 | `poll_vote` | `event_label=poll_001_a` |

### 4단계: Network 탭에서 확인
```
✅ 성공 예시:
- Name: collect?v=2&tid=G-GS60DKM6SB&...
- Status: 200 OK
- Preview 탭에서 파라미터 확인
```

---

## 📊 GA4 실시간 보고서 확인 (1-2분 후)

1. [Google Analytics](https://analytics.google.com) 접속
2. **보고서 > 실시간** 클릭
3. **이벤트 수(이벤트 이름별)** 확인

예상 이벤트:
```
test_start          (3)
test_complete       (2)
share               (5)
quiz_answer         (10)
poll_vote           (8)
situation_reaction  (3)
ranking_vote        (1)
```

---

## 🧪 자동 테스트 작성 (선택)

### Playwright E2E 테스트 예시

```typescript
// tests/analytics/ga4-events.spec.ts
import { test, expect } from '@playwright/test';

test.describe('GA4 이벤트 추적', () => {
  test('테스트 시작 시 test_start 이벤트 전송', async ({ page }) => {
    // GA4 요청 가로채기
    const gaRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('google-analytics.com/g/collect')) {
        gaRequests.push(request.url());
      }
    });

    // 테스트 시작
    await page.goto('http://localhost:3000');
    await page.click('text=테스트 시작하기');

    // 이벤트 전송 확인
    await page.waitForTimeout(1000);
    const testStartEvent = gaRequests.find(url => url.includes('test_start'));
    expect(testStartEvent).toBeTruthy();
  });

  test('퀴즈 정답 시 quiz_answer 이벤트 전송', async ({ page }) => {
    const gaRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('google-analytics.com/g/collect')) {
        gaRequests.push(request.url());
      }
    });

    await page.goto('http://localhost:3000');
    await page.click('[data-tab="explore"]');
    await page.click('text=강아지 퀴즈');
    await page.click('.quiz-option:first-child');

    await page.waitForTimeout(1000);
    const quizEvent = gaRequests.find(url => url.includes('quiz_answer'));
    expect(quizEvent).toBeTruthy();
    expect(quizEvent).toContain('value=1'); // 정답
  });
});
```

### 테스트 실행
```bash
npx playwright test tests/analytics/ga4-events.spec.ts
```

---

## 🔍 디버깅 팁

### gtag 함수 확인
브라우저 콘솔에서:
```javascript
// gtag 함수 존재 확인
console.log(window.gtag);

// 수동으로 이벤트 전송 테스트
window.gtag('event', 'test_event', {
  event_category: 'test',
  event_label: 'manual_test',
  value: 123
});
```

### localStorage에서 추적 비활성화
```javascript
// 추적 중지 (테스트용)
localStorage.setItem('ga-disable-G-GS60DKM6SB', 'true');

// 추적 재개
localStorage.removeItem('ga-disable-G-GS60DKM6SB');
```

---

## ✅ 체크리스트

- [ ] Chrome DevTools에서 `collect` 요청 확인
- [ ] GA4 실시간 보고서에서 이벤트 확인
- [ ] 모든 8개 이벤트 타입 테스트
- [ ] 파라미터 값이 정확한지 확인 (test_complete의 duration 등)
- [ ] 모바일에서도 동작하는지 확인 (네이티브 공유)

---

## 📝 예상 결과

### 정상 동작 시
```
✅ Network 탭에 collect 요청 표시
✅ Status 200 OK
✅ Payload에 정확한 파라미터 포함
✅ GA4 실시간 보고서에 1-2분 내 반영
```

### 문제 발생 시
```
❌ collect 요청 없음 → gtag 스크립트 로드 확인
❌ Status 0 (CORS) → GA_MEASUREMENT_ID 확인
❌ 실시간 보고서에 없음 → 1-2분 더 대기
```
