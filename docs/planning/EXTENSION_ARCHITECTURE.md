# 확장 아키텍처 설계

## 목표
1. **테스트 기록 저장** - Turso (LibSQL) 연동으로 영구 저장
2. **진행 중 네비게이션** - 이전 질문, 다른 테스트로 전환
3. **통합 인사이트** - 여러 테스트 결과 종합 분석

> **참고**: 이 문서의 SQL 예시는 PostgreSQL 문법으로 작성되어 있으나,
> 실제 구현은 Turso (SQLite 호환)를 사용합니다.
> 인증이 필요한 경우 향후 Supabase Auth 등 별도 검토 예정.

---

## 1. DB 스키마 설계 (Turso용 SQLite)

### 1.1 사용자 ID 모델

**핵심 원칙**: 모든 테이블은 `user_profile_id`로 user_profiles를 참조한다.

```
┌─────────────────────────────────────────────────────────────┐
│                     user_profiles                            │
│  id (TEXT, PK) ◄─────────────────────────────────────────┐  │
│  anonymous_id (TEXT, UNIQUE) - 클라이언트 생성 anon_xxx   │  │
│  auth_id (TEXT, UNIQUE) - 외부 Auth 연동 시 (미정)        │  │
│  device_token (TEXT) - 다기기 지원용 (선택)               │  │
└──────────────────────────────────────────────────────────┘│  │
                                                            │  │
┌─────────────────────────────────────────────────────────┐ │  │
│ test_results                                            │ │  │
│ user_profile_id (TEXT, FK) ──────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘   │
┌─────────────────────────────────────────────────────────┐   │
│ test_progress                                           │   │
│ user_profile_id (TEXT, FK) ──────────────────────────────────┘
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ user_insights                                           │
│ user_profile_id (TEXT, FK, UNIQUE) ──────────────────────────
└─────────────────────────────────────────────────────────┘
```

> **Turso 참고**: SQLite는 UUID 타입이 없어 TEXT로 저장합니다.

### 1.2 테이블 구조

```sql
-- ============================================================
-- 1. 사용자 프로필 (익명 + 로그인 통합)
-- ============================================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- 식별자들 (하나 이상 존재)
    anonymous_id TEXT UNIQUE,              -- 클라이언트 생성 ID (anon_xxx)
    auth_id UUID UNIQUE REFERENCES auth.users ON DELETE SET NULL,
    device_token TEXT,                     -- 다기기 지원용 (선택적)

    -- 프로필 정보
    nickname TEXT,

    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),

    -- 최소 하나의 식별자 필요
    CONSTRAINT at_least_one_identifier
        CHECK (anonymous_id IS NOT NULL OR auth_id IS NOT NULL)
);

-- 인덱스 (UNIQUE 제약이 없는 컬럼만)
-- anonymous_id, auth_id는 UNIQUE 제약으로 자동 인덱스 생성됨

-- ============================================================
-- 프로필 자동 생성/조회 함수 (INSERT 전 호출)
-- ============================================================
CREATE OR REPLACE FUNCTION ensure_user_profile(p_anonymous_id TEXT)
RETURNS UUID AS $$
DECLARE
    v_profile_id UUID;
BEGIN
    -- 기존 프로필 조회
    SELECT id INTO v_profile_id
    FROM user_profiles
    WHERE anonymous_id = p_anonymous_id;

    -- 없으면 생성
    IF v_profile_id IS NULL THEN
        INSERT INTO user_profiles (anonymous_id)
        VALUES (p_anonymous_id)
        ON CONFLICT (anonymous_id) DO NOTHING
        RETURNING id INTO v_profile_id;

        -- RETURNING이 NULL이면 (동시 INSERT로 충돌) 다시 조회
        IF v_profile_id IS NULL THEN
            SELECT id INTO v_profile_id
            FROM user_profiles
            WHERE anonymous_id = p_anonymous_id;
        END IF;
    END IF;

    RETURN v_profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 2. 테스트 결과
-- ============================================================
CREATE TABLE test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- 서버 생성 (충돌 방지)
    user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

    -- 결과 데이터
    project TEXT DEFAULT 'chemi-test',
    test_type TEXT NOT NULL,               -- human, cat, dog, etc.
    result_key TEXT NOT NULL,              -- 결과 이름
    result_emoji TEXT,
    scores JSONB NOT NULL,                 -- { dimension: score }
    is_deep_mode BOOLEAN DEFAULT FALSE,

    -- 메타데이터
    meta JSONB,                            -- user_agent, screen, etc.
    client_id TEXT,                        -- 클라이언트 생성 ID (중복 방지용)

    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_test_results_user_profile ON test_results(user_profile_id);
CREATE INDEX idx_test_results_test_type ON test_results(test_type);
CREATE INDEX idx_test_results_created_at ON test_results(created_at DESC);

-- client_id 중복 방지 (upsert 시 ON CONFLICT 사용)
CREATE UNIQUE INDEX idx_test_results_client_id ON test_results(client_id) WHERE client_id IS NOT NULL;

-- 클라이언트 사용법:
-- INSERT INTO test_results (..., client_id) VALUES (..., 'xxx')
-- ON CONFLICT (client_id) WHERE client_id IS NOT NULL
-- DO NOTHING;  -- 또는 DO UPDATE SET ...

-- ============================================================
-- 3. 테스트 진행 상태 (중간 저장)
-- ============================================================
CREATE TABLE test_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

    -- 테스트 식별
    test_type TEXT NOT NULL,
    is_deep_mode BOOLEAN DEFAULT FALSE,

    -- 진행 상태
    current_index INTEGER DEFAULT 0,       -- 현재 질문 인덱스
    scores JSONB DEFAULT '{}',             -- 지금까지의 점수
    answers JSONB DEFAULT '[]',            -- 답변 히스토리 [{qIdx, dimension, score}]

    -- 버전 관리 (질문 변경 감지)
    question_set_hash TEXT,                -- 질문셋 해시 (변경 감지)
    question_count INTEGER,                -- 저장 시점의 총 질문 수

    -- 타임스탬프
    started_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- 사용자당 테스트당 하나의 진행 상태만 유지
    UNIQUE (user_profile_id, test_type, is_deep_mode)
);

-- 인덱스
CREATE INDEX idx_test_progress_user_profile ON test_progress(user_profile_id);

-- ============================================================
-- 4. 통합 인사이트 (계산된 결과 캐싱)
-- ============================================================
CREATE TABLE user_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID NOT NULL UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,

    -- 인사이트 데이터
    insight_data JSONB NOT NULL,           -- InsightData 구조

    -- 버전 관리
    algorithm_version INTEGER DEFAULT 1,   -- 알고리즘 버전
    source_result_ids UUID[],              -- 계산에 사용된 result ID들
    last_result_at TIMESTAMPTZ,            -- 가장 최근 결과 시간 (무효화 판단)

    -- Soft invalidation (삭제 대신 stale 마킹)
    is_stale BOOLEAN DEFAULT FALSE,        -- TRUE면 재계산 필요

    -- 타임스탬프
    calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스: user_profile_id는 UNIQUE로 자동 생성됨
-- stale 상태 조회용 부분 인덱스
CREATE INDEX idx_user_insights_stale ON user_insights(user_profile_id) WHERE is_stale = TRUE;
```

### 1.3 Row Level Security (RLS) 정책

```sql
-- ============================================================
-- RLS 활성화
-- ============================================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_insights ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- user_profiles 정책
-- ============================================================

-- 익명 사용자: anonymous_id로 자신의 프로필만 조회/생성
CREATE POLICY "anon_select_own_profile" ON user_profiles
    FOR SELECT USING (
        anonymous_id = current_setting('request.headers', true)::json->>'x-anonymous-id'
    );

CREATE POLICY "anon_insert_own_profile" ON user_profiles
    FOR INSERT WITH CHECK (
        anonymous_id = current_setting('request.headers', true)::json->>'x-anonymous-id'
        AND auth_id IS NULL
    );

-- 로그인 사용자: auth.uid()로 자신의 프로필만 조회/수정
CREATE POLICY "auth_select_own_profile" ON user_profiles
    FOR SELECT USING (auth_id = auth.uid());

CREATE POLICY "auth_update_own_profile" ON user_profiles
    FOR UPDATE USING (auth_id = auth.uid());

-- ============================================================
-- test_results 정책
-- ============================================================

-- 자신의 결과만 조회
CREATE POLICY "select_own_results" ON test_results
    FOR SELECT USING (
        user_profile_id IN (
            SELECT id FROM user_profiles
            WHERE anonymous_id = current_setting('request.headers', true)::json->>'x-anonymous-id'
               OR auth_id = auth.uid()
        )
    );

-- 자신의 프로필에만 결과 추가
CREATE POLICY "insert_own_results" ON test_results
    FOR INSERT WITH CHECK (
        user_profile_id IN (
            SELECT id FROM user_profiles
            WHERE anonymous_id = current_setting('request.headers', true)::json->>'x-anonymous-id'
               OR auth_id = auth.uid()
        )
    );

-- ============================================================
-- test_progress 정책 (동일 패턴)
-- ============================================================
CREATE POLICY "select_own_progress" ON test_progress
    FOR SELECT USING (
        user_profile_id IN (
            SELECT id FROM user_profiles
            WHERE anonymous_id = current_setting('request.headers', true)::json->>'x-anonymous-id'
               OR auth_id = auth.uid()
        )
    );

CREATE POLICY "upsert_own_progress" ON test_progress
    FOR ALL USING (
        user_profile_id IN (
            SELECT id FROM user_profiles
            WHERE anonymous_id = current_setting('request.headers', true)::json->>'x-anonymous-id'
               OR auth_id = auth.uid()
        )
    );

-- ============================================================
-- user_insights 정책 (동일 패턴)
-- ============================================================
CREATE POLICY "select_own_insights" ON user_insights
    FOR SELECT USING (
        user_profile_id IN (
            SELECT id FROM user_profiles
            WHERE anonymous_id = current_setting('request.headers', true)::json->>'x-anonymous-id'
               OR auth_id = auth.uid()
        )
    );

CREATE POLICY "upsert_own_insights" ON user_insights
    FOR ALL USING (
        user_profile_id IN (
            SELECT id FROM user_profiles
            WHERE anonymous_id = current_setting('request.headers', true)::json->>'x-anonymous-id'
               OR auth_id = auth.uid()
        )
    );
```

### 1.4 익명 → 로그인 계정 병합 전략

```sql
-- ============================================================
-- 계정 병합 함수 (동시성 안전)
-- ============================================================
CREATE OR REPLACE FUNCTION merge_anonymous_to_auth(
    p_anonymous_id TEXT,
    p_auth_id UUID
) RETURNS UUID AS $$
DECLARE
    v_anon_profile_id UUID;
    v_auth_profile_id UUID;
    v_final_profile_id UUID;
BEGIN
    -- 트랜잭션 격리 수준 설정 (동시성 보호)
    -- 이 함수는 SERIALIZABLE 또는 최소 REPEATABLE READ 권장

    -- 1. 익명 프로필 찾기 (FOR UPDATE로 락)
    SELECT id INTO v_anon_profile_id
    FROM user_profiles
    WHERE anonymous_id = p_anonymous_id
    FOR UPDATE;

    -- 2. 기존 auth 프로필 찾기 (FOR UPDATE로 락)
    SELECT id INTO v_auth_profile_id
    FROM user_profiles
    WHERE auth_id = p_auth_id
    FOR UPDATE;

    -- Case A: 둘 다 없음 → 새 프로필 생성
    IF v_anon_profile_id IS NULL AND v_auth_profile_id IS NULL THEN
        INSERT INTO user_profiles (anonymous_id, auth_id)
        VALUES (p_anonymous_id, p_auth_id)
        ON CONFLICT (anonymous_id) DO UPDATE
            SET auth_id = EXCLUDED.auth_id
            WHERE user_profiles.auth_id IS NULL
        RETURNING id INTO v_final_profile_id;

        -- RETURNING 실패 시 조회
        IF v_final_profile_id IS NULL THEN
            SELECT id INTO v_final_profile_id
            FROM user_profiles
            WHERE anonymous_id = p_anonymous_id;
        END IF;

        RETURN v_final_profile_id;
    END IF;

    -- Case B: auth만 있음 → anonymous_id 추가
    IF v_anon_profile_id IS NULL AND v_auth_profile_id IS NOT NULL THEN
        UPDATE user_profiles
        SET anonymous_id = p_anonymous_id
        WHERE id = v_auth_profile_id
        AND anonymous_id IS NULL;  -- 이미 다른 anon_id가 있으면 무시

        RETURN v_auth_profile_id;
    END IF;

    -- Case C: anon만 있음 → auth_id 추가
    IF v_anon_profile_id IS NOT NULL AND v_auth_profile_id IS NULL THEN
        UPDATE user_profiles
        SET auth_id = p_auth_id
        WHERE id = v_anon_profile_id
        AND auth_id IS NULL;  -- 이미 다른 auth_id가 있으면 무시

        RETURN v_anon_profile_id;
    END IF;

    -- Case D: 둘 다 있고 다른 프로필 → 데이터 병합
    IF v_anon_profile_id <> v_auth_profile_id THEN
        -- auth 프로필을 기준으로 병합 (더 신뢰할 수 있음)
        v_final_profile_id := v_auth_profile_id;

        -- test_results 이전
        UPDATE test_results
        SET user_profile_id = v_final_profile_id
        WHERE user_profile_id = v_anon_profile_id;

        -- test_progress 이전 (충돌 시 최신 것 유지)
        UPDATE test_progress
        SET user_profile_id = v_final_profile_id
        WHERE user_profile_id = v_anon_profile_id
        AND NOT EXISTS (
            SELECT 1 FROM test_progress tp2
            WHERE tp2.user_profile_id = v_final_profile_id
            AND tp2.test_type = test_progress.test_type
            AND tp2.is_deep_mode = test_progress.is_deep_mode
        );

        -- 중복 progress 삭제
        DELETE FROM test_progress
        WHERE user_profile_id = v_anon_profile_id;

        -- user_insights 재계산 필요 표시 (stale로 마킹)
        UPDATE user_insights
        SET is_stale = TRUE
        WHERE user_profile_id = v_final_profile_id;

        DELETE FROM user_insights
        WHERE user_profile_id = v_anon_profile_id;

        -- anonymous_id를 auth 프로필에 추가 (기존 것이 없을 때만)
        UPDATE user_profiles
        SET anonymous_id = COALESCE(anonymous_id, p_anonymous_id)
        WHERE id = v_final_profile_id;

        -- 익명 프로필 삭제
        DELETE FROM user_profiles
        WHERE id = v_anon_profile_id;

        RETURN v_final_profile_id;
    END IF;

    -- Case E: 이미 같은 프로필
    RETURN v_anon_profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 호출 예시 (클라이언트):
-- SELECT merge_anonymous_to_auth('anon_xxx', 'auth-uuid');
```

### 1.5 인사이트 무효화 전략 (Soft Invalidation)

```sql
-- ============================================================
-- 새 결과 저장 시 인사이트를 stale로 마킹 (삭제하지 않음)
-- ============================================================
CREATE OR REPLACE FUNCTION mark_insights_stale_on_new_result()
RETURNS TRIGGER AS $$
BEGIN
    -- 기존 인사이트를 stale로 마킹 (있으면)
    UPDATE user_insights
    SET is_stale = TRUE
    WHERE user_profile_id = NEW.user_profile_id
    AND is_stale = FALSE;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_mark_insights_stale
AFTER INSERT ON test_results
FOR EACH ROW
EXECUTE FUNCTION mark_insights_stale_on_new_result();

-- ============================================================
-- 클라이언트용 인사이트 조회/재계산 로직
-- ============================================================
-- 1. user_insights 조회
-- 2. is_stale = TRUE 이거나 없으면 → 클라이언트에서 재계산
-- 3. 재계산 후 upsert (is_stale = FALSE로 저장)

-- 클라이언트 pseudocode:
-- const insights = await supabase.from('user_insights').select('*').eq('user_profile_id', id).single();
-- if (!insights || insights.is_stale) {
--     const newInsights = await calculateInsights();
--     await supabase.from('user_insights').upsert({
--         user_profile_id: id,
--         insight_data: newInsights,
--         is_stale: false,
--         algorithm_version: CURRENT_VERSION,
--         calculated_at: new Date().toISOString()
--     });
-- }

-- Stale 판단 기준 (추가 체크):
-- - is_stale = TRUE (트리거로 자동 설정됨)
-- - algorithm_version < CURRENT_ALGORITHM_VERSION (클라이언트 버전)
-- - source_result_ids에 없는 새 결과가 있음 (선택적 정밀 체크)
```

### 1.6 설계 결정 사항 (Design Decisions)

#### Q1: 로그인 전 다기기 지원이 필요한가?

**결정: 현재는 지원하지 않음 (단일 기기 우선)**

- 익명 사용자는 `localStorage`의 `anon_xxx` ID로 식별
- 다른 기기에서는 새로운 익명 ID 생성
- 로그인 후에만 기기 간 데이터 동기화 가능

**향후 확장**: 서버 발급 익명 토큰 방식
```javascript
// 현재 (클라이언트 생성)
const anonId = 'anon_' + Date.now() + '_' + randomString();

// 향후 (서버 발급) - 다기기 지원 시
const { anonToken } = await supabase.functions.invoke('create-anon-session');
// anonToken은 쿠키/localStorage에 저장, RLS에서 검증
```

#### Q2: test_results.id는 클라이언트 vs 서버 생성?

**결정: 서버 생성 UUID + 클라이언트 client_id**

```sql
-- 서버에서 UUID 자동 생성 (충돌 방지)
id UUID PRIMARY KEY DEFAULT gen_random_uuid()

-- 클라이언트 ID는 중복 방지용 (오프라인 동기화 시)
client_id TEXT UNIQUE  -- nullable, 있으면 중복 체크
```

**이유**:
- 클라이언트 `Date.now()` 기반 ID는 동시 요청 시 충돌 가능
- 오프라인에서 저장 후 동기화 시 `client_id`로 중복 방지
- Supabase가 순차적 UUID 생성하여 인덱스 성능 최적화

#### Q3: 질문 변경 시 진행 중인 테스트 처리?

**결정: 해시 기반 버전 관리**

```javascript
// 클라이언트에서 질문셋 해시 생성
function generateQuestionSetHash(questions) {
    const content = questions.map(q => q.text + q.dimension).join('|');
    return simpleHash(content);  // 간단한 해시 함수
}

// 진행 상태 복원 시 검증
async function loadProgress(testType, isDeepMode) {
    const progress = await getProgress(testType, isDeepMode);
    if (!progress) return null;

    const currentHash = generateQuestionSetHash(currentQuestions);

    if (progress.question_set_hash !== currentHash) {
        // 질문이 변경됨 → 진행 상태 무효화
        await clearProgress(testType, isDeepMode);
        return null;
    }

    return progress;
}
```

### 1.7 InsightData 구조

```javascript
{
    // 성격 프로필 요약
    personalityProfile: {
        dominantTraits: ['inssa', 'adventure'],  // 상위 특성
        weakTraits: ['plan'],                    // 하위 특성
        consistency: 0.85,                       // 테스트 간 일관성
        humanResult: { name: '활기찬 시티보이', emoji: '🏙️' }
    },

    // 동물 성향 매칭
    animalProfile: {
        mostSimilar: 'cat',                      // 가장 유사한 동물
        similarities: {
            cat: 0.82,
            dog: 0.65,
            rabbit: 0.58
        },
        petCompatibility: {
            recommended: 'cat',
            score: 0.88
        }
    },

    // 관계 성향
    relationshipProfile: {
        idealType: '열정적 로맨티스트',
        loveLanguage: 'expression',              // 주요 사랑의 언어
        compatibleTypes: ['헌신적 동반자', '활동적 파트너']
    },

    // 라이프스타일 매칭
    lifestyleProfile: {
        plant: '몬스테라',
        coffee: '아메리카노',
        pet: 'cat'
    },

    // 종합 인사이트 메시지
    summaryMessages: [
        "외향적이고 모험을 즐기는 당신은 고양이의 독립성과 잘 맞아요",
        "열정적인 연애 스타일로, 함께 활동하는 것을 중요시해요",
        "식물 관리에는 조금 더 꾸준함이 필요할 수 있어요"
    ],

    // 테스트 완료 현황
    completedTests: ['human', 'cat', 'dog', 'idealType'],
    recommendedNext: 'plant',
    completionRate: 0.44                         // 4/9 테스트 완료
}
```

---

## 2. 네비게이션 시스템 설계

### 2.0 UI 방향 결정

**모바일 앱 통합 대비 - 통합 간소화 방식**

- 모바일/데스크톱 동일한 상단 바 UI
- 향후 다른 모바일 앱에 기능으로 통합 예정
- PWA 스타일 유지 (앱처럼 동작)

### 상태 관리 확장

```javascript
// App.js 상태 확장
const [answers, setAnswers] = useState([]);     // 답변 히스토리
const [showExitModal, setShowExitModal] = useState(false);  // 중단 확인 모달

// 답변 히스토리 구조
// [{ qIdx: 0, dimension: 'inssa', score: 4 }, ...]
```

### 네비게이션 흐름

```
┌─────────────────────────────────────┐
│ [←]  고양이 테스트        3/10 ●●●○ │  ← 상단 고정 바 (h-12, 48px)
├─────────────────────────────────────┤
│                                     │
│         질문 영역                    │
│                                     │
├─────────────────────────────────────┤
│         답변 버튼들                  │
└─────────────────────────────────────┘

[←] 버튼 동작:
- 첫 질문 (qIdx === 0): 테스트 중단 확인 모달 표시
- 진행 중 (qIdx > 0): 이전 질문으로 돌아가기 (점수 롤백)

터치 영역: 최소 44px × 44px (모바일 접근성)
```

### 핵심 기능

#### 2.1 이전 질문으로 돌아가기

```javascript
const handleGoBack = () => {
    if (answers.length === 0) return;

    const lastAnswer = answers[answers.length - 1];

    // 점수 롤백
    setScores(prev => ({
        ...prev,
        [lastAnswer.dimension]: prev[lastAnswer.dimension] - lastAnswer.score
    }));

    // 답변 히스토리에서 제거
    setAnswers(prev => prev.slice(0, -1));

    // 이전 질문으로 이동
    setQIdx(lastAnswer.qIdx);
};
```

#### 2.2 테스트 중단 및 전환

```javascript
const handleExitTest = async () => {
    // 진행 상태 저장 (나중에 이어하기 위해)
    await saveProgress();

    // 확인 모달
    if (answers.length > 0) {
        showConfirmModal({
            title: '테스트를 중단할까요?',
            message: '진행 상황이 저장되어 나중에 이어할 수 있어요.',
            onConfirm: () => setStep('intro'),
            onCancel: () => {}
        });
    } else {
        setStep('intro');
    }
};
```

#### 2.3 진행 상태 저장/복원

```javascript
// ProgressService 추가
class ProgressService {
    constructor() {
        this.provider = StorageProviders.local;  // 또는 supabase
        this.TABLE_NAME = 'test_progress';
    }

    // user_profile_id 조회 (ensure_user_profile 함수 사용)
    async getUserProfileId() {
        const anonymousId = window.resultService.getUserId();  // anon_xxx

        if (this.provider === StorageProviders.supabase) {
            // Supabase: ensure_user_profile RPC 호출
            const { data } = await this.provider.client.rpc('ensure_user_profile', {
                p_anonymous_id: anonymousId
            });
            return data;  // UUID
        } else {
            // localStorage: anonymousId를 그대로 사용 (마이그레이션 시 변환)
            return anonymousId;
        }
    }

    async saveProgress(testType, isDeepMode, currentIndex, scores, answers, questions) {
        const userProfileId = await this.getUserProfileId();

        const data = {
            user_profile_id: userProfileId,
            test_type: testType,
            is_deep_mode: isDeepMode,
            current_index: currentIndex,
            scores,
            answers,
            // 버전 관리 (질문 변경 감지)
            question_set_hash: this.generateQuestionSetHash(questions),
            question_count: questions.length,
            updated_at: new Date().toISOString()
        };

        // localStorage 또는 Supabase에 저장
        await this.provider.upsert(this.TABLE_NAME, data, {
            onConflict: ['user_profile_id', 'test_type', 'is_deep_mode']
        });
    }

    async loadProgress(testType, isDeepMode) {
        const userProfileId = await this.getUserProfileId();

        return await this.provider.get(this.TABLE_NAME, {
            user_profile_id: userProfileId,
            test_type: testType,
            is_deep_mode: isDeepMode
        });
    }

    async clearProgress(testType, isDeepMode) {
        const userProfileId = await this.getUserProfileId();

        await this.provider.delete(this.TABLE_NAME, {
            user_profile_id: userProfileId,
            test_type: testType,
            is_deep_mode: isDeepMode
        });
    }

    // 질문셋 해시 생성 (변경 감지용)
    generateQuestionSetHash(questions) {
        const content = questions.map(q => q.text + q.dimension).join('|');
        // 간단한 해시 (실제 구현 시 crypto.subtle 또는 라이브러리 사용)
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }
}
```

---

## 3. 통합 인사이트 로직 설계

### 3.1 인사이트 생성 조건

```javascript
const INSIGHT_REQUIREMENTS = {
    // 최소 요구사항 (하나만 충족해도 부분 인사이트 제공)
    minimum: {
        testsCompleted: 1
    },

    // 기본 인사이트 (성격 프로필)
    basic: {
        required: ['human'],
        provides: ['personalityProfile']
    },

    // 동물 인사이트
    animal: {
        required: ['human'],
        optional: ['cat', 'dog', 'rabbit', 'hamster'],  // 1개 이상
        provides: ['animalProfile', 'petCompatibility']
    },

    // 관계 인사이트
    relationship: {
        required: ['human', 'idealType'],
        provides: ['relationshipProfile']
    },

    // 라이프스타일 인사이트
    lifestyle: {
        required: [],
        optional: ['plant', 'coffee', 'petMatch'],      // 1개 이상
        provides: ['lifestyleProfile']
    },

    // 완전한 통합 인사이트
    full: {
        required: ['human', 'cat', 'dog', 'idealType'],
        optional: ['plant', 'coffee', 'petMatch'],
        provides: ['summaryMessages', 'crossTestPatterns']
    }
};
```

### 3.2 차원 간 상관관계 매핑

```javascript
const DIMENSION_CORRELATIONS = {
    // Human ↔ Cat 상관관계
    human_cat: {
        'inssa': { 'cute': 0.7, 'boss': -0.3 },      // 인싸 ↔ 애교력+, 보스기질-
        'adventure': { 'curious': 0.8, 'alert': 0.4 }, // 모험심 ↔ 호기심+, 경계심+
        'empathy': { 'cute': 0.5, 'random': -0.2 },
        'plan': { 'alert': 0.3, 'random': -0.6 },    // 계획력 ↔ 경계심+, 엉뚱함-
        'mental': { 'boss': 0.5, 'alert': 0.4 }
    },

    // Human ↔ Dog 상관관계
    human_dog: {
        'inssa': { 'humanLove': 0.8, 'dogFriend': 0.7 },
        'adventure': { 'energy': 0.9, 'brave': 0.6 },
        'empathy': { 'humanLove': 0.6, 'focus': 0.3 },
        'plan': { 'focus': 0.7, 'persist': 0.5 },
        'mental': { 'brave': 0.7, 'persist': 0.6 }
    },

    // Human ↔ IdealType 상관관계
    human_idealType: {
        'inssa': { 'express': 0.7, 'active': 0.6 },
        'adventure': { 'passion': 0.5, 'active': 0.8 },
        'empathy': { 'commit': 0.6, 'close': 0.7 },
        'plan': { 'commit': 0.8 },
        'mental': { 'passion': 0.4 }
    }
};
```

### 3.3 인사이트 계산 로직

```javascript
class InsightService {
    constructor() {
        this.correlations = DIMENSION_CORRELATIONS;
        this.requirements = INSIGHT_REQUIREMENTS;

        // 상수 참조 (data/constants.js에서 가져옴)
        this.MAX_SCORE = window.CHEMI_CONSTANTS?.MAX_SCORE_PER_QUESTION || 5;
        this.DEFAULT_QUESTION_COUNT = window.CHEMI_CONSTANTS?.DEFAULT_QUESTION_COUNT || 5;
    }

    // 결과를 테스트 타입별로 그룹화
    groupByType(results) {
        return results.reduce((acc, result) => {
            const type = result.testType;
            if (!acc[type]) acc[type] = [];
            acc[type].push(result);
            return acc;
        }, {});
    }

    // 통합 인사이트 생성
    async generateInsights(userId) {
        const results = await resultService.getMyResults();
        const resultsByType = this.groupByType(results);

        const insights = {
            completedTests: Object.keys(resultsByType),
            completionRate: Object.keys(resultsByType).length / 9
        };

        // 1. 성격 프로필 (human 테스트 기반)
        if (resultsByType.human) {
            insights.personalityProfile = this.analyzePersonality(
                resultsByType.human[0]
            );
        }

        // 2. 동물 프로필 (human + 동물 테스트들)
        const animalTests = ['cat', 'dog', 'rabbit', 'hamster'];
        const completedAnimals = animalTests.filter(t => resultsByType[t]);

        if (resultsByType.human && completedAnimals.length > 0) {
            insights.animalProfile = this.analyzeAnimalSimilarity(
                resultsByType.human[0],
                completedAnimals.map(t => resultsByType[t][0])
            );
        }

        // 3. 관계 프로필
        if (resultsByType.idealType) {
            insights.relationshipProfile = this.analyzeRelationship(
                resultsByType.idealType[0],
                resultsByType.human?.[0]
            );
        }

        // 4. 라이프스타일 프로필
        const lifestyleTests = ['plant', 'coffee', 'petMatch'];
        const completedLifestyle = lifestyleTests.filter(t => resultsByType[t]);

        if (completedLifestyle.length > 0) {
            insights.lifestyleProfile = this.analyzeLifestyle(
                completedLifestyle.map(t => resultsByType[t][0])
            );
        }

        // 5. 종합 메시지 생성
        insights.summaryMessages = this.generateSummaryMessages(insights);

        // 6. 다음 추천 테스트
        insights.recommendedNext = await this.getSmartRecommendation(
            Object.keys(resultsByType)
        );

        return insights;
    }

    // 성격 분석
    analyzePersonality(humanResult) {
        const scores = humanResult.scores;
        const dims = Object.entries(scores).sort((a, b) => b[1] - a[1]);

        return {
            dominantTraits: dims.slice(0, 2).map(d => d[0]),
            weakTraits: dims.slice(-1).map(d => d[0]),
            humanResult: {
                name: humanResult.resultKey,
                emoji: humanResult.resultEmoji
            }
        };
    }

    // 동물 유사도 분석
    analyzeAnimalSimilarity(humanResult, animalResults) {
        const humanScores = humanResult.scores;
        const similarities = {};

        for (const animalResult of animalResults) {
            const testType = animalResult.testType;
            const animalScores = animalResult.scores;
            const correlationKey = `human_${testType}`;
            const correlation = this.correlations[correlationKey];

            if (correlation) {
                similarities[testType] = this.calculateSimilarity(
                    humanScores,
                    animalScores,
                    correlation
                );
            }
        }

        const sorted = Object.entries(similarities).sort((a, b) => b[1] - a[1]);

        return {
            mostSimilar: sorted[0]?.[0],
            similarities,
            petCompatibility: {
                recommended: sorted[0]?.[0],
                score: sorted[0]?.[1]
            }
        };
    }

    // 상관관계 기반 유사도 계산
    calculateSimilarity(humanScores, animalScores, correlation) {
        let totalCorrelation = 0;
        let count = 0;

        // 최대 점수 계산 (상수 사용)
        const maxScorePerDimension = this.DEFAULT_QUESTION_COUNT * this.MAX_SCORE;

        for (const [humanDim, animalCorr] of Object.entries(correlation)) {
            const humanScore = humanScores[humanDim] || 0;

            for (const [animalDim, corrValue] of Object.entries(animalCorr)) {
                const animalScore = animalScores[animalDim] || 0;

                // 정규화된 점수 (0-1 범위)
                const normalizedHuman = humanScore / maxScorePerDimension;
                const normalizedAnimal = animalScore / maxScorePerDimension;

                // 상관관계가 양수면 같은 방향, 음수면 반대 방향
                if (corrValue > 0) {
                    totalCorrelation += (1 - Math.abs(normalizedHuman - normalizedAnimal)) * corrValue;
                } else {
                    totalCorrelation += Math.abs(normalizedHuman - normalizedAnimal) * Math.abs(corrValue);
                }
                count++;
            }
        }

        return count > 0 ? totalCorrelation / count : 0;
    }

    // 관계 분석 (idealType + human 결합)
    analyzeRelationship(idealTypeResult, humanResult) {
        const idealScores = idealTypeResult.scores;

        // 주요 사랑의 언어 찾기 (가장 높은 차원)
        const dims = Object.entries(idealScores).sort((a, b) => b[1] - a[1]);
        const primaryLanguage = dims[0]?.[0];

        // 호환 가능한 타입 추론 (간단한 로직)
        const compatibleTypes = [];
        if (idealScores.passion > 15) compatibleTypes.push('열정적 파트너');
        if (idealScores.commit > 15) compatibleTypes.push('헌신적 동반자');
        if (idealScores.active > 15) compatibleTypes.push('활동적 파트너');

        return {
            idealType: idealTypeResult.resultKey,
            loveLanguage: primaryLanguage,
            compatibleTypes: compatibleTypes.length > 0 ? compatibleTypes : ['균형잡힌 파트너']
        };
    }

    // 라이프스타일 분석
    analyzeLifestyle(lifestyleResults) {
        const profile = {};

        for (const result of lifestyleResults) {
            profile[result.testType] = result.resultKey;
        }

        return profile;
    }

    // 종합 메시지 생성
    generateSummaryMessages(insights) {
        const messages = [];

        if (insights.personalityProfile) {
            const dominant = insights.personalityProfile.dominantTraits[0];
            const traitDescriptions = {
                inssa: '사교적이고 에너지 넘치는',
                adventure: '새로운 도전을 즐기는',
                empathy: '다른 사람의 마음을 잘 이해하는',
                plan: '체계적이고 계획적인',
                mental: '흔들리지 않는 단단한'
            };
            messages.push(`${traitDescriptions[dominant]} 성향이 가장 돋보여요.`);
        }

        if (insights.animalProfile?.mostSimilar) {
            const animalNames = {
                cat: '고양이', dog: '강아지', rabbit: '토끼', hamster: '햄스터'
            };
            const animal = animalNames[insights.animalProfile.mostSimilar];
            messages.push(`당신의 성향은 ${animal}와 가장 잘 맞아요!`);
        }

        if (insights.relationshipProfile) {
            messages.push(`연애에서는 ${insights.relationshipProfile.idealType} 스타일이에요.`);
        }

        return messages;
    }

    // 스마트 추천 (완료한 테스트 기반)
    async getSmartRecommendation(completedTests) {
        // 인사이트 잠금 해제를 위한 추천
        if (!completedTests.includes('human')) {
            return { testType: 'human', reason: '기본 성격 분석을 위해 필요해요' };
        }

        const animalTests = ['cat', 'dog', 'rabbit', 'hamster'];
        const completedAnimals = animalTests.filter(t => completedTests.includes(t));

        if (completedAnimals.length === 0) {
            return { testType: 'cat', reason: '동물 성향 비교를 위해 추천해요' };
        }

        if (!completedTests.includes('idealType')) {
            return { testType: 'idealType', reason: '관계 인사이트를 위해 필요해요' };
        }

        // 아직 안 한 테스트 중 랜덤
        const allTests = ['human', 'cat', 'dog', 'rabbit', 'hamster', 'idealType', 'plant', 'coffee', 'petMatch'];
        const remaining = allTests.filter(t => !completedTests.includes(t));

        if (remaining.length === 0) {
            return { testType: 'human', reason: '다시 해보면 변화를 확인할 수 있어요' };
        }

        return { testType: remaining[0], reason: '아직 안 해본 테스트예요' };
    }
}
```

---

## 4. UI 컴포넌트 설계

### 4.1 새로운 컴포넌트

```
components/
├── Navigation/
│   ├── TestHeader.js       # 테스트 진행 헤더 (뒤로가기, 진행률)
│   ├── ProgressBar.js      # 진행률 바
│   └── ExitModal.js        # 테스트 중단 확인 모달
├── Insights/
│   ├── InsightDashboard.js # 통합 인사이트 대시보드
│   ├── PersonalityCard.js  # 성격 프로필 카드
│   ├── AnimalMatchCard.js  # 동물 매칭 카드
│   ├── RelationshipCard.js # 관계 성향 카드
│   └── ProgressRing.js     # 테스트 완료율 링
└── History/
    ├── ResultHistory.js    # 결과 히스토리 목록
    └── ResultCard.js       # 개별 결과 카드
```

### 4.2 메인 화면 흐름

```
┌──────────────────────────────────────────────┐
│                  홈 화면                      │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  📊 나의 인사이트                      │  │
│  │  [성격] [동물매칭] [관계] [라이프]    │  │
│  │  ─────────────────────────────────     │  │
│  │  완료: 4/9 테스트  [상세보기 →]       │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  🎯 추천 테스트                        │  │
│  │  [식물 테스트] - 라이프 인사이트 해제!│  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ─────────── 테스트 목록 ───────────         │
│  [성격테스트] [고양이] [강아지] ...          │
│                                              │
│  ─────────── 최근 결과 ───────────           │
│  [고양이: 도도한 집사님] [12/10]             │
│  [성격: 활기찬 시티보이] [12/09]             │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 5. 구현 우선순위

### Phase 1: 네비게이션 ✅ 완료 (2025-12-11)
1. ✅ 이전 질문으로 돌아가기 - `handleGoBack()` 구현
2. ✅ 테스트 중단 시 확인 - `handleExit()` 구현
3. ✅ 진행률 표시 헤더 - `TestHeader.js` 컴포넌트
4. ⏳ 진행 상태 로컬 저장 - ProgressService (Turso 연동 시 구현 예정)

**구현 파일:**
- `components/TestHeader.js` - 뒤로가기, 테스트명, 진행률 표시
- `App.js` - `answers` 상태, `handleGoBack()`, `handleExit()` 함수

### Phase 2: 기록 저장 ✅ Turso 연동 완료
1. ✅ Turso 프로젝트 설정 - TursoService.ts 구현
2. ✅ 테이블 생성 - LibSQL 스키마
3. ✅ ResultService Turso 연동
4. ⏳ 익명 → 로그인 계정 병합 (인증 시스템 결정 후)

**현재 상태:** Turso (LibSQL) 연동 완료. 인증은 향후 검토.

### Phase 3: 통합 인사이트 ⏳ 미구현
1. ⏳ InsightService 구현 - 설계만 완료
2. ⏳ 인사이트 대시보드 UI
3. ⏳ 테스트 간 상관관계 계산
4. ✅ 스마트 추천 로직 - NextActionService로 대체 구현

**현재 상태:** InsightService 설계 완료, 구현 대기. NextActionService가 일부 기능 대체.

### Phase 4: 고급 기능 (선택)
1. ⏳ 결과 공유 (이미지 생성)
2. ⏳ 친구와 결과 비교
3. ⏳ 시간에 따른 성향 변화 추적
4. ⏳ 커뮤니티 통계 (익명)

---

## 6. 파일 구조 변경

```
services/
├── TursoService.ts       # ✅ Turso (LibSQL) 클라이언트
├── ResultService.ts      # ✅ 결과 저장 (localStorage + Turso)
├── NextActionService.ts  # ✅ 다음 행동 추천
├── InsightService.ts     # ⏳ 예정 - 통합 인사이트 생성
├── ProgressService.ts    # ⏳ 예정 - 진행 상태 관리

components/
├── App.js                # ✅ 수정 - 네비게이션 + 인사이트 통합
├── Icons.js              # 기존
├── TraitBar.js           # 기존
├── ModeTabs.js           # 기존
├── TestHeader.js         # ✅ 신규 - 테스트 진행 헤더
├── InsightView.js        # ✅ 신규 - 인사이트 대시보드 (탭 UI)
└── ResultHistory.js      # ⏳ 예정 - 결과 히스토리 목록

scripts/
├── test-navigation.mjs   # ✅ 신규 - 네비게이션 테스트 (25개)
└── test-insight-service.mjs # ✅ 신규 - InsightService 테스트 (38개)
```

---

## 7. 환경 설정

```bash
# .env.local (Turso 설정)
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

---

## 다음 단계

### 완료된 항목 ✅
1. ~~이 설계 문서 검토 및 피드백~~
2. ~~Phase 1 (네비게이션) 구현~~ - 2025-12-11 완료
3. ~~Phase 2 (Turso 연동) 구현~~ - 2025-12-21 완료

### 현재 대기 중 ⏳
1. **InsightService 구현** - 통합 인사이트 생성 (설계 완료)
2. **인증 시스템 검토** - 필요시 Supabase Auth 또는 기타 방안
3. **ProgressService 구현** - 진행 상태 서버 저장

### 향후 계획
1. InsightService 구현 (통합 인사이트)
2. ProgressService 구현 (진행 상태 저장)
3. Phase 4 고급 기능 검토
4. 인증 필요시 별도 서비스 연동 검토
