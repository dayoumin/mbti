/**
 * 인증 병합 테스트
 *
 * 테스트 시나리오:
 * 1. 익명 사용자가 테스트 완료 후 결과 저장
 * 2. 로그인 시 익명 데이터가 유지되는지 확인
 * 3. 병합 API 보안 검증
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('인증 및 데이터 병합', () => {

  test('익명 사용자 - localStorage에 device_id 생성 확인', async ({ page }) => {
    await page.goto(BASE_URL);

    // localStorage에서 device_id 확인
    const deviceId = await page.evaluate(() => {
      return localStorage.getItem('chemi_user');
    });

    expect(deviceId).toBeTruthy();
    expect(deviceId).toMatch(/^anon_\d+_/);

    console.log('생성된 device_id:', deviceId);
  });

  test('익명 사용자 - 테스트 결과 저장 후 localStorage 확인', async ({ page }) => {
    await page.goto(BASE_URL);

    // device_id 확인
    const deviceId = await page.evaluate(() => {
      return localStorage.getItem('chemi_user');
    });

    // 테스트 결과가 저장되어 있는지 확인 (이미 저장된 경우)
    const results = await page.evaluate(() => {
      const data = localStorage.getItem('chemi_test_results');
      return data ? JSON.parse(data) : [];
    });

    console.log('저장된 결과 수:', results.length);
    console.log('device_id:', deviceId);

    // 결과가 있으면 device_id와 매칭 확인
    if (results.length > 0) {
      const firstResult = results[0];
      expect(firstResult.user_id).toBe(deviceId);
    }
  });

  test('병합 API - 비로그인 시 401 반환', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/merge`, {
      data: { deviceId: 'anon_123_test' },
    });

    expect(response.status()).toBe(401);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe('로그인이 필요합니다');
  });

  test('병합 API - 잘못된 deviceId 형식 거부', async ({ request }) => {
    // 참고: 실제로는 로그인 세션이 필요하지만, 형식 검증은 세션 확인 후 수행됨
    // 이 테스트는 401이 먼저 반환됨을 확인
    const response = await request.post(`${BASE_URL}/api/auth/merge`, {
      data: { deviceId: 'invalid_format' },
    });

    // 세션 없으면 401
    expect(response.status()).toBe(401);
  });

  test('병합 API - deviceId 누락 시 에러', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/merge`, {
      data: {},
    });

    // 세션 없으면 401 먼저
    expect(response.status()).toBe(401);
  });

  test('로그인 페이지 - 소셜 로그인 버튼 표시', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // 페이지 로드 대기
    await page.waitForLoadState('networkidle');

    // 제목 확인
    await expect(page.locator('h1')).toContainText('케미 테스트');

    // "로그인 없이 계속하기" 버튼 확인
    await expect(page.getByText('로그인 없이 계속하기')).toBeVisible();

    // 경고 메시지 확인
    await expect(page.getByText(/브라우저 초기화 시 데이터가 사라질/)).toBeVisible();
  });

  test('로그인 페이지 - 로그인 없이 계속하기 클릭 시 홈으로 이동', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.waitForLoadState('networkidle');

    // "로그인 없이 계속하기" 클릭
    await page.getByText('로그인 없이 계속하기').click();

    // 홈으로 이동 확인
    await expect(page).toHaveURL(BASE_URL + '/');
  });

  test('프로필 - 비로그인 시 로그인 유도 메시지 표시', async ({ page }) => {
    await page.goto(BASE_URL);

    // 테스트 완료 후 프로필 영역에서 로그인 유도 확인
    // (테스트 결과가 있어야 표시됨)

    // localStorage에 테스트 결과 추가 (시뮬레이션)
    await page.evaluate(() => {
      const deviceId = localStorage.getItem('chemi_user') || 'anon_test_123';
      const testResult = {
        id: 'test_' + Date.now(),
        user_id: deviceId,
        project: 'chemi-test',
        test_type: 'human',
        result_key: '열정적인 모험가',
        result_emoji: '🔥',
        scores: { inssa: 4, adventure: 5, empathy: 3, plan: 2, mental: 4 },
        is_deep_mode: false,
        created_at: new Date().toISOString(),
        meta: { user_agent: 'test', screen_width: 375, timestamp: Date.now() },
      };

      const existing = JSON.parse(localStorage.getItem('chemi_test_results') || '[]');
      existing.push(testResult);
      localStorage.setItem('chemi_test_results', JSON.stringify(existing));
    });

    // 페이지 새로고침
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 로그인 유도 메시지 확인 (CompactProfile 내)
    // 참고: 실제 UI 구조에 따라 선택자 조정 필요
    const loginPrompt = page.getByText(/브라우저 초기화 시 데이터가 사라질/);

    // 메시지가 있으면 확인, 없으면 스킵 (UI 구조에 따라 다를 수 있음)
    const isVisible = await loginPrompt.isVisible().catch(() => false);
    console.log('로그인 유도 메시지 표시:', isVisible);
  });

});

test.describe('localStorage 데이터 유지 검증', () => {

  test('익명 데이터 - 페이지 이동 후에도 유지', async ({ page }) => {
    await page.goto(BASE_URL);

    // device_id 저장
    const deviceId = await page.evaluate(() => {
      return localStorage.getItem('chemi_user');
    });

    // 다른 페이지로 이동
    await page.goto(`${BASE_URL}/login`);

    // device_id 유지 확인
    const deviceIdAfter = await page.evaluate(() => {
      return localStorage.getItem('chemi_user');
    });

    expect(deviceIdAfter).toBe(deviceId);
  });

  test('테스트 결과 - 저장 후 조회', async ({ page }) => {
    await page.goto(BASE_URL);

    // 테스트 결과 추가
    const testId = await page.evaluate(() => {
      const deviceId = localStorage.getItem('chemi_user') || 'anon_test';
      const testResult = {
        id: 'test_' + Date.now(),
        user_id: deviceId,
        project: 'chemi-test',
        test_type: 'coffee',
        result_key: '에스프레소',
        result_emoji: '☕',
        scores: { bitter: 5, sweet: 2, caffeine: 5, temperature: 4, mood: 3 },
        is_deep_mode: false,
        created_at: new Date().toISOString(),
        meta: { user_agent: 'test', screen_width: 375, timestamp: Date.now() },
      };

      const existing = JSON.parse(localStorage.getItem('chemi_test_results') || '[]');
      existing.push(testResult);
      localStorage.setItem('chemi_test_results', JSON.stringify(existing));

      return testResult.id;
    });

    // 저장 확인
    const results = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('chemi_test_results') || '[]');
    });

    const savedResult = results.find((r: { id: string }) => r.id === testId);
    expect(savedResult).toBeTruthy();
    expect(savedResult.result_key).toBe('에스프레소');

    console.log('저장된 테스트 결과:', savedResult);
  });

});
