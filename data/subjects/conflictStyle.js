// conflictStyle 테스트 데이터 - 갈등 대처 유형
// 학술 근거: Gottman, TKI (Thomas-Kilmann), Dyadic Coping (Bodenmann)
// 생성일: 2025-12-14

const CONFLICTSTYLE_DATA = {
  "title": "갈등 대처 유형 테스트",
  "subtitle": "연인과 갈등 상황에서 나는 어떻게 대처할까?",
  "themeColor": "violet",
  "icon": "HeartHandshake",
  "testType": "personality",
  "dimensions": {
    "assert": {
      "name": "주장성",
      "emoji": "🎯",
      "desc": "내 의견 표현 정도"
    },
    "engage": {
      "name": "참여도",
      "emoji": "🤝",
      "desc": "대화 유지 vs 철수"
    },
    "repair": {
      "name": "회복력",
      "emoji": "🩹",
      "desc": "관계 복구 능력"
    },
    "empathy": {
      "name": "공감력",
      "emoji": "💜",
      "desc": "상대 관점 이해"
    },
    "express": {
      "name": "표현력",
      "emoji": "💬",
      "desc": "감정 표현 방식"
    },
    "support": {
      "name": "지지력",
      "emoji": "🫂",
      "desc": "스트레스 시 지원"
    }
  },
  "questions": [
    {
      "q": "연인과 의견이 다를 때 나는?",
      "dimension": "assert",
      "a": [
        { "text": "내 생각을 분명하게 말해", "score": 5 },
        { "text": "상대 의견을 먼저 들어봐", "score": 1 }
      ]
    },
    {
      "q": "싸움 중에 연인이 말을 끊으면?",
      "dimension": "assert",
      "a": [
        { "text": "다시 내 말을 이어서 해", "score": 5 },
        { "text": "일단 상대가 끝날 때까지 기다려", "score": 1 }
      ]
    },
    {
      "q": "내 요구가 받아들여지지 않을 때?",
      "dimension": "assert",
      "a": [
        { "text": "다른 방식으로 다시 설득해", "score": 5 },
        { "text": "이번엔 내가 양보할게", "score": 1 }
      ]
    },
    {
      "q": "심한 말다툼 중에 나는?",
      "dimension": "engage",
      "a": [
        { "text": "끝까지 대화로 해결하려 해", "score": 5 },
        { "text": "일단 자리를 피하고 진정해", "score": 1 }
      ]
    },
    {
      "q": "연인이 화가 나서 대화를 거부하면?",
      "dimension": "engage",
      "a": [
        { "text": "계속 대화하자고 설득해", "score": 5 },
        { "text": "시간을 주고 기다려", "score": 1 }
      ]
    },
    {
      "q": "갈등 상황에서 연인이 울면?",
      "dimension": "engage",
      "a": [
        { "text": "바로 안아주고 대화를 이어가", "score": 5 },
        { "text": "진정할 시간을 줘", "score": 1 }
      ]
    },
    {
      "q": "싸운 다음 날 아침, 나는?",
      "dimension": "repair",
      "a": [
        { "text": "먼저 연락해서 화해 시도", "score": 5 },
        { "text": "상대가 연락할 때까지 기다려", "score": 1 }
      ]
    },
    {
      "q": "화해할 때 나는 주로?",
      "dimension": "repair",
      "a": [
        { "text": "\"미안해\"라고 먼저 말해", "score": 5 },
        { "text": "행동으로 보여줘", "score": 1 }
      ]
    },
    {
      "q": "같은 문제로 또 싸웠을 때?",
      "dimension": "repair",
      "a": [
        { "text": "근본적인 해결책을 찾아봐", "score": 5 },
        { "text": "그냥 넘어가고 싶어", "score": 1 }
      ]
    },
    {
      "q": "연인이 속상해하는 이유를 모를 때?",
      "dimension": "empathy",
      "a": [
        { "text": "왜 그런지 계속 물어봐", "score": 5 },
        { "text": "말해줄 때까지 기다려", "score": 1 }
      ]
    },
    {
      "q": "내가 이해 못할 이유로 연인이 화났을 때?",
      "dimension": "empathy",
      "a": [
        { "text": "상대 입장에서 생각해보려 해", "score": 5 },
        { "text": "솔직히 이해가 안 돼", "score": 1 }
      ]
    },
    {
      "q": "연인의 걱정거리에 대해?",
      "dimension": "empathy",
      "a": [
        { "text": "내 일처럼 걱정돼", "score": 5 },
        { "text": "응원은 하지만 각자의 일이야", "score": 1 }
      ]
    },
    {
      "q": "화가 났을 때 나는?",
      "dimension": "express",
      "a": [
        { "text": "바로 표현하는 편이야", "score": 5 },
        { "text": "속으로 삭이는 편이야", "score": 1 }
      ]
    },
    {
      "q": "연인에게 서운할 때?",
      "dimension": "express",
      "a": [
        { "text": "\"그게 서운했어\"라고 말해", "score": 5 },
        { "text": "티 안 내려고 해", "score": 1 }
      ]
    },
    {
      "q": "갈등 중 내 감정은?",
      "dimension": "express",
      "a": [
        { "text": "솔직하게 다 얘기해", "score": 5 },
        { "text": "정리되면 말할게", "score": 1 }
      ]
    },
    {
      "q": "연인이 스트레스받을 때 나는?",
      "dimension": "support",
      "a": [
        { "text": "적극적으로 도와주려 해", "score": 5 },
        { "text": "옆에서 조용히 응원해", "score": 1 }
      ]
    },
    {
      "q": "연인이 힘든 일을 겪을 때?",
      "dimension": "support",
      "a": [
        { "text": "같이 해결 방법을 찾아", "score": 5 },
        { "text": "들어주고 공감해줘", "score": 1 }
      ]
    },
    {
      "q": "연인이 실수했을 때?",
      "dimension": "support",
      "a": [
        { "text": "괜찮다고 먼저 말해줘", "score": 5 },
        { "text": "스스로 해결하도록 지켜봐", "score": 1 }
      ]
    }
  ],
  "questions_deep": [
    {
      "q": "중요한 결정에서 의견이 다르면?",
      "dimension": "assert",
      "a": [
        { "text": "내 의견을 끝까지 주장해", "score": 5 },
        { "text": "타협점을 찾으려 해", "score": 3 }
      ]
    },
    {
      "q": "연인이 내 의견을 무시한다고 느낄 때?",
      "dimension": "assert",
      "a": [
        { "text": "분명하게 불만을 표현해", "score": 5 },
        { "text": "속상하지만 참아", "score": 1 }
      ]
    },
    {
      "q": "갈등이 길어질 때 나는?",
      "dimension": "engage",
      "a": [
        { "text": "해결될 때까지 대화해", "score": 5 },
        { "text": "잠시 거리를 두고 생각해", "score": 1 }
      ]
    },
    {
      "q": "연인이 과거 일을 다시 꺼내면?",
      "dimension": "engage",
      "a": [
        { "text": "그것도 함께 정리하자고 해", "score": 5 },
        { "text": "지금 문제에 집중하자고 해", "score": 2 }
      ]
    },
    {
      "q": "큰 싸움 후 관계가 어색할 때?",
      "dimension": "repair",
      "a": [
        { "text": "일상적인 대화로 분위기 풀어", "score": 5 },
        { "text": "시간이 해결해줄 거야", "score": 1 }
      ]
    },
    {
      "q": "화해 후에도 마음이 불편하면?",
      "dimension": "repair",
      "a": [
        { "text": "솔직하게 더 얘기해", "score": 5 },
        { "text": "그냥 넘어가려고 해", "score": 1 }
      ]
    },
    {
      "q": "연인의 입장이 이해가 안 될 때?",
      "dimension": "empathy",
      "a": [
        { "text": "이해될 때까지 물어봐", "score": 5 },
        { "text": "다르다는 걸 인정해", "score": 2 }
      ]
    },
    {
      "q": "내가 잘못한 게 아닌 것 같을 때?",
      "dimension": "empathy",
      "a": [
        { "text": "그래도 상대 기분을 헤아려", "score": 5 },
        { "text": "내 입장을 설명해", "score": 2 }
      ]
    },
    {
      "q": "속상한 마음을 숨기고 있을 때?",
      "dimension": "express",
      "a": [
        { "text": "결국 터뜨리게 돼", "score": 5 },
        { "text": "혼자 삭이고 넘겨", "score": 1 }
      ]
    },
    {
      "q": "연인과의 갈등을 주변에?",
      "dimension": "express",
      "a": [
        { "text": "친한 친구에게 털어놔", "score": 5 },
        { "text": "둘만의 일로 남겨둬", "score": 1 }
      ]
    },
    {
      "q": "연인이 나 때문에 힘들어할 때?",
      "dimension": "support",
      "a": [
        { "text": "어떻게든 해결해주고 싶어", "score": 5 },
        { "text": "미안하지만 어쩔 수 없어", "score": 1 }
      ]
    },
    {
      "q": "연인의 스트레스가 나한테 영향을 줄 때?",
      "dimension": "support",
      "a": [
        { "text": "같이 해결하는 게 맞아", "score": 5 },
        { "text": "각자 감당해야 해", "score": 1 }
      ]
    }
  ],
  "resultLabels": [
    {
      "name": "적극적 협력가",
      "emoji": "🤝",
      "desc": "갈등을 기회로 만드는 소통 고수",
      "condition": {
        "assert": "high",
        "engage": "high",
        "empathy": "high"
      },
      "matchPoints": [
        "끝까지 대화로 해결하려 함",
        "상대 입장도 충분히 고려",
        "갈등 후 관계가 더 단단해짐"
      ],
      "interpretation": "당신은 갈등 상황에서도 대화를 멈추지 않아요. 내 의견도 명확히 전달하면서 상대방의 입장도 이해하려 노력하죠. 이런 균형 잡힌 태도 덕분에 갈등이 오히려 관계를 깊게 만드는 기회가 됩니다.",
      "guide": "당신의 적극적인 소통 방식은 훌륭해요. 다만 상대가 정리할 시간이 필요할 때는 잠시 기다려주는 여유도 필요해요.",
      "mood": "happy",
      "color": "bg-emerald-100"
    },
    {
      "name": "열정적 파이터",
      "emoji": "🔥",
      "desc": "치열하게 부딪히는 뜨거운 사람",
      "condition": {
        "assert": "high",
        "express": "high",
        "engage": "high"
      },
      "matchPoints": [
        "문제 해결에 적극적",
        "감정 표현이 강렬함",
        "빠른 화해도 특기"
      ],
      "interpretation": "당신은 갈등 상황에서 뜨겁게 부딪혀요. 화가 나면 참지 않고, 문제가 있으면 즉시 제기하죠. 하지만 싸운 만큼 빨리 풀리는 것도 당신의 특징이에요.",
      "guide": "열정적인 건 좋지만, 말의 수위 조절이 필요해요. 흥분 상태에서 내뱉은 말은 오래 상처로 남을 수 있어요. 잠깐의 쉬는 시간을 가져보세요.",
      "mood": "excited",
      "color": "bg-red-100"
    },
    {
      "name": "따뜻한 조율가",
      "emoji": "💜",
      "desc": "공감으로 갈등을 녹이는 힐러",
      "condition": {
        "empathy": "high",
        "support": "high",
        "repair": "high"
      },
      "matchPoints": [
        "상대 감정을 먼저 읽어줌",
        "화해를 위해 먼저 다가감",
        "갈등 후에도 따뜻함 유지"
      ],
      "interpretation": "당신은 갈등 상황에서 상대방의 마음을 먼저 읽어요. 상대가 왜 화났는지, 무엇이 필요한지 파악하고 따뜻하게 다가가죠. 관계 회복에 탁월한 능력을 가졌어요.",
      "guide": "공감 능력이 뛰어나지만, 가끔은 당신의 감정과 의견도 분명히 표현해야 해요. 일방적인 양보는 결국 관계에 독이 됩니다.",
      "mood": "happy",
      "color": "bg-purple-100"
    },
    {
      "name": "솔직한 전달자",
      "emoji": "💬",
      "desc": "생각과 감정을 명확히 전하는 사람",
      "condition": {
        "assert": "high",
        "express": "high",
        "empathy": "low"
      },
      "matchPoints": [
        "감정을 숨기지 않음",
        "문제를 직접적으로 제기",
        "오해 없이 명확한 소통"
      ],
      "interpretation": "당신은 속으로 삭이지 않고 솔직하게 표현해요. 화가 나면 화났다고, 서운하면 서운하다고 바로 말하죠. 이런 직접적인 소통 방식은 오해를 줄여줍니다.",
      "guide": "솔직함은 좋지만, 표현 방식에 주의가 필요해요. 같은 말도 어떻게 하느냐에 따라 상대가 받아들이는 느낌이 달라져요. 상대의 감정도 헤아려보세요.",
      "mood": "cool",
      "color": "bg-blue-100"
    },
    {
      "name": "든든한 지원군",
      "emoji": "🫂",
      "desc": "어려울 때 곁에 있어주는 사람",
      "condition": {
        "support": "high",
        "repair": "high",
        "assert": "low"
      },
      "matchPoints": [
        "상대 스트레스를 함께 짊어짐",
        "화해를 위해 먼저 노력",
        "실질적인 도움 제공"
      ],
      "interpretation": "당신은 연인이 힘들 때 가장 빛나요. 갈등 상황에서도 상대를 비난하기보다 함께 해결책을 찾으려 하고, 화해를 위해 먼저 손을 내밀어요.",
      "guide": "지지하는 건 좋지만, 당신의 감정도 소중해요. 상대의 문제를 다 떠안지 말고, 가끔은 당신의 의견도 말해보세요.",
      "mood": "happy",
      "color": "bg-amber-100"
    },
    {
      "name": "평화로운 중재자",
      "emoji": "☮️",
      "desc": "조화를 중시하는 갈등 회피자",
      "condition": {
        "assert": "low",
        "empathy": "high"
      },
      "matchPoints": [
        "갈등보다 평화를 선택",
        "상대를 배려하며 양보",
        "부드러운 분위기 조성"
      ],
      "interpretation": "당신은 갈등 자체를 싫어해요. 싸우느니 내가 양보하는 게 낫다고 생각하죠. 평화로운 관계 유지가 가장 중요하고, 상대를 배려하는 마음이 큽니다.",
      "guide": "양보만 하다 보면 억눌린 감정이 쌓여요. 가끔은 당신의 needs도 중요하다는 걸 기억하세요. 건강한 갈등은 관계를 성장시킵니다.",
      "mood": "happy",
      "color": "bg-green-100"
    },
    {
      "name": "신중한 관찰자",
      "emoji": "🔍",
      "desc": "한 발 물러서 상황을 파악하는 사람",
      "condition": {
        "engage": "low",
        "express": "low"
      },
      "matchPoints": [
        "감정적 반응을 자제함",
        "충분히 생각 후 대응",
        "불필요한 싸움 회피"
      ],
      "interpretation": "당신은 갈등 상황에서 한 발 물러서 상황을 파악해요. 즉각적으로 반응하기보다 생각을 정리한 후 대응하죠. 불필요한 감정 소모를 줄이는 현명함이 있어요.",
      "guide": "신중함도 좋지만, 너무 오래 기다리면 상대는 무관심으로 느낄 수 있어요. 적절한 타이밍에 대화 의지를 보여주세요.",
      "mood": "neutral",
      "color": "bg-slate-100"
    },
    {
      // TKI Compromising: 중간 수준의 주장성과 협조성
      "name": "밸런스 소통가",
      "emoji": "⚖️",
      "desc": "균형 잡힌 갈등 관리자",
      "condition": {
        "assert": "medium",
        "empathy": "medium"
      },
      "matchPoints": [
        "상황에 따라 유연하게 대처",
        "때론 주장, 때론 양보",
        "안정적인 관계 유지"
      ],
      "interpretation": "당신은 갈등 상황에서 극단으로 치우치지 않아요. 상황에 따라 때론 내 의견을 주장하고, 때론 상대에게 양보하며 균형을 찾아가죠.",
      "guide": "균형 잡힌 태도가 장점이에요. 다만 중요한 문제에서는 분명한 입장을 보여주는 것도 필요합니다. 모든 걸 타협하려 하면 핵심이 흐려질 수 있어요.",
      "mood": "happy",
      "color": "bg-teal-100"
    }
  ]
};

window.CHEMI_SUBJECTS = window.CHEMI_SUBJECTS || {};
window.CHEMI_SUBJECTS.conflictStyle = CONFLICTSTYLE_DATA;
