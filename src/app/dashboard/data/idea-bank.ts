// ============================================================================
// 아이디어 뱅크 - 모든 콘텐츠 아이디어 통합 관리
// ============================================================================
// 월드컵, 퀴즈, 투표 등 다양한 콘텐츠 아이디어를 테마별로 수집/관리
// 아이디어 → 기획 → 구현 단계로 발전시킴

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
  | 'planning'        // 🎨 기획 중
  | 'ready'           // ✅ 구현 준비됨
  | 'in-progress'     // 🚧 진행 중
  | 'completed'       // ✨ 완료
  | 'paused';         // ⏸️ 보류

export type ViralPotential = 'very-high' | 'high' | 'medium' | 'low';

// ============================================================================
// 테마 정의
// ============================================================================

export interface Theme {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  targetAudience: string;        // 타겟 오디언스
  estimatedData: {               // 수집 가능한 데이터 예상량
    min: number;
    max: number;
    current: number;             // 현재 수집된 양
  };
  ideas: ContentIdea[];          // 이 테마에 대한 콘텐츠 아이디어들
}

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
    potential: ViralPotential;   // 바이럴 가능성
    reasons: string[];            // 바이럴 포인트
  };
  implementation: {
    difficulty: 1 | 2 | 3;        // 구현 난이도 (1: 쉬움, 3: 어려움)
    estimatedTime: string;        // 예상 소요 시간
    dependencies: string[];       // 필요한 선행 작업
  };
  strategy?: {
    phase?: string;               // Phase 1, Phase 2, etc.
    priority?: 'high' | 'medium' | 'low';
    notes?: string[];             // 전략적 고려사항
  };
  examples?: string[];            // 구체적인 예시
  relatedFile?: string;           // 관련 파일 경로 (예: worldcups/japanese-anime/)
  addedAt: string;                // 아이디어 추가 날짜
  updatedAt?: string;             // 마지막 수정 날짜
}

// ============================================================================
// 테마 데이터
// ============================================================================

export const THEMES: Theme[] = [
  {
    id: 'japanese-anime',
    name: '일본 애니메이션',
    icon: '🎬',
    description: '애니메이션 덕후들을 위한 다양한 콘텐츠',
    color: '#ff6b9d',
    targetAudience: '10-30대 애니메이션 팬층',
    estimatedData: {
      min: 100,
      max: 200,
      current: 30,  // worldcups/japanese-anime/candidates.md 기준
    },
    ideas: [
      // ========== 월드컵 ==========
      {
        id: 'anime-worldcup',
        category: 'worldcup',
        title: '애니메이션 월드컵',
        description: '32강/64강 토너먼트로 최애 애니 선택',
        status: 'in-progress',
        viral: {
          potential: 'very-high',
          reasons: [
            '선택 강제로 몰입도 최고',
            '논쟁 유발 ("어떻게 XX가 이겨?!")',
            '반복 플레이 유도 (친구와 비교)',
            '매번 다른 매칭으로 리플레이성 높음',
          ],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1일 (기존 worldcup 구조 활용)',
          dependencies: ['100개 후보 데이터 수집'],
        },
        strategy: {
          phase: 'Phase 1',
          priority: 'high',
          notes: [
            '기존 worldcups/ 폴더 구조 활용 가능',
            'candidates.md에 이미 30개 수집 중',
            '빠른 출시로 초기 트래픽 확보',
          ],
        },
        relatedFile: 'worldcups/japanese-anime/',
        addedAt: '2025-12-23',
      },

      // ========== 티어 투표 ==========
      {
        id: 'anime-tier-vote',
        category: 'tier-vote',
        title: '애니메이션 티어 리스트 투표',
        description: '집단지성으로 애니메이션을 S~F 티어로 분류',
        status: 'idea',
        viral: {
          potential: 'very-high',
          reasons: [
            '논쟁 폭발 ("나루토가 B?!")',
            '실시간 순위 변동으로 재방문 유도',
            '팬덤 동원력 (투표 독려)',
            '언론 기사화 가능성 ("네티즌이 뽑은 최고의 애니는?")',
          ],
        },
        implementation: {
          difficulty: 2,
          estimatedTime: '3-5일',
          dependencies: [
            '투표 시스템 구현',
            '실시간 집계 로직',
            '티어 변동 알고리즘',
          ],
        },
        strategy: {
          phase: 'Phase 1',
          priority: 'high',
          notes: [
            '월드컵과 상호 보완 (개인 vs 집단)',
            '크로스 프로모션: 월드컵 우승작 vs 티어 S급',
          ],
        },
        examples: [
          'S티어: 신작/명작',
          'A티어: 인기작',
          'B티어: 평타',
          'C~F티어: 호불호/실패작',
        ],
        addedAt: '2025-12-23',
      },

      // ========== 밸런스 게임 ==========
      {
        id: 'anime-balance-game',
        category: 'balance-game',
        title: '애니 밸런스 게임',
        description: '극한의 선택으로 취향 테스트',
        status: 'idea',
        viral: {
          potential: 'high',
          reasons: [
            '선택 고통으로 공감대 형성',
            '댓글 폭발 예상',
            '진영 싸움 유도',
          ],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1-2일',
          dependencies: ['VS 질문 20개 이상 기획'],
        },
        strategy: {
          phase: 'Phase 2',
          priority: 'medium',
        },
        examples: [
          '나루토 vs 원피스 평생 1개만?',
          '작붕 심한 띵작 vs 작화 좋은 쓰레기',
          '신작 몰아보기 vs 명작 천천히 정주행',
          '완결 애니 vs 미완결 애니',
        ],
        addedAt: '2025-12-23',
      },

      // ========== MBTI 테스트 ==========
      {
        id: 'anime-mbti-test',
        category: 'mbti-test',
        title: '애니 취향으로 보는 MBTI',
        description: '애니 선호도 기반 성향 분석 테스트',
        status: 'idea',
        viral: {
          potential: 'high',
          reasons: [
            'MBTI 콘텐츠 인기',
            '결과 공유 욕구',
            '추천 알고리즘 자연스럽게 연결',
          ],
        },
        implementation: {
          difficulty: 2,
          estimatedTime: '3-5일',
          dependencies: [
            '기존 MBTI 시스템 재활용',
            '결과 유형 8-12개 설계',
            '차원 정의 (장르, 스타일, 시청 패턴 등)',
          ],
        },
        strategy: {
          phase: 'Phase 2',
          priority: 'medium',
          notes: [
            '기존 src/data/subjects/ 구조 활용',
            '결과별 추천 애니 리스트 포함',
          ],
        },
        examples: [
          '질문: 주말에 뭐 볼까? (신작/정주행/재시청)',
          '질문: 좋아하는 장르는? (소년/소녀/일상/판타지)',
          '질문: 최애 캐릭터 유형은? (주인공/빌런/조연)',
          '결과: "당신은 소년만화형! 추천작: XXX"',
        ],
        addedAt: '2025-12-23',
      },

      // ========== 퀴즈 ==========
      {
        id: 'anime-quiz',
        category: 'quiz',
        title: '애니 덕후 인증 퀴즈',
        description: '난이도별 애니 지식 테스트',
        status: 'idea',
        viral: {
          potential: 'medium',
          reasons: [
            '점수 자랑으로 SNS 공유',
            '난이도 조절로 재도전 유도',
          ],
        },
        implementation: {
          difficulty: 2,
          estimatedTime: '2-3일',
          dependencies: [
            '난이도별 문제 30개 이상',
            '점수 등급 시스템',
          ],
        },
        strategy: {
          phase: 'Phase 2',
          priority: 'low',
          notes: ['오답 시 이탈 위험 있음'],
        },
        examples: [
          'Lv1: 국민 애니 (원피스, 나루토)',
          'Lv2: 인기작 (하이큐, 귀멸의 칼날)',
          'Lv3: 마니아 (니치조, 은수저)',
          '등급: 뉴비/애니러/오타쿠/갓타쿠',
        ],
        addedAt: '2025-12-23',
      },

      // ========== 체크리스트 ==========
      {
        id: 'anime-checklist',
        category: 'checklist',
        title: '이 애니 봤어? 안 봤어?',
        description: 'FOMO 자극하는 시청 체크리스트',
        status: 'idea',
        viral: {
          potential: 'high',
          reasons: [
            '사회적 증거 ("90%가 봤는데 나만 몰라?")',
            '체크리스트 중독성',
            '데이터 수집 용이',
          ],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1-2일',
          dependencies: ['애니 목록 100개'],
        },
        strategy: {
          phase: 'Phase 3',
          priority: 'medium',
          notes: [
            '추천 알고리즘 데이터 수집',
            '결과: "상위 X% 애니덕!"',
          ],
        },
        addedAt: '2025-12-23',
      },

      // ========== 추천 시스템 ==========
      {
        id: 'anime-recommend',
        category: 'recommend',
        title: '취향 저격 애니 추천',
        description: '최애 3개 선택하면 AI 추천',
        status: 'idea',
        viral: {
          potential: 'medium',
          reasons: [
            '개인화 만족도',
            '발견의 기쁨',
          ],
        },
        implementation: {
          difficulty: 3,
          estimatedTime: '1주 이상',
          dependencies: [
            '유사도 알고리즘',
            '충분한 데이터',
            '장르/태그 시스템',
          ],
        },
        strategy: {
          phase: 'Phase 3',
          priority: 'low',
          notes: [
            '초기 데이터 필요 (콜드 스타트 문제)',
            '다른 콘텐츠로 데이터 쌓은 후 구현',
          ],
        },
        examples: [
          '"원피스, 헌터헌터, 강철의 연금술사를 좋아한다면..."',
          '"이건 어때요?"',
        ],
        addedAt: '2025-12-23',
      },
    ],
  },

  // ========== 음악 (Music) ==========
  {
    id: 'music',
    name: '음악',
    icon: '🎵',
    description: '노래, 아티스트, 장르별 월드컵/투표',
    color: '#a29bfe',
    targetAudience: '전 연령대 (특히 10-30대)',
    estimatedData: {
      min: 100,
      max: 500,
      current: 0,  // 차트 데이터 활용 가능
    },
    ideas: [
      // 월드컵
      {
        id: 'music-worldcup',
        category: 'worldcup',
        title: '명곡 월드컵',
        description: '역대 명곡 중 최고의 노래 선정 (연도별/장르별)',
        status: 'idea',
        viral: {
          potential: 'very-high',
          reasons: [
            '음악은 누구나 관심 있는 주제',
            '세대별 취향 차이로 논쟁 유발',
            '유튜브 음악 연동 시 체류 시간 증가',
            '연도별/장르별 다양한 버전 가능',
          ],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1-2일',
          dependencies: [
            '차트 데이터 수집 (멜론/지니/빌보드)',
            '유튜브 미리듣기 연동 (선택)',
          ],
        },
        strategy: {
          phase: 'Phase 1',
          priority: 'high',
          notes: [
            '기존 차트 데이터 활용 가능 (수집 쉬움)',
            '연도별: 80년대, 90년대, 2000년대, 2010년대, 2020년대',
            '장르별: 발라드, 댄스, 힙합, 인디, 트로트',
          ],
        },
        examples: [
          '역대 명곡 월드컵 128강',
          '2000년대 명곡 월드컵 64강',
          '발라드 명곡 월드컵 32강',
        ],
        addedAt: '2025-12-23',
      },

      // 티어 투표
      {
        id: 'music-tier-vote',
        category: 'tier-vote',
        title: '아티스트 티어 투표',
        description: '가수/그룹을 S~F 티어로 평가',
        status: 'idea',
        viral: {
          potential: 'very-high',
          reasons: [
            '팬덤 동원력 극대화',
            '논쟁 폭발 예상 ("BTS가 A티어?!")',
            '실시간 순위 변동으로 재방문 유도',
            '언론 기사화 가능성',
          ],
        },
        implementation: {
          difficulty: 2,
          estimatedTime: '3-5일',
          dependencies: [
            '투표 시스템',
            '실시간 집계',
            '아티스트 데이터 100개 이상',
          ],
        },
        strategy: {
          phase: 'Phase 1',
          priority: 'high',
          notes: [
            '팬덤 전쟁 주의 (긍정적 논쟁 유도)',
            '세대별/장르별 분리 투표 고려',
          ],
        },
        examples: [
          'K-POP 아티스트 티어',
          '한국 가수 역대 티어',
          '힙합 아티스트 티어',
        ],
        addedAt: '2025-12-23',
      },

      // 밸런스 게임
      {
        id: 'music-balance-game',
        category: 'balance-game',
        title: '음악 밸런스 게임',
        description: '극한의 음악 선택',
        status: 'idea',
        viral: {
          potential: 'high',
          reasons: [
            '선택 고통으로 공감대',
            '댓글/공유 유도',
          ],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1일',
          dependencies: ['VS 질문 20개'],
        },
        strategy: {
          phase: 'Phase 2',
          priority: 'medium',
        },
        examples: [
          '평생 발라드만 vs 평생 댄스만?',
          '좋아하는 가수 은퇴 vs 싫어하는 가수 메가히트?',
          '라이브 못하는 띵곡 가수 vs 라이브 잘하는 평범한 가수?',
          '1곡만 평생 vs 매일 새 노래 듣지만 기억 안남?',
        ],
        addedAt: '2025-12-23',
      },

      // 체크리스트
      {
        id: 'music-checklist',
        category: 'checklist',
        title: '이 노래 아는 사람? (세대별 명곡)',
        description: '세대별 필수 명곡 체크리스트',
        status: 'idea',
        viral: {
          potential: 'high',
          reasons: [
            '세대 구분 명확 (80/90/00/10/20년대)',
            'FOMO 자극 ("나만 모르나?")',
            '점수로 세대 인증',
          ],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1-2일',
          dependencies: ['세대별 명곡 리스트 100곡'],
        },
        strategy: {
          phase: 'Phase 2',
          priority: 'medium',
          notes: [
            '세대별 체크리스트 분리',
            '결과: "당신은 X세대!" 또는 "상위 X% 음악 덕후"',
          ],
        },
        examples: [
          '80년대생 필수 명곡 50',
          '90년대생 필수 명곡 50',
          '2000년대 필수 명곡 50',
        ],
        addedAt: '2025-12-23',
      },
    ],
  },

  // ========== 외식/음식 (Food) ==========
  {
    id: 'food',
    name: '외식/음식',
    icon: '🍕',
    description: '음식, 맛집, 메뉴 월드컵/투표',
    color: '#ff6b6b',
    targetAudience: '전 연령대',
    estimatedData: {
      min: 50,
      max: 200,
      current: 0,
    },
    ideas: [
      // 월드컵
      {
        id: 'food-worldcup',
        category: 'worldcup',
        title: '음식 월드컵',
        description: '최고의 음식/메뉴 선정',
        status: 'idea',
        viral: {
          potential: 'very-high',
          reasons: [
            '음식은 보편적 관심사',
            '선택 고통 + 입맛 논쟁',
            '배고픔 유발로 체류 시간 증가',
            '다양한 카테고리 가능 (한식/양식/중식/일식/분식/디저트)',
          ],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1-2일',
          dependencies: [
            '음식 이미지/사진 수집',
            '카테고리별 후보 선정',
          ],
        },
        strategy: {
          phase: 'Phase 1',
          priority: 'high',
          notes: [
            '이미지 중요 (맛있어 보이는 사진)',
            '카테고리별 분리: 한식, 중식, 일식, 양식, 분식, 치킨, 디저트',
            '음식 배달 앱 연동 가능성',
          ],
        },
        examples: [
          '한식 월드컵 64강',
          '치킨 메뉴 월드컵 32강',
          '디저트 월드컵 32강',
          '편의점 음식 월드컵 32강',
        ],
        addedAt: '2025-12-23',
      },

      // 티어 투표
      {
        id: 'food-tier-vote',
        category: 'tier-vote',
        title: '음식 티어 투표',
        description: '음식/메뉴를 S~F 티어로 평가',
        status: 'idea',
        viral: {
          potential: 'high',
          reasons: [
            '취향 논쟁 유발',
            '지역/세대별 차이',
            '의외의 결과로 화제',
          ],
        },
        implementation: {
          difficulty: 2,
          estimatedTime: '3일',
          dependencies: ['투표 시스템', '음식 데이터 100개'],
        },
        strategy: {
          phase: 'Phase 2',
          priority: 'medium',
        },
        examples: [
          '한식 티어',
          '치킨 브랜드 티어',
          '편의점 도시락 티어',
        ],
        addedAt: '2025-12-23',
      },

      // 밸런스 게임
      {
        id: 'food-balance-game',
        category: 'balance-game',
        title: '음식 밸런스 게임',
        description: '극한의 음식 선택',
        status: 'idea',
        viral: {
          potential: 'very-high',
          reasons: [
            '선택 고통 극대화',
            '댓글 폭발 예상',
            '친구와 비교 욕구',
          ],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1일',
          dependencies: ['VS 질문 30개'],
        },
        strategy: {
          phase: 'Phase 1',
          priority: 'high',
          notes: ['Quick Win - 쉽고 바이럴 높음'],
        },
        examples: [
          '평생 치킨만 vs 평생 피자만?',
          '평생 매운 음식 금지 vs 평생 단 음식 금지?',
          '맛있는데 살찌는 음식 vs 맛없는데 살 안찌는 음식?',
          '평생 배달만 vs 평생 직접 요리만?',
          '평생 한식만 vs 평생 양식만?',
          '평생 점심 거르기 vs 평생 저녁 거르기?',
        ],
        addedAt: '2025-12-23',
      },

      // MBTI 테스트
      {
        id: 'food-mbti',
        category: 'mbti-test',
        title: '음식 취향 MBTI',
        description: '음식 선호도로 성향 분석',
        status: 'idea',
        viral: {
          potential: 'high',
          reasons: [
            'MBTI 인기',
            '결과 공유 욕구',
            '음식 추천으로 실용성',
          ],
        },
        implementation: {
          difficulty: 2,
          estimatedTime: '3-5일',
          dependencies: [
            '차원 정의 (매운맛/단맛/식감/양/가격 등)',
            '결과 유형 8-12개',
          ],
        },
        strategy: {
          phase: 'Phase 2',
          priority: 'medium',
        },
        examples: [
          '차원: 매운맛/단맛/짠맛 선호도',
          '차원: 식감 (부드러움/바삭함)',
          '차원: 양 (소식/대식)',
          '차원: 새로운 음식 도전 vs 익숙한 음식',
          '결과: "당신은 모험가형 미식가!"',
        ],
        addedAt: '2025-12-23',
      },

      // 체크리스트
      {
        id: 'food-checklist',
        category: 'checklist',
        title: '이 음식 먹어봤어?',
        description: '한국인 필수 음식 체크리스트',
        status: 'idea',
        viral: {
          potential: 'medium',
          reasons: [
            'FOMO 자극',
            '버킷리스트 효과',
          ],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1일',
          dependencies: ['음식 리스트 100개'],
        },
        strategy: {
          phase: 'Phase 3',
          priority: 'low',
        },
        examples: [
          '한국인 필수 음식 100',
          '서울 맛집 체크리스트',
          '한국 길거리 음식 체크리스트',
        ],
        addedAt: '2025-12-23',
      },
    ],
  },

  // ========== 게임 (Games) ==========
  {
    id: 'games',
    name: '게임',
    icon: '🎮',
    description: 'PC/모바일/콘솔 게임 월드컵/투표',
    color: '#00b894',
    targetAudience: '10-30대 (특히 남성)',
    estimatedData: {
      min: 100,
      max: 500,
      current: 0,
    },
    ideas: [
      {
        id: 'game-worldcup',
        category: 'worldcup',
        title: '게임 월드컵',
        description: '역대 명작 게임 중 최고 선정 (플랫폼별/장르별)',
        status: 'idea',
        viral: {
          potential: 'very-high',
          reasons: [
            '게이머 커뮤니티 활발',
            'e스포츠 팬덤 동원력',
            '플랫폼/장르별 논쟁 유발',
            '게임 캐릭터, OST 등 파생 콘텐츠 풍부',
          ],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1-2일',
          dependencies: ['게임 데이터 수집', '이미지/로고 확보'],
        },
        strategy: {
          phase: 'Phase 1',
          priority: 'high',
        },
        examples: [
          'PC게임 월드컵 64강',
          '모바일게임 월드컵 32강',
          '콘솔게임 월드컵 64강',
          '게임 캐릭터 월드컵',
        ],
        addedAt: '2025-12-23',
      },
      {
        id: 'game-tier-vote',
        category: 'tier-vote',
        title: '게임 티어 투표',
        description: '역대 게임을 S~F 티어로 평가',
        status: 'idea',
        viral: {
          potential: 'very-high',
          reasons: ['게이머들의 강한 의견', '명작 논쟁'],
        },
        implementation: {
          difficulty: 2,
          estimatedTime: '3일',
          dependencies: ['투표 시스템'],
        },
        strategy: {
          phase: 'Phase 2',
          priority: 'medium',
        },
        addedAt: '2025-12-23',
      },
      {
        id: 'game-balance-game',
        category: 'balance-game',
        title: '게임 밸런스 게임',
        description: '극한의 게임 선택',
        status: 'idea',
        viral: {
          potential: 'high',
          reasons: ['선택 고통', 'SNS 공유 욕구'],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1일',
          dependencies: ['VS 질문 20개'],
        },
        examples: [
          '평생 롤만 vs 평생 배그만?',
          '평생 PC게임만 vs 평생 모바일만?',
          '좋아하는 게임 서비스 종료 vs 싫어하는 게임 역대급 업데이트?',
        ],
        addedAt: '2025-12-23',
      },
    ],
  },

  // ========== 드라마/영화 (Drama/Movie) ==========
  {
    id: 'drama-movie',
    name: '드라마/영화',
    icon: '📺',
    description: '한국/해외 드라마, 영화 월드컵/투표',
    color: '#6c5ce7',
    targetAudience: '전 연령대',
    estimatedData: {
      min: 100,
      max: 400,
      current: 0,
    },
    ideas: [
      {
        id: 'drama-worldcup',
        category: 'worldcup',
        title: '드라마 월드컵',
        description: '역대 한국 드라마 중 최고 선정',
        status: 'idea',
        viral: {
          potential: 'very-high',
          reasons: [
            '넷플릭스/티빙 시대 관심도 높음',
            '한국 드라마 해외 인기',
            'OST, 배우, 명대사 파생 콘텐츠',
            '세대별 추억 드라마 논쟁',
          ],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1-2일',
          dependencies: ['드라마 포스터 이미지', '방영년도 정보'],
        },
        strategy: {
          phase: 'Phase 1',
          priority: 'high',
        },
        examples: [
          '역대 한국 드라마 월드컵 64강',
          '넷플릭스 시리즈 월드컵 32강',
          '한국 영화 월드컵 64강',
          '드라마 OST 월드컵',
        ],
        addedAt: '2025-12-23',
      },
      {
        id: 'drama-tier-vote',
        category: 'tier-vote',
        title: '드라마/영화 티어 투표',
        description: '드라마/영화를 S~F 티어로 평가',
        status: 'idea',
        viral: {
          potential: 'very-high',
          reasons: ['명작 논쟁', '취향 차이 극명'],
        },
        implementation: {
          difficulty: 2,
          estimatedTime: '3일',
          dependencies: ['투표 시스템'],
        },
        examples: ['한국 드라마 티어', '넷플릭스 오리지널 티어'],
        addedAt: '2025-12-23',
      },
      {
        id: 'drama-balance-game',
        category: 'balance-game',
        title: '드라마/영화 밸런스 게임',
        status: 'idea',
        viral: {
          potential: 'high',
          reasons: ['선택 고통'],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1일',
          dependencies: ['VS 질문 20개'],
        },
        examples: [
          '평생 로맨스만 vs 평생 액션만?',
          '평생 한국 드라마만 vs 평생 미드만?',
        ],
        addedAt: '2025-12-23',
      },
    ],
  },

  // ========== 스포츠/선수 (Sports) ==========
  {
    id: 'sports',
    name: '스포츠/선수',
    icon: '⚽',
    description: '축구/야구/농구 등 스포츠 선수/팀 투표',
    color: '#fd79a8',
    targetAudience: '10-50대 (특히 남성)',
    estimatedData: {
      min: 100,
      max: 300,
      current: 0,
    },
    ideas: [
      {
        id: 'sports-worldcup',
        category: 'worldcup',
        title: '축구 선수 월드컵',
        description: '역대 축구 선수 중 최고 선정',
        status: 'idea',
        viral: {
          potential: 'very-high',
          reasons: [
            '팬덤 강함',
            '메시 vs 호날두 등 영원한 논쟁',
            '손흥민/이강인 등 한국 선수 인기',
          ],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1-2일',
          dependencies: ['선수 데이터/사진'],
        },
        strategy: {
          phase: 'Phase 2',
          priority: 'medium',
        },
        examples: [
          '역대 축구선수 월드컵 64강',
          '현역 축구선수 월드컵 32강',
          'EPL 팀 월드컵',
        ],
        addedAt: '2025-12-23',
      },
      {
        id: 'sports-tier-vote',
        category: 'tier-vote',
        title: '축구팀 티어 투표',
        status: 'idea',
        viral: {
          potential: 'high',
          reasons: ['팬덤 전쟁'],
        },
        implementation: {
          difficulty: 2,
          estimatedTime: '3일',
          dependencies: ['투표 시스템'],
        },
        addedAt: '2025-12-23',
      },
    ],
  },

  // ========== 여행지 (Travel) ==========
  {
    id: 'travel',
    name: '여행지',
    icon: '✈️',
    description: '국내/해외 여행지, 관광지 월드컵/투표',
    color: '#74b9ff',
    targetAudience: '20-40대',
    estimatedData: {
      min: 50,
      max: 200,
      current: 0,
    },
    ideas: [
      {
        id: 'travel-worldcup',
        category: 'worldcup',
        title: '여행지 월드컵',
        description: '국내/해외 여행지 중 최고 선정',
        status: 'idea',
        viral: {
          potential: 'very-high',
          reasons: [
            '시각적 콘텐츠 (사진/영상)',
            '버킷리스트 욕구 자극',
            '여행 수요 증가 (코로나 이후)',
          ],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1-2일',
          dependencies: ['여행지 사진', '지역 정보'],
        },
        strategy: {
          phase: 'Phase 2',
          priority: 'medium',
        },
        examples: [
          '국내 여행지 월드컵 32강',
          '해외 여행지 월드컵 64강',
          '유럽 도시 월드컵',
        ],
        addedAt: '2025-12-23',
      },
      {
        id: 'travel-checklist',
        category: 'checklist',
        title: '평생 가봐야 할 여행지 100',
        status: 'idea',
        viral: {
          potential: 'high',
          reasons: ['버킷리스트 효과', 'FOMO'],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1일',
          dependencies: ['여행지 리스트 100개'],
        },
        strategy: {
          phase: 'Phase 3',
          priority: 'low',
        },
        addedAt: '2025-12-23',
      },

      // 티어 투표
      {
        id: 'travel-tier-vote',
        category: 'tier-vote',
        title: '가고 싶은 나라 티어 투표',
        description: '전 세계 여행지를 S~F 티어로 평가',
        status: 'idea',
        viral: {
          potential: 'very-high',
          reasons: [
            '여행 로망 자극',
            '국가별 이미지 논쟁 (일본, 중국 등)',
            '여행 트렌드 반영',
            '지역별 취향 차이 극명',
          ],
        },
        implementation: {
          difficulty: 2,
          estimatedTime: '3일',
          dependencies: ['투표 시스템', '국가/도시 데이터 100개'],
        },
        strategy: {
          phase: 'Phase 2',
          priority: 'high',
          notes: [
            '국가 이미지 논쟁 가능성',
            '카테고리 분리: 국가, 도시, 휴양지, 관광지',
          ],
        },
        examples: [
          '가고 싶은 나라 티어',
          '유럽 도시 티어',
          '아시아 여행지 티어',
          '휴양지 티어',
        ],
        addedAt: '2025-12-23',
      },

      // 밸런스 게임
      {
        id: 'travel-balance-game',
        category: 'balance-game',
        title: '여행 밸런스 게임',
        description: '극한의 여행 선택',
        status: 'idea',
        viral: {
          potential: 'very-high',
          reasons: [
            '여행 FOMO 자극',
            '현실적 고민 반영 (비용, 시간)',
            '선택 고통 극대화',
            '댓글 공감 폭발',
          ],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1일',
          dependencies: ['VS 질문 30개'],
        },
        strategy: {
          phase: 'Phase 1',
          priority: 'high',
          notes: ['Quick Win - 쉽고 바이럴 높음', '여행 시즌 타겟'],
        },
        examples: [
          '평생 국내만 vs 평생 해외만?',
          '유럽 1달 vs 동남아 3달?',
          '혼자 자유여행 vs 친구랑 패키지?',
          '럭셔리 3일 vs 배낭여행 2주?',
          '일본 10번 vs 유럽 1번?',
          '맛집 투어 vs 관광지 투어?',
          '도시 여행 vs 자연 여행?',
          '사진 많이 vs 눈에 담기?',
          '계획적 여행 vs 즉흥 여행?',
          '평생 여름 휴양지만 vs 평생 겨울 스키장만?',
        ],
        addedAt: '2025-12-23',
      },

      // MBTI 테스트
      {
        id: 'travel-mbti',
        category: 'mbti-test',
        title: '여행 스타일 MBTI',
        description: '여행 성향으로 여행자 유형 분석',
        status: 'idea',
        viral: {
          potential: 'high',
          reasons: [
            '여행 동행자 매칭 가능',
            '자기 이해 + 실용성',
            '결과 공유 욕구',
          ],
        },
        implementation: {
          difficulty: 2,
          estimatedTime: '3-5일',
          dependencies: [
            '차원 정의 (계획성, 활동성, 예산, 동행 등)',
            '결과 유형 8-12개',
          ],
        },
        strategy: {
          phase: 'Phase 2',
          priority: 'medium',
        },
        examples: [
          '차원: 계획형 vs 즉흥형',
          '차원: 활동적 vs 휴식형',
          '차원: 문화 체험 vs 자연 감상',
          '차원: 혼행 vs 단체',
          '결과: "당신은 모험가형 여행자!"',
          '결과: "힐링 추구형 여행자"',
        ],
        addedAt: '2025-12-23',
      },
    ],
  },

  // ========== 자동차/브랜드 (Cars) ==========
  {
    id: 'cars',
    name: '자동차',
    icon: '🚗',
    description: '자동차 브랜드/모델 월드컵/투표',
    color: '#636e72',
    targetAudience: '20-50대 남성',
    estimatedData: {
      min: 50,
      max: 150,
      current: 0,
    },
    ideas: [
      {
        id: 'cars-tier-vote',
        category: 'tier-vote',
        title: '자동차 브랜드 티어 투표',
        description: '자동차 브랜드를 S~F 티어로 평가',
        status: 'idea',
        viral: {
          potential: 'high',
          reasons: [
            '브랜드 충성도 강함',
            '현대 vs 기아, 수입차 vs 국산차 논쟁',
          ],
        },
        implementation: {
          difficulty: 2,
          estimatedTime: '3일',
          dependencies: ['투표 시스템', '브랜드 데이터'],
        },
        strategy: {
          phase: 'Phase 3',
          priority: 'low',
        },
        addedAt: '2025-12-23',
      },
      {
        id: 'cars-worldcup',
        category: 'worldcup',
        title: '드림카 월드컵',
        status: 'idea',
        viral: {
          potential: 'medium',
          reasons: ['남성 타겟 관심사'],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '2일',
          dependencies: ['자동차 이미지'],
        },
        addedAt: '2025-12-23',
      },
    ],
  },

  // ========== 뷰티/패션 (Beauty/Fashion) ==========
  {
    id: 'beauty-fashion',
    name: '뷰티/패션',
    icon: '💄',
    description: '화장품, 패션 브랜드/제품 월드컵/투표',
    color: '#fd79a8',
    targetAudience: '10-30대 여성',
    estimatedData: {
      min: 50,
      max: 200,
      current: 0,
    },
    ideas: [
      {
        id: 'beauty-worldcup',
        category: 'worldcup',
        title: '립스틱 월드컵',
        description: '인기 립스틱 제품 중 최고 선정',
        status: 'idea',
        viral: {
          potential: 'high',
          reasons: [
            '여성 타겟 관심사',
            '인스타그램 문화 연계',
            '제품 추천으로 수익화 가능',
          ],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1-2일',
          dependencies: ['제품 이미지', '브랜드 정보'],
        },
        strategy: {
          phase: 'Phase 3',
          priority: 'low',
        },
        examples: ['립스틱 월드컵', '쿠션 월드컵', '향수 월드컵'],
        addedAt: '2025-12-23',
      },
      {
        id: 'fashion-tier-vote',
        category: 'tier-vote',
        title: '패션 브랜드 티어 투표',
        status: 'idea',
        viral: {
          potential: 'medium',
          reasons: ['브랜드 선호도'],
        },
        implementation: {
          difficulty: 2,
          estimatedTime: '3일',
          dependencies: ['투표 시스템'],
        },
        addedAt: '2025-12-23',
      },
    ],
  },

  // ========== 반려동물 (Pets) ==========
  {
    id: 'pets',
    name: '반려동물',
    icon: '🐶',
    description: '강아지/고양이 품종, 반려동물 콘텐츠',
    color: '#fdcb6e',
    targetAudience: '전 연령대 (반려인)',
    estimatedData: {
      min: 30,
      max: 100,
      current: 0,
    },
    ideas: [
      {
        id: 'pets-worldcup',
        category: 'worldcup',
        title: '강아지 품종 월드컵',
        description: '인기 강아지 품종 중 최고 선정',
        status: 'idea',
        viral: {
          potential: 'very-high',
          reasons: [
            '반려인구 1,500만 시대',
            '귀여움 = 바이럴',
            '사진/영상 중심 콘텐츠',
          ],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1-2일',
          dependencies: ['품종 사진', '품종 정보'],
        },
        strategy: {
          phase: 'Phase 2',
          priority: 'medium',
        },
        examples: ['강아지 품종 월드컵', '고양이 품종 월드컵', '반려동물 이름 월드컵'],
        addedAt: '2025-12-23',
      },
      {
        id: 'pets-balance-game',
        category: 'balance-game',
        title: '반려동물 밸런스 게임',
        status: 'idea',
        viral: {
          potential: 'high',
          reasons: ['강아지 vs 고양이 영원한 논쟁'],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1일',
          dependencies: ['VS 질문 20개'],
        },
        examples: ['평생 강아지만 vs 평생 고양이만?'],
        addedAt: '2025-12-23',
      },
    ],
  },

  // ========== 브랜드/제품 (Brands) ==========
  {
    id: 'brands',
    name: '브랜드/제품',
    icon: '📱',
    description: '스마트폰, 카페, 편의점 등 일상 브랜드',
    color: '#0984e3',
    targetAudience: '전 연령대',
    estimatedData: {
      min: 50,
      max: 150,
      current: 0,
    },
    ideas: [
      {
        id: 'brands-tier-vote',
        category: 'tier-vote',
        title: '스마트폰 브랜드 티어 투표',
        description: '애플, 삼성 등 브랜드 티어 평가',
        status: 'idea',
        viral: {
          potential: 'very-high',
          reasons: [
            '일상 밀접 제품',
            '애플 vs 삼성 논쟁',
            '수익화 가능성 (제휴 광고)',
          ],
        },
        implementation: {
          difficulty: 2,
          estimatedTime: '3일',
          dependencies: ['투표 시스템'],
        },
        strategy: {
          phase: 'Phase 2',
          priority: 'medium',
        },
        examples: [
          '스마트폰 브랜드 티어',
          '카페 브랜드 티어',
          '편의점 티어',
          '라면 브랜드 티어',
        ],
        addedAt: '2025-12-23',
      },
      {
        id: 'brands-worldcup',
        category: 'worldcup',
        title: '라면 월드컵',
        status: 'idea',
        viral: {
          potential: 'high',
          reasons: ['국민 간식'],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1일',
          dependencies: ['라면 제품 이미지'],
        },
        addedAt: '2025-12-23',
      },
    ],
  },

  // ========== 웹툰/웹소설 (Webtoon) ==========
  {
    id: 'webtoon',
    name: '웹툰/웹소설',
    icon: '📖',
    description: '웹툰, 웹소설 작품/캐릭터 월드컵/투표',
    color: '#00b894',
    targetAudience: '10-30대',
    estimatedData: {
      min: 100,
      max: 300,
      current: 0,
    },
    ideas: [
      {
        id: 'webtoon-worldcup',
        category: 'worldcup',
        title: '웹툰 월드컵',
        description: '역대 웹툰 중 최고 선정',
        status: 'idea',
        viral: {
          potential: 'very-high',
          reasons: [
            '10-20대 독자층 두꺼움',
            '네이버/카카오 플랫폼 활성화',
            '드라마/영화 원작 화제성',
          ],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1-2일',
          dependencies: ['웹툰 썸네일', '작품 정보'],
        },
        strategy: {
          phase: 'Phase 2',
          priority: 'medium',
        },
        examples: ['역대 웹툰 월드컵 64강', '웹툰 주인공 월드컵', '장르별 웹툰 월드컵'],
        addedAt: '2025-12-23',
      },
      {
        id: 'webtoon-tier-vote',
        category: 'tier-vote',
        title: '웹툰 티어 투표',
        status: 'idea',
        viral: {
          potential: 'high',
          reasons: ['독자 충성도', '플랫폼별 논쟁'],
        },
        implementation: {
          difficulty: 2,
          estimatedTime: '3일',
          dependencies: ['투표 시스템'],
        },
        addedAt: '2025-12-23',
      },
    ],
  },

  // ========== 유튜버/인플루언서 (YouTubers) ==========
  {
    id: 'youtubers',
    name: '유튜버/인플루언서',
    icon: '🎥',
    description: '유튜버, 스트리머, 인플루언서 투표',
    color: '#e17055',
    targetAudience: '10-30대 (Z세대)',
    estimatedData: {
      min: 100,
      max: 300,
      current: 0,
    },
    ideas: [
      {
        id: 'youtubers-tier-vote',
        category: 'tier-vote',
        title: '유튜버 티어 투표',
        description: '한국 유튜버를 S~F 티어로 평가',
        status: 'idea',
        viral: {
          potential: 'very-high',
          reasons: [
            'Z세대 관심사 1순위',
            '팬덤 강함',
            '구독자 순위 논쟁',
            '실시간 이슈 반영 가능',
          ],
        },
        implementation: {
          difficulty: 2,
          estimatedTime: '3일',
          dependencies: ['투표 시스템', '유튜버 데이터'],
        },
        strategy: {
          phase: 'Phase 2',
          priority: 'high',
          notes: ['논란 유튜버 제외 필요', '카테고리별 분리 (먹방/게임/브이로그 등)'],
        },
        examples: ['한국 유튜버 티어', '먹방 유튜버 티어', '게임 스트리머 티어'],
        addedAt: '2025-12-23',
      },
      {
        id: 'youtubers-worldcup',
        category: 'worldcup',
        title: '유튜버 월드컵',
        status: 'idea',
        viral: {
          potential: 'high',
          reasons: ['팬덤 동원'],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1-2일',
          dependencies: ['유튜버 프로필 사진'],
        },
        addedAt: '2025-12-23',
      },
    ],
  },

  // ========== 직업/직장 (Jobs/Career) ==========
  {
    id: 'jobs-career',
    name: '직업/직장',
    icon: '💼',
    description: '직업, 직장, 연봉, 워라밸 관련 투표/밸런스게임',
    color: '#2d3436',
    targetAudience: '20-40대 (취준생/직장인)',
    estimatedData: {
      min: 50,
      max: 150,
      current: 0,
    },
    ideas: [
      // 밸런스 게임 (최강 바이럴!)
      {
        id: 'jobs-balance-game',
        category: 'balance-game',
        title: '직장인 밸런스 게임',
        description: '현실적인 직장/연봉 선택의 순간',
        status: 'idea',
        viral: {
          potential: 'very-high',
          reasons: [
            '직장인 공감도 100%',
            '현실적 고민으로 선택 고통 극대화',
            '댓글 논쟁 폭발 예상',
            '세대별 가치관 차이 극명',
          ],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1일',
          dependencies: ['VS 질문 30-50개'],
        },
        strategy: {
          phase: 'Phase 1',
          priority: 'high',
          notes: [
            'Quick Win - 쉽고 바이럴 극강',
            '취준생/직장인 커뮤니티 타겟',
            '블라인드, 오늘의유머 등 확산 예상',
          ],
        },
        examples: [
          '연봉 1억 야근 많음 vs 연봉 5천 칼퇴?',
          '대기업 말단 vs 중소기업 임원?',
          '좋아하는 일 연봉 낮음 vs 싫은 일 연봉 높음?',
          '워라밸 좋은데 승진 느림 vs 워라밸 나쁜데 승진 빠름?',
          '상사 좋은데 동료 별로 vs 동료 좋은데 상사 별로?',
          '평생 재택 vs 평생 출근?',
          '회식 많은 회사 vs 회식 없는데 분위기 냉랭?',
          '연차 자유롭게 vs 연봉 1천만원 더?',
        ],
        addedAt: '2025-12-23',
      },

      // 티어 투표
      {
        id: 'jobs-tier-vote',
        category: 'tier-vote',
        title: '직업 티어 투표',
        description: '직업을 S~F 티어로 평가 (선호도/전망/워라밸)',
        status: 'idea',
        viral: {
          potential: 'very-high',
          reasons: [
            '직업 선호도 논쟁',
            '세대별 직업관 차이',
            '현실적 관심사',
            '부모님이 보면 논란 예상',
          ],
        },
        implementation: {
          difficulty: 2,
          estimatedTime: '3일',
          dependencies: ['투표 시스템', '직업 데이터 100개'],
        },
        strategy: {
          phase: 'Phase 2',
          priority: 'high',
          notes: [
            '카테고리별 분리: 선호도, 전망, 워라밸, 연봉',
            '민감한 직업 논쟁 주의',
          ],
        },
        examples: [
          '직업 선호도 티어',
          '워라밸 좋은 직업 티어',
          '미래 전망 좋은 직업 티어',
          '연봉 높은 직업 티어',
        ],
        addedAt: '2025-12-23',
      },

      // MBTI 테스트
      {
        id: 'jobs-mbti',
        category: 'mbti-test',
        title: '직장인 유형 MBTI',
        description: '일하는 스타일로 직장인 성향 분석',
        status: 'idea',
        viral: {
          potential: 'high',
          reasons: [
            '직장인 자기 이해',
            '팀원 이해용',
            '결과 공유 욕구',
          ],
        },
        implementation: {
          difficulty: 2,
          estimatedTime: '3-5일',
          dependencies: [
            '차원 정의 (업무 스타일, 소통 방식, 시간 관리 등)',
            '결과 유형 8-12개',
          ],
        },
        strategy: {
          phase: 'Phase 2',
          priority: 'medium',
        },
        examples: [
          '차원: 혼자 vs 팀 작업',
          '차원: 계획형 vs 즉흥형',
          '차원: 안정 추구 vs 도전 추구',
          '차원: 회의 적극 vs 회의 소극',
          '결과: "당신은 혁신가형 직장인!"',
        ],
        addedAt: '2025-12-23',
      },

      // 체크리스트
      {
        id: 'jobs-checklist',
        category: 'checklist',
        title: '직장인 공감 체크리스트',
        description: '이런 경험 있으면 진정한 직장인',
        status: 'idea',
        viral: {
          potential: 'high',
          reasons: [
            '공감 콘텐츠',
            '웃긴 상황 체크',
            'SNS 공유 욕구',
          ],
        },
        implementation: {
          difficulty: 1,
          estimatedTime: '1일',
          dependencies: ['체크리스트 100개'],
        },
        strategy: {
          phase: 'Phase 3',
          priority: 'low',
        },
        examples: [
          '회의 중 딴생각 한 적 있다',
          '퇴근 10분 전 일 들어온 적 있다',
          '상사 눈치 보며 퇴근한 적 있다',
          '월요병 심각하게 앓은 적 있다',
        ],
        addedAt: '2025-12-23',
      },

      // 퀴즈
      {
        id: 'jobs-quiz',
        category: 'quiz',
        title: '직장인 상식 퀴즈',
        description: '노동법, 4대보험, 연차 등 필수 상식',
        status: 'idea',
        viral: {
          potential: 'medium',
          reasons: [
            '실용적 정보',
            '점수 자랑',
          ],
        },
        implementation: {
          difficulty: 2,
          estimatedTime: '2-3일',
          dependencies: ['퀴즈 30개', '난이도 분류'],
        },
        strategy: {
          phase: 'Phase 3',
          priority: 'low',
        },
        examples: [
          '연차는 입사 몇 개월 후부터?',
          '4대보험에 포함되지 않는 것은?',
          '주 52시간 제도란?',
        ],
        addedAt: '2025-12-23',
      },
    ],
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 테마별 아이디어 개수 집계
 */
export function getIdeaStats() {
  return THEMES.map(theme => ({
    themeId: theme.id,
    themeName: theme.name,
    totalIdeas: theme.ideas.length,
    byStatus: {
      idea: theme.ideas.filter(i => i.status === 'idea').length,
      planning: theme.ideas.filter(i => i.status === 'planning').length,
      ready: theme.ideas.filter(i => i.status === 'ready').length,
      inProgress: theme.ideas.filter(i => i.status === 'in-progress').length,
      completed: theme.ideas.filter(i => i.status === 'completed').length,
      paused: theme.ideas.filter(i => i.status === 'paused').length,
    },
    byCategory: {
      worldcup: theme.ideas.filter(i => i.category === 'worldcup').length,
      tierVote: theme.ideas.filter(i => i.category === 'tier-vote').length,
      balanceGame: theme.ideas.filter(i => i.category === 'balance-game').length,
      mbtiTest: theme.ideas.filter(i => i.category === 'mbti-test').length,
      quiz: theme.ideas.filter(i => i.category === 'quiz').length,
      checklist: theme.ideas.filter(i => i.category === 'checklist').length,
      recommend: theme.ideas.filter(i => i.category === 'recommend').length,
      other: theme.ideas.filter(i => i.category === 'other').length,
    },
    byViral: {
      veryHigh: theme.ideas.filter(i => i.viral.potential === 'very-high').length,
      high: theme.ideas.filter(i => i.viral.potential === 'high').length,
      medium: theme.ideas.filter(i => i.viral.potential === 'medium').length,
      low: theme.ideas.filter(i => i.viral.potential === 'low').length,
    },
  }));
}

/**
 * 전체 아이디어 통계
 */
export function getTotalStats() {
  const allIdeas = THEMES.flatMap(t => t.ideas);
  return {
    totalThemes: THEMES.length,
    totalIdeas: allIdeas.length,
    highPriorityIdeas: allIdeas.filter(i => i.strategy?.priority === 'high').length,
    veryHighViralIdeas: allIdeas.filter(i => i.viral.potential === 'very-high').length,
    readyToImplement: allIdeas.filter(i => i.status === 'ready').length,
    inProgress: allIdeas.filter(i => i.status === 'in-progress').length,
    completed: allIdeas.filter(i => i.status === 'completed').length,
  };
}

/**
 * 우선순위가 높은 아이디어 추출
 */
export function getHighPriorityIdeas() {
  return THEMES.flatMap(theme =>
    theme.ideas
      .filter(idea => idea.strategy?.priority === 'high')
      .map(idea => ({ ...idea, themeName: theme.name, themeIcon: theme.icon }))
  ).sort((a, b) => {
    // 상태 우선순위: ready > planning > idea
    const statusOrder = { ready: 0, planning: 1, 'in-progress': 2, idea: 3, paused: 4, completed: 5 };
    return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
  });
}

/**
 * Quick Wins 아이디어 (고효과 + 저난이도)
 */
export function getQuickWins() {
  return THEMES.flatMap(theme =>
    theme.ideas
      .filter(idea =>
        (idea.viral.potential === 'very-high' || idea.viral.potential === 'high') &&
        idea.implementation.difficulty === 1
      )
      .map(idea => ({ ...idea, themeName: theme.name, themeIcon: theme.icon }))
  );
}
