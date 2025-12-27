#!/usr/bin/env node

/**
 * 리팩토링 검증 스크립트
 * Phase 1-2 변경사항을 검증합니다.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// ANSI 색상 코드
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getLineCount(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.split('\n').length;
  } catch {
    return 0;
  }
}

function hasPattern(filePath, pattern) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.includes(pattern);
  } catch {
    return false;
  }
}

// ============================================================================
// Phase 1 검증
// ============================================================================

log('\n╔════════════════════════════════════════════════════╗', 'bright');
log('║        Phase 1: localStorage 래퍼 검증             ║', 'bright');
log('╚════════════════════════════════════════════════════╝\n', 'bright');

let phase1Passed = true;

// 1. storage.ts 존재 확인
const storagePath = path.join(projectRoot, 'src/utils/storage.ts');
if (fs.existsSync(storagePath)) {
  log('✓ storage.ts 파일 존재', 'green');

  // storage 메서드 확인
  const storageContent = fs.readFileSync(storagePath, 'utf-8');
  const methods = ['get<T>', 'set(', 'remove(', 'clear(', 'has('];
  methods.forEach(method => {
    if (storageContent.includes(method)) {
      log(`  ✓ ${method.replace('<T>', '')} 메서드 존재`, 'green');
    } else {
      log(`  ✗ ${method.replace('<T>', '')} 메서드 누락`, 'red');
      phase1Passed = false;
    }
  });
} else {
  log('✗ storage.ts 파일 누락', 'red');
  phase1Passed = false;
}

// 2. utils/index.ts에서 export 확인
const utilsIndexPath = path.join(projectRoot, 'src/utils/index.ts');
if (hasPattern(utilsIndexPath, "export { storage } from './storage'")) {
  log('✓ utils/index.ts에서 storage export', 'green');
} else {
  log('✗ utils/index.ts export 누락', 'red');
  phase1Passed = false;
}

// 3. 서비스 파일들 확인
log('\n서비스 파일 storage import 확인:', 'cyan');
const services = [
  'ResultService.ts',
  'GamificationService.ts',
  'RankingService.ts',
  'InsightService.ts',
  'FriendService.ts',
  'UserPreferenceService.ts',
  'ContentParticipationService.ts',
  'AnalyticsService.ts',
  'DemographicService.ts'
];

services.forEach(service => {
  const servicePath = path.join(projectRoot, 'src/services', service);
  const hasStorageImport = hasPattern(servicePath, "import { storage }") ||
                          hasPattern(servicePath, "from '@/utils'");
  const hasLocalStorageDirect = hasPattern(servicePath, 'localStorage.get') ||
                                hasPattern(servicePath, 'localStorage.set');

  if (hasStorageImport && !hasLocalStorageDirect) {
    log(`  ✓ ${service}: storage import 사용`, 'green');
  } else if (hasLocalStorageDirect) {
    // CareService는 마이그레이션 함수가 있어서 예외
    if (service === 'CareService.ts') {
      log(`  ✓ ${service}: storage import 사용 (마이그레이션 함수 제외)`, 'green');
    } else {
      log(`  ⚠ ${service}: localStorage 직접 호출 발견`, 'yellow');
    }
  } else if (!hasStorageImport) {
    log(`  ✗ ${service}: storage import 누락`, 'red');
    phase1Passed = false;
  }
});

// ============================================================================
// Phase 2 검증
// ============================================================================

log('\n╔════════════════════════════════════════════════════╗', 'bright');
log('║      Phase 2: ContentExplore 컴포넌트 분리 검증    ║', 'bright');
log('╚════════════════════════════════════════════════════╝\n', 'bright');

let phase2Passed = true;

// 1. 디렉토리 존재 확인
const exploreDir = path.join(projectRoot, 'src/components/content/explore');
if (fs.existsSync(exploreDir)) {
  log('✓ explore 디렉토리 존재', 'green');
} else {
  log('✗ explore 디렉토리 누락', 'red');
  phase2Passed = false;
}

// 2. 필수 파일 존재 확인
log('\n필수 파일 확인:', 'cyan');
const requiredFiles = [
  'types.ts',
  'StreakBanner.tsx',
  'HotTopicsSection.tsx',
  'CategoryProgress.tsx',
  'QuizTab.tsx',
  'PollTab.tsx',
  'CommunityTab.tsx',
  'ContentDiscoverySidebar.tsx'
];

requiredFiles.forEach(file => {
  const filePath = path.join(exploreDir, file);
  if (fs.existsSync(filePath)) {
    const lines = getLineCount(filePath);
    log(`  ✓ ${file} (${lines}줄)`, 'green');
  } else {
    log(`  ✗ ${file} 누락`, 'red');
    phase2Passed = false;
  }
});

// 3. 메인 파일 크기 확인
log('\n파일 크기 목표 달성:', 'cyan');
const mainFilePath = path.join(projectRoot, 'src/components/ContentExplore.tsx');
const mainLines = getLineCount(mainFilePath);
const targetLines = 600;

if (mainLines > 0 && mainLines <= targetLines) {
  log(`  ✓ ContentExplore.tsx: ${mainLines}줄 (목표: ${targetLines}줄 이하)`, 'green');
} else if (mainLines > targetLines) {
  log(`  ⚠ ContentExplore.tsx: ${mainLines}줄 (목표 ${targetLines}줄 초과)`, 'yellow');
} else {
  log(`  ✗ ContentExplore.tsx 파일 없음`, 'red');
  phase2Passed = false;
}

// 4. 서브 컴포넌트 크기 확인
const sizeTargets = {
  'types.ts': 50,
  'StreakBanner.tsx': 100,
  'HotTopicsSection.tsx': 200,
  'CategoryProgress.tsx': 200,
  'QuizTab.tsx': 400,
  'PollTab.tsx': 400,
  'CommunityTab.tsx': 400,
  'ContentDiscoverySidebar.tsx': 200
};

Object.entries(sizeTargets).forEach(([file, target]) => {
  const filePath = path.join(exploreDir, file);
  const lines = getLineCount(filePath);

  if (lines > 0 && lines <= target) {
    log(`  ✓ ${file}: ${lines}줄 (목표: ${target}줄 이하)`, 'green');
  } else if (lines > target) {
    log(`  ⚠ ${file}: ${lines}줄 (목표 ${target}줄 초과)`, 'yellow');
  }
});

// 5. use client 디렉티브 확인
log('\n"use client" 디렉티브 확인:', 'cyan');
const componentFiles = requiredFiles.filter(f => f.endsWith('.tsx'));
componentFiles.forEach(file => {
  const filePath = path.join(exploreDir, file);
  if (hasPattern(filePath, "'use client'")) {
    log(`  ✓ ${file}`, 'green');
  } else {
    log(`  ✗ ${file} - "use client" 누락`, 'red');
    phase2Passed = false;
  }
});

// 6. export default 확인
log('\nexport default 확인:', 'cyan');
componentFiles.forEach(file => {
  const filePath = path.join(exploreDir, file);
  if (hasPattern(filePath, 'export default')) {
    log(`  ✓ ${file}`, 'green');
  } else {
    log(`  ✗ ${file} - export default 누락`, 'red');
    phase2Passed = false;
  }
});

// 7. 메인 파일 import 확인
log('\nContentExplore.tsx import 확인:', 'cyan');
const mainContent = fs.readFileSync(mainFilePath, 'utf-8');
const expectedImports = [
  './content/explore/StreakBanner',
  './content/explore/HotTopicsSection',
  './content/explore/CategoryProgress',
  './content/explore/QuizTab',
  './content/explore/PollTab',
  './content/explore/CommunityTab'
];

expectedImports.forEach(importPath => {
  if (mainContent.includes(importPath)) {
    log(`  ✓ ${importPath}`, 'green');
  } else {
    log(`  ✗ ${importPath} - import 누락`, 'red');
    phase2Passed = false;
  }
});

// 8. 서브 컴포넌트 제거 확인
log('\n서브 컴포넌트 제거 확인:', 'cyan');
const removedComponents = [
  'function QuizCard(',
  'function PollCard(',
  'function TipCard(',
  'function QnACard(',
  'function DebateCard(',
  'function StreakBanner(',
  'function HotTopicItem('
];

removedComponents.forEach(component => {
  if (!mainContent.includes(component)) {
    log(`  ✓ ${component.replace('function ', '').replace('(', '')} 제거됨`, 'green');
  } else {
    log(`  ⚠ ${component.replace('function ', '').replace('(', '')} 여전히 존재`, 'yellow');
  }
});

// ============================================================================
// 전체 통계
// ============================================================================

log('\n╔════════════════════════════════════════════════════╗', 'bright');
log('║              전체 리팩토링 통계                     ║', 'bright');
log('╚════════════════════════════════════════════════════╝\n', 'bright');

// Before/After 비교
log('ContentExplore.tsx 분리:', 'cyan');
log(`  Before: 1,708줄 (단일 파일)`, 'yellow');

let totalExploreLines = 0;
requiredFiles.forEach(file => {
  const filePath = path.join(exploreDir, file);
  totalExploreLines += getLineCount(filePath);
});

const reduction = ((1708 - mainLines) / 1708 * 100).toFixed(1);
log(`  After:  ${mainLines}줄 (메인) + ${totalExploreLines}줄 (8개 파일)`, 'green');
log(`  감소율: ${reduction}% (메인 파일 기준)`, 'green');

// ============================================================================
// 최종 결과
// ============================================================================

log('\n╔════════════════════════════════════════════════════╗', 'bright');
log('║                 최종 검증 결과                      ║', 'bright');
log('╚════════════════════════════════════════════════════╝\n', 'bright');

if (phase1Passed && phase2Passed) {
  log('✅ 모든 검증 통과!', 'green');
  log('\nPhase 1: localStorage 래퍼 ✓', 'green');
  log('Phase 2: ContentExplore 분리 ✓', 'green');
  process.exit(0);
} else {
  if (!phase1Passed) {
    log('❌ Phase 1 검증 실패', 'red');
  }
  if (!phase2Passed) {
    log('❌ Phase 2 검증 실패', 'red');
  }
  process.exit(1);
}
