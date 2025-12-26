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
  minimal: "minimalist illustration, simple shapes, flat design, modern art style"
} as const;

// idealType 이미지 프롬프트
export const IDEALTYPE_IMAGE_PROMPTS: ImagePromptItem[] = [
  {
    id: "idealType-1",
    testKey: "idealType",
    testName: "연애 이상형 테스트",
    resultName: "다정다감 연인",
    emoji: "🥰",
    description: "따뜻한 말과 애정 표현이 가득한 상대",
    prompt: "warm and affectionate person, gentle loving smile, soft eyes full of warmth, holding flowers, pink and peach color palette, soft watercolor illustration style, romantic atmosphere, white background",
    promptKo: "따뜻하고 다정한 느낌, 부드러운 미소, 사랑스러운 눈빛, 꽃을 들고 있는 모습, 핑크/피치 색상",
    style: "watercolor",
    status: "pending"
  },
  {
    id: "idealType-2",
    testKey: "idealType",
    testName: "연애 이상형 테스트",
    resultName: "든든한 버팀목",
    emoji: "🏔️",
    description: "믿음직하고 헌신적인 상대",
    prompt: "reliable and trustworthy person, confident gentle gaze, broad shoulders, protective stance, blue and navy color palette, soft watercolor illustration style, stable and calm atmosphere, white background",
    promptKo: "믿음직하고 듬직한 느낌, 자신감 있는 부드러운 눈빛, 안정적인 분위기, 블루/네이비 색상",
    style: "watercolor",
    status: "pending"
  },
  {
    id: "idealType-3",
    testKey: "idealType",
    testName: "연애 이상형 테스트",
    resultName: "열정적인 로맨티스트",
    emoji: "💘",
    description: "설렘과 열정이 넘치는 상대",
    prompt: "passionate romantic person, intense sparkling eyes, charming smile, dynamic pose with roses, red and coral color palette, soft watercolor illustration style, exciting romantic atmosphere, white background",
    promptKo: "열정적이고 로맨틱한 느낌, 반짝이는 눈빛, 매력적인 미소, 장미와 함께, 레드/코랄 색상",
    style: "watercolor",
    status: "pending"
  },
  {
    id: "idealType-4",
    testKey: "idealType",
    testName: "연애 이상형 테스트",
    resultName: "자유로운 동반자",
    emoji: "🦋",
    description: "서로의 공간을 존중하는 상대",
    prompt: "free-spirited independent person, relaxed confident expression, butterfly motif, open and airy pose, cyan and sky blue color palette, soft watercolor illustration style, breezy free atmosphere, white background",
    promptKo: "자유롭고 독립적인 느낌, 여유로운 표정, 나비 모티프, 시안/스카이블루 색상",
    style: "watercolor",
    status: "pending"
  },
  {
    id: "idealType-5",
    testKey: "idealType",
    testName: "연애 이상형 테스트",
    resultName: "편안한 베스트프렌드",
    emoji: "☕",
    description: "친구처럼 편안한 상대",
    prompt: "comfortable friendly person, warm relaxed smile, holding coffee cup, casual cozy outfit, yellow and cream color palette, soft watercolor illustration style, warm comfortable cafe atmosphere, white background",
    promptKo: "편안하고 친근한 느낌, 따뜻한 미소, 커피컵을 들고 있는 모습, 옐로우/크림 색상",
    style: "watercolor",
    status: "pending"
  },
  {
    id: "idealType-6",
    testKey: "idealType",
    testName: "연애 이상형 테스트",
    resultName: "액티브 파트너",
    emoji: "⚡",
    description: "함께 활동하는 것을 즐기는 상대",
    prompt: "energetic active person, bright enthusiastic expression, sporty casual style, dynamic movement pose, orange and yellow color palette, soft watercolor illustration style, energetic outdoor atmosphere, white background",
    promptKo: "활기차고 에너지 넘치는 느낌, 밝은 표정, 스포티한 스타일, 오렌지/옐로우 색상",
    style: "watercolor",
    status: "pending"
  },
  {
    id: "idealType-7",
    testKey: "idealType",
    testName: "연애 이상형 테스트",
    resultName: "진지한 소울메이트",
    emoji: "✨",
    description: "깊은 대화와 교감을 나누는 상대",
    prompt: "thoughtful soulmate person, deep meaningful eyes, serene wise expression, books or starry motif, purple and lavender color palette, soft watercolor illustration style, mystical deep atmosphere, white background",
    promptKo: "진지하고 깊이 있는 느낌, 의미 있는 눈빛, 책이나 별 모티프, 퍼플/라벤더 색상",
    style: "watercolor",
    status: "pending"
  },
  {
    id: "idealType-8",
    testKey: "idealType",
    testName: "연애 이상형 테스트",
    resultName: "츤데레 연인",
    emoji: "🐱",
    description: "겉은 쿨하지만 속은 따뜻한 상대",
    prompt: "tsundere person, cool aloof expression with hidden warmth, slightly turned away pose, cat motif, slate gray and soft pink accent color palette, soft watercolor illustration style, mysterious charming atmosphere, white background",
    promptKo: "쿨하지만 따뜻한 느낌, 살짝 도도한 표정, 고양이 모티프, 슬레이트그레이/핑크 포인트",
    style: "watercolor",
    status: "pending"
  },
  {
    id: "idealType-9",
    testKey: "idealType",
    testName: "연애 이상형 테스트",
    resultName: "집순이/집돌이 파트너",
    emoji: "🏠",
    description: "집에서 함께하는 시간이 행복한 상대",
    prompt: "homebody cozy person, comfortable soft expression, wrapped in blanket or with pillow, indoor plants or home decor, amber and warm brown color palette, soft watercolor illustration style, cozy home atmosphere, white background",
    promptKo: "집에서 편안한 느낌, 포근한 표정, 담요나 쿠션과 함께, 앰버/웜브라운 색상",
    style: "watercolor",
    status: "pending"
  },
  {
    id: "idealType-10",
    testKey: "idealType",
    testName: "연애 이상형 테스트",
    resultName: "밸런스 연인",
    emoji: "⚖️",
    description: "모든 면에서 균형 잡힌 상대",
    prompt: "balanced harmonious person, calm centered expression, peaceful gentle smile, yin-yang or balance motif, green and sage color palette, soft watercolor illustration style, harmonious balanced atmosphere, white background",
    promptKo: "균형 잡힌 조화로운 느낌, 차분한 표정, 평화로운 미소, 그린/세이지 색상",
    style: "watercolor",
    status: "pending"
  }
];

// attachment 애착 유형 이미지 프롬프트
export const ATTACHMENT_IMAGE_PROMPTS: ImagePromptItem[] = [
  {
    id: "attachment-1",
    testKey: "attachment",
    testName: "연애 애착 스타일",
    resultName: "안정형 (Secure)",
    emoji: "💚",
    description: "건강한 애착, 균형 잡힌 사랑",
    prompt: "emotionally secure person in loving relationship, warm confident smile, relaxed open body language, two hands gently holding each other, green and soft gold color palette, soft watercolor illustration style, harmonious balanced atmosphere, white background",
    promptKo: "안정적이고 건강한 느낌, 따뜻한 자신감 있는 미소, 편안한 자세, 두 손이 부드럽게 잡힌 모습, 그린/골드 색상",
    style: "watercolor",
    status: "pending"
  },
  {
    id: "attachment-2",
    testKey: "attachment",
    testName: "연애 애착 스타일",
    resultName: "불안형 (Anxious)",
    emoji: "💭",
    description: "확인하고 싶은 마음이 큰 타입",
    prompt: "anxiously attached person, worried hopeful expression, clutching phone waiting for message, thought bubbles with hearts, yellow and soft orange color palette, soft watercolor illustration style, longing emotional atmosphere, white background",
    promptKo: "불안하지만 사랑을 갈망하는 느낌, 걱정되면서 기대하는 표정, 폰을 쥔 모습, 하트가 든 생각풍선, 옐로우/오렌지 색상",
    style: "watercolor",
    status: "pending"
  },
  {
    id: "attachment-3",
    testKey: "attachment",
    testName: "연애 애착 스타일",
    resultName: "회피형 (Avoidant)",
    emoji: "🚪",
    description: "독립적인 공간이 중요한 타입",
    prompt: "independent avoidant person, cool calm expression, arms crossed, standing near open door or window, personal space bubble visual, blue and slate gray color palette, soft watercolor illustration style, distant but not cold atmosphere, white background",
    promptKo: "독립적이고 쿨한 느낌, 차분한 표정, 팔짱을 끼거나 창가에 서있는 모습, 블루/슬레이트그레이 색상",
    style: "watercolor",
    status: "pending"
  },
  {
    id: "attachment-4",
    testKey: "attachment",
    testName: "연애 애착 스타일",
    resultName: "혼란형 (Disorganized)",
    emoji: "🌀",
    description: "다가가고 싶지만 두려운 마음",
    prompt: "conflicted person with push-pull emotions, torn expression between longing and fear, reaching hand but stepping back, swirling emotional aura, purple and deep blue color palette, soft watercolor illustration style, complex emotional atmosphere, white background",
    promptKo: "복잡한 감정, 다가가고 싶지만 두려운 표정, 손을 뻗으면서도 뒤로 물러서는 모습, 소용돌이 오라, 퍼플/딥블루 색상",
    style: "watercolor",
    status: "pending"
  },
  {
    id: "attachment-5",
    testKey: "attachment",
    testName: "연애 애착 스타일",
    resultName: "안정-불안 경계형",
    emoji: "💛",
    description: "대체로 안정적이지만 가끔 불안해요",
    prompt: "mostly secure person with occasional worry, gentle smile with slight uncertainty in eyes, warm but watchful expression, half stable half anxious visual metaphor, yellow-green gradient color palette, soft watercolor illustration style, hopeful atmosphere, white background",
    promptKo: "대체로 안정적이지만 살짝 불안한 느낌, 부드러운 미소에 약간의 걱정, 옐로우-그린 그라데이션 색상",
    style: "watercolor",
    status: "pending"
  },
  {
    id: "attachment-6",
    testKey: "attachment",
    testName: "연애 애착 스타일",
    resultName: "안정-회피 경계형",
    emoji: "💙",
    description: "대체로 안정적이지만 가끔 거리가 필요해요",
    prompt: "secure but sometimes distant person, peaceful expression with comfortable boundaries, sitting with slight personal space, open but not clingy posture, light blue and sage green color palette, soft watercolor illustration style, calm independent atmosphere, white background",
    promptKo: "안정적이지만 적절한 거리감, 편안하면서도 독립적인 자세, 라이트블루/세이지그린 색상",
    style: "watercolor",
    status: "pending"
  },
  {
    id: "attachment-7",
    testKey: "attachment",
    testName: "연애 애착 스타일",
    resultName: "균형형",
    emoji: "⚖️",
    description: "상황에 따라 유연하게 반응하는 타입",
    prompt: "balanced flexible person, adaptive calm expression, balanced scale motif, standing at crossroads peacefully, neutral gray and soft rainbow accent color palette, soft watercolor illustration style, open possibility atmosphere, white background",
    promptKo: "유연하고 균형잡힌 느낌, 적응력 있는 차분한 표정, 저울 모티프, 그레이/무지개 포인트 색상",
    style: "watercolor",
    status: "pending"
  },
  {
    id: "attachment-8",
    testKey: "attachment",
    testName: "연애 애착 스타일",
    resultName: "회피-혼란 경계형",
    emoji: "🌊",
    description: "거리를 두고 싶지만 불안하기도 해요",
    prompt: "avoidant yet anxious person, guarded expression with hidden longing, building walls but peeking through, wave and tide motif representing push-pull, deep purple and ocean blue color palette, soft watercolor illustration style, stormy yet hopeful atmosphere, white background",
    promptKo: "거리를 두지만 속으로 불안한 느낌, 벽을 쌓지만 틈으로 보는 모습, 파도 모티프, 딥퍼플/오션블루 색상",
    style: "watercolor",
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
