/**
 * Ranking 테이블 스키마 마이그레이션
 *
 * 기존 ranking_votes 테이블을 RankingService와 호환되도록 확장
 *
 * 실행: node scripts/migrate-ranking-schema.mjs
 */

import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const migrations = [
  // 1. 기존 ranking_votes 테이블 백업 (데이터가 있다면)
  // SQLite는 ALTER TABLE이 제한적이므로 새 테이블 생성 후 마이그레이션

  // 2. 새로운 ranking_votes 테이블 생성 (RankingService 호환)
  `CREATE TABLE IF NOT EXISTS ranking_votes_new (
    id TEXT PRIMARY KEY,
    device_id TEXT NOT NULL,
    user_id TEXT,
    category_id TEXT NOT NULL,
    result_key TEXT NOT NULL,
    result_emoji TEXT,
    test_type TEXT NOT NULL,
    season_id TEXT NOT NULL,
    season_type TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )`,

  // 3. 인덱스 생성
  `CREATE INDEX IF NOT EXISTS idx_ranking_votes_new_season ON ranking_votes_new(season_id)`,
  `CREATE INDEX IF NOT EXISTS idx_ranking_votes_new_category ON ranking_votes_new(season_id, category_id)`,
  `CREATE INDEX IF NOT EXISTS idx_ranking_votes_new_device ON ranking_votes_new(device_id)`,
  `CREATE INDEX IF NOT EXISTS idx_ranking_votes_new_result ON ranking_votes_new(result_key, test_type)`,

  // 4. 기존 테이블 삭제 및 이름 변경
  `DROP TABLE IF EXISTS ranking_votes`,
  `ALTER TABLE ranking_votes_new RENAME TO ranking_votes`,

  // 5. 랭킹 통계 캐시 테이블 (선택적 - 빠른 조회용)
  `CREATE TABLE IF NOT EXISTS ranking_stats_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    season_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    result_key TEXT NOT NULL,
    vote_count INTEGER DEFAULT 0,
    last_updated TEXT DEFAULT (datetime('now')),
    UNIQUE(season_id, category_id, result_key)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_ranking_stats_season ON ranking_stats_cache(season_id)`,
];

async function migrate() {
  console.log('🚀 Ranking 스키마 마이그레이션 시작...\n');

  // 기존 데이터 확인
  try {
    const existing = await client.execute('SELECT COUNT(*) as count FROM ranking_votes');
    console.log(`📊 기존 ranking_votes 데이터: ${existing.rows[0].count}건`);

    if (existing.rows[0].count > 0) {
      console.log('⚠️  기존 데이터가 있습니다. 스키마가 다르므로 마이그레이션이 필요합니다.');
      console.log('   (현재는 새 스키마로 덮어씁니다 - 기존 데이터 유실 가능)');
    }
  } catch (e) {
    console.log('📝 기존 ranking_votes 테이블 없음 - 새로 생성');
  }

  // 마이그레이션 실행
  for (const sql of migrations) {
    try {
      await client.execute(sql);
      const match = sql.match(/(?:CREATE TABLE|CREATE INDEX|DROP TABLE|ALTER TABLE)[^`]*(?:IF NOT EXISTS\s+)?(\w+)/i);
      const name = match ? match[1] : 'unknown';
      console.log(`✅ ${name}`);
    } catch (error) {
      // 이미 존재하는 경우 무시
      if (error.message.includes('already exists')) {
        console.log(`⏭️  이미 존재: ${sql.substring(0, 40)}...`);
      } else if (error.message.includes('no such table')) {
        console.log(`⏭️  테이블 없음 (정상): ${sql.substring(0, 40)}...`);
      } else {
        console.error(`❌ 실패:`, error.message);
      }
    }
  }

  // 결과 확인
  console.log('\n📋 현재 테이블 구조:');
  try {
    const schema = await client.execute("PRAGMA table_info(ranking_votes)");
    schema.rows.forEach(row => {
      console.log(`   - ${row.name}: ${row.type}${row.pk ? ' (PK)' : ''}`);
    });
  } catch (e) {
    console.error('스키마 조회 실패:', e.message);
  }

  console.log('\n✨ 마이그레이션 완료!');
}

migrate().catch(console.error);
