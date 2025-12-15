-- ============================================
-- Feedback, Poll, Quiz Response Tables
-- ============================================
-- 익명(device_id) → 회원(user_id) 전환 지원

-- 1. 피드백 테이블 (결과 정확도 + 의견)
CREATE TABLE IF NOT EXISTS mbti_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  test_type VARCHAR(50) NOT NULL,
  result_name VARCHAR(100),
  is_accurate BOOLEAN,        -- 👍👎
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 투표 응답 테이블
CREATE TABLE IF NOT EXISTS mbti_poll_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  poll_id VARCHAR(100) NOT NULL,
  option_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(device_id, poll_id)
);

-- 3. 퀴즈 응답 테이블 (문제별 정답률 추적)
CREATE TABLE IF NOT EXISTS mbti_quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  quiz_id VARCHAR(100) NOT NULL,
  question_index INTEGER NOT NULL,
  selected_option VARCHAR(50) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE mbti_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE mbti_poll_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE mbti_quiz_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert feedback" ON mbti_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read feedback" ON mbti_feedback FOR SELECT USING (true);
CREATE POLICY "Anyone can insert poll" ON mbti_poll_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read poll" ON mbti_poll_responses FOR SELECT USING (true);
CREATE POLICY "Anyone can insert quiz" ON mbti_quiz_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read quiz" ON mbti_quiz_responses FOR SELECT USING (true);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_mbti_feedback_test_type ON mbti_feedback(test_type);
CREATE INDEX IF NOT EXISTS idx_mbti_feedback_device_id ON mbti_feedback(device_id);
CREATE INDEX IF NOT EXISTS idx_mbti_poll_responses_poll_id ON mbti_poll_responses(poll_id);
CREATE INDEX IF NOT EXISTS idx_mbti_poll_responses_device_id ON mbti_poll_responses(device_id);
CREATE INDEX IF NOT EXISTS idx_mbti_quiz_responses_quiz_id ON mbti_quiz_responses(quiz_id);
CREATE INDEX IF NOT EXISTS idx_mbti_quiz_responses_device_id ON mbti_quiz_responses(device_id);

-- 통계용 뷰
CREATE OR REPLACE VIEW mbti_feedback_stats AS
SELECT
    test_type,
    result_name,
    COUNT(*) FILTER (WHERE is_accurate = true) as accurate_count,
    COUNT(*) FILTER (WHERE is_accurate = false) as inaccurate_count,
    COUNT(*) as total_count,
    ROUND(COUNT(*) FILTER (WHERE is_accurate = true) * 100.0 / NULLIF(COUNT(*), 0), 1) as accuracy_rate
FROM mbti_feedback
WHERE created_at > now() - INTERVAL '30 days'
GROUP BY test_type, result_name
ORDER BY total_count DESC;

-- 코멘트
COMMENT ON TABLE mbti_feedback IS '테스트 결과에 대한 사용자 피드백';
COMMENT ON TABLE mbti_poll_responses IS '투표 응답 저장';
COMMENT ON TABLE mbti_quiz_responses IS '퀴즈 문제별 응답 저장';
