'use client';

import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import { resultService } from '@/services/ResultService';
import { RANKABLE_TESTS } from '@/data/config';
import type { SubjectKey } from '@/data/types';

// ============================================================================
// 타입 정의
// ============================================================================

export interface MyResult {
  testType: SubjectKey;
  resultName: string;
  resultEmoji: string;
  createdAt: string;
}

interface MyResultsContextValue {
  myResults: MyResult[];
  loading: boolean;
  refresh: () => Promise<void>;
}

// ============================================================================
// Context
// ============================================================================

const MyResultsContext = createContext<MyResultsContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

export function MyResultsProvider({ children }: { children: ReactNode }) {
  const [myResults, setMyResults] = useState<MyResult[]>([]);
  const [loading, setLoading] = useState(true);

  const loadResults = useCallback(async () => {
    try {
      setLoading(true);
      const results = await resultService.getMyResults();

      // RANKABLE_TESTS에 있는 테스트만 필터링
      const rankableKeys = RANKABLE_TESTS.map(t => t.key);
      const filtered = results
        .filter(r => rankableKeys.includes(r.testType as SubjectKey))
        .map(r => ({
          testType: r.testType as SubjectKey,
          resultName: r.resultKey,
          resultEmoji: r.resultEmoji,
          createdAt: r.createdAt,
        }));

      // 중복 제거 (같은 테스트의 최신 결과만 유지)
      const unique = filtered.reduce((acc, curr) => {
        const existing = acc.find(r => r.testType === curr.testType);
        if (!existing) {
          acc.push(curr);
        } else if (new Date(curr.createdAt) > new Date(existing.createdAt)) {
          const idx = acc.indexOf(existing);
          acc[idx] = curr;
        }
        return acc;
      }, [] as MyResult[]);

      setMyResults(unique);
    } catch (e) {
      console.error('[MyResultsContext] Failed to load results:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResults();

    // 새 테스트 결과 저장 시 자동 갱신
    const handleResultSaved = () => {
      loadResults();
    };

    window.addEventListener('chemi:resultSaved', handleResultSaved);
    return () => {
      window.removeEventListener('chemi:resultSaved', handleResultSaved);
    };
  }, [loadResults]);

  const value = useMemo(() => ({
    myResults,
    loading,
    refresh: loadResults,
  }), [myResults, loading, loadResults]);

  return (
    <MyResultsContext.Provider value={value}>
      {children}
    </MyResultsContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useMyResults() {
  const context = useContext(MyResultsContext);
  if (!context) {
    throw new Error('useMyResults must be used within MyResultsProvider');
  }
  return context;
}
