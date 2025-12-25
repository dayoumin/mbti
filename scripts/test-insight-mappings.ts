/**
 * 인사이트 시스템 매핑 테이블 검증 스크립트
 * 실행: npx tsx scripts/test-insight-mappings.ts
 */

import {
  BEHAVIOR_TRAIT_MAPPINGS,
  SOCIAL_BATTERY_CONFIG,
  PERSONA_GUIDE,
  type BehaviorTraitMapping
} from '../src/app/dashboard/data/insight-system';

const errors: string[] = [];
const warnings: string[] = [];

console.log('='.repeat(60));
console.log('인사이트 시스템 매핑 테이블 검증');
console.log('='.repeat(60));

// ============================================================================
// 1. BEHAVIOR_TRAIT_MAPPINGS 검증
// ============================================================================
console.log('\n📊 1. 행동-특성 매핑 테이블 검증');
console.log('-'.repeat(40));

// 1.1 필수 필드 검증
const requiredFields: (keyof BehaviorTraitMapping)[] = ['activity', 'activityKr', 'primaryTrait', 'narrativeAngle'];
const traitFields = ['trait', 'impact', 'direction'] as const;
const validImpacts = ['high', 'medium', 'low'];
const validDirections = ['+', '-'];

BEHAVIOR_TRAIT_MAPPINGS.forEach((mapping, index) => {
  const activityName = mapping.activity || 'unknown';

  // 필수 필드 체크
  requiredFields.forEach(field => {
    if (!mapping[field]) {
      errors.push(`[${index}] ${activityName}: 필수 필드 '${field}' 누락`);
    }
  });

  // primaryTrait 구조 체크
  if (mapping.primaryTrait) {
    traitFields.forEach(field => {
      if (!mapping.primaryTrait[field]) {
        errors.push(`[${index}] ${activityName}: primaryTrait.${field} 누락`);
      }
    });

    if (mapping.primaryTrait.impact && !validImpacts.includes(mapping.primaryTrait.impact)) {
      errors.push(`[${index}] ${activityName}: primaryTrait.impact 값 오류 (${mapping.primaryTrait.impact})`);
    }

    if (mapping.primaryTrait.direction && !validDirections.includes(mapping.primaryTrait.direction)) {
      errors.push(`[${index}] ${activityName}: primaryTrait.direction 값 오류 (${mapping.primaryTrait.direction})`);
    }
  }

  // secondaryTrait 구조 체크 (있는 경우)
  if (mapping.secondaryTrait) {
    traitFields.forEach(field => {
      if (!mapping.secondaryTrait![field]) {
        warnings.push(`[${index}] ${activityName}: secondaryTrait.${field} 누락`);
      }
    });
  }

  // source 권장 (없으면 경고)
  if (!mapping.source) {
    warnings.push(`[${index}] ${activityName}: 출처(source) 없음`);
  }
});

console.log(`총 ${BEHAVIOR_TRAIT_MAPPINGS.length}개 매핑 검증 완료`);

// 1.2 벡터별 분포 확인
const vectorCategories: Record<string, string[]> = {
  pet: ['dog_walking', 'cat_care', 'dog_training', 'cat_play', 'pet_community'],
  taste: ['black_coffee', 'latte_sweet', 'tea_preference'],
  social: ['large_party', 'solo_reading', 'small_group'],
  conflict: ['conflict_avoid', 'conflict_compete', 'conflict_collaborate', 'conflict_accommodate', 'conflict_compromise'],
  lifestyle: ['morning_routine', 'night_owl', 'plant_care', 'spontaneous_trip'],
  expression: ['direct_expression', 'indirect_expression', 'gift_giving', 'quality_time'],
};

console.log('\n벡터별 분포:');
Object.entries(vectorCategories).forEach(([category, activities]) => {
  const found = activities.filter(a =>
    BEHAVIOR_TRAIT_MAPPINGS.some(m => m.activity === a)
  );
  const missing = activities.filter(a =>
    !BEHAVIOR_TRAIT_MAPPINGS.some(m => m.activity === a)
  );

  console.log(`  ${category}: ${found.length}/${activities.length}`);
  if (missing.length > 0) {
    errors.push(`${category} 벡터에서 누락: ${missing.join(', ')}`);
  }
});

// ============================================================================
// 2. SOCIAL_BATTERY_CONFIG 검증
// ============================================================================
console.log('\n🔋 2. 사회적 배터리 설정 검증');
console.log('-'.repeat(40));

// 2.1 energyImpact 값 범위 체크 (-100 ~ +100)
Object.entries(SOCIAL_BATTERY_CONFIG.energyImpact).forEach(([activity, impact]) => {
  if (impact < -100 || impact > 100) {
    errors.push(`energyImpact.${activity}: 범위 초과 (${impact})`);
  }
});
console.log(`energyImpact: ${Object.keys(SOCIAL_BATTERY_CONFIG.energyImpact).length}개 활동 정의`);

// 2.2 thresholds 논리 체크
const { introvert, ambivert, extravert } = SOCIAL_BATTERY_CONFIG.thresholds;
if (introvert >= ambivert) {
  errors.push(`thresholds: introvert(${introvert}) >= ambivert(${ambivert}) 논리 오류`);
}
console.log(`thresholds: introvert=${introvert}, ambivert=${ambivert}, extravert=${extravert}`);

// 2.3 messages 필수 상태 체크
const requiredStates = ['critical', 'low', 'medium', 'high', 'full'] as const;
requiredStates.forEach(state => {
  if (!SOCIAL_BATTERY_CONFIG.messages[state]) {
    errors.push(`messages.${state}: 누락`);
  }
});
console.log(`messages: ${Object.keys(SOCIAL_BATTERY_CONFIG.messages).length}개 상태 정의`);

// ============================================================================
// 3. PERSONA_GUIDE 검증
// ============================================================================
console.log('\n🎭 3. 페르소나 가이드 검증');
console.log('-'.repeat(40));

// 3.1 persona 정의 체크
if (!PERSONA_GUIDE.persona?.name) {
  errors.push('persona.name 누락');
}
if (!PERSONA_GUIDE.persona?.tone) {
  errors.push('persona.tone 누락');
}
console.log(`페르소나: "${PERSONA_GUIDE.persona?.name}"`);
console.log(`어조: ${PERSONA_GUIDE.persona?.tone}`);

// 3.2 toneExamples 체크
const requiredTones = ['biting', 'supportive', 'discovery'] as const;
requiredTones.forEach(tone => {
  const examples = PERSONA_GUIDE.toneExamples?.[tone];
  if (!examples || examples.length === 0) {
    errors.push(`toneExamples.${tone}: 예시 없음`);
  }
});
console.log(`어조 예시: ${Object.keys(PERSONA_GUIDE.toneExamples || {}).join(', ')}`);

// 3.3 promptTemplate 체크
if (!PERSONA_GUIDE.promptTemplate?.system) {
  errors.push('promptTemplate.system 누락');
}
if (!PERSONA_GUIDE.promptTemplate?.userDataFormat) {
  errors.push('promptTemplate.userDataFormat 누락');
}
if (!PERSONA_GUIDE.promptTemplate?.outputFormat) {
  errors.push('promptTemplate.outputFormat 누락');
}
console.log(`프롬프트 템플릿: ${Object.keys(PERSONA_GUIDE.promptTemplate || {}).length}개 섹션`);

// 3.4 toneSelection 체크
const requiredSelections = ['contradiction', 'firstUnlock', 'hiddenPattern', 'lowBattery', 'shareable'] as const;
requiredSelections.forEach(sel => {
  if (!PERSONA_GUIDE.toneSelection?.[sel]) {
    warnings.push(`toneSelection.${sel}: 정의 없음`);
  }
});

// ============================================================================
// 결과 출력
// ============================================================================
console.log('\n' + '='.repeat(60));
console.log('검증 결과');
console.log('='.repeat(60));

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n✅ 모든 검증 통과!');
} else {
  if (errors.length > 0) {
    console.log(`\n❌ 에러 (${errors.length}개):`);
    errors.forEach(e => console.log(`   - ${e}`));
  }
  if (warnings.length > 0) {
    console.log(`\n⚠️ 경고 (${warnings.length}개):`);
    warnings.forEach(w => console.log(`   - ${w}`));
  }
}

console.log('\n');
process.exit(errors.length > 0 ? 1 : 0);
