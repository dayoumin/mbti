// ============================================================================
// 아이디어 뱅크 - 타입 정의
// ============================================================================

export type ContentCategory =
  | 'worldcup'        // 이상형 월드컵
  | 'tier-vote'       // 티어 리스트 투표
  | 'balance-game'    // 밸런스 게임 (VS)
  | 'mbti-test'       // MBTI/성향 테스트
  | 'quiz'            // OX/4지선다 퀴즈
  | 'checklist'       // 나만 모르는 체크리스트
  | 'recommend'       // 추천 시스템
  | 'other';          // 기타

export type IdeaStatus =
  | 'idea'            // 📝 아이디어 단계
  | 'review'          // 🔍 검토/평가 중
  | 'planning'        // 🎨 기획 중
  | 'ready'           // ✅ 구현 준비됨
  | 'in-progress'     // 🚧 진행 중
  | 'completed'       // ✨ 완료
  | 'paused';         // ⏸️ 보류

// 파이프라인 순서 (칸반 보드용)
export const PIPELINE_ORDER: IdeaStatus[] = [
  'idea',
  'review',
  'planning',
  'ready',
  'in-progress',
  'completed',
  'paused',
];

export type ViralPotential = 'very-high' | 'high' | 'medium' | 'low';

export type Priority = 'high' | 'medium' | 'low';

export type Difficulty = 1 | 2 | 3;

// ============================================================================
// 콘텐츠 아이디어
// ============================================================================

export interface ContentIdea {
  id: string;
  category: ContentCategory;
  title: string;
  description: string;
  status: IdeaStatus;
  viral: {
    potential: ViralPotential;
    reasons: string[];
  };
  implementation: {
    difficulty: Difficulty;
    estimatedTime: string;
    dependencies: string[];
  };
  strategy?: {
    phase?: string;
    priority?: Priority;
    notes?: string[];
  };
  examples?: string[];
  relatedFile?: string;
  addedAt: string;
  updatedAt?: string;
}

// ============================================================================
// 테마 정의
// ============================================================================

export interface ThemeMeta {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  targetAudience: string;
  estimatedData: {
    min: number;
    max: number;
    current: number;
  };
}

export interface Theme extends ThemeMeta {
  ideas: ContentIdea[];
}

// ============================================================================
// JSON 파일용 (ideas 배열만)
// ============================================================================

export interface ThemeJson {
  meta: ThemeMeta;
  ideas: ContentIdea[];
}

// ============================================================================
// 상태별 이모지
// ============================================================================

export const STATUS_EMOJI: Record<IdeaStatus, string> = {
  'idea': '📝',
  'review': '🔍',
  'planning': '🎨',
  'ready': '✅',
  'in-progress': '🚧',
  'completed': '✨',
  'paused': '⏸️',
};

export const STATUS_LABEL: Record<IdeaStatus, string> = {
  'idea': '아이디어',
  'review': '검토 중',
  'planning': '기획 중',
  'ready': '준비됨',
  'in-progress': '진행 중',
  'completed': '완료',
  'paused': '보류',
};

export const STATUS_COLOR: Record<IdeaStatus, string> = {
  'idea': 'bg-gray-100 text-gray-700',
  'review': 'bg-blue-100 text-blue-700',
  'planning': 'bg-purple-100 text-purple-700',
  'ready': 'bg-green-100 text-green-700',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  'completed': 'bg-emerald-100 text-emerald-700',
  'paused': 'bg-orange-100 text-orange-700',
};

export const CATEGORY_LABEL: Record<ContentCategory, string> = {
  'worldcup': '월드컵',
  'tier-vote': '티어 투표',
  'balance-game': '밸런스 게임',
  'mbti-test': 'MBTI 테스트',
  'quiz': '퀴즈',
  'checklist': '체크리스트',
  'recommend': '추천',
  'other': '기타',
};

export const VIRAL_LABEL: Record<ViralPotential, { label: string; color: string }> = {
  'very-high': { label: '🔥 매우 높음', color: 'text-red-600' },
  'high': { label: '⬆️ 높음', color: 'text-orange-500' },
  'medium': { label: '➡️ 보통', color: 'text-yellow-600' },
  'low': { label: '⬇️ 낮음', color: 'text-gray-500' },
};
