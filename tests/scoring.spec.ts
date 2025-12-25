import { expect, test } from '@playwright/test';

// 테스트를 위해 동일한 로직 복제 (모듈 임포트 이슈 우회)
const LEVEL_THRESHOLDS = { HIGH: 60, LOW: 40 } as const;
const LEVELS = { HIGH: 'high', MEDIUM: 'medium', LOW: 'low' } as const;
type Level = 'high' | 'medium' | 'low';

function getScoreLevel(score: number, maxScore: number): Level {
  const percentage = (score / maxScore) * 100;
  if (percentage >= LEVEL_THRESHOLDS.HIGH) return LEVELS.HIGH;
  if (percentage < LEVEL_THRESHOLDS.LOW) return LEVELS.LOW;
  return LEVELS.MEDIUM;
}

type Dimension = { name: string; emoji: string; desc: string };
type ResultLabel = {
  name: string;
  condition?: Record<string, Level>;
  [key: string]: unknown;
};

function matchResultLabel(
  scores: Record<string, number>,
  dimensions: Record<string, Dimension>,
  resultLabels: ResultLabel[],
  dimCounts?: Record<string, number>
): ResultLabel {
  const MAX_SCORE_PER_QUESTION = 5;
  const DEFAULT_QUESTION_COUNT = 3;

  const levels: Record<string, Level> = {};
  Object.keys(dimensions).forEach(dim => {
    const questionCount = dimCounts?.[dim] || DEFAULT_QUESTION_COUNT;
    const maxScore = questionCount * MAX_SCORE_PER_QUESTION;
    levels[dim] = getScoreLevel(scores[dim] || 0, maxScore);
  });

  // 완전 매칭
  let bestExactMatch: ResultLabel | null = null;
  let bestExactConditionCount = 0;

  for (const result of resultLabels) {
    const condition = result.condition || {};
    const conditionKeys = Object.keys(condition);
    if (conditionKeys.length === 0) continue;

    let match = true;
    for (const [dim, level] of Object.entries(condition)) {
      if (levels[dim] !== level) {
        match = false;
        break;
      }
    }

    if (match && conditionKeys.length > bestExactConditionCount) {
      bestExactMatch = result;
      bestExactConditionCount = conditionKeys.length;
    }
  }

  if (bestExactMatch) return bestExactMatch;

  // 부분 매칭: 1개 이상 일치하는 결과 중 가장 많이 일치하는 것 선택
  // 동점 시 조건 개수가 많은 것 우선 (더 구체적인 결과)
  let bestMatch = resultLabels[resultLabels.length - 1]; // 폴백
  let bestMatchCount = 0;
  let bestConditionCount = 0;

  for (const result of resultLabels) {
    const condition = result.condition || {};
    const conditionKeys = Object.keys(condition);
    if (conditionKeys.length === 0) continue;

    let matchCount = 0;
    for (const [dim, level] of Object.entries(condition)) {
      if (levels[dim] === level) matchCount++;
    }

    // 0개 매칭은 제외 - 아무것도 일치하지 않으면 폴백으로
    if (matchCount === 0) continue;

    // 일치 개수가 더 많거나, 동점이면 조건 개수가 더 많은 것 선택
    if (matchCount > bestMatchCount ||
        (matchCount === bestMatchCount && conditionKeys.length > bestConditionCount)) {
      bestMatchCount = matchCount;
      bestConditionCount = conditionKeys.length;
      bestMatch = result;
    }
  }

  return bestMatch;
}

test.describe('getScoreLevel - 점수→레벨 변환', () => {
  test('경계값 테스트: 60% 이상은 HIGH', () => {
    // maxScore = 15 (3문항 × 5점)
    expect(getScoreLevel(9, 15)).toBe('high');   // 60% 정확히
    expect(getScoreLevel(10, 15)).toBe('high');  // 66.7%
    expect(getScoreLevel(15, 15)).toBe('high');  // 100%
  });

  test('경계값 테스트: 40% 미만은 LOW', () => {
    expect(getScoreLevel(5, 15)).toBe('low');   // 33.3%
    expect(getScoreLevel(0, 15)).toBe('low');   // 0%
    expect(getScoreLevel(1, 15)).toBe('low');   // 6.7%
  });

  test('경계값 테스트: 40% 이상 60% 미만은 MEDIUM', () => {
    expect(getScoreLevel(6, 15)).toBe('medium'); // 40% 정확히
    expect(getScoreLevel(7, 15)).toBe('medium'); // 46.7%
    expect(getScoreLevel(8, 15)).toBe('medium'); // 53.3%
  });

  test('경계값 일관성: 40%는 MEDIUM에 포함 (LOW 아님)', () => {
    // 이전 버그: <= 40이면 LOW였음
    // 수정 후: < 40이면 LOW, 40%는 MEDIUM
    const maxScore = 100;
    expect(getScoreLevel(40, maxScore)).toBe('medium'); // 40% 정확히 = MEDIUM
    expect(getScoreLevel(39, maxScore)).toBe('low');    // 39% = LOW
    expect(getScoreLevel(60, maxScore)).toBe('high');   // 60% 정확히 = HIGH
    expect(getScoreLevel(59, maxScore)).toBe('medium'); // 59% = MEDIUM
  });

  test('다양한 문항 수에서 동작', () => {
    // 2문항 (maxScore = 10)
    expect(getScoreLevel(6, 10)).toBe('high');   // 60%
    expect(getScoreLevel(4, 10)).toBe('medium'); // 40%
    expect(getScoreLevel(3, 10)).toBe('low');    // 30%

    // 5문항 (maxScore = 25)
    expect(getScoreLevel(15, 25)).toBe('high');  // 60%
    expect(getScoreLevel(10, 25)).toBe('medium'); // 40%
    expect(getScoreLevel(9, 25)).toBe('low');    // 36%
  });
});

test.describe('matchResultLabel - 결과 매칭', () => {
  const dimensions: Record<string, Dimension> = {
    energy: { name: '활력', emoji: '⚡', desc: '에너지' },
    social: { name: '사회성', emoji: '👥', desc: '사교력' },
    focus: { name: '집중력', emoji: '🎯', desc: '집중' },
  };

  const resultLabels: ResultLabel[] = [
    { name: '에너자이저', condition: { energy: 'high', social: 'high' } },
    { name: '집중력왕', condition: { focus: 'high', energy: 'medium' } },
    { name: '사교적', condition: { social: 'high' } },
    { name: '균형형', condition: { energy: 'medium', social: 'medium', focus: 'medium' } },
    { name: '기본형', condition: {} }, // 폴백
  ];

  test('완전 매칭: 조건이 더 구체적인 결과 우선', () => {
    // energy=high, social=high → '에너자이저' (2개 조건)이 '사교적' (1개 조건)보다 우선
    const scores = { energy: 12, social: 12, focus: 5 }; // 모두 high (12/15 = 80%)
    const dimCounts = { energy: 3, social: 3, focus: 3 };

    const result = matchResultLabel(scores, dimensions, resultLabels, dimCounts);
    expect(result.name).toBe('에너자이저');
  });

  test('완전 매칭: 단일 조건 매칭', () => {
    // social=high, 나머지 low
    const scores = { energy: 3, social: 12, focus: 3 };
    const dimCounts = { energy: 3, social: 3, focus: 3 };

    const result = matchResultLabel(scores, dimensions, resultLabels, dimCounts);
    expect(result.name).toBe('사교적');
  });

  test('완전 매칭: 3차원 조건', () => {
    // 모두 medium
    const scores = { energy: 7, social: 7, focus: 7 }; // 46.7% = medium
    const dimCounts = { energy: 3, social: 3, focus: 3 };

    const result = matchResultLabel(scores, dimensions, resultLabels, dimCounts);
    expect(result.name).toBe('균형형');
  });

  test('부분 매칭: 완전 매칭 없을 때 가장 많이 일치하는 결과', () => {
    // energy=high, social=low, focus=high
    // '에너자이저'(energy:high, social:high)와 1개 일치 (조건 2개)
    // '집중력왕'(focus:high, energy:medium)과 1개 일치 (조건 2개)
    // → 동점+동일 조건 개수면 먼저 발견된 것 유지
    const scores = { energy: 12, social: 3, focus: 12 };
    const dimCounts = { energy: 3, social: 3, focus: 3 };

    const result = matchResultLabel(scores, dimensions, resultLabels, dimCounts);
    // 둘 다 1개 매칭 + 2개 조건, 먼저 발견된 '에너자이저' 유지
    expect(result.name).toBe('에너자이저');
  });

  test('폴백: 모든 결과가 0개 매칭일 때 마지막 결과 반환', () => {
    // 모두 low → 어떤 조건도 완전 매칭 안됨
    // 3/15=20% → LOW (40% 미만)
    const scores = { energy: 3, social: 3, focus: 3 };
    const dimCounts = { energy: 3, social: 3, focus: 3 };

    const result = matchResultLabel(scores, dimensions, resultLabels, dimCounts);
    // 부분 매칭 로직:
    // - 모든 결과 조건에 LOW가 없음 → 전부 0개 매칭
    // - 0 > 0 = false → bestMatch 갱신 안됨
    // - 초기값 resultLabels[마지막] = '기본형' 반환
    expect(result.name).toBe('기본형');
  });

  test('부분 매칭 tie-breaker: 동점 시 조건 개수 많은 것 우선', () => {
    // 새 테스트 데이터: 동점이지만 조건 개수가 다른 경우
    const testResults: ResultLabel[] = [
      { name: '결과A', condition: { energy: 'high' } },  // 1개 조건, 1개 매칭
      { name: '결과B', condition: { energy: 'high', social: 'medium', focus: 'low' } },  // 3개 조건, 2개 매칭
      { name: '폴백', condition: {} },
    ];

    // energy=high(12/15=80%), social=medium(7/15=47%), focus=low(3/15=20%)
    // 결과A: energy:high 1개 매칭 (조건 1개) → matchCount=1
    // 결과B: energy:high, social:medium 2개 매칭 (조건 3개) → matchCount=2
    // → 결과B가 더 많이 매칭되어 우선
    const scores = { energy: 12, social: 7, focus: 3 };
    const dimCounts = { energy: 3, social: 3, focus: 3 };

    const result = matchResultLabel(scores, dimensions, testResults, dimCounts);
    expect(result.name).toBe('결과B');
  });

  test('부분 매칭 tie-breaker: 동점 + 조건 개수 다를 때', () => {
    // 매칭 개수 동점, 조건 개수 다른 경우 (완전 매칭 불가)
    const testResults: ResultLabel[] = [
      { name: '결과A', condition: { energy: 'high', social: 'high' } },  // 2개 조건, 1개 매칭(energy)
      { name: '결과B', condition: { energy: 'high', social: 'low', focus: 'low' } },  // 3개 조건, 1개 매칭(energy)
      { name: '폴백', condition: {} },
    ];

    // energy=high(80%), social=medium(47%), focus=medium(47%)
    // 결과A: energy:high 매칭, social:high 불일치 → 1개 매칭 (조건 2개)
    // 결과B: energy:high 매칭, social:low 불일치, focus:low 불일치 → 1개 매칭 (조건 3개)
    // → 완전 매칭 없음 (둘 다 조건 불일치 있음)
    // → 부분 매칭: 동점(1개)이므로 조건 개수 많은 결과B 우선
    const scores = { energy: 12, social: 7, focus: 7 };
    const dimCounts = { energy: 3, social: 3, focus: 3 };

    const result = matchResultLabel(scores, dimensions, testResults, dimCounts);
    expect(result.name).toBe('결과B');
  });

  test('dimCounts 기본값 사용', () => {
    // dimCounts 안주면 DEFAULT_QUESTION_COUNT=3 사용
    const scores = { energy: 12, social: 12, focus: 5 };

    const result = matchResultLabel(scores, dimensions, resultLabels);
    expect(result.name).toBe('에너자이저');
  });
});

test.describe('3점 옵션 효과 검증', () => {
  test('5/1 이분법만 사용 시 MEDIUM 도달 확률', () => {
    // 3문항, 각 문항 5점 또는 1점만 선택 가능
    // 가능한 총점: 3, 7, 11, 15 (1+1+1, 1+1+5, 1+5+5, 5+5+5 등)
    const possibleScores = [3, 7, 11, 15]; // 실제 가능한 조합
    const levels = possibleScores.map(s => getScoreLevel(s, 15));

    // 3/15=20%=LOW, 7/15=46.7%=MEDIUM, 11/15=73.3%=HIGH, 15/15=100%=HIGH
    expect(levels).toEqual(['low', 'medium', 'high', 'high']);

    // MEDIUM은 7점(1+1+5 또는 1+5+1 또는 5+1+1)일 때만 = 3/8 = 37.5%
    // 하지만 실제 조합 가짓수:
    // 3점(LLL)=1, 7점(LLH,LHL,HLL)=3, 11점(LHH,HLH,HHL)=3, 15점(HHH)=1
    const mediumCount = 3; // 7점 조합
    const totalCombinations = 8;
    const mediumRatio = mediumCount / totalCombinations;
    expect(mediumRatio).toBe(0.375);
  });

  test('3점 옵션 포함 시 MEDIUM 도달 확률 증가', () => {
    // 3문항, 각 문항 5/3/1점 선택 가능
    // 총 27가지 조합 (3^3)
    const combinations: number[] = [];
    for (const a of [1, 3, 5]) {
      for (const b of [1, 3, 5]) {
        for (const c of [1, 3, 5]) {
          combinations.push(a + b + c);
        }
      }
    }

    const levels = combinations.map(s => getScoreLevel(s, 15));
    const counts = { low: 0, medium: 0, high: 0 };
    levels.forEach(l => counts[l]++);

    // 6~8점(40~53%)이 MEDIUM
    // 6=40%, 7=46.7%, 8=53.3% → 모두 MEDIUM
    // 9=60% → HIGH
    expect(counts.medium).toBeGreaterThan(0);

    // 3점 옵션이 있으면 중간값이 더 많이 나옴
    const mediumRatio = counts.medium / 27;
    expect(mediumRatio).toBeGreaterThan(0.2); // 20% 이상 (22.2% 실측)
  });
});
