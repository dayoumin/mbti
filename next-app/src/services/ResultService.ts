/**
 * ResultService - 테스트 결과 저장/조회 서비스
 *
 * 현재: localStorage 사용
 * 향후: Supabase 연동 시 StorageProvider만 교체
 */

import { ResultLabel } from '@/data/types';
import { CHEMI_DATA } from '@/data';

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
  meta: {
    user_agent: string;
    screen_width: number;
    timestamp: number;
  };
}

interface TestResultCamel {
  id: string;
  userId: string;
  project: string;
  testType: string;
  resultKey: string;
  resultEmoji: string;
  scores: Record<string, number>;
  isDeepMode: boolean;
  createdAt: string;
  meta: {
    userAgent: string;
    screenWidth: number;
    timestamp: number;
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

// ========== 케이스 변환 유틸리티 ==========

const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

const keysToCamel = <T>(obj: unknown): T => {
  if (Array.isArray(obj)) {
    return obj.map(keysToCamel) as unknown as T;
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj as Record<string, unknown>).reduce((result, key) => {
      const camelKey = toCamelCase(key);
      (result as Record<string, unknown>)[camelKey] = keysToCamel((obj as Record<string, unknown>)[key]);
      return result;
    }, {} as Record<string, unknown>) as T;
  }
  return obj as T;
};

// ========== Storage Provider ==========

interface StorageProvider {
  name: string;
  save(key: string, data: TestResultData): Promise<SaveResult>;
  getAll(key: string): Promise<TestResultData[]>;
  getByUserId(key: string, userId: string): Promise<TestResultData[]>;
  clear(key: string): Promise<SaveResult>;
}

const localStorageProvider: StorageProvider = {
  name: 'localStorage',

  async save(key: string, data: TestResultData): Promise<SaveResult> {
    try {
      const existing = JSON.parse(localStorage.getItem(key) || '[]') as TestResultData[];
      existing.push(data);
      localStorage.setItem(key, JSON.stringify(existing));
      return { success: true, id: data.id };
    } catch (error) {
      console.error('[ResultService] localStorage 저장 실패:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  async getAll(key: string): Promise<TestResultData[]> {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]') as TestResultData[];
    } catch {
      return [];
    }
  },

  async getByUserId(key: string, userId: string): Promise<TestResultData[]> {
    const all = await this.getAll(key);
    return all.filter((item) => item.user_id === userId);
  },

  async clear(key: string): Promise<SaveResult> {
    localStorage.removeItem(key);
    return { success: true };
  },
};

// ========== ResultService Class ==========

class ResultServiceClass {
  private provider: StorageProvider;
  private RESULTS_KEY = 'chemi_test_results';
  private USER_KEY = 'chemi_user';

  constructor() {
    this.provider = localStorageProvider;
  }

  getUserId(): string {
    if (typeof window === 'undefined') return 'server';

    let user = localStorage.getItem(this.USER_KEY);
    if (!user) {
      user = 'anon_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem(this.USER_KEY, user);
    }
    return user;
  }

  setUserId(userId: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, userId);
    }
  }

  async saveResult(
    testType: string,
    result: ResultLabel,
    scores: Record<string, number>,
    isDeep = false
  ): Promise<SaveResult> {
    const data: TestResultData = {
      id: Date.now() + '_' + Math.random().toString(36).substring(2, 11),
      user_id: this.getUserId(),
      project: 'chemi-test',
      test_type: testType,
      result_key: result.name,
      result_emoji: result.emoji,
      scores: scores,
      is_deep_mode: isDeep,
      created_at: new Date().toISOString(),
      meta: {
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
        screen_width: typeof window !== 'undefined' ? window.innerWidth : 0,
        timestamp: Date.now(),
      },
    };

    const saved = await this.provider.save(this.RESULTS_KEY, data);

    if (saved.success && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('chemi:resultSaved', { detail: data }));
    }

    return saved;
  }

  private async _getMyResultsRaw(): Promise<TestResultData[]> {
    const userId = this.getUserId();
    return await this.provider.getByUserId(this.RESULTS_KEY, userId);
  }

  async getMyResults(): Promise<TestResultCamel[]> {
    const results = await this._getMyResultsRaw();
    return keysToCamel<TestResultCamel[]>(results);
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

  async getIncompleteTests(): Promise<string[]> {
    const completed = await this.getCompletedTests();
    const allTests = Object.keys(CHEMI_DATA);
    return allTests.filter((test) => !completed.includes(test));
  }

  async getRecommendedTest(): Promise<RecommendedTest | null> {
    const incomplete = await this.getIncompleteTests();

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

    const priority = ['human', 'cat', 'dog', 'idealType', 'petMatch', 'coffee', 'rabbit', 'hamster', 'plant'];
    const recommended = priority.find((test) => incomplete.includes(test)) || incomplete[0];

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
    return await this.provider.clear(this.RESULTS_KEY);
  }
}

// 싱글톤 인스턴스
export const resultService = new ResultServiceClass();

export default resultService;
