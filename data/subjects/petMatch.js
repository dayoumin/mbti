// petMatch 테스트 데이터 (반려동물 매칭)
// 생성일: 2025-12-11
//
// 학술 근거:
// - ASPCA 반려동물 선택 가이드
// - American Kennel Club 품종별 특성
// - 반려동물 양육 환경 연구

const PET_MATCH_DATA = {
    "title": "나의 반려동물 찾기",
    "subtitle": "어떤 동물과 잘 맞을까?",
    "themeColor": "bg-amber-300",
    "icon": "PetMatchIcon",
    "testType": "matching",
    "dimensions": {
        "lifestyle": {
            "name": "생활패턴",
            "emoji": "🏃",
            "desc": "활동량과 외출 빈도"
        },
        "space": {
            "name": "주거공간",
            "emoji": "🏠",
            "desc": "집의 크기와 환경"
        },
        "time": {
            "name": "돌봄시간",
            "emoji": "⏰",
            "desc": "반려동물에게 쓸 수 있는 시간"
        },
        "experience": {
            "name": "경험도",
            "emoji": "📚",
            "desc": "반려동물 양육 경험"
        },
        "interaction": {
            "name": "교감욕구",
            "emoji": "💕",
            "desc": "원하는 교감 수준"
        }
    },
    "questions": [
        {
            "q": "평소 얼마나 활동적인 편인가요?",
            "dimension": "lifestyle",
            "a": [
                { "text": "매일 운동하고 야외활동 좋아해요", "score": 5 },
                { "text": "집에서 쉬는 게 좋아요", "score": 1 }
            ]
        },
        {
            "q": "외출이나 여행이 잦은 편인가요?",
            "dimension": "lifestyle",
            "a": [
                { "text": "집에 있는 날이 더 많아요", "score": 5 },
                { "text": "자주 집을 비워요", "score": 1 }
            ]
        },
        {
            "q": "아침에 일찍 일어나는 편인가요?",
            "dimension": "lifestyle",
            "a": [
                { "text": "네, 아침형 인간이에요", "score": 5 },
                { "text": "늦잠 자는 걸 좋아해요", "score": 1 }
            ]
        },
        {
            "q": "주거 공간은 어느 정도 되나요?",
            "dimension": "space",
            "a": [
                { "text": "넓은 집이나 마당이 있어요", "score": 5 },
                { "text": "원룸이나 작은 공간이에요", "score": 1 }
            ]
        },
        {
            "q": "반려동물이 뛰어다닐 공간이 있나요?",
            "dimension": "space",
            "a": [
                { "text": "충분히 있어요", "score": 5 },
                { "text": "거의 없어요", "score": 1 }
            ]
        },
        {
            "q": "이웃이나 소음에 민감한 환경인가요?",
            "dimension": "space",
            "a": [
                { "text": "소음에 자유로운 편이에요", "score": 5 },
                { "text": "조용히 지내야 해요", "score": 1 }
            ]
        },
        {
            "q": "하루에 반려동물과 보낼 수 있는 시간은?",
            "dimension": "time",
            "a": [
                { "text": "거의 하루종일 함께해요", "score": 5 },
                { "text": "저녁에 잠깐 정도요", "score": 1 }
            ]
        },
        {
            "q": "반려동물 산책/운동을 시켜줄 수 있나요?",
            "dimension": "time",
            "a": [
                { "text": "매일 산책 가능해요", "score": 5 },
                { "text": "시간 내기 어려워요", "score": 1 }
            ]
        },
        {
            "q": "그루밍이나 목욕을 자주 시켜줄 수 있나요?",
            "dimension": "time",
            "a": [
                { "text": "정기적으로 해줄 수 있어요", "score": 5 },
                { "text": "자주는 어려워요", "score": 1 }
            ]
        },
        {
            "q": "반려동물을 키워본 경험이 있나요?",
            "dimension": "experience",
            "a": [
                { "text": "네, 여러 마리 키워봤어요", "score": 5 },
                { "text": "처음이에요", "score": 1 }
            ]
        },
        {
            "q": "동물 훈련에 자신 있나요?",
            "dimension": "experience",
            "a": [
                { "text": "네, 기본 훈련은 할 수 있어요", "score": 5 },
                { "text": "전혀 모르겠어요", "score": 1 }
            ]
        },
        {
            "q": "얼마나 적극적인 교감을 원하나요?",
            "dimension": "interaction",
            "a": [
                { "text": "항상 붙어있고 싶어요", "score": 5 },
                { "text": "가끔 바라보는 정도면 충분해요", "score": 1 }
            ]
        },
        {
            "q": "반려동물에게 애교를 받고 싶나요?",
            "dimension": "interaction",
            "a": [
                { "text": "애교 부리는 게 좋아요", "score": 5 },
                { "text": "독립적인 게 더 좋아요", "score": 1 }
            ]
        }
    ],
    "questions_deep": [
        {
            "q": "알레르기가 있나요?",
            "dimension": "space",
            "a": [
                { "text": "없어요", "score": 5 },
                { "text": "털 알레르기가 있어요", "score": 1 }
            ]
        },
        {
            "q": "야간에 소음이 괜찮나요?",
            "dimension": "lifestyle",
            "a": [
                { "text": "괜찮아요, 잠귀가 어두워요", "score": 5 },
                { "text": "조용해야 잠들어요", "score": 1 }
            ]
        },
        {
            "q": "반려동물 의료비에 여유가 있나요?",
            "dimension": "experience",
            "a": [
                { "text": "충분히 준비되어 있어요", "score": 5 },
                { "text": "기본적인 것만 가능해요", "score": 1 }
            ]
        },
        {
            "q": "10년 이상 함께할 준비가 되었나요?",
            "dimension": "time",
            "a": [
                { "text": "당연하죠!", "score": 5 },
                { "text": "솔직히 잘 모르겠어요", "score": 1 }
            ]
        },
        {
            "q": "가족 구성원 모두 동의했나요?",
            "dimension": "experience",
            "a": [
                { "text": "네, 모두 환영해요", "score": 5 },
                { "text": "아직 논의 중이에요", "score": 1 }
            ]
        },
        {
            "q": "장시간 외출 시 맡길 곳이 있나요?",
            "dimension": "time",
            "a": [
                { "text": "가족이나 펫시터가 있어요", "score": 5 },
                { "text": "맡길 곳이 없어요", "score": 1 }
            ]
        },
        {
            "q": "반려동물과 대화(말 걸기)하고 싶나요?",
            "dimension": "interaction",
            "a": [
                { "text": "수다떨고 싶어요!", "score": 5 },
                { "text": "조용히 함께하는 게 좋아요", "score": 1 }
            ]
        },
        {
            "q": "장난감이나 액세서리 꾸미기에 관심 있나요?",
            "dimension": "interaction",
            "a": [
                { "text": "네, 예쁘게 해주고 싶어요", "score": 5 },
                { "text": "기본적인 것만 있으면 돼요", "score": 1 }
            ]
        }
    ],
    "resultLabels": [
        {
            "name": "활발한 강아지",
            "emoji": "🐕",
            "desc": "매일 함께 뛰어놀 에너지 넘치는 친구!",
            "condition": { "lifestyle": "high", "space": "high", "time": "high", "interaction": "high" },
            "mood": "excited",
            "color": "bg-amber-100",
            "interpretation": "당신은 활동적이고, 넓은 공간과 충분한 시간이 있네요! 활발한 강아지(골든리트리버, 래브라도, 보더콜리 등)와 함께라면 매일이 즐거울 거예요. 산책, 공놀이, 훈련 등 함께할 활동이 많아요.",
            "guide": "하루 2번 이상 산책이 필요해요. 훈련을 통해 좋은 습관을 만들어주세요. 넘치는 에너지를 발산할 놀이 시간을 꼭 가져주세요.",
            "matchPoints": ["야외활동을 좋아하는 분", "넓은 공간이 있는 분", "매일 산책 가능한 분", "적극적인 교감을 원하는 분"]
        },
        {
            "name": "얌전한 소형견",
            "emoji": "🐶",
            "desc": "아담하고 사랑스러운 동반자",
            "condition": { "space": "low", "time": "medium", "interaction": "high" },
            "mood": "happy",
            "color": "bg-orange-100",
            "interpretation": "작은 공간에서도 잘 적응하고 애교 많은 소형견이 잘 맞아요! 말티즈, 푸들, 시츄, 치와와 같은 친구들은 실내에서도 행복하게 지내요. 산책은 짧아도 되지만 애정 표현은 듬뿍!",
            "guide": "실내에서도 충분히 활동할 수 있어요. 분리불안에 주의하세요. 정기적인 미용이 필요한 품종이 많아요.",
            "matchPoints": ["아파트나 원룸 거주자", "애교 많은 반려동물을 원하는 분", "항상 붙어있고 싶은 분", "짧은 산책도 OK인 분"]
        },
        {
            "name": "도도한 고양이",
            "emoji": "🐱",
            "desc": "독립적이면서도 은근한 애정을 주는 친구",
            "condition": { "lifestyle": "low", "time": "low", "interaction": "medium" },
            "mood": "cool",
            "color": "bg-slate-100",
            "interpretation": "바쁜 생활 속에서도 함께할 수 있는 고양이가 딱이에요! 혼자서도 잘 지내고, 당신이 집에 오면 은근슬쩍 다가오는 고양이의 매력에 빠질 거예요. 청소(털, 모래)만 잘 해주면 돼요.",
            "guide": "실내 생활만으로 충분해요. 스크래처와 캣타워를 준비해주세요. 화장실 청소는 매일! 물은 항상 신선하게.",
            "matchPoints": ["바쁜 직장인", "독립적인 반려동물을 원하는 분", "산책이 어려운 분", "조용한 환경을 원하는 분"]
        },
        {
            "name": "응석쟁이 고양이",
            "emoji": "😺",
            "desc": "개냥이라 불리는 애교 만렙 고양이",
            "condition": { "time": "medium", "space": "low", "interaction": "high" },
            "mood": "happy",
            "color": "bg-pink-100",
            "interpretation": "고양이지만 강아지처럼 애교 넘치는 품종이 있어요! 랙돌, 스코티시폴드, 버만 같은 친구들은 주인을 졸졸 따라다니고 안기는 것도 좋아해요. 고양이의 편리함 + 강아지의 친근함!",
            "guide": "충분한 스킨십을 해주세요. 놀아주는 시간을 정해두면 좋아요. 장모종은 빗질이 필요해요.",
            "matchPoints": ["고양이를 원하지만 교감도 원하는 분", "아파트 거주자", "애교 부리는 게 좋은 분", "산책 없이 실내에서 키우고 싶은 분"]
        },
        {
            "name": "귀여운 토끼",
            "emoji": "🐰",
            "desc": "말랑말랑 솜뭉치 같은 힐링 친구",
            "condition": { "space": "low", "time": "low", "interaction": "medium" },
            "mood": "happy",
            "color": "bg-pink-50",
            "interpretation": "조용하고 귀여운 토끼는 아파트에서 키우기 좋아요! 냄새도 적고 소음도 없어요. 풀을 뜯어먹는 모습만 봐도 힐링이 되죠. 꾸준한 건초 공급과 케이지 청소만 해주면 돼요.",
            "guide": "건초(티모시)가 주식이에요. 케이지 밖에서 운동 시간도 필요해요. 더위에 약하니 온도 관리 중요해요.",
            "matchPoints": ["조용한 반려동물을 원하는 분", "털 알레르기 걱정되는 분", "힐링 동물을 원하는 분", "작은 공간에서 키우고 싶은 분"]
        },
        {
            "name": "활발한 햄스터",
            "emoji": "🐹",
            "desc": "작지만 귀여움이 폭발하는 친구",
            "condition": { "space": "low", "time": "low", "experience": "low" },
            "mood": "excited",
            "color": "bg-amber-50",
            "interpretation": "작은 공간, 적은 시간, 처음 키워보는 분에게 햄스터는 최고의 선택이에요! 쳇바퀴 돌리는 모습, 볼에 먹이 넣는 모습이 너무 귀여워요. 관리도 간단한 편이에요.",
            "guide": "밤에 활동하니 침실에 두면 시끄러울 수 있어요. 쳇바퀴는 필수! 모래목욕을 좋아해요.",
            "matchPoints": ["첫 반려동물로 추천", "작은 공간", "관리가 간단한 동물을 원하는 분", "귀여운 동물을 바라보고 싶은 분"]
        },
        {
            "name": "느긋한 물고기",
            "emoji": "🐠",
            "desc": "바라만 봐도 힐링되는 수중 친구",
            "condition": { "time": "low", "interaction": "low", "experience": "low" },
            "mood": "cool",
            "color": "bg-blue-50",
            "interpretation": "시간이 없거나 직접 교감보다 바라보는 힐링을 원한다면 물고기가 딱이에요! 베타, 구피, 금붕어 같은 친구들은 관리도 쉽고 인테리어 효과도 있어요. 물만 잘 관리해주면 돼요.",
            "guide": "물갈이와 여과기 관리가 중요해요. 과식 주의! 적정 온도 유지해주세요.",
            "matchPoints": ["바라보는 힐링을 원하는 분", "스킨십이 필요 없는 분", "알레르기가 있는 분", "인테리어 효과도 원하는 분"]
        },
        {
            "name": "똑똑한 앵무새",
            "emoji": "🦜",
            "desc": "대화하고 교감하는 깃털 친구",
            "condition": { "time": "high", "interaction": "high", "experience": "medium" },
            "mood": "excited",
            "color": "bg-green-100",
            "interpretation": "말을 배우고 교감하는 앵무새는 정말 특별한 경험을 줘요! 사회성이 좋아서 주인과 대화하고 놀기를 좋아해요. 시간 투자가 필요하지만 그만큼 보람 있는 친구예요.",
            "guide": "매일 꺼내서 교감해야 해요. 지능이 높아 지루하면 스트레스 받아요. 소음이 있을 수 있어요.",
            "matchPoints": ["대화하는 반려동물을 원하는 분", "시간 투자 가능한 분", "독특한 반려동물을 원하는 분", "소음에 괜찮은 환경"]
        }
    ]
};

window.CHEMI_SUBJECTS = window.CHEMI_SUBJECTS || {};
window.CHEMI_SUBJECTS.petMatch = PET_MATCH_DATA;
