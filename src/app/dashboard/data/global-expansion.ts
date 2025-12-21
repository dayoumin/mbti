// ============================================================================
// 글로벌 확장 전략 (다국어 지원 & 해외 진출)
// ============================================================================

// ============================================================================
// Types
// ============================================================================

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  priority: 'high' | 'medium' | 'low';
  market: string;
  population: string;
  internetUsers: string;
  reason: string;
  challenges: string[];
}

export interface I18nTask {
  id: string;
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'in-progress' | 'done';
  category: 'infra' | 'content' | 'marketing' | 'ux';
  effort: 'small' | 'medium' | 'large';
}

export interface GlobalPhase {
  id: string;
  title: string;
  description: string;
  goals: string[];
  tasks: I18nTask[];
  successMetrics: string[];
}

export interface MarketStrategy {
  region: string;
  languages: string[];
  platforms: string[];
  contentStrategy: string;
  challenges: string[];
  opportunities: string[];
}

// ============================================================================
// 타겟 언어 우선순위
// ============================================================================

export const TARGET_LANGUAGES: Language[] = [
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    priority: 'high',
    market: '한국',
    population: '5,200만',
    internetUsers: '4,900만',
    reason: '현재 베이스 (기본 언어)',
    challenges: [],
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    priority: 'high',
    market: '글로벌',
    population: '15억+ (사용자)',
    internetUsers: '12억+',
    reason: '글로벌 공용어, 가장 넓은 도달 범위',
    challenges: ['문화적 맥락 번역', '지역별 영어 차이'],
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    priority: 'high',
    market: '일본',
    population: '1억 2,500만',
    internetUsers: '1억 1,800만',
    reason: 'MBTI/성격테스트 인기 1위 국가, 높은 광고 단가',
    challenges: ['존댓말/반말 체계', '문화적 뉘앙스', '캐릭터 선호도'],
  },
  {
    code: 'zh-TW',
    name: 'Traditional Chinese',
    nativeName: '繁體中文',
    priority: 'medium',
    market: '대만/홍콩',
    population: '3,000만+',
    internetUsers: '2,500만+',
    reason: '한류 친화적, 성격테스트 인기',
    challenges: ['번체/간체 구분', '지역별 표현 차이'],
  },
  {
    code: 'th',
    name: 'Thai',
    nativeName: 'ภาษาไทย',
    priority: 'medium',
    market: '태국',
    population: '7,000만',
    internetUsers: '5,700만',
    reason: 'SNS 활성도 최상위, 바이럴 잠재력 높음',
    challenges: ['태국어 폰트/렌더링', '문화적 번역'],
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    priority: 'medium',
    market: '베트남',
    population: '1억',
    internetUsers: '7,700만',
    reason: '젊은 인구 구조, 모바일 사용률 높음',
    challenges: ['성조 표기', '지역별 차이'],
  },
  {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    priority: 'medium',
    market: '인도네시아',
    population: '2억 7,500만',
    internetUsers: '2억 1,200만',
    reason: '세계 4위 인구, 소셜미디어 활성도 높음',
    challenges: ['방언 다양성', '인프라 격차'],
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    priority: 'low',
    market: '스페인/중남미',
    population: '5억+ (사용자)',
    internetUsers: '4억+',
    reason: '세계 2위 모국어 사용자, 중남미 시장',
    challenges: ['스페인/중남미 차이', '시간대 분산'],
  },
  {
    code: 'pt-BR',
    name: 'Portuguese (Brazil)',
    nativeName: 'Português',
    priority: 'low',
    market: '브라질',
    population: '2억 1,500만',
    internetUsers: '1억 8,100만',
    reason: '세계 5위 인구, SNS 활성도 높음',
    challenges: ['브라질/포르투갈 차이', '시간대'],
  },
];

// ============================================================================
// 기술 인프라 구축 계획
// ============================================================================

export const I18N_INFRASTRUCTURE: I18nTask[] = [
  {
    id: 'next-intl-setup',
    name: 'next-intl 설치 및 설정',
    description: 'Next.js 앱 라우터 기반 i18n 라이브러리 설정',
    priority: 'high',
    status: 'planned',
    category: 'infra',
    effort: 'medium',
  },
  {
    id: 'locale-routing',
    name: '언어별 URL 라우팅',
    description: '/en, /ja, /th 등 언어별 경로 구성',
    priority: 'high',
    status: 'planned',
    category: 'infra',
    effort: 'medium',
  },
  {
    id: 'language-detection',
    name: '언어 자동 감지',
    description: '브라우저 설정/IP 기반 언어 자동 선택 + 수동 전환',
    priority: 'high',
    status: 'planned',
    category: 'ux',
    effort: 'small',
  },
  {
    id: 'translation-json',
    name: '번역 파일 구조 설계',
    description: 'messages/ko.json, messages/en.json 등 구조화',
    priority: 'high',
    status: 'planned',
    category: 'infra',
    effort: 'small',
  },
  {
    id: 'dynamic-content-i18n',
    name: '동적 콘텐츠 다국어화',
    description: '테스트 질문/결과/퀴즈 등 데이터 레벨 다국어 지원',
    priority: 'high',
    status: 'planned',
    category: 'content',
    effort: 'large',
  },
  {
    id: 'rtl-support',
    name: 'RTL 레이아웃 지원',
    description: '아랍어/히브리어 등 RTL 언어 레이아웃 (미래 확장용)',
    priority: 'low',
    status: 'planned',
    category: 'ux',
    effort: 'medium',
  },
  {
    id: 'font-optimization',
    name: '다국어 폰트 최적화',
    description: '언어별 웹폰트 서브셋, 로딩 최적화',
    priority: 'medium',
    status: 'planned',
    category: 'ux',
    effort: 'medium',
  },
  {
    id: 'seo-hreflang',
    name: 'hreflang 태그 설정',
    description: '검색엔진 다국어 페이지 인식 최적화',
    priority: 'medium',
    status: 'planned',
    category: 'infra',
    effort: 'small',
  },
];

// ============================================================================
// 콘텐츠 번역 전략
// ============================================================================

export const TRANSLATION_STRATEGY = {
  approach: 'AI 초벌 번역 + 네이티브 검수',

  contentTypes: [
    {
      type: 'UI 텍스트',
      description: '버튼, 메뉴, 안내문 등',
      volume: '약 200개 문자열',
      method: 'AI 번역 + 검수',
      priority: 'high',
    },
    {
      type: '테스트 질문',
      description: '각 테스트별 12-16개 질문',
      volume: '약 150개 질문',
      method: 'AI 번역 + 문화적 검수',
      priority: 'high',
    },
    {
      type: '결과 텍스트',
      description: '결과 이름, 설명, 가이드',
      volume: '약 100개 결과',
      method: 'AI 번역 + 크리에이티브 검수',
      priority: 'high',
    },
    {
      type: '퀴즈/투표',
      description: '커뮤니티 콘텐츠',
      volume: '지속 증가',
      method: 'AI 자동 번역',
      priority: 'medium',
    },
    {
      type: 'SEO/메타',
      description: '페이지 타이틀, 설명',
      volume: '약 50개',
      method: 'AI 번역 + SEO 최적화',
      priority: 'medium',
    },
  ],

  qualityTiers: [
    {
      tier: 'Premium',
      languages: ['en', 'ja'],
      method: 'AI 초벌 + 프로 번역가 검수',
      cost: 'Higher',
      reason: '주력 시장, 품질 중요',
    },
    {
      tier: 'Standard',
      languages: ['zh-TW', 'th', 'vi', 'id'],
      method: 'AI 초벌 + 네이티브 커뮤니티 검수',
      cost: 'Medium',
      reason: '확장 시장, 커뮤니티 활용',
    },
    {
      tier: 'Basic',
      languages: ['es', 'pt-BR'],
      method: 'AI 번역 (자동)',
      cost: 'Low',
      reason: '테스트 시장, 반응 보고 투자',
    },
  ],
};

// ============================================================================
// 글로벌 확장 Phase 로드맵
// ============================================================================

export const GLOBAL_PHASES: GlobalPhase[] = [
  {
    id: 'phase-1',
    title: 'Phase 1: 인프라 구축',
    description: 'i18n 기술 기반 마련',
    goals: [
      'next-intl 기반 다국어 시스템 구축',
      '언어 전환 UI 구현',
      '번역 워크플로우 확립',
    ],
    tasks: [
      {
        id: 'install-next-intl',
        name: 'next-intl 설치',
        description: 'npm install next-intl && 기본 설정',
        priority: 'high',
        status: 'planned',
        category: 'infra',
        effort: 'small',
      },
      {
        id: 'middleware-setup',
        name: '미들웨어 설정',
        description: '언어 감지 및 리다이렉트 미들웨어',
        priority: 'high',
        status: 'planned',
        category: 'infra',
        effort: 'medium',
      },
      {
        id: 'language-switcher',
        name: '언어 전환 UI',
        description: '헤더/푸터에 언어 선택 드롭다운',
        priority: 'high',
        status: 'planned',
        category: 'ux',
        effort: 'small',
      },
      {
        id: 'translation-extraction',
        name: '번역 문자열 추출',
        description: '기존 하드코딩된 한국어 → 키 변환',
        priority: 'high',
        status: 'planned',
        category: 'content',
        effort: 'large',
      },
    ],
    successMetrics: [
      '/en, /ko 라우팅 동작',
      '언어 전환 시 페이지 유지',
      '번역 키 100% 추출',
    ],
  },
  {
    id: 'phase-2',
    title: 'Phase 2: 영어 버전 출시',
    description: '첫 글로벌 언어 런칭',
    goals: [
      '전체 UI 영어 번역',
      '핵심 테스트 3개 영어화',
      '영어권 마케팅 시작',
    ],
    tasks: [
      {
        id: 'ui-translation-en',
        name: 'UI 영어 번역',
        description: '모든 UI 텍스트 영어 번역',
        priority: 'high',
        status: 'planned',
        category: 'content',
        effort: 'medium',
      },
      {
        id: 'core-tests-en',
        name: '핵심 테스트 영어화',
        description: 'human, idealType, coffee 테스트 번역',
        priority: 'high',
        status: 'planned',
        category: 'content',
        effort: 'large',
      },
      {
        id: 'en-seo',
        name: '영어 SEO 설정',
        description: '영어 메타태그, OG 이미지, sitemap',
        priority: 'medium',
        status: 'planned',
        category: 'marketing',
        effort: 'medium',
      },
      {
        id: 'en-tiktok',
        name: '영어 틱톡 시작',
        description: '글로벌 틱톡 계정 운영 시작',
        priority: 'medium',
        status: 'planned',
        category: 'marketing',
        effort: 'medium',
      },
    ],
    successMetrics: [
      '영어 사용자 1,000명',
      '영어권 유입 비율 10%',
      '틱톡 영어 팔로워 1,000명',
    ],
  },
  {
    id: 'phase-3',
    title: 'Phase 3: 일본어 버전',
    description: '아시아 프리미엄 시장 공략',
    goals: [
      '일본어 전체 번역',
      '일본 문화 현지화',
      '일본 SNS 진출 (Twitter/LINE)',
    ],
    tasks: [
      {
        id: 'ja-translation',
        name: '일본어 번역',
        description: '전체 콘텐츠 일본어 번역 (경어체)',
        priority: 'high',
        status: 'planned',
        category: 'content',
        effort: 'large',
      },
      {
        id: 'ja-localization',
        name: '일본 문화 현지화',
        description: '캐릭터 선호도, 표현 방식 조정',
        priority: 'high',
        status: 'planned',
        category: 'content',
        effort: 'medium',
      },
      {
        id: 'ja-twitter',
        name: '일본 트위터 운영',
        description: '@chemitest_jp 계정 운영',
        priority: 'medium',
        status: 'planned',
        category: 'marketing',
        effort: 'medium',
      },
      {
        id: 'line-share',
        name: 'LINE 공유 기능',
        description: '일본 필수 메신저 LINE 공유 버튼',
        priority: 'medium',
        status: 'planned',
        category: 'ux',
        effort: 'small',
      },
    ],
    successMetrics: [
      '일본 사용자 5,000명',
      '일본어 테스트 완료율 > 한국어',
      'Twitter 팔로워 3,000명',
    ],
  },
  {
    id: 'phase-4',
    title: 'Phase 4: 동남아 확장',
    description: '바이럴 잠재력 높은 시장 공략',
    goals: [
      '태국어/베트남어/인도네시아어 지원',
      '현지 인플루언서 협업',
      '지역별 맞춤 콘텐츠',
    ],
    tasks: [
      {
        id: 'sea-translations',
        name: '동남아 3개국 번역',
        description: '태국어, 베트남어, 인도네시아어 번역',
        priority: 'high',
        status: 'planned',
        category: 'content',
        effort: 'large',
      },
      {
        id: 'sea-influencers',
        name: '현지 인플루언서 협업',
        description: '마이크로 인플루언서 10명 협업',
        priority: 'medium',
        status: 'planned',
        category: 'marketing',
        effort: 'medium',
      },
      {
        id: 'local-tests',
        name: '현지화 테스트 제작',
        description: '각 문화권 특화 테스트 개발',
        priority: 'low',
        status: 'planned',
        category: 'content',
        effort: 'large',
      },
    ],
    successMetrics: [
      '동남아 사용자 10,000명',
      '해외 비율 30% 달성',
      '현지 바이럴 발생',
    ],
  },
];

// ============================================================================
// 시장별 전략
// ============================================================================

export const MARKET_STRATEGIES: MarketStrategy[] = [
  {
    region: '일본',
    languages: ['ja'],
    platforms: ['Twitter/X', 'LINE', 'TikTok'],
    contentStrategy: 'MBTI/성격테스트 메카, 귀여운 캐릭터 강조, 경어체 사용',
    challenges: ['높은 품질 기대치', '경쟁 심함', '현지화 비용'],
    opportunities: ['테스트 문화 성숙', '높은 광고 단가', '한류 친화적'],
  },
  {
    region: '동남아 (태국/베트남/인도네시아)',
    languages: ['th', 'vi', 'id'],
    platforms: ['TikTok', 'Facebook', 'Instagram'],
    contentStrategy: '재미있고 가벼운 톤, 공유 유도, 트렌드 빠른 반영',
    challenges: ['언어 다양성', '인프라 격차', '수익화 단가 낮음'],
    opportunities: ['젊은 인구', '바이럴 잠재력', '경쟁 상대적 약함'],
  },
  {
    region: '영어권 (미국/영국/호주)',
    languages: ['en'],
    platforms: ['TikTok', 'Instagram', 'Reddit'],
    contentStrategy: '캐주얼하고 위트있는 톤, 밈 활용, 인플루언서 협업',
    challenges: ['치열한 경쟁', '문화 차이', '마케팅 비용 높음'],
    opportunities: ['가장 큰 시장', '높은 광고 단가', 'K-콘텐츠 인지도'],
  },
  {
    region: '대만/홍콩',
    languages: ['zh-TW'],
    platforms: ['Instagram', 'Facebook', 'LINE'],
    contentStrategy: '한류 연계, 감성적 접근, K-테스트 브랜딩',
    challenges: ['중국어 변형 관리', '정치적 민감성'],
    opportunities: ['한류 팬덤', '높은 참여도', '지리적 근접성'],
  },
];

// ============================================================================
// 번역 도구 및 워크플로우
// ============================================================================

export const TRANSLATION_WORKFLOW = {
  tools: [
    {
      name: 'Claude API',
      use: '초벌 번역 + 문맥 이해',
      pros: ['뉘앙스 이해', '일관성 유지', '빠른 속도'],
      cons: ['검수 필요', '비용'],
    },
    {
      name: 'Crowdin',
      use: '번역 관리 플랫폼',
      pros: ['협업 용이', 'Git 연동', '번역 메모리'],
      cons: ['유료 (규모 따라)'],
    },
    {
      name: 'POEditor',
      use: '번역 관리 대안',
      pros: ['무료 티어 충분', '간단한 UI'],
      cons: ['기능 제한적'],
    },
    {
      name: '네이티브 커뮤니티',
      use: '검수 및 피드백',
      pros: ['문화적 맥락', '자연스러움', '비용 효율'],
      cons: ['관리 필요', '품질 편차'],
    },
  ],

  process: [
    { step: 1, action: '새 문자열 추출', tool: 'i18n-ally (VSCode)' },
    { step: 2, action: 'AI 초벌 번역', tool: 'Claude API' },
    { step: 3, action: '번역 플랫폼 업로드', tool: 'Crowdin/POEditor' },
    { step: 4, action: '네이티브 검수', tool: '커뮤니티/프리랜서' },
    { step: 5, action: '코드 반영', tool: 'Git PR' },
    { step: 6, action: 'QA 테스트', tool: '수동 검증' },
  ],
};

// ============================================================================
// 추가 고려사항 (확대 시 상세화)
// ============================================================================

export const FUTURE_CONSIDERATIONS = {
  // 중국 본토: 규제/차단 이슈로 일단 제외, 추후 검토
  excludedMarkets: [
    { region: '중국 본토', reason: 'GFW 차단, ICP 라이선스 필요, 별도 인프라 필요' },
  ],

  // 현지 메신저 공유 (카카오톡 외)
  localMessengers: [
    { region: '일본', app: 'LINE', priority: 'high' },
    { region: '태국', app: 'LINE', priority: 'high' },
    { region: '베트남', app: 'Zalo', priority: 'medium' },
    { region: '인도네시아', app: 'WhatsApp', priority: 'high' },
    { region: '대만', app: 'LINE', priority: 'high' },
  ],

  // 수익화 (언어별 광고 단가 차이)
  monetization: {
    highCPM: ['en-US', 'ja', 'en-UK', 'en-AU'],  // $5-15 CPM
    mediumCPM: ['zh-TW', 'ko'],                   // $2-5 CPM
    lowCPM: ['th', 'vi', 'id', 'pt-BR'],          // $0.5-2 CPM
    note: '동남아는 볼륨으로 승부, 일본/영어권은 단가로 승부',
  },

  // 법적/규제 이슈
  legal: [
    { region: 'EU', issue: 'GDPR', action: '쿠키 동의, 데이터 삭제 요청 대응' },
    { region: '일본', issue: 'APPI', action: '개인정보 취급방침 일본어 버전' },
    { region: '글로벌', issue: '연령 제한', action: '13세 미만 COPPA 대응 검토' },
  ],

  // 경쟁사 (시장별 유사 서비스)
  competitors: [
    { region: '글로벌', services: ['16personalities', 'Truity', 'IDRlabs'] },
    { region: '일본', services: ['mgram', '16TEST', 'ホイミー'] },
    { region: '한국', services: ['케미테스트(우리)', '방금전테스트', 'MBTI 각종'] },
  ],
};

// ============================================================================
// 통합 전략 객체
// ============================================================================

export const GLOBAL_EXPANSION_STRATEGY = {
  languages: TARGET_LANGUAGES,
  infrastructure: I18N_INFRASTRUCTURE,
  translation: TRANSLATION_STRATEGY,
  phases: GLOBAL_PHASES,
  markets: MARKET_STRATEGIES,
  workflow: TRANSLATION_WORKFLOW,
  futureConsiderations: FUTURE_CONSIDERATIONS,
};

export default GLOBAL_EXPANSION_STRATEGY;
