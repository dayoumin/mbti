// ============================================================================
// 케어 시스템 타입 정의
// ============================================================================

// 케어 대상 타입
export type CareTargetType = 'plant' | 'dog' | 'cat' | 'fish' | 'hamster' | 'rabbit';

// ============================================================================
// 케어 대상 설정
// ============================================================================

export interface CareTargetConfig {
  key: CareTargetType;
  name: string;
  emoji: string;
  color: string;          // Tailwind 색상 클래스 (bg-xxx-100)
  accentColor: string;    // 강조 색상 (bg-xxx-500)
}

export const CARE_TARGET_CONFIG: Record<CareTargetType, CareTargetConfig> = {
  plant: { key: 'plant', name: '식물', emoji: '🌱', color: 'bg-green-100', accentColor: 'bg-green-500' },
  dog: { key: 'dog', name: '강아지', emoji: '🐕', color: 'bg-amber-100', accentColor: 'bg-amber-500' },
  cat: { key: 'cat', name: '고양이', emoji: '🐈', color: 'bg-purple-100', accentColor: 'bg-purple-500' },
  fish: { key: 'fish', name: '관상어', emoji: '🐠', color: 'bg-blue-100', accentColor: 'bg-blue-500' },
  hamster: { key: 'hamster', name: '햄스터', emoji: '🐹', color: 'bg-orange-100', accentColor: 'bg-orange-500' },
  rabbit: { key: 'rabbit', name: '토끼', emoji: '🐰', color: 'bg-pink-100', accentColor: 'bg-pink-500' },
};

// ============================================================================
// 프로필
// ============================================================================

export interface CareProfile {
  id: string;
  type: CareTargetType;
  name: string;
  photo?: string;
  createdAt: string;
  updatedAt: string;
  // 테스트 결과 연동
  testResult?: {
    resultKey: string;
    resultEmoji: string;
    completedAt: string;
  };
}

// 식물 프로필
export interface PlantProfile extends CareProfile {
  type: 'plant';
  species?: string;           // 식물 종류 (몬스테라, 고무나무 등)
  location?: string;          // 위치 (거실, 베란다 등)
  potSize?: 'small' | 'medium' | 'large';
  adoptedDate?: string;       // 입양일
  notes?: string;
}

// 강아지 프로필
export interface DogProfile extends CareProfile {
  type: 'dog';
  breed?: string;             // 견종
  birthDate?: string;         // 생년월일
  weight?: number;            // 체중 (kg)
  gender?: 'male' | 'female';
  neutered?: boolean;         // 중성화 여부
  notes?: string;
}

// 고양이 프로필
export interface CatProfile extends CareProfile {
  type: 'cat';
  breed?: string;             // 묘종
  birthDate?: string;
  weight?: number;
  gender?: 'male' | 'female';
  neutered?: boolean;
  indoor?: boolean;           // 실내/실외
  notes?: string;
}

// 관상어 프로필
export interface FishProfile extends CareProfile {
  type: 'fish';
  species?: string;           // 어종
  tankSize?: number;          // 수조 크기 (리터)
  tankType?: 'freshwater' | 'saltwater';
  notes?: string;
}

// 햄스터 프로필
export interface HamsterProfile extends CareProfile {
  type: 'hamster';
  breed?: string;             // 품종
  birthDate?: string;
  gender?: 'male' | 'female';
  notes?: string;
}

// 토끼 프로필
export interface RabbitProfile extends CareProfile {
  type: 'rabbit';
  breed?: string;             // 품종
  birthDate?: string;
  weight?: number;
  gender?: 'male' | 'female';
  neutered?: boolean;
  notes?: string;
}

// 유니온 타입
export type AnyCareProfile = PlantProfile | DogProfile | CatProfile | FishProfile | HamsterProfile | RabbitProfile;

// ============================================================================
// 케어 스케줄
// ============================================================================

export type CareFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';

export interface CareSchedule {
  id: string;
  profileId: string;
  type: string;               // 'water' | 'fertilize' | 'repot' | 'mist' | 'prune' 등
  name: string;
  emoji: string;
  frequency: CareFrequency;
  customDays?: number;        // custom일 때 N일마다
  enabled: boolean;
  lastCompleted?: string;     // ISO date
  nextDue: string;            // ISO date
  createdAt: string;
}

// ============================================================================
// 케어 기록
// ============================================================================

export interface CareLog {
  id: string;
  profileId: string;
  scheduleId?: string;
  type: string;
  completedAt: string;
  notes?: string;
  photo?: string;
  // 추가 데이터 (체중, 수질 등)
  data?: Record<string, unknown>;
}

// ============================================================================
// 식물 케어 타입
// ============================================================================

export type PlantCareType = 'water' | 'fertilize' | 'repot' | 'mist' | 'prune' | 'rotate';

export const PLANT_CARE_TYPES: Record<PlantCareType, { name: string; emoji: string; defaultDays: number }> = {
  water: { name: '물주기', emoji: '💧', defaultDays: 7 },
  fertilize: { name: '비료주기', emoji: '🧪', defaultDays: 30 },
  repot: { name: '분갈이', emoji: '🪴', defaultDays: 365 },
  mist: { name: '분무', emoji: '💨', defaultDays: 3 },
  prune: { name: '가지치기', emoji: '✂️', defaultDays: 90 },
  rotate: { name: '회전', emoji: '🔄', defaultDays: 7 },
};

// ============================================================================
// 강아지 케어 타입
// ============================================================================

export type DogCareType = 'feed' | 'walk' | 'bath' | 'groom' | 'medicine' | 'vet';

export const DOG_CARE_TYPES: Record<DogCareType, { name: string; emoji: string; defaultDays: number }> = {
  feed: { name: '밥주기', emoji: '🍖', defaultDays: 1 },
  walk: { name: '산책', emoji: '🦮', defaultDays: 1 },
  bath: { name: '목욕', emoji: '🛁', defaultDays: 14 },
  groom: { name: '미용', emoji: '✂️', defaultDays: 30 },
  medicine: { name: '약 먹이기', emoji: '💊', defaultDays: 30 },
  vet: { name: '병원 방문', emoji: '🏥', defaultDays: 180 },
};

// ============================================================================
// 고양이 케어 타입
// ============================================================================

export type CatCareType = 'feed' | 'litter' | 'brush' | 'play' | 'medicine' | 'vet';

export const CAT_CARE_TYPES: Record<CatCareType, { name: string; emoji: string; defaultDays: number }> = {
  feed: { name: '밥주기', emoji: '🐟', defaultDays: 1 },
  litter: { name: '화장실 청소', emoji: '🧹', defaultDays: 1 },
  brush: { name: '빗질', emoji: '🪮', defaultDays: 3 },
  play: { name: '놀아주기', emoji: '🪶', defaultDays: 1 },
  medicine: { name: '약 먹이기', emoji: '💊', defaultDays: 30 },
  vet: { name: '병원 방문', emoji: '🏥', defaultDays: 180 },
};

// ============================================================================
// 관상어 케어 타입
// ============================================================================

export type FishCareType = 'feed' | 'waterChange' | 'waterTest' | 'cleanFilter' | 'cleanTank';

export const FISH_CARE_TYPES: Record<FishCareType, { name: string; emoji: string; defaultDays: number }> = {
  feed: { name: '밥주기', emoji: '🦐', defaultDays: 1 },
  waterChange: { name: '물갈이', emoji: '💧', defaultDays: 7 },
  waterTest: { name: '수질 체크', emoji: '🧪', defaultDays: 7 },
  cleanFilter: { name: '필터 청소', emoji: '🔧', defaultDays: 30 },
  cleanTank: { name: '수조 청소', emoji: '🧽', defaultDays: 30 },
};

// ============================================================================
// 햄스터 케어 타입
// ============================================================================

export type HamsterCareType = 'feed' | 'water' | 'cleanCage' | 'changeBedding' | 'play';

export const HAMSTER_CARE_TYPES: Record<HamsterCareType, { name: string; emoji: string; defaultDays: number }> = {
  feed: { name: '밥주기', emoji: '🌻', defaultDays: 1 },
  water: { name: '물 갈기', emoji: '💧', defaultDays: 1 },
  cleanCage: { name: '케이지 청소', emoji: '🧹', defaultDays: 7 },
  changeBedding: { name: '베딩 교체', emoji: '🛏️', defaultDays: 7 },
  play: { name: '놀아주기', emoji: '🎡', defaultDays: 1 },
};

// ============================================================================
// 토끼 케어 타입
// ============================================================================

export type RabbitCareType = 'feed' | 'hay' | 'water' | 'cleanCage' | 'groom' | 'nailTrim';

export const RABBIT_CARE_TYPES: Record<RabbitCareType, { name: string; emoji: string; defaultDays: number }> = {
  feed: { name: '밥주기', emoji: '🥕', defaultDays: 1 },
  hay: { name: '건초 보충', emoji: '🌾', defaultDays: 1 },
  water: { name: '물 갈기', emoji: '💧', defaultDays: 1 },
  cleanCage: { name: '케이지 청소', emoji: '🧹', defaultDays: 7 },
  groom: { name: '빗질', emoji: '🪮', defaultDays: 3 },
  nailTrim: { name: '발톱 깎기', emoji: '✂️', defaultDays: 30 },
};

// ============================================================================
// 통합 케어 타입
// ============================================================================

export type AnyCareType = PlantCareType | DogCareType | CatCareType | FishCareType | HamsterCareType | RabbitCareType;

export interface CareTypeInfo {
  name: string;
  emoji: string;
  defaultDays: number;
}

// 대상 타입별 케어 타입 정보 가져오기
export function getCareTypesForTarget(targetType: CareTargetType): Record<string, CareTypeInfo> {
  switch (targetType) {
    case 'plant': return PLANT_CARE_TYPES;
    case 'dog': return DOG_CARE_TYPES;
    case 'cat': return CAT_CARE_TYPES;
    case 'fish': return FISH_CARE_TYPES;
    case 'hamster': return HAMSTER_CARE_TYPES;
    case 'rabbit': return RABBIT_CARE_TYPES;
    default: return {};
  }
}

// 케어 타입 기본 스케줄 (대상 등록 시 자동 생성)
export function getDefaultCareTypesForTarget(targetType: CareTargetType): string[] {
  switch (targetType) {
    case 'plant': return ['water'];
    case 'dog': return ['feed', 'walk'];
    case 'cat': return ['feed', 'litter'];
    case 'fish': return ['feed'];
    case 'hamster': return ['feed', 'water'];
    case 'rabbit': return ['feed', 'hay'];
    default: return [];
  }
}

// ============================================================================
// 케어 통계
// ============================================================================

export interface CareStats {
  totalProfiles: number;
  totalLogs: number;
  streak: number;             // 연속 케어 일수
  lastCareDate?: string;
  careByType: Record<string, number>;
  profilesByTarget: Record<CareTargetType, number>;
}
