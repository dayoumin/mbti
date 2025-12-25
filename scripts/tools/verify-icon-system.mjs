#!/usr/bin/env node
/**
 * 아이콘 시스템 통합 검증 스크립트
 *
 * 검증 항목:
 * 1. 모든 테스트에 lucideIcon이 정의되어 있는지
 * 2. LUCIDE_ICON_MAP에 모든 사용 아이콘이 있는지
 * 3. config.ts가 단일 소스로 동작하는지
 * 4. SubjectKey 개수와 lucideIcon 개수가 일치하는지
 */

import fs from 'fs';

const CONFIG_PATH = 'src/data/config.ts';
const TYPES_PATH = 'src/data/types.ts';
const TEST_ICONS_PATH = 'src/utils/testIcons.tsx';

// 1. types.ts에서 SubjectKey 개수 추출
function countSubjectKeys() {
  const content = fs.readFileSync(TYPES_PATH, 'utf-8');

  // SubjectKey 타입에서 키들 추출
  const subjectKeyMatch = content.match(/export type SubjectKey\s*=([^;]+);/s);
  if (!subjectKeyMatch) {
    console.error('❌ SubjectKey 타입을 찾을 수 없습니다');
    return { count: 0, keys: [] };
  }

  // 'human' | 'cat' 형태에서 키 추출
  const keys = subjectKeyMatch[1]
    .match(/'(\w+)'/g)
    ?.map(s => s.replace(/'/g, '')) || [];

  return { count: keys.length, keys };
}

// 2. config.ts에서 lucideIcon 필드 추출
function extractLucideIconsFromConfig() {
  const content = fs.readFileSync(CONFIG_PATH, 'utf-8');
  const icons = {};
  const missing = [];

  // SUBJECT_CONFIG 블록 추출
  const configMatch = content.match(/export const SUBJECT_CONFIG[^{]*\{([\s\S]*?)\n\};/);
  if (!configMatch) {
    console.error('❌ SUBJECT_CONFIG를 찾을 수 없습니다');
    return { icons: {}, missing: [] };
  }

  const configBlock = configMatch[1];

  // 각 테스트 블록에서 lucideIcon 추출
  const testBlocks = configBlock.matchAll(/(\w+):\s*\{([^}]+testType[^}]+)\}/g);
  for (const match of testBlocks) {
    const testKey = match[1];
    const block = match[2];
    const iconMatch = block.match(/lucideIcon:\s*["'](\w+)["']/);

    if (iconMatch) {
      icons[testKey] = iconMatch[1];
    } else {
      missing.push(testKey);
    }
  }

  return { icons, missing };
}

// 3. testIcons.tsx에서 LUCIDE_ICON_MAP 추출
function extractLucideIconMap() {
  const content = fs.readFileSync(TEST_ICONS_PATH, 'utf-8');

  // LUCIDE_ICON_MAP 추출
  const mapMatch = content.match(/const LUCIDE_ICON_MAP[^{]*\{([^}]+)\}/s);
  if (!mapMatch) {
    console.error('❌ LUCIDE_ICON_MAP을 찾을 수 없습니다');
    return [];
  }

  // 아이콘 이름들 추출
  const icons = mapMatch[1]
    .split(',')
    .map(s => s.trim())
    .filter(s => s && !s.includes('//'));
  return icons;
}

// 4. 검증 실행
function verify() {
  console.log('=== 아이콘 시스템 통합 검증 ===\n');

  let hasError = false;

  // SubjectKey 개수 확인
  const { count: totalSubjects, keys: subjectKeys } = countSubjectKeys();
  console.log(`📊 types.ts SubjectKey 개수: ${totalSubjects}개\n`);

  // config.ts 검증
  const { icons: configIcons, missing: missingLucideIcon } = extractLucideIconsFromConfig();
  const configIconNames = Object.values(configIcons);
  const configTestCount = Object.keys(configIcons).length;

  console.log(`✅ config.ts에서 ${configTestCount}개 테스트의 lucideIcon 발견`);

  // lucideIcon 누락 검사 (핵심!)
  if (missingLucideIcon.length > 0) {
    console.log(`❌ lucideIcon 필드 누락된 테스트: ${missingLucideIcon.join(', ')}`);
    hasError = true;
  }

  // SubjectKey 개수와 일치 검사
  if (configTestCount !== totalSubjects) {
    console.log(`⚠️  SubjectKey(${totalSubjects})와 lucideIcon(${configTestCount}) 개수 불일치`);

    // 누락된 테스트 찾기
    const configKeys = Object.keys(configIcons);
    const notInConfig = subjectKeys.filter(k => !configKeys.includes(k));
    if (notInConfig.length > 0) {
      console.log(`   config.ts에 없는 키: ${notInConfig.join(', ')}`);
    }
  } else {
    console.log(`✅ SubjectKey 개수와 lucideIcon 개수 일치 (${totalSubjects}개)`);
  }

  // 사용된 유니크 아이콘
  const uniqueIcons = [...new Set(configIconNames)];
  console.log(`\n📦 사용된 아이콘 종류: ${uniqueIcons.length}개`);
  console.log(`   ${uniqueIcons.join(', ')}\n`);

  // testIcons.tsx 검증
  const mapIcons = extractLucideIconMap();
  console.log(`📦 testIcons.tsx LUCIDE_ICON_MAP: ${mapIcons.length}개`);
  console.log(`   ${mapIcons.join(', ')}\n`);

  // MAP 누락 검사
  const missingInMap = uniqueIcons.filter(icon => !mapIcons.includes(icon));
  if (missingInMap.length > 0) {
    console.log(`❌ LUCIDE_ICON_MAP에 누락된 아이콘: ${missingInMap.join(', ')}`);
    hasError = true;
  } else {
    console.log(`✅ 모든 사용 아이콘이 LUCIDE_ICON_MAP에 존재`);
  }

  // 미사용 아이콘
  const unusedInMap = mapIcons.filter(icon => !uniqueIcons.includes(icon));
  if (unusedInMap.length > 0) {
    console.log(`ℹ️  LUCIDE_ICON_MAP에 있지만 미사용: ${unusedInMap.join(', ')}`);
  }

  console.log('\n=== 검증 완료 ===');

  if (hasError) {
    console.log('\n❌ 에러가 있습니다. 위 내용을 확인하세요.');
  } else {
    console.log('\n✅ 모든 검증 통과!');
  }

  return {
    totalSubjects,
    configTestCount,
    uniqueIconTypes: uniqueIcons.length,
    mapIcons: mapIcons.length,
    missingLucideIcon: missingLucideIcon.length,
    missingInMap: missingInMap.length,
    success: !hasError
  };
}

const result = verify();
process.exit(result.success ? 0 : 1);
