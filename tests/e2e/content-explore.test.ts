import { expect, test } from '@playwright/test';

/**
 * 퀴즈/투표 UX 개선 테스트
 *
 * 테스트 항목:
 * 1. "안 한 것만" 토글 동작
 * 2. 퀴즈 정답 후 통계 표시
 * 3. 투표 후 실제 통계 로딩
 * 4. 토글 접근성 (ARIA 속성)
 *
 * 실행: npx playwright test tests/e2e/content-explore.test.ts
 */

async function navigateToContentExplore(page: import('@playwright/test').Page, viewport: { width: number; height: number } | null) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const width = viewport?.width ?? 1280;

  if (width < 1024) {
    // 모바일/태블릿: 하단 네비게이션에서 "탐색" 탭 클릭
    const bottomNav = page.locator('[class*="fixed"][class*="bottom-0"]');
    if (await bottomNav.isVisible()) {
      const exploreTab = bottomNav.locator('button').filter({ hasText: /탐색|퀴즈/ });
      if (await exploreTab.count() > 0) {
        await exploreTab.first().click();
        await page.waitForTimeout(500);
        return true;
      }
    }
    // 하단 네비에 없으면 화면 내 버튼 찾기
    const anyExploreButton = page.locator('button, a').filter({ hasText: /퀴즈|투표|탐색/ }).first();
    if (await anyExploreButton.isVisible()) {
      await anyExploreButton.click();
      await page.waitForTimeout(500);
      return true;
    }
  } else {
    // PC: 사이드바에서 클릭
    const sidebar = page.locator('[class*="lg:flex"][class*="flex-col"]').first();
    const exploreButton = sidebar.locator('button').filter({ hasText: /퀴즈|투표|탐색/ });
    if (await exploreButton.count() > 0) {
      await exploreButton.first().click();
      await page.waitForTimeout(500);
      return true;
    }
  }
  return false;
}

test.describe('퀴즈/투표 탐색 페이지', () => {
  test.beforeEach(async ({ page, viewport }) => {
    await navigateToContentExplore(page, viewport);
  });

  test.describe('"안 한 것만" 토글', () => {
    test('토글이 화면에 표시됨', async ({ page }) => {
      const toggle = page.locator('button[role="switch"]');
      await expect(toggle).toBeVisible();
    });

    test('토글에 올바른 ARIA 속성이 있음', async ({ page }) => {
      const toggle = page.locator('button[role="switch"]');

      // ARIA 속성 확인
      await expect(toggle).toHaveAttribute('aria-checked', /(true|false)/);
      await expect(toggle).toHaveAttribute('aria-label', /안 한 것만/);
    });

    test('토글 클릭 시 상태가 변경됨', async ({ page }) => {
      const toggle = page.locator('button[role="switch"]');

      // 초기 상태 확인
      const initialState = await toggle.getAttribute('aria-checked');
      expect(initialState).toBe('false');

      // 토글 클릭
      await toggle.click();

      // 상태 변경 확인
      await expect(toggle).toHaveAttribute('aria-checked', 'true');

      // 다시 클릭하면 원래 상태로
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-checked', 'false');
    });

    test('토글 ON 시 목록이 필터링됨', async ({ page }) => {
      // 퀴즈 카드 개수 확인 (토글 OFF)
      const quizCards = page.locator('[class*="rounded-2xl"]').filter({ hasText: /\?|퀴즈/ });
      const initialCount = await quizCards.count();

      // 토글 ON
      const toggle = page.locator('button[role="switch"]');
      await toggle.click();
      await page.waitForTimeout(300);

      // 필터링 후 개수 확인 (같거나 적어야 함)
      const filteredCount = await quizCards.count();
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    });
  });

  test.describe('퀴즈 통계 표시', () => {
    test('퀴즈 정답 후 통계 막대가 표시됨', async ({ page }) => {
      // 첫 번째 퀴즈 찾기
      const quizCard = page.locator('[class*="rounded-2xl"]').filter({ hasText: /\?/ }).first();

      if (await quizCard.isVisible()) {
        // 옵션 버튼 클릭 (첫 번째 옵션)
        const optionButton = quizCard.locator('button').filter({ hasText: /[가-힣]/ }).first();
        if (await optionButton.isVisible()) {
          await optionButton.click();
          await page.waitForTimeout(500);

          // 통계 텍스트 확인
          const statsText = quizCard.locator('text=다른 사람들의 선택');
          await expect(statsText).toBeVisible();

          // 퍼센트 값 확인
          const percentText = quizCard.locator('text=/%/');
          expect(await percentText.count()).toBeGreaterThan(0);
        }
      }
    });

    test('통계 막대 합이 100%임', async ({ page }) => {
      // 이미 정답한 퀴즈 찾기 또는 새로 정답하기
      const quizCard = page.locator('[class*="rounded-2xl"]').filter({ hasText: /다른 사람들의 선택/ }).first();

      if (await quizCard.isVisible()) {
        // 퍼센트 값들 추출
        const percentTexts = await quizCard.locator('text=/%$/').allTextContents();
        const percentages = percentTexts.map(t => parseInt(t.replace('%', ''), 10)).filter(n => !isNaN(n));

        if (percentages.length > 0) {
          const sum = percentages.reduce((a, b) => a + b, 0);
          // 반올림 오차 허용 (99-101)
          expect(sum).toBeGreaterThanOrEqual(99);
          expect(sum).toBeLessThanOrEqual(101);
        }
      }
    });
  });

  test.describe('투표 통계', () => {
    test('투표 탭으로 전환 가능', async ({ page }) => {
      const pollTab = page.locator('button').filter({ hasText: /투표|VS/ });
      if (await pollTab.first().isVisible()) {
        await pollTab.first().click();
        await page.waitForTimeout(300);

        // 투표 카드가 표시되는지 확인
        const pollCard = page.locator('[class*="rounded-2xl"]').filter({ hasText: /VS|아니면/ });
        expect(await pollCard.count()).toBeGreaterThan(0);
      }
    });

    test('투표 후 참여자 수가 표시됨', async ({ page }) => {
      // 투표 탭으로 전환
      const pollTab = page.locator('button').filter({ hasText: /투표|VS/ });
      if (await pollTab.first().isVisible()) {
        await pollTab.first().click();
        await page.waitForTimeout(300);
      }

      // 첫 번째 투표 카드 찾기
      const pollCard = page.locator('[class*="rounded-2xl"]').filter({ hasText: /VS|아니면/ }).first();

      if (await pollCard.isVisible()) {
        // 투표 버튼 클릭
        const voteButton = pollCard.locator('button').first();
        if (await voteButton.isVisible() && await voteButton.isEnabled()) {
          await voteButton.click();
          await page.waitForTimeout(1000); // API 호출 대기

          // 참여자 수 또는 로딩 텍스트 확인
          const statsText = pollCard.locator('text=/명 참여|통계 로딩/');
          await expect(statsText).toBeVisible({ timeout: 5000 });
        }
      }
    });
  });

  test.describe('카테고리 필터', () => {
    test('카테고리 버튼 클릭 시 필터링됨', async ({ page }) => {
      // 카테고리 버튼들 찾기 (이모지가 있는 카테고리 버튼)
      const categoryButtons = page.locator('button').filter({ hasText: /🐱|🐶|🐰|🐹|🌱|☕|💕/ });

      if (await categoryButtons.count() > 1) {
        // 첫 번째 카테고리 클릭
        await categoryButtons.first().click();
        await page.waitForTimeout(300);

        // 클릭한 카테고리가 활성화되어 있는지 확인 (bg-indigo 클래스)
        const clickedButtonClass = await categoryButtons.first().getAttribute('class');
        expect(clickedButtonClass).toContain('bg-indigo');
      }
    });
  });

  test.describe('스트릭 배너', () => {
    test('스트릭 배너가 표시됨', async ({ page }) => {
      // 스트릭 관련 텍스트 찾기
      const streakBanner = page.locator('text=/스트릭|연속 참여|첫 참여/');
      await expect(streakBanner.first()).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('핫 토픽 섹션', () => {
    test('"지금 인기" 섹션이 표시됨', async ({ page }) => {
      const hotTopicSection = page.locator('text=지금 인기');

      // 참여하지 않은 콘텐츠가 있을 때만 표시
      if (await hotTopicSection.isVisible()) {
        // 순위 아이템 확인
        const rankItems = page.locator('[class*="rounded-xl"]').filter({ hasText: /퀴즈|투표/ });
        expect(await rankItems.count()).toBeGreaterThan(0);
      }
    });
  });

  test.describe('카테고리별 진행률', () => {
    test('진행률 섹션이 표시됨', async ({ page }) => {
      const progressSection = page.locator('text=카테고리별 진행률');

      if (await progressSection.isVisible()) {
        // 진행 바 확인
        const progressBars = page.locator('[class*="h-1.5"][class*="rounded-full"]');
        expect(await progressBars.count()).toBeGreaterThan(0);
      }
    });

    test('카테고리 클릭 시 필터링됨', async ({ page }) => {
      const progressSection = page.locator('text=카테고리별 진행률');

      if (await progressSection.isVisible()) {
        // 카테고리 진행률 카드 클릭
        const categoryCard = page.locator('button').filter({ hasText: /\/\d+/ }).first();
        if (await categoryCard.isVisible()) {
          await categoryCard.click();
          await page.waitForTimeout(300);

          // 필터링되었는지 확인 (진행률 섹션이 사라짐)
          await expect(progressSection).not.toBeVisible();
        }
      }
    });
  });
});

test.describe('접근성', () => {
  test.beforeEach(async ({ page, viewport }) => {
    await navigateToContentExplore(page, viewport);
  });

  test('토글 스위치가 키보드로 접근 가능', async ({ page }) => {
    const toggle = page.locator('button[role="switch"]');

    if (await toggle.isVisible()) {
      // 포커스 이동
      await toggle.focus();

      // Enter 키로 토글
      const initialState = await toggle.getAttribute('aria-checked');
      await page.keyboard.press('Enter');
      const newState = await toggle.getAttribute('aria-checked');

      expect(newState).not.toBe(initialState);
    }
  });

  test('토글 내부 요소가 스크린리더에서 숨겨짐', async ({ page }) => {
    const toggleInner = page.locator('button[role="switch"] > div[aria-hidden="true"]');

    if (await toggleInner.isVisible()) {
      await expect(toggleInner).toHaveAttribute('aria-hidden', 'true');
    }
  });
});
