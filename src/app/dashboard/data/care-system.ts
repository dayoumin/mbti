// ============================================================================
// 케어 시스템 데이터 (반려동물/식물 관리 도우미)
// ============================================================================

// ============================================================================
// Types
// ============================================================================

export type CareTarget = 'dog' | 'cat' | 'fish' | 'plant' | 'hamster' | 'rabbit';
export type FeatureStatus = 'planned' | 'in-progress' | 'done';
export type Priority = 'high' | 'medium' | 'low';
export type Phase = 1 | 2 | 3;

export interface CareFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  priority: Priority;
  status: FeatureStatus;
  phase: Phase;
  difficulty: 1 | 2 | 3;  // 구현 난이도
  impact: 1 | 2 | 3 | 4 | 5;  // 사용자 가치
}

export interface CareTargetDefinition {
  id: CareTarget;
  name: string;
  emoji: string;
  color: string;
  description: string;
  linkedTest: string;  // 연동되는 테스트
  features: CareFeature[];
  careCategories: CareCategory[];
  appReferences: AppReference[];
}

export interface CareCategory {
  id: string;
  name: string;
  emoji: string;
  items: string[];
}

export interface AppReference {
  name: string;
  url: string;
  features: string[];
}

export interface RoadmapPhase {
  phase: Phase;
  title: string;
  description: string;
  features: string[];
  targets: CareTarget[];
}

// ============================================================================
// 앱 레퍼런스 (시장 조사 결과)
// ============================================================================

export const APP_REFERENCES: Record<CareTarget, AppReference[]> = {
  dog: [
    {
      name: '펫츄(PETCHU)',
      url: 'https://apps.apple.com/kr/app/펫츄-petchu-반려동물-전용-양육관리어플/id1445537522',
      features: ['체중 기록', '사료 급여량 계산', '백신/예방약 관리', '미용/위생 알람'],
    },
    {
      name: '똑똑집사',
      url: 'https://ttokttok.co/',
      features: ['다견 관리', '건강 이상 신호 기록', '병원 진료 자료'],
    },
    {
      name: 'Petfetti',
      url: 'https://apps.apple.com/us/app/pet-care-tracker-petfetti/id6471319447',
      features: ['15+ 건강 지표', '증상/행동 기록', '약물 관리', '혈당 모니터링'],
    },
  ],
  cat: [
    {
      name: '펫츄(PETCHU)',
      url: 'https://apps.apple.com/kr/app/펫츄-petchu-반려동물-전용-양육관리어플/id1445537522',
      features: ['체중 기록', '사료 급여량', '예방접종 관리'],
    },
    {
      name: '티티케어',
      url: 'https://play.google.com/store/apps/details?id=com.aiforpet.pet',
      features: ['AI 건강체크', '비대면 진료', '건강 기록'],
    },
  ],
  fish: [
    {
      name: 'Aquarium Log',
      url: 'https://apps.apple.com/us/app/aquarium-log-tank-manager/id1621042664',
      features: ['다중 수조 관리', '수질 측정 그래프', '유지보수 알림'],
    },
    {
      name: 'Aquabuildr',
      url: 'https://apps.apple.com/us/app/aquabuildr/id1568234361',
      features: ['AI 어종 호환성(600+종)', '투약 기록', '수질 로깅'],
    },
    {
      name: 'TankSync',
      url: 'https://apps.apple.com/us/app/tanksync/id6746080095',
      features: ['AI 생태계 분석', 'pH/암모니아/질산염 추적', '스마트 알림'],
    },
  ],
  plant: [
    {
      name: 'Planta',
      url: 'https://getplanta.com/',
      features: ['30+ 파라미터 기반 알림', '날씨 연동', '비료/분갈이 알림'],
    },
    {
      name: 'PlantIn',
      url: 'https://myplantin.com/',
      features: ['AI 식물 진단', '전문가 상담', '개인화 케어 스케줄'],
    },
    {
      name: 'Vera',
      url: 'https://ecocation.org/best-free-plant-care-apps/',
      features: ['완전 무료', '광고 없음', '식물 케어 라이브러리'],
    },
  ],
  hamster: [
    {
      name: 'PetNote Plus',
      url: 'https://apps.apple.com/us/app/petnote-pet-care-tracker/id1553584485',
      features: ['체중/온도 기록', '배변 상태 사진', '커스텀 추적 항목'],
    },
  ],
  rabbit: [
    {
      name: 'PetNote Plus',
      url: 'https://apps.apple.com/us/app/petnote-pet-care-tracker/id1553584485',
      features: ['체중 추적', '루틴 설정', '가족 공유'],
    },
  ],
};

// ============================================================================
// 대상별 케어 시스템 정의
// ============================================================================

export const CARE_TARGETS: CareTargetDefinition[] = [
  // ==========================================================================
  // 강아지
  // ==========================================================================
  {
    id: 'dog',
    name: '강아지',
    emoji: '🐕',
    color: '#f59e0b',
    description: '산책, 건강관리, 예방접종 등 강아지 돌봄 도우미',
    linkedTest: 'dog',
    careCategories: [
      {
        id: 'daily',
        name: '일상 케어',
        emoji: '☀️',
        items: ['산책', '밥주기', '물갈이', '간식'],
      },
      {
        id: 'health',
        name: '건강 관리',
        emoji: '💊',
        items: ['예방접종', '심장사상충', '구충제', '체중 체크'],
      },
      {
        id: 'grooming',
        name: '미용/위생',
        emoji: '✨',
        items: ['목욕', '빗질', '발톱', '귀청소', '양치'],
      },
    ],
    features: [
      {
        id: 'walk-timer',
        name: '산책 타이머',
        description: 'GPS 경로 기록, 거리/시간 측정, 산책 리마인더',
        icon: '🚶',
        priority: 'high',
        status: 'planned',
        phase: 1,
        difficulty: 2,
        impact: 5,
      },
      {
        id: 'feeding-log',
        name: '급여 기록',
        description: '사료/간식 급여량 기록, 권장량 계산기',
        icon: '🍖',
        priority: 'high',
        status: 'planned',
        phase: 1,
        difficulty: 1,
        impact: 4,
      },
      {
        id: 'vaccine-schedule',
        name: '예방접종 캘린더',
        description: '광견병, DHPPL, 코로나, 켄넬코프 스케줄 관리',
        icon: '💉',
        priority: 'high',
        status: 'planned',
        phase: 1,
        difficulty: 1,
        impact: 5,
      },
      {
        id: 'weight-tracker',
        name: '체중 그래프',
        description: '체중 변화 추적, 비만/저체중 경고',
        icon: '⚖️',
        priority: 'medium',
        status: 'planned',
        phase: 2,
        difficulty: 1,
        impact: 3,
      },
      {
        id: 'health-checklist',
        name: '건강 체크리스트',
        description: '일일/주간 체크 (식욕, 배변, 활력, 구토 등)',
        icon: '✅',
        priority: 'medium',
        status: 'planned',
        phase: 2,
        difficulty: 1,
        impact: 4,
      },
      {
        id: 'grooming-reminder',
        name: '미용/위생 알림',
        description: '목욕, 발톱, 귀청소, 양치 주기 알림',
        icon: '🛁',
        priority: 'low',
        status: 'planned',
        phase: 2,
        difficulty: 1,
        impact: 3,
      },
    ],
    appReferences: APP_REFERENCES.dog,
  },

  // ==========================================================================
  // 고양이
  // ==========================================================================
  {
    id: 'cat',
    name: '고양이',
    emoji: '🐱',
    color: '#8b5cf6',
    description: '식사, 화장실, 건강관리 등 고양이 돌봄 도우미',
    linkedTest: 'cat',
    careCategories: [
      {
        id: 'daily',
        name: '일상 케어',
        emoji: '☀️',
        items: ['밥주기', '물갈이', '간식', '놀이시간'],
      },
      {
        id: 'health',
        name: '건강 관리',
        emoji: '💊',
        items: ['예방접종', '구충제', '체중 체크', '구토 기록'],
      },
      {
        id: 'hygiene',
        name: '위생 관리',
        emoji: '🧹',
        items: ['화장실 청소', '빗질', '발톱', '스크래처 점검'],
      },
    ],
    features: [
      {
        id: 'litter-log',
        name: '화장실 기록',
        description: '배변 횟수/상태 기록, 건강 이상 감지',
        icon: '🚽',
        priority: 'high',
        status: 'planned',
        phase: 1,
        difficulty: 1,
        impact: 5,
      },
      {
        id: 'feeding-log',
        name: '급여 기록',
        description: '습식/건식 급여량 기록, 음수량 체크',
        icon: '🍖',
        priority: 'high',
        status: 'planned',
        phase: 1,
        difficulty: 1,
        impact: 4,
      },
      {
        id: 'vaccine-schedule',
        name: '예방접종 캘린더',
        description: '범백, 칼리시, 허피스, 광견병 스케줄',
        icon: '💉',
        priority: 'high',
        status: 'planned',
        phase: 1,
        difficulty: 1,
        impact: 5,
      },
      {
        id: 'vomit-log',
        name: '구토/이상행동 로그',
        description: '빈도, 상태 기록, 병원 방문 시 자료',
        icon: '🤮',
        priority: 'medium',
        status: 'planned',
        phase: 2,
        difficulty: 1,
        impact: 4,
      },
      {
        id: 'weight-tracker',
        name: '체중 그래프',
        description: '체중 변화 추적, 비만/저체중 경고',
        icon: '⚖️',
        priority: 'medium',
        status: 'planned',
        phase: 2,
        difficulty: 1,
        impact: 3,
      },
      {
        id: 'scratcher-reminder',
        name: '스크래처/캣타워 점검',
        description: '사용 기간 기반 교체 알림',
        icon: '🐾',
        priority: 'low',
        status: 'planned',
        phase: 3,
        difficulty: 1,
        impact: 2,
      },
    ],
    appReferences: APP_REFERENCES.cat,
  },

  // ==========================================================================
  // 관상어
  // ==========================================================================
  {
    id: 'fish',
    name: '관상어',
    emoji: '🐠',
    color: '#0ea5e9',
    description: '수질 관리, 먹이주기, 어항 유지보수 도우미',
    linkedTest: 'fishType',
    careCategories: [
      {
        id: 'daily',
        name: '일상 케어',
        emoji: '☀️',
        items: ['먹이주기', '상태 확인', '온도 체크'],
      },
      {
        id: 'water',
        name: '수질 관리',
        emoji: '💧',
        items: ['물갈이', 'pH 측정', '암모니아 체크', '여과기 청소'],
      },
      {
        id: 'tank',
        name: '어항 관리',
        emoji: '🏠',
        items: ['조명', '히터', 'CO2', '수초 관리'],
      },
    ],
    features: [
      {
        id: 'water-params',
        name: '수질 파라미터 기록',
        description: 'pH, 암모니아, 아질산염, 질산염, 온도 입력 & 그래프',
        icon: '🧪',
        priority: 'high',
        status: 'planned',
        phase: 1,
        difficulty: 2,
        impact: 5,
      },
      {
        id: 'water-change',
        name: '물갈이 알림',
        description: '어항 크기/어종 기반 주기 계산',
        icon: '💧',
        priority: 'high',
        status: 'planned',
        phase: 1,
        difficulty: 1,
        impact: 5,
      },
      {
        id: 'feeding-timer',
        name: '먹이주기 타이머',
        description: '과급여 방지, 여행 시 먹이 스케줄 공유',
        icon: '🐟',
        priority: 'high',
        status: 'planned',
        phase: 1,
        difficulty: 1,
        impact: 4,
      },
      {
        id: 'fish-compatibility',
        name: '어종 호환성 체크',
        description: '새 물고기 추가 시 기존 어종과 호환성 경고',
        icon: '🔄',
        priority: 'medium',
        status: 'planned',
        phase: 2,
        difficulty: 3,
        impact: 4,
      },
      {
        id: 'tank-log',
        name: '어항 일지',
        description: '물고기 추가/사망, 수초 변경, 장비 교체 기록',
        icon: '📝',
        priority: 'low',
        status: 'planned',
        phase: 2,
        difficulty: 1,
        impact: 3,
      },
      {
        id: 'filter-reminder',
        name: '필터/장비 알림',
        description: '여과기 청소, 히터 점검, 조명 교체 주기',
        icon: '⚙️',
        priority: 'low',
        status: 'planned',
        phase: 3,
        difficulty: 1,
        impact: 3,
      },
    ],
    appReferences: APP_REFERENCES.fish,
  },

  // ==========================================================================
  // 식물
  // ==========================================================================
  {
    id: 'plant',
    name: '식물',
    emoji: '🌱',
    color: '#22c55e',
    description: '물주기, 비료, 분갈이 등 식물 돌봄 도우미',
    linkedTest: 'plant',
    careCategories: [
      {
        id: 'water',
        name: '물주기',
        emoji: '💧',
        items: ['물주기', '분무', '저면관수'],
      },
      {
        id: 'nutrition',
        name: '영양 관리',
        emoji: '🌿',
        items: ['비료', '영양제', '분갈이'],
      },
      {
        id: 'environment',
        name: '환경 관리',
        emoji: '☀️',
        items: ['햇빛', '온도', '습도', '통풍'],
      },
    ],
    features: [
      {
        id: 'water-reminder',
        name: '스마트 물주기 알림',
        description: '식물 종류/계절/환경 반영한 맞춤 알림',
        icon: '💧',
        priority: 'high',
        status: 'planned',
        phase: 1,
        difficulty: 2,
        impact: 5,
      },
      {
        id: 'plant-profile',
        name: '식물 프로필',
        description: '사진, 이름, 입양일, 위치, 화분 크기 등록',
        icon: '🪴',
        priority: 'high',
        status: 'planned',
        phase: 1,
        difficulty: 1,
        impact: 4,
      },
      {
        id: 'fertilizer-schedule',
        name: '비료/분갈이 스케줄',
        description: '계절별 자동 조정, 과비료 방지',
        icon: '🧪',
        priority: 'high',
        status: 'planned',
        phase: 1,
        difficulty: 1,
        impact: 4,
      },
      {
        id: 'light-guide',
        name: '조도 가이드',
        description: '카메라 기반 빛 측정, 위치 추천',
        icon: '☀️',
        priority: 'medium',
        status: 'planned',
        phase: 2,
        difficulty: 3,
        impact: 3,
      },
      {
        id: 'growth-diary',
        name: '성장 일기',
        description: '사진 타임라인, 성장 기록',
        icon: '📸',
        priority: 'medium',
        status: 'planned',
        phase: 2,
        difficulty: 1,
        impact: 4,
      },
      {
        id: 'plant-diagnosis',
        name: '식물 건강 진단',
        description: '잎 상태 사진으로 문제 진단 (향후 AI 연동)',
        icon: '🔍',
        priority: 'low',
        status: 'planned',
        phase: 3,
        difficulty: 3,
        impact: 5,
      },
    ],
    appReferences: APP_REFERENCES.plant,
  },

  // ==========================================================================
  // 햄스터
  // ==========================================================================
  {
    id: 'hamster',
    name: '햄스터',
    emoji: '🐹',
    color: '#f97316',
    description: '케이지 관리, 먹이, 건강 체크 도우미',
    linkedTest: 'hamster',
    careCategories: [
      {
        id: 'daily',
        name: '일상 케어',
        emoji: '☀️',
        items: ['먹이', '물갈이', '간식', '놀이'],
      },
      {
        id: 'cage',
        name: '케이지 관리',
        emoji: '🏠',
        items: ['베딩 교체', '청소', '쳇바퀴 점검'],
      },
      {
        id: 'health',
        name: '건강 관리',
        emoji: '💊',
        items: ['체중 체크', '발톱', '이빨 점검'],
      },
    ],
    features: [
      {
        id: 'cage-cleaning',
        name: '케이지 청소 알림',
        description: '베딩 교체, 전체 청소 주기 알림',
        icon: '🧹',
        priority: 'high',
        status: 'planned',
        phase: 1,
        difficulty: 1,
        impact: 5,
      },
      {
        id: 'feeding-log',
        name: '급여 기록',
        description: '먹이/간식 급여량, 볼주머니 체크',
        icon: '🥜',
        priority: 'high',
        status: 'planned',
        phase: 1,
        difficulty: 1,
        impact: 4,
      },
      {
        id: 'weight-tracker',
        name: '체중 추적',
        description: '작은 변화도 중요! 그램 단위 기록',
        icon: '⚖️',
        priority: 'medium',
        status: 'planned',
        phase: 2,
        difficulty: 1,
        impact: 4,
      },
      {
        id: 'activity-log',
        name: '활동 기록',
        description: '쳇바퀴 사용, 활동량 체크',
        icon: '🎡',
        priority: 'low',
        status: 'planned',
        phase: 2,
        difficulty: 2,
        impact: 3,
      },
      {
        id: 'lifespan-care',
        name: '수명별 케어 가이드',
        description: '연령대별 맞춤 케어 팁 (평균 수명 2-3년)',
        icon: '📖',
        priority: 'low',
        status: 'planned',
        phase: 3,
        difficulty: 1,
        impact: 3,
      },
    ],
    appReferences: APP_REFERENCES.hamster,
  },

  // ==========================================================================
  // 토끼
  // ==========================================================================
  {
    id: 'rabbit',
    name: '토끼',
    emoji: '🐰',
    color: '#ec4899',
    description: '건초, 케이지, 건강관리 등 토끼 돌봄 도우미',
    linkedTest: 'rabbit',
    careCategories: [
      {
        id: 'daily',
        name: '일상 케어',
        emoji: '☀️',
        items: ['건초 보충', '펠렛', '물갈이', '채소'],
      },
      {
        id: 'cage',
        name: '케이지 관리',
        emoji: '🏠',
        items: ['베딩 교체', '청소', '놀이 공간'],
      },
      {
        id: 'health',
        name: '건강 관리',
        emoji: '💊',
        items: ['체중', '발톱', '이빨 점검', '배변 체크'],
      },
    ],
    features: [
      {
        id: 'hay-reminder',
        name: '건초 보충 알림',
        description: '건초는 24시간 무제한! 보충 체크',
        icon: '🌾',
        priority: 'high',
        status: 'planned',
        phase: 1,
        difficulty: 1,
        impact: 5,
      },
      {
        id: 'cage-cleaning',
        name: '케이지 청소 알림',
        description: '배변판 청소, 전체 청소 주기',
        icon: '🧹',
        priority: 'high',
        status: 'planned',
        phase: 1,
        difficulty: 1,
        impact: 5,
      },
      {
        id: 'poop-log',
        name: '배변 기록',
        description: '토끼 건강의 바로미터! 모양/양 체크',
        icon: '💩',
        priority: 'high',
        status: 'planned',
        phase: 1,
        difficulty: 1,
        impact: 5,
      },
      {
        id: 'nail-reminder',
        name: '발톱 관리 알림',
        description: '4-6주 주기 발톱 깎기 알림',
        icon: '✂️',
        priority: 'medium',
        status: 'planned',
        phase: 2,
        difficulty: 1,
        impact: 3,
      },
      {
        id: 'weight-tracker',
        name: '체중 추적',
        description: '비만 주의! 체중 변화 그래프',
        icon: '⚖️',
        priority: 'medium',
        status: 'planned',
        phase: 2,
        difficulty: 1,
        impact: 4,
      },
      {
        id: 'veggie-guide',
        name: '채소 가이드',
        description: '급여 가능/불가 채소 목록, 적정량 안내',
        icon: '🥬',
        priority: 'low',
        status: 'planned',
        phase: 3,
        difficulty: 1,
        impact: 3,
      },
    ],
    appReferences: APP_REFERENCES.rabbit,
  },
];

// ============================================================================
// 로드맵
// ============================================================================

export const CARE_ROADMAP: RoadmapPhase[] = [
  {
    phase: 1,
    title: 'MVP - 기본 케어 알림',
    description: '핵심 케어 기능의 알림 시스템 구축',
    features: [
      '반려동물/식물 프로필 등록',
      '기본 알림 설정 (먹이, 청소, 물주기 등)',
      '알림 히스토리 & 완료 체크',
      '테스트 결과 연동 (맞춤 케어 팁)',
    ],
    targets: ['dog', 'cat', 'plant'],
  },
  {
    phase: 2,
    title: '확장 - 기록 & 추적',
    description: '건강 기록과 데이터 시각화',
    features: [
      '체중/건강 지표 그래프',
      '사진 타임라인 (성장 일기)',
      '증상/이상행동 로그',
      '수질 파라미터 추적 (어항)',
    ],
    targets: ['dog', 'cat', 'fish', 'plant', 'hamster', 'rabbit'],
  },
  {
    phase: 3,
    title: '고도화 - 스마트 기능',
    description: 'AI 기반 분석과 커뮤니티 연동',
    features: [
      'AI 건강 진단 (사진 분석)',
      '어종/식물 호환성 체크',
      '케어 팁 커뮤니티 연동',
      '수의사/전문가 상담 연결 (외부 연동)',
    ],
    targets: ['dog', 'cat', 'fish', 'plant'],
  },
];

// ============================================================================
// 데이터 구조 (구현 시 사용)
// ============================================================================

export const DATA_STRUCTURE = {
  petProfile: `
interface PetProfile {
  id: string;
  userId: string;
  type: CareTarget;
  name: string;
  photo?: string;
  birthDate?: string;
  adoptedDate?: string;
  breed?: string;        // 품종
  weight?: number;       // 체중 (g 또는 kg)
  testResult?: string;   // 연동된 테스트 결과
  notes?: string;
  createdAt: string;
  updatedAt: string;
}`,
  careSchedule: `
interface CareSchedule {
  id: string;
  petId: string;
  type: string;          // 'feeding' | 'cleaning' | 'vaccine' | 'grooming' | ...
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  customDays?: number;   // custom일 때 N일마다
  time?: string;         // 알림 시간 (HH:mm)
  lastCompleted?: string;
  nextDue: string;
  enabled: boolean;
}`,
  careLog: `
interface CareLog {
  id: string;
  petId: string;
  scheduleId?: string;
  type: string;
  completedAt: string;
  notes?: string;
  photo?: string;
  data?: Record<string, any>;  // 체중, 수질 파라미터 등 추가 데이터
}`,
};

// ============================================================================
// UI 연동 전략
// ============================================================================

export const UI_INTEGRATION = {
  navigation: {
    description: '사이드바/하단 네비게이션에 "케어" 탭 추가',
    location: 'home과 explore 사이 또는 profile 옆',
    icon: 'Heart 또는 PawPrint',
  },
  testConnection: {
    description: '테스트 완료 후 "내 반려동물 등록" 유도',
    flow: '테스트 결과 → 케어 팁 표시 → 프로필 등록 CTA',
  },
  dashboard: {
    description: '오늘의 할 일 모아보기',
    features: ['오늘 해야 할 케어 목록', '완료 체크', '밀린 알림 표시'],
  },
};
