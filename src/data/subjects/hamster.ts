// hamster 테스트 데이터
// 생성일: 2025-12-11

export const HAMSTER_DATA = {
        "title": "햄스터 맘 테스트",
        "subtitle": "우리 햄찌 성향은?",
        "themeColor": "bg-[#F4A460]",
        "icon": "HamsterFace",
        "dimensions": {
                "curious": {
                        "name": "탐험심",
                        "emoji": "🔎",
                        "desc": "새로운 것에 대한 호기심"
                },
                "hoard": {
                        "name": "저장욕",
                        "emoji": "🥜",
                        "desc": "먹이를 모으려는 본능"
                },
                "active": {
                        "name": "활동량",
                        "emoji": "🎡",
                        "desc": "쳇바퀴 러닝, 움직임 정도"
                },
                "tame": {
                        "name": "친밀도",
                        "emoji": "🤝",
                        "desc": "사람에 대한 길들여짐"
                },
                "nocturnal": {
                        "name": "야행성",
                        "emoji": "🌙",
                        "desc": "밤 활동 선호도"
                }
        },
        "questions": [
                {
                        "q": "케이지에 새로운 물건을 넣어주면?",
                        "dimension": "curious",
                        "a": [
                                {
                                        "text": "바로 다가가서 냄새 맡고 탐색한다",
                                        "score": 5
                                },
                                {
                                        "text": "경계하며 거리를 둔다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "햄스터 볼에 넣어주면?",
                        "dimension": "curious",
                        "a": [
                                {
                                        "text": "신나게 굴리며 탐험한다",
                                        "score": 5
                                },
                                {
                                        "text": "움직이지 않고 가만히 있다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "손바닥 위에 올려놓으면?",
                        "dimension": "curious",
                        "a": [
                                {
                                        "text": "손가락 사이를 탐색한다",
                                        "score": 5
                                },
                                {
                                        "text": "도망가려 한다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "먹이를 주면?",
                        "dimension": "hoard",
                        "a": [
                                {
                                        "text": "볼주머니에 가득 채워 집으로 간다",
                                        "score": 5
                                },
                                {
                                        "text": "그 자리에서 바로 먹는다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "간식을 여러 개 주면?",
                        "dimension": "hoard",
                        "a": [
                                {
                                        "text": "최대한 많이 볼에 넣으려 한다",
                                        "score": 5
                                },
                                {
                                        "text": "하나씩 먹는다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "쳇바퀴를 얼마나 돌리나요?",
                        "dimension": "active",
                        "a": [
                                {
                                        "text": "밤새 돌린다! 소리가 들릴 정도",
                                        "score": 5
                                },
                                {
                                        "text": "가끔 돌리거나 안 탄다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "케이지 밖으로 나오면?",
                        "dimension": "active",
                        "a": [
                                {
                                        "text": "쉬지 않고 돌아다닌다",
                                        "score": 5
                                },
                                {
                                        "text": "한 곳에 머무른다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "케이지 안에서 주로?",
                        "dimension": "active",
                        "a": [
                                {
                                        "text": "이리저리 움직이며 활동한다",
                                        "score": 5
                                },
                                {
                                        "text": "집 안에서 자고 있다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "손을 케이지에 넣으면?",
                        "dimension": "tame",
                        "a": [
                                {
                                        "text": "다가와서 냄새 맡거나 올라온다",
                                        "score": 5
                                },
                                {
                                        "text": "도망가거나 숨는다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "이름을 부르면?",
                        "dimension": "tame",
                        "a": [
                                {
                                        "text": "반응하며 다가온다",
                                        "score": 5
                                },
                                {
                                        "text": "반응이 없다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "낮 시간에는 주로?",
                        "dimension": "nocturnal",
                        "a": [
                                {
                                        "text": "깊이 자고 있다",
                                        "score": 5
                                },
                                {
                                        "text": "가끔 활동한다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "밤 10시 이후에는?",
                        "dimension": "nocturnal",
                        "a": [
                                {
                                        "text": "쳇바퀴 소리가 들릴 정도로 활동적",
                                        "score": 5
                                },
                                {
                                        "text": "조용히 쉬고 있다",
                                        "score": 1
                                }
                        ]
                }
        ],
        "questions_deep": [
                {
                        "q": "새로운 베딩 종류를 깔아주면?",
                        "dimension": "curious",
                        "a": [
                                {
                                        "text": "파헤치며 탐색한다",
                                        "score": 5
                                },
                                {
                                        "text": "불편해한다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "터널을 넣어주면?",
                        "dimension": "curious",
                        "a": [
                                {
                                        "text": "바로 들어가서 탐험한다",
                                        "score": 5
                                },
                                {
                                        "text": "관심 없다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "새로운 간식을 주면?",
                        "dimension": "curious",
                        "a": [
                                {
                                        "text": "일단 맛본다",
                                        "score": 5
                                },
                                {
                                        "text": "익숙한 것만 먹는다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "케이지 레이아웃을 바꾸면?",
                        "dimension": "curious",
                        "a": [
                                {
                                        "text": "바뀐 환경을 탐색한다",
                                        "score": 5
                                },
                                {
                                        "text": "스트레스 받아한다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "씨앗류를 주면?",
                        "dimension": "hoard",
                        "a": [
                                {
                                        "text": "볼이 터질 듯 저장한다",
                                        "score": 5
                                },
                                {
                                        "text": "적당히 먹는다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "집 안을 들여다보면?",
                        "dimension": "hoard",
                        "a": [
                                {
                                        "text": "음식 저장소가 가득하다",
                                        "score": 5
                                },
                                {
                                        "text": "별로 쌓아두지 않는다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "화장실 모래를 갈아주면?",
                        "dimension": "hoard",
                        "a": [
                                {
                                        "text": "음식을 다시 옮겨 저장한다",
                                        "score": 5
                                },
                                {
                                        "text": "신경 쓰지 않는다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "플레이펜에서 놀 때?",
                        "dimension": "active",
                        "a": [
                                {
                                        "text": "계속 뛰어다닌다",
                                        "score": 5
                                },
                                {
                                        "text": "금방 지친다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "모래 목욕을 시켜주면?",
                        "dimension": "active",
                        "a": [
                                {
                                        "text": "신나게 뒹군다",
                                        "score": 5
                                },
                                {
                                        "text": "관심 없다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "케이지 철망을 오르려 하나요?",
                        "dimension": "active",
                        "a": [
                                {
                                        "text": "자주 오른다",
                                        "score": 5
                                },
                                {
                                        "text": "안 오른다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "파헤치기 놀이를?",
                        "dimension": "active",
                        "a": [
                                {
                                        "text": "정말 좋아한다",
                                        "score": 5
                                },
                                {
                                        "text": "별로 안 한다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "간식을 손에 들고 있으면?",
                        "dimension": "tame",
                        "a": [
                                {
                                        "text": "손에서 받아먹는다",
                                        "score": 5
                                },
                                {
                                        "text": "손을 피한다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "핸들링(손에 올리기)할 때?",
                        "dimension": "tame",
                        "a": [
                                {
                                        "text": "편안해한다",
                                        "score": 5
                                },
                                {
                                        "text": "도망가려 한다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "케이지 문을 열면?",
                        "dimension": "tame",
                        "a": [
                                {
                                        "text": "다가와서 올라오려 한다",
                                        "score": 5
                                },
                                {
                                        "text": "무관심하다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "건드리면?",
                        "dimension": "tame",
                        "a": [
                                {
                                        "text": "물지 않는다",
                                        "score": 5
                                },
                                {
                                        "text": "물 수 있다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "저녁 식사 시간쯤?",
                        "dimension": "nocturnal",
                        "a": [
                                {
                                        "text": "일어나기 시작한다",
                                        "score": 5
                                },
                                {
                                        "text": "아직 자고 있다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "새벽 시간에?",
                        "dimension": "nocturnal",
                        "a": [
                                {
                                        "text": "가장 활발하다",
                                        "score": 5
                                },
                                {
                                        "text": "조용하다",
                                        "score": 1
                                }
                        ]
                },
                {
                        "q": "낮에 깨우면?",
                        "dimension": "nocturnal",
                        "a": [
                                {
                                        "text": "짜증내며 다시 잔다",
                                        "score": 5
                                },
                                {
                                        "text": "일어난다",
                                        "score": 1
                                }
                        ]
                }
        ],
        "resultLabels": [
                {
                        "name": "탐험가 햄찌",
                        "emoji": "🗺️",
                        "desc": "호기심 폭발! 모든 게 궁금해",
                        "condition": {
                                "curious": "high",
                                "active": "high"
                        },
                        "interpretation": "호기심이 넘치고 활동적인 성격입니다. 새로운 것을 발견하면 바로 탐색해요.",
                        "guide": "다양한 장난감과 터널, 은신처를 제공해주세요. 탐험할 수 있는 안전한 공간도 좋아요.",
                        "mood": "excited",
                        "color": "bg-yellow-100"
                },
                {
                        "name": "수집왕 햄찌",
                        "emoji": "🥜",
                        "desc": "볼주머니 가득! 저장의 달인",
                        "condition": {
                                "hoard": "high"
                        },
                        "interpretation": "저장 본능이 강한 햄스터입니다. 먹이를 모으는 것에 큰 기쁨을 느껴요.",
                        "guide": "숨길 수 있는 다양한 간식을 주세요. 저장할 공간도 충분히 제공해주세요.",
                        "mood": "happy",
                        "color": "bg-orange-100"
                },
                {
                        "name": "쳇바퀴 마스터",
                        "emoji": "🎡",
                        "desc": "뛴다! 뛴다! 밤새 러닝",
                        "condition": {
                                "active": "high",
                                "nocturnal": "high"
                        },
                        "interpretation": "밤에 특히 활동적인 에너자이저입니다. 쳇바퀴 러닝을 정말 좋아해요.",
                        "guide": "조용한 쳇바퀴를 제공하고 밤 활동을 방해하지 마세요. 충분한 운동이 건강에 중요해요.",
                        "mood": "excited",
                        "color": "bg-green-100"
                },
                {
                        "name": "인싸 햄찌",
                        "emoji": "🤝",
                        "desc": "사람 좋아! 친근한 성격",
                        "condition": {
                                "tame": "high",
                                "curious": "high"
                        },
                        "interpretation": "사람을 잘 따르고 친근한 성격입니다. 핸들링에도 잘 적응해요.",
                        "guide": "자주 교감하고 손에 올려 놀아주세요. 신뢰 관계가 잘 형성되어 있어요.",
                        "mood": "happy",
                        "color": "bg-pink-100"
                },
                {
                        "name": "수줍음쟁이 햄찌",
                        "emoji": "🙈",
                        "desc": "조심조심... 천천히 다가와",
                        "condition": {
                                "tame": "low",
                                "curious": "low"
                        },
                        "interpretation": "겁이 많고 조심스러운 성격입니다. 신뢰를 쌓는 데 시간이 필요해요.",
                        "guide": "억지로 만지지 말고 천천히 신뢰를 쌓아주세요. 간식으로 유대감을 형성하세요.",
                        "mood": "sad",
                        "color": "bg-blue-100"
                },
                {
                        "name": "낮잠왕 햄찌",
                        "emoji": "😴",
                        "desc": "낮엔 자야지... zzZ",
                        "condition": { "nocturnal": "high" },
                        "interpretation": "확실한 야행성으로 낮에는 깊이 잠들어 있어요. 밤에 조금씩 활동합니다.",
                        "guide": "낮에 깨우지 마세요. 밤 활동 시간을 존중해주는 것이 중요해요.",
                        "mood": "happy",
                        "color": "bg-indigo-100"
                },
                {
                        "name": "미니멀리스트 햄찌",
                        "emoji": "✨",
                        "desc": "저장? 난 그때그때 먹어!",
                        "condition": {
                                "hoard": "low"
                        },
                        "interpretation": "저장 본능이 약한 편이에요. 볼주머니를 잘 사용하지 않고 그 자리에서 먹는 걸 선호해요.",
                        "guide": "먹이가 부족하지 않은지 확인해주세요. 저장을 안 해서 배고플 수 있어요.",
                        "mood": "happy",
                        "color": "bg-cyan-100"
                },
                {
                        "name": "아침형 햄찌",
                        "emoji": "🌅",
                        "desc": "낮에도 활동해요!",
                        "condition": {
                                "nocturnal": "low",
                                "active": "high"
                        },
                        "interpretation": "일반적인 햄스터와 달리 낮에도 활동적이에요. 주인과 교감할 기회가 더 많아요.",
                        "guide": "낮 활동이 건강 문제가 아닌지 확인해주세요. 정상적이라면 함께 놀아주기 좋은 타입이에요.",
                        "mood": "excited",
                        "color": "bg-amber-100"
                },

                {
                        "name": "균형잡힌 햄찌",
                        "emoji": "⚖️",
                        "desc": "모든 면에서 균형 잡힌 비전이 있는 햄스터",
                        "condition": {
                                "curious": "medium",
                                "hoard": "medium",
                                "active": "medium",
                                "tame": "medium",
                                "nocturnal": "medium"
                        },
                        "interpretation": "균형 잡힌 성격으로 다양한 상황에 잘 적응합니다. 키우기 편한 성격이에요.",
                        "guide": "현재 환경을 유지하면서 꾸준히 교감해주세요.",
                        "mood": "happy",
                        "color": "bg-teal-100"
                },
                {
                        "name": "미스터리 햄찌",
                        "emoji": "🎭",
                        "desc": "예측불가! 매력적인 반전",
                        "condition": {
                                "curious": "medium",
                                "active": "medium"
                        },
                        "interpretation": "다양한 면을 가진 매력적인 성격입니다. 때에 따라 다른 모습을 보여줘요.",
                        "guide": "햄스터의 다양한 성격을 관찰하고 즐겨주세요. 유연하게 대응하는 것이 좋아요.",
                        "mood": "cool",
                        "color": "bg-purple-100"
                }
        ]
};

if (typeof window !== 'undefined') {
  window.CHEMI_SUBJECTS = window.CHEMI_SUBJECTS || {};
  window.CHEMI_SUBJECTS.hamster = HAMSTER_DATA;
}
