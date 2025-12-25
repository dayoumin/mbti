import { validateQuiz, validatePoll, COFFEE_KNOWLEDGE_QUIZZES, COFFEE_VS_POLLS } from '../src/app/dashboard/data/dashboard-content.ts';

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 커피 지식 퀴즈 검증 (10개)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

let errors = 0, warnings = 0;

COFFEE_KNOWLEDGE_QUIZZES.forEach(quiz => {
  const result = validateQuiz(quiz);
  if (!result.isValid || result.warnings.length > 0) {
    console.log(quiz.id + ':');
    if (result.errors.length > 0) {
      errors += result.errors.length;
      result.errors.forEach(e => console.log('  ERROR: ' + e));
    }
    if (result.warnings.length > 0) {
      warnings += result.warnings.length;
      result.warnings.forEach(w => console.log('  WARN: ' + w));
    }
    console.log('');
  }
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 커피 VS 투표 검증 (5개)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

COFFEE_VS_POLLS.forEach(poll => {
  const result = validatePoll(poll);
  if (!result.isValid || result.warnings.length > 0) {
    console.log(poll.id + ':');
    if (result.errors.length > 0) {
      errors += result.errors.length;
      result.errors.forEach(e => console.log('  ERROR: ' + e));
    }
    if (result.warnings.length > 0) {
      warnings += result.warnings.length;
      result.warnings.forEach(w => console.log('  WARN: ' + w));
    }
    console.log('');
  }
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Total Errors: ' + errors + ', Warnings: ' + warnings);
if (errors === 0 && warnings === 0) {
  console.log('All validations passed!');
}
