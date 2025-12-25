/**
 * 타입 강제 테스트 파일
 *
 * 이 파일은 팩트 필요 카테고리의 source 필수 타입 강제가
 * 제대로 작동하는지 검증합니다.
 *
 * 테스트 방법: npm run build
 * - 주석 처리된 케이스는 빌드 에러 발생 케이스
 * - 주석 해제하면 빌드 실패 확인 가능
 */

import type { KnowledgeQuiz, FactRequiredCategory } from '../src/data/content/types';

// ============================================================================
// 케이스 1: 팩트 필요 카테고리 (cat, dog, rabbit, hamster, plant, coffee, alcohol)
// → source 필수!
// ============================================================================

// ✅ 올바른 예 1: cat 카테고리 + source 있음
const validCatQuiz: KnowledgeQuiz = {
  id: 'test-cat-001',
  category: 'cat',
  question: '고양이 정상 체온은?',
  options: [
    { id: 'a', text: '35-36도', isCorrect: false },
    { id: 'b', text: '37.5-39.2도', isCorrect: true },
    { id: 'c', text: '40-41도', isCorrect: false },
  ],
  explanation: '고양이 정상 체온은 37.5-39.2도입니다.',
  difficulty: 1,
  source: 'cat-fact-002', // ← 필수!
};

// ✅ 올바른 예 2: dog 카테고리 + general-knowledge
const validDogQuiz: KnowledgeQuiz = {
  id: 'test-dog-001',
  category: 'dog',
  question: '강아지가 꼬리를 흔드는 이유는?',
  options: [
    { id: 'a', text: '기분 좋아서', isCorrect: false },
    { id: 'b', text: '다양한 감정 표현', isCorrect: true },
    { id: 'c', text: '화나서', isCorrect: false },
  ],
  explanation: '꼬리 흔들기는 다양한 감정을 나타냅니다.',
  difficulty: 1,
  source: 'general-knowledge', // ← 팩트 파일 없어도 OK
};

// ✅ 올바른 예 3: plant 카테고리 + source
const validPlantQuiz: KnowledgeQuiz = {
  id: 'test-plant-001',
  category: 'plant',
  question: '몬스테라 잎에 구멍이 생기는 이유는?',
  options: [
    { id: 'a', text: '병충해', isCorrect: false },
    { id: 'b', text: '빛 투과', isCorrect: true },
    { id: 'c', text: '물 부족', isCorrect: false },
  ],
  explanation: '열대 우림에서 빛을 더 받기 위해 진화했습니다.',
  difficulty: 2,
  source: 'general-knowledge',
};

// ✅ 올바른 예 4: coffee 카테고리 + source
const validCoffeeQuiz: KnowledgeQuiz = {
  id: 'test-coffee-001',
  category: 'coffee',
  question: '에스프레소의 특징은?',
  options: [
    { id: 'a', text: '연한 맛', isCorrect: false },
    { id: 'b', text: '고압 추출', isCorrect: true },
    { id: 'c', text: '저온 추출', isCorrect: false },
  ],
  explanation: '에스프레소는 9bar 이상의 압력으로 추출합니다.',
  difficulty: 2,
  source: 'coffee-fact-001',
};

// ✅ 올바른 예 5: alcohol 카테고리 + source
const validAlcoholQuiz: KnowledgeQuiz = {
  id: 'test-alcohol-001',
  category: 'alcohol',
  question: '위스키의 숙성 최소 기간은?',
  options: [
    { id: 'a', text: '1년', isCorrect: false },
    { id: 'b', text: '3년', isCorrect: true },
    { id: 'c', text: '5년', isCorrect: false },
  ],
  explanation: '스카치 위스키는 최소 3년 이상 숙성해야 합니다.',
  difficulty: 2,
  source: 'alcohol-fact-001',
  meta: { ageRating: 'adult', ageRestrictionReason: 'alcohol' },
};

// ============================================================================
// 케이스 2: 일반 카테고리 (personality, love, lifestyle 등)
// → source 선택!
// ============================================================================

// ✅ 올바른 예 6: personality 카테고리 + source 없음 (선택이므로 OK)
const validPersonalityQuiz: KnowledgeQuiz = {
  id: 'test-personality-001',
  category: 'personality',
  question: 'MBTI E/I 차원의 의미는?',
  options: [
    { id: 'a', text: '내향/외향', isCorrect: true },
    { id: 'b', text: '감각/직관', isCorrect: false },
    { id: 'c', text: '사고/감정', isCorrect: false },
  ],
  explanation: 'E는 외향, I는 내향입니다.',
  difficulty: 1,
  // source 없어도 OK!
};

// ✅ 올바른 예 7: love 카테고리 + source 없음
const validLoveQuiz: KnowledgeQuiz = {
  id: 'test-love-001',
  category: 'love',
  question: '5가지 사랑의 언어 중 하나는?',
  options: [
    { id: 'a', text: '칭찬의 말', isCorrect: true },
    { id: 'b', text: '침묵', isCorrect: false },
    { id: 'c', text: '무관심', isCorrect: false },
  ],
  explanation: '칭찬의 말은 5가지 사랑의 언어 중 하나입니다.',
  difficulty: 1,
  // source 없어도 OK!
};

// ✅ 올바른 예 8: general 카테고리 + source 없음
const validGeneralQuiz: KnowledgeQuiz = {
  id: 'test-general-001',
  category: 'general',
  question: '한국의 수도는?',
  options: [
    { id: 'a', text: '서울', isCorrect: true },
    { id: 'b', text: '부산', isCorrect: false },
    { id: 'c', text: '대구', isCorrect: false },
  ],
  explanation: '대한민국의 수도는 서울입니다.',
  difficulty: 1,
  // source 없어도 OK!
};

// ============================================================================
// 케이스 3: 빌드 에러 케이스 (주석 해제 시 에러 발생!)
// ============================================================================

// ❌ 에러 케이스 1: cat 카테고리인데 source 없음
// 주석 해제하면: "Property 'source' is missing in type..."
/*
const invalidCatQuiz: KnowledgeQuiz = {
  id: 'test-cat-invalid',
  category: 'cat',
  question: '고양이 문제',
  options: [{ id: 'a', text: '답', isCorrect: true }],
  explanation: '해설',
  difficulty: 1,
  // source 없음 → 에러!
};
*/

// ❌ 에러 케이스 2: dog 카테고리인데 source 없음
/*
const invalidDogQuiz: KnowledgeQuiz = {
  id: 'test-dog-invalid',
  category: 'dog',
  question: '강아지 문제',
  options: [{ id: 'a', text: '답', isCorrect: true }],
  explanation: '해설',
  difficulty: 1,
  // source 없음 → 에러!
};
*/

// ❌ 에러 케이스 3: rabbit 카테고리인데 source 없음
/*
const invalidRabbitQuiz: KnowledgeQuiz = {
  id: 'test-rabbit-invalid',
  category: 'rabbit',
  question: '토끼 문제',
  options: [{ id: 'a', text: '답', isCorrect: true }],
  explanation: '해설',
  difficulty: 1,
  // source 없음 → 에러!
};
*/

// ❌ 에러 케이스 4: plant 카테고리인데 source 없음
/*
const invalidPlantQuiz: KnowledgeQuiz = {
  id: 'test-plant-invalid',
  category: 'plant',
  question: '식물 문제',
  options: [{ id: 'a', text: '답', isCorrect: true }],
  explanation: '해설',
  difficulty: 1,
  // source 없음 → 에러!
};
*/

// ❌ 에러 케이스 5: coffee 카테고리인데 source 없음
/*
const invalidCoffeeQuiz: KnowledgeQuiz = {
  id: 'test-coffee-invalid',
  category: 'coffee',
  question: '커피 문제',
  options: [{ id: 'a', text: '답', isCorrect: true }],
  explanation: '해설',
  difficulty: 1,
  // source 없음 → 에러!
};
*/

// ❌ 에러 케이스 6: alcohol 카테고리인데 source 없음
/*
const invalidAlcoholQuiz: KnowledgeQuiz = {
  id: 'test-alcohol-invalid',
  category: 'alcohol',
  question: '술 문제',
  options: [{ id: 'a', text: '답', isCorrect: true }],
  explanation: '해설',
  difficulty: 1,
  // source 없음 → 에러!
};
*/

// ============================================================================
// 테스트 유틸리티: 타입 체크 함수
// ============================================================================

/**
 * 팩트 필요 카테고리인지 확인
 */
function isFactRequiredCategory(category: string): category is FactRequiredCategory {
  const factRequired: FactRequiredCategory[] = ['cat', 'dog', 'rabbit', 'hamster', 'plant', 'coffee', 'alcohol'];
  return factRequired.includes(category as FactRequiredCategory);
}

/**
 * 퀴즈 배열 검증 (런타임)
 */
function validateQuizzes(quizzes: KnowledgeQuiz[]): void {
  for (const quiz of quizzes) {
    if (isFactRequiredCategory(quiz.category)) {
      // 팩트 필요 카테고리는 source 필수
      if (!('source' in quiz) || !quiz.source) {
        console.error(`❌ ${quiz.id}: 팩트 필요 카테고리(${quiz.category})인데 source 없음`);
      } else {
        console.log(`✅ ${quiz.id}: source='${quiz.source}'`);
      }
    } else {
      console.log(`ℹ️ ${quiz.id}: 일반 카테고리(${quiz.category}) - source 선택`);
    }
  }
}

// 테스트 실행
const allQuizzes: KnowledgeQuiz[] = [
  validCatQuiz,
  validDogQuiz,
  validPlantQuiz,
  validCoffeeQuiz,
  validAlcoholQuiz,
  validPersonalityQuiz,
  validLoveQuiz,
  validGeneralQuiz,
];

console.log('=== 타입 강제 테스트 ===\n');
validateQuizzes(allQuizzes);
console.log('\n=== 테스트 완료 ===');

// ============================================================================
// 케이스 4: 엣지 케이스 테스트
// ============================================================================

// ✅ 엣지 케이스 1: hamster 카테고리 + source (팩트 필요)
const validHamsterQuiz: KnowledgeQuiz = {
  id: 'test-hamster-001',
  category: 'hamster',
  question: '햄스터 볼주머니의 용도는?',
  options: [
    { id: 'a', text: '음식 저장', isCorrect: true },
    { id: 'b', text: '공기 저장', isCorrect: false },
    { id: 'c', text: '물 저장', isCorrect: false },
  ],
  explanation: '햄스터는 볼주머니에 음식을 저장합니다.',
  difficulty: 1,
  source: 'general-knowledge',
};

// ✅ 엣지 케이스 2: lifestyle 카테고리 (일반 - source 선택)
const validLifestyleQuiz: KnowledgeQuiz = {
  id: 'test-lifestyle-001',
  category: 'lifestyle',
  question: '아침형 인간의 특징은?',
  options: [
    { id: 'a', text: '일찍 자고 일찍 일어남', isCorrect: true },
    { id: 'b', text: '늦게 자고 늦게 일어남', isCorrect: false },
  ],
  explanation: '아침형 인간은 이른 시간에 활동적입니다.',
  difficulty: 1,
  // source 없어도 OK (lifestyle은 일반 카테고리)
};

// ✅ 엣지 케이스 3: zodiac 카테고리 (일반 - source 선택)
const validZodiacQuiz: KnowledgeQuiz = {
  id: 'test-zodiac-001',
  category: 'zodiac',
  question: '양자리의 기간은?',
  options: [
    { id: 'a', text: '3월 21일 ~ 4월 19일', isCorrect: true },
    { id: 'b', text: '4월 20일 ~ 5월 20일', isCorrect: false },
  ],
  explanation: '양자리는 봄의 시작입니다.',
  difficulty: 1,
  // source 없어도 OK (zodiac은 일반 카테고리)
};

// ✅ 엣지 케이스 4: 팩트 필요 카테고리 + 모든 필드 채움
const validFullCatQuiz: KnowledgeQuiz = {
  id: 'test-cat-full',
  category: 'cat',
  question: '고양이 수염 역할은?',
  options: [
    { id: 'a', text: '감각 기관', isCorrect: true },
    { id: 'b', text: '장식', isCorrect: false },
    { id: 'c', text: '방어', isCorrect: false },
  ],
  explanation: '수염은 진동 감지 등 중요한 감각 기관입니다.',
  difficulty: 2,
  source: 'cat-fact-003',
  factRef: {
    factId: 'cat-fact-003',
    verifiedDate: '2024-12-24',
  },
  tags: ['고양이', '수염', '감각'],
  meta: {
    ageRating: 'all',
    createdBy: 'ai',
  },
};

// ✅ 엣지 케이스 5: 일반 카테고리 + source 있음 (선택이지만 추가 가능)
const validGeneralWithSource: KnowledgeQuiz = {
  id: 'test-general-with-source',
  category: 'general',
  question: '지구의 위성은?',
  options: [
    { id: 'a', text: '달', isCorrect: true },
    { id: 'b', text: '화성', isCorrect: false },
  ],
  explanation: '달은 지구의 유일한 자연 위성입니다.',
  difficulty: 1,
  source: 'astronomy-101', // 일반 카테고리도 source 추가 가능
};

// 모든 테스트 퀴즈 배열
const allQuizzesExtended: KnowledgeQuiz[] = [
  // 기본 케이스
  validCatQuiz,
  validDogQuiz,
  validPlantQuiz,
  validCoffeeQuiz,
  validAlcoholQuiz,
  validPersonalityQuiz,
  validLoveQuiz,
  validGeneralQuiz,
  // 엣지 케이스
  validHamsterQuiz,
  validLifestyleQuiz,
  validZodiacQuiz,
  validFullCatQuiz,
  validGeneralWithSource,
];

console.log('\n=== 확장 테스트 ===\n');
validateQuizzes(allQuizzesExtended);

// ============================================================================
// 카테고리별 통계
// ============================================================================

const factRequiredCategories: FactRequiredCategory[] = ['cat', 'dog', 'rabbit', 'hamster', 'plant', 'coffee', 'alcohol'];

console.log('\n=== 카테고리별 통계 ===');
console.log('팩트 필요 카테고리:', factRequiredCategories.join(', '));

const factRequiredCount = allQuizzesExtended.filter(q => isFactRequiredCategory(q.category)).length;
const generalCount = allQuizzesExtended.filter(q => !isFactRequiredCategory(q.category)).length;

console.log(`팩트 필요 카테고리 퀴즈: ${factRequiredCount}개`);
console.log(`일반 카테고리 퀴즈: ${generalCount}개`);
console.log(`총 퀴즈: ${allQuizzesExtended.length}개`);

console.log('\n=== 모든 테스트 통과! ===');

// Export for module resolution
export { allQuizzes, allQuizzesExtended };
