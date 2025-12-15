-- ============================================
-- Analytics Events Table
-- ============================================
-- 사용자 행동 이벤트 추적 (추천 클릭, 전환율 등)
-- 현재: 저장만. 대시보드 조회 기능은 추후 필요시 추가

-- 1. 이벤트 테이블
CREATE TABLE IF NOT EXISTS mbti_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- 이벤트 정보
  event_type VARCHAR(50) NOT NULL,      -- 'recommendation_click', 'recommendation_view', 'test_start', etc.
  event_category VARCHAR(50),            -- 'next_action', 'content', 'test', 'community'

  -- 컨텍스트 정보
  source_endpoint VARCHAR(50),           -- 'test_result', 'quiz_result', 'poll_result', 'community_view', etc.
  source_id VARCHAR(100),                -- 콘텐츠 ID (테스트 결과, 퀴즈 ID 등)
  source_category VARCHAR(50),           -- 콘텐츠 카테고리 (human, cat, dog 등)

  -- 타겟 정보 (클릭 시)
  target_type VARCHAR(50),               -- 'test', 'quiz', 'poll', 'community'
  target_id VARCHAR(100),                -- 타겟 ID
  target_category VARCHAR(50),           -- 타겟 카테고리

  -- 추천 관련
  recommendation_priority VARCHAR(20),   -- 'primary', 'secondary', 'tertiary'
  recommendation_position INTEGER,       -- 추천 목록에서 몇 번째 위치

  -- 메타데이터
  meta JSONB DEFAULT '{}',               -- 추가 정보 (화면 크기, 시간대 등)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE mbti_analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert events" ON mbti_analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read own events" ON mbti_analytics_events FOR SELECT USING (true);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_analytics_device_id ON mbti_analytics_events(device_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON mbti_analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON mbti_analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_source ON mbti_analytics_events(source_endpoint, source_category);

-- 통계용 뷰: 추천 클릭률
CREATE OR REPLACE VIEW mbti_recommendation_stats AS
SELECT
    source_endpoint,
    source_category,
    target_type,
    target_category,
    recommendation_priority,
    COUNT(*) FILTER (WHERE event_type = 'recommendation_view') as view_count,
    COUNT(*) FILTER (WHERE event_type = 'recommendation_click') as click_count,
    ROUND(
      COUNT(*) FILTER (WHERE event_type = 'recommendation_click') * 100.0 /
      NULLIF(COUNT(*) FILTER (WHERE event_type = 'recommendation_view'), 0),
      1
    ) as click_rate
FROM mbti_analytics_events
WHERE created_at > now() - INTERVAL '30 days'
  AND event_type IN ('recommendation_view', 'recommendation_click')
GROUP BY source_endpoint, source_category, target_type, target_category, recommendation_priority
ORDER BY view_count DESC;

-- 일별 이벤트 요약 뷰
CREATE OR REPLACE VIEW mbti_daily_events AS
SELECT
    DATE(created_at) as event_date,
    event_type,
    event_category,
    COUNT(*) as event_count,
    COUNT(DISTINCT device_id) as unique_users
FROM mbti_analytics_events
WHERE created_at > now() - INTERVAL '30 days'
GROUP BY DATE(created_at), event_type, event_category
ORDER BY event_date DESC, event_count DESC;

-- 코멘트
COMMENT ON TABLE mbti_analytics_events IS '사용자 행동 이벤트 추적 (추천 클릭, 전환율 분석용)';
COMMENT ON VIEW mbti_recommendation_stats IS '추천 클릭률 통계 (최근 30일)';
COMMENT ON VIEW mbti_daily_events IS '일별 이벤트 요약 (최근 30일)';
