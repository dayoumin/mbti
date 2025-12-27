/**
 * ResultService - 테스트 결과 저장/조회 서비스
 *
 * 저장: Turso DB (서버) + localStorage (로컬 백업)
 * 조회: Turso 우선, 실패 시 localStorage 폴백
 */

import { ResultLabel } from '@/data/types';
import { CHEMI_DATA } from '@/data';
import {
  filterMainTests,
  pickColdStartTest,
  pickFirstAvailable,
  RECOMMENDATION_ORDER,
} from '@/data/recommendationPolicy';
import { getDeviceId, USER_KEY, storage } from '@/utils';
import { STORAGE_KEYS } from '@/lib/storage';
import { tursoService, TestResult } from './TursoService';

// ========== 타입 정의 ==========

interface TestResultData {
  id: string;
  user_id: string;
  project: string;
  test_type: string;
  result_key: string;
  result_emoji: string;
  scores: Record<string, number>;
  is_deep_mode: boolean;
  created_at: string;
  parent_test?: string;
  parent_result?: string;
  meta: {
    user_agent: string;
    screen_width: number;
    timestamp: number;
    response_time_ms?: number[];
  };
}

export interface TestResultCamel {
  id: string;
  userId: string;
  project: string;
  testType: string;
  resultKey: string;
  resultEmoji: string;
  scores: Record<string, number>;
  isDeepMode: boolean;
  createdAt: string;
  parentTest?: string;
  parentResult?: string;
  meta: {
    userAgent: string;
    screenWidth: number;
    timestamp: number;
    responseTimeMs?: number[];
  };
}

interface SaveResult {
  success: boolean;
  id?: string;
  error?: string;
  pending?: boolean;
}

interface RecommendedTest {
  testType: string;
  reason: 'new' | 'retest';
  lastDoneAt?: string;
}

interface Stats {
  totalTests: number;
  uniqueTests: number;
  deepModeCount: number;
  firstTestAt: string | null;
  lastTestAt: string | null;
  byTestType: Record<string, number>;
}

// ========== localStorage 백업 함수 ==========

function saveToLocalStorage(key: string, data: TestResultData): void {
  const existing = storage.get<TestResultData[]>(key, []);
  existing.push(data);
  storage.set(key, existing);
}

function getFromLocalStorage(key: string, userId: string): TestResultData[] {
  const all = storage.get<TestResultData[]>(key, []);
  return all.filter((item) => item.user_id === userId);
}

// ========== ResultService Class ==========

class ResultServiceClass {
  private RESULTS_KEY = STORAGE_KEYS.TEST_RESULTS;

  getUserId(): string {
    return getDeviceId();
  }

  setUserId(userId: string): void {
    storage.set(USER_KEY, userId);
  }

  async saveResult(
    testType: string,
    result: ResultLabel,
    scores: Record<string, number>,
    isDeep = false,
    parentInfo?: { testType: string; resultName: string },
    responseTimes?: number[]
  ): Promise<SaveResult> {
    const userId = this.getUserId();

    // 동일한 타임스탬프 사용 (Turso + localStorage 중복 방지)
    const timestamp = new Date().toISOString();

    // 1. Turso에 저장
    const tursoResult = await tursoService.saveTestResult(
      testType,
      result.name,
      result.emoji,
      scores,
      isDeep,
      parentInfo,
      timestamp,
      responseTimes
    );

    // 2. localStorage에도 백업 저장 (동일 타임스탬프)
    const localData: TestResultData = {
      id: tursoResult.id || Date.now() + '_' + Math.random().toString(36).substring(2, 11),
      user_id: userId,
      project: 'chemi-test',
      test_type: testType,
      result_key: result.name,
      result_emoji: result.emoji,
      scores: scores,
      is_deep_mode: isDeep,
      created_at: timestamp,
      parent_test: parentInfo?.testType,
      parent_result: parentInfo?.resultName,
      meta: {
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
        screen_width: typeof window !== 'undefined' ? window.innerWidth : 0,
        timestamp: Date.now(),
        response_time_ms: responseTimes || [],
      },
    };

    saveToLocalStorage(this.RESULTS_KEY, localData);

    // 3. 이벤트 발생
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('chemi:resultSaved', { detail: localData }));
    }

    return {
      success: tursoResult.success,
      id: tursoResult.id,
      pending: !tursoResult.success, // Turso 실패 시 pending 상태
    };
  }

  async getMyResults(): Promise<TestResultCamel[]> {
    const userId = this.getUserId();

    // 1. Turso에서 조회
    let tursoResults: TestResultCamel[] = [];
    try {
      const results = await tursoService.getMyResults();
      tursoResults = results.map((r: TestResult) => ({
        id: String(r.id),
        userId: userId,
        project: 'chemi-test',
        testType: r.testType,
        resultKey: r.resultKey,
        resultEmoji: r.resultEmoji,
        scores: r.scores,
        isDeepMode: r.isDeepMode,
        createdAt: r.createdAt,
        parentTest: r.parentTest,
        parentResult: r.parentResult,
        meta: {
          userAgent: '',
          screenWidth: 0,
          timestamp: new Date(r.createdAt).getTime(),
        },
      }));
    } catch (error) {
      console.warn('[ResultService] Turso 조회 실패:', error);
    }

    // 2. localStorage에서 조회
    const localResults = getFromLocalStorage(this.RESULTS_KEY, userId).map((r) => ({
      id: r.id,
      userId: r.user_id,
      project: r.project,
      testType: r.test_type,
      resultKey: r.result_key,
      resultEmoji: r.result_emoji,
      scores: r.scores,
      isDeepMode: r.is_deep_mode,
      createdAt: r.created_at,
      parentTest: r.parent_test,
      parentResult: r.parent_result,
      meta: {
        userAgent: r.meta.user_agent,
        screenWidth: r.meta.screen_width,
        timestamp: r.meta.timestamp,
        responseTimeMs: r.meta.response_time_ms,
      },
    }));

    // 3. 병합 (Turso 우선, localStorage는 Turso에 없는 것만 추가)
    // 중복 판단: testType + createdAt 조합
    const tursoKeys = new Set(
      tursoResults.map((r) => `${r.testType}_${r.createdAt}`)
    );

    const uniqueLocalResults = localResults.filter(
      (r) => !tursoKeys.has(`${r.testType}_${r.createdAt}`)
    );

    // 4. 병합 후 시간순 정렬 (최신 먼저)
    const merged = [...tursoResults, ...uniqueLocalResults].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return merged;
  }

  async getResultsByType(testType: string): Promise<TestResultCamel[]> {
    const results = await this.getMyResults();
    return results.filter((r) => r.testType === testType);
  }

  async getCompletedTests(): Promise<string[]> {
    const results = await this.getMyResults();
    const completed = new Set(results.map((r) => r.testType));
    return Array.from(completed);
  }

  async getIncompleteTests(completedTests?: string[]): Promise<string[]> {
    const completed = completedTests ?? await this.getCompletedTests();
    const allTests = Object.keys(CHEMI_DATA);
    return allTests.filter((test) => !completed.includes(test));
  }

  async getRecommendedTest(): Promise<RecommendedTest | null> {
    const completed = await this.getCompletedTests();
    const allTests = Object.keys(CHEMI_DATA);
    const incomplete = allTests.filter((test) => !completed.includes(test));

    if (incomplete.length === 0) {
      const results = await this.getMyResults();
      if (results.length === 0) return null;

      const byType: Record<string, TestResultCamel> = {};
      results.forEach((r) => {
        if (!byType[r.testType] || new Date(r.createdAt) > new Date(byType[r.testType].createdAt)) {
          byType[r.testType] = r;
        }
      });

      const sorted = Object.values(byType).sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      return {
        testType: sorted[0].testType,
        reason: 'retest',
        lastDoneAt: sorted[0].createdAt,
      };
    }

    const completedMain = filterMainTests(completed);
    const incompleteMain = filterMainTests(incomplete);

    const coldStart = pickColdStartTest(incompleteMain, completedMain.length);
    const ordered = pickFirstAvailable(RECOMMENDATION_ORDER, incompleteMain);
    const recommended = coldStart || ordered || incomplete[0];

    return {
      testType: recommended,
      reason: 'new',
    };
  }

  async getStats(): Promise<Stats> {
    const results = await this.getMyResults();

    return {
      totalTests: results.length,
      uniqueTests: new Set(results.map((r) => r.testType)).size,
      deepModeCount: results.filter((r) => r.isDeepMode).length,
      firstTestAt: results.length > 0 ? results[results.length - 1].createdAt : null,
      lastTestAt: results.length > 0 ? results[0].createdAt : null,
      byTestType: results.reduce((acc, r) => {
        acc[r.testType] = (acc[r.testType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  async clearAll(): Promise<SaveResult> {
    storage.remove(this.RESULTS_KEY);
    return { success: true };
  }

  // ========== 분포 조회 (신규) ==========

  /**
   * 테스트 결과 분포 조회
   * @param testType 테스트 종류
   * @param filter 연령대/성별 필터
   */
  async getResultDistribution(
    testType: string,
    filter?: { ageGroup?: string; gender?: string }
  ) {
    return tursoService.getResultDistribution(testType, filter);
  }

  /**
   * 내 결과 순위 조회
   * @param testType 테스트 종류
   */
  async getMyResultRank(testType: string) {
    return tursoService.getMyResultRank(testType);
  }
}

// 싱글톤 인스턴스
export const resultService = new ResultServiceClass();

export default resultService;
