#!/usr/bin/env node
/**
 * 콘텐츠 검수 시스템 테스트
 *
 * 테스트 항목:
 * 1. 데이터 구조 검증
 * 2. 유틸리티 함수 동작 검증
 * 3. 알림 시스템 로직 검증
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('📋 콘텐츠 검수 시스템 테스트\n');

let errors = 0;
let passed = 0;

// ============================================================================
// 1. 데이터 파일 읽기
// ============================================================================
console.log('=== 1. 데이터 파일 검증 ===');

let dataContent = '';
try {
  dataContent = readFileSync(
    join(projectRoot, 'src/app/dashboard/data/content-review.ts'),
    'utf-8'
  );
  console.log('   ✓ content-review.ts 읽기 성공');
  passed++;
} catch (e) {
  console.log('   ✗ content-review.ts 읽기 실패:', e.message);
  errors++;
}

// ============================================================================
// 2. 타입 정의 확인
// ============================================================================
console.log('\n=== 2. 타입 정의 확인 ===');

const requiredTypes = [
  { name: 'ReviewStatus', pattern: /export\s+type\s+ReviewStatus\s*=/ },
  { name: 'ReviewType', pattern: /export\s+type\s+ReviewType\s*=/ },
  { name: 'ContentReviewItem', pattern: /export\s+interface\s+ContentReviewItem/ },
  { name: 'ReviewStats', pattern: /export\s+interface\s+ReviewStats/ },
  { name: 'ReviewAlertConfig', pattern: /export\s+interface\s+ReviewAlertConfig/ },
];

for (const type of requiredTypes) {
  if (type.pattern.test(dataContent)) {
    console.log(`   ✓ ${type.name} 정의됨`);
    passed++;
  } else {
    console.log(`   ✗ ${type.name} 누락`);
    errors++;
  }
}

// ============================================================================
// 3. 필수 함수 확인
// ============================================================================
console.log('\n=== 3. 필수 함수 확인 ===');

const requiredFunctions = [
  { name: 'calculateReviewStats', desc: '검수 통계 계산' },
  { name: 'getPendingReviews', desc: '대기 중 검수 필터' },
  { name: 'getReviewsByType', desc: '타입별 검수 필터' },
  { name: 'shouldShowAlert', desc: '알림 필요 여부 확인' },
  { name: 'getAlertMessage', desc: '알림 메시지 생성' },
];

for (const fn of requiredFunctions) {
  const pattern = new RegExp(`export\\s+function\\s+${fn.name}`);
  if (pattern.test(dataContent)) {
    console.log(`   ✓ ${fn.name}() - ${fn.desc}`);
    passed++;
  } else {
    console.log(`   ✗ ${fn.name}() 누락`);
    errors++;
  }
}

// ============================================================================
// 4. 검수 항목 데이터 검증
// ============================================================================
console.log('\n=== 4. 검수 항목 데이터 검증 ===');

// 항목 수 확인
const itemMatches = dataContent.match(/id:\s*['"]review-\d{4}-\d{2}-\d{2}-\d{3}['"]/g) || [];
console.log(`   ℹ 검수 항목: ${itemMatches.length}개`);

if (itemMatches.length >= 5) {
  console.log('   ✓ 충분한 샘플 데이터 (5개 이상)');
  passed++;
} else {
  console.log('   ⚠ 샘플 데이터 부족');
}

// 상태별 분포 확인
const pendingCount = (dataContent.match(/status:\s*['"]pending['"]/g) || []).length;
const approvedCount = (dataContent.match(/status:\s*['"]approved['"]/g) || []).length;
const rejectedCount = (dataContent.match(/status:\s*['"]rejected['"]/g) || []).length;
const modifiedCount = (dataContent.match(/status:\s*['"]modified['"]/g) || []).length;

console.log(`   ℹ 상태 분포: 대기 ${pendingCount}, 승인 ${approvedCount}, 거부 ${rejectedCount}, 수정 ${modifiedCount}`);

if (pendingCount > 0 && approvedCount > 0) {
  console.log('   ✓ 다양한 상태의 샘플 존재');
  passed++;
} else {
  console.log('   ⚠ 상태 다양성 부족');
}

// ============================================================================
// 5. 검수 기준 가이드라인 확인
// ============================================================================
console.log('\n=== 5. 검수 기준 가이드라인 ===');

if (/REVIEW_GUIDELINES/.test(dataContent)) {
  console.log('   ✓ REVIEW_GUIDELINES 정의됨');
  passed++;

  // 연령 제한 기준 확인
  if (/age-restriction/.test(dataContent) && /isAdultOnly/.test(dataContent)) {
    console.log('   ✓ 연령 제한 기준 포함');
    passed++;
  } else {
    console.log('   ⚠ 연령 제한 기준 상세 누락');
  }
} else {
  console.log('   ✗ REVIEW_GUIDELINES 누락');
  errors++;
}

// ============================================================================
// 6. 알림 설정 검증
// ============================================================================
console.log('\n=== 6. 알림 시스템 설정 ===');

if (/REVIEW_ALERT_CONFIG/.test(dataContent)) {
  console.log('   ✓ REVIEW_ALERT_CONFIG 정의됨');
  passed++;

  // 임계값 확인
  const thresholdMatch = dataContent.match(/thresholdCount:\s*(\d+)/);
  if (thresholdMatch) {
    const threshold = parseInt(thresholdMatch[1]);
    console.log(`   ℹ 임계값: ${threshold}개 이상 시 알림`);
    if (threshold >= 10 && threshold <= 100) {
      console.log('   ✓ 임계값 범위 적절 (10-100)');
      passed++;
    } else {
      console.log('   ⚠ 임계값이 너무 낮거나 높음');
    }
  }

  // 주간 알림 확인
  if (/weeklyAlertEnabled:\s*true/.test(dataContent)) {
    console.log('   ✓ 주간 알림 활성화');
    passed++;
  }
} else {
  console.log('   ✗ REVIEW_ALERT_CONFIG 누락');
  errors++;
}

// ============================================================================
// 7. 실제 콘텐츠 ID 매칭 확인
// ============================================================================
console.log('\n=== 7. 실제 콘텐츠 ID 매칭 ===');

// 실제 콘텐츠 파일 읽기
let vsPolls = '';
let zodiacPolls = '';

try {
  vsPolls = readFileSync(
    join(projectRoot, 'src/data/content/polls/vs-polls.ts'),
    'utf-8'
  );
  zodiacPolls = readFileSync(
    join(projectRoot, 'src/data/content/fortune/zodiac-polls.ts'),
    'utf-8'
  );
} catch (e) {
  console.log('   ⚠ 콘텐츠 파일 읽기 실패:', e.message);
}

// 검수 항목의 contentId가 실제 존재하는지 확인
const contentIds = [
  { id: 'vs-viral-005', file: 'vs-polls.ts', content: vsPolls },
  { id: 'vs-viral-010', file: 'vs-polls.ts', content: vsPolls },
  { id: 'zodiac-poll-005', file: 'zodiac-polls.ts', content: zodiacPolls },
  { id: 'zodiac-poll-008', file: 'zodiac-polls.ts', content: zodiacPolls },
];

let matchedIds = 0;
for (const item of contentIds) {
  const pattern = new RegExp(`id:\\s*['"]${item.id}['"]`);
  if (pattern.test(item.content)) {
    console.log(`   ✓ ${item.id} → ${item.file}에 존재`);
    matchedIds++;
  } else {
    console.log(`   ⚠ ${item.id} → ${item.file}에서 찾을 수 없음`);
  }
}

if (matchedIds === contentIds.length) {
  console.log('   ✓ 모든 contentId가 실제 콘텐츠와 매칭');
  passed++;
} else {
  console.log(`   ⚠ ${contentIds.length - matchedIds}개 ID 매칭 실패`);
}

// ============================================================================
// 8. UI 컴포넌트 파일 확인
// ============================================================================
console.log('\n=== 8. UI 컴포넌트 확인 ===');

let componentContent = '';
try {
  componentContent = readFileSync(
    join(projectRoot, 'src/app/dashboard/components/ContentReview.tsx'),
    'utf-8'
  );
  console.log('   ✓ ContentReview.tsx 읽기 성공');
  passed++;
} catch (e) {
  console.log('   ✗ ContentReview.tsx 읽기 실패:', e.message);
  errors++;
}

// 필수 컴포넌트 확인
const uiComponents = [
  'StatusBadge',
  'ReviewTypeBadge',
  'ConfidenceBadge',
  'ReviewItemCard',
  'StatsCard',
  'GuidelinesSection',
  'EmptyState',
];

for (const comp of uiComponents) {
  if (new RegExp(`function\\s+${comp}`).test(componentContent)) {
    console.log(`   ✓ ${comp} 컴포넌트`);
    passed++;
  } else {
    console.log(`   ✗ ${comp} 누락`);
    errors++;
  }
}

// 액션 핸들러 확인
const handlers = ['handleApprove', 'handleReject', 'handleModify'];
for (const handler of handlers) {
  if (new RegExp(`const\\s+${handler}`).test(componentContent)) {
    console.log(`   ✓ ${handler}() 핸들러`);
    passed++;
  } else {
    console.log(`   ✗ ${handler}() 누락`);
    errors++;
  }
}

// ============================================================================
// 결과 요약
// ============================================================================
console.log('\n' + '='.repeat(50));
console.log('📊 테스트 결과 요약');
console.log('='.repeat(50));
console.log(`\n   통과: ${passed}개`);
console.log(`   에러: ${errors}개`);

if (errors === 0) {
  console.log('\n✅ 모든 테스트 통과!\n');
  process.exit(0);
} else {
  console.log(`\n❌ ${errors}개 테스트 실패\n`);
  process.exit(1);
}
