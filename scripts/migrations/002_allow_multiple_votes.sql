-- ============================================================================
-- allowMultiple 투표 지원을 위한 스키마 변경
--
-- 기존: UNIQUE(device_id, poll_id) - 사용자당 투표당 1개 옵션만
-- 변경: UNIQUE(device_id, poll_id, option_id) - 사용자당 투표당 옵션별 1개
--
-- 이렇게 하면:
-- - 일반 투표: 앱 로직에서 1개만 저장하도록 제어
-- - allowMultiple 투표: 여러 옵션 저장 가능, 같은 옵션 중복 방지
-- ============================================================================

-- 1. 기존 테이블 백업 (안전을 위해)
CREATE TABLE IF NOT EXISTS poll_responses_backup AS SELECT * FROM poll_responses;

-- 2. 새 테이블 생성 (새 UNIQUE 제약)
CREATE TABLE IF NOT EXISTS poll_responses_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id TEXT NOT NULL,
  user_id TEXT,
  poll_id TEXT NOT NULL,
  option_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(device_id, poll_id, option_id)
);

-- 3. 기존 데이터 이전
INSERT OR IGNORE INTO poll_responses_new (id, device_id, user_id, poll_id, option_id, created_at)
SELECT id, device_id, user_id, poll_id, option_id, created_at FROM poll_responses;

-- 4. 기존 테이블 삭제 후 이름 변경
DROP TABLE poll_responses;
ALTER TABLE poll_responses_new RENAME TO poll_responses;

-- 5. 인덱스 재생성
CREATE INDEX IF NOT EXISTS idx_poll_responses_poll ON poll_responses(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_responses_device ON poll_responses(device_id);

-- 6. 백업 테이블 삭제 (운영 환경에서는 일정 기간 후 수동 삭제 권장)
-- DROP TABLE poll_responses_backup;
