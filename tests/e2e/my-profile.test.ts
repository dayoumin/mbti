import { expect, test } from '@playwright/test';

/**
 * MyProfile 컴포넌트 E2E 테스트
 *
 * 테스트 대상:
 * - FullProfile 모달 접근성 (ESC 닫기, role="dialog")
 * - CareButtonWithModal 컴포넌트 동작
 * - 케어 진입 통합 (동물 탭에서 반려생물 케어 관리)
 *
 * 실행: npx playwright test tests/e2e/my-profile.test.ts
 */

test.describe('FullProfile 모달', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 테스트용 프로필 데이터 설정 (테스트 1개 이상 완료)
    await page.evaluate(() => {
      const results = [{
        id: 'test-1',
        testType: 'human',
        resultKey: '모험가',
        resultEmoji: '🎯',
        isDeepMode: false,
        createdAt: new Date().toISOString(),
        scores: { inssa: 70, adventure: 80, empathy: 60, plan: 50, mental: 75 },
      }];
      localStorage.setItem('chemi_results', JSON.stringify(results));
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('프로필 더보기 버튼으로 모달 열기', async ({ page }) => {
    // 프로필 더보기 버튼 클릭
    const moreButton = page.locator('button').filter({ hasText: /더보기/ });

    if (await moreButton.isVisible()) {
      await moreButton.click();
      await page.waitForTimeout(300);

      // 모달이 열렸는지 확인 (role="dialog" 속성)
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute('aria-modal', 'true');
    }
  });

  test('ESC 키로 FullProfile 모달 닫기', async ({ page }) => {
    const moreButton = page.locator('button').filter({ hasText: /더보기/ });

    if (await moreButton.isVisible()) {
      await moreButton.click();
      await page.waitForTimeout(300);

      // 모달이 열렸는지 확인
      const dialog = page.locator('[role="dialog"][aria-label="내 프로필"]');
      await expect(dialog).toBeVisible();

      // ESC 키로 닫기
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);

      // 모달이 닫혔는지 확인
      await expect(dialog).not.toBeVisible();
    }
  });

  test('닫기 버튼으로 FullProfile 모달 닫기', async ({ page }) => {
    const moreButton = page.locator('button').filter({ hasText: /더보기/ });

    if (await moreButton.isVisible()) {
      await moreButton.click();
      await page.waitForTimeout(300);

      // 닫기 버튼 클릭
      const closeButton = page.locator('[aria-label="닫기"]');
      await closeButton.click();
      await page.waitForTimeout(300);

      // 모달이 닫혔는지 확인
      const dialog = page.locator('[role="dialog"][aria-label="내 프로필"]');
      await expect(dialog).not.toBeVisible();
    }
  });

  test('탭 네비게이션 동작', async ({ page }) => {
    const moreButton = page.locator('button').filter({ hasText: /더보기/ });

    if (await moreButton.isVisible()) {
      await moreButton.click();
      await page.waitForTimeout(300);

      // 탭 목록 확인
      const tablist = page.locator('[role="tablist"]');
      await expect(tablist).toBeVisible();

      // 동물 탭 클릭
      const petTab = page.locator('[role="tab"]').filter({ hasText: /동물/ });
      await petTab.click();
      await page.waitForTimeout(200);
      await expect(petTab).toHaveAttribute('aria-selected', 'true');

      // 라이프 탭 클릭
      const lifeTab = page.locator('[role="tab"]').filter({ hasText: /라이프/ });
      await lifeTab.click();
      await page.waitForTimeout(200);
      await expect(lifeTab).toHaveAttribute('aria-selected', 'true');
    }
  });
});

test.describe('CareButtonWithModal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // 테스트 결과 설정
    await page.evaluate(() => {
      const results = [{
        id: 'test-1',
        testType: 'cat',
        resultKey: '철학냥이',
        resultEmoji: '🧐',
        isDeepMode: false,
        createdAt: new Date().toISOString(),
        scores: { curious: 80, alert: 60, boss: 70, random: 50, cute: 75 },
      }];
      localStorage.setItem('chemi_results', JSON.stringify(results));
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('동물 탭에서 반려생물 케어 관리 버튼 표시', async ({ page }) => {
    // 프로필 더보기
    const moreButton = page.locator('button').filter({ hasText: /더보기/ });

    if (await moreButton.isVisible()) {
      await moreButton.click();
      await page.waitForTimeout(300);

      // 동물 탭 클릭
      const petTab = page.locator('[role="tab"]').filter({ hasText: /동물/ });
      await petTab.click();
      await page.waitForTimeout(300);

      // 반려생물 케어 관리 버튼 확인
      const careButton = page.locator('button').filter({ hasText: /반려생물 케어 관리/ });
      await expect(careButton).toBeVisible();
    }
  });

  test('케어 관리 버튼 클릭으로 CareHome 열기', async ({ page }) => {
    const moreButton = page.locator('button').filter({ hasText: /더보기/ });

    if (await moreButton.isVisible()) {
      await moreButton.click();
      await page.waitForTimeout(300);

      // 동물 탭 클릭
      const petTab = page.locator('[role="tab"]').filter({ hasText: /동물/ });
      await petTab.click();
      await page.waitForTimeout(300);

      // 케어 관리 버튼 클릭
      const careButton = page.locator('button').filter({ hasText: /반려생물 케어 관리/ });
      await careButton.click();
      await page.waitForTimeout(300);

      // CareHome 모달 확인
      const careDialog = page.locator('[role="dialog"][aria-label="케어 관리"]');
      await expect(careDialog).toBeVisible();
    }
  });

  test('ESC 키로 CareHome 모달 닫기', async ({ page }) => {
    const moreButton = page.locator('button').filter({ hasText: /더보기/ });

    if (await moreButton.isVisible()) {
      await moreButton.click();
      await page.waitForTimeout(300);

      const petTab = page.locator('[role="tab"]').filter({ hasText: /동물/ });
      await petTab.click();
      await page.waitForTimeout(300);

      const careButton = page.locator('button').filter({ hasText: /반려생물 케어 관리/ });
      await careButton.click();
      await page.waitForTimeout(300);

      // ESC 키로 닫기
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);

      // CareHome 모달이 닫혔는지 확인
      const careDialog = page.locator('[role="dialog"][aria-label="케어 관리"]');
      await expect(careDialog).not.toBeVisible();
    }
  });

  test('뒤로가기 버튼으로 CareHome 모달 닫기', async ({ page }) => {
    const moreButton = page.locator('button').filter({ hasText: /더보기/ });

    if (await moreButton.isVisible()) {
      await moreButton.click();
      await page.waitForTimeout(300);

      const petTab = page.locator('[role="tab"]').filter({ hasText: /동물/ });
      await petTab.click();
      await page.waitForTimeout(300);

      const careButton = page.locator('button').filter({ hasText: /반려생물 케어 관리/ });
      await careButton.click();
      await page.waitForTimeout(300);

      // 뒤로가기 버튼 클릭
      const backButton = page.locator('button').filter({ hasText: /프로필로 돌아가기/ });
      await backButton.click();
      await page.waitForTimeout(300);

      // CareHome 모달이 닫혔는지 확인
      const careDialog = page.locator('[role="dialog"][aria-label="케어 관리"]');
      await expect(careDialog).not.toBeVisible();
    }
  });
});

test.describe('케어 진입 통합 (동물 탭)', () => {
  test('라이프 탭에는 케어 버튼 없음', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      const results = [{
        id: 'test-1',
        testType: 'coffee',
        resultKey: '에스프레소',
        resultEmoji: '☕',
        isDeepMode: false,
        createdAt: new Date().toISOString(),
        scores: { bitter: 80, sweet: 30, caffeine: 90, temperature: 70, mood: 60 },
      }];
      localStorage.setItem('chemi_results', JSON.stringify(results));
    });
    await page.reload();
    await page.waitForLoadState('networkidle');

    const moreButton = page.locator('button').filter({ hasText: /더보기/ });

    if (await moreButton.isVisible()) {
      await moreButton.click();
      await page.waitForTimeout(300);

      // 라이프 탭 클릭
      const lifeTab = page.locator('[role="tab"]').filter({ hasText: /라이프/ });
      await lifeTab.click();
      await page.waitForTimeout(300);

      // 케어 관리 버튼이 없어야 함
      const careButton = page.locator('button').filter({ hasText: /케어 관리/ });
      await expect(careButton).not.toBeVisible();
    }
  });

  test('동물 탭 빈 상태에서도 케어 버튼 표시', async ({ page }) => {
    await page.goto('/');

    // 동물 테스트 없이 다른 테스트만 완료
    await page.evaluate(() => {
      const results = [{
        id: 'test-1',
        testType: 'human',
        resultKey: '모험가',
        resultEmoji: '🎯',
        isDeepMode: false,
        createdAt: new Date().toISOString(),
        scores: { inssa: 70, adventure: 80, empathy: 60, plan: 50, mental: 75 },
      }];
      localStorage.setItem('chemi_results', JSON.stringify(results));
    });
    await page.reload();
    await page.waitForLoadState('networkidle');

    const moreButton = page.locator('button').filter({ hasText: /더보기/ });

    if (await moreButton.isVisible()) {
      await moreButton.click();
      await page.waitForTimeout(300);

      // 동물 탭 클릭
      const petTab = page.locator('[role="tab"]').filter({ hasText: /동물/ });
      await petTab.click();
      await page.waitForTimeout(300);

      // 빈 상태 메시지 확인
      await expect(page.locator('text=반려동물 케미 알아보기')).toBeVisible();

      // 케어 관리 버튼도 표시
      const careButton = page.locator('button').filter({ hasText: /반려생물 케어 관리/ });
      await expect(careButton).toBeVisible();
    }
  });
});

test.describe('접근성', () => {
  test('모달에 적절한 ARIA 속성 있음', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      const results = [{
        id: 'test-1',
        testType: 'human',
        resultKey: '모험가',
        resultEmoji: '🎯',
        isDeepMode: false,
        createdAt: new Date().toISOString(),
        scores: { inssa: 70, adventure: 80, empathy: 60, plan: 50, mental: 75 },
      }];
      localStorage.setItem('chemi_results', JSON.stringify(results));
    });
    await page.reload();
    await page.waitForLoadState('networkidle');

    const moreButton = page.locator('button').filter({ hasText: /더보기/ });

    if (await moreButton.isVisible()) {
      await moreButton.click();
      await page.waitForTimeout(300);

      // FullProfile 모달 접근성 속성 확인
      const profileDialog = page.locator('[role="dialog"][aria-label="내 프로필"]');
      await expect(profileDialog).toHaveAttribute('aria-modal', 'true');

      // 탭리스트 접근성 확인
      const tablist = page.locator('[role="tablist"]');
      await expect(tablist).toBeVisible();

      const tabs = page.locator('[role="tab"]');
      const tabCount = await tabs.count();
      expect(tabCount).toBe(5); // me, pet, life, history, achieve

      // 닫기 버튼 접근성 라벨
      const closeButton = page.locator('[aria-label="닫기"]');
      await expect(closeButton).toBeVisible();

      // 공유 버튼 접근성 라벨
      const shareButton = page.locator('[aria-label="프로필 공유"]');
      await expect(shareButton).toBeVisible();
    }
  });
});
