// coffee 테스트 데이터 (나에게 맞는 커피 매칭)
// 생성일: 2025-12-11

const COFFEE_DATA = {
    "title": "나의 커피 찾기",
    "subtitle": "어떤 커피가 나와 맞을까?",
    "themeColor": "bg-amber-700",
    "icon": "CoffeeIcon",
    "testType": "matching",
    "dimensions": {
        "bitter": {
            "name": "쓴맛",
            "emoji": "😖",
            "desc": "쓴맛을 얼마나 좋아하나요"
        },
        "sweet": {
            "name": "단맛",
            "emoji": "🍬",
            "desc": "달달한 것을 얼마나 좋아하나요"
        },
        "caffeine": {
            "name": "카페인",
            "emoji": "⚡",
            "desc": "카페인이 필요한 정도"
        },
        "temperature": {
            "name": "온도",
            "emoji": "🌡️",
            "desc": "뜨거운 vs 차가운"
        },
        "mood": {
            "name": "분위기",
            "emoji": "✨",
            "desc": "커피를 마시는 상황과 기분"
        }
    },
    "questions": [
        {
            "q": "커피의 쓴맛에 대해 어떻게 생각하세요?",
            "dimension": "bitter",
            "a": [
                { "text": "쓴맛이 진해야 커피지!", "score": 5 },
                { "text": "쓴맛은 싫어요...", "score": 1 }
            ]
        },
        {
            "q": "에스프레소를 마셔본 적 있나요?",
            "dimension": "bitter",
            "a": [
                { "text": "좋아해요, 샷으로 마셔요", "score": 5 },
                { "text": "너무 써서 못 마셔요", "score": 1 }
            ]
        },
        {
            "q": "아메리카노를 마실 때 물 비율은?",
            "dimension": "bitter",
            "a": [
                { "text": "진하게! 샷 추가도 해요", "score": 5 },
                { "text": "연하게 마셔요", "score": 1 }
            ]
        },
        {
            "q": "커피에 설탕이나 시럽을 넣나요?",
            "dimension": "sweet",
            "a": [
                { "text": "꼭 넣어요, 달아야 맛있어요", "score": 5 },
                { "text": "안 넣어요, 원두 맛 그대로가 좋아요", "score": 1 }
            ]
        },
        {
            "q": "휘핑크림 올라간 음료를 좋아하나요?",
            "dimension": "sweet",
            "a": [
                { "text": "네! 달달한 게 최고예요", "score": 5 },
                { "text": "별로 안 좋아해요", "score": 1 }
            ]
        },
        {
            "q": "디저트와 커피를 함께 먹을 때?",
            "dimension": "sweet",
            "a": [
                { "text": "달달한 조합이 좋아요", "score": 5 },
                { "text": "커피는 씁쓸해야 균형이 맞죠", "score": 1 }
            ]
        },
        {
            "q": "커피를 마시는 주된 이유는?",
            "dimension": "caffeine",
            "a": [
                { "text": "잠 깨려고! 카페인이 필요해요", "score": 5 },
                { "text": "그냥 맛있어서 마셔요", "score": 1 }
            ]
        },
        {
            "q": "하루에 커피를 몇 잔 마시나요?",
            "dimension": "caffeine",
            "a": [
                { "text": "3잔 이상이요", "score": 5 },
                { "text": "1잔 이하예요", "score": 1 }
            ]
        },
        {
            "q": "저녁에 커피를 마시면?",
            "dimension": "caffeine",
            "a": [
                { "text": "괜찮아요, 잘 자요", "score": 5 },
                { "text": "잠을 못 자요", "score": 1 }
            ]
        },
        {
            "q": "커피는 뜨거운 것 vs 차가운 것?",
            "dimension": "temperature",
            "a": [
                { "text": "뜨거운 커피가 좋아요", "score": 5 },
                { "text": "아이스가 좋아요", "score": 1 }
            ]
        },
        {
            "q": "겨울에도 아이스 커피를 마시나요?",
            "dimension": "temperature",
            "a": [
                { "text": "아니요, 따뜻한 걸 마셔요", "score": 5 },
                { "text": "네, 얼죽아예요!", "score": 1 }
            ]
        },
        {
            "q": "커피를 주로 어떤 상황에서 마시나요?",
            "dimension": "mood",
            "a": [
                { "text": "집중이 필요할 때, 일할 때", "score": 5 },
                { "text": "여유롭게 쉴 때, 친구랑 수다 떨 때", "score": 1 }
            ]
        },
        {
            "q": "커피숍에서 분위기는?",
            "dimension": "mood",
            "a": [
                { "text": "조용히 혼자 즐기고 싶어요", "score": 5 },
                { "text": "사람들과 함께 시끌벅적하게", "score": 1 }
            ]
        }
    ],
    "questions_deep": [
        {
            "q": "원두의 로스팅 정도를 안다면?",
            "dimension": "bitter",
            "a": [
                { "text": "다크로스트가 좋아요", "score": 5 },
                { "text": "라이트로스트나 미디엄이 좋아요", "score": 1 }
            ]
        },
        {
            "q": "커피 원두 산지에 관심 있나요?",
            "dimension": "bitter",
            "a": [
                { "text": "네, 싱글오리진도 마셔봐요", "score": 5 },
                { "text": "잘 모르겠어요", "score": 1 }
            ]
        },
        {
            "q": "바닐라 라떼, 카라멜 마끼아또 같은 음료는?",
            "dimension": "sweet",
            "a": [
                { "text": "자주 마셔요, 좋아해요", "score": 5 },
                { "text": "잘 안 마셔요", "score": 1 }
            ]
        },
        {
            "q": "모카(초코+커피) 조합은?",
            "dimension": "sweet",
            "a": [
                { "text": "최고의 조합이에요!", "score": 5 },
                { "text": "커피는 커피답게...", "score": 1 }
            ]
        },
        {
            "q": "디카페인 커피를 마셔본 적 있나요?",
            "dimension": "caffeine",
            "a": [
                { "text": "마셔봤는데 카페인 없으니 허전해요", "score": 5 },
                { "text": "디카페인도 괜찮아요", "score": 1 }
            ]
        },
        {
            "q": "커피 대신 차를 마시기도 하나요?",
            "dimension": "caffeine",
            "a": [
                { "text": "아니요, 커피가 좋아요", "score": 5 },
                { "text": "네, 차도 좋아해요", "score": 1 }
            ]
        },
        {
            "q": "콜드브루에 대해 어떻게 생각하세요?",
            "dimension": "temperature",
            "a": [
                { "text": "부드럽고 좋아요", "score": 1 },
                { "text": "역시 핫 커피가 최고예요", "score": 5 }
            ]
        },
        {
            "q": "아포가토(아이스크림+에스프레소)는?",
            "dimension": "temperature",
            "a": [
                { "text": "디저트로 가끔 좋아요", "score": 1 },
                { "text": "커피는 커피로만 마셔요", "score": 5 }
            ]
        },
        {
            "q": "커피를 테이크아웃 vs 매장에서?",
            "dimension": "mood",
            "a": [
                { "text": "바쁘게 테이크아웃이요", "score": 5 },
                { "text": "매장에서 여유롭게요", "score": 1 }
            ]
        },
        {
            "q": "커피 취향을 공유하는 편인가요?",
            "dimension": "mood",
            "a": [
                { "text": "내 취향은 나만 알면 돼요", "score": 5 },
                { "text": "좋은 카페 발견하면 공유해요", "score": 1 }
            ]
        },
        {
            "q": "블랙커피(아메리카노, 에스프레소)를 즐기나요?",
            "dimension": "bitter",
            "a": [
                { "text": "블랙커피가 기본이죠", "score": 5 },
                { "text": "뭔가 넣어야 마실 수 있어요", "score": 1 }
            ]
        },
        {
            "q": "커피 쓴맛이 혀에 남는 느낌은?",
            "dimension": "bitter",
            "a": [
                { "text": "그게 커피의 매력이에요", "score": 5 },
                { "text": "빨리 씻어내고 싶어요", "score": 1 }
            ]
        },
        {
            "q": "프라푸치노나 쉐이크 음료는?",
            "dimension": "sweet",
            "a": [
                { "text": "가끔 마셔요, 맛있어요", "score": 5 },
                { "text": "그건 커피가 아니죠", "score": 1 }
            ]
        },
        {
            "q": "커피에 우유를 넣을 때?",
            "dimension": "sweet",
            "a": [
                { "text": "달달한 연유나 바닐라밀크로!", "score": 5 },
                { "text": "일반 우유나 두유 정도요", "score": 1 }
            ]
        },
        {
            "q": "오후 3시 이후에도 커피를 마시나요?",
            "dimension": "caffeine",
            "a": [
                { "text": "상관없이 마셔요", "score": 5 },
                { "text": "저녁엔 카페인 피해요", "score": 1 }
            ]
        },
        {
            "q": "커피 없이 하루를 시작할 수 있나요?",
            "dimension": "caffeine",
            "a": [
                { "text": "절대 불가능해요", "score": 5 },
                { "text": "없어도 괜찮아요", "score": 1 }
            ]
        },
        {
            "q": "미지근해진 커피를 마실 수 있나요?",
            "dimension": "temperature",
            "a": [
                { "text": "상관없어요, 그냥 마셔요", "score": 1 },
                { "text": "싫어요, 뜨겁거나 차갑거나", "score": 5 }
            ]
        },
        {
            "q": "여름에 뜨거운 커피를 마시나요?",
            "dimension": "temperature",
            "a": [
                { "text": "네, 뜨거운 게 좋아요", "score": 5 },
                { "text": "여름엔 무조건 아이스요", "score": 1 }
            ]
        },
        {
            "q": "혼자 카페에 가는 것은?",
            "dimension": "mood",
            "a": [
                { "text": "편해요, 자주 가요", "score": 5 },
                { "text": "누군가와 함께 가는 게 좋아요", "score": 1 }
            ]
        },
        {
            "q": "커피를 마시면서 주로 뭘 하나요?",
            "dimension": "mood",
            "a": [
                { "text": "일이나 공부를 해요", "score": 5 },
                { "text": "그냥 쉬거나 대화해요", "score": 1 }
            ]
        }
    ],
    "resultLabels": [
        {
            "name": "진한 에스프레소",
            "emoji": "☕",
            "desc": "깊고 진한 맛을 즐기는 커피 마니아",
            "condition": { "bitter": "high", "sweet": "low", "caffeine": "high" },
            "mood": "cool",
            "color": "bg-amber-900",
            "interpretation": "당신은 커피 본연의 맛을 아는 진정한 커피 애호가예요! 에스프레소의 진하고 깊은 맛, 그 쓴맛 속에 숨은 풍미를 즐기는 타입이에요. 카페인도 필요하고, 달달한 건 커피의 맛을 해친다고 생각하시는군요.",
            "guide": "싱글오리진 원두나 다크로스트를 추천해요. 에스프레소 머신이나 모카포트로 집에서 내려 마셔보세요. 리스트레토(농축 에스프레소)도 도전해보세요!",
            "matchPoints": ["진한 커피를 좋아하는 분", "카페인이 필요한 분", "단맛 없이 마시는 분", "커피 원두에 관심 있는 분"]
        },
        {
            "name": "클래식 아메리카노",
            "emoji": "🥤",
            "desc": "균형 잡힌 깔끔한 맛의 정석",
            "condition": { "bitter": "medium", "sweet": "low", "caffeine": "high" },
            "mood": "happy",
            "color": "bg-amber-700",
            "interpretation": "깔끔하고 균형 잡힌 아메리카노가 딱이에요! 너무 진하지도, 너무 연하지도 않은 적당한 쓴맛과 카페인. 매일 마셔도 질리지 않는 든든한 일상의 커피죠.",
            "guide": "물과 에스프레소 비율을 조절해서 자신만의 농도를 찾아보세요. 샷 추가로 진하게, 물 추가로 연하게 조절 가능해요.",
            "matchPoints": ["매일 커피를 마시는 분", "깔끔한 맛을 좋아하는 분", "단맛 없이 마시는 분", "카페인이 필요한 분"]
        },
        {
            "name": "부드러운 카페라떼",
            "emoji": "🥛",
            "desc": "우유와 커피의 부드러운 조화",
            "condition": { "bitter": "low", "sweet": "medium", "temperature": "high", "caffeine": "medium" },
            "mood": "happy",
            "color": "bg-amber-200",
            "interpretation": "쓴맛은 좀 부담스럽지만 커피 맛은 즐기고 싶은 당신에게 카페라떼가 딱이에요! 우유가 에스프레소의 쓴맛을 부드럽게 감싸주고, 고소한 풍미를 더해줘요.",
            "guide": "우유 종류를 바꿔보세요. 오트밀크는 고소하고, 아몬드밀크는 담백해요. 바리스타에게 우유 비율 조절을 요청해보세요.",
            "matchPoints": ["쓴맛이 부담스러운 분", "부드러운 질감을 좋아하는 분", "따뜻한 음료를 선호하는 분", "우유를 좋아하는 분"]
        },
        {
            "name": "달콤한 바닐라 라떼",
            "emoji": "🍦",
            "desc": "디저트 같은 달달한 커피",
            "condition": { "bitter": "low", "sweet": "high", "caffeine": "low" },
            "mood": "excited",
            "color": "bg-yellow-100",
            "interpretation": "커피는 달아야 맛있다! 바닐라 시럽의 달콤함과 우유의 부드러움, 그 위에 휘핑크림까지. 마시는 디저트 같은 커피가 당신의 스타일이에요.",
            "guide": "바닐라 외에도 카라멜, 헤이즐넛, 토피넛 시럽도 시도해보세요. 휘핑크림 추가는 필수! 시즌 한정 메뉴도 놓치지 마세요.",
            "matchPoints": ["단맛을 좋아하는 분", "디저트 같은 음료를 원하는 분", "다양한 시럽을 즐기는 분", "휘핑크림을 좋아하는 분"]
        },
        {
            "name": "아이스 콜드브루",
            "emoji": "🧊",
            "desc": "깔끔하고 시원한 커피",
            "condition": { "temperature": "low", "bitter": "medium", "caffeine": "high" },
            "mood": "cool",
            "color": "bg-slate-200",
            "interpretation": "얼죽아(얼어 죽어도 아이스)! 차가운 커피의 청량감을 사랑하는 당신에게 콜드브루가 딱이에요. 장시간 우려내서 쓴맛은 적고 부드럽지만, 카페인은 충분해요.",
            "guide": "콜드브루에 우유를 살짝 넣으면 더 부드러워져요. 집에서 만들 땐 12시간 이상 냉장 추출해보세요.",
            "matchPoints": ["시원한 음료를 좋아하는 분", "부드러운 쓴맛을 원하는 분", "카페인이 필요한 분", "사계절 아이스인 분"]
        },
        {
            "name": "진한 카페모카",
            "emoji": "🍫",
            "desc": "커피와 초콜릿의 환상적인 만남",
            "condition": { "sweet": "high", "bitter": "medium", "caffeine": "medium" },
            "mood": "excited",
            "color": "bg-amber-800",
            "interpretation": "커피도 좋고 초콜릿도 좋은 당신! 카페모카는 에스프레소와 초콜릿의 달콤 쌉싸름한 조화가 일품이에요. 달달하지만 커피 맛도 제대로 느낄 수 있어요.",
            "guide": "화이트초코 모카, 다크초코 모카 등 초콜릿 종류에 따라 맛이 달라져요. 겨울엔 핫으로, 여름엔 아이스로!",
            "matchPoints": ["초콜릿을 좋아하는 분", "달콤하지만 커피 맛도 원하는 분", "디저트 대용으로 마시는 분", "진한 맛을 좋아하는 분"]
        },
        {
            "name": "여유로운 플랫화이트",
            "emoji": "☁️",
            "desc": "에스프레소 풍미가 살아있는 벨벳 같은 커피",
            "condition": { "bitter": "high", "sweet": "low", "mood": "low", "caffeine": "high" },
            "mood": "happy",
            "color": "bg-amber-100",
            "interpretation": "라떼보다 진하고 에스프레소보다 부드러운 플랫화이트가 딱이에요! 얇고 고운 우유 거품이 에스프레소와 완벽하게 어우러져요. 커피 맛을 알면서도 부드러움을 원하는 당신을 위한 선택.",
            "guide": "호주/뉴질랜드 스타일 카페에서 정통 플랫화이트를 경험해보세요. 라떼와 비교 시음해보는 것도 재미있어요.",
            "matchPoints": ["커피 맛을 중시하는 분", "라떼보다 진한 맛을 원하는 분", "부드러운 질감을 좋아하는 분", "커피숍에서 여유를 즐기는 분"]
        },
        {
            "name": "카페인 프리 허브티",
            "emoji": "🍵",
            "desc": "커피 대신 따뜻한 한 잔의 여유",
            "condition": { "caffeine": "low", "bitter": "low", "mood": "low" },
            "mood": "happy",
            "color": "bg-green-100",
            "interpretation": "사실 커피의 쓴맛이나 카페인보다는 따뜻한 음료와 함께하는 여유로운 시간이 좋은 거 아닌가요? 카모마일, 페퍼민트, 루이보스 같은 허브티가 당신에게 더 맞을 수 있어요.",
            "guide": "다양한 허브티를 시도해보세요. 카모마일은 편안함을, 페퍼민트는 상쾌함을 줘요. 꿀을 살짝 넣으면 더 맛있어요.",
            "matchPoints": ["카페인에 민감한 분", "쓴맛을 싫어하는 분", "여유로운 시간을 좋아하는 분", "건강을 생각하는 분"]
        },
        {
            "name": "트렌디한 아인슈페너",
            "emoji": "🎂",
            "desc": "비엔나 커피의 달콤 쌉싸름한 매력",
            "condition": { "bitter": "high", "sweet": "high", "temperature": "low", "caffeine": "high" },
            "mood": "excited",
            "color": "bg-amber-300",
            "interpretation": "진한 에스프레소 위에 달콤한 휘핑크림! 아인슈페너는 쓴맛과 단맛의 완벽한 대비를 즐기는 당신을 위한 커피예요. 차갑게 마시면 더 매력적이죠.",
            "guide": "휘핑크림을 섞지 말고, 크림을 통해 커피를 마셔보세요. 쓴맛과 단맛이 레이어처럼 느껴져요.",
            "matchPoints": ["쓴맛과 단맛 모두 좋아하는 분", "트렌디한 메뉴를 즐기는 분", "비주얼도 중요한 분", "아이스 커피를 좋아하는 분"]
        },
        {
            "name": "집중력 더블샷",
            "emoji": "💪",
            "desc": "일할 때 필요한 강력한 카페인 부스터",
            "condition": { "caffeine": "high", "mood": "high" },
            "mood": "cool",
            "color": "bg-gray-800",
            "interpretation": "집중이 필요한 순간, 카페인이 절실할 때! 더블샷 아메리카노나 에스프레소 추가 음료가 당신의 업무 효율을 높여줄 거예요. 일할 때 마시는 커피는 역시 진해야죠.",
            "guide": "오전이나 점심 직후에 마시면 효과적이에요. 오후 늦게는 수면에 영향을 줄 수 있어요. 물도 충분히 마셔주세요.",
            "matchPoints": ["업무 중 집중이 필요한 분", "카페인이 잘 듣는 분", "바쁜 일정을 소화하는 분", "테이크아웃으로 빠르게 마시는 분"]
        },
        {
            "name": "디카페인 아메리카노",
            "emoji": "🌙",
            "desc": "카페인 없이도 커피 맛을 즐기고 싶을 때",
            "condition": { "caffeine": "low", "bitter": "medium", "sweet": "low" },
            "mood": "happy",
            "color": "bg-amber-600",
            "interpretation": "커피 맛은 좋아하지만 카페인은 피하고 싶은 당신! 디카페인 아메리카노는 저녁에도 부담 없이 마실 수 있고, 커피 특유의 풍미는 그대로 즐길 수 있어요.",
            "guide": "디카페인도 소량의 카페인이 있어요 (97% 제거). 스페셜티 카페의 디카페인은 맛이 더 좋아요. 임산부나 카페인 민감자에게 추천!",
            "matchPoints": ["저녁에도 커피를 마시고 싶은 분", "카페인에 민감한 분", "커피 맛은 포기 못하는 분", "건강을 생각하는 분"]
        },
        {
            "name": "달달한 핫초코",
            "emoji": "🍫",
            "desc": "따뜻하고 달콤한 위로 한 잔",
            "condition": { "sweet": "high", "temperature": "high", "bitter": "low" },
            "mood": "excited",
            "color": "bg-amber-900",
            "interpretation": "추운 날 따뜻하게 녹여주는 달달한 핫초코! 커피의 쓴맛보다는 초콜릿의 달콤함이 좋은 당신에게 딱이에요. 휘핑크림과 마시멜로를 올리면 더 행복해져요.",
            "guide": "다크 핫초코, 화이트 핫초코 등 다양한 종류를 시도해보세요. 시나몬 파우더를 뿌리면 풍미가 더해져요.",
            "matchPoints": ["단맛을 좋아하는 분", "따뜻한 음료가 좋은 분", "쓴맛을 싫어하는 분", "기분 전환이 필요한 분"]
        }
    ]
};

window.CHEMI_SUBJECTS = window.CHEMI_SUBJECTS || {};
window.CHEMI_SUBJECTS.coffee = COFFEE_DATA;
