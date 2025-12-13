/**
 * ResultService - 테스트 결과 저장/조회 서비스
 *
 * 현재: localStorage 사용
 * 향후: Supabase 연동 시 StorageProvider만 교체
 *
 * 명명 규칙:
 * - DB 저장: snake_case (Supabase/PostgreSQL 표준)
 * - JS 반환: camelCase (JavaScript 표준)
 */

(function(window) {
    'use strict';

    // ========== 케이스 변환 유틸리티 ==========

    // snake_case → camelCase
    const toCamelCase = (str) => {
        return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    };

    // camelCase → snake_case
    const toSnakeCase = (str) => {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    };

    // 객체의 모든 키를 camelCase로 변환
    const keysToCamel = (obj) => {
        if (Array.isArray(obj)) {
            return obj.map(keysToCamel);
        }
        if (obj !== null && typeof obj === 'object') {
            return Object.keys(obj).reduce((result, key) => {
                const camelKey = toCamelCase(key);
                result[camelKey] = keysToCamel(obj[key]);
                return result;
            }, {});
        }
        return obj;
    };

    // 객체의 모든 키를 snake_case로 변환
    const keysToSnake = (obj) => {
        if (Array.isArray(obj)) {
            return obj.map(keysToSnake);
        }
        if (obj !== null && typeof obj === 'object') {
            return Object.keys(obj).reduce((result, key) => {
                const snakeKey = toSnakeCase(key);
                result[snakeKey] = keysToSnake(obj[key]);
                return result;
            }, {});
        }
        return obj;
    };

    // ========== Storage Provider Interface (Strategy Pattern) ==========
    const StorageProviders = {
        // localStorage Provider (기본)
        local: {
            name: 'localStorage',

            async save(key, data) {
                try {
                    const existing = JSON.parse(localStorage.getItem(key) || '[]');
                    existing.push(data);
                    localStorage.setItem(key, JSON.stringify(existing));
                    return { success: true, id: data.id };
                } catch (error) {
                    console.error('[ResultService] localStorage 저장 실패:', error);
                    return { success: false, error: error.message };
                }
            },

            async getAll(key) {
                try {
                    return JSON.parse(localStorage.getItem(key) || '[]');
                } catch (error) {
                    return [];
                }
            },

            async getByUserId(key, userId) {
                const all = await this.getAll(key);
                return all.filter(item => item.user_id === userId);
            },

            async clear(key) {
                localStorage.removeItem(key);
                return { success: true };
            }
        },

        // Supabase Provider (향후 구현)
        supabase: {
            name: 'supabase',
            client: null,

            init(supabaseClient) {
                this.client = supabaseClient;
            },

            async save(tableName, data) {
                if (!this.client) {
                    console.warn('[ResultService] Supabase client 미설정, localStorage 폴백');
                    return StorageProviders.local.save('chemi_' + tableName, data);
                }

                try {
                    const { data: result, error } = await this.client
                        .from(tableName)
                        .insert(data)
                        .select();

                    if (error) throw error;
                    return { success: true, id: result[0].id };
                } catch (error) {
                    console.error('[ResultService] Supabase 저장 실패:', error);
                    // 오프라인 시 localStorage에 pending으로 저장
                    await this.savePending(tableName, data);
                    return { success: false, error: error.message, pending: true };
                }
            },

            async savePending(tableName, data) {
                const pendingKey = 'chemi_pending_' + tableName;
                const pending = JSON.parse(localStorage.getItem(pendingKey) || '[]');
                pending.push({ ...data, _pendingAt: Date.now() });
                localStorage.setItem(pendingKey, JSON.stringify(pending));
            },

            async syncPending(tableName) {
                const pendingKey = 'chemi_pending_' + tableName;
                const pending = JSON.parse(localStorage.getItem(pendingKey) || '[]');

                if (pending.length === 0) return { synced: 0, failed: 0, total: 0 };

                const results = { synced: 0, failed: 0, total: pending.length };
                const stillPending = [];

                for (const item of pending) {
                    const cleanItem = { ...item };
                    delete cleanItem._pendingAt;

                    // 직접 Supabase에 insert (save() 호출 시 savePending 재호출 방지)
                    try {
                        if (!this.client) throw new Error('No client');

                        const { error } = await this.client
                            .from(tableName)
                            .insert(cleanItem)
                            .select();

                        if (error) throw error;
                        results.synced++;
                    } catch (error) {
                        // 실패한 항목은 다시 pending에 추가
                        stillPending.push(item);
                        results.failed++;
                        console.warn('[ResultService] Sync failed for item:', item.id, error.message);
                    }
                }

                // 실패한 항목만 다시 저장
                if (stillPending.length > 0) {
                    localStorage.setItem(pendingKey, JSON.stringify(stillPending));
                } else {
                    localStorage.removeItem(pendingKey);
                }

                return results;
            },

            async getAll(tableName) {
                if (!this.client) {
                    return StorageProviders.local.getAll('chemi_' + tableName);
                }

                try {
                    const { data, error } = await this.client
                        .from(tableName)
                        .select('*')
                        .order('created_at', { ascending: false });

                    if (error) throw error;
                    return data;
                } catch (error) {
                    console.error('[ResultService] Supabase 조회 실패:', error);
                    return [];
                }
            },

            async getByUserId(tableName, userId) {
                if (!this.client) {
                    return StorageProviders.local.getByUserId('chemi_' + tableName, userId);
                }

                try {
                    const { data, error } = await this.client
                        .from(tableName)
                        .select('*')
                        .eq('user_id', userId)
                        .order('created_at', { ascending: false });

                    if (error) throw error;
                    return data;
                } catch (error) {
                    return [];
                }
            }
        }
    };

    // ResultService 클래스
    class ResultService {
        constructor() {
            this.provider = StorageProviders.local;
            this.RESULTS_KEY = 'chemi_test_results';
            this.USER_KEY = 'chemi_user';
        }

        // Supabase 연동 시 호출
        useSupabase(supabaseClient) {
            StorageProviders.supabase.init(supabaseClient);
            this.provider = StorageProviders.supabase;
            console.log('[ResultService] Supabase provider 활성화');
        }

        // 현재 사용자 ID (익명 또는 로그인)
        getUserId() {
            let user = localStorage.getItem(this.USER_KEY);
            if (!user) {
                user = 'anon_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
                localStorage.setItem(this.USER_KEY, user);
            }
            return user;
        }

        // 외부 프로젝트에서 사용자 ID 설정 (Supabase auth 연동)
        setUserId(userId) {
            localStorage.setItem(this.USER_KEY, userId);
        }

        // 테스트 결과 저장
        // Supabase 호환을 위해 snake_case 사용
        async saveResult(testType, result, scores, isDeep = false) {
            const data = {
                id: Date.now() + '_' + Math.random().toString(36).substring(2, 11),
                user_id: this.getUserId(),
                project: 'chemi-test',
                test_type: testType,
                result_key: result.name,
                result_emoji: result.emoji,
                scores: scores,
                is_deep_mode: isDeep,
                created_at: new Date().toISOString(),
                // 메타데이터 (분석용)
                meta: {
                    user_agent: navigator.userAgent,
                    screen_width: window.innerWidth,
                    timestamp: Date.now()
                }
            };

            const saved = await this.provider.save(this.RESULTS_KEY, data);

            if (saved.success) {
                // 결과 저장 이벤트 발생 (다른 컴포넌트에서 사용 가능)
                window.dispatchEvent(new CustomEvent('chemi:resultSaved', { detail: data }));
            }

            return saved;
        }

        // 사용자의 모든 결과 조회 (내부용 - snake_case)
        async _getMyResultsRaw() {
            const userId = this.getUserId();
            return await this.provider.getByUserId(this.RESULTS_KEY, userId);
        }

        // 사용자의 모든 결과 조회 (외부용 - camelCase)
        async getMyResults() {
            const results = await this._getMyResultsRaw();
            return keysToCamel(results);
        }

        // 특정 테스트 결과 조회
        async getResultsByType(testType) {
            const results = await this.getMyResults();
            return results.filter(r => r.testType === testType);
        }

        // 완료한 테스트 목록
        async getCompletedTests() {
            const results = await this.getMyResults();
            const completed = new Set(results.map(r => r.testType));
            return Array.from(completed);
        }

        // 아직 안 한 테스트 목록
        async getIncompleteTests() {
            const completed = await this.getCompletedTests();
            const allTests = Object.keys(window.CHEMI_DATA || {});
            return allTests.filter(test => !completed.includes(test));
        }

        // 다음 추천 테스트 (camelCase 반환)
        async getRecommendedTest() {
            const incomplete = await this.getIncompleteTests();

            if (incomplete.length === 0) {
                // 모든 테스트 완료 - 가장 오래 전에 한 테스트 추천
                const results = await this.getMyResults();
                if (results.length === 0) return null;

                const byType = {};
                results.forEach(r => {
                    if (!byType[r.testType] || new Date(r.createdAt) > new Date(byType[r.testType].createdAt)) {
                        byType[r.testType] = r;
                    }
                });

                const sorted = Object.values(byType).sort((a, b) =>
                    new Date(a.createdAt) - new Date(b.createdAt)
                );

                return {
                    testType: sorted[0].testType,
                    reason: 'retest',
                    lastDoneAt: sorted[0].createdAt
                };
            }

            // 테스트 우선순위 (인기 or 연관성)
            const priority = ['human', 'cat', 'dog', 'idealType', 'petMatch', 'coffee', 'rabbit', 'hamster', 'plant'];
            const recommended = priority.find(test => incomplete.includes(test)) || incomplete[0];

            return {
                testType: recommended,
                reason: 'new'
            };
        }

        // 통계 데이터 (camelCase 반환)
        async getStats() {
            const results = await this.getMyResults();

            return {
                totalTests: results.length,
                uniqueTests: new Set(results.map(r => r.testType)).size,
                deepModeCount: results.filter(r => r.isDeepMode).length,
                firstTestAt: results.length > 0 ? results[results.length - 1].createdAt : null,
                lastTestAt: results.length > 0 ? results[0].createdAt : null,
                byTestType: results.reduce((acc, r) => {
                    acc[r.testType] = (acc[r.testType] || 0) + 1;
                    return acc;
                }, {})
            };
        }

        // 결과 데이터 내보내기 (camelCase 반환)
        async exportData() {
            const results = await this.getMyResults();
            const stats = await this.getStats();

            return {
                userId: this.getUserId(),
                project: 'chemi-test',
                results: results,
                stats: stats,
                exportedAt: new Date().toISOString()
            };
        }

        // 결과 데이터 가져오기 (외부 프로젝트에서 복원)
        async importData(data) {
            if (!data || !data.results) return { success: false, error: 'Invalid data' };

            for (const result of data.results) {
                await this.provider.save(this.RESULTS_KEY, result);
            }

            return { success: true, imported: data.results.length };
        }

        // 모든 데이터 초기화
        async clearAll() {
            return await this.provider.clear(this.RESULTS_KEY);
        }
    }

    // 싱글톤 인스턴스
    window.resultService = new ResultService();

    // 전역 접근용
    window.ResultService = ResultService;
    window.StorageProviders = StorageProviders;

    // Service Worker 메시지 리스너 (Background Sync 지원)
    // NOTE: 서비스 워커(PWA) 미사용. 필요하면 상위 프로젝트에서 별도 구현.
    const swEnabled = false;
    if (swEnabled) {
        navigator.serviceWorker.addEventListener('message', async (event) => {
            if (event.data && event.data.type === 'SYNC_PENDING_RESULTS') {
                console.log('[ResultService] Received sync request from SW');

                // Supabase provider가 활성화된 경우에만 동기화
                if (window.resultService.provider === StorageProviders.supabase) {
                    try {
                        // RESULTS_KEY와 동일한 키 사용 (chemi_test_results)
                        const result = await StorageProviders.supabase.syncPending(window.resultService.RESULTS_KEY);
                        console.log('[ResultService] Sync result:', result);

                        // SW에 완료 메시지 전송
                        if (navigator.serviceWorker.controller) {
                            navigator.serviceWorker.controller.postMessage({
                                type: 'SYNC_COMPLETE',
                                result: result
                            });
                        }
                    } catch (error) {
                        console.error('[ResultService] Sync failed:', error);
                    }
                } else {
                    console.log('[ResultService] Supabase not active, skipping sync');
                }
            }
        });

        // 온라인 상태 복귀 시 자동 동기화 요청
        window.addEventListener('online', () => {
            console.log('[ResultService] Online - requesting sync');
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'TRIGGER_SYNC'
                });
            }
        });
    }

})(window);
