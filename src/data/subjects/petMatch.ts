// petMatch 테스트 데이터 - 반려동물 매칭
// 2단계 구조: petMatch(동물군) → 세부 테스트(품종)

import { SubjectData } from '../types';

export const petMatchData: SubjectData = {
    "title": "나의 반려동물 찾기",
    "subtitle": "어떤 동물과 잘 맞을까?",
    "themeColor": "bg-amber-300",
    "icon": "PetMatchIcon",
    "testType": "matching",
    "dimensions": {
        "activity": {
            "name": "활동량",
            "emoji": "🏃",
            "desc": "나의 활동적인 정도"
        },
        "space": {
            "name": "공간",
            "emoji": "🏠",
            "desc": "주거 공간 크기"
        },
        "time": {
            "name": "돌봄시간",
            "emoji": "⏰",
            "desc": "반려동물에게 쓸 수 있는 시간"
        },
        "noise": {
            "name": "소음허용",
            "emoji": "🔊",
            "desc": "소음에 대한 허용도"
        },
        "touch": {
            "name": "스킨십",
            "emoji": "🤗",
            "desc": "원하는 스킨십 수준"
        },
        "care": {
            "name": "관리난이도",
            "emoji": "🧹",
            "desc": "관리에 투자할 수 있는 노력"
        }
    },
    "questions": [
        // === 활동량 (activity) ===
        {
            "q": "평소 얼마나 활동적인 편인가요?",
            "dimension": "activity",
            "a": [
                { "text": "매일 운동하고 야외활동 좋아해요", "score": 5 },
                { "text": "가끔 산책이나 가벼운 운동 해요", "score": 3 },
                { "text": "집에서 쉬는 게 가장 좋아요", "score": 1 }
            ]
        },
        {
            "q": "주말에 주로 어떻게 보내나요?",
            "dimension": "activity",
            "a": [
                { "text": "등산, 캠핑 등 야외 활동!", "score": 5 },
                { "text": "친구 만나거나 쇼핑 정도", "score": 3 },
                { "text": "집에서 넷플릭스가 최고", "score": 1 }
            ]
        },
        // === 공간 (space) ===
        {
            "q": "현재 주거 공간은 어느 정도인가요?",
            "dimension": "space",
            "a": [
                { "text": "마당 있는 집이나 넓은 아파트", "score": 5 },
                { "text": "일반적인 아파트/빌라", "score": 3 },
                { "text": "원룸이나 작은 공간", "score": 1 }
            ]
        },
        {
            "q": "반려동물이 활동할 공간이 있나요?",
            "dimension": "space",
            "a": [
                { "text": "뛰어다닐 공간 충분해요", "score": 5 },
                { "text": "어느 정도는 있어요", "score": 3 },
                { "text": "거의 없어요, 좁아요", "score": 1 }
            ]
        },
        // === 돌봄 시간 (time) ===
        {
            "q": "하루에 반려동물과 보낼 수 있는 시간은?",
            "dimension": "time",
            "a": [
                { "text": "3시간 이상, 거의 함께해요", "score": 5 },
                { "text": "1~2시간 정도", "score": 3 },
                { "text": "30분 이하, 바쁜 편이에요", "score": 1 }
            ]
        },
        {
            "q": "매일 규칙적인 돌봄(산책, 밥, 청소)이 가능한가요?",
            "dimension": "time",
            "a": [
                { "text": "네, 규칙적인 생활해요", "score": 5 },
                { "text": "대체로 가능해요", "score": 3 },
                { "text": "일정이 불규칙해요", "score": 1 }
            ]
        },
        // === 소음 허용 (noise) ===
        {
            "q": "반려동물 소리(짖음, 울음)에 대한 환경은?",
            "dimension": "noise",
            "a": [
                { "text": "괜찮아요, 층간소음 걱정 없어요", "score": 5 },
                { "text": "적당한 소리는 괜찮아요", "score": 3 },
                { "text": "조용해야 해요, 민감한 환경", "score": 1 }
            ]
        },
        // === 스킨십 (touch) ===
        {
            "q": "반려동물과 어떤 교감을 원하나요?",
            "dimension": "touch",
            "a": [
                { "text": "안고, 쓰다듬고, 함께 자고 싶어요", "score": 5 },
                { "text": "가끔 만지고 놀아주면 돼요", "score": 3 },
                { "text": "바라보는 것만으로 충분해요", "score": 1 }
            ]
        },
        {
            "q": "반려동물이 나를 따라다니는 것을 원하나요?",
            "dimension": "touch",
            "a": [
                { "text": "항상 붙어있고 싶어요!", "score": 5 },
                { "text": "적당히 독립적이면 좋겠어요", "score": 3 },
                { "text": "각자 공간이 있으면 좋겠어요", "score": 1 }
            ]
        },
        // === 관리 난이도 (care) ===
        {
            "q": "털 관리, 청소 등에 얼마나 시간을 쓸 수 있나요?",
            "dimension": "care",
            "a": [
                { "text": "매일 빗질, 청소 OK!", "score": 5 },
                { "text": "주 1~2회 정도 가능해요", "score": 3 },
                { "text": "최소한으로 하고 싶어요", "score": 1 }
            ]
        }
    ],
    "questions_deep": [
        // === 추가 활동량 ===
        {
            "q": "아침에 일찍 일어나는 편인가요?",
            "dimension": "activity",
            "a": [
                { "text": "네, 아침형 인간이에요", "score": 5 },
                { "text": "필요하면 일어나요", "score": 3 },
                { "text": "늦잠이 좋아요", "score": 1 }
            ]
        },
        // === 추가 공간 ===
        {
            "q": "베란다나 테라스가 있나요?",
            "dimension": "space",
            "a": [
                { "text": "네, 넓은 베란다가 있어요", "score": 5 },
                { "text": "작은 베란다는 있어요", "score": 3 },
                { "text": "없어요", "score": 1 }
            ]
        },
        // === 추가 시간 ===
        {
            "q": "출장이나 여행이 잦은 편인가요?",
            "dimension": "time",
            "a": [
                { "text": "거의 없어요, 집에 있는 편", "score": 5 },
                { "text": "가끔 있어요", "score": 3 },
                { "text": "자주 집을 비워요", "score": 1 }
            ]
        },
        {
            "q": "장시간 외출 시 맡길 곳이 있나요?",
            "dimension": "time",
            "a": [
                { "text": "가족이나 펫시터 있어요", "score": 5 },
                { "text": "찾아보면 있을 것 같아요", "score": 3 },
                { "text": "맡길 곳이 없어요", "score": 1 }
            ]
        },
        // === 추가 소음 ===
        {
            "q": "밤에 동물 소리가 나도 괜찮나요?",
            "dimension": "noise",
            "a": [
                { "text": "괜찮아요, 잠귀 어두워요", "score": 5 },
                { "text": "가끔은 괜찮아요", "score": 3 },
                { "text": "조용해야 잠들어요", "score": 1 }
            ]
        },
        // === 추가 스킨십 ===
        {
            "q": "반려동물과 대화(말 걸기)하고 싶나요?",
            "dimension": "touch",
            "a": [
                { "text": "수다떨고 싶어요!", "score": 5 },
                { "text": "가끔 말 걸 것 같아요", "score": 3 },
                { "text": "조용히 함께하면 돼요", "score": 1 }
            ]
        },
        // === 추가 관리 ===
        {
            "q": "반려동물 의료비에 여유가 있나요?",
            "dimension": "care",
            "a": [
                { "text": "충분히 준비되어 있어요", "score": 5 },
                { "text": "어느 정도는 가능해요", "score": 3 },
                { "text": "기본적인 것만 가능해요", "score": 1 }
            ]
        },
        {
            "q": "특수한 먹이(생먹이, 특수사료)를 줄 수 있나요?",
            "dimension": "care",
            "a": [
                { "text": "문제없어요!", "score": 5 },
                { "text": "어느 정도는 가능해요", "score": 3 },
                { "text": "일반 사료만 가능해요", "score": 1 }
            ]
        }
    ],
    "resultLabels": [
        {
            "name": "강아지",
            "emoji": "🐕",
            "desc": "충성스럽고 활발한 최고의 친구!",
            "condition": { "activity": "high", "space": "high", "time": "high", "touch": "high" },
            "mood": "excited",
            "color": "bg-amber-100",
            "interpretation": "활동적이고 교감을 중요시하는 당신에게 강아지는 최고의 파트너예요! 매일 산책하고 함께 놀아주면 세상에서 가장 행복해하는 친구가 될 거예요. 당신의 사랑에 무한한 충성심으로 보답할 거예요.",
            "guide": "매일 30분~1시간 산책이 필요해요. 훈련과 사회화가 중요해요. 품종에 따라 성격과 관리 난이도가 많이 달라요. 분리불안에 주의하세요.",
            "matchPoints": ["매일 산책 가능한 분", "적극적인 교감을 원하는 분", "규칙적인 생활을 하는 분", "넓은 공간이 있으면 더 좋아요"],
            "nextTest": "dogBreed",
            "meta": {
                "heatTolerance": 2,       // 대체로 더위에 약함 (품종별 차이 큼)
                "coldTolerance": 4,       // 대체로 추위에 강함
                "beginnerFriendly": 3,    // 품종에 따라 다름
                "careLevel": 4,           // 관리 많이 필요
                "monthlyCoast": "high",
                "spaceNeeded": "large",
                "noiseLevel": "high",
                "suitableFor": ["가족", "마당있는집", "활동적인사람", "재택근무"],
                "notSuitableFor": ["장시간외출", "원룸", "층간소음민감"],
                "seasonalTips": {
                    "spring": "털갈이 시즌! 빗질 자주 해주세요",
                    "summer": "열사병 주의, 산책은 아침/저녁에",
                    "fall": "털갈이 시즌, 야외활동 최적기",
                    "winter": "소형견은 옷 입히기, 발바닥 동상 주의"
                },
                "tags": ["활동적", "교감높음", "훈련필요", "분리불안주의"]
            }
        },
        {
            "name": "고양이",
            "emoji": "🐱",
            "desc": "독립적이면서도 은근한 애정을 주는 친구",
            "condition": { "activity": "low", "time": "medium", "touch": "medium", "noise": "low" },
            "mood": "cool",
            "color": "bg-slate-100",
            "interpretation": "바쁜 생활 속에서도 함께할 수 있는 고양이가 딱이에요! 산책이 필요 없고 혼자서도 잘 지내요. 당신이 집에 오면 은근슬쩍 다가와 곁에 앉는 고양이의 매력에 빠질 거예요.",
            "guide": "실내 생활만으로 충분해요. 화장실 청소는 매일 해주세요! 스크래처와 캣타워를 준비해주면 좋아요. 물은 항상 신선하게.",
            "matchPoints": ["바쁜 직장인에게 추천", "산책이 어려운 분", "적당한 독립성을 원하는 분", "조용한 환경을 원하는 분"],
            "nextTest": "catBreed",
            "meta": {
                "heatTolerance": 3,       // 보통
                "coldTolerance": 3,       // 보통 (장모종은 추위에 강함)
                "beginnerFriendly": 4,    // 비교적 쉬움
                "careLevel": 3,           // 중간
                "monthlyCoast": "medium",
                "spaceNeeded": "medium",
                "noiseLevel": "low",
                "suitableFor": ["1인가구", "직장인", "아파트", "조용한환경"],
                "notSuitableFor": ["알레르기", "잦은여행"],
                "seasonalTips": {
                    "spring": "털갈이 시작, 빗질과 청소 빈도 높이기",
                    "summer": "시원한 곳 확보, 물 자주 갈아주기",
                    "fall": "털갈이 시즌, 모구토 주의",
                    "winter": "따뜻한 쉼터 마련, 난방 건조함 주의"
                },
                "tags": ["독립적", "저소음", "실내생활", "직장인추천"]
            }
        },
        {
            "name": "소동물",
            "emoji": "🐹",
            "desc": "작고 귀여운 힐링 친구들",
            "condition": { "space": "low", "time": "low", "touch": "medium", "care": "low" },
            "mood": "happy",
            "color": "bg-pink-50",
            "interpretation": "작은 공간에서도 키울 수 있는 소동물이 잘 맞아요! 햄스터, 토끼, 기니피그 등 귀여운 친구들이 있어요. 케이지에서 지내며 관리도 비교적 간단해서 첫 반려동물로 추천해요.",
            "guide": "종류마다 수명과 관리법이 달라요. 햄스터는 야행성이라 밤에 활동해요. 온도 관리가 중요하고, 케이지 청소는 주기적으로 해주세요.",
            "matchPoints": ["첫 반려동물로 추천", "작은 공간에서 키우고 싶은 분", "귀여운 동물을 바라보고 싶은 분", "관리가 간단한 동물을 원하는 분"],
            "nextTest": "smallPet",
            "meta": {
                "heatTolerance": 2,       // 더위에 약함 (특히 햄스터)
                "coldTolerance": 2,       // 추위에도 약함
                "beginnerFriendly": 5,    // 초보자에게 추천
                "careLevel": 2,           // 관리 적음
                "monthlyCoast": "low",
                "spaceNeeded": "small",
                "noiseLevel": "low",
                "suitableFor": ["1인가구", "원룸", "초보자", "아이"],
                "notSuitableFor": ["장기여행", "극한온도환경"],
                "seasonalTips": {
                    "spring": "번식기, 암수 분리 확인",
                    "summer": "에어컨 필수! 25도 이상이면 위험",
                    "fall": "먹이 저장 본능, 신선도 확인",
                    "winter": "동면 주의, 실온 유지 필수"
                },
                "tags": ["저비용", "소공간", "초보추천", "온도관리중요"]
            }
        },
        {
            "name": "관상어",
            "emoji": "🐠",
            "desc": "바라만 봐도 힐링되는 수중 친구",
            "condition": { "activity": "low", "time": "low", "touch": "low", "noise": "low" },
            "mood": "cool",
            "color": "bg-blue-100",
            "interpretation": "직접 교감보다 바라보는 힐링을 원한다면 관상어가 딱이에요! 털 알레르기 걱정 없고, 인테리어 효과도 있어요. 수족관 꾸미는 재미도 쏠쏠해요.",
            "guide": "어종마다 수질, 온도, 합사 조건이 달라요. 초보자는 베타, 구피 같은 쉬운 어종부터 시작하세요. 물갈이와 여과기 관리가 중요해요.",
            "matchPoints": ["바라보는 힐링을 원하는 분", "털 알레르기가 있는 분", "인테리어 효과도 원하는 분", "스킨십이 필요 없는 분"],
            "nextTest": "fishType",
            "meta": {
                "heatTolerance": 3,       // 수온 조절로 관리 (어종별 차이)
                "coldTolerance": 3,       // 수온 조절로 관리
                "beginnerFriendly": 3,    // 수질 관리 필요
                "careLevel": 3,           // 중간 (물갈이, 여과기)
                "monthlyCoast": "medium",
                "spaceNeeded": "small",
                "noiseLevel": "silent",
                "suitableFor": ["알레르기", "조용한환경", "인테리어", "1인가구"],
                "notSuitableFor": ["스킨십원함", "잦은이사"],
                "seasonalTips": {
                    "spring": "수온 변화 주의, 서서히 조절",
                    "summer": "수온 상승 주의, 냉각팬 고려",
                    "fall": "수온 서서히 낮추기, 먹이량 조절",
                    "winter": "히터 필수, 수온 급변 방지"
                },
                "tags": ["무소음", "알레르기OK", "인테리어", "관찰형"]
            }
        },
        {
            "name": "새",
            "emoji": "🦜",
            "desc": "노래하고 대화하는 깃털 친구",
            "condition": { "time": "medium", "touch": "high", "noise": "high" },
            "mood": "excited",
            "color": "bg-green-100",
            "interpretation": "새는 정말 특별한 반려동물이에요! 앵무새는 말을 배우고, 카나리아는 아름다운 노래를 들려줘요. 지능이 높아 교감의 즐거움이 크지만 그만큼 관심이 필요해요.",
            "guide": "매일 케이지 밖에서 교감 시간을 가져야 해요. 소음이 있을 수 있어 이웃에 양해를 구하세요. 수명이 긴 종(앵무새)은 20~50년도 살아요!",
            "matchPoints": ["대화하는 반려동물을 원하는 분", "독특한 반려동물을 원하는 분", "아름다운 노래를 듣고 싶은 분", "소음에 괜찮은 환경"],
            "nextTest": "birdType",
            "meta": {
                "heatTolerance": 3,       // 보통
                "coldTolerance": 2,       // 추위에 약함
                "beginnerFriendly": 2,    // 관리 어려움
                "careLevel": 4,           // 관리 많이 필요
                "monthlyCoast": "medium",
                "spaceNeeded": "medium",
                "noiseLevel": "high",
                "suitableFor": ["단독주택", "재택근무", "교감원함"],
                "notSuitableFor": ["층간소음민감", "바쁜직장인", "아파트"],
                "seasonalTips": {
                    "spring": "번식기, 발정 행동 주의",
                    "summer": "환기 중요, 직사광선 피하기",
                    "fall": "털갈이 시즌, 영양 보충",
                    "winter": "보온 필수, 외풍 차단"
                },
                "tags": ["교감높음", "소음있음", "장수", "지능적"]
            }
        },
        {
            "name": "파충류",
            "emoji": "🦎",
            "desc": "독특하고 신비로운 냉혈 친구",
            "condition": { "activity": "medium", "time": "low", "touch": "low", "care": "high" },
            "mood": "cool",
            "color": "bg-emerald-100",
            "interpretation": "파충류는 조용하고 독특한 매력이 있어요! 레오파드 게코, 옥수수뱀, 거북이 등 다양한 종류가 있어요. 매일 먹이를 주지 않아도 되고, 소음이 없어 아파트에서도 키우기 좋아요.",
            "guide": "온도와 습도 관리가 중요해요. 종류에 따라 살아있는 먹이(귀뚜라미 등)가 필요할 수 있어요. 탈출 방지에 신경 쓰세요!",
            "matchPoints": ["독특한 반려동물을 원하는 분", "조용한 동물을 원하는 분", "털 알레르기가 있는 분", "관리에 투자할 의향이 있는 분"],
            "nextTest": "reptileType",
            "meta": {
                "heatTolerance": 5,       // 더위에 강함 (열대성)
                "coldTolerance": 1,       // 추위에 매우 약함 (냉혈동물)
                "beginnerFriendly": 2,    // 초보자 어려움
                "careLevel": 4,           // 환경 셋팅 중요
                "monthlyCoast": "medium",
                "spaceNeeded": "small",
                "noiseLevel": "silent",
                "suitableFor": ["알레르기", "독특함추구", "조용한환경"],
                "notSuitableFor": ["스킨십원함", "생먹이거부", "온도관리어려움"],
                "seasonalTips": {
                    "spring": "활동량 증가, 먹이량 조절",
                    "summer": "환기 필요, 과열 주의",
                    "fall": "먹이량 감소, 동면 준비 종 확인",
                    "winter": "보온등/히팅패드 필수, 온도 꼭 체크"
                },
                "tags": ["무소음", "알레르기OK", "독특함", "온도관리필수"]
            }
        }
    ]
};
