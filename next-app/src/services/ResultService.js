/**
 * ResultService - 테스트 결과 저장/조회 서비스
 *
 * 명명 규칙:
 * - DB 저장: snake_case (Supabase/PostgreSQL 표준)
 * - JS 반환: camelCase (JavaScript 표준)
 */

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

// ========== Storage Provider Interface (Strategy Pattern) ==========
export const StorageProviders = {
    // localStorage Provider (기본)
    local: {
        name: 'localStorage',

        async save(key, data) {
            if (typeof window === 'undefined') return { success: false, error: 'SSR' };
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
            if (typeof window === 'undefined') return [];
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
            if (typeof window === 'undefined') return { success: false };
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

        // ... (Supabase 관련 코드는 필요시 추가, 일단 간소화하거나 그대로 유지)
        // Next.js 환경에서도 클라이언트 사이드 로직은 동일
    }
};

// ResultService 클래스
export class ResultService {
    constructor() {
        this.provider = StorageProviders.local;
        this.RESULTS_KEY = 'chemi_test_results';
        this.USER_KEY = 'chemi_user';
    }

    // Supabase 연동 시 호출
    useSupabase(supabaseClient) {
        StorageProviders.supabase.init(supabaseClient);
        this.provider = StorageProviders.supabase;
    }

    // 현재 사용자 ID
    getUserId() {
        if (typeof window === 'undefined') return 'server';
        let user = localStorage.getItem(this.USER_KEY);
        if (!user) {
            user = 'anon_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
            localStorage.setItem(this.USER_KEY, user);
        }
        return user;
    }

    setUserId(userId) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.USER_KEY, userId);
        }
    }

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
            meta: {
                user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
                timestamp: Date.now()
            }
        };

        const saved = await this.provider.save(this.RESULTS_KEY, data);
        return saved;
    }

    async _getMyResultsRaw() {
        const userId = this.getUserId();
        return await this.provider.getByUserId(this.RESULTS_KEY, userId);
    }

    async getMyResults() {
        const results = await this._getMyResultsRaw();
        return keysToCamel(results);
    }

    async getResultsByType(testType) {
        const results = await this.getMyResults();
        return results.filter(r => r.testType === testType);
    }

    async getCompletedTests() {
        const results = await this.getMyResults();
        const completed = new Set(results.map(r => r.testType));
        return Array.from(completed);
    }

    async getIncompleteTests() {
        // Window.CHEMI_DATA 의존성 제거 필요 (파라미터로 받거나 import 해야 함)
        // 일단은 빈 배열 반환 또는 외부에서 처리하도록 수정
        // 여기서는 임시로 빈 배열을 반환하고, 실제 호출부에서 처리 권장
        return [];
    }

    // getRecommendedTest also depends on CHEMI_DATA. 
    // We will refactor this to accept data or import it later.
    // For now, let's keep it simple.
}

// 싱글톤 인스턴스
export const resultService = new ResultService();
