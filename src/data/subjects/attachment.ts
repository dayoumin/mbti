// attachment 테스트 데이터
// 연애 애착 스타일 테스트

export const attachmentData = {
  title: "나의 연애 애착 스타일",
  subtitle: "사랑하는 방식의 비밀",
  themeColor: "bg-pink-100",
  icon: "HeartIcon",
  testType: "personality",
  dimensions: {
    anxiety: {
      name: "불안 수준",
      emoji: "💭",
      desc: "버림받을까 걱정하는 정도"
    },
    avoidance: {
      name: "회피 수준",
      emoji: "🚪",
      desc: "친밀함에 대한 거부감"
    }
  },
  questions: [
    {
      q: "연인이 하루종일 연락이 없으면?",
      dimension: "anxiety",
      a: [
        { text: "바쁜가보다. 나도 내 일 하면서 기다린다.", score: 1 },
        { text: "조금 신경 쓰이지만 참고 기다린다.", score: 3 },
        { text: "혹시 무슨 일 있나? 계속 신경 쓰인다.", score: 5 }
      ]
    },
    {
      q: "연인이 '나 좀 혼자 있고 싶어'라고 하면?",
      dimension: "anxiety",
      a: [
        { text: "알겠어, 천천히 쉬어~ 편하게 둔다.", score: 1 },
        { text: "내가 뭐 잘못했나? 불안해진다.", score: 5 }
      ]
    },
    {
      q: "연인과 사소한 다툼 후, 나는?",
      dimension: "anxiety",
      a: [
        { text: "이 정도는 괜찮아. 시간이 지나면 해결된다.", score: 1 },
        { text: "좀 신경 쓰이지만, 적당한 때 대화한다.", score: 3 },
        { text: "혹시 이별하는 건 아닐까? 불안하다.", score: 5 }
      ]
    },
    {
      q: "연인에게 '사랑해'라는 말을 얼마나 자주 듣고 싶나요?",
      dimension: "anxiety",
      a: [
        { text: "가끔 들으면 충분해. 말보다 행동이 중요해.", score: 1 },
        { text: "자주 들으면 좋지만 매번일 필요는 없어.", score: 3 },
        { text: "매일 듣고 싶어. 확인하고 싶어.", score: 5 }
      ]
    },
    {
      q: "연인의 이성 친구를 볼 때?",
      dimension: "anxiety",
      a: [
        { text: "친구니까 괜찮아. 신경 안 쓴다.", score: 1 },
        { text: "혹시 나보다 좋아하는 건 아닐까? 불안하다.", score: 5 }
      ]
    },
    {
      q: "연인이 갑자기 만남을 취소하면?",
      dimension: "anxiety",
      a: [
        { text: "할 수 없지. 다음에 보면 돼.", score: 1 },
        { text: "좀 아쉽지만 이해한다.", score: 3 },
        { text: "내가 싫은 건가? 계속 생각난다.", score: 5 }
      ]
    },
    {
      q: "연인과 깊은 대화를 나눌 때 나는?",
      dimension: "avoidance",
      a: [
        { text: "부담스러워. 화제를 돌린다.", score: 5 },
        { text: "상황에 따라 다르지만, 길어지면 부담스럽다.", score: 3 },
        { text: "좋아. 서로를 더 알아갈 수 있잖아.", score: 1 }
      ]
    },
    {
      q: "연인이 '우리 미래'에 대해 이야기하면?",
      dimension: "avoidance",
      a: [
        { text: "진지하게 함께 이야기한다.", score: 1 },
        { text: "좀 부담스럽지만 대화는 한다.", score: 3 },
        { text: "부담스러워서 슬쩍 화제를 돌린다.", score: 5 }
      ]
    },
    {
      q: "연인이 '오늘 힘들었어. 안아줘'라고 하면?",
      dimension: "avoidance",
      a: [
        { text: "당연하지! 꼭 안아준다.", score: 1 },
        { text: "괜찮아. 잠깐 토닥여준다.", score: 3 },
        { text: "조금 어색하지만 해준다.", score: 5 }
      ]
    },
    {
      q: "연인과 매일 통화하거나 메시지를 주고받는다면?",
      dimension: "avoidance",
      a: [
        { text: "좋아! 더 가까워지는 기분이야.", score: 1 },
        { text: "좀 부담스러워. 나만의 시간도 필요해.", score: 5 }
      ]
    },
    {
      q: "연인에게 내 속마음을 털어놓는 것은?",
      dimension: "avoidance",
      a: [
        { text: "자연스러워. 편하게 이야기한다.", score: 1 },
        { text: "중요한 건 말하지만 전부는 아니야.", score: 3 },
        { text: "좀 어렵고 부담스러워.", score: 5 }
      ]
    },
    {
      q: "연인과 데이트 빈도는?",
      dimension: "avoidance",
      a: [
        { text: "주 3-4회 이상, 자주 보고 싶어.", score: 1 },
        { text: "주 2-3회 정도가 적당해.", score: 3 },
        { text: "주 1-2회, 나만의 시간도 중요해.", score: 5 }
      ]
    }
  ],
  resultLabels: [
    {
      name: "안정형 (Secure)",
      emoji: "💚",
      desc: "건강한 애착, 균형 잡힌 사랑",
      condition: {
        anxiety: "low",
        avoidance: "low"
      },
      interpretation: "당신은 건강한 애착 스타일을 가지고 있습니다. 관계에서 안정감을 느끼며, 친밀함을 편안하게 받아들이고 혼자만의 시간도 존중합니다. 상대를 신뢰하면서도 독립성을 유지하는 균형 잡힌 사랑을 할 수 있어요.",
      guide: "현재의 건강한 애착을 유지하세요. 다만 상대방이 다른 애착 유형일 수 있음을 이해하고, 그들의 불안이나 회피 성향에 공감해주면 더욱 원만한 관계를 만들 수 있어요.",
      mood: "happy",
      color: "bg-green-200",
      matchPoints: [
        "안정적이고 균형 잡힌 관계를 원하는 분",
        "서로를 신뢰하며 독립성도 존중하는 연애를 원하는 분",
        "건강한 소통과 갈등 해결을 중요하게 생각하는 분"
      ]
    },
    {
      name: "불안형 (Anxious)",
      emoji: "💭",
      desc: "확인하고 싶은 마음이 큰 타입",
      condition: {
        anxiety: "high",
        avoidance: "low"
      },
      interpretation: "당신은 사랑받고 있다는 확신이 필요한 타입입니다. 상대방의 사랑을 자주 확인하고 싶어하고, 버림받을까 걱정하는 경향이 있어요. 친밀함을 원하지만, 불안감 때문에 관계에서 스트레스를 받을 수 있습니다.",
      guide: "상대방의 작은 행동을 부정적으로 해석하지 않도록 주의하세요. 자신의 불안을 인정하고, 상대에게 솔직하게 표현해보세요. 명상이나 일기 쓰기 등으로 내면의 안정감을 키우는 것도 도움이 됩니다.",
      mood: "sad",
      color: "bg-yellow-100",
      matchPoints: [
        "확신을 주는 표현을 자주 해줄 수 있는 분",
        "감정적으로 안정적이고 인내심 있는 분",
        "자주 연락하고 만나는 것을 부담스러워하지 않는 분"
      ]
    },
    {
      name: "회피형 (Avoidant)",
      emoji: "🚪",
      desc: "독립적인 공간이 중요한 타입",
      condition: {
        anxiety: "low",
        avoidance: "high"
      },
      interpretation: "당신은 독립성을 중요하게 여기고 친밀함에 부담을 느끼는 타입입니다. 혼자만의 시간과 공간이 필요하며, 상대방과 너무 가까워지는 것을 두려워할 수 있어요. 감정 표현이나 깊은 대화를 어려워하는 경향이 있습니다.",
      guide: "친밀함이 자유를 빼앗는 것이 아님을 이해해보세요. 작은 것부터 감정을 표현하는 연습을 하고, 상대방에게 자신의 성향을 솔직하게 설명하세요. 신뢰를 쌓아가면 점차 마음을 여는 것이 편해질 거예요.",
      mood: "cool",
      color: "bg-blue-200",
      matchPoints: [
        "개인 공간과 시간을 존중해주는 분",
        "천천히 관계를 발전시킬 수 있는 인내심 있는 분",
        "독립적이고 자기만의 삶이 있는 분"
      ]
    },
    {
      name: "혼란형 (Disorganized)",
      emoji: "🌀",
      desc: "다가가고 싶지만 두려운 마음",
      condition: {
        anxiety: "high",
        avoidance: "high"
      },
      interpretation: "당신은 친밀함을 원하면서도 동시에 두려워하는 복잡한 감정을 가지고 있습니다. 상대방에게 다가가고 싶지만 상처받을까 걱정되어 거리를 두기도 해요. 관계에서 혼란과 불안정을 경험할 수 있습니다.",
      guide: "과거의 상처가 현재 관계에 영향을 주고 있을 수 있어요. 전문가의 도움을 받아 자신의 감정을 이해하고, 신뢰할 수 있는 관계를 만들어가는 연습을 해보세요. 자기 자신을 먼저 돌보는 것이 중요합니다.",
      mood: "sad",
      color: "bg-purple-200",
      matchPoints: [
        "안정감을 주면서도 압박하지 않는 분",
        "감정의 기복을 이해하고 수용해주는 분",
        "꾸준하고 일관된 태도로 신뢰를 쌓아주는 분"
      ]
    },
    {
      name: "안정-불안 경계형",
      emoji: "💛",
      desc: "대체로 안정적이지만 가끔 불안해요",
      condition: {
        anxiety: "medium",
        avoidance: "low"
      },
      interpretation: "당신은 기본적으로 안정적인 애착을 가지고 있지만, 때때로 불안감을 느끼는 타입입니다. 친밀함을 편안하게 받아들이지만, 상황에 따라 확인이 필요할 때가 있어요. 대부분의 경우 건강한 관계를 유지할 수 있습니다.",
      guide: "불안감이 올라올 때를 인지하고, 그 순간에 자신을 진정시킬 수 있는 방법을 찾아보세요. 상대방과 열린 대화를 통해 서로의 니즈를 조율하면 더욱 안정적인 관계를 만들 수 있어요.",
      mood: "happy",
      color: "bg-yellow-100",
      matchPoints: [
        "감정적으로 안정적이면서도 공감력 있는 분",
        "적절한 확신을 주면서도 독립성을 존중하는 분",
        "솔직한 대화를 통해 관계를 발전시킬 수 있는 분"
      ]
    },
    {
      name: "안정-회피 경계형",
      emoji: "💙",
      desc: "대체로 안정적이지만 가끔 거리가 필요해요",
      condition: {
        anxiety: "low",
        avoidance: "medium"
      },
      interpretation: "당신은 기본적으로 안정적이지만, 때때로 개인 공간이 필요한 타입입니다. 관계에서 크게 불안해하지 않지만, 너무 가까워지면 부담스러울 수 있어요. 적절한 거리를 유지하며 편안한 관계를 선호합니다.",
      guide: "자신의 경계선을 명확히 하되, 상대방과 소통하며 조율하세요. 가끔은 comfort zone을 벗어나 더 깊은 친밀감을 시도해보는 것도 관계에 긍정적인 변화를 가져올 수 있어요.",
      mood: "cool",
      color: "bg-blue-100",
      matchPoints: [
        "독립적이면서도 따뜻한 관계를 원하는 분",
        "서로의 개인 시간을 존중하는 분",
        "부담 없이 편안한 관계를 만들어가는 분"
      ]
    },
    {
      name: "균형형 (Medium-Medium)",
      emoji: "⚖️",
      desc: "상황에 따라 유연하게 반응하는 타입",
      condition: {
        anxiety: "medium",
        avoidance: "medium"
      },
      interpretation: "당신은 불안과 회피 성향이 모두 중간 정도인 균형형입니다. 상황에 따라 다르게 반응하며, 관계의 양상에 따라 다양한 모습을 보일 수 있어요. 아직 자신의 애착 스타일이 명확하게 형성되지 않았을 수도 있습니다.",
      guide: "자신이 어떤 상황에서 불안하거나 거리를 두는지 관찰해보세요. 패턴을 파악하면 자신을 더 잘 이해하고, 더 건강한 관계를 만들어갈 수 있어요. 다양한 관계 경험을 통해 자신의 성향을 발견해보세요.",
      mood: "happy",
      color: "bg-gray-100",
      matchPoints: [
        "유연하고 이해심 넓은 분",
        "함께 성장하고 변화할 수 있는 분",
        "서로의 니즈를 존중하며 조율할 수 있는 분"
      ]
    },
    {
      name: "회피-혼란 경계형",
      emoji: "🌊",
      desc: "거리를 두고 싶지만 불안하기도 해요",
      condition: {
        anxiety: "medium",
        avoidance: "high"
      },
      interpretation: "당신은 친밀함을 회피하면서도 때때로 불안감을 느끼는 타입입니다. 가까워지는 것이 부담스럽지만, 동시에 상대방의 관심이 줄어들면 걱정되기도 해요. 관계에서 일관성을 유지하는 것이 어려울 수 있습니다.",
      guide: "자신의 모순된 감정을 인정하고 이해하는 것이 첫걸음입니다. 상대방에게 자신의 복잡한 감정을 솔직하게 전달하고, 함께 편안한 거리를 찾아가세요. 필요하다면 전문가의 도움을 받는 것도 좋습니다.",
      mood: "sad",
      color: "bg-purple-100",
      matchPoints: [
        "인내심 있고 이해심 깊은 분",
        "일관되게 안정감을 주는 분",
        "천천히 신뢰를 쌓아갈 수 있는 분"
      ]
    }
  ]
};

if (typeof window !== 'undefined') {
  window.CHEMI_SUBJECTS = window.CHEMI_SUBJECTS || {};
  window.CHEMI_SUBJECTS.attachment = attachmentData;
}
