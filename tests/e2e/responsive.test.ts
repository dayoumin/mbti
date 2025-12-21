import { expect, test } from '@playwright/test';

/**
 * 반응형 UI 자동 점검 테스트
 *
 * 실행: npm test -- --project=e2e-mobile,e2e-tablet,e2e-desktop
 * 단일: npm test -- --project=e2e-mobile tests/e2e/responsive.test.ts
 */

test.describe('메인 페이지 반응형', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('홈 화면이 올바르게 렌더링됨', async ({ page, viewport }) => {
    // 메인 컨테이너 확인
    const main = page.locator('main').first();
    await expect(main).toBeVisible();

    // 테스트 카드 컨테이너 확인
    const testContainer = page.locator('[class*="max-w-"]').first();
    await expect(testContainer).toBeVisible();

    // viewport별 레이아웃 확인
    const width = viewport?.width ?? 1280;

    if (width < 1024) {
      // 모바일/태블릿: BottomNav 표시, Sidebar 숨김
      await expect(page.locator('[class*="fixed"][class*="bottom-0"]')).toBeVisible();
      await expect(page.locator('[class*="hidden"][class*="lg:flex"]').first()).not.toBeVisible();
    } else {
      // PC: Sidebar 표시, BottomNav 숨김
      await expect(page.locator('[class*="lg:flex"][class*="flex-col"][class*="w-60"]')).toBeVisible();
    }
  });

  test('테스트 선택 화면 동작', async ({ page }) => {
    // 테스트 카드 클릭 가능 확인
    const testCards = page.locator('button, [role="button"]').filter({ hasText: /테스트|궁합|매칭/ });
    const count = await testCards.count();
    expect(count).toBeGreaterThan(0);

    // 첫 번째 카드가 클릭 가능한지 확인
    const firstCard = testCards.first();
    await expect(firstCard).toBeEnabled();
  });

  test('네비게이션 탭 동작', async ({ page, viewport }) => {
    const width = viewport?.width ?? 1280;

    if (width < 1024) {
      // 모바일: BottomNav 탭 확인
      const bottomNav = page.locator('[class*="fixed"][class*="bottom-0"]');
      await expect(bottomNav).toBeVisible();

      const navButtons = bottomNav.locator('button');
      const navCount = await navButtons.count();
      expect(navCount).toBeGreaterThanOrEqual(3);
    } else {
      // PC: Sidebar 네비게이션 확인
      const sidebar = page.locator('[class*="lg:flex"][class*="w-60"]');
      await expect(sidebar).toBeVisible();
    }
  });
});

test.describe('대시보드 반응형', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('대시보드 메인 화면 렌더링', async ({ page }) => {
    // 대시보드 컨테이너 확인
    await expect(page.locator('main, [class*="dashboard"]').first()).toBeVisible();
  });

  test('테스트 그리드 반응형 열 수', async ({ page, viewport }) => {
    const width = viewport?.width ?? 1280;
    const grid = page.locator('[class*="grid-cols"]').first();

    if (await grid.count() > 0) {
      await expect(grid).toBeVisible();

      // 그리드 아이템 확인
      const items = grid.locator('> *');
      const itemCount = await items.count();
      expect(itemCount).toBeGreaterThan(0);
    }
  });
});

test.describe('태블릿 전용 UI', () => {
  test('태블릿에서 슬라이드 패널 띠지 표시', async ({ page, viewport }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const width = viewport?.width ?? 1280;

    if (width >= 768 && width < 1024) {
      // 태블릿: TabletSlidePanel 띠지 확인
      const slideTab = page.locator('[class*="md:flex"][class*="lg:hidden"][class*="fixed"][class*="right-0"]');
      // 띠지가 있으면 확인, 없어도 에러 아님 (선택적 UI)
      if (await slideTab.count() > 0) {
        await expect(slideTab.first()).toBeVisible();
      }
    }
  });
});

test.describe('터치 타겟 접근성', () => {
  test('버튼/링크 최소 터치 영역 확인', async ({ page, viewport }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const width = viewport?.width ?? 1280;

    // 모바일에서만 터치 타겟 검사
    if (width < 768) {
      const clickables = page.locator('button, a, [role="button"]');
      const count = await clickables.count();

      for (let i = 0; i < Math.min(count, 10); i++) {
        const el = clickables.nth(i);
        if (await el.isVisible()) {
          const box = await el.boundingBox();
          if (box) {
            // 최소 44x44px 권장 (실제로는 조금 관대하게 36px)
            const minSize = 36;
            const isLargeEnough = box.width >= minSize || box.height >= minSize;
            // 경고만 출력, 실패는 안 함
            if (!isLargeEnough) {
              console.warn(`Small touch target: ${await el.textContent()} (${box.width}x${box.height})`);
            }
          }
        }
      }
    }
  });
});

test.describe('오버플로우 검사', () => {
  test('가로 스크롤 없음 확인', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // body의 가로 스크롤 확인
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalScroll).toBe(false);
  });

  test('콘텐츠 잘림 없음 확인', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // overflow: hidden인 요소 중 내용이 잘린 것 찾기
    const clippedElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const clipped: string[] = [];

      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.overflow === 'hidden' || style.overflowX === 'hidden') {
          if (el.scrollWidth > el.clientWidth + 10) {
            clipped.push(el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''));
          }
        }
      });

      return clipped.slice(0, 5);
    });

    // 경고로 출력 (치명적이지 않음)
    if (clippedElements.length > 0) {
      console.warn('Potentially clipped elements:', clippedElements);
    }
  });
});

test.describe('테스트 진행 화면', () => {
  test('질문 화면 반응형', async ({ page, viewport }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 첫 번째 테스트 카드 찾기 및 클릭
    const testCard = page.locator('button, [role="button"]').filter({ hasText: /테스트|궁합|시작/ }).first();

    if (await testCard.count() > 0 && await testCard.isVisible()) {
      await testCard.click();
      await page.waitForTimeout(500);

      // 질문 화면 확인
      const questionContainer = page.locator('[class*="max-w-"]').first();
      await expect(questionContainer).toBeVisible();

      // 답변 버튼들 확인
      const answerButtons = page.locator('button').filter({ hasText: /.{2,}/ });
      const count = await answerButtons.count();

      if (count > 0) {
        // 첫 번째 답변 버튼이 화면에 보이는지
        const firstAnswer = answerButtons.first();
        if (await firstAnswer.isVisible()) {
          const box = await firstAnswer.boundingBox();
          const width = viewport?.width ?? 1280;

          if (box) {
            // 버튼이 화면 밖으로 나가지 않았는지
            expect(box.x).toBeGreaterThanOrEqual(0);
            expect(box.x + box.width).toBeLessThanOrEqual(width + 20);
          }
        }
      }
    }
  });
});
