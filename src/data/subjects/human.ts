// human 테스트 데이터
// 생성일: 2025-12-11

export const HUMAN_DATA = {
    title: "내 맘 테스트",
    subtitle: "나의 진짜 성격은?",
    themeColor: "bg-[#BDE0FE]",
    icon: "HumanIcon",
    dimensions: {
        inssa: {
            name: "인싸력",
            emoji: "🎭",
            desc: "사회적 에너지와 외향성"
        },
        adventure: {
            name: "모험심",
            emoji: "🌟",
            desc: "새로움에 대한 개방성"
        },
        empathy: {
            name: "공감력",
            emoji: "💗",
            desc: "감정적 민감성과 배려"
        },
        plan: {
            name: "계획력",
            emoji: "📋",
            desc: "체계성과 규칙 선호"
        },
        mental: {
            name: "멘탈력",
            emoji: "🧠",
            desc: "정서적 안정성"
        }
    },
    questions: [
        {
            q: "오랜만에 동창회에 나갔다! 어색한 친구들 사이에서 나는?",
            dimension: "inssa",
            a: [
                {
                    text: "먼저 말을 걸며 분위기를 띄운다.",
                    score: 5
                },
                {
                    text: "일단 지켜보다가 기회가 오면 자연스럽게 합류한다.",
                    score: 3
                },
                {
                    text: "친한 친구 옆에 딱 붙어서 조용히 있는다.",
                    score: 1
                }
            ]
        },
        {
            q: "주말에 아무 약속이 없다면?",
            dimension: "inssa",
            a: [
                {
                    text: "심심해... 친구들에게 연락해 약속을 잡는다.",
                    score: 5
                },
                {
                    text: "반반! 오전은 쉬고 오후에 가벼운 약속 하나 잡는다.",
                    score: 3
                },
                {
                    text: "나이스! 밀린 넷플릭스를 보며 침대와 한 몸이 된다.",
                    score: 1
                }
            ]
        },
        {
            q: "갑자기 모르는 번호로 전화가 걸려온다면?",
            dimension: "inssa",
            a: [
                {
                    text: "여보세요? 일단 받고 누구인지 확인한다.",
                    score: 5
                },
                {
                    text: "스팸인가? 고민하다가 끊어지면 안도한다.",
                    score: 1
                }
            ]
        },
        {
            q: "멍 때릴 때 주로 하는 생각은?",
            dimension: "adventure",
            a: [
                {
                    text: "좀비 사태가 터지면 어디로 도망가지? 로또 당첨되면...",
                    score: 5
                },
                {
                    text: "평범한 일상 생각과 가끔 엉뚱한 상상이 섞인다.",
                    score: 3
                },
                {
                    text: "오늘 저녁 뭐 먹지? 내일 할 일이 뭐더라?",
                    score: 1
                }
            ]
        },
        {
            q: "영화를 보고 나서 친구와 대화할 때 나는?",
            dimension: "adventure",
            a: [
                {
                    text: "주인공이 입은 옷 예쁘더라. 액션씬 대박이었어.",
                    score: 1
                },
                {
                    text: "그 결말의 의미는 뭘까? 감독이 전하려는 메시지는...",
                    score: 5
                }
            ]
        },
        {
            q: "요리 레시피를 볼 때 나는?",
            dimension: "adventure",
            a: [
                {
                    text: "이 정도면 되겠지? 감으로 대충 넣거나 내 맘대로 바꾼다.",
                    score: 5
                },
                {
                    text: "기본은 따르되, 가끔 내 취향대로 조금씩 변형한다.",
                    score: 3
                },
                {
                    text: "소금 1작은술... 계량스푼으로 정확히 맞춘다.",
                    score: 1
                }
            ]
        },
        {
            q: "친구가 '나 우울해서 빵 샀어'라고 했을 때 나의 반응은?",
            dimension: "empathy",
            a: [
                {
                    text: "무슨 일 있어? 왜 우울해 ㅠㅠ",
                    score: 5
                },
                {
                    text: "맛있는 거 먹으면 기분 좀 나아지지~ 같이 먹자!",
                    score: 3
                },
                {
                    text: "무슨 빵 샀어? 맛있어?",
                    score: 1
                }
            ]
        },
        {
            q: "친구가 머리를 자르고 왔는데, 솔직히 좀 별로다. 이때 나는?",
            dimension: "empathy",
            a: [
                {
                    text: "음... 전이 더 나은 것 같은데? 솔직하게 말한다.",
                    score: 1
                },
                {
                    text: "오~ 변화를 줬네! 기분 전환 됐겠다! 돌려 말하거나 칭찬한다.",
                    score: 5
                }
            ]
        },
        {
            q: "조별 과제 중, 열심히 했지만 결과물이 별로인 팀원에게 피드백한다면?",
            dimension: "empathy",
            a: [
                {
                    text: "고생 많으셨어요! 근데 이 부분만 조금 더... 격려부터 한다.",
                    score: 5
                },
                {
                    text: "노력한 건 알겠는데, 이 부분은 같이 수정해봐요.",
                    score: 3
                },
                {
                    text: "이 부분은 수정이 필요해요. 부족한 점을 명확히 짚어준다.",
                    score: 1
                }
            ]
        },
        {
            q: "여행 가기 전날, 나의 짐 싸기 스타일은?",
            dimension: "plan",
            a: [
                {
                    text: "며칠 전부터 리스트를 작성하고 차곡차곡 싸둔다.",
                    score: 5
                },
                {
                    text: "전날 밤에 필요한 것들 떠올리며 대충 챙긴다.",
                    score: 3
                },
                {
                    text: "출발 직전에 '지갑, 여권! 챙겼으면 됐지!' 하고 후다닥 싼다.",
                    score: 1
                }
            ]
        },
        {
            q: "2주 뒤가 시험이다. 나의 공부 계획은?",
            dimension: "plan",
            a: [
                {
                    text: "일별로 공부할 분량을 나눠서 계획을 짠다.",
                    score: 5
                },
                {
                    text: "대략적인 범위만 나눠두고, 그때그때 조절한다.",
                    score: 3
                },
                {
                    text: "아직 2주나 남았네? 일단 놀다가 벼락치기한다.",
                    score: 1
                }
            ]
        },
        {
            q: "친구와 맛집에 갔는데 문이 닫혀있다! 이때 나는?",
            dimension: "plan",
            a: [
                {
                    text: "아... 어떡하지? 미리 찾아둔 2순위 식당으로 간다.",
                    score: 5
                },
                {
                    text: "할 수 없지! 저기 맛있어 보이는데 갈까? 바로 옆 가게로 간다.",
                    score: 1
                }
            ]
        },
        {
            q: "중요한 발표가 코앞인데, 갑자기 자료가 날아갔다면?",
            dimension: "mental",
            a: [
                {
                    text: "심호흡하고, 기억나는 대로 빠르게 다시 만든다.",
                    score: 5
                },
                {
                    text: "잠깐 당황하지만, 할 수 있는 것부터 차근차근 시작한다.",
                    score: 3
                },
                {
                    text: "머리가 새하얘지고, 일단 패닉 상태에 빠진다.",
                    score: 1
                }
            ]
        },
        {
            q: "SNS에서 누군가 내 글에 비판적인 댓글을 달았다면?",
            dimension: "mental",
            a: [
                {
                    text: "그럴 수도 있지. 다양한 의견이 있는 거니까.",
                    score: 5
                },
                {
                    text: "좀 신경 쓰이지만, 시간이 지나면 잊어버린다.",
                    score: 3
                },
                {
                    text: "하루 종일 그 댓글이 머릿속에서 떠나지 않는다.",
                    score: 1
                }
            ]
        },
        {
            q: "친구가 며칠째 연락이 없다. 이때 드는 생각은?",
            dimension: "mental",
            a: [
                {
                    text: "바쁜가 보네. 나중에 연락 오겠지.",
                    score: 5
                },
                {
                    text: "나한테 서운한 거 있나? 뭔가 잘못했나?",
                    score: 1
                }
            ]
        }
    ],
    questions_deep: [
        {
            q: "일주일 동안 사람들을 만나지 않고 집에만 있었다면?",
            dimension: "inssa",
            a: [
                {
                    text: "좀이 쑤신다. 세상과 단절된 느낌이 들어 우울하다.",
                    score: 5
                },
                {
                    text: "나름 괜찮지만, 슬슬 사람이 그리워진다.",
                    score: 3
                },
                {
                    text: "너무 평화롭다. 에너지가 완전히 충전된 기분이다.",
                    score: 1
                }
            ]
        },
        {
            q: "대화 중 침묵이 흐르는 순간, 나는?",
            dimension: "inssa",
            a: [
                {
                    text: "어색함을 견딜 수 없어 무슨 말이든 꺼내 분위기를 띄운다.",
                    score: 5
                },
                {
                    text: "침묵도 대화의 일부라고 생각하며 편안하게 기다린다.",
                    score: 1
                }
            ]
        },
        {
            q: "나의 인간관계 스타일은?",
            dimension: "inssa",
            a: [
                {
                    text: "넓고 얕은 관계. 다양한 사람들과 어울리는 것이 좋다.",
                    score: 5
                },
                {
                    text: "적당한 수의 친구들과 균형 있게 지내는 편이다.",
                    score: 3
                },
                {
                    text: "좁고 깊은 관계. 소수의 사람과 깊은 이야기를 나누는 것이 좋다.",
                    score: 1
                }
            ]
        },
        {
            q: "파티나 모임에서 나는 주로?",
            dimension: "inssa",
            a: [
                {
                    text: "무대 중앙이나 시끌벅적한 곳에서 에너지를 발산한다.",
                    score: 5
                },
                {
                    text: "구석진 자리나 조용한 곳에서 한두 명과 대화하거나 관찰한다.",
                    score: 1
                }
            ]
        },
        {
            q: "고민이 생겼을 때 나는?",
            dimension: "inssa",
            a: [
                {
                    text: "친구들에게 털어놓고 이야기하며 해결책을 찾는다.",
                    score: 5
                },
                {
                    text: "혼자 조용히 생각하며 스스로 답을 내릴 때까지 삭힌다.",
                    score: 1
                }
            ]
        },
        {
            q: "처음 만난 사람들 앞에서 나의 자기소개 스타일은?",
            dimension: "inssa",
            a: [
                {
                    text: "안녕하세요! 저는~ 먼저 나서서 활기차게 나를 알린다.",
                    score: 5
                },
                {
                    text: "사회자가 시키거나 순서가 되면 차분하게 짧게 이야기한다.",
                    score: 1
                }
            ]
        },
        {
            q: "사과라는 단어를 들으면 떠오르는 것은?",
            dimension: "adventure",
            a: [
                {
                    text: "빨갛다, 맛있다, 동그랗다, 아삭하다.",
                    score: 1
                },
                {
                    text: "백설공주, 뉴턴, 애플(아이폰), 유혹, 죄.",
                    score: 5
                }
            ]
        },
        {
            q: "여행 계획을 짤 때 나는?",
            dimension: "adventure",
            a: [
                {
                    text: "여행지의 분위기, 그곳에서 느낄 감정, 특별한 경험을 상상한다.",
                    score: 5
                },
                {
                    text: "분위기도 보고, 실용적인 정보도 함께 찾아본다.",
                    score: 3
                },
                {
                    text: "맛집 위치, 교통편, 숙소 가격 등 구체적인 정보를 찾는다.",
                    score: 1
                }
            ]
        },
        {
            q: "일을 처리하는 방식은?",
            dimension: "adventure",
            a: [
                {
                    text: "남들이 안 해본 새로운 방식, 나만의 독창적인 방법을 시도하고 싶다.",
                    score: 5
                },
                {
                    text: "기본은 따르되, 개선점이 보이면 조금씩 바꿔본다.",
                    score: 3
                },
                {
                    text: "검증된 방식, 매뉴얼, 선례를 따르는 것이 편하고 확실하다.",
                    score: 1
                }
            ]
        },
        {
            q: "추상적인 현대 미술 작품을 보았을 때?",
            dimension: "adventure",
            a: [
                {
                    text: "음... 그냥 점이랑 선이네. 이게 뭐지?",
                    score: 1
                },
                {
                    text: "작가의 고뇌와 혼란스러운 내면이 느껴져.",
                    score: 5
                }
            ]
        },
        {
            q: "설명서를 읽을 때 나는?",
            dimension: "adventure",
            a: [
                {
                    text: "1번부터 순서대로 꼼꼼히 읽고 따라 한다.",
                    score: 1
                },
                {
                    text: "대충 그림만 훑어보고 일단 조립부터 해본다.",
                    score: 5
                }
            ]
        },
        {
            q: "나에게 더 중요한 것은?",
            dimension: "adventure",
            a: [
                {
                    text: "현재의 즐거움, 눈앞의 현실, 확실한 팩트.",
                    score: 1
                },
                {
                    text: "미래의 가능성, 보이지 않는 의미, 큰 그림.",
                    score: 5
                }
            ]
        },
        {
            q: "후배가 실수를 해서 시말서를 써야 하는 상황이다. 나는?",
            dimension: "empathy",
            a: [
                {
                    text: "사정을 들어보고 이번만 봐줄 수 있는지 알아본다.",
                    score: 5
                },
                {
                    text: "경고는 주되, 가벼운 처분으로 끝낼 수 있는지 본다.",
                    score: 3
                },
                {
                    text: "규정은 규정이니 원칙대로 처리한다.",
                    score: 1
                }
            ]
        },
        {
            q: "리더로서 팀원을 평가해야 할 때?",
            dimension: "empathy",
            a: [
                {
                    text: "성과와 능력 위주로 냉정하게 평가해야 공정하다.",
                    score: 1
                },
                {
                    text: "그 사람의 노력과 팀 분위기에 미친 영향도 중요하게 고려한다.",
                    score: 5
                }
            ]
        },
        {
            q: "논쟁이 붙었을 때 나는?",
            dimension: "empathy",
            a: [
                {
                    text: "내 논리가 맞다는 것을 증명하기 위해 끝까지 팩트를 제시한다.",
                    score: 1
                },
                {
                    text: "상대방의 기분이 상하지 않도록 적당히 맞춰주거나 화제를 돌린다.",
                    score: 5
                }
            ]
        },
        {
            q: "나를 더 기분 좋게 하는 칭찬은?",
            dimension: "empathy",
            a: [
                {
                    text: "너 진짜 똑똑하다. 일 처리 완벽해.",
                    score: 1
                },
                {
                    text: "너는 정말 따뜻한 사람이야. 배려심이 깊어.",
                    score: 5
                }
            ]
        },
        {
            q: "의사결정을 내릴 때 더 신경 쓰이는 것은?",
            dimension: "empathy",
            a: [
                {
                    text: "이것이 논리적으로 타당한가? 효율적인가?",
                    score: 1
                },
                {
                    text: "이것이 사람들에게 어떤 영향을 미칠까? 내 가치관에 맞는가?",
                    score: 5
                }
            ]
        },
        {
            q: "친구가 늦어서 약속 시간에 늦었다. 친구가 '차가 너무 막혔어'라고 한다면?",
            dimension: "empathy",
            a: [
                {
                    text: "그러게 좀 일찍 나오지 그랬어.",
                    score: 1
                },
                {
                    text: "오느라 고생했네. 차 막히면 힘들지.",
                    score: 5
                }
            ]
        },
        {
            q: "주말 일정이 갑자기 취소되었다면?",
            dimension: "plan",
            a: [
                {
                    text: "아... 계획 다 틀어졌네. 붕 뜬 시간에 당황하며 스트레스 받는다.",
                    score: 5
                },
                {
                    text: "잠깐 아쉽지만, 금방 다른 할 일을 찾는다.",
                    score: 3
                },
                {
                    text: "오예! 자유시간이다! 즉흥적으로 하고 싶은 걸 하거나 쉰다.",
                    score: 1
                }
            ]
        },
        {
            q: "내 방의 상태는?",
            dimension: "plan",
            a: [
                {
                    text: "물건들이 제자리에 정리되어 있고 깔끔하다.",
                    score: 5
                },
                {
                    text: "대체로 정돈되어 있지만 가끔 어지럽혀지기도 한다.",
                    score: 3
                },
                {
                    text: "다소 어지럽혀져 있지만, 나름의 질서가 있어 찾을 순 있다.",
                    score: 1
                }
            ]
        },
        {
            q: "새해 목표를 세울 때 나는?",
            dimension: "plan",
            a: [
                {
                    text: "3월까지 5kg 감량, 주 3회 운동 구체적인 수치와 계획을 짠다.",
                    score: 5
                },
                {
                    text: "올해는 더 건강해지기! 큰 방향성만 정해둔다.",
                    score: 1
                }
            ]
        },
        {
            q: "반복되는 일상(루틴)에 대해 어떻게 생각하는가?",
            dimension: "plan",
            a: [
                {
                    text: "규칙적인 생활 패턴이 있어야 마음이 편하고 효율적이다.",
                    score: 5
                },
                {
                    text: "매일 똑같은 건 지루하다. 변화와 새로운 이벤트가 필요하다.",
                    score: 1
                }
            ]
        },
        {
            q: "할 일 목록(To-Do List)을 작성하는가?",
            dimension: "plan",
            a: [
                {
                    text: "매일 작성하고 완료한 것을 체크하며 쾌감을 느낀다.",
                    score: 5
                },
                {
                    text: "머릿속으로 대충 생각하거나, 적어두고 까먹는 경우가 많다.",
                    score: 1
                }
            ]
        },
        {
            q: "결정을 내려야 할 때 나는?",
            dimension: "plan",
            a: [
                {
                    text: "신속하게 결정을 내리고 다음 단계로 넘어가는 것을 선호한다.",
                    score: 5
                },
                {
                    text: "새로운 정보가 나올 수 있으므로 최대한 결정을 미루고 지켜본다.",
                    score: 1
                }
            ]
        },
        {
            q: "실수를 했을 때 나의 반응은?",
            dimension: "mental",
            a: [
                {
                    text: "다음엔 안 그러면 되지. 빠르게 털고 넘어간다.",
                    score: 5
                },
                {
                    text: "잠깐 아쉽지만, 원인 파악하고 넘어간다.",
                    score: 3
                },
                {
                    text: "왜 그랬을까... 계속 곱씹으며 자책한다.",
                    score: 1
                }
            ]
        },
        {
            q: "예상치 못한 변화가 생겼을 때?",
            dimension: "mental",
            a: [
                {
                    text: "상황에 맞춰 유연하게 대처한다.",
                    score: 5
                },
                {
                    text: "불안하고 어떻게 해야 할지 모르겠다.",
                    score: 1
                }
            ]
        },
        {
            q: "스트레스를 받으면 나는?",
            dimension: "mental",
            a: [
                {
                    text: "운동이나 취미로 빠르게 해소한다.",
                    score: 5
                },
                {
                    text: "시간이 좀 걸리지만 나름의 방법으로 풀어낸다.",
                    score: 3
                },
                {
                    text: "잠을 못 자거나 폭식/폭음을 하게 된다.",
                    score: 1
                }
            ]
        },
        {
            q: "미래에 대한 걱정을 얼마나 자주 하는가?",
            dimension: "mental",
            a: [
                {
                    text: "가끔 생각하지만 크게 불안하지 않다.",
                    score: 5
                },
                {
                    text: "자주 걱정되고 불안할 때가 많다.",
                    score: 1
                }
            ]
        },
        {
            q: "누군가에게 거절당했을 때?",
            dimension: "mental",
            a: [
                {
                    text: "아쉽지만 다른 기회가 있겠지.",
                    score: 5
                },
                {
                    text: "내가 뭘 잘못했나? 한동안 마음이 무겁다.",
                    score: 1
                }
            ]
        },
        {
            q: "중요한 결정을 앞두고 있을 때?",
            dimension: "mental",
            a: [
                {
                    text: "충분히 고민하고 결정하면 후회하지 않는다.",
                    score: 5
                },
                {
                    text: "결정 후에도 계속 다른 선택이 나았을까 고민한다.",
                    score: 1
                }
            ]
        }
        ,
        {
            q: "열심히 준비한 일이 결과가 안 좋았을 때?",
            dimension: "mental",
            a: [
                { text: "다음엔 더 잘하면 돼. 피드백 삼아 넘긴다.", score: 5 },
                { text: "한동안 무기력하고 자책하게 된다.", score: 1 }
            ]
        },
        {
            q: "해외여행에서 길을 잃었을 때?",
            dimension: "adventure",
            a: [
                { text: "오히려 좋아! 예상 못한 장소를 탐험한다.", score: 5 },
                { text: "불안해서 빨리 원래 경로로 돌아가려 한다.", score: 1 }
            ]
        }],
    resultLabels: [
        {
            name: "에너자이저",
            emoji: "⚡",
            desc: "어디서든 분위기를 띄우는 인싸 중의 인싸!",
            condition: {
                inssa: "high",
                adventure: "high",
                empathy: "high"
            },
            interpretation: "당신은 에너지가 넘치고 사람들과 함께할 때 빛나는 타입입니다. 새로운 경험을 두려워하지 않고, 주변 사람들의 감정을 잘 읽어 분위기를 이끕니다.",
            guide: "가끔은 혼자만의 시간을 가지며 에너지를 재충전하세요. 너무 많은 관계에 에너지를 쏟다 보면 정작 자신을 돌보지 못할 수 있어요.",
            mood: "excited",
            color: "bg-yellow-100"
        },
        {
            name: "전략가",
            emoji: "🎯",
            desc: "계획적이고 논리적인 마스터마인드",
            condition: {
                inssa: "low",
                plan: "high",
                empathy: "low"
            },
            interpretation: "당신은 독립적이고 분석적인 사고를 가진 전략가입니다. 혼자만의 시간을 통해 깊이 있는 생각을 하고, 체계적으로 목표를 달성해 나갑니다.",
            guide: "때로는 논리보다 감정을 우선시해보세요. 주변 사람들의 마음을 헤아리는 연습이 관계를 더욱 풍요롭게 만들 거예요.",
            mood: "cool",
            color: "bg-indigo-100"
        },
        {
            name: "힐러",
            emoji: "💚",
            desc: "따뜻한 마음으로 모두를 치유하는 공감왕",
            condition: {
                empathy: "high",
                mental: "high",
                inssa: "medium"
            },
            interpretation: "당신은 타인의 감정에 깊이 공감하고 따뜻하게 위로할 줄 아는 사람입니다. 안정적인 정서를 바탕으로 주변에 편안함을 선사합니다.",
            guide: "다른 사람을 돌보느라 자신의 감정을 무시하지 마세요. 당신의 마음도 충분히 돌봄받을 자격이 있어요.",
            mood: "happy",
            color: "bg-green-100"
        },
        {
            name: "모험가",
            emoji: "🚀",
            desc: "새로운 것을 찾아 떠나는 탐험가",
            condition: {
                adventure: "high",
                plan: "low",
                mental: "high"
            },
            interpretation: "당신은 틀에 박힌 것을 싫어하고 항상 새로운 가능성을 탐색하는 자유로운 영혼입니다. 변화를 두려워하지 않고 도전을 즐깁니다.",
            guide: "가끔은 계획을 세워보는 것도 좋아요. 모험도 좋지만, 안정적인 기반이 더 큰 도전을 가능하게 합니다.",
            mood: "excited",
            color: "bg-orange-100"
        },
        {
            name: "수호자",
            emoji: "🛡️",
            desc: "묵묵히 곁을 지키는 든든한 버팀목",
            condition: {
                plan: "high",
                empathy: "high",
                inssa: "low"
            },
            interpretation: "당신은 조용하지만 깊은 책임감과 배려심을 가진 사람입니다. 가까운 사람들을 위해 헌신하며, 신뢰할 수 있는 존재로 인정받습니다.",
            guide: "자신의 욕구와 감정도 중요하게 여기세요. 항상 남을 위해 희생하기보다 때로는 자신을 위한 시간을 가지세요.",
            mood: "happy",
            color: "bg-pink-100"
        },
        {
            name: "몽상가",
            emoji: "🌙",
            desc: "상상의 나래를 펼치는 로맨티스트",
            condition: {
                adventure: "high",
                empathy: "high",
                inssa: "low"
            },
            interpretation: "당신은 풍부한 상상력과 깊은 감성을 가진 낭만주의자입니다. 내면의 세계가 풍요롭고, 예술적 감각이 뛰어납니다.",
            guide: "가끔은 현실에도 발을 딛고 서세요. 아름다운 상상을 현실로 만들어가는 과정도 즐거울 거예요.",
            mood: "sad",
            color: "bg-purple-100"
        },
        {
            name: "리더",
            emoji: "👑",
            desc: "앞장서서 이끄는 카리스마 대장",
            condition: {
                inssa: "high",
                plan: "high",
                mental: "high"
            },
            interpretation: "당신은 사람들 앞에서 빛나며, 체계적으로 목표를 향해 나아가는 타고난 리더입니다. 흔들리지 않는 멘탈로 팀을 이끕니다.",
            guide: "모든 것을 혼자 책임지려 하지 마세요. 때로는 다른 사람에게 맡기고 신뢰하는 법을 배워보세요.",
            mood: "cool",
            color: "bg-blue-200"
        },
        {
            name: "예술가",
            emoji: "🎨",
            desc: "감성과 창의력이 넘치는 자유로운 영혼",
            condition: {
                adventure: "high",
                empathy: "high",
                plan: "low"
            },
            interpretation: "당신은 틀에 얽매이지 않는 자유로운 사고와 풍부한 감성을 지닌 예술가 타입입니다. 독창적인 시각으로 세상을 바라봅니다.",
            guide: "현실적인 부분도 조금씩 챙겨보세요. 예술적 영감을 실현하려면 기본적인 토대가 필요합니다.",
            mood: "happy",
            color: "bg-yellow-100"
        },
        {
            name: "분석가",
            emoji: "🔬",
            desc: "날카로운 논리로 모든 것을 파헤치는 탐구자",
            condition: {
                adventure: "high",
                empathy: "low",
                inssa: "low"
            },
            interpretation: "당신은 지적 호기심이 왕성하고 논리적 분석을 즐기는 탐구자입니다. 깊이 있는 사고로 문제의 본질을 꿰뚫어 봅니다.",
            guide: "사람들과의 교류도 새로운 아이디어의 원천이 될 수 있어요. 가끔은 머리보다 마음으로 소통해보세요.",
            mood: "cool",
            color: "bg-blue-100"
        },
        {
            name: "중재자",
            emoji: "☮️",
            desc: "갈등을 해결하고 화합을 이끄는 평화주의자",
            condition: {
                empathy: "high",
                inssa: "medium",
                mental: "high"
            },
            interpretation: "당신은 다양한 입장을 이해하고 조율할 줄 아는 중재자입니다. 평화로운 분위기를 만들고 모두가 만족하는 해결책을 찾습니다.",
            guide: "자신의 의견도 확실히 표현하세요. 항상 중립을 지키다 보면 정작 자신이 원하는 것을 놓칠 수 있어요.",
            mood: "happy",
            color: "bg-green-100"
        },
        {
            name: "실행가",
            emoji: "⚙️",
            desc: "말보다 행동으로 보여주는 실천파",
            condition: {
                plan: "high",
                inssa: "medium",
                adventure: "low"
            },
            interpretation: "당신은 계획을 세우면 반드시 실행하는 행동파입니다. 현실적이고 효율적인 방법으로 목표를 달성해 나갑니다.",
            guide: "가끔은 새로운 방법도 시도해보세요. 익숙한 것만 고집하면 더 좋은 기회를 놓칠 수 있어요.",
            mood: "cool",
            color: "bg-gray-100"
        },
        {
            name: "엔터테이너",
            emoji: "🎭",
            desc: "주목받는 것을 즐기는 무대 위의 스타",
            condition: {
                inssa: "high",
                empathy: "medium",
                plan: "low"
            },
            interpretation: "당신은 사람들 앞에서 빛나는 것을 즐기고, 즉흥적인 상황에서도 재치있게 대처하는 엔터테이너입니다.",
            guide: "관심받지 못할 때도 자신의 가치를 인정하세요. 무대 아래에서도 당신은 충분히 특별합니다.",
            mood: "excited",
            color: "bg-orange-100"
        },
        {
            name: "현실주의자",
            emoji: "📊",
            desc: "발 딛고 있는 현실에 충실한 실용주의자",
            condition: {
                adventure: "low",
                plan: "high",
                empathy: "low"
            },
            interpretation: "당신은 현실적이고 실용적인 사고를 가진 사람입니다. 확실한 것을 선호하고, 안정적인 방법으로 목표를 이룹니다.",
            guide: "가끔은 상상의 나래를 펼쳐보세요. 틀을 벗어난 생각이 새로운 가능성을 열어줄 거예요.",
            mood: "cool",
            color: "bg-blue-100"
        },
        {
            name: "조력자",
            emoji: "🤝",
            desc: "누구에게나 손을 내미는 따뜻한 사람",
            condition: {
                inssa: "high",
                empathy: "high",
                plan: "medium"
            },
            interpretation: "당신은 사람들과 어울리는 것을 좋아하고, 누군가를 돕는 것에서 기쁨을 느끼는 따뜻한 사람입니다.",
            guide: "자신의 한계를 인정하세요. 모든 사람을 도울 수는 없어요. 자신을 먼저 돌보는 것도 중요합니다.",
            mood: "happy",
            color: "bg-pink-100"
        },
        {
            name: "철학자",
            emoji: "📚",
            desc: "깊은 생각에 잠기는 사색가",
            condition: {
                adventure: "high",
                inssa: "low",
                empathy: "medium"
            },
            interpretation: "당신은 세상의 깊은 의미를 탐구하는 사색가입니다. 혼자만의 시간을 통해 통찰력 있는 생각을 발전시킵니다.",
            guide: "생각을 행동으로 옮기는 연습을 해보세요. 머릿속 아이디어를 현실로 만들 때 진정한 성취감을 느낄 거예요.",
            mood: "sad",
            color: "bg-purple-100"
        },
        {
            name: "균형잡힌 사람",
            emoji: "⚖️",
            desc: "모든 면에서 조화를 이루는 밸런스 마스터",
            condition: {
                inssa: "medium",
                adventure: "medium",
                empathy: "medium",
                plan: "medium",
                mental: "medium"
            },
            interpretation: "당신은 모든 면에서 균형 잡힌 성격을 가지고 있습니다. 상황에 따라 유연하게 대처하며, 극단적이지 않은 안정감이 있습니다.",
            guide: "때로는 어느 한 방향으로 깊이 파고들어 보세요. 균형도 좋지만 열정적으로 몰입하는 경험도 소중합니다.",
            mood: "happy",
            color: "bg-gray-100"
        }
    ]
};

if (typeof window !== 'undefined') {
  window.CHEMI_SUBJECTS = window.CHEMI_SUBJECTS || {};
  window.CHEMI_SUBJECTS.human = HUMAN_DATA;
}
