// ============================================================================
// 공유 기능 전략 데이터
// ============================================================================

export type TaskStatus = 'done' | 'in_progress' | 'planned' | 'blocked';
export type Priority = 'high' | 'medium' | 'low';

// ============================================================================
// 공유 기능 로드맵
// ============================================================================

export interface ShareTask {
  id: string;
  task: string;
  status: TaskStatus;
  priority: Priority;
  description: string;
  owner: 'ai' | 'user' | 'both';
  blockedBy?: string;
}

export interface SharePhase {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  tasks: ShareTask[];
}

export const SHARE_ROADMAP: SharePhase[] = [
  {
    id: 'phase-0',
    name: '기존 완료',
    description: '이미 구현된 기능',
    status: 'done',
    tasks: [
      {
        id: 'share-card',
        task: 'ShareCard 컴포넌트',
        status: 'done',
        priority: 'high',
        description: 'Canvas 기반 결과 카드 이미지 생성 (540x720px)',
        owner: 'ai',
      },
      {
        id: 'image-download',
        task: '이미지 다운로드',
        status: 'done',
        priority: 'high',
        description: 'PNG 파일로 결과 카드 다운로드',
        owner: 'ai',
      },
      {
        id: 'link-copy',
        task: '링크 복사',
        status: 'done',
        priority: 'high',
        description: '클립보드에 링크 복사 기능',
        owner: 'ai',
      },
      {
        id: 'web-share',
        task: 'Web Share API',
        status: 'done',
        priority: 'medium',
        description: '모바일 네이티브 공유 (카카오톡 제외)',
        owner: 'ai',
      },
      {
        id: 'kakao-service',
        task: 'KakaoShareService',
        status: 'done',
        priority: 'high',
        description: '카카오 SDK 서비스 코드 작성 (앱 키만 필요)',
        owner: 'ai',
      },
      {
        id: 'og-meta',
        task: 'OG 메타태그',
        status: 'done',
        priority: 'high',
        description: 'layout.tsx에 기본 OG 메타태그 추가',
        owner: 'ai',
      },
    ],
  },
  {
    id: 'phase-1',
    name: 'Phase 1: 카카오톡 공유',
    description: '한국 시장 핵심 - 카카오톡 원클릭 공유',
    status: 'planned',
    tasks: [
      {
        id: 'kakao-app',
        task: '카카오 앱 등록',
        status: 'planned',
        priority: 'high',
        description: 'developers.kakao.com에서 앱 생성, 도메인 등록',
        owner: 'user',
      },
      {
        id: 'kakao-key',
        task: '환경변수 설정',
        status: 'blocked',
        priority: 'high',
        description: 'NEXT_PUBLIC_KAKAO_APP_KEY를 .env.local에 추가',
        owner: 'user',
        blockedBy: 'kakao-app',
      },
      {
        id: 'og-image-static',
        task: '기본 OG 이미지 제작',
        status: 'planned',
        priority: 'high',
        description: 'public/og-image.png (1200x630) - 브랜드 로고 + 설명',
        owner: 'user',
      },
    ],
  },
  {
    id: 'phase-2',
    name: 'Phase 2: 동적 OG 이미지',
    description: 'Vercel OG로 테스트별 맞춤 이미지 생성',
    status: 'done',
    tasks: [
      {
        id: 'og-api',
        task: 'Vercel OG API 구현',
        status: 'done',
        priority: 'high',
        description: '/api/og - 테스트 결과별 동적 이미지 (type=result)',
        owner: 'ai',
      },
      {
        id: 'og-multi-ratio',
        task: '멀티 비율 지원',
        status: 'done',
        priority: 'medium',
        description: 'default(1200x630), story(1080x1920), square(1080x1080), kakao(800x400)',
        owner: 'ai',
      },
      {
        id: 'og-vs-poll',
        task: 'VS 투표 공유 카드',
        status: 'planned',
        priority: 'medium',
        description: '/api/og?type=poll - 투표 결과 이미지',
        owner: 'ai',
      },
    ],
  },
  {
    id: 'phase-3',
    name: 'Phase 3: 추적 & 분석',
    description: '공유 효과 측정',
    status: 'in_progress',
    tasks: [
      {
        id: 'utm-util',
        task: 'UTM 유틸리티',
        status: 'done',
        priority: 'medium',
        description: '@/utils/utm - generateShareUrl, parseAndStoreUTM 등',
        owner: 'ai',
      },
      {
        id: 'share-tracking',
        task: '공유 추적 서비스',
        status: 'done',
        priority: 'medium',
        description: 'AnalyticsService.trackShareClick() 구현됨',
        owner: 'ai',
      },
      {
        id: 'conversion-tracking',
        task: '전환 추적',
        status: 'planned',
        priority: 'low',
        description: '공유 → 유입 → 테스트 완료 퍼널 추적',
        owner: 'ai',
      },
    ],
  },
];

// ============================================================================
// 플랫폼별 공유 전략
// ============================================================================

export interface PlatformStrategy {
  platform: string;
  icon: string;
  priority: number;
  targetAudience: string;
  contentFormat: string;
  bestTime: string;
  shareMethod: 'sdk' | 'link' | 'image' | 'manual';
  implemented: boolean;
  notes: string;
}

export const PLATFORM_STRATEGIES: PlatformStrategy[] = [
  {
    platform: '카카오톡',
    icon: '💬',
    priority: 1,
    targetAudience: '한국 전 연령층',
    contentFormat: '피드 공유 (이미지 + 버튼)',
    bestTime: '점심/저녁 시간',
    shareMethod: 'sdk',
    implemented: false,
    notes: '앱 키 발급 필요, 원클릭 공유 가능',
  },
  {
    platform: '인스타그램',
    icon: '📸',
    priority: 2,
    targetAudience: 'MZ 세대, 반려인',
    contentFormat: '스토리 (9:16), 피드 (1:1)',
    bestTime: '저녁 7-9시',
    shareMethod: 'image',
    implemented: true,
    notes: '이미지 다운로드 → 수동 업로드',
  },
  {
    platform: '틱톡',
    icon: '🎵',
    priority: 3,
    targetAudience: 'Z세대',
    contentFormat: '세로 영상 (9:16)',
    bestTime: '저녁 6-10시',
    shareMethod: 'manual',
    implemented: false,
    notes: '향후 Share Kit API 검토',
  },
  {
    platform: '페이스북',
    icon: '👥',
    priority: 4,
    targetAudience: '30-40대',
    contentFormat: '링크 공유 (OG 이미지)',
    bestTime: '오후 1-3시',
    shareMethod: 'link',
    implemented: true,
    notes: 'OG 이미지로 미리보기',
  },
];

// ============================================================================
// 이미지 비율 스펙
// ============================================================================

export interface ImageRatioSpec {
  name: string;
  ratio: string;
  width: number;
  height: number;
  param: string;
  usage: string;
  implemented: boolean;
}

export const IMAGE_RATIO_SPECS: ImageRatioSpec[] = [
  {
    name: 'OG 기본',
    ratio: '1.91:1',
    width: 1200,
    height: 630,
    param: 'default',
    usage: '링크 미리보기 (페이스북, 트위터, 카카오)',
    implemented: false,
  },
  {
    name: '세로 (스토리)',
    ratio: '9:16',
    width: 1080,
    height: 1920,
    param: 'story',
    usage: '인스타/틱톡 스토리',
    implemented: false,
  },
  {
    name: '정사각',
    ratio: '1:1',
    width: 1080,
    height: 1080,
    param: 'square',
    usage: '인스타 피드',
    implemented: false,
  },
  {
    name: '카카오',
    ratio: '2:1',
    width: 800,
    height: 400,
    param: 'kakao',
    usage: '카카오톡 피드',
    implemented: false,
  },
  {
    name: '현재 ShareCard',
    ratio: '3:4',
    width: 540,
    height: 720,
    param: 'current',
    usage: '현재 구현된 Canvas 카드',
    implemented: true,
  },
];

// ============================================================================
// 바이럴 효과 예상
// ============================================================================

export interface ViralImpact {
  feature: string;
  currentState: string;
  afterImplement: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
}

export const VIRAL_IMPACT_ANALYSIS: ViralImpact[] = [
  {
    feature: '카카오톡 공유',
    currentState: '링크 복사 후 수동 붙여넣기',
    afterImplement: '원클릭으로 피드 공유 + 버튼',
    impact: 'high',
    effort: 'low',
  },
  {
    feature: 'OG 이미지',
    currentState: '링크만 표시, 미리보기 없음',
    afterImplement: '결과 카드가 미리보기에 표시',
    impact: 'high',
    effort: 'medium',
  },
  {
    feature: 'UTM 추적',
    currentState: '유입 경로 파악 불가',
    afterImplement: '어디서 왔는지 측정 가능',
    impact: 'medium',
    effort: 'low',
  },
  {
    feature: '세로 이미지 (스토리)',
    currentState: '가로 이미지만 (잘림)',
    afterImplement: '스토리에 최적화된 풀스크린',
    impact: 'medium',
    effort: 'medium',
  },
];

// ============================================================================
// 3초 훅 원칙
// ============================================================================

export interface HookPrinciple {
  position: string;
  percent: string;
  content: string;
  example: string;
}

export const THREE_SECOND_HOOK: HookPrinciple[] = [
  {
    position: '상단',
    percent: '20%',
    content: '훅: 이모지 + 결과 이름',
    example: '🐕 골든리트리버',
  },
  {
    position: '중앙',
    percent: '50%',
    content: '핵심: 한 줄 설명 + 점수',
    example: '활발하고 친근한 당신!',
  },
  {
    position: '하단',
    percent: '30%',
    content: 'CTA: 행동 유도',
    example: '나도 테스트하기 →',
  },
];

// ============================================================================
// 통합 Export
// ============================================================================

export const SHARE_STRATEGY = {
  roadmap: SHARE_ROADMAP,
  platforms: PLATFORM_STRATEGIES,
  imageSpecs: IMAGE_RATIO_SPECS,
  viralImpact: VIRAL_IMPACT_ANALYSIS,
  hookPrinciple: THREE_SECOND_HOOK,
};

export default SHARE_STRATEGY;
