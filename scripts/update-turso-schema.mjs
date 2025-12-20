/**
 * Turso 데이터베이스 스키마 업데이트
 *
 * 실행: node scripts/update-turso-schema.mjs
 */

import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const schemas = [
  // 1. 사용자 프로필/디바이스 테이블 (user_profiles와 통합)
  // 기존 user_profiles 테이블이 있으면 그대로 사용
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

  // 2. 통합 댓글 테이블 (이미 있을 수 있음)
  `CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    content TEXT NOT NULL,
    parent_id INTEGER,
    likes INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,

  // 3. 좋아요 테이블
  `CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(device_id, target_type, target_id)
  )`,

  // 4. 배지/업적 획득 기록
  `CREATE TABLE IF NOT EXISTS achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    badge_id TEXT NOT NULL,
    badge_type TEXT,
    earned_at TEXT DEFAULT (datetime('now')),
    UNIQUE(device_id, badge_id)
  )`,

  // 5. 게시물 테이블 (Phase 2용)
  `CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    post_type TEXT NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    test_type TEXT,
    result_name TEXT,
    media_url TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,

  // 6. 친구 초대 코드 (Phase 3용)
  `CREATE TABLE IF NOT EXISTS invite_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    device_id TEXT NOT NULL,
    used_count INTEGER DEFAULT 0,
    max_uses INTEGER DEFAULT 10,
    expires_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`,

  // 7. 친구 관계 (Phase 3용)
  `CREATE TABLE IF NOT EXISTS friendships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    requester_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    accepted_at TEXT,
    UNIQUE(requester_id, receiver_id)
  )`,

  // 8. 분석 이벤트
  `CREATE TABLE IF NOT EXISTS analytics_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_category TEXT,
    event_value TEXT,
    test_type TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`,

  // 인덱스들
  'CREATE INDEX IF NOT EXISTS idx_comments_target ON comments(target_type, target_id)',
  'CREATE INDEX IF NOT EXISTS idx_comments_device ON comments(device_id)',
  'CREATE INDEX IF NOT EXISTS idx_likes_target ON likes(target_type, target_id)',
  'CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(post_type, created_at DESC)',
  'CREATE INDEX IF NOT EXISTS idx_posts_device ON posts(device_id)',
  'CREATE INDEX IF NOT EXISTS idx_achievements_device ON achievements(device_id)',
  'CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics_events(event_type)',
  'CREATE INDEX IF NOT EXISTS idx_analytics_device ON analytics_events(device_id)',
];

async function updateSchema() {
  console.log('🔧 Turso 스키마 업데이트 시작...\n');

  for (const sql of schemas) {
    try {
      await client.execute(sql);
      const match = sql.match(/(?:CREATE TABLE|CREATE INDEX)[^(]*(?:IF NOT EXISTS\s+)?(\w+)/i);
      console.log(`✅ ${match ? match[1] : 'done'}`);
    } catch (err) {
      if (!err.message.includes('already exists')) {
        console.log(`❌ Error: ${err.message.substring(0, 80)}`);
      } else {
        const match = sql.match(/(\w+)\s*\(/);
        console.log(`⏭️  ${match ? match[1] : 'table'} (이미 존재)`);
      }
    }
  }

  // 테이블 목록 확인
  const tables = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
  );

  console.log('\n📋 전체 테이블 목록:');
  tables.rows.forEach(r => console.log(`  - ${r.name}`));

  // 각 테이블 컬럼 확인
  console.log('\n📊 주요 테이블 구조:');
  for (const tableName of ['user_profiles', 'comments', 'likes', 'posts', 'achievements']) {
    try {
      const schema = await client.execute(`PRAGMA table_info(${tableName})`);
      console.log(`\n[${tableName}]`);
      schema.rows.forEach(col => console.log(`  ${col.name} (${col.type})`));
    } catch (e) {
      // 테이블 없으면 스킵
    }
  }
}

updateSchema().catch(console.error);
