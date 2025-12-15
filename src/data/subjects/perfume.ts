// perfume 테스트 데이터 - 나에게 맞는 향수 찾기

import { SubjectData } from '../types';

export const perfumeData: SubjectData = {
    "title": "나의 향수 찾기",
    "subtitle": "어떤 향이 나와 어울릴까?",
    "themeColor": "bg-purple-400",
    "icon": "PerfumeIcon",
    "testType": "matching",
    "dimensions": {
        "intensity": {
            "name": "향의 강도",
            "emoji": "💨",
            "desc": "얼마나 진한 향을 좋아하나요"
        },
        "mood": {
            "name": "분위기",
            "emoji": "✨",
            "desc": "어떤 이미지를 연출하고 싶나요"
        },
        "season": {
            "name": "계절감",
            "emoji": "🌸",
            "desc": "따뜻한 향 vs 시원한 향"
        },
        "sweetness": {
            "name": "달콤함",
            "emoji": "🍬",
            "desc": "달달한 향을 좋아하나요"
        },
        "nature": {
            "name": "자연친화",
            "emoji": "🌿",
            "desc": "자연적인 향 vs 세련된 향"
        }
    },
    "questions": [
        {
            "q": "향수를 뿌릴 때 선호하는 강도는?",
            "dimension": "intensity",
            "a": [
                { "text": "은은하게 스치듯이", "score": 1 },
                { "text": "확실하게 존재감 있게", "score": 5 }
            ]
        },
        {
            "q": "옆 사람이 \"무슨 향수 써요?\"라고 물어보면?",
            "dimension": "intensity",
            "a": [
                { "text": "좋아요! 관심받는 게 좋아", "score": 5 },
                { "text": "조금 부담스러워요", "score": 1 }
            ]
        },
        {
            "q": "하루 동안 향이 얼마나 지속되면 좋을까요?",
            "dimension": "intensity",
            "a": [
                { "text": "하루 종일 오래 남았으면", "score": 5 },
                { "text": "몇 시간 정도면 충분해요", "score": 1 }
            ]
        },
        {
            "q": "어떤 이미지로 보이고 싶나요?",
            "dimension": "mood",
            "a": [
                { "text": "세련되고 도시적인", "score": 5 },
                { "text": "자연스럽고 편안한", "score": 1 }
            ]
        },
        {
            "q": "파티나 특별한 날 vs 일상에서 주로 사용?",
            "dimension": "mood",
            "a": [
                { "text": "특별한 날 포인트로", "score": 5 },
                { "text": "상황에 따라 다르게", "score": 3 },
                { "text": "매일 편하게 쓰고 싶어", "score": 1 }
            ]
        },
        {
            "q": "향수로 표현하고 싶은 나는?",
            "dimension": "mood",
            "a": [
                { "text": "카리스마 있고 강렬한", "score": 5 },
                { "text": "부드럽고 친근한", "score": 1 }
            ]
        },
        {
            "q": "여름에도 따뜻한 느낌의 향을 좋아하나요?",
            "dimension": "season",
            "a": [
                { "text": "네, 포근한 향이 좋아요", "score": 5 },
                { "text": "여름엔 시원한 향이죠", "score": 1 }
            ]
        },
        {
            "q": "겨울에 어떤 향을 뿌리고 싶나요?",
            "dimension": "season",
            "a": [
                { "text": "따뜻하고 포근한 향", "score": 5 },
                { "text": "깔끔하고 상쾌한 향", "score": 1 }
            ]
        },
        {
            "q": "계절마다 향수를 바꾸는 편인가요?",
            "dimension": "season",
            "a": [
                { "text": "계절별로 다른 향을 써요", "score": 1 },
                { "text": "가끔 바꾸기도 해요", "score": 3 },
                { "text": "일년 내내 비슷한 향을 써요", "score": 5 }
            ]
        },
        {
            "q": "바닐라나 캐러멜 같은 달콤한 향은?",
            "dimension": "sweetness",
            "a": [
                { "text": "좋아해요! 달달한 게 최고", "score": 5 },
                { "text": "적당히 들어가면 괜찮아요", "score": 3 },
                { "text": "너무 달면 부담스러워요", "score": 1 }
            ]
        },
        {
            "q": "과일향이 들어간 향수는 어떤가요?",
            "dimension": "sweetness",
            "a": [
                { "text": "상큼하고 좋아요", "score": 5 },
                { "text": "향수는 과일향 말고...", "score": 1 }
            ]
        },
        {
            "q": "디저트 가게 같은 달콤한 공기를 좋아하나요?",
            "dimension": "sweetness",
            "a": [
                { "text": "네, 기분 좋아져요", "score": 5 },
                { "text": "조금 답답할 것 같아요", "score": 1 }
            ]
        },
        {
            "q": "풀내음이나 나무향을 맡으면?",
            "dimension": "nature",
            "a": [
                { "text": "편안하고 좋아요", "score": 5 },
                { "text": "그냥 그래요", "score": 1 }
            ]
        },
        {
            "q": "꽃향기를 좋아하나요?",
            "dimension": "nature",
            "a": [
                { "text": "네, 화사하고 좋아요", "score": 5 },
                { "text": "좋긴 한데 무난해요", "score": 3 },
                { "text": "조금 촌스럽다고 느껴요", "score": 1 }
            ]
        }
    ],
    "questions_deep": [
        {
            "q": "향수 베이스로 뭐가 좋을까요?",
            "dimension": "intensity",
            "a": [
                { "text": "머스크, 앰버 (진하고 오래가는)", "score": 5 },
                { "text": "시트러스, 그린 (가볍고 상쾌한)", "score": 1 }
            ]
        },
        {
            "q": "향수 농도를 고른다면?",
            "dimension": "intensity",
            "a": [
                { "text": "퍼퓸, EDP (진한 것)", "score": 5 },
                { "text": "EDT, 코롱 (가벼운 것)", "score": 1 }
            ]
        },
        {
            "q": "밤에 외출할 때 향수는?",
            "dimension": "mood",
            "a": [
                { "text": "섹시하고 미스터리한 향", "score": 5 },
                { "text": "낮이랑 비슷하게", "score": 1 }
            ]
        },
        {
            "q": "직장/학교에서 쓰는 향수는?",
            "dimension": "mood",
            "a": [
                { "text": "프로페셔널하고 깔끔한", "score": 5 },
                { "text": "친근하고 편안한", "score": 1 }
            ]
        },
        {
            "q": "스파이시한 향(후추, 생강 등)은?",
            "dimension": "season",
            "a": [
                { "text": "따뜻하고 매력적이에요", "score": 5 },
                { "text": "별로 안 끌려요", "score": 1 }
            ]
        },
        {
            "q": "민트나 유칼립투스 같은 쿨링감 있는 향은?",
            "dimension": "season",
            "a": [
                { "text": "시원하고 좋아요", "score": 1 },
                { "text": "너무 차갑게 느껴져요", "score": 5 }
            ]
        },
        {
            "q": "구르망(미식) 향 - 초콜릿, 커피, 꿀 등은?",
            "dimension": "sweetness",
            "a": [
                { "text": "먹고 싶을 정도로 좋아요", "score": 5 },
                { "text": "향수는 음식 냄새 말고...", "score": 1 }
            ]
        },
        {
            "q": "시트러스 향(레몬, 오렌지)을 좋아하나요?",
            "dimension": "sweetness",
            "a": [
                { "text": "상큼해서 좋아요", "score": 4 },
                { "text": "너무 가볍게 느껴져요", "score": 2 }
            ]
        },
        {
            "q": "장미, 자스민 같은 클래식 플로럴은?",
            "dimension": "nature",
            "a": [
                { "text": "고급스럽고 우아해요", "score": 5 },
                { "text": "할머니 화장대 느낌...", "score": 1 }
            ]
        },
        {
            "q": "바다향, 물향 계열은?",
            "dimension": "nature",
            "a": [
                { "text": "청량하고 좋아요", "score": 3 },
                { "text": "인위적으로 느껴져요", "score": 3 }
            ]
        },
        {
            "q": "삼나무, 샌달우드 같은 우디향은?",
            "dimension": "nature",
            "a": [
                { "text": "차분하고 고급스러워요", "score": 5 },
                { "text": "무거워서 부담돼요", "score": 1 }
            ]
        },
        {
            "q": "이끼나 흙냄새(얼씨)는?",
            "dimension": "nature",
            "a": [
                { "text": "자연 그대로의 느낌이 좋아요", "score": 5 },
                { "text": "너무 진한 것 같아요", "score": 1 }
            ]
        },
        {
            "q": "라벤더 향은 어떤가요?",
            "dimension": "nature",
            "a": [
                { "text": "편안하고 힐링돼요", "score": 5 },
                { "text": "비누냄새 같아요", "score": 1 }
            ]
        },
        {
            "q": "오리엔탈 향(동양적, 신비로운)은?",
            "dimension": "mood",
            "a": [
                { "text": "이국적이고 매혹적이에요", "score": 5 },
                { "text": "낯설고 어려워요", "score": 1 }
            ]
        },
        {
            "q": "향수 가격대는 어느 정도를 생각하나요?",
            "dimension": "intensity",
            "a": [
                { "text": "투자 가치가 있으면 비싸도 OK", "score": 5 },
                { "text": "적당한 가격대가 좋아요", "score": 1 }
            ]
        },
        {
            "q": "니치 향수(소량 생산 고급 브랜드)에 관심 있나요?",
            "dimension": "mood",
            "a": [
                { "text": "특별한 향을 원해요", "score": 5 },
                { "text": "유명한 브랜드가 편해요", "score": 1 }
            ]
        },
        {
            "q": "가죽향이 들어간 향수는?",
            "dimension": "mood",
            "a": [
                { "text": "고급스럽고 섹시해요", "score": 5 },
                { "text": "너무 무거워요", "score": 1 }
            ]
        },
        {
            "q": "파우더리한(분냄새) 향은?",
            "dimension": "sweetness",
            "a": [
                { "text": "포근하고 부드러워요", "score": 5 },
                { "text": "아기 냄새 같아요", "score": 1 }
            ]
        },
        {
            "q": "깨끗한 비누향 계열은?",
            "dimension": "nature",
            "a": [
                { "text": "청결하고 좋아요", "score": 3 },
                { "text": "향수가 아닌 것 같아요", "score": 3 }
            ]
        },
        {
            "q": "연기나 훈연(스모키) 향은?",
            "dimension": "season",
            "a": [
                { "text": "신비롭고 깊이 있어요", "score": 5 },
                { "text": "답답할 것 같아요", "score": 1 }
            ]
        }
    ],
    "resultLabels": [
        {
            "name": "프레시 시트러스",
            "emoji": "🍋",
            "desc": "상쾌하고 활기찬 첫인상",
            "condition": { "intensity": "low", "sweetness": "low", "season": "low" },
            "mood": "happy",
            "color": "bg-yellow-300",
            "interpretation": "레몬, 자몽, 베르가못 등 시트러스 계열이 당신에게 딱이에요! 가볍고 상쾌해서 첫인상을 밝고 활기차게 만들어줘요. 무겁지 않아 데일리로 사용하기 좋고, 특히 더운 날씨에 청량감을 줘요.",
            "guide": "조 말론 라임 바질 & 만다린, 아쿠아 디 파르마 콜로니아, 돌체앤가바나 라이트 블루 같은 시트러스 중심 향수를 추천해요.",
            "matchPoints": ["가볍고 상쾌한 향을 원하는 분", "여름철 데일리 향수를 찾는 분", "첫인상을 밝게 하고 싶은 분", "은은한 향을 좋아하는 분"]
        },
        {
            "name": "플로럴 로맨틱",
            "emoji": "🌸",
            "desc": "여성스럽고 사랑스러운 매력",
            "condition": { "nature": "high", "sweetness": "medium", "mood": "low" },
            "mood": "happy",
            "color": "bg-pink-200",
            "interpretation": "장미, 자스민, 피오니 같은 꽃향기가 당신과 잘 어울려요! 로맨틱하고 여성스러운 이미지를 연출하면서도 자연스러워요. 데이트나 소개팅에 딱이에요.",
            "guide": "미스 디올 블루밍 부케, 클로에 오드퍼퓸, 마크 제이콥스 데이지를 추천해요. 꽃향기의 농도와 조합에 따라 분위기가 달라지니 여러 개 시향해보세요.",
            "matchPoints": ["여성스러운 이미지를 원하는 분", "자연스러운 향을 좋아하는 분", "로맨틱한 분위기를 연출하고 싶은 분", "봄/가을에 어울리는 향을 찾는 분"]
        },
        {
            "name": "우디 시크",
            "emoji": "🌲",
            "desc": "차분하고 지적인 매력",
            "condition": { "nature": "high", "mood": "high", "intensity": "medium" },
            "mood": "cool",
            "color": "bg-amber-700",
            "interpretation": "삼나무, 샌달우드, 베티버 같은 우디 계열이 당신을 더 깊이 있게 보여줄 거예요. 성숙하고 차분한 이미지로 신뢰감을 주죠. 비즈니스 미팅이나 격식 있는 자리에 잘 어울려요.",
            "guide": "르 라보 상탈 33, 바이레도 집시 워터, 디올 소바쥬를 추천해요. 우디 향은 피부에 따라 다르게 발향되니 직접 뿌려보고 결정하세요.",
            "matchPoints": ["성숙하고 지적인 이미지를 원하는 분", "비즈니스/포멀 자리에 쓸 향수를 찾는 분", "오래 지속되는 향을 좋아하는 분", "유니섹스 향을 선호하는 분"]
        },
        {
            "name": "스위트 구르망",
            "emoji": "🍪",
            "desc": "달콤하고 포근한 매력",
            "condition": { "sweetness": "high", "season": "high", "intensity": "medium" },
            "mood": "excited",
            "color": "bg-orange-200",
            "interpretation": "바닐라, 캐러멜, 초콜릿 같은 구르망(미식) 계열이 당신 스타일이에요! 달콤하고 포근한 향이 사람들을 편안하게 해줘요. 특히 추운 계절에 따뜻한 느낌을 더해줘요.",
            "guide": "프라다 캔디, 랑콤 라 비 에 벨, 아틀리에 코롱 바닐라 인센스를 추천해요. 달콤하지만 품격 있는 향을 찾아보세요.",
            "matchPoints": ["달콤한 향을 좋아하는 분", "겨울철 포근한 향을 찾는 분", "친근하고 따뜻한 이미지를 원하는 분", "디저트향에 끌리는 분"]
        },
        {
            "name": "머스크 센슈얼",
            "emoji": "🌙",
            "desc": "은은하고 관능적인 매력",
            "condition": { "intensity": "high", "mood": "high", "sweetness": "low" },
            "mood": "cool",
            "color": "bg-slate-600",
            "interpretation": "머스크, 앰버, 우드 계열의 깊은 향이 당신의 미스터리한 매력을 더해줄 거예요. 섹시하고 관능적이지만 과하지 않은 세련된 향이죠. 저녁 파티나 데이트에 완벽해요.",
            "guide": "나르시소 로드리게즈 포 허, 톰 포드 블랙 오키드, 바이레도 블랑쉬를 추천해요. 몸에 밀착되는 향이라 피부 컨디션에 따라 달라질 수 있어요.",
            "matchPoints": ["섹시하고 신비로운 이미지를 원하는 분", "저녁 외출용 향수를 찾는 분", "오래 지속되는 향을 좋아하는 분", "피부에 밀착되는 향을 원하는 분"]
        },
        {
            "name": "아쿠아 프레시",
            "emoji": "🌊",
            "desc": "청량하고 자유로운 매력",
            "condition": { "nature": "medium", "season": "low", "intensity": "low" },
            "mood": "happy",
            "color": "bg-cyan-300",
            "interpretation": "바다향, 오존, 미네랄 계열의 아쿠아틱 향이 당신에게 잘 어울려요! 깨끗하고 청량한 이미지로 활동적이고 건강한 느낌을 줘요. 스포츠나 야외 활동 후에도 상쾌해요.",
            "guide": "아쿠아 디 지오, 이세이 미야케 로 디세이, 불가리 아쿠아를 추천해요. 가볍게 여러 번 뿌리는 게 좋아요.",
            "matchPoints": ["청량한 향을 좋아하는 분", "운동/야외활동을 즐기는 분", "깨끗한 이미지를 원하는 분", "여름 데일리 향수를 찾는 분"]
        },
        {
            "name": "오리엔탈 미스틱",
            "emoji": "🕯️",
            "desc": "신비롭고 이국적인 매력",
            "condition": { "mood": "high", "intensity": "high", "season": "high" },
            "mood": "cool",
            "color": "bg-purple-800",
            "interpretation": "향신료, 인센스, 앰버 계열의 오리엔탈 향이 당신의 신비로운 매력을 극대화해요. 깊고 복잡한 향이 오래 남아 강렬한 인상을 줘요. 특별한 날 센터 피스가 되고 싶을 때 딱이에요.",
            "guide": "입생로랑 오피움, 톰 포드 누아르 드 누아르, 메종 프란시스 커정 바카라 루즈를 추천해요. 적은 양으로도 충분히 퍼지니 과하게 뿌리지 마세요.",
            "matchPoints": ["강렬하고 인상적인 향을 원하는 분", "특별한 날 사용할 향수를 찾는 분", "이국적인 분위기를 좋아하는 분", "니치 향수에 관심 있는 분"]
        },
        {
            "name": "그린 내추럴",
            "emoji": "🌿",
            "desc": "자연스럽고 건강한 매력",
            "condition": { "nature": "high", "intensity": "low", "sweetness": "low" },
            "mood": "happy",
            "color": "bg-green-300",
            "interpretation": "풀내음, 허브, 그린 계열의 자연향이 당신과 잘 어울려요! 인위적이지 않고 건강하고 깨끗한 이미지를 줘요. 일상에서 부담 없이 사용하기 좋고, 호감도 높은 향이에요.",
            "guide": "조 말론 잉글리쉬 페어 & 프리지아, 샤넬 찬스 오 프레쉬, 에르메스 나일의 정원을 추천해요. 자연스러운 향은 레이어링 하기도 좋아요.",
            "matchPoints": ["자연스러운 향을 좋아하는 분", "데일리로 편하게 쓸 향수를 찾는 분", "허브/그린 계열에 끌리는 분", "무난하고 호감 가는 향을 원하는 분"]
        },
        {
            "name": "파우더리 소프트",
            "emoji": "🎀",
            "desc": "부드럽고 포근한 매력",
            "condition": { "sweetness": "high", "intensity": "low", "nature": "medium" },
            "mood": "happy",
            "color": "bg-pink-100",
            "interpretation": "파우더, 아이리스, 소프트 플로럴 계열이 당신에게 잘 어울려요! 부드럽고 포근한 향이 편안한 인상을 줘요. 너무 튀지 않으면서 은은하게 좋은 향이 나는 스타일이죠.",
            "guide": "프라다 인퓨전 디리스, 조르지오 아르마니 시, 메종 마르지엘라 레이지 선데이 모닝을 추천해요.",
            "matchPoints": ["부드러운 향을 좋아하는 분", "은은하게 좋은 향을 원하는 분", "청순한 이미지를 연출하고 싶은 분", "오피스용 데일리 향수를 찾는 분"]
        },
        {
            "name": "스파이시 웜",
            "emoji": "🔥",
            "desc": "따뜻하고 매혹적인 매력",
            "condition": { "season": "high", "mood": "high", "sweetness": "medium" },
            "mood": "excited",
            "color": "bg-red-700",
            "interpretation": "시나몬, 카다멈, 핑크페퍼 같은 스파이시 계열이 당신의 매력을 더해줄 거예요. 따뜻하면서도 에너제틱한 향이 자신감 있는 인상을 줘요.",
            "guide": "디올 아딕트, 버버리 마이 버버리, 톰 포드 블랙 오키드를 추천해요. 스파이시 노트는 개성이 강해서 취향이 확실히 갈리니 신중하게 선택하세요.",
            "matchPoints": ["따뜻한 향을 좋아하는 분", "개성 있는 향을 원하는 분", "자신감 있는 이미지를 연출하고 싶은 분", "겨울철 시그니처 향수를 찾는 분"]
        },
        {
            "name": "클린 코튼",
            "emoji": "🧺",
            "desc": "깨끗하고 청결한 매력",
            "condition": { "intensity": "low", "mood": "low", "nature": "medium", "sweetness": "low" },
            "mood": "happy",
            "color": "bg-blue-100",
            "interpretation": "세탁물, 깨끗한 리넨, 화이트 머스크 계열이 당신과 잘 어울려요! 깨끗하고 청결한 인상을 주며 누구에게나 호감을 줄 수 있는 무난한 향이에요. 데일리로 사용하기 완벽해요.",
            "guide": "클린 코튼, 메종 마르지엘라 버블 배스, 엘리자베스 앤 제임스 클린을 추천해요. 자연스러운 청결함을 원할 때 최고예요.",
            "matchPoints": ["깨끗한 이미지를 원하는 분", "무난하고 호감 가는 향을 좋아하는 분", "데일리 향수를 찾는 분", "향수 초보자"]
        },
        {
            "name": "럭셔리 누아르",
            "emoji": "🖤",
            "desc": "고급스럽고 깊이 있는 매력",
            "condition": { "intensity": "high", "mood": "high", "nature": "high", "season": "high" },
            "mood": "cool",
            "color": "bg-gray-900",
            "interpretation": "우드, 레더, 앰버 계열의 럭셔리 향이 당신의 격을 높여줄 거예요. 고급스럽고 깊이 있는 향으로 강한 존재감을 드러내요. 포멀한 자리나 특별한 날에 완벽해요.",
            "guide": "톰 포드 우드 컬렉션, 크리드 어벤투스, 바이레도 슈퍼 시더를 추천해요. 니치 브랜드에서 특별한 나만의 향을 찾아보세요.",
            "matchPoints": ["고급스러운 향을 원하는 분", "존재감 있는 향을 좋아하는 분", "니치 향수에 관심 있는 분", "시그니처 향수를 찾는 분"]
        }
    ]
};
