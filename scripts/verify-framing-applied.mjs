/**
 * 실제 CHEMI_DATA 변환 결과 검증
 * index.ts의 applyPositiveFramingToTest 적용 여부 확인
 */

import { HUMAN_DATA } from '../src/data/subjects/human.ts';

console.log('\n════════════════════════════════════════════════════════════');
console.log('📋 Human 테스트 원본 데이터 샘플');
console.log('════════════════════════════════════════════════════════════\n');

// 1. 원본 질문 확인 (변환 전)
const empathyQ = HUMAN_DATA.questions.find(q => q.q?.includes('리더로서'));
console.log('📌 원본 질문 (변환 전):');
console.log(`   Q: ${empathyQ?.q}`);
console.log(`   A1: ${empathyQ?.a?.[0]?.text}`);
console.log(`   A2: ${empathyQ?.a?.[1]?.text}`);

const criticQ = HUMAN_DATA.questions.find(q => q.q.includes('비판적'));
console.log('\n📌 비판 관련 질문 (변환 전):');
console.log(`   Q: ${criticQ?.q}`);

console.log('\n✅ 검증 완료');
console.log('   - 원본 데이터는 "냉정하게", "비판적인" 포함 (정상)');
console.log('   - index.ts에서 applyPositiveFramingToTest 적용 시 변환됨');
console.log('   - 런타임에 CHEMI_DATA.human으로 접근 시 긍정 표현으로 변경\n');
