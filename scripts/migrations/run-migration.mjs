/**
 * Turso 마이그레이션 실행 스크립트
 *
 * 사용법: node scripts/run-migration.mjs [migration-file]
 * 예시: node scripts/run-migration.mjs 001_content_tables.sql
 */

import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// .env.local 로드
dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));

async function runMigration() {
  const migrationFile = process.argv[2] || '001_content_tables.sql';
  const migrationPath = join(__dirname, 'migrations', migrationFile);

  console.log(`\n📦 Running migration: ${migrationFile}\n`);

  // 환경 변수 확인
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.error('❌ TURSO_DATABASE_URL is not defined');
    process.exit(1);
  }

  console.log(`🔗 Database: ${url.split('@')[1] || url}\n`);

  // SQL 파일 읽기
  let sql;
  try {
    sql = readFileSync(migrationPath, 'utf-8');
  } catch (error) {
    console.error(`❌ Cannot read migration file: ${migrationPath}`);
    process.exit(1);
  }

  // Turso 클라이언트 생성
  const client = createClient({ url, authToken });

  // SQL 문장별로 분리하여 실행
  // 1. 주석 라인 제거
  const lines = sql.split('\n').filter(line => !line.trim().startsWith('--'));
  const cleanSql = lines.join('\n');

  // 2. 세미콜론으로 분리
  const statements = cleanSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`📝 Found ${statements.length} SQL statements\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const statement of statements) {
    // 첫 줄만 로그에 표시
    const firstLine = statement.split('\n')[0].trim();
    const preview = firstLine.length > 60 ? firstLine.slice(0, 60) + '...' : firstLine;

    try {
      await client.execute(statement);
      console.log(`✅ ${preview}`);
      successCount++;
    } catch (error) {
      // 이미 존재하는 경우 무시
      if (error.message?.includes('already exists')) {
        console.log(`⏭️  ${preview} (already exists)`);
        successCount++;
      } else {
        console.error(`❌ ${preview}`);
        console.error(`   Error: ${error.message}\n`);
        errorCount++;
      }
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`${'='.repeat(50)}\n`);

  // 테이블 목록 확인
  console.log('📋 Current tables in database:\n');
  const result = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
  );

  for (const row of result.rows) {
    console.log(`   - ${row.name}`);
  }

  console.log('');

  await client.close();

  if (errorCount > 0) {
    process.exit(1);
  }
}

runMigration().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
