-- ============================================================================
-- 콘텐츠 테이블 마이그레이션: quizzes, polls, scenarios, tournaments
-- 기존 테이블(poll_responses, quiz_responses 등)에 영향 없음
-- ============================================================================

-- ============================================================================
-- 1. 퀴즈 테이블 (지식/상황/성격 기반 퀴즈)
-- ============================================================================
CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY,                    -- 'cat-quiz-001'
  type TEXT NOT NULL DEFAULT 'knowledge', -- 'knowledge' | 'personality-based' | 'situational'
  category TEXT NOT NULL,                 -- 'cat' | 'dog' | 'plant' 등
  question TEXT NOT NULL,
  options TEXT NOT NULL,                  -- JSON: [{id, text, isCorrect?, points?}]
  explanation TEXT,                       -- 정답 해설
  related_result TEXT,                    -- 연관 테스트 결과 (성격 기반용)
  difficulty INTEGER NOT NULL DEFAULT 1,  -- 1 | 2 | 3
  points INTEGER DEFAULT 10,              -- 획득 포인트
  tags TEXT,                              -- JSON: ['행동', '바디랭귀지']
  status TEXT NOT NULL DEFAULT 'active',  -- 'draft' | 'active' | 'hidden'
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_quizzes_category ON quizzes(category);
CREATE INDEX IF NOT EXISTS idx_quizzes_type ON quizzes(type);
CREATE INDEX IF NOT EXISTS idx_quizzes_status ON quizzes(status);

-- ============================================================================
-- 2. 시나리오 퀴즈 테이블 (여러 문제 → 종합 등급)
-- ============================================================================
CREATE TABLE IF NOT EXISTS scenario_quizzes (
  id TEXT PRIMARY KEY,                    -- 'cat-scenario-butler'
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  emoji TEXT NOT NULL,
  theme_color TEXT NOT NULL,              -- 'bg-orange-100'
  questions TEXT NOT NULL,                -- JSON: [{id, situation?, question, options}]
  results TEXT NOT NULL,                  -- JSON: [{minScore, maxScore, grade, title, emoji, description, tips?}]
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_scenarios_category ON scenario_quizzes(category);
CREATE INDEX IF NOT EXISTS idx_scenarios_status ON scenario_quizzes(status);

-- ============================================================================
-- 3. 투표 테이블 (vs/choice/ranking/scale)
-- ============================================================================
CREATE TABLE IF NOT EXISTS polls (
  id TEXT PRIMARY KEY,                    -- 'cat-poll-001'
  type TEXT NOT NULL DEFAULT 'vs',        -- 'vs' | 'choice' | 'ranking' | 'scale'
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT NOT NULL,                  -- JSON: [{id, text, emoji?}]
  tags TEXT,                              -- JSON: ['사료', '먹이']
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_polls_category ON polls(category);
CREATE INDEX IF NOT EXISTS idx_polls_type ON polls(type);
CREATE INDEX IF NOT EXISTS idx_polls_status ON polls(status);

-- ============================================================================
-- 4. 토너먼트 테이블 (월드컵/브래킷)
-- ============================================================================
CREATE TABLE IF NOT EXISTS tournaments (
  id TEXT PRIMARY KEY,                    -- 'cat-breed-worldcup-v1'
  type TEXT NOT NULL DEFAULT 'worldcup',  -- 'worldcup' | 'bracket'
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  emoji TEXT NOT NULL,
  theme_color TEXT NOT NULL,
  round_size INTEGER NOT NULL DEFAULT 16, -- 4 | 8 | 16 | 32 | 64
  contestants TEXT NOT NULL,              -- JSON: [{id, name, emoji, description, tags?, funFact?}]
  result_config TEXT NOT NULL,            -- JSON: {showRanking, showWinRate, showSegmentComparison, shareMessage}
  status TEXT NOT NULL DEFAULT 'active',  -- 'draft' | 'active' | 'ended'
  start_at TEXT,
  end_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tournaments_category ON tournaments(category);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);

-- ============================================================================
-- 5. 콘텐츠 통계 뷰 (조회용)
-- ============================================================================
-- 퀴즈 통계 뷰
CREATE VIEW IF NOT EXISTS v_quiz_stats AS
SELECT
  q.id,
  q.category,
  q.type,
  q.difficulty,
  COUNT(qr.device_id) as attempt_count,
  SUM(CASE WHEN qr.is_correct = 1 THEN 1 ELSE 0 END) as correct_count,
  CASE
    WHEN COUNT(qr.device_id) > 0
    THEN ROUND(100.0 * SUM(CASE WHEN qr.is_correct = 1 THEN 1 ELSE 0 END) / COUNT(qr.device_id))
    ELSE 0
  END as correct_rate
FROM quizzes q
LEFT JOIN quiz_responses qr ON qr.quiz_id = q.id
WHERE q.status = 'active'
GROUP BY q.id;

-- 투표 통계 뷰
CREATE VIEW IF NOT EXISTS v_poll_stats AS
SELECT
  p.id,
  p.category,
  p.type,
  COUNT(pr.device_id) as vote_count,
  COALESCE(lc.like_count, 0) as like_count
FROM polls p
LEFT JOIN poll_responses pr ON pr.poll_id = p.id
LEFT JOIN (
  SELECT target_id, COUNT(*) as like_count
  FROM likes
  WHERE target_type = 'poll'
  GROUP BY target_id
) lc ON lc.target_id = p.id
WHERE p.status = 'active'
GROUP BY p.id;
