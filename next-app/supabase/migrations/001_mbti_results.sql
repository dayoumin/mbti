-- ============================================
-- MBTI Test Results Table
-- ============================================
-- 단순화 버전: 익명 사용자 우선, 나중에 인증 추가 가능
-- quiz-app-ecosystem의 profiles 테이블과 연동 가능

-- 1. 테이블 생성
CREATE TABLE IF NOT EXISTS mbti_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- 사용자 식별
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,  -- 인증 사용자 (선택)
    device_id TEXT,  -- 익명 사용자 추적용

    -- 테스트 정보
    subject_key VARCHAR(50) NOT NULL,  -- 'human', 'cat', 'dog', 'idealType' 등
    is_deep_mode BOOLEAN DEFAULT false,

    -- 결과 정보
    result_name VARCHAR(100) NOT NULL,  -- '감성 리더', '앙전한 소형견' 등
    result_emoji VARCHAR(10),
    result_mood VARCHAR(20),  -- 'happy', 'cool', 'shy' 등

    -- 점수 데이터
    scores JSONB NOT NULL,  -- {"inssa": 15, "adventure": 12, ...}

    -- 메타데이터
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 인덱스
CREATE INDEX IF NOT EXISTS idx_mbti_results_device_id ON mbti_results(device_id);
CREATE INDEX IF NOT EXISTS idx_mbti_results_user_id ON mbti_results(user_id);
CREATE INDEX IF NOT EXISTS idx_mbti_results_subject_key ON mbti_results(subject_key);
CREATE INDEX IF NOT EXISTS idx_mbti_results_created_at ON mbti_results(created_at DESC);

-- 3. RLS (Row Level Security) - 단순화
ALTER TABLE mbti_results ENABLE ROW LEVEL SECURITY;

-- 누구나 INSERT 가능 (익명 포함)
CREATE POLICY "Anyone can insert results" ON mbti_results
    FOR INSERT WITH CHECK (true);

-- 누구나 SELECT 가능 (통계/공유용)
-- 나중에 제한하려면 이 정책만 수정하면 됨
CREATE POLICY "Anyone can read results" ON mbti_results
    FOR SELECT USING (true);

-- 4. 통계용 뷰 (선택사항)
CREATE OR REPLACE VIEW mbti_result_stats AS
SELECT
    subject_key,
    result_name,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY subject_key), 1) as percentage
FROM mbti_results
WHERE created_at > now() - INTERVAL '30 days'
GROUP BY subject_key, result_name
ORDER BY subject_key, count DESC;

-- 5. 코멘트
COMMENT ON TABLE mbti_results IS 'MBTI/성격 테스트 결과 저장';
COMMENT ON COLUMN mbti_results.device_id IS '익명 사용자 추적용 (localStorage에서 생성된 ID)';
COMMENT ON COLUMN mbti_results.scores IS '차원별 점수 JSON';

-- ============================================
-- 향후 확장 예시 (필요할 때 실행)
-- ============================================

-- 인증 사용자만 읽기로 변경하려면:
-- DROP POLICY "Anyone can read results" ON mbti_results;
-- CREATE POLICY "Users read own results" ON mbti_results
--     FOR SELECT USING (auth.uid() = user_id OR device_id IS NOT NULL);

-- 사용자별 통계 컬럼 추가하려면:
-- ALTER TABLE mbti_results ADD COLUMN duration_seconds INTEGER;
-- ALTER TABLE mbti_results ADD COLUMN question_count INTEGER;
