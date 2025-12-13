// dog 테스트 데이터
// 생성일: 2025-12-11

export const DOG_DATA = {
    title: "댕심 테스트",
    subtitle: "우리 멍이의 진짜 성격은?",
    themeColor: "bg-[#FFC95F]",
    icon: "DogFace",
    dimensions: {
        energy: {
            name: "활력",
            emoji: "⚡",
            desc: "에너지 수준과 활동성"
        },
        humanLove: {
            name: "인간사랑",
            emoji: "❤️",
            desc: "사람에 대한 친화력"
        },
        dogFriend: {
            name: "동료애",
            emoji: "🐕",
            desc: "다른 강아지와의 사회성"
        },
        focus: {
            name: "집중력",
            emoji: "🎯",
            desc: "훈련 가능성과 주의력"
        },
        brave: {
            name: "용감함",
            emoji: "🦁",
            desc: "두려움에 대한 반응"
        },
        persist: {
            name: "끈기",
            emoji: "💪",
            desc: "목표를 향한 집념"
        }
    },
    questions: [
        {
            q: "산책 중 다른 강아지를 만났을 때?",
            dimension: "dogFriend",
            a: [
                {
                    text: "안녕! 꼬리 흔들며 격하게 인사한다.",
                    score: 5
                },
                {
                    text: "보호자 뒤로 숨거나 못 본 척 지나간다.",
                    score: 1
                }
            ]
        },
        {
            q: "애견 카페에 갔을 때?",
            dimension: "dogFriend",
            a: [
                {
                    text: "우다다! 친구들과 어울려 뛰어논다.",
                    score: 5
                },
                {
                    text: "내 무릎 위나 의자 밑에만 있는다.",
                    score: 1
                }
            ]
        },
        {
            q: "집에 손님이 왔을 때?",
            dimension: "humanLove",
            a: [
                {
                    text: "누구세요! 짖으면서도 꼬리는 흔든다.",
                    score: 5
                },
                {
                    text: "방에 들어가서 나올 생각을 안 한다.",
                    score: 1
                }
            ]
        },
        {
            q: "산책할 때 나는?",
            dimension: "focus",
            a: [
                {
                    text: "땅바닥 냄새 맡느라 앞으로 못 간다.",
                    score: 5
                },
                {
                    text: "나비나 새를 쫓아다니느라 정신없다.",
                    score: 1
                }
            ]
        },
        {
            q: "간식을 숨겨놨을 때?",
            dimension: "focus",
            a: [
                {
                    text: "킁킁! 냄새를 따라 정확히 찾아낸다.",
                    score: 5
                },
                {
                    text: "어디 있지? 엉뚱한 곳을 파거나 짖는다.",
                    score: 1
                }
            ]
        },
        {
            q: "보호자가 옷을 입을 때?",
            dimension: "focus",
            a: [
                {
                    text: "산책 가는 옷인지 출근복인지 귀신같이 안다.",
                    score: 5
                },
                {
                    text: "옷만 입으면 무조건 나가는 줄 알고 신난다.",
                    score: 1
                }
            ]
        },
        {
            q: "혼났을 때 반응은?",
            dimension: "brave",
            a: [
                {
                    text: "뭐가 문젠데? 억울하다는 듯 쳐다본다.",
                    score: 5
                },
                {
                    text: "잘못했어요... 배를 보이며 납작 엎드린다.",
                    score: 1
                }
            ]
        },
        {
            q: "보호자가 울고 있을 때?",
            dimension: "humanLove",
            a: [
                {
                    text: "옆에 가만히 앉아서 지켜본다.",
                    score: 1
                },
                {
                    text: "얼굴을 핥고 안절부절못한다.",
                    score: 5
                }
            ]
        },
        {
            q: "다른 강아지가 으르렁거릴 때?",
            dimension: "brave",
            a: [
                {
                    text: "같이 으르렁! 지지 않는다.",
                    score: 5
                },
                {
                    text: "깨갱... 꼬리를 내리고 피한다.",
                    score: 1
                }
            ]
        },
        {
            q: "산책 코스는?",
            dimension: "persist",
            a: [
                {
                    text: "항상 가던 길로 가야 마음이 편하다.",
                    score: 5
                },
                {
                    text: "오늘은 저쪽이다! 발길 닿는 대로 간다.",
                    score: 1
                }
            ]
        },
        {
            q: "배변 습관은?",
            dimension: "focus",
            a: [
                {
                    text: "배변 패드 정중앙에 정확히 싼다.",
                    score: 5
                },
                {
                    text: "가끔 모서리에 싸거나 실수를 한다.",
                    score: 1
                }
            ]
        },
        {
            q: "기다려 훈련을 할 때?",
            dimension: "persist",
            a: [
                {
                    text: "먹으라고 할 때까지 침 흘리며 참는다.",
                    score: 5
                },
                {
                    text: "못 참아! 눈치 보며 슬금슬금 먹는다.",
                    score: 1
                }
            ]
        }
        ,
        {
            q: "아침에 일어났을 때?",
            dimension: "energy",
            a: [
                {
                    text: "세상 밖으로! 신나게 뛰어다니며 아침을 시작한다.",
                    score: 5
                },
                {
                    text: "아직 졸려... 늘어지게 기지개만 켠다.",
                    score: 1
                }
            ]
        },
        {
            q: "집에서 보내는 시간은?",
            dimension: "energy",
            a: [
                {
                    text: "장난감 물고 뛰어다니며 혼자 논다.",
                    score: 5
                },
                {
                    text: "창가에서 멍하니 바깥을 구경한다.",
                    score: 1
                }
            ]
        }],
    questions_deep: [
        {
            q: "엘리베이터에서 이웃을 만났을 때?",
            dimension: "humanLove",
            a: [
                {
                    text: "반갑다고 꼬리 치며 다가가려 한다.",
                    score: 5
                },
                {
                    text: "구석에 얌전히 앉아 있는다.",
                    score: 1
                }
            ]
        },
        {
            q: "놀아달라고 할 때?",
            dimension: "humanLove",
            a: [
                {
                    text: "장난감을 물고 와서 무릎에 툭 던진다.",
                    score: 5
                },
                {
                    text: "그윽한 눈빛으로 쳐다보며 텔레파시를 보낸다.",
                    score: 1
                }
            ]
        },
        {
            q: "TV에서 동물 소리가 날 때?",
            dimension: "energy",
            a: [
                {
                    text: "같이 짖거나 TV 앞으로 달려간다.",
                    score: 5
                },
                {
                    text: "별 관심 없이 잠만 잔다.",
                    score: 1
                }
            ]
        },
        {
            q: "가족들이 다 모여 있을 때?",
            dimension: "humanLove",
            a: [
                {
                    text: "그 한가운데 자리를 잡고 눕는다.",
                    score: 5
                },
                {
                    text: "조용한 방이나 자기 집으로 들어간다.",
                    score: 1
                }
            ]
        },
        {
            q: "처음 보는 강아지에게?",
            dimension: "dogFriend",
            a: [
                {
                    text: "놀자! 엉덩이를 들고 플레이 바우를 한다.",
                    score: 5
                },
                {
                    text: "냄새만 살짝 맡고 내 갈 길 간다.",
                    score: 1
                }
            ]
        },
        {
            q: "미용실에 갔을 때?",
            dimension: "brave",
            a: [
                {
                    text: "미용사 선생님이랑 노느라 바쁘다.",
                    score: 5
                },
                {
                    text: "잔뜩 긴장해서 얼음이 된다.",
                    score: 1
                }
            ]
        },
        {
            q: "거울 속의 자신을 볼 때?",
            dimension: "focus",
            a: [
                {
                    text: "그냥 나네. (냄새가 안 나니까 무시)",
                    score: 5
                },
                {
                    text: "누구냐 넌! 짖거나 뒤를 찾아본다.",
                    score: 1
                }
            ]
        },
        {
            q: "산책 중 낙엽이 굴러갈 때?",
            dimension: "energy",
            a: [
                {
                    text: "바스락 소리에 귀를 쫑긋한다.",
                    score: 1
                },
                {
                    text: "살아있는 생물인 줄 알고 사냥하려 든다.",
                    score: 5
                }
            ]
        },
        {
            q: "보호자의 표정 변화를?",
            dimension: "focus",
            a: [
                {
                    text: "목소리 톤이나 행동으로 기분을 파악한다.",
                    score: 1
                },
                {
                    text: "눈빛만 봐도 기분을 귀신같이 알아챈다.",
                    score: 5
                }
            ]
        },
        {
            q: "장난감을 고를 때?",
            dimension: "energy",
            a: [
                {
                    text: "익숙한 공이나 인형을 선호한다.",
                    score: 1
                },
                {
                    text: "소리가 나거나 움직이는 신기한 걸 좋아한다.",
                    score: 5
                }
            ]
        },
        {
            q: "간식 줄까? 말만 했을 때?",
            dimension: "focus",
            a: [
                {
                    text: "진짜 줄 때까지 기다린다.",
                    score: 1
                },
                {
                    text: "이미 침 흘리며 앉아 있다.",
                    score: 5
                }
            ]
        },
        {
            q: "자다가 꿈을 꿀 때?",
            dimension: "energy",
            a: [
                {
                    text: "가끔 움찔거리는 정도다.",
                    score: 1
                },
                {
                    text: "달리기하고 짖고 난리가 난다.",
                    score: 5
                }
            ]
        },
        {
            q: "간식을 공평하게 나눠주지 않았을 때?",
            dimension: "brave",
            a: [
                {
                    text: "내 밥그릇을 지키려고 으르렁댄다.",
                    score: 5
                },
                {
                    text: "시무룩해져서 구석으로 간다.",
                    score: 1
                }
            ]
        },
        {
            q: "발을 밟혔을 때?",
            dimension: "brave",
            a: [
                {
                    text: "깨갱! 하고 자리를 피한다.",
                    score: 5
                },
                {
                    text: "아파 ㅠㅠ 안아달라고 매달린다.",
                    score: 1
                }
            ]
        },
        {
            q: "목욕하기 싫을 때?",
            dimension: "brave",
            a: [
                {
                    text: "버티기! 힘으로 저항한다.",
                    score: 5
                },
                {
                    text: "불쌍한 표정으로 호소한다.",
                    score: 1
                }
            ]
        },
        {
            q: "칭찬받았을 때?",
            dimension: "humanLove",
            a: [
                {
                    text: "당당하게 간식을 요구한다.",
                    score: 1
                },
                {
                    text: "온몸으로 기쁨을 표현하며 날뛴다.",
                    score: 5
                }
            ]
        },
        {
            q: "보호자가 아픈 척 쓰러지면?",
            dimension: "humanLove",
            a: [
                {
                    text: "뭐해? 툭툭 건드려 본다.",
                    score: 1
                },
                {
                    text: "큰일 났다! 핥고 짖고 난리 난다.",
                    score: 5
                }
            ]
        },
        {
            q: "서열 정리가 필요할 때?",
            dimension: "brave",
            a: [
                {
                    text: "내가 이 구역의 짱이다. 기싸움한다.",
                    score: 5
                },
                {
                    text: "평화가 좋아. 바로 배를 보인다.",
                    score: 1
                }
            ]
        },
        {
            q: "산책 시간 알림?",
            dimension: "persist",
            a: [
                {
                    text: "시간 되면 줄을 물고 온다.",
                    score: 5
                },
                {
                    text: "나가자고 할 때까지 기다린다.",
                    score: 1
                }
            ]
        },
        {
            q: "잠자리 위치?",
            dimension: "persist",
            a: [
                {
                    text: "내 방석, 내 집. 정해진 곳에서만 잔다.",
                    score: 5
                },
                {
                    text: "소파, 침대, 바닥... 시원한 곳 찾아다닌다.",
                    score: 1
                }
            ]
        },
        {
            q: "밥 먹는 속도?",
            dimension: "energy",
            a: [
                {
                    text: "꼭꼭 씹어서 일정하게 먹는다.",
                    score: 1
                },
                {
                    text: "숨도 안 쉬고 흡입한다.",
                    score: 5
                }
            ]
        },
        {
            q: "새로운 개인기를 배울 때?",
            dimension: "focus",
            a: [
                {
                    text: "반복하면 금방 배운다.",
                    score: 5
                },
                {
                    text: "집중력이 짧아서 금방 딴짓한다.",
                    score: 1
                }
            ]
        },
        {
            q: "산책 중 갈림길에서?",
            dimension: "persist",
            a: [
                {
                    text: "보호자가 이끄는 대로 잘 따라간다.",
                    score: 1
                },
                {
                    text: "내가 가고 싶은 길로 가려고 고집 부린다.",
                    score: 5
                }
            ]
        },
        {
            q: "장난감 정리?",
            dimension: "focus",
            a: [
                {
                    text: "자기 집에 물어다 놓는다. (천재견?)",
                    score: 5
                },
                {
                    text: "온 집안에 흩뿌려 놓는다.",
                    score: 1
                }
            ]
        }
        ,
        {
            q: "강아지 유치원이나 훈련소에서?",
            dimension: "dogFriend",
            a: [
                {
                    text: "다른 강아지들과 잘 어울리며 즐거워한다.",
                    score: 5
                },
                {
                    text: "구석에서 혼자 있거나 사람만 찾는다.",
                    score: 1
                }
            ]
        },
        {
            q: "동네 단골 강아지 친구를 만났을 때?",
            dimension: "dogFriend",
            a: [
                { text: "오랜만이야! 격하게 반기며 놀자고 한다.", score: 5 },
                { text: "아는 사이지만 시큰둥하게 지나친다.", score: 1 }
            ]
        },
        {
            q: "강아지 놀이터에서?",
            dimension: "dogFriend",
            a: [
                { text: "모든 강아지와 어울리며 신나게 논다.", score: 5 },
                { text: "보호자 곁에만 있으려 한다.", score: 1 }
            ]
        },
        {
            q: "집에 다른 강아지가 놀러 왔을 때?",
            dimension: "dogFriend",
            a: [
                { text: "환영해! 장난감 가져와서 같이 놀자고 한다.", score: 5 },
                { text: "내 영역이야! 으르렁거린다.", score: 1 }
            ]
        },
        {
            q: "다른 강아지가 먼저 다가올 때?",
            dimension: "dogFriend",
            a: [
                { text: "반가워! 코 인사하며 친해진다.", score: 5 },
                { text: "불편해... 피하려 한다.", score: 1 }
            ]
        },
        {
            q: "좋아하는 장난감이 소파 밑에 들어갔을 때?",
            dimension: "persist",
            a: [
                { text: "절대 포기 안 해! 계속 파고든다.", score: 5 },
                { text: "아쉽지만... 다른 장난감을 찾는다.", score: 1 }
            ]
        },
        {
            q: "보호자가 '안 돼'라고 했는데 하고 싶을 때?",
            dimension: "persist",
            a: [
                { text: "끈질기게 눈치 보며 재시도한다.", score: 5 },
                { text: "알겠어... 순순히 포기한다.", score: 1 }
            ]
        },
        {
            q: "산책 중 가고 싶은 곳이 있을 때?",
            dimension: "persist",
            a: [
                { text: "줄을 당기며 그쪽으로 가려 한다.", score: 5 },
                { text: "보호자 리드에 따른다.", score: 1 }
            ]
        },
        {
            q: "비 오는 날 산책을 못 갈 때?",
            dimension: "energy",
            a: [
                { text: "에너지 폭발! 집안에서 뛰어다닌다.", score: 5 },
                { text: "오늘은 쉬는 날~ 잠만 잔다.", score: 1 }
            ]
        },
        {
            q: "보호자가 외출 준비를 할 때?",
            dimension: "humanLove",
            a: [
                { text: "안 돼! 현관문 앞에서 애절한 눈빛.", score: 5 },
                { text: "갔다 와~ 자기 자리로 간다.", score: 1 }
            ]
        },
        {
            q: "우산 펴는 소리를 들었을 때?",
            dimension: "brave",
            a: [
                { text: "뭐야? 다가가서 확인한다.", score: 5 },
                { text: "무서워! 뒤로 물러난다.", score: 1 }
            ]
        }],
    resultLabels: [
        {
            name: "에너자이저 멍멍이",
            emoji: "⚡",
            desc: "지치지 않는 무한 에너지의 소유자!",
            condition: {
                energy: "high",
                humanLove: "high",
                dogFriend: "high"
            },
            interpretation: "에너지가 넘치고 사람과 다른 강아지 모두를 좋아하는 활발한 성격입니다. 어디서든 인기쟁이가 됩니다.",
            guide: "충분한 운동과 놀이 시간이 필수입니다. 에너지를 발산할 기회가 없으면 문제 행동으로 이어질 수 있어요.",
            mood: "excited",
            color: "bg-yellow-100"
        },
        {
            name: "집사바라기 멍멍이",
            emoji: "❤️",
            desc: "보호자가 세상의 전부인 충견!",
            condition: {
                humanLove: "high",
                brave: "medium",
                dogFriend: "low"
            },
            interpretation: "보호자에 대한 애정이 깊고 충성스러운 성격입니다. 분리불안이 있을 수 있으니 주의가 필요합니다.",
            guide: "혼자 있는 시간을 조금씩 늘려가며 독립심을 키워주세요. 충분한 애정 표현도 잊지 마세요.",
            mood: "happy",
            color: "bg-pink-100"
        },
        {
            name: "리더 멍멍이",
            emoji: "👑",
            desc: "무리를 이끄는 타고난 리더!",
            condition: {
                brave: "high",
                persist: "high",
                energy: "high"
            },
            interpretation: "용감하고 끈기 있는 리더 타입입니다. 자신감이 넘치고 목표를 향해 돌진합니다.",
            guide: "일관된 훈련과 명확한 규칙이 필요합니다. 리더십을 인정하되, 보호자가 진정한 리더임을 알려주세요.",
            mood: "cool",
            color: "bg-indigo-100"
        },
        {
            name: "천재 멍멍이",
            emoji: "🧠",
            desc: "한 번 보면 다 기억하는 똑똑이!",
            condition: {
                focus: "high",
                persist: "high",
                energy: "medium"
            },
            interpretation: "집중력과 학습 능력이 뛰어난 영리한 강아지입니다. 복잡한 훈련도 금방 습득합니다.",
            guide: "두뇌를 자극하는 퍼즐 장난감이나 고급 훈련을 제공해주세요. 지루해하면 스스로 놀이를 만들어낼 수 있어요.",
            mood: "cool",
            color: "bg-blue-100"
        },
        {
            name: "겁쟁이 멍멍이",
            emoji: "🐾",
            desc: "세상이 무서워... 보호자만 믿어요.",
            condition: {
                brave: "low",
                humanLove: "high",
                energy: "low"
            },
            interpretation: "겁이 많고 소심한 성격이지만, 보호자에 대한 신뢰는 깊습니다. 안전한 환경에서 편안해합니다.",
            guide: "무서운 상황에 천천히 노출시키며 자신감을 키워주세요. 절대 겁을 주거나 강요하지 마세요.",
            mood: "sad",
            color: "bg-purple-100"
        },
        {
            name: "파티 멍멍이",
            emoji: "🎉",
            desc: "어디서든 분위기 메이커!",
            condition: {
                energy: "high",
                dogFriend: "high",
                humanLove: "high"
            },
            interpretation: "사교적이고 활발한 파티 동물입니다. 사람과 강아지 모두와 잘 어울립니다.",
            guide: "사회화 기회를 많이 제공해주세요. 애견 카페나 강아지 친구들과의 만남을 정기적으로 가져보세요.",
            mood: "excited",
            color: "bg-orange-100"
        },
        {
            name: "고집쟁이 멍멍이",
            emoji: "🐂",
            desc: "내 방식대로 할 거야!",
            condition: {
                persist: "high",
                brave: "high",
                focus: "low"
            },
            interpretation: "고집이 세고 자기 주장이 강한 성격입니다. 한번 마음먹으면 꺾이지 않습니다.",
            guide: "인내심을 가지고 훈련해주세요. 강압적인 방법보다는 긍정 강화 훈련이 효과적입니다.",
            mood: "cool",
            color: "bg-red-100"
        },
        {
            name: "느긋이 멍멍이",
            emoji: "😴",
            desc: "급할 거 뭐 있어? 천천히~",
            condition: {
                energy: "low",
                persist: "low",
                brave: "medium"
            },
            interpretation: "여유롭고 느긋한 성격입니다. 스트레스를 잘 받지 않고 어떤 환경에서도 적응합니다.",
            guide: "적당한 운동은 필요하지만 무리하게 활동을 강요하지 마세요. 편안한 환경을 유지해주세요.",
            mood: "happy",
            color: "bg-green-100"
        },
        {
            name: "수호자 멍멍이",
            emoji: "🛡️",
            desc: "가족을 지키는 든든한 보디가드!",
            condition: {
                brave: "high",
                humanLove: "high",
                focus: "high"
            },
            interpretation: "가족에 대한 보호 본능이 강하고 충성스러운 수호자입니다. 경계심이 있지만 훈련으로 조절 가능합니다.",
            guide: "사회화 훈련을 통해 위협과 일상을 구분하게 해주세요. 과한 경계는 스트레스가 될 수 있어요.",
            mood: "cool",
            color: "bg-blue-200"
        },
        {
            name: "균형 멍멍이",
            emoji: "⚖️",
            desc: "모든 면에서 조화로운 이상적인 반려견",
            condition: {
                energy: "medium",
                humanLove: "medium",
                dogFriend: "medium",
                focus: "medium",
                brave: "medium",
                persist: "medium"
            },
            interpretation: "모든 면에서 균형 잡힌 이상적인 성격입니다. 어떤 환경에서도 잘 적응하고 훈련하기 좋습니다.",
            guide: "다양한 경험과 훈련을 제공해주세요. 특별한 주의사항 없이 행복한 반려 생활이 가능합니다.",
            mood: "happy",
            color: "bg-gray-100"
        }
    ]
};

window.CHEMI_SUBJECTS = window.CHEMI_SUBJECTS || {};
window.CHEMI_SUBJECTS.dog = DOG_DATA;
