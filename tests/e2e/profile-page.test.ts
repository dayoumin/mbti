import { expect, test } from '@playwright/test';

/**
 * /profile 페이지 E2E 테스트
 *
 * 테스트 대상:
 * - /profile 독립 페이지 접근
 * - CompactProfile에서 /profile로 네비게이션
 * - 각 섹션 렌더링 확인
 * - 반응형 레이아웃
 *
 * 실행: npx playwright test tests/e2e/profile-page.test.ts
 */

// 헬퍼: 테스트 데이터 설정
async function setupTestData(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    const testUserId = 'test_user_profile_e2e';
    localStorage.setItem('chemi_user', testUserId);
    const results = [
      {
        id: 'test-1',
        user_id: testUserId,
        testType: 'human',
        resultKey: '모험가',
        resultEmoji: '🎯',
        isDeepMode: false,
        createdAt: new Date().toISOString(),
        scores: { inssa: 70, adventure: 80, empathy: 60, plan: 50, mental: 75 },
      },
      {
        id: 'test-2',
        user_id: testUserId,
        testType: 'cat',
        resultKey: '철학냥이',
        resultEmoji: '🧐',
        isDeepMode: false,
        createdAt: new Date().toISOString(),
        scores: { curious: 80, alert: 60, boss: 70, random: 50, cute: 75 },
      },
      {
        id: 'test-3',
        user_id: testUserId,
        testType: 'coffee',
        resultKey: '에스프레소',
        resultEmoji: '☕',
        isDeepMode: false,
        createdAt: new Date().toISOString(),
        scores: { bitter: 80, sweet: 30 },
      }
    ];
    localStorage.setItem('chemi_test_results', JSON.stringify(results));
  });
}

test.describe('/profile 페이지 기본 동작', () => {
  test('/profile 페이지 직접 접근', async ({ page }) => {
    await page.goto('/');
    await setupTestData(page);
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // 페이지가 로드되었는지 확인
    await expect(page).toHaveURL('/profile');

    // HeroSection 확인 - 레벨 또는 완성도 표시
    const heroContent = page.locator('text=/프로필 완성도|Lv\\./');
    await expect(heroContent.first()).toBeVisible({ timeout: 10000 });
  });

  test('모바일 BottomNav에서 프로필 탭 클릭으로 /profile 이동', async ({ page }) => {
    await page.goto('/');
    await setupTestData(page);

    // 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // BottomNav에서 프로필 버튼 클릭
    const profileNavButton = page.locator('nav button').filter({ hasText: /프로필/ });
    await expect(profileNavButton).toBeVisible({ timeout: 5000 });
    await profileNavButton.click();
    await page.waitForURL('**/profile', { timeout: 10000 });
    await expect(page).toHaveURL('/profile');
  });
});

test.describe('/profile 페이지 섹션 렌더링', () => {
  test('모든 섹션이 렌더링됨', async ({ page }) => {
    // 테스트 데이터 설정
    await page.goto('/');
    await page.evaluate(() => {
      const testUserId = 'test_user_sections_e2e';
      localStorage.setItem('chemi_user', testUserId);
      const results = [
        {
          id: 'test-1',
          user_id: testUserId,
          testType: 'human',
          resultKey: '모험가',
          resultEmoji: '🎯',
          isDeepMode: false,
          createdAt: new Date().toISOString(),
          scores: { inssa: 70, adventure: 80, empathy: 60, plan: 50, mental: 75 },
        },
        {
          id: 'test-2',
          user_id: testUserId,
          testType: 'idealType',
          resultKey: '로맨티스트',
          resultEmoji: '💕',
          isDeepMode: false,
          createdAt: new Date().toISOString(),
          scores: { romantic: 80, realistic: 40 },
        }
      ];
      localStorage.setItem('chemi_test_results', JSON.stringify(results));
    });

    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // HeroSection - 프로필 완성도 또는 레벨 표시
    const heroContent = page.locator('text=/프로필 완성도|Lv\\./');
    await expect(heroContent.first()).toBeVisible({ timeout: 10000 });

    // InsightSection - 인사이트 저니
    const insightHeader = page.locator('text=/인사이트 저니/');
    await expect(insightHeader).toBeVisible({ timeout: 5000 });

    // RelationshipSection - 관계 속 나
    const relationshipHeader = page.locator('text=/관계 속 나/');
    await expect(relationshipHeader).toBeVisible({ timeout: 5000 });

    // ActivitySection - 활동 & 경쟁
    const activityHeader = page.locator('text=/활동 & 경쟁/');
    await expect(activityHeader).toBeVisible({ timeout: 5000 });

    // AchievementsSection - 도전 & 기록
    const achievementsHeader = page.locator('text=/도전 & 기록/');
    await expect(achievementsHeader).toBeVisible({ timeout: 5000 });
  });
});

test.describe('/profile 페이지 네비게이션', () => {
  test('뒤로가기 버튼으로 홈으로 이동', async ({ page }) => {
    // 테스트 데이터 먼저 설정
    await page.goto('/');
    await setupTestData(page);

    // 모바일 뷰포트 (뒤로가기 버튼이 모바일에서만 표시)
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // 뒤로 버튼 클릭
    const backButton = page.locator('button:has-text("뒤로")');
    await expect(backButton).toBeVisible({ timeout: 5000 });
    await backButton.click();

    // 홈으로 이동 확인
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });
});

test.describe('빈 프로필 상태', () => {
  test('테스트 완료 없을 때 빈 상태 UI', async ({ page }) => {
    await page.goto('/');

    // localStorage 초기화
    await page.evaluate(() => {
      localStorage.removeItem('chemi_test_results');
      localStorage.removeItem('chemi_user');
    });

    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // 빈 프로필 안내 메시지 확인
    const emptyMessage = page.locator('text=/프로필을 시작해보세요/');
    await expect(emptyMessage).toBeVisible({ timeout: 10000 });

    // 첫 테스트 시작 버튼 확인
    const startButton = page.locator('button:has-text("첫 테스트 시작하기")');
    await expect(startButton).toBeVisible();
  });
});

test.describe('반응형 레이아웃', () => {
  test('모바일에서 헤더 표시, PC에서 사이드바 표시', async ({ page }) => {
    await page.goto('/');
    await setupTestData(page);

    // 모바일 테스트
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // 모바일 헤더 표시 확인
    const mobileHeader = page.locator('header:has-text("내 프로필")');
    await expect(mobileHeader).toBeVisible({ timeout: 5000 });

    // PC 테스트
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 좌측 사이드바 표시 확인
    const sidebar = page.locator('aside').first();
    await expect(sidebar).toBeVisible({ timeout: 5000 });
  });
});
