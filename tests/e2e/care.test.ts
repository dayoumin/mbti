import { expect, test } from '@playwright/test';

/**
 * 케어 시스템 E2E 테스트
 *
 * 실행: npm test -- --project=e2e-mobile tests/e2e/care.test.ts
 * 전체: npm test -- --project=e2e-mobile,e2e-tablet,e2e-desktop tests/e2e/care.test.ts
 */

test.describe('케어 탭 접근', () => {
  test.beforeEach(async ({ page }) => {
    // localStorage 초기화
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('chemi_care_profiles');
      localStorage.removeItem('chemi_care_schedules');
      localStorage.removeItem('chemi_care_logs');
    });
    await page.waitForLoadState('networkidle');
  });

  test('케어 탭으로 이동', async ({ page, viewport }) => {
    const width = viewport?.width ?? 1280;

    if (width < 1024) {
      // 모바일/태블릿: BottomNav에서 케어 탭 클릭
      const bottomNav = page.locator('[class*="fixed"][class*="bottom-0"]');
      await expect(bottomNav).toBeVisible();

      const careButton = bottomNav.locator('button').filter({ hasText: /케어/ });
      await careButton.click();
    } else {
      // PC: Sidebar에서 케어 메뉴 클릭
      const sidebar = page.locator('[class*="lg:flex"][class*="w-60"]');
      await expect(sidebar).toBeVisible();

      const careMenu = sidebar.locator('button, a').filter({ hasText: /케어/ });
      await careMenu.click();
    }

    await page.waitForTimeout(500);

    // 케어 홈 화면 확인
    await expect(page.locator('text=케어 홈')).toBeVisible();
  });

  test('빈 상태에서 케어 홈 표시', async ({ page, viewport }) => {
    const width = viewport?.width ?? 1280;

    // 케어 탭으로 이동
    if (width < 1024) {
      const careButton = page.locator('[class*="fixed"][class*="bottom-0"] button').filter({ hasText: /케어/ });
      await careButton.click();
    } else {
      const careMenu = page.locator('[class*="lg:flex"][class*="w-60"] button, a').filter({ hasText: /케어/ });
      await careMenu.click();
    }

    await page.waitForTimeout(500);

    // 빈 상태 메시지 확인
    await expect(page.locator('text=돌보는 친구가 없어요')).toBeVisible();

    // 추가 버튼 확인
    await expect(page.locator('button').filter({ hasText: /추가/ })).toBeVisible();
  });
});

test.describe('프로필 추가', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('chemi_care_profiles');
      localStorage.removeItem('chemi_care_schedules');
      localStorage.removeItem('chemi_care_logs');
    });
    await page.waitForLoadState('networkidle');

    // 케어 탭으로 이동
    const viewport = page.viewportSize();
    const width = viewport?.width ?? 1280;

    if (width < 1024) {
      await page.locator('[class*="fixed"][class*="bottom-0"] button').filter({ hasText: /케어/ }).click();
    } else {
      await page.locator('[class*="lg:flex"][class*="w-60"] button, a').filter({ hasText: /케어/ }).click();
    }
    await page.waitForTimeout(500);
  });

  test('식물 프로필 추가', async ({ page }) => {
    // 추가 버튼 클릭
    await page.locator('button').filter({ hasText: /추가/ }).click();
    await page.waitForTimeout(300);

    // 타입 선택 모달 확인
    await expect(page.locator('text=누구를 추가할까요?')).toBeVisible();

    // 식물 선택
    await page.locator('button').filter({ hasText: /식물/ }).click();
    await page.waitForTimeout(300);

    // 이름 입력 폼 확인
    await expect(page.locator('input[placeholder*="이름"]')).toBeVisible();

    // 이름 입력
    await page.locator('input[placeholder*="이름"]').fill('테스트 몬스테라');

    // 추가하기 버튼 클릭
    await page.locator('button').filter({ hasText: /추가하기/ }).click();
    await page.waitForTimeout(500);

    // 프로필 목록에 추가됨 확인
    await expect(page.locator('text=테스트 몬스테라')).toBeVisible();
  });

  test('강아지 프로필 추가', async ({ page }) => {
    await page.locator('button').filter({ hasText: /추가/ }).click();
    await page.waitForTimeout(300);

    // 강아지 선택
    await page.locator('button').filter({ hasText: /강아지/ }).click();
    await page.waitForTimeout(300);

    // 이름 입력
    await page.locator('input[placeholder*="이름"]').fill('테스트 멍이');

    // 품종 입력 (선택)
    const breedInput = page.locator('input[placeholder*="견종"]');
    if (await breedInput.isVisible()) {
      await breedInput.fill('말티즈');
    }

    await page.locator('button').filter({ hasText: /추가하기/ }).click();
    await page.waitForTimeout(500);

    await expect(page.locator('text=테스트 멍이')).toBeVisible();
  });

  test('ESC 키로 모달 닫기', async ({ page }) => {
    await page.locator('button').filter({ hasText: /추가/ }).click();
    await page.waitForTimeout(300);

    await expect(page.locator('text=누구를 추가할까요?')).toBeVisible();

    // ESC 키 누르기
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // 모달이 닫혔는지 확인
    await expect(page.locator('text=누구를 추가할까요?')).not.toBeVisible();
  });
});

test.describe('케어 스케줄', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // 테스트용 프로필 생성
    await page.evaluate(() => {
      const profile = {
        id: 'test-plant-1',
        type: 'plant',
        name: '테스트 식물',
        species: '몬스테라',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const schedule = {
        id: 'test-schedule-1',
        profileId: 'test-plant-1',
        type: 'water',
        name: '물주기',
        emoji: '💧',
        frequency: 'weekly',
        enabled: true,
        nextDue: new Date().toISOString().split('T')[0], // 오늘
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('chemi_care_profiles', JSON.stringify([profile]));
      localStorage.setItem('chemi_care_schedules', JSON.stringify([schedule]));
      localStorage.setItem('chemi_care_logs', JSON.stringify([]));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // 케어 탭으로 이동
    const viewport = page.viewportSize();
    const width = viewport?.width ?? 1280;

    if (width < 1024) {
      await page.locator('[class*="fixed"][class*="bottom-0"] button').filter({ hasText: /케어/ }).click();
    } else {
      await page.locator('[class*="lg:flex"][class*="w-60"] button, a').filter({ hasText: /케어/ }).click();
    }
    await page.waitForTimeout(500);
  });

  test('오늘 할 일 목록에 스케줄 표시', async ({ page }) => {
    // 오늘 할 일 탭이 기본 선택
    await expect(page.locator('text=지금 해주세요!')).toBeVisible();

    // 테스트 식물 스케줄 확인
    await expect(page.locator('text=테스트 식물')).toBeVisible();
    await expect(page.locator('text=물주기')).toBeVisible();
  });

  test('케어 완료 처리', async ({ page }) => {
    // 체크 버튼 클릭
    const checkButton = page.locator('[class*="rounded-full"]').filter({ has: page.locator('svg') }).first();
    await checkButton.click();
    await page.waitForTimeout(500);

    // 완료 후 목록에서 사라짐 확인 (또는 다가오는 일정으로 이동)
    // 기록 탭에서 확인
    await page.locator('button').filter({ hasText: /기록/ }).click();
    await page.waitForTimeout(300);

    await expect(page.locator('text=테스트 식물 - 💧 물주기')).toBeVisible();
  });
});

test.describe('프로필 상세 및 삭제', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      const profile = {
        id: 'test-cat-1',
        type: 'cat',
        name: '테스트 냥이',
        breed: '코숏',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        testResult: {
          resultKey: '철학냥이',
          resultEmoji: '🧐',
          completedAt: new Date().toISOString(),
        },
      };

      localStorage.setItem('chemi_care_profiles', JSON.stringify([profile]));
      localStorage.setItem('chemi_care_schedules', JSON.stringify([]));
      localStorage.setItem('chemi_care_logs', JSON.stringify([]));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // 케어 탭으로 이동
    const viewport = page.viewportSize();
    const width = viewport?.width ?? 1280;

    if (width < 1024) {
      await page.locator('[class*="fixed"][class*="bottom-0"] button').filter({ hasText: /케어/ }).click();
    } else {
      await page.locator('[class*="lg:flex"][class*="w-60"] button, a').filter({ hasText: /케어/ }).click();
    }
    await page.waitForTimeout(500);
  });

  test('프로필 상세 보기', async ({ page }) => {
    // 내 친구들 탭 클릭
    await page.locator('button').filter({ hasText: /내 친구들/ }).click();
    await page.waitForTimeout(300);

    // 프로필 클릭
    await page.locator('button').filter({ hasText: /테스트 냥이/ }).click();
    await page.waitForTimeout(300);

    // 상세 모달 확인
    await expect(page.locator('text=테스트 냥이')).toBeVisible();
    await expect(page.locator('text=코숏')).toBeVisible();

    // 테스트 결과 배지 확인
    await expect(page.locator('text=케미 테스트 결과')).toBeVisible();
    await expect(page.locator('text=철학냥이')).toBeVisible();
  });

  test('프로필 삭제', async ({ page }) => {
    // 내 친구들 탭 클릭
    await page.locator('button').filter({ hasText: /내 친구들/ }).click();
    await page.waitForTimeout(300);

    // 프로필 클릭
    await page.locator('button').filter({ hasText: /테스트 냥이/ }).click();
    await page.waitForTimeout(300);

    // 삭제 버튼 클릭
    await page.locator('button').filter({ hasText: /삭제/ }).click();
    await page.waitForTimeout(300);

    // 확인 버튼 클릭
    await page.locator('button').filter({ hasText: /삭제 확인/ }).click();
    await page.waitForTimeout(500);

    // 프로필이 삭제됨 확인
    await expect(page.locator('text=테스트 냥이')).not.toBeVisible();
    await expect(page.locator('text=아직 등록된 친구가 없어요')).toBeVisible();
  });
});

test.describe('테스트 결과 → 케어 연동', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('chemi_care_profiles');
      localStorage.removeItem('chemi_care_schedules');
      localStorage.removeItem('chemi_care_logs');
    });
    await page.waitForLoadState('networkidle');
  });

  test('연동 불가 테스트에서는 케어 프롬프트 미표시', async ({ page }) => {
    // coffee 테스트 진행 (케어 연동 불가)
    const coffeeCard = page.locator('button, [role="button"]').filter({ hasText: /커피/ }).first();

    if (await coffeeCard.count() > 0 && await coffeeCard.isVisible()) {
      await coffeeCard.click();
      await page.waitForTimeout(300);

      // 시작 버튼 클릭
      const startButton = page.locator('button').filter({ hasText: /시작|테스트/ }).first();
      if (await startButton.isVisible()) {
        await startButton.click();
        await page.waitForTimeout(300);

        // 모든 질문에 첫 번째 답변 선택
        for (let i = 0; i < 15; i++) {
          const answer = page.locator('button').filter({ hasText: /.{5,}/ }).first();
          if (await answer.isVisible()) {
            await answer.click();
            await page.waitForTimeout(200);
          } else {
            break;
          }
        }

        // 결과 화면에서 케어 프롬프트가 없어야 함
        await page.waitForTimeout(500);
        await expect(page.locator('text=케어 프로필 만들기')).not.toBeVisible();
      }
    }
  });
});
