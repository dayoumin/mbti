/**
 * ResultService - 테스트 결과 저장/조회 서비스
 *
 * 현재: localStorage 사용
 * 향후: Supabase 연동 시 StorageProvider만 교체
 */

import { ResultLabel } from '@/data/types';
import { CHEMI_DATA } from '@/data';
import {
  filterMainTests,
  pickColdStartTest,
  pickFirstAvailable,
  RECOMMENDATION_ORDER,
} from '@/data/recommendationPolicy';
import { getDeviceId, USER_KEY } from '@/utils/device';

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
  parent_test?: string;  // petMatch → 세부 테스트 연결용
  parent_result?: string; // 부모 테스트의 결과명 (예: "강아지")
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
  parentTest?: string;  // petMatch → 세부 테스트 연결용
  parentResult?: string; // 부모 테스트의 결과명 (예: "강아지")
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

// ========== Supabase Provider (준비됨 - npm install @supabase/supabase-js 후 활성화) ==========
// 사용법:
// 1. npm install @supabase/supabase-js
// 2. .env.local에 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 설정
// 3. Supabase에서 001_mbti_results.sql, 002_mbti_results_parent_info.sql 실행

// Supabase 클라이언트 싱글톤 (패키지 설치 시 활성화)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabaseClient: any = null;

async function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  try {
    // 동적 import로 패키지 없이도 빌드 가능하게 함
    const moduleName = '@supabase/supabase-js';
    const { createClient } = await import(/* webpackIgnore: true */ moduleName);
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    return supabaseClient;
  } catch {
    // @supabase/supabase-js 패키지 미설치
    return null;
  }
}

const supabaseProvider: StorageProvider = {
  name: 'supabase',

  async save(_key: string, data: TestResultData): Promise<SaveResult> {
    const supabase = await getSupabaseClient();

    if (!supabase) {
      // Supabase 미설정 - localStorage로 폴백
      return localStorageProvider.save(_key, data);
    }

    try {
      const { data: result, error } = await supabase
        .from('mbti_results')
        .insert({
          device_id: data.user_id,  // 익명 사용자는 device_id로 추적
          subject_key: data.test_type,
          result_name: data.result_key,
          result_emoji: data.result_emoji,
          parent_test: data.parent_test,
          parent_result: data.parent_result,
          scores: data.scores,
          is_deep_mode: data.is_deep_mode,
        })
        .select('id')
        .single();

      if (error) throw error;

      // localStorage에도 백업 저장 (오프라인 대응)
      await localStorageProvider.save(_key, data);

      return { success: true, id: result?.id };
    } catch (error) {
      console.error('[ResultService] Supabase 저장 실패, localStorage로 폴백:', error);
      return localStorageProvider.save(_key, data);
    }
  },

  async getAll(key: string): Promise<TestResultData[]> {
    return localStorageProvider.getAll(key);
  },

  async getByUserId(key: string, userId: string): Promise<TestResultData[]> {
    const supabase = await getSupabaseClient();

    if (!supabase) {
      return localStorageProvider.getByUserId(key, userId);
    }

    try {
      const { data, error } = await supabase
        .from('mbti_results')
        .select('*')
        .eq('device_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (data || []).map((row: any) => ({
        id: row.id,
        user_id: row.device_id || row.user_id,
        project: 'chemi-test',
        test_type: row.subject_key,
        result_key: row.result_name,
        result_emoji: row.result_emoji || '',
        parent_test: row.parent_test || undefined,
        parent_result: row.parent_result || undefined,
        scores: row.scores,
        is_deep_mode: row.is_deep_mode,
        created_at: row.created_at,
        meta: {
          user_agent: '',
          screen_width: 0,
          timestamp: new Date(row.created_at).getTime(),
        },
      }));
    } catch (error) {
      console.error('[ResultService] Supabase 조회 실패, localStorage로 폴백:', error);
      return localStorageProvider.getByUserId(key, userId);
    }
  },

  async clear(key: string): Promise<SaveResult> {
    return localStorageProvider.clear(key);
  },
};

// ========== ResultService Class ==========

class ResultServiceClass {
  private provider: StorageProvider;
  private RESULTS_KEY = 'chemi_test_results';

  constructor() {
    // Supabase URL이 설정되어 있으면 supabaseProvider 사용
    // 그렇지 않으면 localStorageProvider 사용 (개발 환경)
    this.provider = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL
      ? supabaseProvider
      : localStorageProvider;
  }

  // Provider 수동 변경 (테스트용)
  setProvider(name: 'localStorage' | 'supabase'): void {
    this.provider = name === 'supabase' ? supabaseProvider : localStorageProvider;
  }

  getProviderName(): string {
    return this.provider.name;
  }

  // getUserId는 공통 유틸리티 사용
  getUserId(): string {
    return getDeviceId();
  }

  setUserId(userId: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, userId);
    }
  }

  async saveResult(
    testType: string,
    result: ResultLabel,
    scores: Record<string, number>,
    isDeep = false,
    parentInfo?: { testType: string; resultName: string }
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
      parent_test: parentInfo?.testType,
      parent_result: parentInfo?.resultName,
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
    return await this.provider.clear(this.RESULTS_KEY);
  }
}

// 싱글톤 인스턴스
export const resultService = new ResultServiceClass();

export default resultService;
