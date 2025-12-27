import { test, expect } from '@playwright/test';

/**
 * 반응형 레이아웃 일관성 테스트
 *
 * 검증 항목:
 * 1. 사이드바 너비와 메인 콘텐츠 마진 일치
 * 2. 브레이크포인트별 요소 표시/숨김
 * 3. 모달 레이아웃 일관성
 * 4. z-index 계층 구조
 */

test.describe('반응형 레이아웃 - 사이드바 & 마진 일관성', () => {

  test('데스크톱(≥1024px): 좌측 사이드바 표시 + 메인 콘텐츠 ml-60', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // 좌측 사이드바 표시 확인
    const sidebar = page.locator('[role="navigation"]').filter({ hasText: '홈' }).first();
    await expect(sidebar).toBeVisible();

    // 사이드바 너비 확인 (w-60 = 240px)
    const sidebarBox = await sidebar.boundingBox();
    expect(sidebarBox?.width).toBeCloseTo(240, 10); // ±10px 허용

    // 메인 콘텐츠 왼쪽 마진 확인 (lg:ml-60 = 240px)
    const main = page.locator('main').first();
    const mainBox = await main.boundingBox();
    expect(mainBox?.x).toBeCloseTo(240, 10); // 좌측 여백 = 사이드바 너비
  });

  test('대형 데스크톱(≥1280px): 우측 사이드바 표시 + 메인 콘텐츠 mr-80', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // 우측 사이드바 표시 확인 (xl:block)
    const rightSidebar = page.locator('aside').filter({ hasText: '커뮤니티' }).first();
    await expect(rightSidebar).toBeVisible();

    // 우측 사이드바 너비 확인 (w-80 = 320px)
    const rightSidebarBox = await rightSidebar.boundingBox();
    expect(rightSidebarBox?.width).toBeCloseTo(320, 10);

    // 메인 콘텐츠 우측 여백 확인
    const main = page.locator('main').first();
    const mainBox = await main.boundingBox();
    const viewportWidth = 1440;
    const expectedRightMargin = 320; // xl:mr-80

    // 메인 콘텐츠 우측 끝이 우측 사이드바 시작점과 일치하는지
    const mainRightEdge = (mainBox?.x || 0) + (mainBox?.width || 0);
    const sidebarLeftEdge = viewportWidth - expectedRightMargin;
    expect(mainRightEdge).toBeLessThanOrEqual(sidebarLeftEdge + 20); // 패딩 고려
  });

  test('모바일(<1024px): 사이드바 숨김 + 하단 네비게이션 표시', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');

    // 좌측/우측 사이드바 숨김 확인
    const sidebar = page.locator('[role="navigation"]').filter({ hasText: '홈' }).first();
    await expect(sidebar).toBeHidden();

    // 하단 네비게이션 표시 확인
    const bottomNav = page.locator('[aria-label="하단 네비게이션"]');
    await expect(bottomNav).toBeVisible();

    // 하단 네비게이션 위치 확인 (화면 하단 고정)
    const bottomNavBox = await bottomNav.boundingBox();
    expect(bottomNavBox?.y).toBeGreaterThan(600); // 화면 하단 근처

    // 메인 콘텐츠 하단 패딩 확인 (pb-20 = 80px, 하단 네비 공간)
    const main = page.locator('main').first();
    const mainStyle = await main.evaluate(el => window.getComputedStyle(el).paddingBottom);
    expect(parseInt(mainStyle)).toBeGreaterThan(60); // 최소 60px 이상
  });

  test('태블릿(768-1024px): 모바일과 동일한 레이아웃', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/');

    // 사이드바 숨김
    const sidebar = page.locator('[role="navigation"]').filter({ hasText: '홈' }).first();
    await expect(sidebar).toBeHidden();

    // 하단 네비게이션 표시
    const bottomNav = page.locator('[aria-label="하단 네비게이션"]');
    await expect(bottomNav).toBeVisible();
  });
});

test.describe('반응형 레이아웃 - 모달 일관성', () => {

  test('데스크톱: 모달이 좌측 사이드바 우측에 표시 (lg:left-60)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // 탐색 탭 클릭하여 ContentExplore 모달 열기
    await page.click('[aria-label="하단 네비게이션"] >> text=탐색');

    // 모달이 좌측 여백과 함께 표시되는지 확인
    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible();

    const modalBox = await modal.boundingBox();
    expect(modalBox?.x).toBeCloseTo(240, 10); // lg:left-60 = 240px
  });

  test('모바일: 모달이 전체 화면으로 표시', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // 탐색 탭 클릭
    await page.click('[aria-label="하단 네비게이션"] >> text=탐색');

    // 모달이 전체 너비로 표시되는지 확인
    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible();

    const modalBox = await modal.boundingBox();
    expect(modalBox?.x).toBeCloseTo(0, 5); // 좌측 여백 없음
    expect(modalBox?.width).toBeCloseTo(375, 10); // 전체 너비
  });

  test('모달 내부 우측 사이드바 너비 일관성 (w-80)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // ContentExplore 모달 열기
    await page.click('[aria-label="하단 네비게이션"] >> text=탐색');

    // 모달 내부 우측 사이드바 확인
    const modalSidebar = page.locator('[role="dialog"] aside').first();
    await expect(modalSidebar).toBeVisible();

    const sidebarBox = await modalSidebar.boundingBox();
    expect(sidebarBox?.width).toBeCloseTo(320, 10); // w-80 = 320px
  });
});

test.describe('반응형 레이아웃 - z-index 계층', () => {

  test('z-index 계층 구조 검증', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // 사이드바 z-index (z-40)
    const sidebar = page.locator('[role="navigation"]').filter({ hasText: '홈' }).first();
    const sidebarZIndex = await sidebar.evaluate(el => window.getComputedStyle(el).zIndex);
    expect(parseInt(sidebarZIndex)).toBe(40);

    // 모달 열기
    await page.click('[aria-label="하단 네비게이션"] >> text=탐색');

    // 모달 z-index (z-50)
    const modal = page.locator('[role="dialog"]').first();
    const modalZIndex = await modal.evaluate(el => window.getComputedStyle(el).zIndex);
    expect(parseInt(modalZIndex)).toBe(50);

    // 하단 네비게이션 z-index (z-[60])
    const bottomNav = page.locator('[aria-label="하단 네비게이션"]');
    const bottomNavZIndex = await bottomNav.evaluate(el => window.getComputedStyle(el).zIndex);
    expect(parseInt(bottomNavZIndex)).toBe(60);
  });

  test('모바일: 하단 네비가 모달 위에 표시됨', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // 모달 열기
    await page.click('[aria-label="하단 네비게이션"] >> text=탐색');

    // 하단 네비가 여전히 보이는지 확인 (z-[60] > z-50)
    const bottomNav = page.locator('[aria-label="하단 네비게이션"]');
    await expect(bottomNav).toBeVisible();
  });
});

test.describe('반응형 레이아웃 - 브레이크포인트 전환', () => {

  test('1024px 전후 브레이크포인트 전환', async ({ page }) => {
    await page.goto('/');

    // 1023px: 사이드바 숨김, 하단 네비 표시
    await page.setViewportSize({ width: 1023, height: 800 });
    const sidebar1023 = page.locator('[role="navigation"]').filter({ hasText: '홈' }).first();
    const bottomNav1023 = page.locator('[aria-label="하단 네비게이션"]');

    await expect(sidebar1023).toBeHidden();
    await expect(bottomNav1023).toBeVisible();

    // 1024px: 사이드바 표시, 하단 네비 숨김
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.waitForTimeout(200); // 애니메이션 대기

    const sidebar1024 = page.locator('[role="navigation"]').filter({ hasText: '홈' }).first();
    const bottomNav1024 = page.locator('[aria-label="하단 네비게이션"]');

    await expect(sidebar1024).toBeVisible();
    await expect(bottomNav1024).toBeHidden();
  });

  test('1280px 전후 우측 사이드바 전환', async ({ page }) => {
    await page.goto('/');

    // 1279px: 우측 사이드바 숨김
    await page.setViewportSize({ width: 1279, height: 800 });
    const rightSidebar1279 = page.locator('aside').filter({ hasText: '커뮤니티' }).first();
    await expect(rightSidebar1279).toBeHidden();

    // 1280px: 우측 사이드바 표시
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(200); // 애니메이션 대기

    const rightSidebar1280 = page.locator('aside').filter({ hasText: '커뮤니티' }).first();
    await expect(rightSidebar1280).toBeVisible();
  });
});

test.describe('반응형 레이아웃 - 실제 사용 시나리오', () => {

  test('모바일: 테스트 시작 → 결과 화면까지 레이아웃 유지', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // 1. 홈 화면: 하단 네비 표시
    let bottomNav = page.locator('[aria-label="하단 네비게이션"]');
    await expect(bottomNav).toBeVisible();

    // 2. 테스트 시작
    await page.click('text=인간 유형 테스트');
    await page.click('text=테스트 시작하기');

    // 3. 질문 화면: 전체 화면 모드
    const testCard = page.locator('.glass-card').first();
    const testCardBox = await testCard.boundingBox();
    expect(testCardBox?.width).toBeGreaterThan(320); // 모바일 너비 확보

    // 4. 하단 패딩 확인 (하단 네비 공간)
    const main = page.locator('main').first();
    const mainStyle = await main.evaluate(el => window.getComputedStyle(el).paddingBottom);
    expect(parseInt(mainStyle)).toBeGreaterThan(60); // pb-20 적용
  });

  test('데스크톱: 대시보드 → 모달 열기 → 닫기 레이아웃 일관성', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // 1. 대시보드: 좌측/우측 사이드바 표시
    const sidebar = page.locator('[role="navigation"]').filter({ hasText: '홈' }).first();
    const rightSidebar = page.locator('aside').filter({ hasText: '커뮤니티' }).first();

    await expect(sidebar).toBeVisible();
    await expect(rightSidebar).toBeVisible();

    // 사이드바 위치 저장
    const sidebarBoxBefore = await sidebar.boundingBox();
    const rightSidebarBoxBefore = await rightSidebar.boundingBox();

    // 2. 모달 열기
    await page.click('[aria-label="하단 네비게이션"] >> text=탐색');
    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible();

    // 모달이 좌측 사이드바 우측에 위치
    const modalBox = await modal.boundingBox();
    expect(modalBox?.x).toBeCloseTo(240, 10); // lg:left-60

    // 3. 모달 닫기
    await page.click('[aria-label="닫기"]').first();
    await expect(modal).toBeHidden();

    // 4. 사이드바 위치 변화 없음 확인
    const sidebarBoxAfter = await sidebar.boundingBox();
    const rightSidebarBoxAfter = await rightSidebar.boundingBox();

    expect(sidebarBoxAfter?.x).toBe(sidebarBoxBefore?.x);
    expect(rightSidebarBoxAfter?.x).toBe(rightSidebarBoxBefore?.x);
  });
});

test.describe('반응형 레이아웃 - 코드 리뷰 검증', () => {

  test('수정 전후 비교: CommunityBoard lg:right-0 제거 확인', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // 커뮤니티 모달 열기
    await page.click('[aria-label="하단 네비게이션"] >> text=톡');

    const communityModal = page.locator('.fixed.inset-0.z-50').filter({ hasText: '커뮤니티' }).first();
    await expect(communityModal).toBeVisible();

    // lg:left-60 적용 확인 (240px)
    const modalBox = await communityModal.boundingBox();
    expect(modalBox?.x).toBeCloseTo(240, 10);

    // lg:right-0이 제거되어 자동으로 right가 계산되는지 확인
    // (inset-0으로 인해 right: 0이 기본 적용됨)
    const viewportWidth = 1280;
    const expectedRight = 0;
    const actualRight = viewportWidth - ((modalBox?.x || 0) + (modalBox?.width || 0));
    expect(actualRight).toBeCloseTo(expectedRight, 10);
  });

  test('수정 전후 비교: 모달 내부 사이드바 w-72 → w-80 확인', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // ContentExplore 모달 열기
    await page.click('[aria-label="하단 네비게이션"] >> text=탐색');

    // 모달 내부 우측 사이드바 너비 확인
    const modalSidebar = page.locator('[role="dialog"] aside').first();
    const sidebarBox = await modalSidebar.boundingBox();

    // w-80 = 320px (수정 전 w-72 = 288px)
    expect(sidebarBox?.width).toBeCloseTo(320, 10);
    expect(sidebarBox?.width).not.toBeCloseTo(288, 5); // 이전 값과 다름
  });

  test('메인 RightSidebar와 모달 내부 사이드바 너비 동일 확인', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // 메인 RightSidebar 너비
    const mainRightSidebar = page.locator('aside').filter({ hasText: '커뮤니티' }).first();
    const mainSidebarBox = await mainRightSidebar.boundingBox();

    // ContentExplore 모달 내부 사이드바 너비
    await page.click('[aria-label="하단 네비게이션"] >> text=탐색');
    const modalSidebar = page.locator('[role="dialog"] aside').first();
    const modalSidebarBox = await modalSidebar.boundingBox();

    // 두 사이드바 너비가 동일해야 함 (w-80 = 320px)
    expect(mainSidebarBox?.width).toBeCloseTo(modalSidebarBox?.width || 0, 5);
    expect(mainSidebarBox?.width).toBeCloseTo(320, 10);
  });
});
