-- ============================================
-- Add parent test linkage fields
-- ============================================

ALTER TABLE mbti_results
  ADD COLUMN IF NOT EXISTS parent_test VARCHAR(50);

ALTER TABLE mbti_results
  ADD COLUMN IF NOT EXISTS parent_result VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_mbti_results_parent_test ON mbti_results(parent_test);
