// ============================================================================
// 마케팅 전략 데이터
// ============================================================================

export interface MarketingChannel {
  id: string;
  name: string;
  icon: string;
  type: 'organic' | 'paid' | 'viral';
  priority: 'critical' | 'high' | 'medium' | 'low';
  effort: 1 | 2 | 3 | 4 | 5;
  reach: 1 | 2 | 3 | 4 | 5;
  cost: 'free' | 'low' | 'medium' | 'high';
  description: string;
  tactics: ChannelTactic[];
  metrics: string[];
  bestPractices: string[];
  risks?: string[];
}

export interface ChannelTactic {
  id: string;
  name: string;
  description: string;
  frequency: string;
  contentIdeas?: string[];
  tools?: string[];
}

export interface ContentPillar {
  id: string;
  name: string;
  description: string;
  ratio: number;  // 전체 콘텐츠 중 비율 (%)
  examples: string[];
  channels: string[];  // 적합한 채널
}

export interface MarketingPhase {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  goal: string;
  budget: string;
  activities: MarketingActivity[];
}

export interface MarketingActivity {
  id: string;
  name: string;
  channel: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'done' | 'in-progress' | 'planned';
}

// ============================================================================
// 마케팅 원칙
// ============================================================================

export const MARKETING_PRINCIPLES = [
  {
    id: 'product-led',
    title: '제품 주도 성장 (PLG)',
    description: '광고보다 제품 자체가 마케팅 도구가 되도록',
    icon: '🚀',
    details: [
      '공유하고 싶은 결과 카드 디자인',
      '친구 비교 기능으로 자연스러운 초대',
      '바이럴 루프: 공유 → 유입 → 테스트 → 비교 → 재공유',
    ],
  },
  {
    id: 'content-first',
    title: '콘텐츠 우선',
    description: '꾸준한 콘텐츠가 유기적 유입의 핵심',
    icon: '📝',
    details: [
      '유튜브/틱톡/인스타 꾸준한 업로드',
      '검색 유입을 위한 SEO 콘텐츠',
      '공유 가능한 인포그래픽/카드뉴스',
    ],
  },
  {
    id: 'community-leverage',
    title: '커뮤니티 활용',
    description: '기존 커뮤니티에서 자연스럽게 확산',
    icon: '🏘️',
    details: [
      'MBTI/성격 관련 커뮤니티 참여',
      '사용자가 자발적으로 공유하도록 유도',
      '인플루언서/크리에이터 협업',
    ],
  },
  {
    id: 'data-driven',
    title: '데이터 기반 의사결정',
    description: '감이 아닌 숫자로 판단',
    icon: '📊',
    details: [
      'UTM 파라미터로 유입 채널 추적',
      'A/B 테스트로 메시지 최적화',
      '전환 퍼널 분석',
    ],
  },
];

// ============================================================================
// 콘텐츠 필러 (콘텐츠 유형별 비율)
// ============================================================================

export const CONTENT_PILLARS: ContentPillar[] = [
  {
    id: 'entertainment',
    name: '재미/흥미',
    description: '공유하고 싶은 가벼운 콘텐츠',
    ratio: 40,
    examples: [
      '유형별 짤/밈 (예: "INFP가 화났을 때")',
      '유형별 VS 투표 결과',
      '재미있는 퀴즈 결과',
      '유형별 썰/에피소드',
    ],
    channels: ['instagram', 'tiktok', 'youtube-shorts'],
  },
  {
    id: 'education',
    name: '정보/교육',
    description: '가치 있는 인사이트 제공',
    ratio: 30,
    examples: [
      '유형별 특징 깊이 파기',
      '궁합/관계 팁',
      '성격 심리학 상식',
      '유형별 자기계발 팁',
    ],
    channels: ['youtube', 'blog', 'instagram-carousel'],
  },
  {
    id: 'product',
    name: '제품/기능',
    description: '새 기능, 테스트 소개',
    ratio: 20,
    examples: [
      '새 테스트 출시 알림',
      '기능 업데이트 안내',
      '테스트 미리보기/튜토리얼',
      '사용자 후기/결과 하이라이트',
    ],
    channels: ['all'],
  },
  {
    id: 'community',
    name: '커뮤니티/참여',
    description: '사용자 참여 유도',
    ratio: 10,
    examples: [
      '이벤트/챌린지 안내',
      '사용자 콘텐츠 리포스트',
      '투표/설문 결과 공유',
      'Q&A 세션',
    ],
    channels: ['instagram-story', 'twitter'],
  },
];

// ============================================================================
// 채널별 전략
// ============================================================================

export const MARKETING_CHANNELS: MarketingChannel[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    type: 'organic',
    priority: 'critical',
    effort: 4,
    reach: 5,
    cost: 'free',
    description: '비주얼 콘텐츠 + 스토리/릴스로 MZ세대 공략',
    tactics: [
      {
        id: 'feed',
        name: '피드 포스트',
        description: '결과 카드, 유형별 인포그래픽',
        frequency: '주 3-4회',
        contentIdeas: [
          '유형별 특징 카드 (캐러셀)',
          '유형별 VS 결과',
          '새 테스트 소개',
          '유형별 짤/밈',
        ],
      },
      {
        id: 'reels',
        name: '릴스',
        description: '짧은 영상 콘텐츠',
        frequency: '주 2-3회',
        contentIdeas: [
          '유형별 반응 시리즈',
          '궁합 테스트 결과 공개',
          '퀴즈 챌린지',
          '트렌드 밈 + MBTI 결합',
        ],
      },
      {
        id: 'story',
        name: '스토리',
        description: '일상적 소통 + 투표',
        frequency: '매일',
        contentIdeas: [
          '오늘의 퀴즈',
          'A vs B 투표',
          '새 콘텐츠 알림',
          '사용자 후기 공유',
        ],
      },
    ],
    metrics: ['팔로워 수', '도달율', '참여율', '프로필 클릭'],
    bestPractices: [
      '일관된 비주얼 아이덴티티 (색상, 폰트)',
      '해시태그 전략 (#MBTI #성격테스트 등)',
      '최적 시간대 포스팅 (오후 6-9시)',
      '릴스 트렌드 빠르게 팔로우',
      'CTA 명확히 ("프로필 링크에서 테스트하세요")',
    ],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    type: 'organic',
    priority: 'critical',
    effort: 4,
    reach: 5,
    cost: 'free',
    description: '바이럴 잠재력 최고, 젊은 층 공략',
    tactics: [
      {
        id: 'trend',
        name: '트렌드 영상',
        description: '인기 음악/밈에 MBTI 접목',
        frequency: '트렌드 발생 시 24시간 내',
        contentIdeas: [
          '트렌드 음악 + "당신의 유형은?" 영상',
          '유형별 반응 시리즈',
          '"POV: 당신이 INTJ라면"',
        ],
      },
      {
        id: 'quiz',
        name: '퀴즈/테스트 영상',
        description: '테스트 과정 및 결과 공유',
        frequency: '주 2-3회',
        contentIdeas: [
          '"이 테스트로 내 유형 맞춰봤는데..."',
          '친구와 궁합 테스트 리액션',
          '결과 공개 영상',
        ],
      },
      {
        id: 'duet',
        name: '듀엣/스티치',
        description: '다른 크리에이터와 협업',
        frequency: '기회 있을 때',
        contentIdeas: [
          'MBTI 관련 영상에 반응',
          '사용자 결과 영상에 답변',
        ],
      },
    ],
    metrics: ['조회수', '좋아요', '공유', '프로필 방문'],
    bestPractices: [
      '처음 3초가 승부 (훅 필수)',
      '트렌드 빠르게 팔로우 (24시간 골든타임)',
      '세로 영상 (9:16)',
      '자막 필수',
      '해시태그: #mbti #성격테스트 #fyp #추천',
    ],
    risks: ['알고리즘 의존도 높음', '트렌드 속도가 빠름'],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '📺',
    type: 'organic',
    priority: 'high',
    effort: 5,
    reach: 5,
    cost: 'free',
    description: '검색 유입 + 장기 자산 축적',
    tactics: [
      {
        id: 'shorts',
        name: 'Shorts',
        description: '60초 이하 짧은 영상',
        frequency: '주 3-5회',
        contentIdeas: [
          '유형별 특징 1분 정리',
          '퀴즈 영상',
          '궁합 결과 공개',
          '유형별 짤/밈 영상화',
        ],
      },
      {
        id: 'long-form',
        name: '롱폼 영상',
        description: '5-15분 심층 콘텐츠',
        frequency: '주 1회',
        contentIdeas: [
          '유형별 완전 분석 (10분)',
          '궁합 유형 TOP5',
          '테스트 풀이 + 해설',
          '성격 심리학 상식',
        ],
      },
    ],
    metrics: ['구독자', '조회수', '시청 시간', '클릭률'],
    bestPractices: [
      '검색 최적화 (제목, 설명, 태그)',
      '썸네일 A/B 테스트',
      '꾸준한 업로드 스케줄',
      '엔드스크린/카드로 유도',
      '댓글 소통',
    ],
  },
  {
    id: 'kakaotalk',
    name: 'KakaoTalk',
    icon: '💬',
    type: 'viral',
    priority: 'critical',
    effort: 2,
    reach: 5,
    cost: 'free',
    description: '한국 최대 메신저, 공유 핵심 채널',
    tactics: [
      {
        id: 'share-template',
        name: '공유 템플릿',
        description: '결과 카드 + 링크 공유',
        frequency: '상시',
        contentIdeas: [
          '예쁜 결과 카드 이미지',
          '친구 비교 초대 메시지',
          '테스트 추천 메시지',
        ],
        tools: ['카카오 SDK', 'OG 메타태그'],
      },
    ],
    metrics: ['공유 횟수', '공유→유입 전환율'],
    bestPractices: [
      '카카오 SDK 연동 (원클릭 공유)',
      '공유 이미지 최적화 (800x400)',
      '공유 문구 A/B 테스트',
      '"친구랑 비교해보세요" CTA',
    ],
  },
  {
    id: 'blog-seo',
    name: 'Blog/SEO',
    icon: '🔍',
    type: 'organic',
    priority: 'high',
    effort: 4,
    reach: 4,
    cost: 'free',
    description: '검색 유입을 위한 콘텐츠 자산',
    tactics: [
      {
        id: 'test-landing',
        name: '테스트 랜딩 페이지',
        description: '각 테스트별 SEO 최적화 페이지',
        frequency: '테스트 출시 시',
        contentIdeas: [
          '테스트 설명 + 예상 결과',
          '유형별 상세 설명 페이지',
          '자주 묻는 질문 (FAQ)',
        ],
      },
      {
        id: 'blog-posts',
        name: '블로그 포스트',
        description: '성격/심리 관련 콘텐츠',
        frequency: '주 1-2회',
        contentIdeas: [
          '"MBTI 유형별 특징 완벽 정리"',
          '"성격 테스트 과학적 근거"',
          '"궁합 좋은 유형 조합"',
        ],
      },
    ],
    metrics: ['검색 유입', '페이지 체류 시간', '테스트 전환율'],
    bestPractices: [
      '키워드 리서치 (네이버/구글)',
      '메타 태그 최적화',
      '내부 링크 전략',
      '구조화된 데이터 (Schema)',
    ],
  },
  {
    id: 'community',
    name: '커뮤니티 마케팅',
    icon: '🏘️',
    type: 'organic',
    priority: 'medium',
    effort: 3,
    reach: 3,
    cost: 'free',
    description: '기존 커뮤니티에서 자연스러운 노출',
    tactics: [
      {
        id: 'mbti-community',
        name: 'MBTI 커뮤니티',
        description: '에브리타임, 디시, 네이버 카페 등',
        frequency: '주 2-3회',
        contentIdeas: [
          '테스트 결과 공유 (자연스럽게)',
          '퀴즈/투표 결과 공유',
          '새 테스트 소개',
        ],
      },
    ],
    metrics: ['커뮤니티 유입', '게시물 반응'],
    bestPractices: [
      '광고성 느낌 최소화',
      '가치 있는 콘텐츠 먼저',
      '커뮤니티 규칙 준수',
      '자연스러운 대화 참여',
    ],
    risks: ['스팸으로 인식될 위험', '커뮤니티 규칙 위반'],
  },
  {
    id: 'influencer',
    name: '인플루언서/크리에이터',
    icon: '⭐',
    type: 'paid',
    priority: 'medium',
    effort: 3,
    reach: 5,
    cost: 'medium',
    description: '마이크로/나노 인플루언서 협업',
    tactics: [
      {
        id: 'micro-influencer',
        name: '마이크로 인플루언서',
        description: '1만-10만 팔로워 크리에이터',
        frequency: '월 2-4회',
        contentIdeas: [
          '테스트 체험 콘텐츠',
          '친구/커플 비교 콘텐츠',
          '결과 리뷰/반응',
        ],
      },
    ],
    metrics: ['도달', 'CPM', '유입', '전환'],
    bestPractices: [
      '타겟 오디언스 일치 확인',
      '자연스러운 콘텐츠 (광고 티 최소화)',
      '성과 기반 보상 (가능하면)',
      '장기 관계 구축',
    ],
    risks: ['ROI 측정 어려움', '브랜드 핏 불일치'],
  },
];

// ============================================================================
// 마케팅 Phase
// ============================================================================

export const MARKETING_PHASE_1: MarketingPhase = {
  id: 'phase-1',
  title: 'Phase 1: 기반 구축',
  description: '채널 개설 및 초기 콘텐츠 확보',
  timeframe: '1-2개월',
  goal: '각 채널 팔로워 1,000명',
  budget: '0원 (무료 마케팅)',
  activities: [
    {
      id: 'channel-setup',
      name: 'SNS 채널 개설',
      channel: 'all',
      description: 'Instagram, TikTok, YouTube 계정 생성 및 프로필 설정',
      priority: 'critical',
      status: 'planned',
    },
    {
      id: 'content-batch',
      name: '초기 콘텐츠 30개 제작',
      channel: 'all',
      description: '업로드할 콘텐츠 미리 준비',
      priority: 'critical',
      status: 'planned',
    },
    {
      id: 'kakao-share',
      name: '카카오 공유 최적화',
      channel: 'kakaotalk',
      description: '공유 카드 디자인 및 SDK 연동',
      priority: 'critical',
      status: 'planned',
    },
    {
      id: 'seo-basic',
      name: '기본 SEO 설정',
      channel: 'blog-seo',
      description: '메타태그, OG 이미지, 구조화 데이터',
      priority: 'high',
      status: 'planned',
    },
  ],
};

export const MARKETING_PHASE_2: MarketingPhase = {
  id: 'phase-2',
  title: 'Phase 2: 꾸준한 콘텐츠',
  description: '정기적인 콘텐츠 업로드 루틴 확립',
  timeframe: '2-6개월',
  goal: '월 10,000 방문자',
  budget: '월 10-30만원 (도구/소프트웨어)',
  activities: [
    {
      id: 'instagram-routine',
      name: 'Instagram 루틴',
      channel: 'instagram',
      description: '피드 주 3회 + 스토리 매일 + 릴스 주 2회',
      priority: 'critical',
      status: 'planned',
    },
    {
      id: 'tiktok-routine',
      name: 'TikTok 루틴',
      channel: 'tiktok',
      description: '주 3-5회 업로드, 트렌드 팔로우',
      priority: 'critical',
      status: 'planned',
    },
    {
      id: 'youtube-shorts',
      name: 'YouTube Shorts',
      channel: 'youtube',
      description: '주 3-5회 Shorts + 월 2회 롱폼',
      priority: 'high',
      status: 'planned',
    },
    {
      id: 'utm-tracking',
      name: 'UTM 추적 시스템',
      channel: 'all',
      description: '모든 링크에 UTM 파라미터 추가',
      priority: 'high',
      status: 'planned',
    },
  ],
};

export const MARKETING_PHASE_3: MarketingPhase = {
  id: 'phase-3',
  title: 'Phase 3: 확장',
  description: '바이럴 루프 최적화 + 협업',
  timeframe: '6개월+',
  goal: '월 100,000 방문자',
  budget: '월 50-100만원',
  activities: [
    {
      id: 'influencer-collab',
      name: '인플루언서 협업',
      channel: 'influencer',
      description: '마이크로 인플루언서 월 2-4명 협업',
      priority: 'medium',
      status: 'planned',
    },
    {
      id: 'viral-optimize',
      name: '바이럴 루프 최적화',
      channel: 'all',
      description: '공유→유입→전환 퍼널 분석 및 개선',
      priority: 'high',
      status: 'planned',
    },
    {
      id: 'paid-test',
      name: '유료 광고 테스트',
      channel: 'instagram',
      description: '소액으로 광고 ROI 테스트',
      priority: 'low',
      status: 'planned',
    },
  ],
};

// ============================================================================
// 콘텐츠 캘린더 템플릿
// ============================================================================

export const WEEKLY_CONTENT_TEMPLATE = {
  monday: {
    instagram: '유형별 특징 카드 (캐러셀)',
    tiktok: '트렌드 영상',
    youtube: 'Shorts 업로드',
  },
  tuesday: {
    instagram: '스토리 투표',
    tiktok: null,
    youtube: null,
  },
  wednesday: {
    instagram: '릴스',
    tiktok: '유형별 반응 시리즈',
    youtube: 'Shorts 업로드',
  },
  thursday: {
    instagram: '스토리 퀴즈',
    tiktok: null,
    youtube: null,
  },
  friday: {
    instagram: '유형별 짤/밈',
    tiktok: '테스트 결과 영상',
    youtube: 'Shorts 업로드',
  },
  saturday: {
    instagram: '스토리 (주말 느낌)',
    tiktok: '트렌드 영상',
    youtube: null,
  },
  sunday: {
    instagram: '릴스',
    tiktok: null,
    youtube: '롱폼 영상 (격주)',
  },
};

// ============================================================================
// 마케팅 도구 추천
// ============================================================================

export const MARKETING_TOOLS = [
  {
    category: '콘텐츠 제작',
    tools: [
      { name: 'Canva', use: '이미지/카드 제작', cost: 'Free/Pro' },
      { name: 'CapCut', use: '영상 편집', cost: 'Free' },
      { name: 'Figma', use: '디자인 시스템', cost: 'Free' },
    ],
  },
  {
    category: '일정 관리',
    tools: [
      { name: 'Later', use: 'SNS 예약 게시', cost: 'Free/Pro' },
      { name: 'Notion', use: '콘텐츠 캘린더', cost: 'Free' },
    ],
  },
  {
    category: '분석',
    tools: [
      { name: 'Google Analytics', use: '웹 트래픽 분석', cost: 'Free' },
      { name: '각 플랫폼 인사이트', use: 'SNS 분석', cost: 'Free' },
      { name: 'Bitly', use: '링크 추적', cost: 'Free' },
    ],
  },
];

// ============================================================================
// KPI 및 목표
// ============================================================================

export const MARKETING_KPIS = [
  {
    id: 'visitors',
    name: '월간 방문자',
    phase1: '1,000',
    phase2: '10,000',
    phase3: '100,000',
  },
  {
    id: 'followers',
    name: 'SNS 총 팔로워',
    phase1: '1,000',
    phase2: '10,000',
    phase3: '50,000',
  },
  {
    id: 'share-rate',
    name: '테스트 후 공유율',
    phase1: '5%',
    phase2: '10%',
    phase3: '15%',
  },
  {
    id: 'organic-ratio',
    name: '유기적 유입 비율',
    phase1: '50%',
    phase2: '60%',
    phase3: '70%',
  },
  {
    id: 'cac',
    name: '사용자 획득 비용 (CAC)',
    phase1: '0원',
    phase2: '<100원',
    phase3: '<50원',
  },
];

// ============================================================================
// AI 콘텐츠 자동화 전략
// ============================================================================

export interface AutomationPipeline {
  id: string;
  name: string;
  description: string;
  source: string;  // 데이터 소스
  output: string[];  // 생성되는 콘텐츠 유형
  channels: string[];  // 배포 채널
  frequency: string;
  automationLevel: 'full' | 'semi' | 'assisted';  // 완전/반/보조 자동화
  implementation: string[];
  tools: string[];
  example?: string;
}

export interface ContentTemplate {
  id: string;
  name: string;
  type: 'image' | 'video' | 'text' | 'carousel';
  platform: string[];
  prompt: string;  // AI 프롬프트 템플릿
  variables: string[];  // 동적으로 채워질 변수
  example?: string;
}

// 앱 데이터 기반 자동화 파이프라인
export const AUTOMATION_PIPELINES: AutomationPipeline[] = [
  {
    id: 'quiz-result-card',
    name: '퀴즈 결과 카드 자동 생성',
    description: '일일 퀴즈/투표 결과를 SNS용 이미지로 자동 변환',
    source: '앱 내 퀴즈/투표 통계',
    output: ['인스타 스토리 이미지', '틱톡 썸네일', '트위터 카드'],
    channels: ['instagram-story', 'tiktok', 'twitter'],
    frequency: '매일 오후 6시',
    automationLevel: 'full',
    implementation: [
      '매일 퀴즈 정답률/투표 결과 집계',
      'AI로 재미있는 코멘트 생성',
      'Figma/Canva API로 템플릿에 데이터 삽입',
      'SNS API로 자동 게시 (Later/Buffer)',
    ],
    tools: ['Claude API', 'Canva API', 'Later API'],
    example: '"오늘의 퀴즈 정답률 42%! 🤯 고양이 수염 개수 맞힌 사람 의외로 적네요"',
  },
  {
    id: 'type-meme-generator',
    name: '유형별 밈/짤 자동 생성',
    description: '테스트 결과 데이터로 유형별 밈 콘텐츠 생성',
    source: '테스트 결과 유형 + 특징 데이터',
    output: ['유형별 밈 이미지', '유형 비교 카드', 'VS 콘텐츠'],
    channels: ['instagram-feed', 'tiktok', 'twitter'],
    frequency: '주 3-4회',
    automationLevel: 'semi',
    implementation: [
      '결과 유형별 특징 데이터에서 핵심 키워드 추출',
      'AI로 밈 문구/상황 생성 (10개 후보)',
      '사람이 베스트 3개 선택',
      '이미지 템플릿에 자동 삽입',
    ],
    tools: ['Claude API', 'DALL-E/Midjourney', 'Canva'],
    example: '"러시안블루형이 새벽 3시에 하는 생각: 그때 그 말 왜 했지..."',
  },
  {
    id: 'tip-to-content',
    name: '팁 → SNS 콘텐츠 변환',
    description: '커뮤니티 팁을 SNS용 카드뉴스로 자동 변환',
    source: '커뮤니티 베스트 팁',
    output: ['인스타 캐러셀', '유튜브 Shorts 스크립트', '블로그 포스트'],
    channels: ['instagram-carousel', 'youtube-shorts', 'blog'],
    frequency: '베스트 팁 선정 시',
    automationLevel: 'semi',
    implementation: [
      '좋아요 100+ 팁 자동 수집',
      'AI로 캐러셀 5장 분량으로 재구성',
      '이미지 자동 생성',
      '원작자 크레딧 자동 삽입',
    ],
    tools: ['Claude API', 'Canva API'],
    example: '팁: "햄스터 볼주머니 비우는 법" → 5장 캐러셀 카드뉴스',
  },
  {
    id: 'debate-video',
    name: '토론/VS 결과 → 영상 콘텐츠',
    description: '투표/토론 결과를 짧은 영상으로 자동 생성',
    source: '토론/VS 투표 결과',
    output: ['틱톡 영상', '유튜브 Shorts', '인스타 릴스'],
    channels: ['tiktok', 'youtube-shorts', 'instagram-reels'],
    frequency: '투표 종료 시',
    automationLevel: 'semi',
    implementation: [
      '투표 결과 + 탑 코멘트 추출',
      'AI로 영상 스크립트 생성',
      '템플릿 영상에 결과 오버레이',
      'TTS로 나레이션 추가 (선택)',
    ],
    tools: ['Claude API', 'CapCut API', 'ElevenLabs TTS'],
    example: '"🐱 vs 🐕 최종 결과: 52% vs 48%! 댓글 반응 대박이었는데요..."',
  },
  {
    id: 'weekly-digest',
    name: '주간 다이제스트 자동 생성',
    description: '한 주간 인기 콘텐츠/통계를 요약 콘텐츠로 생성',
    source: '주간 앱 사용 통계',
    output: ['인스타 캐러셀', '뉴스레터', '블로그 포스트'],
    channels: ['instagram', 'email', 'blog'],
    frequency: '매주 일요일',
    automationLevel: 'full',
    implementation: [
      '자동 통계 집계 (인기 테스트, 결과 분포, 퀴즈 정답률)',
      'AI로 인사이트 코멘트 생성',
      '템플릿에 자동 삽입',
      '예약 게시',
    ],
    tools: ['Claude API', 'Canva API', 'Mailchimp API'],
    example: '"이번 주 가장 인기 있던 테스트: 커피 유형 (+200%) 🚀"',
  },
  {
    id: 'trend-content',
    name: '트렌드 기반 콘텐츠 생성',
    description: 'SNS 트렌드 감지 → MBTI/성격 버전으로 변환',
    source: '트위터/틱톡 트렌드 + 앱 데이터',
    output: ['트렌드 밈', '챌린지 콘텐츠'],
    channels: ['tiktok', 'instagram-reels', 'twitter'],
    frequency: '트렌드 감지 시 (24시간 내)',
    automationLevel: 'assisted',
    implementation: [
      '트렌드 키워드 자동 모니터링 (Twitter API, TikTok)',
      'AI로 MBTI/성격 버전 아이디어 5개 생성',
      '사람이 선택 및 수정',
      '빠른 제작 및 게시',
    ],
    tools: ['Twitter API', 'Claude API', 'CapCut'],
    example: '트렌드: "very demure" → "very demure한 MBTI 유형 TOP3"',
  },
  {
    id: 'result-share-optimize',
    name: '결과 공유 카드 A/B 테스트',
    description: '공유 카드 디자인/문구 자동 A/B 테스트',
    source: '테스트 결과 데이터',
    output: ['공유 이미지 변형', '공유 문구 변형'],
    channels: ['all'],
    frequency: '상시 (자동 최적화)',
    automationLevel: 'full',
    implementation: [
      'AI로 공유 문구 변형 10개 생성',
      '이미지 템플릿 변형 5개 생성',
      '랜덤 노출 후 공유율 추적',
      '상위 성과 버전 자동 선택',
    ],
    tools: ['Claude API', 'Canva API', 'GA4'],
    example: '"당신은 러시안블루형!" vs "러시안블루형을 만났다!" 중 공유율 높은 버전 자동 선택',
  },
];

// AI 콘텐츠 템플릿
export const CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    id: 'quiz-result-story',
    name: '퀴즈 결과 스토리',
    type: 'image',
    platform: ['instagram-story', 'tiktok'],
    prompt: `오늘의 퀴즈 결과를 재미있게 요약해줘:
- 퀴즈: {quiz_question}
- 정답: {correct_answer}
- 정답률: {accuracy}%
- 가장 많이 고른 오답: {wrong_answer}

톤: 가볍고 재미있게, 이모지 사용, 2-3문장`,
    variables: ['quiz_question', 'correct_answer', 'accuracy', 'wrong_answer'],
    example: '🤯 오늘의 퀴즈 정답률 단 23%! 고양이 수염은 평균 24개인데, 대부분 12개라고 답했네요 ㅋㅋ',
  },
  {
    id: 'type-comparison',
    name: '유형 비교 카드',
    type: 'carousel',
    platform: ['instagram-feed'],
    prompt: `{type_a}와 {type_b} 유형을 재미있게 비교해줘:
- 각 유형 특징: {type_a_traits}, {type_b_traits}
- 비교 포인트 5가지 (아침 루틴, 스트레스 받을 때, 연애 스타일, 친구 관계, 취미)
- 각 포인트마다 유형별 1문장씩

톤: 과장되고 웃긴, 이모지 많이`,
    variables: ['type_a', 'type_b', 'type_a_traits', 'type_b_traits'],
  },
  {
    id: 'tip-carousel',
    name: '팁 캐러셀',
    type: 'carousel',
    platform: ['instagram-feed'],
    prompt: `이 팁을 5장 캐러셀 카드뉴스로 재구성해줘:
- 원본 팁: {tip_content}
- 카테고리: {category}

구성:
1장: 후킹 타이틀 (질문형)
2-4장: 핵심 내용 (한 장에 1포인트씩)
5장: 요약 + CTA

톤: 정보성이지만 친근하게`,
    variables: ['tip_content', 'category'],
  },
  {
    id: 'vs-result-video',
    name: 'VS 결과 영상 스크립트',
    type: 'video',
    platform: ['tiktok', 'youtube-shorts'],
    prompt: `VS 투표 결과를 30초 영상 스크립트로 만들어줘:
- 주제: {debate_title}
- A 옵션: {option_a} ({a_percent}%)
- B 옵션: {option_b} ({b_percent}%)
- 탑 코멘트 A: {top_comment_a}
- 탑 코멘트 B: {top_comment_b}

구성:
0-5초: 후킹 (의외의 결과였다면 강조)
5-15초: 각 옵션 소개 + 퍼센트
15-25초: 베스트 댓글 소개
25-30초: 다음 VS 예고 + CTA

톤: 에너지 넘치게, 밈 요소 추가`,
    variables: ['debate_title', 'option_a', 'option_b', 'a_percent', 'b_percent', 'top_comment_a', 'top_comment_b'],
  },
  {
    id: 'weekly-digest-post',
    name: '주간 다이제스트',
    type: 'carousel',
    platform: ['instagram-feed'],
    prompt: `이번 주 앱 통계를 재미있는 주간 다이제스트로 만들어줘:
- 총 테스트 횟수: {total_tests}
- 가장 인기 테스트: {top_test} (+{growth}%)
- 가장 많은 결과 유형: {top_result}
- 퀴즈 평균 정답률: {quiz_accuracy}%
- 가장 치열했던 VS: {hot_debate}

5장 캐러셀:
1장: "이번 주 케미테스트 하이라이트 🔥"
2장: 인기 테스트 + 왜 인기인지 추측
3장: 재미있는 통계 (결과 분포 등)
4장: 퀴즈 하이라이트
5장: 다음 주 예고`,
    variables: ['total_tests', 'top_test', 'growth', 'top_result', 'quiz_accuracy', 'hot_debate'],
  },
];

// 자동화 도구 스택
export const AUTOMATION_TOOLS = [
  {
    category: 'AI 텍스트 생성',
    tools: [
      { name: 'Claude API', use: '콘텐츠 문구/스크립트 생성', cost: '사용량 기반' },
      { name: 'GPT-4 API', use: '대안/백업', cost: '사용량 기반' },
    ],
  },
  {
    category: 'AI 이미지 생성',
    tools: [
      { name: 'DALL-E 3', use: '밈/일러스트 생성', cost: '사용량 기반' },
      { name: 'Midjourney', use: '고품질 이미지', cost: '월정액' },
      { name: 'Canva AI', use: '템플릿 기반 이미지', cost: 'Pro 포함' },
    ],
  },
  {
    category: '영상 자동화',
    tools: [
      { name: 'CapCut API', use: '템플릿 영상 생성', cost: 'Free/Pro' },
      { name: 'Runway', use: 'AI 영상 편집', cost: '월정액' },
      { name: 'ElevenLabs', use: 'TTS 나레이션', cost: '사용량 기반' },
    ],
  },
  {
    category: 'SNS 자동화',
    tools: [
      { name: 'Later', use: 'SNS 예약 게시', cost: 'Free/Pro' },
      { name: 'Buffer', use: '멀티 채널 관리', cost: 'Free/Pro' },
      { name: 'Zapier', use: '워크플로우 자동화', cost: 'Free/Pro' },
    ],
  },
  {
    category: '데이터/분석',
    tools: [
      { name: 'n8n', use: '오픈소스 자동화', cost: 'Self-hosted' },
      { name: 'Make (Integromat)', use: '복잡한 워크플로우', cost: 'Free/Pro' },
      { name: 'Supabase', use: '데이터 저장/쿼리', cost: 'Free/Pro' },
    ],
  },
];

// 자동화 ROI 예상
export const AUTOMATION_ROI = {
  manualEffort: {
    dailyContent: '2-3시간',
    weeklyContent: '10-15시간',
    monthlyContent: '40-60시간',
  },
  automatedEffort: {
    dailyContent: '15-30분 (검수)',
    weeklyContent: '2-3시간 (기획+검수)',
    monthlyContent: '8-12시간',
  },
  savings: {
    time: '70-80%',
    cost: '콘텐츠 제작 인력 1명 대체 가능',
    quality: '일관성 유지, 데이터 기반 최적화',
  },
  investment: {
    setup: '1-2주 개발',
    monthlyCost: '10-30만원 (API 비용)',
    maintenance: '주 2-3시간',
  },
};

// 자동화 구현 로드맵
export const AUTOMATION_ROADMAP = [
  {
    phase: 1,
    title: '기본 자동화',
    timeline: '1-2주',
    items: [
      '퀴즈/투표 결과 → 이미지 카드 자동 생성',
      '주간 다이제스트 자동 생성',
      'SNS 예약 게시 설정',
    ],
  },
  {
    phase: 2,
    title: '콘텐츠 파이프라인',
    timeline: '2-4주',
    items: [
      '유형별 밈/짤 반자동 생성',
      '팁 → 캐러셀 변환',
      '공유 카드 A/B 테스트 시스템',
    ],
  },
  {
    phase: 3,
    title: '고급 자동화',
    timeline: '4-8주',
    items: [
      '영상 콘텐츠 자동 생성',
      '트렌드 감지 → 콘텐츠 제안',
      '성과 기반 자동 최적화',
    ],
  },
];

// ============================================================================
// 통합 전략 객체
// ============================================================================

export const MARKETING_STRATEGY = {
  principles: MARKETING_PRINCIPLES,
  contentPillars: CONTENT_PILLARS,
  channels: MARKETING_CHANNELS,
  phases: [MARKETING_PHASE_1, MARKETING_PHASE_2, MARKETING_PHASE_3],
  weeklyTemplate: WEEKLY_CONTENT_TEMPLATE,
  tools: MARKETING_TOOLS,
  kpis: MARKETING_KPIS,
  // AI 자동화
  automation: {
    pipelines: AUTOMATION_PIPELINES,
    templates: CONTENT_TEMPLATES,
    tools: AUTOMATION_TOOLS,
    roi: AUTOMATION_ROI,
    roadmap: AUTOMATION_ROADMAP,
  },
};

export default MARKETING_STRATEGY;
