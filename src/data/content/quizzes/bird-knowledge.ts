// ============================================================================
// 반려조(앵무새) 지식 퀴즈
// ============================================================================

import type { KnowledgeQuiz } from '../types';

export const BIRD_KNOWLEDGE_QUIZZES: KnowledgeQuiz[] = [
  {
    id: 'bird-k-001',
    category: 'bird',
    question: '왕관앵무(코카틸)의 평균 수명은?',
    options: [
      { id: 'a', text: '5-8년', isCorrect: false },
      { id: 'b', text: '15-20년', isCorrect: true },
      { id: 'c', text: '30-40년', isCorrect: false },
      { id: 'd', text: '50년 이상', isCorrect: false },
    ],
    explanation: '왕관앵무는 평균 15-20년 살아요. 초보자에게 적합하고 온순한 성격을 가진 중형 앵무예요!',
    difficulty: 1,
    tags: ['앵무새', '왕관앵무', '수명', '품종'],
    source: 'bird-fact-001',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-002',
    category: 'bird',
    question: '버드기(모란앵무) 중 말을 더 잘하는 성별은?',
    options: [
      { id: 'a', text: '암컷', isCorrect: false },
      { id: 'b', text: '수컷', isCorrect: true },
      { id: 'c', text: '둘 다 동일', isCorrect: false },
      { id: 'd', text: '개체 차이만 있음', isCorrect: false },
    ],
    explanation: '버드기는 앵무새 중 최고의 언어 능력을 가졌어요. 수컷이 특히 뛰어나서 1,700단어 이상 학습한 기록도 있어요!',
    difficulty: 2,
    tags: ['앵무새', '버드기', '언어능력', '성별'],
    source: 'bird-fact-002',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-003',
    category: 'bird',
    question: '앵무새를 처음 입양한 날, 적응을 위해 며칠간 해줘야 하는 것은?',
    options: [
      { id: 'a', text: '손으로 많이 만져서 친밀감 형성', isCorrect: false },
      { id: 'b', text: '새장을 천으로 덮어 조용한 환경 제공', isCorrect: true },
      { id: 'c', text: '다른 앵무새와 함께 두기', isCorrect: false },
      { id: 'd', text: '먹이를 평소보다 많이 주기', isCorrect: false },
    ],
    explanation: '입양 후 3-5일은 새장을 천으로 덮어 어둡고 조용한 환경을 만들어주세요. 성급한 핸들링은 경계심만 키워요!',
    difficulty: 2,
    tags: ['앵무새', '입양', '적응', '스트레스', '관리'],
    source: 'bird-fact-003',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-004',
    category: 'bird',
    question: '앵무새 새장으로 적합한 모양은?',
    options: [
      { id: 'a', text: '원형 새장', isCorrect: false },
      { id: 'b', text: '직사각형 새장', isCorrect: true },
      { id: 'c', text: '육각형 새장', isCorrect: false },
      { id: 'd', text: '모양은 상관없음', isCorrect: false },
    ],
    explanation: '앵무새는 두려울 때 모서리(피난처)를 찾는 습성이 있어요. 원형 새장은 피난처가 없어서 스트레스를 받아요!',
    difficulty: 1,
    tags: ['앵무새', '새장', '환경', '스트레스'],
    source: 'bird-fact-004',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-005',
    category: 'bird',
    question: '앵무새에게 절대 주면 안 되는 음식은?',
    options: [
      { id: 'a', text: '사과 (씨 제거)', isCorrect: false },
      { id: 'b', text: '아보카도', isCorrect: true },
      { id: 'c', text: '당근', isCorrect: false },
      { id: 'd', text: '시금치', isCorrect: false },
    ],
    explanation: '아보카도, 감자, 파슬리는 앵무새에게 유독해요. 초콜릿, 카페인, 알코올, 과일 씨앗도 절대 금지예요!',
    difficulty: 1,
    tags: ['앵무새', '음식', '위험', '독성', '건강'],
    source: 'bird-fact-005',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-006',
    category: 'bird',
    question: '앵무새의 적정 실내 온도는?',
    options: [
      { id: 'a', text: '15-20°C', isCorrect: false },
      { id: 'b', text: '26-30°C', isCorrect: true },
      { id: 'c', text: '32-35°C', isCorrect: false },
      { id: 'd', text: '온도 상관없음', isCorrect: false },
    ],
    explanation: '적정 온도는 26-30°C, 습도 60%예요. 버드기와 왕관앵무는 13°C 이하로 내려가지 않게 주의하세요!',
    difficulty: 2,
    tags: ['앵무새', '온도', '환경', '건강', '관리'],
    source: 'bird-fact-006',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-007',
    category: 'bird',
    question: '버드기의 이상적인 식단 비율은? (펠렛 기준)',
    options: [
      { id: 'a', text: '펠렛 30%, 과일/채소 60%', isCorrect: false },
      { id: 'b', text: '펠렛 60-70%, 과일/채소 30%', isCorrect: true },
      { id: 'c', text: '펠렛 50%, 씨앗 50%', isCorrect: false },
      { id: 'd', text: '펠렛 90%, 간식 10%', isCorrect: false },
    ],
    explanation: '고품질 펠렛 60-70%, 과일/채소 30%, 간식은 10%로 제한하세요. 씨앗은 지방이 많아 비만 위험이 있어요!',
    difficulty: 2,
    tags: ['앵무새', '버드기', '식단', '영양', '관리'],
    source: 'bird-fact-007',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-008',
    category: 'bird',
    question: '왕관앵무가 밤에 갑자기 새장에서 난동을 부리는 이유는?',
    options: [
      { id: 'a', text: '배가 고파서', isCorrect: false },
      { id: 'b', text: '야간 공포 에피소드 (포식자 경계 본능)', isCorrect: true },
      { id: 'c', text: '운동 부족', isCorrect: false },
      { id: 'd', text: '질병 증상', isCorrect: false },
    ],
    explanation: '야생에서 포식자를 경계하던 본능이에요. 가벼운 잠을 자다가 갑자기 놀라서 난동을 부려요. 야간등을 켜두면 도움이 돼요!',
    difficulty: 2,
    tags: ['앵무새', '왕관앵무', '야간공포', '행동', '본능'],
    source: 'bird-fact-008',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-009',
    category: 'bird',
    question: '앵무새가 머리를 까딱이는 행동(헤드뱅잉)의 의미로 틀린 것은?',
    options: [
      { id: 'a', text: '구애 신호', isCorrect: false },
      { id: 'b', text: '관심 원함', isCorrect: false },
      { id: 'c', text: '화가 나서 경고', isCorrect: true },
      { id: 'd', text: '먹이 요청 (새끼)', isCorrect: false },
    ],
    explanation: '머리 까딱임은 구애, 관심 요구, 흥분, 먹이 요청 등 긍정적 신호예요. 화날 땐 깃털을 세우고 소리를 내요!',
    difficulty: 2,
    tags: ['앵무새', '헤드뱅잉', '행동', '소통'],
    source: 'bird-fact-009',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-010',
    category: 'bird',
    question: '앵무새가 깃털을 부풀릴 때의 기분은?',
    options: [
      { id: 'a', text: '화가 났다', isCorrect: false },
      { id: 'b', text: '편안하고 기분 좋다', isCorrect: true },
      { id: 'c', text: '아프다', isCorrect: false },
      { id: 'd', text: '겁이 난다', isCorrect: false },
    ],
    explanation: '깃털을 부풀리는 건 편안함의 신호예요. 털 정리하거나 목욕하고 싶을 때, 노곤노곤할 때 이런 행동을 해요!',
    difficulty: 1,
    tags: ['앵무새', '깃털', '행동', '감정표현'],
    source: 'bird-fact-010',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-011',
    category: 'bird',
    question: '왕관앵무 한 마리를 위한 최소 새장 크기는?',
    options: [
      { id: 'a', text: '30cm x 30cm x 40cm', isCorrect: false },
      { id: 'b', text: '60cm x 60cm x 90cm', isCorrect: true },
      { id: 'c', text: '100cm x 100cm x 120cm', isCorrect: false },
      { id: 'd', text: '작아도 자주 풀어주면 됨', isCorrect: false },
    ],
    explanation: '최소 크기는 60cm x 60cm x 90cm예요. 하지만 가능한 한 큰 새장이 좋아요. 날개를 펼칠 공간이 필요해요!',
    difficulty: 2,
    tags: ['앵무새', '왕관앵무', '새장', '환경', '크기'],
    source: 'bird-fact-011',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-012',
    category: 'bird',
    question: '암컷 왕관앵무의 건강 위험 중 주의해야 할 것은?',
    options: [
      { id: 'a', text: '탈모', isCorrect: false },
      { id: 'b', text: '만성 산란 (칼슘 고갈)', isCorrect: true },
      { id: 'c', text: '시력 저하', isCorrect: false },
      { id: 'd', text: '청력 감소', isCorrect: false },
    ],
    explanation: '암컷은 수컷 없이도 알을 낳을 수 있어요. 만성 산란은 칼슘과 미네랄을 고갈시켜 건강에 위험해요!',
    difficulty: 3,
    tags: ['앵무새', '왕관앵무', '산란', '건강', '암컷'],
    source: 'bird-fact-012',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-013',
    category: 'bird',
    question: '앵무새를 만질 때 적절한 부위는?',
    options: [
      { id: 'a', text: '머리와 목 주변만', isCorrect: true },
      { id: 'b', text: '등과 날개', isCorrect: false },
      { id: 'c', text: '배와 가슴', isCorrect: false },
      { id: 'd', text: '어디든 상관없음', isCorrect: false },
    ],
    explanation: '머리와 목 주변만 만지세요. 목 아래 부위를 만지면 호르몬이 자극돼 번식 행동과 스트레스를 유발해요!',
    difficulty: 2,
    tags: ['앵무새', '스킨십', '호르몬', '관리', '행동'],
    source: 'bird-fact-013',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-014',
    category: 'bird',
    question: '앵무새를 키우는 집에서 절대 사용하면 안 되는 것은?',
    options: [
      { id: 'a', text: '에어컨', isCorrect: false },
      { id: 'b', text: '논스틱(테프론) 조리기구', isCorrect: true },
      { id: 'c', text: 'LED 조명', isCorrect: false },
      { id: 'd', text: '가습기', isCorrect: false },
    ],
    explanation: '논스틱 조리기구를 가열하면 무색무취 독성 가스가 나와요. 조류에게 치명적이니 절대 사용하지 마세요!',
    difficulty: 3,
    tags: ['앵무새', '위험', '독성', '조리기구', '안전'],
    source: 'bird-fact-014',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-015',
    category: 'bird',
    question: '앵무새의 적응력에 대한 설명으로 맞는 것은?',
    options: [
      { id: 'a', text: '새로운 환경에 빨리 적응함', isCorrect: false },
      { id: 'b', text: '낯선 것에 경계심 많고 적응력 낮음', isCorrect: true },
      { id: 'c', text: '주인 외모 변화는 신경 안 써', isCorrect: false },
      { id: 'd', text: '밥그릇 바꿔도 잘 먹음', isCorrect: false },
    ],
    explanation: '앵무새는 피식자 위치라 낯선 것을 매우 경계해요. 주인이 머리 염색하거나 새 그림을 걸어도 스트레스를 받을 수 있어요!',
    difficulty: 2,
    tags: ['앵무새', '적응력', '경계심', '스트레스', '행동'],
    source: 'bird-fact-015',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-016',
    category: 'bird',
    question: '대형 앵무새(마카우, 회색앵무)의 평균 수명은?',
    options: [
      { id: 'a', text: '15-20년', isCorrect: false },
      { id: 'b', text: '25-35년', isCorrect: false },
      { id: 'c', text: '50년 이상', isCorrect: true },
      { id: 'd', text: '80년 이상', isCorrect: false },
    ],
    explanation: '대형 앵무새는 50년 이상 살아요! 소형 앵무는 15-20년인 반면, 몸집이 큰 대형종은 수명도 길답니다.',
    difficulty: 2,
    tags: ['앵무새', '수명', '대형앵무', '품종'],
    source: 'bird-fact-016',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-017',
    category: 'bird',
    question: '사랑앵무(버드기) 어린 새의 부리(코) 색깔이 분홍/보라색이면?',
    options: [
      { id: 'a', text: '암컷', isCorrect: false },
      { id: 'b', text: '수컷', isCorrect: true },
      { id: 'c', text: '성별 무관', isCorrect: false },
      { id: 'd', text: '건강 이상', isCorrect: false },
    ],
    explanation: '어릴 때 분홍/보라색이면 수컷, 갈색/흰색이면 암컷이에요. 성조가 되면 수컷은 짙은 파란색, 암컷은 흰색/갈색이 돼요!',
    difficulty: 2,
    tags: ['앵무새', '사랑앵무', '성별구분', '부리', '버드기'],
    source: 'bird-fact-017',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-018',
    category: 'bird',
    question: '모란앵무의 별명 "러브버드(Lovebird)"가 붙은 이유는?',
    options: [
      { id: 'a', text: '사람을 잘 따라서', isCorrect: false },
      { id: 'b', text: '짝과의 유대감이 강해서', isCorrect: true },
      { id: 'c', text: '하트 모양 깃털 때문에', isCorrect: false },
      { id: 'd', text: '말을 잘해서', isCorrect: false },
    ],
    explanation: '모란앵무는 짝과의 유대감이 매우 강해요. 하지만 부리힘이 세고 성격이 있어서 물면 상당히 아파요!',
    difficulty: 1,
    tags: ['앵무새', '모란앵무', '러브버드', '유대감', '품종'],
    source: 'bird-fact-018',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-019',
    category: 'bird',
    question: '앵무새가 아보카도를 먹으면 나타나는 증상은?',
    options: [
      { id: 'a', text: '설사', isCorrect: false },
      { id: 'b', text: '심박수 증가 및 호흡 곤란', isCorrect: true },
      { id: 'c', text: '깃털 손상', isCorrect: false },
      { id: 'd', text: '소화불량', isCorrect: false },
    ],
    explanation: '아보카도의 퍼신(persin) 독성물질이 심장 근육을 손상시켜 심박수가 증가하고 호흡이 곤란해져요. 폐사 위험도 있어요!',
    difficulty: 3,
    tags: ['앵무새', '아보카도', '독성', '퍼신', '위험', '건강'],
    source: 'bird-fact-019',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-020',
    category: 'bird',
    question: '앵무새가 사람 말을 따라할 수 있는 이유는?',
    options: [
      { id: 'a', text: '성대가 발달해서', isCorrect: false },
      { id: 'b', text: '울대(시링스)와 뇌의 노래 핵 덕분', isCorrect: true },
      { id: 'c', text: '귀가 예민해서', isCorrect: false },
      { id: 'd', text: '폐활량이 커서', isCorrect: false },
    ],
    explanation: '울대(시링스)와 두꺼운 혀로 발성하고, 뇌의 "노래 핵" 유전자로 소리를 기억하고 재현해요. 구강 구조가 사람과 유사해요!',
    difficulty: 3,
    tags: ['앵무새', '말하기', '시링스', '노래핵', '발성원리'],
    source: 'bird-fact-020',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-021',
    category: 'bird',
    question: '일반 앵무새(중소형)의 IQ는 몇 살 아이 수준일까요?',
    options: [
      { id: 'a', text: '1살', isCorrect: false },
      { id: 'b', text: '2-3살', isCorrect: true },
      { id: 'c', text: '5-6살', isCorrect: false },
      { id: 'd', text: '10살', isCorrect: false },
    ],
    explanation: '앵무새의 IQ는 약 30으로 2-3살 아이 수준이에요. 대형 앵무새는 5살 수준까지 가능해요!',
    difficulty: 2,
    tags: ['앵무새', '지능', 'IQ', '능력'],
    source: 'bird-fact-021',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-022',
    category: 'bird',
    question: '회색앵무(African Grey)가 습득한 최대 단어 수 기네스 기록은?',
    options: [
      { id: 'a', text: '200단어', isCorrect: false },
      { id: 'b', text: '500단어', isCorrect: false },
      { id: 'c', text: '800단어', isCorrect: true },
      { id: 'd', text: '1000단어', isCorrect: false },
    ],
    explanation: '회색앵무 "프루들"이 800단어를 습득해 기네스북에 올랐어요. 형태, 색깔, 숫자도 구분할 수 있는 가장 똑똑한 앵무예요!',
    difficulty: 2,
    tags: ['앵무새', '회색앵무', '언어능력', '기네스북', '지능'],
    source: 'bird-fact-022',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-023',
    category: 'bird',
    question: '왕관앵무의 볏이 머리에 납작하게 눌려있을 때 감정은?',
    options: [
      { id: 'a', text: '흥분하고 놀람', isCorrect: false },
      { id: 'b', text: '편안함', isCorrect: false },
      { id: 'c', text: '화가 나거나 방어 중', isCorrect: true },
      { id: 'd', text: '졸림', isCorrect: false },
    ],
    explanation: '볏이 납작하면 화났거나 방어하는 중이에요. 흥분하면 수직으로 서고, 편안하면 비스듬히 있어요!',
    difficulty: 2,
    tags: ['앵무새', '왕관앵무', '볏', '감정표현', '행동'],
    source: 'bird-fact-023',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'bird-k-024',
    category: 'bird',
    question: '미국 학술 자료 기준, 앵무새 한 마리가 평균적으로 바꾸는 주인 수는?',
    options: [
      { id: 'a', text: '1번', isCorrect: false },
      { id: 'b', text: '2번', isCorrect: false },
      { id: 'c', text: '4번', isCorrect: true },
      { id: 'd', text: '7번', isCorrect: false },
    ],
    explanation: '앵무새는 평균 4번 주인을 바꿔요. 긴 수명(50년+) 때문에 주인이 사망하거나 포기하는 경우가 많아요. 평생 책임질 준비가 필요해요!',
    difficulty: 1,
    tags: ['앵무새', '수명', '주인교체', '책임감', '통계'],
    source: 'bird-fact-024',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
];

export default BIRD_KNOWLEDGE_QUIZZES;
