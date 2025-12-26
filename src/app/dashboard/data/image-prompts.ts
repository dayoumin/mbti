// 테스트 결과 이미지 프롬프트 관리
// AI 이미지 생성용 프롬프트 및 업로드 상태 추적

export interface ImagePromptItem {
  id: string;
  testKey: string;
  testName: string;
  resultName: string;
  emoji: string;
  description: string;
  prompt: string;
  promptKo: string;  // 한글 설명
  style: string;
  imagePath?: string;  // 업로드된 이미지 경로
  status: 'pending' | 'generated' | 'uploaded';
  updatedAt?: string;
}

export interface TestImageGroup {
  testKey: string;
  testName: string;
  totalResults: number;
  uploadedCount: number;
  items: ImagePromptItem[];
}

// 공통 스타일 프리셋
export const IMAGE_STYLES = {
  watercolor: "soft watercolor illustration style, gentle brush strokes, pastel colors, artistic portrait, white background, high quality",
  anime: "anime style illustration, soft shading, clean lines, beautiful character design",
  realistic: "photorealistic portrait, soft lighting, professional photography style",
  minimal: "minimalist illustration, simple shapes, flat design, modern art style",
  // 10대 타겟 스타일 추가
  teenFresh: "youthful fresh illustration, high school age teenager, bright pastel colors, innocent pure vibe, school uniform or casual youth fashion, soft lighting, white background",
  teenAnime: "cute anime style, high school student character, sparkling eyes, fresh innocent expression, pastel color palette, shoujo manga feel"
} as const;

// idealType 이미지 프롬프트 (10대 풋풋한 분위기)
export const IDEALTYPE_IMAGE_PROMPTS: ImagePromptItem[] = [
  {
    id: "idealType-1",
    testKey: "idealType",
    testName: "연애 이상형 테스트",
    resultName: "다정다감 연인",
    emoji: "🥰",
    description: "따뜻한 말과 애정 표현이 가득한 상대",
    prompt: "cute high school teenager, warm gentle smile, sweet innocent eyes, holding small flower bouquet, school uniform with cardigan, pink and peach pastel colors, shoujo manga style illustration, pure first love atmosphere, white background",
    promptKo: "귀여운 고등학생, 따뜻한 미소, 순수한 눈빛, 작은 꽃다발, 가디건 교복, 핑크/피치 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "idealType-2",
    testKey: "idealType",
    testName: "연애 이상형 테스트",
    resultName: "든든한 버팀목",
    emoji: "🏔️",
    description: "믿음직하고 헌신적인 상대",
    prompt: "reliable high school student, confident gentle gaze, tall and dependable posture, school uniform or casual hoodie, blue and navy pastel colors, shoujo manga style illustration, trustworthy class president vibe, white background",
    promptKo: "믿음직한 고등학생, 듬직한 눈빛, 키 크고 든든한 자세, 교복이나 후드티, 블루/네이비 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "idealType-3",
    testKey: "idealType",
    testName: "연애 이상형 테스트",
    resultName: "열정적인 로맨티스트",
    emoji: "💘",
    description: "설렘과 열정이 넘치는 상대",
    prompt: "energetic high school teenager, sparkling excited eyes, bright charming smile, school festival or confession scene, red and coral pastel colors, shoujo manga style illustration, heart-fluttering first crush vibe, white background",
    promptKo: "에너지 넘치는 고등학생, 반짝이는 눈, 밝은 미소, 축제/고백 장면, 레드/코랄 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "idealType-4",
    testKey: "idealType",
    testName: "연애 이상형 테스트",
    resultName: "자유로운 동반자",
    emoji: "🦋",
    description: "서로의 공간을 존중하는 상대",
    prompt: "free-spirited high school student, relaxed easygoing expression, casual trendy outfit, butterfly or wind motif, cyan and sky blue pastel colors, shoujo manga style illustration, cool independent classmate vibe, white background",
    promptKo: "자유로운 고등학생, 여유로운 표정, 트렌디한 사복, 나비/바람 모티프, 시안/스카이블루 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "idealType-5",
    testKey: "idealType",
    testName: "연애 이상형 테스트",
    resultName: "편안한 베스트프렌드",
    emoji: "☕",
    description: "친구처럼 편안한 상대",
    prompt: "friendly high school student, warm comfortable smile, holding bubble tea or snack, casual school afterclass outfit, yellow and cream pastel colors, shoujo manga style illustration, childhood friend atmosphere, white background",
    promptKo: "친근한 고등학생, 편안한 미소, 버블티나 간식, 방과후 편한 복장, 옐로우/크림 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "idealType-6",
    testKey: "idealType",
    testName: "연애 이상형 테스트",
    resultName: "액티브 파트너",
    emoji: "⚡",
    description: "함께 활동하는 것을 즐기는 상대",
    prompt: "sporty high school athlete, bright enthusiastic expression, gym clothes or school sport uniform, dynamic energetic pose, orange and yellow pastel colors, shoujo manga style illustration, school sports club member vibe, white background",
    promptKo: "스포티한 고등학생 운동부, 밝고 열정적인 표정, 체육복, 역동적 포즈, 오렌지/옐로우 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "idealType-7",
    testKey: "idealType",
    testName: "연애 이상형 테스트",
    resultName: "진지한 소울메이트",
    emoji: "✨",
    description: "깊은 대화와 교감을 나누는 상대",
    prompt: "thoughtful high school student, deep gentle eyes, serene expression, in library or by window with books, purple and lavender pastel colors, shoujo manga style illustration, quiet intellectual classmate vibe, white background",
    promptKo: "생각 깊은 고등학생, 깊은 눈빛, 차분한 표정, 도서관/창가 책, 퍼플/라벤더 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "idealType-8",
    testKey: "idealType",
    testName: "연애 이상형 테스트",
    resultName: "츤데레 연인",
    emoji: "🐱",
    description: "겉은 쿨하지만 속은 따뜻한 상대",
    prompt: "tsundere high school student, cool slightly pouting expression with hidden warmth, looking away shyly, cat-ear hair clips or cat motif, slate gray and soft pink pastel colors, shoujo manga style illustration, cute tsundere classmate vibe, white background",
    promptKo: "츤데레 고등학생, 쿨하지만 따뜻한 표정, 부끄러워 시선 회피, 고양이 핀/모티프, 그레이/핑크 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "idealType-9",
    testKey: "idealType",
    testName: "연애 이상형 테스트",
    resultName: "집순이/집돌이 파트너",
    emoji: "🏠",
    description: "집에서 함께하는 시간이 행복한 상대",
    prompt: "homebody high school student, comfortable soft expression, wearing oversized hoodie with earphones, holding game controller or manga, amber and warm brown pastel colors, shoujo manga style illustration, cozy weekend at home vibe, white background",
    promptKo: "집순이/집돌이 고등학생, 편안한 표정, 큰 후드티+이어폰, 게임패드/만화책, 앰버/웜브라운 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "idealType-10",
    testKey: "idealType",
    testName: "연애 이상형 테스트",
    resultName: "밸런스 연인",
    emoji: "⚖️",
    description: "모든 면에서 균형 잡힌 상대",
    prompt: "balanced high school student, calm peaceful expression, gentle reliable smile, school council badge or notebook, green and sage pastel colors, shoujo manga style illustration, perfect all-rounder classmate vibe, white background",
    promptKo: "균형 잡힌 고등학생, 차분하고 평화로운 표정, 학생회 배지/노트, 그린/세이지 파스텔",
    style: "teenAnime",
    status: "pending"
  }
];

// attachment 애착 유형 이미지 프롬프트 (10대 풋풋한 분위기)
export const ATTACHMENT_IMAGE_PROMPTS: ImagePromptItem[] = [
  {
    id: "attachment-1",
    testKey: "attachment",
    testName: "연애 애착 스타일",
    resultName: "안정형 (Secure)",
    emoji: "💚",
    description: "건강한 애착, 균형 잡힌 사랑",
    prompt: "confident high school student couple, warm natural smiles, comfortable together walking home from school, matching school bags, green and soft gold pastel colors, shoujo manga style illustration, healthy first love atmosphere, white background",
    promptKo: "자신감 있는 고등학생 커플, 자연스러운 미소, 하굣길 함께 걷는 모습, 가방 메고, 그린/골드 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "attachment-2",
    testKey: "attachment",
    testName: "연애 애착 스타일",
    resultName: "불안형 (Anxious)",
    emoji: "💭",
    description: "확인하고 싶은 마음이 큰 타입",
    prompt: "anxious high school student, worried hopeful eyes, checking phone for message, sitting in classroom alone, heart and question mark thought bubbles, yellow and soft orange pastel colors, shoujo manga style illustration, waiting for crush's text vibe, white background",
    promptKo: "불안한 고등학생, 걱정하며 기대하는 눈빛, 카톡 확인하는 모습, 교실, 하트/물음표 생각풍선, 옐로우/오렌지 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "attachment-3",
    testKey: "attachment",
    testName: "연애 애착 스타일",
    resultName: "회피형 (Avoidant)",
    emoji: "🚪",
    description: "독립적인 공간이 중요한 타입",
    prompt: "independent cool high school student, calm collected expression, earphones in looking out window, personal space bubble around, blue and slate gray pastel colors, shoujo manga style illustration, cool loner student vibe, white background",
    promptKo: "독립적인 쿨한 고등학생, 차분한 표정, 이어폰 끼고 창밖 보는 모습, 자기만의 공간, 블루/그레이 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "attachment-4",
    testKey: "attachment",
    testName: "연애 애착 스타일",
    resultName: "혼란형 (Disorganized)",
    emoji: "🌀",
    description: "다가가고 싶지만 두려운 마음",
    prompt: "conflicted high school student, torn expression, wanting to approach but hesitating, half reaching hand half stepping back, swirling emotions around, purple and deep blue pastel colors, shoujo manga style illustration, complicated first crush feelings, white background",
    promptKo: "갈등하는 고등학생, 복잡한 표정, 다가가고 싶지만 망설이는 모습, 손 뻗다 멈춤, 퍼플/딥블루 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "attachment-5",
    testKey: "attachment",
    testName: "연애 애착 스타일",
    resultName: "안정-불안 경계형",
    emoji: "💛",
    description: "대체로 안정적이지만 가끔 불안해요",
    prompt: "mostly confident high school student, gentle smile with slight worry in eyes, holding phone casually, relaxed but sometimes checking, yellow-green gradient pastel colors, shoujo manga style illustration, mostly secure but overthinking sometimes, white background",
    promptKo: "대체로 자신감 있는 고등학생, 부드러운 미소에 살짝 걱정, 폰 들고 가끔 확인, 옐로우-그린 그라데이션 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "attachment-6",
    testKey: "attachment",
    testName: "연애 애착 스타일",
    resultName: "안정-회피 경계형",
    emoji: "💙",
    description: "대체로 안정적이지만 가끔 거리가 필요해요",
    prompt: "balanced high school student, peaceful expression, comfortable with some personal space, sitting at desk with comfortable distance, light blue and sage green pastel colors, shoujo manga style illustration, healthy boundaries in relationship, white background",
    promptKo: "균형 잡힌 고등학생, 평화로운 표정, 적당한 거리감 편안함, 책상에 여유 있게 앉은 모습, 라이트블루/세이지그린 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "attachment-7",
    testKey: "attachment",
    testName: "연애 애착 스타일",
    resultName: "균형형",
    emoji: "⚖️",
    description: "상황에 따라 유연하게 반응하는 타입",
    prompt: "adaptable high school student, calm flexible expression, standing at school crossroads peacefully, balance scale or yin-yang motif, neutral gray and soft rainbow accent pastel colors, shoujo manga style illustration, going with the flow vibe, white background",
    promptKo: "적응력 있는 고등학생, 유연하고 차분한 표정, 학교 갈림길에 평화롭게, 저울/음양 모티프, 그레이/무지개 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "attachment-8",
    testKey: "attachment",
    testName: "연애 애착 스타일",
    resultName: "회피-혼란 경계형",
    emoji: "🌊",
    description: "거리를 두고 싶지만 불안하기도 해요",
    prompt: "conflicted loner high school student, guarded but longing expression, sitting alone but glancing at others, wave and push-pull motif, deep purple and ocean blue pastel colors, shoujo manga style illustration, wanting connection but fearing it, white background",
    promptKo: "혼자인 고등학생, 경계하지만 그리운 표정, 혼자 앉아 다른 애들 보는 모습, 파도 모티프, 딥퍼플/오션블루 파스텔",
    style: "teenAnime",
    status: "pending"
  }
];

// ============================================================================
// 성격별 궁합 티어표 이미지 프롬프트 (10대 풋풋한 분위기)
// ============================================================================

export const PERSONALITY_TIER_IMAGE_PROMPTS: ImagePromptItem[] = [
  // === 안정 × 감성 계열 ===
  {
    id: "personality-stable-caring",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "안정형 + 배려형",
    emoji: "🌸",
    description: "서로 믿고 의지하는 조화로운 관계",
    prompt: "two high school students walking together peacefully, one calm and steady, one gentle and caring, soft pink cherry blossom background, matching scarves, shoujo manga style, harmonious peaceful atmosphere, pastel pink and green colors, white background",
    promptKo: "평화롭게 함께 걷는 고등학생 둘, 차분한 한 명과 다정한 한 명, 벚꽃 배경, 매칭 스카프, 핑크/그린 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-stable-emotional",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "안정형 + 감성형",
    emoji: "💙",
    description: "한 사람이 감정의 닥터가 되어주는 조합",
    prompt: "two high school students, one calm comforting the other who is emotional, sitting on school bench, one patting shoulder gently, shoujo manga style, supportive caring atmosphere, pastel blue and soft orange colors, white background",
    promptKo: "고등학생 둘, 차분한 한 명이 감정적인 친구 위로, 학교 벤치, 어깨 토닥토닥, 블루/오렌지 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-stable-passive",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "안정형 + 순응형",
    emoji: "🕊️",
    description: "평온한 일상을 추구하는 평화주의 듀오",
    prompt: "two peaceful high school students reading books together in library, calm quiet atmosphere, dove and peace motif, shoujo manga style, serene tranquil vibe, pastel white and soft gray colors, white background",
    promptKo: "도서관에서 함께 책 읽는 평화로운 고등학생 둘, 차분한 분위기, 비둘기/평화 모티프, 화이트/그레이 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-stable-sensitive",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "안정형 + 섬세형",
    emoji: "🎨",
    description: "안정감 속에서 감성을 꽃피우는 관계",
    prompt: "two high school students in art room, one steady supportive watching other paint, creative artistic atmosphere, easel and canvas, shoujo manga style, nurturing artistic vibe, pastel purple and cream colors, white background",
    promptKo: "미술실 고등학생 둘, 한 명이 다른 친구 그림 그리는 걸 응원, 이젤과 캔버스, 퍼플/크림 파스텔",
    style: "teenAnime",
    status: "pending"
  },

  // === 리더 × 추진 계열 ===
  {
    id: "personality-leader-passionate",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "리더형 + 열정형",
    emoji: "🔥",
    description: "함께 목표를 향해 질주하는 드림팀",
    prompt: "two energetic high school students high-fiving after winning, sports day or school competition, fire and energy aura, shoujo manga style, victorious passionate atmosphere, pastel red and orange colors, white background",
    promptKo: "하이파이브하는 활기찬 고등학생 둘, 체육대회/대회 우승, 불꽃 에너지 오라, 레드/오렌지 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-leader-rational",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "리더형 + 분석형",
    emoji: "💼",
    description: "전략과 실행력의 완벽한 조화",
    prompt: "two high school students planning together, one confidently leading pointing at board, other analyzing with glasses, student council room, shoujo manga style, strategic teamwork vibe, pastel navy and gray colors, white background",
    promptKo: "함께 계획하는 고등학생 둘, 자신있게 보드 가리키는 한 명, 안경 쓰고 분석하는 한 명, 학생회실, 네이비/그레이 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-leader-supporter",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "리더형 + 서포터형",
    emoji: "🤝",
    description: "왕과 참모, 역할 분담이 명확한 조합",
    prompt: "two high school students, one standing confidently as class president, other supporting from behind with notes, handshake or teamwork pose, shoujo manga style, perfect partnership vibe, pastel gold and teal colors, white background",
    promptKo: "고등학생 둘, 반장처럼 자신있게 선 한 명, 뒤에서 노트 들고 서포트하는 한 명, 골드/틸 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-leader-leader",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "리더형 + 리더형",
    emoji: "👑",
    description: "권력 다툼 vs 최강 파워커플?",
    prompt: "two competitive high school students facing each other, both wearing crowns, friendly rivalry spark between them, debate or competition scene, shoujo manga style, power couple or clash vibe, pastel gold and purple colors, white background",
    promptKo: "서로 마주보는 경쟁적인 고등학생 둘, 둘 다 왕관, 친선 라이벌 스파크, 토론/대회 장면, 골드/퍼플 파스텔",
    style: "teenAnime",
    status: "pending"
  },

  // === 분석 × 합리 계열 ===
  {
    id: "personality-rational-rational",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "분석형 + 분석형",
    emoji: "🧠",
    description: "논리로 소통하는 이성적 관계",
    prompt: "two studious high school students with glasses, both analyzing data on laptops, brain and logic symbols, science lab or study room, shoujo manga style, intellectual connection vibe, pastel blue and silver colors, white background",
    promptKo: "안경 쓴 공부하는 고등학생 둘, 둘 다 노트북으로 분석, 뇌/논리 심볼, 과학실/스터디룸, 블루/실버 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-rational-emotional",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "분석형 + 감성형",
    emoji: "🎭",
    description: "극과 극이 만나면? 싸움 or 밸런스",
    prompt: "two contrasting high school students, one logical with calculator, one emotional with heart, comedy and tragedy masks motif, opposites attract scene, shoujo manga style, yin-yang balance vibe, pastel blue and pink colors, white background",
    promptKo: "대조적인 고등학생 둘, 계산기 든 논리파와 하트 든 감성파, 희비극 마스크 모티프, 블루/핑크 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-rational-creative",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "분석형 + 창의형",
    emoji: "🎨",
    description: "현실과 상상이 만나는 독특한 조합",
    prompt: "two high school students, one with blueprint/chart, one with colorful paint brushes, merging ideas together, lightbulb moment, shoujo manga style, innovation creativity vibe, pastel gray and rainbow colors, white background",
    promptKo: "고등학생 둘, 청사진 든 한 명과 물감붓 든 한 명, 아이디어 합치는 모습, 전구 모먼트, 그레이/레인보우 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-rational-supporter",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "분석형 + 서포터형",
    emoji: "📊",
    description: "냉정한 판단, 따뜻한 실행의 조화",
    prompt: "two high school students, one presenting charts coolly, other warmly helping with materials, project presentation scene, shoujo manga style, balanced teamwork vibe, pastel blue and warm yellow colors, white background",
    promptKo: "고등학생 둘, 쿨하게 차트 발표하는 한 명, 따뜻하게 자료 도와주는 한 명, 프로젝트 발표 장면, 블루/옐로우 파스텔",
    style: "teenAnime",
    status: "pending"
  },

  // === 감성 × 예술 계열 ===
  {
    id: "personality-emotional-emotional",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "감성형 + 감성형",
    emoji: "💗",
    description: "서로의 감정을 깊이 이해하는 소울메이트",
    prompt: "two emotional high school students sharing deep conversation, both with tears of joy and understanding, heart symbols floating, shoujo manga style, soulmate deep connection vibe, pastel pink and magenta colors, white background",
    promptKo: "깊은 대화 나누는 감성적인 고등학생 둘, 둘 다 감동의 눈물, 하트 심볼 둥둥, 핑크/마젠타 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-emotional-creative",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "감성형 + 창의형",
    emoji: "🌈",
    description: "감성과 상상력이 폭발하는 예술가 커플",
    prompt: "two artistic high school students creating together, one singing emotionally, one painting colorfully, rainbow and music notes, shoujo manga style, creative explosion vibe, pastel rainbow colors, white background",
    promptKo: "함께 창작하는 예술적인 고등학생 둘, 감성적으로 노래하는 한 명, 화려하게 그리는 한 명, 무지개/음표, 레인보우 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-emotional-caring",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "감성형 + 배려형",
    emoji: "🫂",
    description: "서로를 어루만지는 힐링 관계",
    prompt: "two gentle high school students comforting each other, warm hug or hand holding, healing aura around them, shoujo manga style, mutual comfort healing vibe, pastel peach and mint colors, white background",
    promptKo: "서로 위로하는 다정한 고등학생 둘, 따뜻한 포옹이나 손잡기, 힐링 오라, 피치/민트 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-emotional-passive",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "감성형 + 순응형",
    emoji: "🌙",
    description: "한쪽이 감정 폭발, 한쪽이 수습하는 조합",
    prompt: "two high school students, one dramatically emotional with sparkles, other calmly cleaning up mess, moon and star motif, shoujo manga style, dramatic vs calm contrast vibe, pastel purple and silver colors, white background",
    promptKo: "고등학생 둘, 반짝이며 감정 폭발하는 한 명, 차분히 수습하는 한 명, 달/별 모티프, 퍼플/실버 파스텔",
    style: "teenAnime",
    status: "pending"
  },

  // === 열정 × 도전 계열 ===
  {
    id: "personality-passionate-passionate",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "열정형 + 열정형",
    emoji: "🌋",
    description: "불과 불이 만나면 폭발? 시너지?",
    prompt: "two super energetic high school students, both on fire with passion, volcano and explosion motif, too much energy sparks flying, shoujo manga style, explosive synergy or clash vibe, pastel red and orange colors, white background",
    promptKo: "초에너지 고등학생 둘, 둘 다 열정으로 불타는 모습, 화산/폭발 모티프, 스파크 튀김, 레드/오렌지 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-passionate-adventurer",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "열정형 + 모험가형",
    emoji: "🚀",
    description: "함께 세계를 정복하는 역동적 듀오",
    prompt: "two adventurous high school students, one with fire energy, one with explorer gear, rocket and map motif, ready for adventure pose, shoujo manga style, dynamic duo conquer world vibe, pastel orange and cyan colors, white background",
    promptKo: "모험적인 고등학생 둘, 불꽃 에너지 한 명, 탐험 장비 한 명, 로켓/지도 모티프, 오렌지/시안 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-passionate-stable",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "열정형 + 안정형",
    emoji: "⚖️",
    description: "가속페달과 브레이크의 조합",
    prompt: "two contrasting high school students, one running with fire, other calm holding steady, balance scale motif, accelerator and brake visual, shoujo manga style, balanced energy vibe, pastel red and green colors, white background",
    promptKo: "대조적인 고등학생 둘, 불타며 달리는 한 명, 차분하게 잡아주는 한 명, 저울 모티프, 레드/그린 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-passionate-passive",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "열정형 + 순응형",
    emoji: "🎢",
    description: "한쪽이 끌고 가면 한쪽이 따라가는 관계",
    prompt: "two high school students, one pulling enthusiastically leading, other being dragged along happily, roller coaster motif, shoujo manga style, lead and follow dynamic vibe, pastel orange and white colors, white background",
    promptKo: "고등학생 둘, 열정적으로 끌고가는 한 명, 끌려가면서도 행복한 한 명, 롤러코스터 모티프, 오렌지/화이트 파스텔",
    style: "teenAnime",
    status: "pending"
  },

  // === 창의 × 자유 계열 ===
  {
    id: "personality-creative-creative",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "창의형 + 창의형",
    emoji: "🎪",
    description: "독특한 아이디어가 폭발하는 천재 조합",
    prompt: "two quirky creative high school students, both with wild colorful ideas, circus and imagination explosion, lightbulbs and paint everywhere, shoujo manga style, genius creative chaos vibe, pastel rainbow and gold colors, white background",
    promptKo: "기발한 창의적인 고등학생 둘, 둘 다 화려한 아이디어 폭발, 서커스/상상력 폭발, 전구와 물감 사방에, 레인보우/골드 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-creative-adventurer",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "창의형 + 모험가형",
    emoji: "🦄",
    description: "상상을 현실로 만드는 꿈의 팀",
    prompt: "two imaginative high school students, one dreaming up unicorn, other making it reality with tools, fantasy meets reality scene, shoujo manga style, dream team making magic vibe, pastel purple and cyan colors, white background",
    promptKo: "상상력 넘치는 고등학생 둘, 유니콘 꿈꾸는 한 명, 도구로 실현하는 한 명, 판타지와 현실 만남, 퍼플/시안 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-creative-stable",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "창의형 + 안정형",
    emoji: "🏠",
    description: "꿈과 현실의 줄다리기",
    prompt: "two contrasting high school students, one floating with creative clouds, other grounded with house motif, tug of war between dream and reality, shoujo manga style, dream vs reality balance vibe, pastel purple and brown colors, white background",
    promptKo: "대조적인 고등학생 둘, 창의적 구름 위 떠있는 한 명, 집 모티프로 땅에 선 한 명, 꿈과 현실 줄다리기, 퍼플/브라운 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-creative-supporter",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "창의형 + 서포터형",
    emoji: "🌟",
    description: "꿈을 꾸는 사람과 실현하는 사람",
    prompt: "two high school students, one stargazing with big dreams, other organizing and supporting with checklist, star and clipboard motif, shoujo manga style, dreamer and doer partnership vibe, pastel yellow and teal colors, white background",
    promptKo: "고등학생 둘, 큰 꿈 꾸며 별 바라보는 한 명, 체크리스트로 서포트하는 한 명, 별/클립보드 모티프, 옐로우/틸 파스텔",
    style: "teenAnime",
    status: "pending"
  },

  // === 서포터 × 배려 계열 ===
  {
    id: "personality-supporter-supporter",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "서포터형 + 서포터형",
    emoji: "🤗",
    description: "서로 양보만 하다가 결정 못 하는 조합?",
    prompt: "two helpful high school students, both offering to help each other, endless loop of politeness, question marks everywhere, shoujo manga style, too polite to decide vibe, pastel pink and mint colors, white background",
    promptKo: "서로 도와주려는 고등학생 둘, 끝없는 양보 루프, 물음표 사방에, 너무 착해서 결정 못함, 핑크/민트 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-supporter-caring",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "서포터형 + 배려형",
    emoji: "💝",
    description: "서로를 챙기는 따뜻한 관계",
    prompt: "two caring high school students, both offering food/drinks to each other, hearts and warmth around them, mutual care scene, shoujo manga style, warm caring exchange vibe, pastel pink and cream colors, white background",
    promptKo: "서로 챙기는 고등학생 둘, 둘 다 음식/음료 건네는 모습, 하트와 따뜻함 둘러싸여, 핑크/크림 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-supporter-passive",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "서포터형 + 순응형",
    emoji: "🌿",
    description: "평온하지만 갈등 회피 성향 강함",
    prompt: "two peaceful high school students, both avoiding any conflict, sitting in nature peacefully, leaf and calm water motif, shoujo manga style, peaceful conflict-avoidant vibe, pastel green and beige colors, white background",
    promptKo: "평화로운 고등학생 둘, 둘 다 갈등 회피, 자연 속에 평화롭게 앉아, 나뭇잎/잔잔한 물 모티프, 그린/베이지 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-supporter-sensitive",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "서포터형 + 섬세형",
    emoji: "🎀",
    description: "세심한 배려로 서로를 이해하는 조합",
    prompt: "two gentle high school students, one noticing small details, other appreciating thoughtful gestures, ribbon and small gifts, shoujo manga style, delicate understanding vibe, pastel pink and lavender colors, white background",
    promptKo: "다정한 고등학생 둘, 작은 디테일 챙기는 한 명, 배려에 감동하는 한 명, 리본/작은 선물, 핑크/라벤더 파스텔",
    style: "teenAnime",
    status: "pending"
  },

  // === 모험 × 자유 계열 ===
  {
    id: "personality-adventurer-adventurer",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "모험가형 + 모험가형",
    emoji: "🏔️",
    description: "안전 따위 없는 스릴 넘치는 관계",
    prompt: "two adventurous high school students, both doing extreme activities together, mountain climbing or skateboarding, danger and thrill everywhere, shoujo manga style, no safety wild adventure vibe, pastel cyan and orange colors, white background",
    promptKo: "모험적인 고등학생 둘, 함께 익스트림 활동, 산악등반이나 스케이트보드, 위험과 스릴 가득, 시안/오렌지 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-adventurer-stable",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "모험가형 + 안정형",
    emoji: "🧳",
    description: "자유 vs 정착, 가치관 충돌 가능성",
    prompt: "two contrasting high school students, one with backpack ready to go, other with house keys wanting to stay, suitcase and home motif, shoujo manga style, freedom vs settling clash vibe, pastel blue and brown colors, white background",
    promptKo: "대조적인 고등학생 둘, 배낭 메고 떠나려는 한 명, 집 열쇠 들고 머물려는 한 명, 여행가방/집 모티프, 블루/브라운 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-adventurer-caring",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "모험가형 + 배려형",
    emoji: "🗺️",
    description: "한쪽이 모험, 한쪽이 베이스캠프",
    prompt: "two high school students, one exploring with map, other staying at base camp with supplies, map and tent motif, shoujo manga style, explorer and base support dynamic vibe, pastel green and orange colors, white background",
    promptKo: "고등학생 둘, 지도 들고 탐험하는 한 명, 베이스캠프에서 물자 챙기는 한 명, 지도/텐트 모티프, 그린/오렌지 파스텔",
    style: "teenAnime",
    status: "pending"
  },
  {
    id: "personality-adventurer-rational",
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    resultName: "모험가형 + 분석형",
    emoji: "🎯",
    description: "직관 vs 계획, 생각의 차이가 큼",
    prompt: "two contrasting high school students, one jumping impulsively, other planning with charts, target and question mark motif, shoujo manga style, intuition vs planning clash vibe, pastel orange and blue colors, white background",
    promptKo: "대조적인 고등학생 둘, 충동적으로 뛰어드는 한 명, 차트로 계획하는 한 명, 타겟/물음표 모티프, 오렌지/블루 파스텔",
    style: "teenAnime",
    status: "pending"
  }
];

// 전체 테스트 이미지 그룹 (다른 테스트 추가 시 여기에 추가)
export const ALL_IMAGE_PROMPTS: TestImageGroup[] = [
  {
    testKey: "idealType",
    testName: "연애 이상형 테스트",
    totalResults: 10,
    uploadedCount: IDEALTYPE_IMAGE_PROMPTS.filter(p => p.status === 'uploaded').length,
    items: IDEALTYPE_IMAGE_PROMPTS
  },
  {
    testKey: "attachment",
    testName: "연애 애착 스타일",
    totalResults: 8,
    uploadedCount: ATTACHMENT_IMAGE_PROMPTS.filter(p => p.status === 'uploaded').length,
    items: ATTACHMENT_IMAGE_PROMPTS
  },
  {
    testKey: "personality-tier",
    testName: "성격별 궁합 티어표",
    totalResults: 32,
    uploadedCount: PERSONALITY_TIER_IMAGE_PROMPTS.filter(p => p.status === 'uploaded').length,
    items: PERSONALITY_TIER_IMAGE_PROMPTS
  }
  // 다른 테스트 추가 시 여기에 추가
];

// 프롬프트 복사용 텍스트 생성
export function generateFullPrompt(item: ImagePromptItem): string {
  return `${item.prompt}, ${IMAGE_STYLES[item.style as keyof typeof IMAGE_STYLES]}`;
}

// 통계 계산
export function getImageStats() {
  const total = ALL_IMAGE_PROMPTS.reduce((sum, group) => sum + group.totalResults, 0);
  const uploaded = ALL_IMAGE_PROMPTS.reduce((sum, group) => sum + group.uploadedCount, 0);
  const pending = total - uploaded;

  return {
    total,
    uploaded,
    pending,
    progress: total > 0 ? Math.round((uploaded / total) * 100) : 0
  };
}
