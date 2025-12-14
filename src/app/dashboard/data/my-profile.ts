// ============================================================================
// 나의 프로필 시스템 기획
// ============================================================================

// ============================================================================
// 핵심 컨셉
// ============================================================================

export const PROFILE_CONCEPT = {
  title: '나의 프로필',
  subtitle: '테스트를 할수록 나를 더 잘 알게 되는 경험',

  // 핵심 아이디어
  coreIdea: `
    현재: 테스트 완료 → 결과 나열 → 끝
    개선: 테스트 완료 → 프로필에 반영 → "나"가 점점 그려짐

    사용자가 테스트를 할수록:
    1. 성격 프로필이 풍부해짐
    2. 반려동물 케미 점수가 쌓임
    3. 라이프스타일 취향이 드러남
    4. 시나리오 퀴즈 점수로 능력치 표시
  `,

  // 사용자 가치
  userValue: [
    '한눈에 "나"를 파악할 수 있음',
    '테스트할수록 프로필이 풍부해지는 재미',
    '시나리오 퀴즈로 점수/등급 수집 욕구',
    'SNS 공유용 프로필 카드 생성',
  ],
};

// ============================================================================
// 프로필 섹션 정의
// ============================================================================

export interface ProfileSection {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  sourceTests: string[];  // 데이터를 가져올 테스트들
  visualType: 'radar' | 'bar' | 'badge' | 'card' | 'gauge';
  priority: number;  // 표시 우선순위 (1이 가장 높음)
}

export const PROFILE_SECTIONS: ProfileSection[] = [
  {
    id: 'personality',
    name: '나의 성격',
    icon: '🧠',
    color: '#7aa2ff',
    description: '5가지 성격 차원으로 나를 표현',
    sourceTests: ['human'],
    visualType: 'radar',
    priority: 1,
  },
  {
    id: 'petChemi',
    name: '반려동물 케미',
    icon: '🐾',
    color: '#ff9f43',
    description: '어떤 동물과 잘 맞을까?',
    sourceTests: ['cat', 'dog', 'rabbit', 'hamster', 'petMatch'],
    visualType: 'bar',
    priority: 2,
  },
  {
    id: 'careScores',
    name: '케어 능력',
    icon: '⭐',
    color: '#55e6c1',
    description: '시나리오 퀴즈로 측정한 돌봄 능력',
    sourceTests: [], // 시나리오 퀴즈에서 가져옴
    visualType: 'gauge',
    priority: 3,
  },
  {
    id: 'relationship',
    name: '연애/관계',
    icon: '💕',
    color: '#ff6b6b',
    description: '나의 연애 스타일과 갈등 대처',
    sourceTests: ['idealType', 'conflictStyle'],
    visualType: 'card',
    priority: 4,
  },
  {
    id: 'lifestyle',
    name: '라이프스타일',
    icon: '☕',
    color: '#a29bfe',
    description: '일상 속 나의 취향',
    sourceTests: ['coffee', 'plant'],
    visualType: 'badge',
    priority: 5,
  },
];

// ============================================================================
// 시각화 라이브러리 옵션
// ============================================================================

export const VISUALIZATION_LIBRARIES = {
  recommended: {
    name: 'Recharts',
    reason: 'React 친화적, 가볍고 커스터마이징 용이',
    install: 'npm install recharts',
    features: ['RadarChart', 'BarChart', 'PieChart', 'ResponsiveContainer'],
    docs: 'https://recharts.org/',
  },
  alternatives: [
    {
      name: 'Chart.js + react-chartjs-2',
      reason: '가장 대중적, 다양한 차트 타입',
      install: 'npm install chart.js react-chartjs-2',
    },
    {
      name: 'Nivo',
      reason: '아름다운 기본 스타일, 인터랙티브',
      install: 'npm install @nivo/core @nivo/radar @nivo/bar',
    },
    {
      name: 'Victory',
      reason: 'Airbnb 스타일, 애니메이션 강점',
      install: 'npm install victory',
    },
    {
      name: 'Tremor',
      reason: '대시보드 특화, Tailwind 통합',
      install: 'npm install @tremor/react',
    },
  ],
};

// ============================================================================
// 프로필 데이터 구조
// ============================================================================

export interface MyProfile {
  // 기본 정보
  userId: string;
  lastUpdated: string;
  completionRate: number;  // 전체 테스트 중 완료 비율

  // 성격 (human 테스트)
  personality?: {
    resultName: string;
    resultEmoji: string;
    traits: {
      key: string;
      label: string;
      score: number;      // 0-100
      level: 'LOW' | 'MEDIUM' | 'HIGH';
    }[];
  };

  // 반려동물 케미
  petChemi?: {
    recommendedPet?: string;  // petMatch 결과
    scores: {
      pet: string;           // cat, dog, etc.
      petName: string;       // 고양이, 강아지
      petEmoji: string;
      resultName: string;    // 테스트 결과명
      compatibility: number; // 0-100 (계산된 케미 점수)
    }[];
  };

  // 케어 능력 (시나리오 퀴즈)
  careScores?: {
    catButler?: { score: number; grade: string; title: string };  // 집사 점수
    dogOwner?: { score: number; grade: string; title: string };   // 견주력
    plantCare?: { score: number; grade: string; title: string };  // 식물 케어
    // 추가 시나리오 퀴즈 점수들...
  };

  // 연애/관계
  relationship?: {
    idealType?: {
      resultName: string;
      resultEmoji: string;
    };
    conflictStyle?: {
      resultName: string;
      resultEmoji: string;
    };
  };

  // 라이프스타일
  lifestyle?: {
    coffee?: { resultName: string; resultEmoji: string };
    plant?: { resultName: string; resultEmoji: string };
  };
}

// ============================================================================
// 프로필 카드 (SNS 공유용)
// ============================================================================

export interface ProfileCard {
  type: 'full' | 'mini' | 'single';
  title: string;
  sections: string[];  // 포함할 섹션 ID들
  style: {
    width: number;
    height: number;
    background: string;
  };
}

export const PROFILE_CARDS: ProfileCard[] = [
  {
    type: 'full',
    title: '나의 전체 프로필',
    sections: ['personality', 'petChemi', 'careScores', 'relationship', 'lifestyle'],
    style: { width: 400, height: 600, background: 'gradient-purple' },
  },
  {
    type: 'mini',
    title: '미니 프로필',
    sections: ['personality', 'petChemi'],
    style: { width: 300, height: 300, background: 'gradient-blue' },
  },
  {
    type: 'single',
    title: '성격 프로필',
    sections: ['personality'],
    style: { width: 350, height: 350, background: 'gradient-indigo' },
  },
];

// ============================================================================
// 구현 로드맵
// ============================================================================

export const PROFILE_ROADMAP = [
  {
    phase: 'Phase 1',
    title: '기본 프로필 UI',
    duration: '1주',
    tasks: [
      'Recharts 설치 및 설정',
      'ProfileService 생성 (결과 데이터 → 프로필 변환)',
      '성격 레이더 차트 구현',
      '반려동물 케미 바 차트 구현',
      '메인 화면에 프로필 카드 추가',
    ],
  },
  {
    phase: 'Phase 2',
    title: '케어 점수 연동',
    duration: '1주',
    tasks: [
      '시나리오 퀴즈 데이터 구조 확정',
      '케어 점수 게이지 차트 구현',
      '프로필 완성도 표시',
      '섹션별 "더 알아보기" 테스트 추천',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'SNS 공유 카드',
    duration: '1주',
    tasks: [
      'html2canvas로 프로필 카드 이미지 생성',
      '카드 템플릿 3종 구현',
      '공유 버튼 연동',
      '인스타그램 스토리 최적화',
    ],
  },
];

// ============================================================================
// UI 컴포넌트 설계
// ============================================================================

export const PROFILE_COMPONENTS = {
  // 메인 화면용 컴팩트 프로필
  CompactProfile: {
    description: '메인 화면 상단에 표시되는 간단한 프로필',
    elements: [
      '프로필 완성도 프로그레스 바',
      '대표 성격 유형 + 이모지',
      '주요 케미 동물 아이콘들',
      '"프로필 더보기" 버튼',
    ],
  },

  // 전체 프로필 뷰
  FullProfileView: {
    description: '프로필 상세 페이지 (별도 라우트 또는 모달)',
    elements: [
      '성격 레이더 차트 (5가지 차원)',
      '반려동물 케미 바 차트',
      '케어 점수 게이지들',
      '연애/관계 카드',
      '라이프스타일 뱃지들',
      'SNS 공유 버튼',
    ],
  },

  // 레이더 차트 (성격용)
  PersonalityRadar: {
    description: '5가지 성격 차원을 레이더 차트로 표시',
    dimensions: ['인싸력', '모험심', '공감력', '계획력', '멘탈력'],
    colors: {
      fill: 'rgba(122, 162, 255, 0.3)',
      stroke: '#7aa2ff',
    },
  },

  // 바 차트 (케미용)
  PetChemiBar: {
    description: '반려동물별 케미 점수를 바 차트로 표시',
    maxValue: 100,
    colors: {
      cat: '#ff9f43',
      dog: '#54a0ff',
      rabbit: '#ff6b9d',
      hamster: '#feca57',
    },
  },

  // 게이지 차트 (점수용)
  ScoreGauge: {
    description: '시나리오 퀴즈 점수를 게이지로 표시',
    grades: [
      { min: 90, grade: 'S', color: '#ffd700' },
      { min: 80, grade: 'A', color: '#55e6c1' },
      { min: 70, grade: 'B', color: '#7aa2ff' },
      { min: 60, grade: 'C', color: '#ffd166' },
      { min: 0, grade: 'D', color: '#ff6b6b' },
    ],
  },
};

// ============================================================================
// Export
// ============================================================================

export const MY_PROFILE_SYSTEM = {
  concept: PROFILE_CONCEPT,
  sections: PROFILE_SECTIONS,
  visualization: VISUALIZATION_LIBRARIES,
  cards: PROFILE_CARDS,
  roadmap: PROFILE_ROADMAP,
  components: PROFILE_COMPONENTS,
};

export default MY_PROFILE_SYSTEM;
