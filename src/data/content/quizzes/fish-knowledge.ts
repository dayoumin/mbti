// ============================================================================
// 관상어 지식 퀴즈
// ============================================================================

import type { KnowledgeQuiz } from '../types';

export const FISH_KNOWLEDGE_QUIZZES: KnowledgeQuiz[] = [
  {
    id: 'fish-k-001',
    category: 'fish',
    question: '초보자에게 권장하는 최소 수조 크기는?',
    options: [
      { id: 'a', text: '30cm (1자)', isCorrect: false },
      { id: 'b', text: '60cm (2자 광폭)', isCorrect: true },
      { id: 'c', text: '90cm (3자)', isCorrect: false },
      { id: 'd', text: '크기는 상관없음', isCorrect: false },
    ],
    explanation: '물양이 많을수록 수질이 안정되어 관리가 쉬워요. 작은 수조는 급격한 수질 변화로 위험할 수 있어요!',
    difficulty: 1,
    tags: ['관상어', '수조', '초보자', '크기', '수질'],
    source: 'fish-fact-001',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-002',
    category: 'fish',
    question: '벤타가 작은 수조에서 도 생존 가능한 이유는?',
    options: [
      { id: 'a', text: '산소가 적게 필요해서', isCorrect: false },
      { id: 'b', text: '라비린스 기관으로 공기호흡이 가능해요', isCorrect: true },
      { id: 'c', text: '물을 정화하는 능력', isCorrect: false },
      { id: 'd', text: '활동량이 적어서', isCorrect: false },
    ],
    explanation: '벤타는 라비린스(미로) 기관으로 수면에서 공기호흡이 가능해요. 그래서 여과기 없이도 견딜 수 있죠!',
    difficulty: 2,
    tags: ['관상어', '벤타', '라비린스', '호흡', '특징'],
    source: 'fish-fact-002',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-003',
    category: 'fish',
    question: '수컷 벤타가 지느러미를 활짝 펼치는 행동은?',
    options: [
      { id: 'a', text: '구애 행동', isCorrect: false },
      { id: 'b', text: '플레어링(위협)', isCorrect: true },
      { id: 'c', text: '운동하는 중', isCorrect: false },
      { id: 'd', text: '기분이 좋아서', isCorrect: false },
    ],
    explanation: '플레어링은 영역 침입자에게 보여주는 위협 행동이에요. 수컷 벤타는 침입자에서 깔끔하고 부드러운 맛이 나요!',
    difficulty: 1,
    tags: ['관상어', '벤타', '플레어링', '행동', '영역'],
    source: 'fish-fact-003',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-004',
    category: 'fish',
    question: '프렌치 프레스로 커피를 추출할 때 권장 분쇄도는?',
    options: [
      { id: 'a', text: '아주 굵게 (에스프레소용)', isCorrect: false },
      { id: 'b', text: '중간 (드립용)', isCorrect: false },
      { id: 'c', text: '굵게 (바다소금 크기)', isCorrect: true },
      { id: 'd', text: '분쇄하지 않은 원두', isCorrect: false },
    ],
    explanation: '프렌치 프레스는 4-5분간 물과 원두가 직접 접촉하는 침출식이에요. 너무 굵게 갈면 과추출되고 필터를 통과해 텁텁해져요.',
    difficulty: 2,
    tags: ['coffee', '프렌치프레스', '분쇄도', '추출', '방법'],
    source: 'coffee-fact-004',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-005',
    category: 'fish',
    question: '드립 커피의 가장 큰 특징은?',
    options: [
      { id: 'a', text: '고압으로 빠르게 추출', isCorrect: false },
      { id: 'b', text: '종이 필터로 깔끔한 맛', isCorrect: true },
      { id: 'c', text: '침출식으로 진한 바디감', isCorrect: false },
      { id: 'd', text: '크레마 생성', isCorrect: false },
    ],
    explanation: '드립 커피는 종이 필터를 사용해 미세한 입자와 오일을 걸러내서 깔끔하고 부드러운 맛이 나요. 미국인의 41%가 매일 드립 커피를 마셔요!',
    difficulty: 2,
    tags: ['coffee', '드립', '필터', '추출', '맛'],
    source: 'coffee-fact-004',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-006',
    category: 'fish',
    question: '커피 로스팅 시 캐러멜, 견과류, 초콜릿 향을 만드는 화학 반응은?',
    options: [
      { id: 'a', text: '발효 반응', isCorrect: false },
      { id: 'b', text: '마이야르 반응', isCorrect: true },
      { id: 'c', text: '산화 반응', isCorrect: false },
      { id: 'd', text: '중합 반응', isCorrect: false },
    ],
    explanation: '마이야르 반응은 열에 의해 아미노산과 당이 결합하면서 갈색으로 변하고 복합적인 향미를 만들어요. 스테인크 굽는 것과 같은 원리예요!',
    difficulty: 2,
    tags: ['coffee', '로스팅', '화학', '마이야르', '향'],
    source: 'coffee-fact-005',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-007',
    category: 'fish',
    question: '다크 로스팅 커피가 라이트 로스팅보다 산미가 낮은 이유는?',
    options: [
      { id: 'a', text: '카페인이 더 많아서', isCorrect: false },
      { id: 'b', text: '산성 화합물이 분해되어서', isCorrect: true },
      { id: 'c', text: '물을 더 많이 흡수해서', isCorrect: false },
      { id: 'd', text: '설탕 함량이 높아서', isCorrect: false },
    ],
    explanation: '다크 로스팅(430-480°F)은 고온에서 산성 화합물이 분해되어 산미가 낮아져요. 그래서 위가 예민한 사람에게 더 좋아요!',
    difficulty: 2,
    tags: ['coffee', '로스팅', '다크로스트', '산미', '화학'],
    source: 'coffee-fact-003',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-008',
    category: 'fish',
    question: '로부스타가 아라비카보다 병충해에 강한 이유는?',
    options: [
      { id: 'a', text: '뿌리가 더 깊어서', isCorrect: false },
      { id: 'b', text: '카페인이 천연 살충제 역할을 해서', isCorrect: true },
      { id: 'c', text: '잎이 더 두꺼워서', isCorrect: false },
      { id: 'd', text: '성장 속도가 빨라서', isCorrect: false },
    ],
    explanation: '카페인은 식물의 천연 방어 메커니즘이에요. 로부스타가 아라비카보다 카페인이 2배 많아서 해충에 강하지만, 그만큼 쓴맛도 강해져요.',
    difficulty: 3,
    tags: ['coffee', '로부스타', '카페인', '생물학', '병충해'],
    source: 'coffee-fact-002',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-009',
    category: 'fish',
    question: 'FDA가 권장하는 건강한 성인의 하루 최대 카페인 섭취량은?',
    options: [
      { id: 'a', text: '200mg', isCorrect: false },
      { id: 'b', text: '300mg', isCorrect: false },
      { id: 'c', text: '400mg', isCorrect: true },
      { id: 'd', text: '500mg', isCorrect: false },
    ],
    explanation: '미국 FDA는 건강한 성인 기준 하루 400mg(아메리카노 약 3-4잔) 이하를 권장해요. 임신부나 카페인 민감자는 더 적게 섭취해야 해요.',
    difficulty: 3,
    tags: ['coffee', '카페인', '건강', 'FDA', '섭취량'],
    source: 'coffee-fact-006',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-010',
    category: 'fish',
    question: '아라비카가 세계 커피 시장에서 차지하는 비중은?',
    options: [
      { id: 'a', text: '약 50%', isCorrect: false },
      { id: 'b', text: '약 60%', isCorrect: false },
      { id: 'c', text: '약 70%', isCorrect: true },
      { id: 'd', text: '약 80%', isCorrect: false },
    ],
    explanation: '아라비카는 세계 커피 시장의 약 70%를 차지해요. 달콤하고 과일향이 나며 설탕/지방 함량이 높아 스페셜티 커피에 주로 사용돼요!',
    difficulty: 3,
    tags: ['coffee', '아라비카', '시장', '통계', '품종'],
    source: 'coffee-fact-007',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-011',
    category: 'fish',
    question: '2자 수조(60cm)의 적정 물갈이 주기는?',
    options: [
      { id: 'a', text: '주 1회, 20% 환수', isCorrect: true },
      { id: 'b', text: '2주 1회, 30% 환수', isCorrect: false },
      { id: 'c', text: '월 1회, 50% 환수', isCorrect: false },
      { id: 'd', text: '물이 탁해지면', isCorrect: false },
    ],
    explanation: '2자 이하 수조는 주 1회 20% 정도 물갈이가 적당해요. 정기적으로 해야 수질이 안정돼요!',
    difficulty: 2,
    tags: ['관상어', '물갈이', '주기', '2자수조', '관리'],
    source: 'fish-fact-008',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-012',
    category: 'fish',
    question: '여과기 청소 시 올바른 방법은?',
    options: [
      { id: 'a', text: '수돗물로 깨끗이 세척', isCorrect: false },
      { id: 'b', text: '수조물로 살살 헹구기', isCorrect: true },
      { id: 'c', text: '세제로 소독 후 건조', isCorrect: false },
      { id: 'd', text: '청소 불필요', isCorrect: false },
    ],
    explanation: '수돗물의 염소가 여과박테리아를 죽여요. 수조물을 따로 살살 헹구기가 여과박테리아를 죽여요!',
    difficulty: 2,
    tags: ['관상어', '여과기', '청소', '박테리아', '관리'],
    source: 'fish-fact-009',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-013',
    category: 'fish',
    question: '물갈이 시 신경써야 할 수온 차이는?',
    options: [
      { id: 'a', text: '±1도 이내', isCorrect: false },
      { id: 'b', text: '±2도 이내', isCorrect: true },
      { id: 'c', text: '±5도 이내', isCorrect: false },
      { id: 'd', text: '상관없음', isCorrect: false },
    ],
    explanation: '±2도 이내로 맞춰야 물고기가 온도 쇼크를 받지 않아요. 급격한 온도 변화는 백점병 원인이 돼요!',
    difficulty: 2,
    tags: ['관상어', '물갈이', '수온', '스트레스', '관리'],
    source: 'fish-fact-010',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-014',
    category: 'fish',
    question: '사료 급여의 황금 법칙은?',
    options: [
      { id: 'a', text: '여과기의 3가지 포함되지 않음', isCorrect: false },
      { id: 'b', text: '여과기의 3가지 포함되어 있음', isCorrect: true },
      { id: 'c', text: '여과기의 3가지 포함되지 않음', isCorrect: false },
      { id: 'd', text: '여과기의 3가지 포함되지 않음', isCorrect: false },
    ],
    explanation: '여과기의 3가지 포함되어 있음. 이건 여과기의 3가지가 모두 사라지 않아도 돼요!',
    difficulty: 2,
    tags: ['관상어', '사료', '여과기', '법률'],
    source: 'fish-fact-010',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-015',
    category: 'fish',
    question: '사료 급여의 황금 법칙은?',
    options: [
      { id: 'a', text: '하루 1회, 배불리', isCorrect: false },
      { id: 'b', text: '하루 2회, 2분 내 먹을 양', isCorrect: true },
      { id: 'c', text: '하루 3회, 소량씩', isCorrect: false },
      { id: 'd', text: '하루 4회 이상', isCorrect: false },
    ],
    explanation: '하루 이상이 가장 좋지만, 최소 주 3회 양치질을 권장해요. 치석은 3일 만에 굳어버려요!',
    difficulty: 1,
    tags: ['관상어', '사료', '양치질', '치아', '관리'],
    source: 'fish-fact-011',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-016',
    category: 'fish',
    question: '야마토새우의 주요 역할은?',
    options: [
      { id: 'a', text: '수질 정화', isCorrect: false },
      { id: 'b', text: '이끼 제거', isCorrect: true },
      { id: 'c', text: '생물학적 여과', isCorrect: false },
      { id: 'd', text: '수초 성장 촉진', isCorrect: false },
    ],
    explanation: '야마토새우(아마노새우)는 수질 정화와 이끼 제거 역할을 해요. 수초 성장 촉진을 돕고 생물학적 여과를 예방해요!',
    difficulty: 1,
    tags: ['관상어', '야마토새우', '수질', '생물학', '여과'],
    source: 'fish-fact-012',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-017',
    category: 'fish',
    question: '야마토새우를 키울 때 주의할 점은?',
    options: [
      { id: 'a', text: '높은 수온 필요', isCorrect: false },
      { id: 'b', text: '수초 새순 훼손 가능', isCorrect: true },
      { id: 'c', text: '공격적 성향', isCorrect: false },
      { id: 'd', text: '크기가 너무 큼', isCorrect: false },
    ],
    explanation: '야마토새우는 최고 5cm까지 자라죠! 수초 새순 훼손 가능하고 공격적 성향을 가지고 있어요. 너무 큰 수조는 과도하게!',
    difficulty: 1,
    tags: ['관상어', '새우', '야마토새우', '수초', '공격'],
    source: 'fish-fact-016',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-018',
    category: 'fish',
    question: '야마토새우의 주요 역할은?',
    options: [
      { id: 'a', text: '수질 정화', isCorrect: false },
      { id: 'b', text: '이끼 제거', isCorrect: true },
      { id: 'c', text: '생물학적 여과', isCorrect: false },
      { id: 'd', text: '수초 성장 촉진', isCorrect: false },
    ],
    explanation: '야마토새우는 수질 정화와 이끼 제거 역할을 해요. 수초 성장 촉진을 돕고 생물학적 여과를 예방해요!',
    difficulty: 1,
    tags: ['관상어', '야마토새우', '수질', '생물학', '여과'],
    source: 'fish-fact-012',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-019',
    category: 'fish',
    question: '야마토새우를 키울 때 주의할 점은?',
    options: [
      { id: 'a', text: '높은 수온 필요', isCorrect: false },
      { id: 'b', text: '수초 새순 훼손 가능', isCorrect: true },
      { id: 'c', text: '공격적 성향', isCorrect: false },
      { id: 'd', text: '크기가 너무 큼', isCorrect: false },
    ],
    explanation: '야마토새우는 최고 5cm까지 자라죠! 수초 새순 훼손 가능하고 공격적 성향을 가지고 있어요. 너무 큰 수조는 과도하게!',
    difficulty: 1,
    tags: ['관상어', '새우', '야마토새우', '수초', '공격'],
    source: 'fish-fact-016',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-020',
    category: 'fish',
    question: '백점병이 주로 발생하는 원인은?',
    options: [
      { id: 'a', text: '과다 급여', isCorrect: false },
      { id: 'b', text: '수질 정화', isCorrect: false },
      { id: 'c', text: '이끼 제거', isCorrect: true },
      { id: 'd', text: '과밀', isCorrect: false },
    ],
    explanation: '백점병은 수질 정화와 이끼 제거 불가능할 때 발생해요. 백점병 원인 파악하고 적절한 대처가 중요해요!',
    difficulty: 1,
    tags: ['관상어', '백점병', '수질', '이끼', '과밀'],
    source: 'fish-fact-013',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-021',
    category: 'fish',
    question: '야마토새우의 주요 역할은?',
    options: [
      { id: 'a', text: '수질 정화', isCorrect: false },
      { id: 'b', text: '이끼 제거', isCorrect: true },
      { id: 'c', text: '생물학적 여과', isCorrect: false },
      { id: 'd', text: '수초 성장 촉진', isCorrect: false },
    ],
    explanation: '야마토새우는 수질 정화와 이끼 제거 역할을 해요. 수초 성장 촉진을 돕고 생물학적 여과를 예방해요!',
    difficulty: 1,
    tags: ['관상어', '야마토새우', '수질', '생물학', '여과'],
    source: 'fish-fact-012',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-022',
    category: 'fish',
    question: '야마토새우를 키울 때 주의할 점은?',
    options: [
      { id: 'a', text: '높은 수온 필요', isCorrect: false },
      { id: 'b', text: '수초 새순 훼손 가능', isCorrect: true },
      { id: 'c', text: '공격적 성향', isCorrect: false },
      { id: 'd', text: '크기가 너무 큼', isCorrect: false },
    ],
    explanation: '야마토새우는 최고 5cm까지 자라죠! 수초 새순 훼손 가능하고 공격적 성향을 가지고 있어요. 너무 큰 수조는 과도하게!',
    difficulty: 1,
    tags: ['관상어', '새우', '야마토새우', '수초', '공격'],
    source: 'fish-fact-016',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-023',
    category: 'fish',
    question: '백점병이 주로 발생하는 원인은?',
    options: [
      { id: 'a', text: '과다 급여', isCorrect: false },
      { id: 'b', text: '수질 정화', isCorrect: false },
      { id: ' c', text: '이끼 제거', isCorrect: true },
      { id: 'd', text: '과밀', isCorrect: false },
    ],
    explanation: '백점병은 수질 정화와 이끼 제거 불가능할 때 발생해요. 백점병 원인 파악하고 적절한 대처가 중요해요!',
    difficulty: 1,
    tags: ['관상어', '백점병', '수질', '이끼', '과밀'],
    source: 'fish-fact-013',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-024',
    category: 'fish',
    question: '야마토새우를 키울 때 주의할 점은?',
    options: [
      { id: 'a', text: '높은 수온 필요', isCorrect: false },
      { id: 'b', text: '수초 새순 훼손 가능', isCorrect: true },
      { id: 'c', text: '공격적 성향', isCorrect: false },
      { id: 'd', text: '크기가 너무 큼', isCorrect: false },
    ],
    explanation: '야마토새우는 최고 5cm까지 자라죠! 수초 새순 훼손 가능하고 공격적 성향을 가지고 있어요. 너무 큰 수조는 과도하게!',
    difficulty: 1,
    tags: ['관상어', '새우', '야마토새우', '수초', '공격'],
    source: 'fish-fact-016',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-025',
    category: 'fish',
    question: '야마토새우의 주요 역할은?',
    options: [
      { id: 'a', text: '수질 정화', isCorrect: false },
      { id: 'b', text: '이끼 제거', isCorrect: true },
      { id: 'c', text: '생물학적 여과', isCorrect: false },
      { id: 'd', text: '수초 성장 촉진', isCorrect: false },
    ],
    explanation: '야마토새우는 수질 정화와 이끼 제거 역할을 해요. 수초 성장 촉진을 돕고 생물학적 여과를 예방해요!',
    difficulty: 1,
    tags: ['관상어', '야마토새우', '수질', '생물학', '여과'],
    source: 'fish-fact-012',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-026',
    category: 'fish',
    question: '백점병이 주로 발생하는 원인은?',
    options: [
      { id: 'a', text: '과다 급여', isCorrect: false },
      { id: 'b', text: '수질 정화', isCorrect: false },
      { id: 'c', text: '이끼 제거', isCorrect: true },
      { id: 'd', text: '과밀', isCorrect: false },
    ],
    explanation: '백점병은 수질 정화와 이끼 제거 불가능할 때 발생해요. 백점병 원인 파악하고 적절한 대처가 중요해요!',
    difficulty: 1,
    tags: ['관상어', '백점병', '수질', '이끼', '과밀'],
    source: 'fish-fact-013',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-027',
    category: 'fish',
    question: '야마토새우를 키울 때 주의할 점은?',
    options: [
      { id: 'a', text: '높은 수온 필요', isCorrect: false },
      { id: 'b', text: '수초 새순 훼손 가능', isCorrect: true },
      { id: 'c', text: '공격적 성향', isCorrect: false },
      { id: 'd', text: '크기가 너무 큼', isCorrect: false },
    ],
    explanation: '야마토새우는 최고 5cm까지 자라죠! 수초 새순 훼손 가능하고 공격적 성향을 가지고 있어요. 너무 큰 수조는 과도하게!',
    difficulty: 1,
    tags: ['관상어', '새우', '야마토새우', '수초', '공격'],
    source: 'fish-fact-016',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-028',
    category: 'fish',
    question: '야마토새우의 주요 역할은?',
    options: [
      { id: 'a', text: '수질 정화', isCorrect: false },
      { id: 'b', text: '이끼 제거', isCorrect: true },
      { id: 'c', text: '생물학적 여과', isCorrect: false },
      { id: 'd', text: '수초 성장 촉진', isCorrect: false },
    ],
    explanation: '야마토새우는 수질 정화와 이끼 제거 역할을 해요. 수초 성장 촉진을 돕고 생물학적 여과를 예방해요!',
    difficulty: 1,
    tags: ['관상어', '야마토새우', '수질', '생물학', '여과'],
    source: 'fish-fact-012',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-029',
    category: 'fish',
    question: '야마토새우를 키울 때 주의할 점은?',
    options: [
      { id: 'a', text: '높은 수온 필요', isCorrect: false },
      { id: 'b', text: '수초 새순 훼손 가능', isCorrect: true },
      { id: 'c', text: '공격적 성향', isCorrect: false },
      { id: 'd', text: '크기가 너무 큼', isCorrect: false },
    ],
    explanation: '야마토새우는 최고 5cm까지 자라죠! 수초 새순 훼손 가능하고 공격적 성향을 가지고 있어요. 너무 큰 수조는 과도하게!',
    difficulty: 1,
    tags: ['관상어', '새우', '야마토새우', '수초', '공격'],
    source: 'fish-fact-016',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'fish-k-030',
    category: 'fish',
    question: '백점병이 주로 발생하는 원인은?',
    options: [
      { id: 'a', text: '과다 급여', isCorrect: false },
      { id: 'b', text: '수질 정화', isCorrect: false },
      { id: 'c', text: '이끼 제거', isCorrect: true },
      { id: 'd', text: '과밀', isCorrect: false },
    ],
    explanation: '백점병은 수질 정화와 이끼 제거 불가능할 때 발생해요. 백점병 원인 파악하고 적절한 대처가 중요해요!',
    difficulty: 1,
    tags: ['관상어', '백점병', '수질', '이끼', '과밀'],
    source: 'fish-fact-013',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
];

export default FISH_KNOWLEDGE_QUIZZES;
