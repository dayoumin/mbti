/**
 * Supabase 연결 테스트 스크립트
 * Usage: node scripts/test-supabase.mjs
 */

import { createClient } from '@supabase/supabase-js';

// 환경변수 직접 로드 (dotenv 없이)
import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

const envPath = join(projectRoot, '.env.local');

if (!existsSync(envPath)) {
  console.log('❌ .env.local 파일이 없습니다:', envPath);
  process.exit(1);
}

const envContent = readFileSync(envPath, 'utf-8');

const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('============================================================');
console.log('Supabase 연결 테스트');
console.log('============================================================\n');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.log('❌ 환경변수 미설정');
  console.log('   SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗');
  console.log('   SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '✓' : '✗');
  process.exit(1);
}

console.log('📋 환경변수');
console.log('   URL:', SUPABASE_URL);
console.log('   KEY:', SUPABASE_ANON_KEY.substring(0, 20) + '...');
console.log();

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  console.log('📡 1. 연결 테스트');

  try {
    // mbti_results 테이블 조회
    const { data, error, count } = await supabase
      .from('mbti_results')
      .select('*', { count: 'exact' })
      .limit(5);

    if (error) {
      console.log('   ❌ 테이블 조회 실패:', error.message);

      if (error.message.includes('does not exist')) {
        console.log('\n   💡 테이블이 없습니다. Supabase SQL Editor에서 마이그레이션 실행 필요:');
        console.log('      1. supabase/migrations/001_mbti_results.sql');
        console.log('      2. supabase/migrations/002_mbti_results_parent_info.sql');
        console.log('      3. supabase/migrations/003_feedback_poll_quiz.sql');
      }
      return false;
    }

    console.log('   ✅ mbti_results 테이블 연결 성공');
    console.log(`   📊 현재 레코드: ${count || 0}개`);

    if (data && data.length > 0) {
      console.log('\n   최근 5개 결과:');
      data.forEach((row, i) => {
        console.log(`   ${i + 1}. ${row.subject_key}: ${row.result_emoji || ''} ${row.result_name}`);
      });
    }

    return true;
  } catch (err) {
    console.log('   ❌ 연결 오류:', err.message);
    return false;
  }
}

async function testInsert() {
  console.log('\n📝 2. INSERT 테스트');

  const testData = {
    device_id: 'test_' + Date.now(),
    subject_key: '_test',
    result_name: '테스트 결과',
    result_emoji: '🧪',
    scores: { test: 100 },
    is_deep_mode: false,
  };

  try {
    const { data, error } = await supabase
      .from('mbti_results')
      .insert(testData)
      .select()
      .single();

    if (error) {
      console.log('   ❌ INSERT 실패:', error.message);
      return null;
    }

    console.log('   ✅ INSERT 성공');
    console.log(`   ID: ${data.id}`);

    return data.id;
  } catch (err) {
    console.log('   ❌ INSERT 오류:', err.message);
    return null;
  }
}

async function testDelete(id) {
  if (!id) return;

  console.log('\n🗑️ 3. DELETE 테스트 (테스트 데이터 정리)');

  try {
    const { error } = await supabase
      .from('mbti_results')
      .delete()
      .eq('id', id);

    if (error) {
      console.log('   ⚠️ DELETE 실패 (RLS 정책일 수 있음):', error.message);
      return;
    }

    console.log('   ✅ DELETE 성공');
  } catch (err) {
    console.log('   ⚠️ DELETE 오류:', err.message);
  }
}

async function testOtherTables() {
  console.log('\n📋 4. 추가 테이블 확인');

  const tables = [
    { name: 'mbti_feedback', desc: '피드백' },
    { name: 'mbti_poll_responses', desc: '투표 응답' },
    { name: 'mbti_quiz_responses', desc: '퀴즈 응답' },
  ];

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table.name)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`   ❌ ${table.desc} (${table.name}): ${error.message}`);
      } else {
        console.log(`   ✅ ${table.desc} (${table.name}): ${count || 0}개`);
      }
    } catch (err) {
      console.log(`   ❌ ${table.desc} (${table.name}): ${err.message}`);
    }
  }
}

async function testStats() {
  console.log('\n📊 5. 통계 뷰 확인');

  try {
    const { data, error } = await supabase
      .from('mbti_result_stats')
      .select('*')
      .limit(10);

    if (error) {
      console.log('   ⚠️ 통계 뷰 조회 실패:', error.message);
      return;
    }

    console.log('   ✅ mbti_result_stats 뷰 사용 가능');
    if (data && data.length > 0) {
      console.log('\n   테스트별 상위 결과 (최근 30일):');
      data.slice(0, 5).forEach((row) => {
        console.log(`   - ${row.subject_key}: ${row.result_name} (${row.count}회, ${row.percentage}%)`);
      });
    }
  } catch (err) {
    console.log('   ⚠️ 통계 뷰 오류:', err.message);
  }
}

// 실행
async function main() {
  const connected = await testConnection();

  if (connected) {
    const insertedId = await testInsert();
    await testDelete(insertedId);
    await testOtherTables();
    await testStats();
  }

  console.log('\n============================================================');
  console.log(connected ? '✅ Supabase 연동 준비 완료!' : '❌ Supabase 설정 필요');
  console.log('============================================================');
}

main().catch(console.error);
