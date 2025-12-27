#!/usr/bin/env node
/**
 * 태그 커버리지 분석 스크립트
 * - 모든 콘텐츠의 insightTags 사용 현황 분석
 * - 태그별 사용 빈도 집계
 * - 부족한 태그 식별
 * - 인사이트 Stage별 해금 가능성 평가
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// ============================================================================
// 태그 정의 (insight-tags.ts에서 복사)
// ============================================================================

const PERSONALITY_TAGS = [
  'extroverted', 'introverted', 'ambiverted', 'socially-confident', 'socially-anxious',
  'logical', 'emotional', 'intuitive', 'analytical', 'data-driven', 'systematic', 'holistic',
  'planned', 'spontaneous', 'flexible', 'structured', 'organized',
  'independent', 'collaborative', 'supportive', 'leading', 'empathetic', 'nurturing',
  'resilient', 'sensitive', 'calm', 'excitable',
  'expressive', 'reserved', 'articulate', 'observant', 'romantic'
];

const DECISION_TAGS = [
  'practical', 'sentimental', 'idealistic', 'pragmatic',
  'adventurous', 'safe', 'cautious', 'risk-taking', 'conservative',
  'quick-decisive', 'deliberate', 'research-based', 'instinctive',
  'solo', 'together',
  'direct', 'indirect', 'tactful',
  'present-focused', 'future-focused', 'nostalgic'
];

const RELATIONSHIP_TAGS = [
  'competing', 'avoiding', 'accommodating', 'collaborating', 'compromising',
  'close-bonding', 'space-needing',
  'self-first', 'other-first',
  'assertive', 'diplomatic'
];

const INTEREST_TAGS = [
  'interest-cat', 'interest-dog', 'interest-rabbit', 'interest-hamster',
  'interest-bird', 'interest-fish', 'interest-reptile', 'interest-pet',
  'interest-plant', 'interest-nature',
  'interest-coffee', 'interest-food', 'interest-alcohol',
  'interest-love', 'interest-lifestyle', 'interest-money', 'interest-travel',
  'interest-tarot', 'interest-zodiac', 'interest-psychology'
];

const LIFESTYLE_TAGS = [
  'active', 'homebody', 'energetic', 'relaxed',
  'frugal', 'splurger', 'minimalist', 'collector',
  'morning-person', 'night-owl', 'routine-oriented',
  'creative', 'consuming', 'artistic', 'innovative', 'traditional',
  'health-conscious', 'wellness-focused', 'balanced-lifestyle'
];

const ALL_TAGS = {
  personality: PERSONALITY_TAGS,
  decision: DECISION_TAGS,
  relationship: RELATIONSHIP_TAGS,
  interest: INTEREST_TAGS,
  lifestyle: LIFESTYLE_TAGS
};

// ============================================================================
// 콘텐츠 파일 분석
// ============================================================================

function findContentFiles(dir) {
  const files = [];
  const contentDir = path.join(dir, 'src/data/content');

  function walk(d) {
    if (!fs.existsSync(d)) return;
    const items = fs.readdirSync(d);
    for (const item of items) {
      const fullPath = path.join(d, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith('.ts') && !item.includes('types') && !item.includes('index')) {
        files.push(fullPath);
      }
    }
  }

  walk(contentDir);
  return files;
}

function extractInsightTags(content) {
  const tags = {
    personality: [],
    decision: [],
    relationship: [],
    interest: [],
    lifestyle: []
  };

  // insightTags 객체 찾기
  const insightTagsRegex = /insightTags:\s*\{([^}]+)\}/g;
  let match;

  while ((match = insightTagsRegex.exec(content)) !== null) {
    const block = match[1];

    // 각 카테고리별 태그 추출
    for (const category of Object.keys(tags)) {
      const categoryRegex = new RegExp(`${category}:\\s*\\[([^\\]]+)\\]`, 'g');
      const categoryMatch = categoryRegex.exec(block);
      if (categoryMatch) {
        const tagStr = categoryMatch[1];
        const extractedTags = tagStr.match(/'([^']+)'/g) || [];
        tags[category].push(...extractedTags.map(t => t.replace(/'/g, '')));
      }
    }
  }

  return tags;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(rootDir, filePath);
  const tags = extractInsightTags(content);

  // 콘텐츠 개수 추정 (id: 패턴 카운트)
  const idMatches = content.match(/\bid:\s*['"][^'"]+['"]/g) || [];

  return {
    file: relativePath,
    contentCount: idMatches.length,
    tags
  };
}

// ============================================================================
// 분석 및 보고서 생성
// ============================================================================

function generateReport() {
  const files = findContentFiles(rootDir);
  const results = files.map(analyzeFile);

  // 태그 사용 빈도 집계
  const tagUsage = {};
  for (const category of Object.keys(ALL_TAGS)) {
    tagUsage[category] = {};
    for (const tag of ALL_TAGS[category]) {
      tagUsage[category][tag] = 0;
    }
  }

  let totalContents = 0;
  let contentsWithTags = 0;

  for (const result of results) {
    totalContents += result.contentCount;

    let hasAnyTag = false;
    for (const category of Object.keys(result.tags)) {
      for (const tag of result.tags[category]) {
        if (tagUsage[category] && tagUsage[category][tag] !== undefined) {
          tagUsage[category][tag]++;
          hasAnyTag = true;
        }
      }
    }
    if (hasAnyTag) contentsWithTags++;
  }

  // 보고서 출력
  console.log('\n' + '='.repeat(70));
  console.log('📊 태그 커버리지 분석 보고서');
  console.log('='.repeat(70));

  console.log(`\n📁 분석 파일: ${files.length}개`);
  console.log(`📝 총 콘텐츠: ~${totalContents}개`);
  console.log(`✅ 태그 적용 파일: ${contentsWithTags}개`);

  // 카테고리별 상세
  for (const category of Object.keys(ALL_TAGS)) {
    const tags = ALL_TAGS[category];
    const usage = tagUsage[category];

    const used = tags.filter(t => usage[t] > 0);
    const unused = tags.filter(t => usage[t] === 0);
    const total = tags.reduce((sum, t) => sum + usage[t], 0);

    console.log('\n' + '-'.repeat(70));
    console.log(`\n🏷️  ${category.toUpperCase()} (${tags.length}개 태그, 총 ${total}회 사용)`);
    console.log(`   ✅ 사용 중: ${used.length}개 | ❌ 미사용: ${unused.length}개`);

    // 상위 사용 태그
    const sorted = [...tags].sort((a, b) => usage[b] - usage[a]);
    const top5 = sorted.slice(0, 5).filter(t => usage[t] > 0);
    if (top5.length > 0) {
      console.log(`   📈 상위: ${top5.map(t => `${t}(${usage[t]})`).join(', ')}`);
    }

    // 미사용 태그
    if (unused.length > 0) {
      console.log(`   ⚠️  미사용: ${unused.join(', ')}`);
    }
  }

  // 인사이트 Stage 해금 가능성
  console.log('\n' + '-'.repeat(70));
  console.log('\n🎯 인사이트 Stage 해금 가능성');

  const interestTotal = Object.values(tagUsage.interest).reduce((a, b) => a + b, 0);
  const relationshipTotal = Object.values(tagUsage.relationship).reduce((a, b) => a + b, 0);
  const lifestyleTotal = Object.values(tagUsage.lifestyle).reduce((a, b) => a + b, 0);

  console.log(`   Stage 1-3: ✅ 충분 (기본 테스트 기반)`);
  console.log(`   Stage 4 (관심사): ${interestTotal > 0 ? '✅' : '❌'} Interest 태그 ${interestTotal}회 사용`);
  console.log(`   Stage 5 (관계): ${relationshipTotal >= 10 ? '✅' : '⚠️'} Relationship 태그 ${relationshipTotal}회 사용`);
  console.log(`   Stage 6 (통합): ${lifestyleTotal >= 10 ? '✅' : '⚠️'} Lifestyle 태그 ${lifestyleTotal}회 사용`);

  // 권장 사항
  console.log('\n' + '-'.repeat(70));
  console.log('\n📋 권장 콘텐츠 생성 우선순위');

  const priorities = [];

  // 미사용 태그 카운트
  for (const category of Object.keys(ALL_TAGS)) {
    const unused = ALL_TAGS[category].filter(t => tagUsage[category][t] === 0);
    if (unused.length > 0) {
      priorities.push({
        category,
        unusedCount: unused.length,
        unusedTags: unused.slice(0, 5)
      });
    }
  }

  priorities.sort((a, b) => b.unusedCount - a.unusedCount);

  for (let i = 0; i < priorities.length; i++) {
    const p = priorities[i];
    console.log(`   ${i + 1}. ${p.category}: ${p.unusedCount}개 미사용 태그`);
    console.log(`      예: ${p.unusedTags.join(', ')}`);
  }

  // JSON 출력 (대시보드용)
  const jsonReport = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalFiles: files.length,
      totalContents: totalContents,
      filesWithTags: contentsWithTags
    },
    tagUsage,
    stageReadiness: {
      stage4: interestTotal,
      stage5: relationshipTotal,
      stage6: lifestyleTotal
    },
    unusedTags: Object.fromEntries(
      Object.entries(ALL_TAGS).map(([cat, tags]) => [
        cat,
        tags.filter(t => tagUsage[cat][t] === 0)
      ])
    )
  };

  const jsonPath = path.join(rootDir, 'src/data/insight/tag-coverage-report.json');
  fs.writeFileSync(jsonPath, JSON.stringify(jsonReport, null, 2));
  console.log(`\n💾 JSON 보고서 저장: ${path.relative(rootDir, jsonPath)}`);

  console.log('\n' + '='.repeat(70) + '\n');
}

generateReport();