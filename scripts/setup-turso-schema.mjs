/**
 * Turso 데이터베이스 스키마 설정
 *
 * 실행: node scripts/setup-turso-schema.mjs
 */

import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

// .env.local 로드
dotenv.config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const schemas = [
  // 테스트 결과 저장
  // UNIQUE 제약: 같은 device_id + test_type + created_at 조합은 중복 불가
  `CREATE TABLE IF NOT EXISTS test_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    user_id TEXT,
    test_type TEXT NOT NULL,
    result_name TEXT NOT NULL,
    scores TEXT,
    parent_info TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(device_id, test_type, created_at)
  )`,

  // 피드백 (테스트 결과 정확도)
  `CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    user_id TEXT,
    test_type TEXT NOT NULL,
    result_name TEXT NOT NULL,
    is_accurate INTEGER NOT NULL,
    comment TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`,

  // 투표 응답
  `CREATE TABLE IF NOT EXISTS poll_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    user_id TEXT,
    poll_id TEXT NOT NULL,
    option_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(device_id, poll_id)
  )`,

  // 퀴즈 응답 (사용자당 문제당 1회만 저장)
  `CREATE TABLE IF NOT EXISTS quiz_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    user_id TEXT,
    quiz_id TEXT NOT NULL,
    question_index INTEGER NOT NULL,
    selected_option TEXT NOT NULL,
    is_correct INTEGER NOT NULL,
    points INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(device_id, quiz_id, question_index)
  )`,

  // 랭킹 투표
  `CREATE TABLE IF NOT EXISTS ranking_votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    user_id TEXT,
    test_type TEXT NOT NULL,
    result_name TEXT NOT NULL,
    season TEXT NOT NULL,
    week INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(device_id, test_type, season, week)
  )`,

  // 사용자 생성 투표
  `CREATE TABLE IF NOT EXISTS user_polls (
    id TEXT PRIMARY KEY,
    device_id TEXT NOT NULL,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    status TEXT DEFAULT 'pending',
    report_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )`,

  // 좋아요 (댓글, 투표, 퀴즈 등에 사용)
  `CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(device_id, target_type, target_id)
  )`,

  // 댓글
  `CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    content TEXT NOT NULL,
    parent_id INTEGER,
    likes INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (parent_id) REFERENCES comments(id)
  )`,

  // 사용자 프로필 (update-turso-schema.mjs와 동일하게 유지)
  `CREATE TABLE IF NOT EXISTS user_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT UNIQUE NOT NULL,
    user_id TEXT,
    nickname TEXT,
    avatar TEXT,
    badges TEXT,
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    first_visit TEXT DEFAULT (datetime('now')),
    last_visit TEXT DEFAULT (datetime('now')),
    visit_count INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,

  // device_id와 user_id 매핑 (익명 데이터 병합용)
  // - device_id당 하나의 user_id만 허용 (UNIQUE 제약)
  // - 소유 검증: device_id 최초 생성 시점 기록
  `CREATE TABLE IF NOT EXISTS device_id_mappings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT UNIQUE NOT NULL,
    user_id TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    merged_at TEXT
  )`,

  // 인덱스 생성
  `CREATE INDEX IF NOT EXISTS idx_test_results_device ON test_results(device_id)`,
  `CREATE INDEX IF NOT EXISTS idx_test_results_type ON test_results(test_type)`,
  `CREATE INDEX IF NOT EXISTS idx_poll_responses_poll ON poll_responses(poll_id)`,
  `CREATE INDEX IF NOT EXISTS idx_quiz_responses_quiz ON quiz_responses(quiz_id)`,
  `CREATE INDEX IF NOT EXISTS idx_ranking_votes_type ON ranking_votes(test_type, season, week)`,
  `CREATE INDEX IF NOT EXISTS idx_user_polls_status ON user_polls(status)`,
  `CREATE INDEX IF NOT EXISTS idx_user_polls_device ON user_polls(device_id)`,
  `CREATE INDEX IF NOT EXISTS idx_likes_target ON likes(target_type, target_id)`,
  `CREATE INDEX IF NOT EXISTS idx_likes_device ON likes(device_id)`,
  `CREATE INDEX IF NOT EXISTS idx_comments_target ON comments(target_type, target_id)`,
  `CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id)`,
  `CREATE INDEX IF NOT EXISTS idx_device_mappings_user ON device_id_mappings(user_id)`,
];

async function setupSchema() {
  console.log('🚀 Turso 스키마 설정 시작...\n');

  for (const sql of schemas) {
    try {
      await client.execute(sql);
      // 테이블 이름 추출해서 로그
      const match = sql.match(/(?:CREATE TABLE|CREATE INDEX)[^`]*(?:IF NOT EXISTS\s+)?(\w+)/i);
      const name = match ? match[1] : 'unknown';
      console.log(`✅ ${name}`);
    } catch (error) {
      console.error(`❌ 실패:`, error.message);
      console.error(`   SQL: ${sql.substring(0, 50)}...`);
    }
  }

  console.log('\n✨ 스키마 설정 완료!');

  // 테이블 목록 확인
  const tables = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
  );
  console.log('\n📋 생성된 테이블:');
  tables.rows.forEach(row => console.log(`   - ${row.name}`));
}

setupSchema().catch(console.error);
