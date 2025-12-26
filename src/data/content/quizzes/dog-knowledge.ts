// ============================================================================
// 강아지 지식 퀴즈
// ============================================================================

import type { KnowledgeQuiz } from '../types';

export const DOG_KNOWLEDGE_QUIZZES: KnowledgeQuiz[] = [
  {
    id: 'dog-k-001',
    category: 'dog',
    question: '강아지에게 절대 주면 안 되는 과일은?',
    options: [
      { id: 'a', text: '사과 (씨 제거)', isCorrect: false },
      { id: 'b', text: '포도/건포도', isCorrect: true },
      { id: 'c', text: '수박 (씨 제거)', isCorrect: false },
      { id: 'd', text: '바나나', isCorrect: false },
    ],
    explanation: '포도와 건포도는 강아지에게 급성 신부전을 일으킬 수 있어요. 소량도 매우 위험해요!',
    difficulty: 1,
    tags: ['강아지', '음식', '위험', '포도', '건강'],
    source: 'dog-fact-002',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'dog-k-002',
    category: 'dog',
    question: '강아지가 꼬리를 흔드는 것은 항상 기본적인 표현일까요?',
    options: [
      { id: 'a', text: '네, 항상 기본해요', isCorrect: false },
      { id: 'b', text: '아니요, 긴장이나 불안일 수도 있어요', isCorrect: true },
      { id: 'c', text: '배가 고플 때만 흔들어요', isCorrect: false },
      { id: 'd', text: '아무 의미 없어요', isCorrect: false },
    ],
    explanation: '꼬리 흔들기는 감정의 "각성"을 나타내요. 높이, 속도, 방향에 따라 기본, 불안, 경계 등 다양한 의미가 있어요.',
    difficulty: 2,
    tags: ['강아지', '꼬리', '행동', '감정표현', '소통'],
    source: 'general-knowledge',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'dog-k-003',
    category: 'dog',
    question: '성견 기준 하루 산책 권장 시간은?',
    options: [
      { id: 'a', text: '10-15분', isCorrect: false },
      { id: 'b', text: '30분-2시간 (견종에 따라 다름)', isCorrect: true },
      { id: 'c', text: '딱 5분', isCorrect: false },
      { id: 'd', text: '산책 안 해도 괜찮아요', isCorrect: false },
    ],
    explanation: '소형견 30분-1시간, 대형견/활동적인 견종은 1-2시간 이상 권장해요. 견종별 특성을 고려하세요!',
    difficulty: 1,
    tags: ['강아지', '산책', '운동', '건강', '관리'],
    source: 'dog-fact-005',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'dog-k-004',
    category: 'dog',
    question: '강아지가 하품하는 이유로 틀린 것은?',
    options: [
      { id: 'a', text: '졸릴 때', isCorrect: false },
      { id: 'b', text: '스트레스/긴장 해소', isCorrect: false },
      { id: 'c', text: '다른 개의 하품을 따라서', isCorrect: false },
      { id: 'd', text: '배가 고플 때', isCorrect: true },
    ],
    explanation: '강아지 하품은 졸릴 때, 스트레스 해소, 전염성 하품(공감 능력) 때문이에요. 배고픔과는 관련 없어요!',
    difficulty: 2,
    tags: ['강아지', '하품', '행동', '스트레스', '감정표현'],
    source: 'general-knowledge',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'dog-k-005',
    category: 'dog',
    question: '강아지 예방접종 "종합백신(DHPPL)"에서 P가 의미하는 것은?',
    options: [
      { id: 'a', text: '파보바이러스', isCorrect: true },
      { id: 'b', text: '광견병', isCorrect: false },
      { id: 'c', text: '폐렴', isCorrect: false },
      { id: 'd', text: '기생충', isCorrect: false },
    ],
    explanation: 'DHPPL = 홍역(D), 간염(H), 파보(P), 파라인플루엔자(P), 렙토스피라(L)이에요.',
    difficulty: 3,
    tags: ['강아지', '예방접종', '백신', '건강', '의료'],
    source: 'dog-fact-003',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'dog-k-006',
    category: 'dog',
    question: '강아지가 코를 핥는 이유는?',
    options: [
      { id: 'a', text: '코가 건조해서', isCorrect: false },
      { id: 'b', text: '후각 능력 향상을 위해', isCorrect: true },
      { id: 'c', text: '배가 고파서', isCorrect: false },
      { id: 'd', text: '습관이 좋아요', isCorrect: false },
    ],
    explanation: '촉촉한 코는 공기 중 냄새 분자를 더 잘 포집해요. 강아지가 코를 핥는 건 "냄새를 더 잘 맡기 위해"이에요!',
    difficulty: 2,
    tags: ['강아지', '코', '후각', '신체', '본능'],
    source: 'general-knowledge',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'dog-k-007',
    category: 'dog',
    question: '강아지가 빙글빙글 돌고 나서 눕는 이유는?',
    options: [
      { id: 'a', text: '어지러워서', isCorrect: false },
      { id: 'b', text: '야생 본능 (잠자리 정리)', isCorrect: true },
      { id: 'c', text: '특별한 이유 없어요', isCorrect: false },
      { id: 'd', text: '아파서', isCorrect: false },
    ],
    explanation: '야생에서 풀을 눌러 편안한 잠자리를 만들고, 위험 요소(뱀 등)를 확인하던 본능이 남아있어요!',
    difficulty: 1,
    tags: ['강아지', '수면', '본능', '행동', '습성'],
    source: 'general-knowledge',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'dog-k-008',
    category: 'dog',
    question: '강아지의 정상 호흡수(분당)는?',
    options: [
      { id: 'a', text: '5-10회', isCorrect: false },
      { id: 'b', text: '15-30회', isCorrect: true },
      { id: 'c', text: '40-60회', isCorrect: false },
      { id: 'd', text: '60회 이상', isCorrect: false },
    ],
    explanation: '휴식 시 분당 15-30회가 정상이에요. 40회 이상이면 스트레스, 더위, 또는 건강 문제일 수 있어요.',
    difficulty: 2,
    tags: ['강아지', '호흡', '건강', '의료', '체크'],
    source: 'dog-fact-001',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'dog-k-009',
    category: 'dog',
    question: '"칼로링 시그널" 중 강아지가 입술을 핥는 것은?',
    options: [
      { id: 'a', text: '맛있는 게 먹고 싶다', isCorrect: false },
      { id: 'b', text: '불안하거나 긴장됐다', isCorrect: true },
      { id: 'c', text: '놀고 싶다', isCorrect: false },
      { id: 'd', text: '공격 전조', isCorrect: false },
    ],
    explanation: '입술 핥기는 대표적인 "칼밍 시그널"로 불안, 긴장, 스트레스를 표현해요. 강아지의 불편함 신호이에요.',
    difficulty: 2,
    tags: ['강아지', '칼밍시그널', '불안', '감정표현', '소통'],
    source: 'general-knowledge',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'dog-k-010',
    category: 'dog',
    question: '강아지 치아 관리를 위해 양치질은 얼마나 자주?',
    options: [
      { id: 'a', text: '한 달에 1번', isCorrect: false },
      { id: 'b', text: '매일 또는 최소 주 3회', isCorrect: true },
      { id: 'c', text: '1년에 1번', isCorrect: false },
      { id: 'd', text: '양치질은 필요 없어요', isCorrect: false },
    ],
    explanation: '매일이 가장 좋지만, 최소 주 3회 양치질을 권장해요. 치석은 3일 만에 굳어버려요!',
    difficulty: 1,
    tags: ['강아지', '양치질', '치아', '건강', '관리'],
    source: 'dog-fact-004',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'dog-k-011',
    category: 'dog',
    question: '강아지가 눈을 마주치지 않고 고개를 돌리는 것은?',
    options: [
      { id: 'a', text: '무시하는 거예요', isCorrect: false },
      { id: 'b', text: '복종/갈등 회피 신호', isCorrect: true },
      { id: 'c', text: '화났다는 신호', isCorrect: false },
      { id: 'd', text: '놀고 싶다는 신호', isCorrect: false },
    ],
    explanation: '강아지 세계에서 직접적인 눈 맞춤은 도전 신호이에요. 고개를 돌리는 건 "싸우고 싶지 않아요"라는 평화 신호이에요.',
    difficulty: 2,
    tags: ['강아지', '눈맞춤', '복종', '소통', '행동'],
    source: 'general-knowledge',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'dog-k-012',
    category: 'dog',
    question: '강아지 발바닥 패드의 역할이 아닌 것은?',
    options: [
      { id: 'a', text: '충격 흡수', isCorrect: false },
      { id: 'b', text: '체온 조절 (땀 배출)', isCorrect: false },
      { id: 'c', text: '미끄럼 방지', isCorrect: false },
      { id: 'd', text: '냄새 맡기', isCorrect: true },
    ],
    explanation: '발바닥 패드는 쿠션 역할, 땀샘(체온 조절), 미끄럼 방지 기능을 해요. 냄새는 코로 맡아요!',
    difficulty: 2,
    tags: ['강아지', '발바닥', '신체', '체온조절', '구조'],
    source: 'general-knowledge',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },

  // ==========================================================================
  // 중성화 관련 (dog-k-013 ~ 017)
  // ==========================================================================
  {
    id: 'dog-k-013',
    category: 'dog',
    question: '소형견과 대형견의 중성화 적정 시기는?',
    options: [
      { id: 'a', text: '둘 다 생후 3개월', isCorrect: false },
      { id: 'b', text: '소형견 6-9개월, 대형견 12-18개월', isCorrect: true },
      { id: 'c', text: '둘 다 생후 6개월', isCorrect: false },
      { id: 'd', text: '소형견이 더 늦게', isCorrect: false },
    ],
    explanation: '소형견은 6-9개월, 대형견은 12-18개월이 적정이에요. 대형견은 뼈와 관절이 충분히 성장한 후 수술하는 게 관절 질환 예방에 도움이 돼요.',
    difficulty: 2,
    tags: ['강아지', '중성화', '수술', '시기', '건강'],
    source: 'dog-fact-006',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'dog-k-014',
    category: 'dog',
    question: '중성화 수술 전, 성견은 몇 시간 금식해야 할까요? (최신 가이드라인)',
    options: [
      { id: 'a', text: '금식 필요 없어요', isCorrect: false },
      { id: 'b', text: '4-6시간', isCorrect: true },
      { id: 'c', text: '12시간 이상', isCorrect: false },
      { id: 'd', text: '24시간', isCorrect: false },
    ],
    explanation: '최신 가이드라인(AAHA 2023)은 4-6시간 금식을 권장해요. 과거 12시간 금식은 저혈당 위험이 있어요. 물은 수술 직전까지 허용!',
    difficulty: 2,
    tags: ['강아지', '중성화', '금식', '수술준비', '마취'],
    source: 'dog-fact-007',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'dog-k-015',
    category: 'dog',
    question: '중성화 수술 후 회복 기간은?',
    options: [
      { id: 'a', text: '3-5일', isCorrect: false },
      { id: 'b', text: '10-14일', isCorrect: true },
      { id: 'c', text: '1개월', isCorrect: false },
      { id: 'd', text: '당일 회복', isCorrect: false },
    ],
    explanation: '10-14일이 기본 회복 기간이에요. 수컷은 암컷보다 빠르게 회복해요. 외부 상처는 10-14일, 내부 회복은 수주가 걸려요.',
    difficulty: 1,
    tags: ['강아지', '중성화', '회복', '수술', '관리'],
    source: 'dog-fact-008',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'dog-k-016',
    category: 'dog',
    question: '중성화 수술 후 넥카라(깔때기)는 며칠 착용해야 할까요?',
    options: [
      { id: 'a', text: '3일', isCorrect: false },
      { id: 'b', text: '7일', isCorrect: false },
      { id: 'c', text: '10-14일', isCorrect: true },
      { id: 'd', text: '한 달', isCorrect: false },
    ],
    explanation: '10-14일 착용이 권장돼요. 상처를 핥거나 긁으면 감염이나 회복 지연이 생길 수 있어요. 불편해도 꼭 착용하세요!',
    difficulty: 1,
    tags: ['강아지', '중성화', '넥카라', '수술', '관리'],
    source: 'dog-fact-009',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'dog-k-017',
    category: 'dog',
    question: '중성화 후 확실히 변하는 행동은?',
    options: [
      { id: 'a', text: '공격성이 항상 줄어든다', isCorrect: false },
      { id: 'b', text: '배회/마운팅/마킹이 줄어든다', isCorrect: true },
      { id: 'c', text: '성격이 완전히 온순해진다', isCorrect: false },
      { id: 'd', text: '활동량이 늘어난다', isCorrect: false },
    ],
    explanation: '배회, 마운팅, 마킹 같은 호르몬 관련 행동은 확실히 줄어들어요. 하지만 불안이나 공격성은 개체 차이가 있어요.',
    difficulty: 2,
    tags: ['강아지', '중성화', '행동변화', '마운팅', '마킹'],
    source: 'dog-fact-010',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
];

export default DOG_KNOWLEDGE_QUIZZES;
