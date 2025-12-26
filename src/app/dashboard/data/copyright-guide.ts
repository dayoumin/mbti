// 저작권/초상권 가이드 데이터
// 콘텐츠 제작 시 법적 주의사항 정리

export interface LegalCase {
  title: string;
  year: string;
  result: string;
  amount?: string;
  source: string;
  sourceUrl: string;
}

export interface ContentTypeGuide {
  type: string;
  icon: string;
  canUse: boolean;
  risk: 'high' | 'medium' | 'low' | 'safe';
  description: string;
  recommendation: string;
  examples: string[];
}

export interface ImageStrategy {
  contentType: string;
  icon: string;
  strategy: string;
  examples: string[];
  prompts?: string[];
}

// 관련 법률
export const RELATED_LAWS = [
  {
    name: '부정경쟁방지법 제2조',
    description: '국내에 널리 인식되고 경제적 가치를 가지는 타인의 성명, 초상, 음성 등을 무단으로 사용하여 타인의 경제적 이익을 침해하는 행위를 부정경쟁행위로 규정',
    penalty: '민사상 손해배상 청구 가능',
    icon: '⚖️'
  },
  {
    name: '성폭력처벌법 제14조의2',
    description: '사람의 얼굴·신체를 대상으로 한 촬영물·합성물·가공물을 당사자 의사에 반해 유포',
    penalty: '5년 이하 징역 또는 5천만원 이하 벌금',
    icon: '🚨'
  },
  {
    name: '민법 (인격권)',
    description: '대법원 2006년 판결: "초상권은 헌법상 보장된 인격권의 하나"',
    penalty: '민사상 손해배상',
    icon: '📜'
  },
  {
    name: '퍼블리시티권 (판례법)',
    description: '유명인의 성명, 초상 등 동일성을 상업적으로 이용하고 통제할 수 있는 배타적 권리. 한국은 아직 법제화되지 않았으나 판례로 인정',
    penalty: '민사상 손해배상',
    icon: '💰'
  }
];

// 실제 판례
export const LEGAL_CASES: LegalCase[] = [
  {
    title: '푸딩 앱 사건',
    year: '2005',
    result: '연예인 60명에게 손해배상 판결',
    amount: '1억 8000만원 (1인당 300만원)',
    source: '법률신문',
    sourceUrl: 'https://www.lawtimes.co.kr/news/78897'
  },
  {
    title: '연예인 가짜 광고 사건',
    year: '2023',
    result: '초상권 침해 인정',
    amount: '2,500만원',
    source: '아시아경제',
    sourceUrl: 'https://www.asiae.co.kr/article/2024122316420788873'
  },
  {
    title: 'AI 생성 BTS 이미지',
    year: '2024',
    result: '저작권/초상권 침해 가능성 경고',
    source: '이데일리',
    sourceUrl: 'https://www.edaily.co.kr/News/Read?newsId=03384966638894168&mediaCodeNo=257'
  }
];

// 콘텐츠 유형별 가이드
export const CONTENT_TYPE_GUIDES: ContentTypeGuide[] = [
  // === 인물 관련 ===
  {
    type: '실제 연예인 사진',
    icon: '📸',
    canUse: false,
    risk: 'high',
    description: '저작권 + 초상권 모두 침해',
    recommendation: '절대 사용 금지',
    examples: ['연예인 프로필 사진', '드라마/영화 스틸컷', '공연 사진']
  },
  {
    type: '연예인 얼굴 AI 변환 (수채화/일러스트)',
    icon: '🎨',
    canUse: false,
    risk: 'high',
    description: '"초상인을 알아볼 수 있는 정도"면 침해',
    recommendation: '스타일 변환해도 누군지 알면 불가',
    examples: ['연예인 수채화', '연예인 캐리커처', 'AI로 연예인 일러스트화']
  },
  {
    type: '연예인 이름만 사용',
    icon: '✏️',
    canUse: true,
    risk: 'low',
    description: '이름 자체는 상업적 사용 아니면 대체로 허용',
    recommendation: '월드컵 등에서 이름+이모지 조합 가능',
    examples: ['이상형 월드컵 (이름만)', '투표 (이름만)', '랭킹 (이름만)']
  },
  {
    type: '가상 인물 AI 생성',
    icon: '🤖',
    canUse: true,
    risk: 'safe',
    description: '실존 인물 아니므로 초상권 문제 없음',
    recommendation: '테스트 결과 이미지에 적합',
    examples: ['이상형 테스트 결과 이미지', '성격 유형 일러스트', '가상 캐릭터']
  },
  {
    type: '상황/분위기 일러스트',
    icon: '🌸',
    canUse: true,
    risk: 'safe',
    description: '특정인 묘사 아닌 장면 중심',
    recommendation: '감성적인 테스트에 적합',
    examples: ['데이트 장면', '커플 실루엣', '로맨틱한 배경']
  },
  {
    type: '추상적 아이콘/이모지',
    icon: '💝',
    canUse: true,
    risk: 'safe',
    description: '저작권/초상권 문제 없음',
    recommendation: '가장 안전한 방식',
    examples: ['하트 아이콘', '이모지 조합', '심플 아이콘']
  },

  // === 상품/브랜드 관련 ===
  {
    type: '상품 공식 이미지 (로고/패키지)',
    icon: '🏷️',
    canUse: false,
    risk: 'high',
    description: '상표권 + 저작권 침해 가능',
    recommendation: '공식 이미지 무단 사용 금지',
    examples: ['제품 패키지 사진', '브랜드 로고', '공식 광고 이미지']
  },
  {
    type: '상품명만 사용 (투표/월드컵)',
    icon: '🍜',
    canUse: true,
    risk: 'safe',
    description: '사실 정보 전달, 비교/평가 목적은 합법',
    recommendation: '이름 + 이모지 조합으로 사용 가능',
    examples: ['라면 월드컵 (신라면 vs 진라면)', '과자 랭킹', '음료 투표']
  },
  {
    type: '상품 직접 촬영 사진',
    icon: '📱',
    canUse: true,
    risk: 'low',
    description: '본인 촬영물은 저작권 문제 없음',
    recommendation: '직접 구매 후 촬영하면 안전',
    examples: ['직접 찍은 제품 사진', '리뷰용 촬영', '비교 사진']
  },
  {
    type: '상품 AI 일러스트 (로고 없이)',
    icon: '🎨',
    canUse: true,
    risk: 'low',
    description: '브랜드 로고/패키지 디자인 제외하면 가능',
    recommendation: '"빨간 국물 라면" 같은 일반적 표현 사용',
    examples: ['라면 그릇 일러스트', '커피잔 아이콘', '음식 일러스트']
  }
];

// 콘텐츠별 이미지 전략
export const IMAGE_STRATEGIES: ImageStrategy[] = [
  {
    contentType: '이상형 테스트',
    icon: '💕',
    strategy: '가상 인물 + 상황 중심 수채화 일러스트',
    examples: [
      '꽃다발 건네는 손 (다정다감)',
      '비 오는 날 우산 씌워주는 장면 (든든한 버팀목)',
      '뒤돌아서 걷지만 손은 잡고 있는 모습 (츤데레)',
      '소파에서 담요 덮고 영화 보는 커플 (집순이/집돌이)'
    ],
    prompts: [
      'romantic date scene, couple silhouette, soft watercolor',
      'cozy home scene, watching movie together, warm atmosphere'
    ]
  },
  {
    contentType: '연예인 월드컵',
    icon: '🏆',
    strategy: '이름 + 이모지/아이콘 (이미지 없음)',
    examples: [
      '⚔️ A vs B 배틀 카드 디자인',
      '카테고리 아이콘: 🎬 배우 / 🎤 가수',
      '랭킹 뱃지: 🥇🥈🥉',
      '강렬한 텍스트 스타일링'
    ]
  },
  {
    contentType: '성격 테스트',
    icon: '🧠',
    strategy: '추상적 심리 일러스트',
    examples: [
      '감정을 나타내는 색상 그라데이션',
      '심리 상태를 표현하는 추상 패턴',
      '성격 유형별 동물/식물 은유'
    ]
  },
  {
    contentType: '궁합 테스트',
    icon: '💑',
    strategy: '두 요소의 조화를 표현하는 추상 이미지',
    examples: [
      '두 색상이 섞이는 그라데이션',
      '퍼즐 조각이 맞춰지는 이미지',
      '두 손이 만나는 실루엣'
    ]
  },
  {
    contentType: '상품 월드컵/티어 (라면, 과자 등)',
    icon: '🍜',
    strategy: '상품명 + 이모지 (이미지 없이) 또는 AI 일러스트',
    examples: [
      '🔥 신라면 vs 🌊 진라면 텍스트 배틀',
      '이모지로 특징 표현: 🌶️ 매운맛 / 🧀 치즈맛',
      'AI 생성: "bowl of spicy red ramen, steam rising" (로고 제외)',
      '직접 촬영: 제품 구매 후 촬영'
    ],
    prompts: [
      'bowl of spicy korean ramen, red broth, steam, no brand logo, food illustration',
      'instant noodles in bowl, chopsticks, simple watercolor style'
    ]
  }
];

// 핵심 체크리스트
export const CHECKLIST = [
  {
    question: '이미지에서 특정 인물을 알아볼 수 있는가?',
    yes: '❌ 사용 불가 (초상권 침해)',
    no: '✅ 사용 가능'
  },
  {
    question: '상업적 목적으로 사용하는가?',
    yes: '⚠️ 더 엄격한 기준 적용',
    no: '✅ 비교적 자유로움'
  },
  {
    question: '본인(또는 소속사) 허락을 받았는가?',
    yes: '✅ 사용 가능',
    no: '❌ 실제 인물 이미지 사용 불가'
  },
  {
    question: 'AI로 생성한 완전히 가상의 인물인가?',
    yes: '✅ 초상권 문제 없음',
    no: '⚠️ 실존 인물 참조 시 주의'
  }
];

// AI 이미지 생성 시 안전 프롬프트
export const SAFE_PROMPT_TIPS = [
  {
    tip: '실존 인물 배제 명시',
    example: 'fictional character, not based on any real person, original character design'
  },
  {
    tip: '연예인 이름/특징 절대 언급 금지',
    example: '❌ "like BTS Jungkook" → ✅ "young man with warm smile"'
  },
  {
    tip: '얼굴보다 상황/분위기 중심',
    example: 'romantic cafe scene, couple holding hands, soft lighting'
  },
  {
    tip: '실루엣/뒷모습 활용',
    example: 'couple silhouette watching sunset, back view of person'
  }
];
