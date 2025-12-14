// rabbit 테스트 데이터

import { SubjectData } from '../types';

export const rabbitData: SubjectData = {
            "title": "토끼 맘 테스트",
            "subtitle": "우리 토끼 성향은?",
            "themeColor": "bg-[#FFB6C1]",
            "icon": "RabbitFace",
            "dimensions": {
                    "curious": {
                            "name": "호기심",
                            "emoji": "🔍",
                            "desc": "새로운 것에 대한 탐구심"
                    },
                    "social": {
                            "name": "사교성",
                            "emoji": "💕",
                            "desc": "사람/동물과의 친밀도"
                    },
                    "active": {
                            "name": "활동성",
                            "emoji": "🏃",
                            "desc": "움직임과 놀이 선호도"
                    },
                    "brave": {
                            "name": "담력",
                            "emoji": "🦁",
                            "desc": "낯선 상황에 대한 대담함"
                    },
                    "chill": {
                            "name": "느긋함",
                            "emoji": "😌",
                            "desc": "스트레스 관리 능력"
                    }
            },
            "questions": [
                    {
                            "q": "새로운 장난감을 케이지에 넣어주면?",
                            "dimension": "curious",
                            "a": [
                                    {
                                            "text": "바로 다가가서 코로 킁킁 탐색한다",
                                            "score": 5
                                    },
                                    {
                                            "text": "멀리서 지켜보다가 나중에 확인한다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "집안에서 처음 가보는 공간을 발견하면?",
                            "dimension": "curious",
                            "a": [
                                    {
                                            "text": "신나서 구석구석 돌아다닌다",
                                            "score": 5
                                    },
                                    {
                                            "text": "익숙한 곳으로 돌아가려 한다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "낯선 소리가 들리면?",
                            "dimension": "curious",
                            "a": [
                                    {
                                            "text": "귀를 쫑긋 세우고 소리 방향을 확인한다",
                                            "score": 5
                                    },
                                    {
                                            "text": "숨거나 움츠러든다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "주인이 손을 내밀면?",
                            "dimension": "social",
                            "a": [
                                    {
                                            "text": "다가와서 손 냄새를 맡거나 핥는다",
                                            "score": 5
                                    },
                                    {
                                            "text": "피하거나 무시한다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "쓰다듬어 주려고 하면?",
                            "dimension": "social",
                            "a": [
                                    {
                                            "text": "가만히 있거나 더 기대온다",
                                            "score": 5
                                    },
                                    {
                                            "text": "피하려고 한다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "다른 반려동물(토끼/고양이 등)을 만나면?",
                            "dimension": "social",
                            "a": [
                                    {
                                            "text": "관심을 보이며 다가간다",
                                            "score": 5
                                    },
                                    {
                                            "text": "경계하거나 도망간다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "케이지 밖으로 나오면 주로?",
                            "dimension": "active",
                            "a": [
                                    {
                                            "text": "신나게 뛰어다니고 빙키(점프)한다",
                                            "score": 5
                                    },
                                    {
                                            "text": "한 곳에 앉아서 쉰다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "저녁 시간대 토끼의 모습은?",
                            "dimension": "active",
                            "a": [
                                    {
                                            "text": "활발하게 움직이며 놀아달라 한다",
                                            "score": 5
                                    },
                                    {
                                            "text": "조용히 휴식을 취한다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "갑자기 큰 소리가 나면?",
                            "dimension": "brave",
                            "a": [
                                    {
                                            "text": "잠깐 멈추고 다시 하던 일을 한다",
                                            "score": 5
                                    },
                                    {
                                            "text": "숨거나 발을 쿵쿵 구른다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "처음 보는 사람이 방문하면?",
                            "dimension": "brave",
                            "a": [
                                    {
                                            "text": "호기심을 가지고 다가간다",
                                            "score": 5
                                    },
                                    {
                                            "text": "숨거나 경계한다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "안아주려고 하면?",
                            "dimension": "chill",
                            "a": [
                                    {
                                            "text": "차분하게 안겨 있는다",
                                            "score": 5
                                    },
                                    {
                                            "text": "발버둥 치며 내려가려 한다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "평소 토끼의 모습은?",
                            "dimension": "chill",
                            "a": [
                                    {
                                            "text": "편안하게 옆으로 누워 있거나 늘어져 있다",
                                            "score": 5
                                    },
                                    {
                                            "text": "항상 긴장하고 주변을 살핀다",
                                            "score": 1
                                    }
                            ]
                    }
            ],
            "questions_deep": [
                    {
                            "q": "새로운 야채를 처음 주면?",
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
                            "q": "방 구조를 바꾸면?",
                            "dimension": "curious",
                            "a": [
                                    {
                                            "text": "바뀐 곳을 열심히 탐색한다",
                                            "score": 5
                                    },
                                    {
                                            "text": "혼란스러워한다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "새로운 건초 종류를 주면?",
                            "dimension": "curious",
                            "a": [
                                    {
                                            "text": "호기심 있게 시도한다",
                                            "score": 5
                                    },
                                    {
                                            "text": "기존 건초만 먹는다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "창문 밖 새소리가 들리면?",
                            "dimension": "curious",
                            "a": [
                                    {
                                            "text": "귀 세우고 관심을 보인다",
                                            "score": 5
                                    },
                                    {
                                            "text": "무관심하다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "여러 명이 집에 있을 때?",
                            "dimension": "social",
                            "a": [
                                    {
                                            "text": "돌아다니며 각자에게 관심을 보인다",
                                            "score": 5
                                    },
                                    {
                                            "text": "주인 곁에만 있는다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "주인이 바닥에 누우면?",
                            "dimension": "social",
                            "a": [
                                    {
                                            "text": "옆에 와서 같이 눕는다",
                                            "score": 5
                                    },
                                    {
                                            "text": "관심 없다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "주인이 우울해 보이면?",
                            "dimension": "social",
                            "a": [
                                    {
                                            "text": "다가와서 코를 킁킁거린다",
                                            "score": 5
                                    },
                                    {
                                            "text": "평소와 같다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "손에 간식이 있으면?",
                            "dimension": "social",
                            "a": [
                                    {
                                            "text": "손에서 직접 받아먹는다",
                                            "score": 5
                                    },
                                    {
                                            "text": "바닥에 놓아야 먹는다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "놀이 시간에 터널을 주면?",
                            "dimension": "active",
                            "a": [
                                    {
                                            "text": "신나게 통과하며 논다",
                                            "score": 5
                                    },
                                    {
                                            "text": "관심 없다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "아침에 일어나면?",
                            "dimension": "active",
                            "a": [
                                    {
                                            "text": "케이지 안에서 뛰어다닌다",
                                            "score": 5
                                    },
                                    {
                                            "text": "조용히 건초를 먹는다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "공이나 장난감을 주면?",
                            "dimension": "active",
                            "a": [
                                    {
                                            "text": "코로 밀며 논다",
                                            "score": 5
                                    },
                                    {
                                            "text": "무시한다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "밤늦은 시간에는?",
                            "dimension": "active",
                            "a": [
                                    {
                                            "text": "여전히 활동적이다",
                                            "score": 5
                                    },
                                    {
                                            "text": "조용히 쉰다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "청소기 소리가 나면?",
                            "dimension": "brave",
                            "a": [
                                    {
                                            "text": "신경 쓰지 않는다",
                                            "score": 5
                                    },
                                    {
                                            "text": "패닉 상태가 된다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "발톱 깎을 때?",
                            "dimension": "brave",
                            "a": [
                                    {
                                            "text": "비교적 차분하다",
                                            "score": 5
                                    },
                                    {
                                            "text": "격하게 저항한다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "차를 타고 이동하면?",
                            "dimension": "brave",
                            "a": [
                                    {
                                            "text": "금방 적응한다",
                                            "score": 5
                                    },
                                    {
                                            "text": "매우 불안해한다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "낯선 환경(병원 등)에 가면?",
                            "dimension": "brave",
                            "a": [
                                    {
                                            "text": "주변을 살피며 적응한다",
                                            "score": 5
                                    },
                                    {
                                            "text": "계속 떨거나 숨으려 한다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "주인이 TV를 크게 틀어도?",
                            "dimension": "chill",
                            "a": [
                                    {
                                            "text": "편하게 쉰다",
                                            "score": 5
                                    },
                                    {
                                            "text": "불안해한다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "케이지 청소 중일 때?",
                            "dimension": "chill",
                            "a": [
                                    {
                                            "text": "신경 쓰지 않는다",
                                            "score": 5
                                    },
                                    {
                                            "text": "스트레스 받아한다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "사진 찍으려고 하면?",
                            "dimension": "chill",
                            "a": [
                                    {
                                            "text": "가만히 있어준다",
                                            "score": 5
                                    },
                                    {
                                            "text": "피한다",
                                            "score": 1
                                    }
                            ]
                    },
                    {
                            "q": "손톱 정리나 그루밍 중?",
                            "dimension": "chill",
                            "a": [
                                    {
                                            "text": "편안하게 받아들인다",
                                            "score": 5
                                    },
                                    {
                                            "text": "싫어한다",
                                            "score": 1
                                    }
                            ]
                    }
            ],
            "resultLabels": [
                    {
                            "name": "탐험가 토끼",
                            "emoji": "🗺️",
                            "desc": "호기심 만땅! 뭐든 궁금한 탐험가",
                            "condition": {
                                    "curious": "high",
                                    "social": "high",
                                    "brave": "high"
                            },
                            "interpretation": "호기심이 넘치고 사교적인 성격입니다. 새로운 것을 두려워하지 않고 적극적으로 탐색해요.",
                            "guide": "다양한 장난감과 탐색 공간을 제공해주세요. 새로운 경험을 좋아하니 안전한 범위에서 탐험 기회를 주세요.",
                            "mood": "excited",
                            "color": "bg-yellow-100"
                    },
                    {
                            "name": "애교쟁이 토끼",
                            "emoji": "🥰",
                            "desc": "사람 좋아! 스킨십 최고!",
                            "condition": {
                                    "social": "high",
                                    "chill": "high"
                            },
                            "interpretation": "사람과의 교감을 즐기는 다정한 성격입니다. 스킨십을 좋아하고 주인 곁에 있는 걸 좋아해요.",
                            "guide": "많은 애정과 스킨십을 주세요. 혼자 두는 시간이 길면 외로워할 수 있어요.",
                            "mood": "happy",
                            "color": "bg-pink-100"
                    },
                    {
                            "name": "액티브 토끼",
                            "emoji": "🏃",
                            "desc": "뛰고 뛰고 또 뛰고! 빙키 마스터",
                            "condition": {
                                    "active": "high",
                                    "brave": "high"
                            },
                            "interpretation": "에너지가 넘치고 활동적인 성격입니다. 놀이 시간을 정말 좋아하고 빙키(기쁨 점프)를 자주 해요.",
                            "guide": "충분한 운동 공간과 놀이 시간을 제공해주세요. 터널, 공 등 다양한 장난감이 좋아요.",
                            "mood": "excited",
                            "color": "bg-green-100"
                    },
                    {
                            "name": "신중한 토끼",
                            "emoji": "🤔",
                            "desc": "일단 지켜본다... 안전 제일!",
                            "condition": {
                                    "curious": "low",
                                    "brave": "low"
                            },
                            "interpretation": "조심성이 많고 신중한 성격입니다. 새로운 것에 시간을 두고 천천히 적응해요.",
                            "guide": "급격한 환경 변화를 피하고 천천히 새로운 것을 소개해주세요. 숨을 공간을 항상 제공해주세요.",
                            "mood": "sad",
                            "color": "bg-blue-100"
                    },
                    {
                            "name": "독립적인 토끼",
                            "emoji": "😎",
                            "desc": "나는 나! 쿨한 마이웨이",
                            "condition": {
                                    "social": "low",
                                    "chill": "high"
                            },
                            "interpretation": "독립적이고 자기만의 시간을 중요시하는 성격입니다. 스킨십보다는 자유를 선호해요.",
                            "guide": "억지 스킨십은 피하고 토끼가 다가올 때까지 기다려주세요. 개인 공간을 존중해주세요.",
                            "mood": "cool",
                            "color": "bg-purple-100"
                    },
                    {
                            "name": "겁쟁이 토끼",
                            "emoji": "🐰",
                            "desc": "무서워... 조용히 해줘...",
                            "condition": {
                                    "brave": "low",
                                    "chill": "low"
                            },
                            "interpretation": "예민하고 겁이 많은 성격입니다. 조용하고 안정적인 환경을 좋아해요.",
                            "guide": "갑작스러운 소리나 움직임을 피해주세요. 안전한 숨을 공간과 일관된 루틴이 중요해요.",
                            "mood": "sad",
                            "color": "bg-gray-100"
                    },
                    {
                            "name": "사색가 토끼",
                            "emoji": "📚",
                            "desc": "조용히 생각 중... 철학 토끼",
                            "condition": {
                                    "active": "low",
                                    "chill": "high"
                            },
                            "interpretation": "차분하고 조용한 성격입니다. 활동적이기보다는 편안히 쉬는 것을 좋아해요.",
                            "guide": "편안한 휴식 공간을 만들어주세요. 억지로 놀게 하지 말고 토끼의 페이스를 존중해주세요.",
                            "mood": "happy",
                            "color": "bg-indigo-100"
                    },
            {
                      "name": "에너자이저 토끼",
                      "emoji": "⚡",
                      "desc": "쉴 틈이 없어! 에너지 폭발!",
                      "condition": {
                                "active": "high",
                                "chill": "low"
                      },
                      "interpretation": "에너지가 넘치고 가만히 있지 못하는 성격입니다. 항상 무언가를 하고 싶어해요.",
                      "guide": "충분한 운동 공간과 다양한 장난감을 제공해주세요. 에너지를 발산할 수 있는 놀이 시간이 중요해요.",
                      "mood": "excited",
                      "color": "bg-orange-100"
            },

                    {
                            "name": "밸런스 토끼",
                            "emoji": "⚖️",
                            "desc": "모든 면에서 균형 잡힌 이상적인 토끼",
                            "condition": {
                                    "curious": "medium",
                                    "social": "medium",
                                    "active": "medium",
                                    "brave": "medium",
                                    "chill": "medium"
                            },
                            "interpretation": "균형 잡힌 성격으로 다양한 상황에 잘 적응합니다. 키우기 편한 성격이에요.",
                            "guide": "현재 환경을 유지하면서 다양한 경험을 조금씩 제공해주세요.",
                            "mood": "happy",
                            "color": "bg-teal-100"
                    }
            ]
    };
