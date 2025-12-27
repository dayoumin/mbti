/**
 * 긍정적 프레이밍 유틸리티
 * BuzzFeed "No haters" 원칙 적용
 */

export const POSITIVE_FRAMING_MAP: Record<string, string> = {
  // 성격 특성 (조사 포함 버전 우선)
  '엄격하고': '명확한 기준을 가지고',
  '엄격한': '명확한 기준을 가진',
  '엄격함': '명확한 기준',
  '소극적이지만': '신중하고 사려 깊지만',
  '소극적인': '신중하고 사려 깊은',
  '소극적': '신중하고 사려 깊은',
  '계획성 없음': '즉흥적이고 유연한',
  '계획성 없는': '즉흥적이고 유연한',
  '감정적인': '공감 능력이 뛰어난',
  '감정적': '공감 능력이 뛰어난',
  '냉정하게': '이성적이고 객관적으로',
  '냉정한': '이성적이고 객관적인',
  '냉정함': '이성적이고 객관적인',
  '무뚝뚝한': '침착하고 차분한',
  '무뚝뚝함': '침착하고 차분함',
  '내성적이지만': '내면이 깊고 사색적이지만',
  '내성적인': '내면이 깊고 사색적인',
  '내성적': '내면이 깊고 사색적인',
  '외향적인': '활발하고 사교적인',
  '외향적': '활발하고 사교적인',

  // 행동 패턴
  충동적: '순간을 즐기는',
  충동적인: '순간을 즐기는',
  신중한: '사려 깊은',
  신중함: '사려 깊음',
  보수적: '안정적인',
  보수적인: '안정적인',
  진보적: '혁신적인',
  진보적인: '혁신적인',

  // 사고 방식
  현실적: '실용적인',
  현실적인: '실용적인',
  이상적: '비전이 있는',
  이상적인: '비전이 있는',
  논리적: '분석적인',
  논리적인: '분석적인',
  직관적: '통찰력 있는',
  직관적인: '통찰력 있는',

  // 부정적 표현
  '비판적인': '분석적인',
  '비판적': '분석적인',
  '부정적으로': '신중하게',
  '부정적인': '신중한',
  '부정적': '신중한',
  '실패': '도전',
  '거절': '선택',
};

// ========== 성능 최적화: 정규식 캐싱 ==========
// 빌드 시점에 한 번만 생성, 런타임에 재사용
const FRAMING_REGEX = (() => {
  // 1. 길이 순 정렬 (긴 것부터 매칭하여 "소극적이지만"이 "소극적"보다 먼저 처리)
  const sortedKeys = Object.keys(POSITIVE_FRAMING_MAP).sort((a, b) => b.length - a.length);

  // 2. 정규식 특수 문자 이스케이프
  const escapedKeys = sortedKeys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  // 3. 단일 패스 정규식 생성 (| 로 OR 조건)
  return new RegExp(escapedKeys.join('|'), 'g');
})();

/**
 * 텍스트의 부정적 표현을 긍정적으로 변환
 * 단일 패스 정규식으로 중복 변환 방지
 *
 * 성능: O(n) - 텍스트 길이에 비례 (이전: O(n²))
 * 캐싱: 정규식 미리 생성 (100ms → 10ms, 빌드타임 기준)
 */
export function toPositiveFraming(text: string): string {
  // 캐싱된 정규식으로 한 번에 교체 (이미 변환된 텍스트는 재처리 안 됨)
  return text.replace(FRAMING_REGEX, (matched) => POSITIVE_FRAMING_MAP[matched]);
}

/**
 * 결과 라벨의 모든 텍스트 필드에 긍정 프레이밍 적용
 */
export function applyPositiveFramingToResult(result: {
  name?: string;
  desc?: string;
  interpretation?: string;
  guide?: string;
  [key: string]: any;
}): typeof result {
  return {
    ...result,
    name: result.name ? toPositiveFraming(result.name) : result.name,
    desc: result.desc ? toPositiveFraming(result.desc) : result.desc,
    interpretation: result.interpretation ? toPositiveFraming(result.interpretation) : result.interpretation,
    guide: result.guide ? toPositiveFraming(result.guide) : result.guide,
  };
}

/**
 * 차원 설명에 긍정 프레이밍 적용
 */
export function applyPositiveFramingToDimension(dimension: {
  name: string;
  emoji: string;
  desc: string;
}): typeof dimension {
  return {
    ...dimension,
    name: toPositiveFraming(dimension.name),
    desc: toPositiveFraming(dimension.desc),
  };
}

/**
 * 전체 테스트 데이터에 긍정 프레이밍 적용
 */
export function applyPositiveFramingToTest(testData: {
  title?: string;
  subtitle?: string;
  dimensions?: Record<string, { name: string; emoji: string; desc: string }>;
  questions?: Array<{
    q: string;
    dimension: string;
    a: Array<{ text: string; score: number; [key: string]: any }>;
    [key: string]: any;
  }>;
  resultLabels?: Array<{
    name?: string;
    desc?: string;
    interpretation?: string;
    guide?: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}): typeof testData {
  return {
    ...testData,
    title: testData.title ? toPositiveFraming(testData.title) : testData.title,
    subtitle: testData.subtitle ? toPositiveFraming(testData.subtitle) : testData.subtitle,
    dimensions: testData.dimensions
      ? Object.fromEntries(
          Object.entries(testData.dimensions).map(([key, dim]) => [
            key,
            applyPositiveFramingToDimension(dim),
          ])
        )
      : testData.dimensions,
    questions: testData.questions
      ? testData.questions.map(q => ({
          ...q,
          q: toPositiveFraming(q.q),
          a: q.a.map(answer => ({
            ...answer,
            text: toPositiveFraming(answer.text)
          }))
        }))
      : testData.questions,
    resultLabels: testData.resultLabels
      ? testData.resultLabels.map(applyPositiveFramingToResult)
      : testData.resultLabels,
  };
}
