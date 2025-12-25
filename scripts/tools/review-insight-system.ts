/**
 * 인사이트 시스템 체계적 검토
 * 실행: npx tsx scripts/review-insight-system.ts
 */

import {
  INSIGHT_STAGES,
  PERSONALITY_TAGS,
  DECISION_TAGS,
  RELATIONSHIP_TAGS,
  SAMPLE_RULES,
  RULE_PLAN,
  INSIGHT_SYSTEM,
} from '../src/app/dashboard/data/insight-system.ts';

console.log('═'.repeat(60));
console.log('📋 인사이트 시스템 체계적 검토 리포트');
console.log('═'.repeat(60));

// ============================================================================
// 1. 해금 흐름 검토
// ============================================================================

console.log('\n📊 1. 해금 흐름 분석\n');

console.log('단계별 해금 조건:');
INSIGHT_STAGES.forEach(stage => {
  const bar = '█'.repeat(stage.id * 2);
  const costIcon = stage.cost === 'paid' ? '💰' : '🆓';
  console.log(`  ${stage.emoji} Stage ${stage.id}: ${stage.name}`);
  console.log(`     조건: ${stage.unlockCondition} ${costIcon}`);
  console.log(`     방식: ${stage.analysisMethod}`);
  if (stage.nudgeMessage) {
    console.log(`     유도: "${stage.nudgeMessage.replace(/\*\*/g, '')}"`);
  }
  console.log('');
});

// 해금 난이도 분석
console.log('해금 난이도 곡선:');
const difficulties = [
  { stage: 1, effort: 1, label: '테스트 1개 - 즉시' },
  { stage: 2, effort: 3, label: '테스트 3개 - 쉬움' },
  { stage: 3, effort: 10, label: '투표 10개 - 보통' },
  { stage: 4, effort: 15, label: '활동 15개 - 보통' },
  { stage: 5, effort: 10, label: '관계 활동 10개 - 특수' },
  { stage: 6, effort: 30, label: '활동 30개 - 어려움' },
  { stage: 7, effort: 20, label: '활동 20개+ 유료 - ?' },
];

difficulties.forEach(d => {
  const bar = '▓'.repeat(Math.min(d.effort, 30));
  console.log(`  Stage ${d.stage}: ${bar} ${d.label}`);
});

console.log('\n⚠️ 발견된 이슈:');
console.log('  - Stage 7(20개)이 Stage 6(30개)보다 숫자가 작음');
console.log('  - Stage 5는 "관계 활동"이라는 특수 조건 (추적 필요)');

// ============================================================================
// 2. 태그 커버리지 분석
// ============================================================================

console.log('\n\n📊 2. 태그 커버리지 분석\n');

console.log('성격 태그 (Big Five 기반):');
const personalityGroups = {
  '에너지 방향 (외향성)': ['extroverted', 'introverted', 'ambiverted'],
  '정보 처리 (개방성)': ['logical', 'emotional', 'intuitive', 'analytical'],
  '행동 방식 (성실성)': ['planned', 'spontaneous', 'flexible', 'structured'],
  '관계 스타일 (친화성)': ['independent', 'collaborative', 'supportive', 'leading'],
  '정서 안정성 (신경성)': ['resilient', 'sensitive'],
};

Object.entries(personalityGroups).forEach(([group, tags]) => {
  const existing = tags.filter(t => PERSONALITY_TAGS.includes(t as any));
  const missing = tags.filter(t => !PERSONALITY_TAGS.includes(t as any));
  console.log(`  ${group}:`);
  console.log(`    ✅ ${existing.join(', ')}`);
  if (missing.length) console.log(`    ❌ 누락: ${missing.join(', ')}`);
});

console.log('\n결정 태그 (투표용):');
const decisionPairs = [
  ['practical', 'sentimental', '실용 vs 감성'],
  ['safe', 'adventurous', '안전 vs 모험'],
  ['solo', 'together', '혼자 vs 함께'],
  ['direct', 'indirect', '직접 vs 우회'],
  ['present-focused', 'future-focused', '현재 vs 미래'],
];

decisionPairs.forEach(([a, b, label]) => {
  const hasA = DECISION_TAGS.includes(a as any);
  const hasB = DECISION_TAGS.includes(b as any);
  const status = hasA && hasB ? '✅' : '❌';
  console.log(`  ${status} ${label}: ${a} ↔ ${b}`);
});

console.log('\n관계 태그 (TKI 기반):');
const tkiTypes = ['competing', 'avoiding', 'accommodating', 'collaborating', 'compromising'];
const hasTKI = tkiTypes.every(t => RELATIONSHIP_TAGS.includes(t as any));
console.log(`  TKI 5유형: ${hasTKI ? '✅ 모두 포함' : '❌ 일부 누락'}`);

// ============================================================================
// 3. 룰 커버리지 분석
// ============================================================================

console.log('\n\n📊 3. 룰 커버리지 분석\n');

console.log('룰 카테고리별 목표 vs 현재:');
const categories = ['personality', 'lifestyle', 'relationship', 'hidden'];
categories.forEach(cat => {
  const planned = RULE_PLAN[cat]?.count || 0;
  const current = SAMPLE_RULES.filter(r => r.category === cat).length;
  const percent = planned > 0 ? Math.round((current / planned) * 100) : 0;
  const bar = '█'.repeat(Math.round(percent / 10)) + '░'.repeat(10 - Math.round(percent / 10));
  console.log(`  ${cat}: ${bar} ${current}/${planned} (${percent}%)`);
});

console.log('\n추가 필요한 룰 유형:');
const neededRules = [
  { type: '성격 조합', example: '개 테스트(활발) + 커피(에스프레소) → 에너지 넘치는 도전가', priority: '높음' },
  { type: '라이프스타일', example: '식물(다육이) + 고양이(독립형) → 저유지보수 라이프', priority: '중간' },
  { type: '관계 패턴', example: '갈등(회피) + 이상형(안정) → 평화주의자', priority: '중간' },
  { type: '숨은 모순', example: '계획형 성격 + 모험 투표 → 계획된 일탈러', priority: '높음' },
];

neededRules.forEach(r => {
  console.log(`  [${r.priority}] ${r.type}`);
  console.log(`      예: ${r.example}`);
});

// ============================================================================
// 4. 기술 구현 체크리스트
// ============================================================================

console.log('\n\n📊 4. 기술 구현 체크리스트\n');

const techChecklist = [
  { item: 'json-rules-engine 설치', status: '미완료', priority: 'Phase 1' },
  { item: 'InsightService 생성', status: '미완료', priority: 'Phase 1' },
  { item: '테스트 결과 → 태그 매핑', status: '미완료', priority: 'Phase 1' },
  { item: '투표 옵션 → 태그 매핑', status: '미완료', priority: 'Phase 2' },
  { item: '해금 조건 체크 로직', status: '미완료', priority: 'Phase 2' },
  { item: '인사이트 UI 컴포넌트', status: '미완료', priority: 'Phase 2' },
  { item: 'Turso DB 스키마', status: '미완료', priority: 'Phase 3' },
  { item: 'AI 프롬프트 최적화', status: '미완료', priority: 'Phase 4' },
];

techChecklist.forEach(t => {
  const icon = t.status === '완료' ? '✅' : '⬜';
  console.log(`  ${icon} [${t.priority}] ${t.item}`);
});

// ============================================================================
// 5. 비즈니스 검증
// ============================================================================

console.log('\n\n📊 5. 비즈니스 모델 검증\n');

const businessCheck = {
  '무료 가치': 'Stage 1-6으로 충분한 가치 제공 → 사용자 유입',
  '유료 유인': 'AI 분석의 차별화된 가치 필요 → 전환율 결정',
  '가격 적정성': '$2.99-4.99 1회 vs $4.99-9.99 월구독',
  '경쟁사 대비': '16Personalities(유료 리포트), Co-Star(무료+프리미엄)',
};

Object.entries(businessCheck).forEach(([key, value]) => {
  console.log(`  📌 ${key}:`);
  console.log(`     ${value}`);
});

console.log('\n전환율 시나리오:');
console.log('  MAU 10,000명 기준');
console.log('  ├─ Stage 6 도달: 15% (1,500명)');
console.log('  ├─ AI 분석 관심: 30% (450명)');
console.log('  └─ 유료 전환: 10% (45명) = $135-225/월');

// ============================================================================
// 6. 종합 권장사항
// ============================================================================

console.log('\n\n' + '═'.repeat(60));
console.log('📋 종합 권장사항 (우선순위순)');
console.log('═'.repeat(60));

const recommendations = [
  {
    priority: '🔴 높음',
    item: '룰 58개 추가 작성',
    reason: '현재 2개로는 다양한 인사이트 불가',
    effort: '콘텐츠 작업 3-5일',
  },
  {
    priority: '🟡 중간',
    item: 'Stage 7 해금 조건 명확화',
    reason: '"20개+"가 Stage 6(30개)보다 작아 혼동',
    effort: '문구 수정 1시간',
  },
  {
    priority: '🟡 중간',
    item: '테스트 결과 태그 매핑',
    reason: '룰 엔진이 동작하려면 입력 데이터 필요',
    effort: '개발 2-3일',
  },
  {
    priority: '🟢 낮음',
    item: '"관계 활동" 정의 명확화',
    reason: 'Stage 5 조건이 모호함',
    effort: '기획 확정 필요',
  },
];

recommendations.forEach((r, i) => {
  console.log(`\n${i + 1}. ${r.priority} ${r.item}`);
  console.log(`   이유: ${r.reason}`);
  console.log(`   작업량: ${r.effort}`);
});

console.log('\n');
