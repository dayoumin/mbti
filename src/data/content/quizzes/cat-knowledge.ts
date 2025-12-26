// ============================================================================
// 고양이 지식 퀴즈
// ============================================================================

import type { KnowledgeQuiz } from '../types';

export const CAT_KNOWLEDGE_QUIZZES: KnowledgeQuiz[] = [
  {
    id: 'cat-k-001',
    category: 'cat',
    question: '고양이가 꼬리를 수직으로 세우고 다가올 때의 기분은?',
    options: [
      { id: 'a', text: '화가 났다', isCorrect: false },
      { id: 'b', text: '기분이 좋고 반갑다', isCorrect: true },
      { id: 'c', text: '무섭다', isCorrect: false },
      { id: 'd', text: '배가 고프다', isCorrect: false },
    ],
    explanation: '꼬리를 수직으로 세우는 것은 고양이가 기분이 좋고 반가움을 표현하는 대표적인 신호예요!',
    difficulty: 1,
    tags: ['고양이', '꼬리', '행동', '감정표현'],
    source: 'general-knowledge',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'cat-k-002',
    category: 'cat',
    question: '고양이에게 절대 주면 안 되는 음식은?',
    options: [
      { id: 'a', text: '삶은 닭가슴살', isCorrect: false },
      { id: 'b', text: '양파/파류', isCorrect: true },
      { id: 'c', text: '삶은 호박', isCorrect: false },
      { id: 'd', text: '수박 (씨 제거)', isCorrect: false },
    ],
    explanation: '양파, 대파, 쪽파 등 파류는 고양이의 적혈구를 파괴해 빈혈을 유발할 수 있어요. 소량도 위험해요!',
    difficulty: 1,
    tags: ['고양이', '음식', '위험', '건강', '독성'],
    source: 'general-knowledge',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'cat-k-003',
    category: 'cat',
    question: '고양이가 "골골송"(그르릉 소리)을 내는 이유로 틀린 것은?',
    options: [
      { id: 'a', text: '기분이 좋을 때', isCorrect: false },
      { id: 'b', text: '아플 때 자기 치유', isCorrect: false },
      { id: 'c', text: '화가 나서 경고할 때', isCorrect: true },
      { id: 'd', text: '엄마에게 젖 달라고 할 때', isCorrect: false },
    ],
    explanation: '골골송은 기분 좋을 때, 아플 때 자기 치유, 새끼가 엄마에게 신호 보낼 때 등에 내요. 화날 땐 "하악" 소리를 내죠!',
    difficulty: 2,
    tags: ['고양이', '골골송', '소리', '감정표현', '치유'],
    source: 'general-knowledge',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'cat-k-004',
    category: 'cat',
    question: '성묘 기준 하루 권장 물 섭취량은 체중 1kg당 약?',
    options: [
      { id: 'a', text: '10-20ml', isCorrect: false },
      { id: 'b', text: '40-60ml', isCorrect: true },
      { id: 'c', text: '100-150ml', isCorrect: false },
      { id: 'd', text: '200ml 이상', isCorrect: false },
    ],
    explanation: '체중 1kg당 약 40-60ml가 적정해요. 4kg 고양이면 하루 160-240ml 정도예요. 습식 사료 급여 시 물 섭취량이 줄어들 수 있어요.',
    difficulty: 2,
    tags: ['고양이', '물', '섭취량', '건강', '관리'],
    source: 'cat-fact-001',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'cat-k-005',
    category: 'cat',
    question: '고양이 화장실 개수의 황금 법칙은?',
    options: [
      { id: 'a', text: '고양이 수와 동일', isCorrect: false },
      { id: 'b', text: '고양이 수 + 1', isCorrect: true },
      { id: 'c', text: '고양이 수 x 2', isCorrect: false },
      { id: 'd', text: '집안 방 개수와 동일', isCorrect: false },
    ],
    explanation: '"N+1 법칙"이라고 해요. 고양이 수보다 1개 많은 화장실을 준비하면 스트레스가 줄어요!',
    difficulty: 1,
    tags: ['고양이', '화장실', '다묘가정', '스트레스', '관리'],
    source: 'cat-fact-006',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'cat-k-006',
    category: 'cat',
    question: '고양이가 천천히 눈을 깜빡이는 것은 무슨 의미일까요?',
    options: [
      { id: 'a', text: '졸리다', isCorrect: false },
      { id: 'b', text: '"사랑해" 표현', isCorrect: true },
      { id: 'c', text: '눈이 아프다', isCorrect: false },
      { id: 'd', text: '밥 달라는 신호', isCorrect: false },
    ],
    explanation: '슬로우 블링크(Slow Blink)는 고양이의 "사랑해" 표현이에요! 당신도 천천히 눈을 깜빡여 대답해주세요.',
    difficulty: 1,
    tags: ['고양이', '슬로우블링크', '눈', '애정표현', '소통'],
    source: 'general-knowledge',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'cat-k-007',
    category: 'cat',
    question: '고양이가 배를 보여주는 행동의 의미는?',
    options: [
      { id: 'a', text: '배를 만져달라는 신호', isCorrect: false },
      { id: 'b', text: '신뢰와 편안함의 표현', isCorrect: true },
      { id: 'c', text: '복통이 있다', isCorrect: false },
      { id: 'd', text: '더워서 열을 식히려고', isCorrect: false },
    ],
    explanation: '배는 고양이의 가장 취약한 부위예요. 배를 보여주는 건 신뢰의 표현이지, 만져달라는 건 아닐 수 있어요!',
    difficulty: 2,
    tags: ['고양이', '배', '행동', '신뢰', '감정표현'],
    source: 'general-knowledge',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'cat-k-008',
    category: 'cat',
    question: '고양이의 정상 체온 범위는?',
    options: [
      { id: 'a', text: '35.5-36.5°C', isCorrect: false },
      { id: 'b', text: '37.5-39.2°C', isCorrect: true },
      { id: 'c', text: '39.5-40.5°C', isCorrect: false },
      { id: 'd', text: '36.5-37.5°C', isCorrect: false },
    ],
    explanation: '고양이의 정상 체온은 37.5-39.2°C로 사람보다 높아요. 39.5°C 이상이면 발열을 의심해야 해요.',
    difficulty: 2,
    tags: ['고양이', '체온', '건강', '발열', '의료'],
    source: 'cat-fact-002',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'cat-k-009',
    category: 'cat',
    question: '캣닢(캣닙)에 반응하는 고양이의 비율은 약?',
    options: [
      { id: 'a', text: '약 30%', isCorrect: false },
      { id: 'b', text: '약 50-70%', isCorrect: true },
      { id: 'c', text: '약 90%', isCorrect: false },
      { id: 'd', text: '100% (모든 고양이)', isCorrect: false },
    ],
    explanation: '캣닢 반응은 유전적이에요. 약 50-70%의 고양이만 반응하고, 새끼 고양이는 반응하지 않아요.',
    difficulty: 2,
    tags: ['고양이', '캣닢', '유전', '반응', '장난감'],
    source: 'cat-fact-003',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'cat-k-010',
    category: 'cat',
    question: '고양이 예방접종 중 "3종"에 포함되지 않는 것은?',
    options: [
      { id: 'a', text: '범백혈구감소증', isCorrect: false },
      { id: 'b', text: '허피스바이러스', isCorrect: false },
      { id: 'c', text: '칼리시바이러스', isCorrect: false },
      { id: 'd', text: '광견병', isCorrect: true },
    ],
    explanation: '3종 백신은 범백(파보), 허피스(비기관염), 칼리시 3가지예요. 광견병은 별도 접종이에요.',
    difficulty: 3,
    tags: ['고양이', '예방접종', '백신', '건강', '의료'],
    source: 'cat-fact-005',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'cat-k-011',
    category: 'cat',
    question: '고양이가 머리를 비비는 행동(버팅)은?',
    options: [
      { id: 'a', text: '가려워서', isCorrect: false },
      { id: 'b', text: '영역 표시 + 애정 표현', isCorrect: true },
      { id: 'c', text: '놀아달라는 신호', isCorrect: false },
      { id: 'd', text: '스트레스 신호', isCorrect: false },
    ],
    explanation: '고양이 얼굴에는 페로몬 분비샘이 있어요. 머리를 비비면 "내 거야" 표시와 함께 친밀감을 표현하는 거예요!',
    difficulty: 1,
    tags: ['고양이', '버팅', '페로몬', '애정표현', '영역표시'],
    source: 'general-knowledge',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'cat-k-012',
    category: 'cat',
    question: '고양이 중성화 적정 시기는?',
    options: [
      { id: 'a', text: '생후 1-2개월', isCorrect: false },
      { id: 'b', text: '생후 4-6개월', isCorrect: true },
      { id: 'c', text: '생후 1년 이후', isCorrect: false },
      { id: 'd', text: '첫 발정 이후', isCorrect: false },
    ],
    explanation: '대부분의 수의사들은 생후 4-6개월을 권장해요. 첫 발정 전에 하면 유선종양 예방 효과가 높아요.',
    difficulty: 2,
    tags: ['고양이', '중성화', '수술', '건강', '의료'],
    source: 'cat-fact-004',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'cat-k-013',
    category: 'cat',
    question: '중성화 수술 전날, 성묘는 몇 시간 금식해야 할까요?',
    options: [
      { id: 'a', text: '12시간', isCorrect: false },
      { id: 'b', text: '4-6시간', isCorrect: true },
      { id: 'c', text: '24시간', isCorrect: false },
      { id: 'd', text: '금식 필요 없음', isCorrect: false },
    ],
    explanation: '최신 가이드라인(AAFP/AAHA)은 성묘 4-6시간 금식을 권장해요. 과거 12시간 금식은 저혈당 위험이 있어요. 물은 제한 없이 줘도 돼요!',
    difficulty: 2,
    tags: ['고양이', '중성화', '수술', '금식', '준비사항'],
    source: 'cat-fact-013',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'cat-k-014',
    category: 'cat',
    question: '중성화 수술 후 회복 기간, 수컷과 암컷 중 더 긴 쪽은?',
    options: [
      { id: 'a', text: '수컷 (2주)', isCorrect: false },
      { id: 'b', text: '암컷 (10-14일)', isCorrect: true },
      { id: 'c', text: '둘 다 동일 (1주)', isCorrect: false },
      { id: 'd', text: '품종에 따라 다름', isCorrect: false },
    ],
    explanation: '암컷은 복부 절개를 해야 해서 10-14일이 필요해요. 수컷은 비교적 간단해서 2-3일이면 일상생활이 가능해요.',
    difficulty: 2,
    tags: ['고양이', '중성화', '회복', '수술', '관리'],
    source: 'cat-fact-014',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'cat-k-015',
    category: 'cat',
    question: '중성화 수술 후 넥카라(깔때기)는 며칠 착용해야 할까요?',
    options: [
      { id: 'a', text: '3-5일', isCorrect: false },
      { id: 'b', text: '10-14일', isCorrect: true },
      { id: 'c', text: '1개월', isCorrect: false },
      { id: 'd', text: '실밥 뽑는 날까지만', isCorrect: false },
    ],
    explanation: '넥카라는 10-14일 착용해야 해요. 핥는 행동이 가장 흔한 수술 후 합병증 원인이에요. 불편해도 꼭 해줘야 해요!',
    difficulty: 2,
    tags: ['고양이', '중성화', '넥카라', '수술', '관리'],
    source: 'cat-fact-015',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'cat-k-016',
    category: 'cat',
    question: '중성화 후 확실히 변하는 것은?',
    options: [
      { id: 'a', text: '성격 (친화력)', isCorrect: false },
      { id: 'b', text: '스프레이/공격성', isCorrect: true },
      { id: 'c', text: '놀이 선호도', isCorrect: false },
      { id: 'd', text: '주인 인식', isCorrect: false },
    ],
    explanation: '스프레이는 거의 사라지고 공격성/영역 행동이 줄어요. 하지만 유전적 성격(활발함/소심함 등)은 안 변해요!',
    difficulty: 2,
    tags: ['고양이', '중성화', '행동변화', '성격'],
    source: 'cat-fact-016',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'cat-k-017',
    category: 'cat',
    question: '중성화 후 주의해야 할 건강 문제는?',
    options: [
      { id: 'a', text: '탈모', isCorrect: false },
      { id: 'b', text: '체중 증가 (비만)', isCorrect: true },
      { id: 'c', text: '시력 저하', isCorrect: false },
      { id: 'd', text: '청력 감소', isCorrect: false },
    ],
    explanation: '중성화 후 대사율이 감소하고 활동량이 약 30% 줄어요. 칼로리 조절과 놀이 시간이 중요해요!',
    difficulty: 2,
    tags: ['고양이', '중성화', '비만', '체중관리', '건강'],
    source: 'cat-fact-017',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
];

export default CAT_KNOWLEDGE_QUIZZES;
