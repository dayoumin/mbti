// cat 테스트 데이터
// 생성일: 2025-12-11

const CAT_DATA = {
        title: "냥심 테스트",
        subtitle: "우리 냥이의 진짜 성격은?",
        themeColor: "bg-[#FFD1DC]",
        icon: "CatFace",
        dimensions: {
            curious: {
                name: "호기심",
                emoji: "🔍",
                desc: "새로운 것에 대한 탐구심"
            },
            alert: {
                name: "경계심",
                emoji: "👀",
                desc: "환경에 대한 민감도"
            },
            boss: {
                name: "보스기질",
                emoji: "👑",
                desc: "독립성과 지배력"
            },
            random: {
                name: "엉뚱함",
                emoji: "🎲",
                desc: "예측불가한 행동 패턴"
            },
            cute: {
                name: "애교력",
                emoji: "🥰",
                desc: "친밀감과 사회성"
            }
        },
        questions: [
            {
                q: "집사가 화장실에 들어갔다. 문이 닫히면?",
                dimension: "cute",
                a: [
                    {
                        text: "문 앞에서 야옹거리거나 앞발을 넣는다.",
                        score: 5
                    },
                    {
                        text: "나올 때까지 조용히 기다리거나 내 할 일 한다.",
                        score: 1
                    }
                ]
            },
            {
                q: "집에 낯선 손님이 찾아왔을 때?",
                dimension: "alert",
                a: [
                    {
                        text: "누구냐옹? 먼저 다가가서 냄새를 맡는다.",
                        score: 1
                    },
                    {
                        text: "후다닥! 침대 밑이나 높은 곳으로 숨는다.",
                        score: 5
                    }
                ]
            },
            {
                q: "집사가 장난감을 흔들 때?",
                dimension: "curious",
                a: [
                    {
                        text: "우다다다! 바로 달려들어 사냥한다.",
                        score: 5
                    },
                    {
                        text: "누워서 발만 까딱까딱... 귀찮다옹.",
                        score: 1
                    }
                ]
            },
            {
                q: "창밖을 구경할 때 나는?",
                dimension: "curious",
                a: [
                    {
                        text: "지나가는 새, 벌레를 보며 채터링(깍깍)을 한다.",
                        score: 5
                    },
                    {
                        text: "그냥 멍하니 풍경을 바라보며 사색에 잠긴다.",
                        score: 1
                    }
                ]
            },
            {
                q: "새로운 박스가 생겼다면?",
                dimension: "curious",
                a: [
                    {
                        text: "일단 들어가서 사이즈가 맞는지 확인한다.",
                        score: 1
                    },
                    {
                        text: "이건 우주선이다옹! 상상하며 뜯고 맛본다.",
                        score: 5
                    }
                ]
            },
            {
                q: "사냥 놀이를 할 때?",
                dimension: "curious",
                a: [
                    {
                        text: "눈앞에 보이는 장난감만 쫓는다.",
                        score: 1
                    },
                    {
                        text: "장난감이 숨을 곳을 미리 예측하고 매복한다.",
                        score: 5
                    }
                ]
            },
            {
                q: "집사가 슬퍼서 울고 있을 때?",
                dimension: "boss",
                a: [
                    {
                        text: "배고프다옹. 밥그릇을 툭툭 친다.",
                        score: 5
                    },
                    {
                        text: "왜 그러냐옹... 조용히 다가와서 눈물을 핥아준다.",
                        score: 1
                    }
                ]
            },
            {
                q: "집사에게 혼났을 때?",
                dimension: "boss",
                a: [
                    {
                        text: "흥! 꼬리를 홱 돌리고 무시한다.",
                        score: 5
                    },
                    {
                        text: "마징가 귀를 하고 눈치를 본다.",
                        score: 1
                    }
                ]
            },
            {
                q: "간식을 줄 때 집사의 손가락까지 깨물었다면?",
                dimension: "boss",
                a: [
                    {
                        text: "맛있는 냄새가 나서 그랬다옹. (당당)",
                        score: 5
                    },
                    {
                        text: "아팠냐옹? 미안해서 핥아준다.",
                        score: 1
                    }
                ]
            },
            {
                q: "밥 먹을 시간이 되었을 때?",
                dimension: "random",
                a: [
                    {
                        text: "정확한 시간에 야옹! 밥 내놔라옹!",
                        score: 1
                    },
                    {
                        text: "자다가 생각나면 가서 먹는다.",
                        score: 5
                    }
                ]
            },
            {
                q: "화장실을 사용할 때?",
                dimension: "random",
                a: [
                    {
                        text: "모래를 꼼꼼하게 덮어서 흔적을 없앤다.",
                        score: 1
                    },
                    {
                        text: "대충 덮거나 그냥 튀어 나간다.",
                        score: 5
                    }
                ]
            },
            {
                q: "잠자는 위치는?",
                dimension: "random",
                a: [
                    {
                        text: "항상 자는 지정석(캣타워, 집사 베개 등)이 있다.",
                        score: 1
                    },
                    {
                        text: "그때그때 기분 내키는 곳에서 잔다.",
                        score: 5
                    }
                ]
            }
        ,
            {
                q: "갑자기 큰 소리가 났을 때?",
                dimension: "alert",
                a: [
                    {
                        text: "화들짝! 높은 곳으로 대피한다.",
                        score: 5
                    },
                    {
                        text: "뭐지? 고개만 돌려서 확인한다.",
                        score: 1
                    }
                ]
            },
            {
                q: "쓰다듬어 줄 때?",
                dimension: "cute",
                a: [
                    {
                        text: "그르렁~ 몸을 맡기고 배를 보여준다.",
                        score: 5
                    },
                    {
                        text: "적당히 받다가 손을 물거나 피한다.",
                        score: 1
                    }
                ]
            }],
        questions_deep: [
            {
                q: "다른 고양이 친구를 만났을 때?",
                dimension: "cute",
                a: [
                    {
                        text: "반갑다옹! 코 인사를 시도한다.",
                        score: 5
                    },
                    {
                        text: "하악! 가까이 오지 마라옹!",
                        score: 1
                    }
                ]
            },
            {
                q: "집사가 이름을 불렀을 때?",
                dimension: "cute",
                a: [
                    {
                        text: "야옹~ 하고 대답하며 달려간다.",
                        score: 5
                    },
                    {
                        text: "귀만 쫑긋하고 못 들은 척한다.",
                        score: 1
                    }
                ]
            },
            {
                q: "집안에서 나의 활동 반경은?",
                dimension: "cute",
                a: [
                    {
                        text: "거실, 부엌, 안방... 온 집안을 누비고 다닌다.",
                        score: 5
                    },
                    {
                        text: "내 구역(캣타워, 숨숨집)에서 잘 안 나온다.",
                        score: 1
                    }
                ]
            },
            {
                q: "새로운 장난감을 사왔을 때?",
                dimension: "curious",
                a: [
                    {
                        text: "신상이다! 바로 관심을 보이며 가지고 논다.",
                        score: 5
                    },
                    {
                        text: "며칠 동안 냄새만 맡으며 탐색전을 벌인다.",
                        score: 1
                    }
                ]
            },
            {
                q: "집사가 외출하고 돌아왔을 때?",
                dimension: "cute",
                a: [
                    {
                        text: "현관까지 마중 나가서 다리에 몸을 비빈다.",
                        score: 5
                    },
                    {
                        text: "왔어? 자다가 눈만 한번 뜬다.",
                        score: 1
                    }
                ]
            },
            {
                q: "밤에 모두가 잠든 시간, 나는?",
                dimension: "random",
                a: [
                    {
                        text: "우다다 타임! 혼자서도 잘 논다.",
                        score: 5
                    },
                    {
                        text: "집사 옆에 붙어서 같이 잔다.",
                        score: 1
                    }
                ]
            },
            {
                q: "높은 곳(냉장고 위, 장롱 위)을 볼 때?",
                dimension: "curious",
                a: [
                    {
                        text: "올라갈 수 있을까? 각도를 계산해본다.",
                        score: 1
                    },
                    {
                        text: "저기는 정복해야 할 나의 성이다옹!",
                        score: 5
                    }
                ]
            },
            {
                q: "거울을 볼 때?",
                dimension: "curious",
                a: [
                    {
                        text: "그냥 나네. (무관심)",
                        score: 1
                    },
                    {
                        text: "저 녀석은 누구냐옹? 뒤에 누가 있나 확인한다.",
                        score: 5
                    }
                ]
            },
            {
                q: "벌레가 나타났다면?",
                dimension: "curious",
                a: [
                    {
                        text: "잡았다! 바로 앞발로 내리친다.",
                        score: 1
                    },
                    {
                        text: "저건 뭘까? 뚫어져라 관찰하며 채터링한다.",
                        score: 5
                    }
                ]
            },
            {
                q: "집사가 이상한 자세로 있을 때?",
                dimension: "curious",
                a: [
                    {
                        text: "뭐하냐옹? 냄새를 맡아본다.",
                        score: 1
                    },
                    {
                        text: "새로운 놀이인가? 같이 이상한 자세를 취한다.",
                        score: 5
                    }
                ]
            },
            {
                q: "간식 서랍을 열지도 않았는데 달려간다?",
                dimension: "alert",
                a: [
                    {
                        text: "봉지 부스럭거리는 소리를 들었다.",
                        score: 1
                    },
                    {
                        text: "집사의 기운이 간식을 줄 것 같았다.",
                        score: 5
                    }
                ]
            },
            {
                q: "TV에 새가 나올 때?",
                dimension: "curious",
                a: [
                    {
                        text: "저건 가짜다옹. 별 반응 없다.",
                        score: 1
                    },
                    {
                        text: "잡고 싶다옹! TV 화면을 긁는다.",
                        score: 5
                    }
                ]
            },
            {
                q: "집사가 아파서 누워있을 때?",
                dimension: "boss",
                a: [
                    {
                        text: "심심하다옹. 놀아달라고 깨운다.",
                        score: 5
                    },
                    {
                        text: "걱정된다옹. 옆에서 골골송으로 치유해준다.",
                        score: 1
                    }
                ]
            },
            {
                q: "발톱 깎을 때?",
                dimension: "boss",
                a: [
                    {
                        text: "이거 놓으라옹! (하악질/냥펀치)",
                        score: 5
                    },
                    {
                        text: "싫지만 츄르를 위해 참는다. (낑낑)",
                        score: 1
                    }
                ]
            },
            {
                q: "집사가 실수로 꼬리를 밟았다면?",
                dimension: "boss",
                a: [
                    {
                        text: "캬악! (바로 응징)",
                        score: 5
                    },
                    {
                        text: "야옹! (아프지만 도망가서 쳐다봄)",
                        score: 1
                    }
                ]
            },
            {
                q: "맛없는 간식을 줬을 때?",
                dimension: "boss",
                a: [
                    {
                        text: "냄새 맡고 홱 돌아서 가버린다.",
                        score: 5
                    },
                    {
                        text: "일단 먹는 시늉은 해준다.",
                        score: 1
                    }
                ]
            },
            {
                q: "집사가 뽀뽀하려고 다가올 때?",
                dimension: "cute",
                a: [
                    {
                        text: "앞발로 입을 막는다. (거절)",
                        score: 1
                    },
                    {
                        text: "눈을 감고 받아준다. (허락)",
                        score: 5
                    }
                ]
            },
            {
                q: "원하는 것을 요구할 때?",
                dimension: "boss",
                a: [
                    {
                        text: "물건을 떨어뜨리거나 긁어서 관심을 끈다.",
                        score: 5
                    },
                    {
                        text: "애처로운 눈빛으로 야옹~ 하고 운다.",
                        score: 1
                    }
                ]
            },
            {
                q: "스크래쳐 사용 방식은?",
                dimension: "random",
                a: [
                    {
                        text: "항상 긁던 곳만 긁어서 너덜너덜하다.",
                        score: 1
                    },
                    {
                        text: "소파, 벽지, 카펫... 긁히는 건 다 긁는다.",
                        score: 5
                    }
                ]
            },
            {
                q: "그루밍(털 고르기) 스타일은?",
                dimension: "random",
                a: [
                    {
                        text: "발가락 사이까지 꼼꼼하게 순서대로 한다.",
                        score: 1
                    },
                    {
                        text: "생각날 때마다 대충 핥는다.",
                        score: 5
                    }
                ]
            },
            {
                q: "집안 가구 배치가 바뀌었을 때?",
                dimension: "alert",
                a: [
                    {
                        text: "마음에 안 든다옹! 계속 울거나 불안해한다.",
                        score: 5
                    },
                    {
                        text: "오! 새로운 탐험지다옹! 신나게 돌아다닌다.",
                        score: 1
                    }
                ]
            },
            {
                q: "사료 먹는 스타일?",
                dimension: "random",
                a: [
                    {
                        text: "딱 먹을 만큼만 먹고 남긴다. (자율급식 가능)",
                        score: 1
                    },
                    {
                        text: "있으면 다 먹어치운다. (식탐왕)",
                        score: 5
                    }
                ]
            },
            {
                q: "집사가 놀아주는 시간?",
                dimension: "random",
                a: [
                    {
                        text: "매일 밤 10시! 루틴이 깨지면 화낸다.",
                        score: 1
                    },
                    {
                        text: "집사가 낚싯대 들면 그때가 노는 시간이다.",
                        score: 5
                    }
                ]
            },
            {
                q: "낯선 물건에 대한 반응?",
                dimension: "alert",
                a: [
                    {
                        text: "조심스럽게 냄새 맡고 안전한지 확인 후 건드린다.",
                        score: 5
                    },
                    {
                        text: "일단 앞발로 툭 쳐보고 올라가 본다.",
                        score: 1
                    }
                ]
            }
        ,
            {
                q: "집 근처에서 공사 소리가 날 때?",
                dimension: "alert",
                a: [
                    { text: "스트레스 만렙! 가장 조용한 곳으로 피신한다.", score: 5 },
                    { text: "시끄럽네. 그래도 적응하며 일상을 보낸다.", score: 1 }
                ]
            },
            {
                q: "창문 밖에서 이상한 소리가 날 때?",
                dimension: "alert",
                a: [
                    { text: "귀를 쫑긋! 꼬리 부풀리고 경계 태세.", score: 5 },
                    { text: "뭐지? 창가로 가서 구경한다.", score: 1 }
                ]
            },
            {
                q: "집사가 캐리어를 꺼냈을 때?",
                dimension: "alert",
                a: [
                    { text: "위험 감지! 순간이동으로 사라진다.", score: 5 },
                    { text: "저건 뭐하는 거지? 관심 있게 본다.", score: 1 }
                ]
            },
            {
                q: "처음 보는 물건이 집에 생겼을 때?",
                dimension: "alert",
                a: [
                    { text: "멀리서 관찰... 며칠간 조심스럽게 접근.", score: 5 },
                    { text: "신상이다! 바로 올라타거나 냄새 맡는다.", score: 1 }
                ]
            },
            {
                q: "집사가 평소와 다른 행동을 할 때?",
                dimension: "alert",
                a: [
                    { text: "뭔가 수상해... 눈을 떼지 않고 감시한다.", score: 5 },
                    { text: "관심 없다옹. 내 할 일 한다.", score: 1 }
                ]
            },
            {
                q: "집사가 다른 동물 영상을 볼 때?",
                dimension: "cute",
                a: [
                    { text: "야옹~ 나를 봐달라고 화면 앞을 막는다.", score: 5 },
                    { text: "마음대로 해라. 나는 창밖을 본다.", score: 1 }
                ]
            },
            {
                q: "집사 무릎이 비어있을 때?",
                dimension: "cute",
                a: [
                    { text: "자리 확보! 바로 올라가서 자리 잡는다.", score: 5 },
                    { text: "내 자리는 따로 있다. 캣타워로 간다.", score: 1 }
                ]
            },
            {
                q: "츄르를 받고 싶을 때?",
                dimension: "cute",
                a: [
                    { text: "머리 부비부비~ 온갖 애교로 구걸한다.", score: 5 },
                    { text: "서랍 앞에서 무언의 압박을 가한다.", score: 1 }
                ]
            },
            {
                q: "집사가 내 자리에 앉았을 때?",
                dimension: "boss",
                a: [
                    { text: "이건 내 자리다! 째려보며 앉으라고 압박.", score: 5 },
                    { text: "다른 데 가면 되지. 옆으로 간다.", score: 1 }
                ]
            },
            {
                q: "밥 시간이 늦어졌을 때?",
                dimension: "boss",
                a: [
                    { text: "밥! 밥! 밥! 시끄럽게 항의한다.", score: 5 },
                    { text: "오겠지... 기다린다.", score: 1 }
                ]
            },
            {
                q: "한밤중에 갑자기?",
                dimension: "random",
                a: [
                    { text: "운동회 시작! 집안을 미친 듯이 뛴다.", score: 5 },
                    { text: "푹 자고 있다. 새벽형 고양이 아님.", score: 1 }
                ]
            },
            {
                q: "빈 박스와 비싼 캣타워가 있을 때?",
                dimension: "random",
                a: [
                    { text: "박스 최고! 캣타워는 장식이다.", score: 5 },
                    { text: "캣타워로 간다. 높은 곳이 좋다.", score: 1 }
                ]
            }],
        resultLabels: [
            {
                name: "철학 냥이",
                emoji: "🌙",
                desc: "창밖을 보며 우주의 섭리를 생각해요.",
                condition: {
                    curious: "high",
                    alert: "medium",
                    boss: "low"
                },
                interpretation: "깊은 통찰력과 이상주의를 가진 예언자적인 성격입니다. 조용히 사색하는 것을 좋아하고, 자신만의 세계관이 뚜렷합니다.",
                guide: "혼자만의 사색 시간을 존중해 주세요. 캣타워 높은 곳이나 창가에 편안한 자리를 마련해주면 좋아합니다.",
                mood: "sad",
                color: "bg-purple-100"
            },
            {
                name: "보스 냥이",
                emoji: "👑",
                desc: "이 집의 주인은 나다옹!",
                condition: {
                    boss: "high",
                    alert: "medium",
                    cute: "low"
                },
                interpretation: "독립적이고 자존심이 강한 고양이입니다. 자신의 영역과 규칙을 중요시하며, 집사도 자기 방식대로 다루려 합니다.",
                guide: "복종을 강요하기보다 '제안'하는 것이 효과적입니다. 선택권을 주고 스스로 결정하게 하면 협조적이 됩니다.",
                mood: "cool",
                color: "bg-indigo-100"
            },
            {
                name: "인싸 냥이",
                emoji: "🎉",
                desc: "새로운 친구를 만나면 먼저 다가가요!",
                condition: {
                    cute: "high",
                    curious: "high",
                    alert: "low"
                },
                interpretation: "사교적이고 활발한 성격입니다. 사람과 함께하는 것을 좋아하고, 관심받는 것을 즐깁니다.",
                guide: "집사의 적극적인 반응과 관심이 필요합니다. 혼자 있는 시간이 길면 외로워할 수 있어요.",
                mood: "happy",
                color: "bg-orange-100"
            },
            {
                name: "천사 냥이",
                emoji: "😇",
                desc: "집사가 힘들면 옆에서 골골송을 불러줘요.",
                condition: {
                    cute: "high",
                    boss: "low",
                    alert: "low"
                },
                interpretation: "타인의 감정을 읽고 헌신적으로 돌보는 따뜻한 마음의 소유자입니다. 공감 능력이 뛰어납니다.",
                guide: "집사가 힘들 때 먼저 다가오는 공감 능력이 뛰어납니다. 부드러운 목소리와 따뜻한 스킨십을 좋아해요.",
                mood: "happy",
                color: "bg-pink-100"
            },
            {
                name: "탐험 냥이",
                emoji: "🔭",
                desc: "새로운 곳은 모두 나의 탐험지!",
                condition: {
                    curious: "high",
                    random: "high",
                    alert: "low"
                },
                interpretation: "호기심이 많고 모험심이 강한 고양이입니다. 새로운 것에 두려움 없이 다가가며 탐구합니다.",
                guide: "다양한 환경 변화와 새로운 장난감을 제공해주세요. 안전한 범위 내에서 탐험할 수 있는 기회를 많이 주세요.",
                mood: "excited",
                color: "bg-yellow-100"
            },
            {
                name: "경계 냥이",
                emoji: "🚨",
                desc: "낯선 것에는 일단 하악!",
                condition: {
                    alert: "high",
                    boss: "medium",
                    cute: "low"
                },
                interpretation: "환경 변화에 민감하고 조심스러운 성격입니다. 안전을 최우선으로 생각하며, 익숙한 것을 선호합니다.",
                guide: "갑작스러운 변화를 피하고, 새로운 것을 천천히 소개해주세요. 안전한 숨을 공간을 항상 마련해두세요.",
                mood: "cool",
                color: "bg-blue-100"
            },
            {
                name: "엉뚱 냥이",
                emoji: "🎲",
                desc: "다음 행동은 나도 모른다옹!",
                condition: {
                    random: "high",
                    curious: "high",
                    boss: "medium"
                },
                interpretation: "예측 불가능한 행동으로 웃음을 주는 고양이입니다. 틀에 박히지 않은 자유로운 영혼입니다.",
                guide: "규칙적인 생활을 강요하지 마세요. 자유롭게 놀 수 있는 환경과 다양한 장난감이 좋습니다.",
                mood: "excited",
                color: "bg-green-100"
            },
            {
                name: "도도 냥이",
                emoji: "💅",
                desc: "쓰다듬는 것은 허락할 때만 가능.",
                condition: {
                    boss: "high",
                    cute: "low",
                    random: "low"
                },
                interpretation: "자존감이 높고 품위 있는 고양이입니다. 자신만의 기준이 확실하고, 쉽게 타협하지 않습니다.",
                guide: "먼저 다가가기보다 고양이가 다가올 때까지 기다려주세요. 존중받는다고 느끼면 마음을 열어요.",
                mood: "cool",
                color: "bg-gray-100"
            },
            {
                name: "애교 냥이",
                emoji: "🥰",
                desc: "집사 무릎이 내 자리다옹~",
                condition: {
                    cute: "high",
                    random: "medium",
                    boss: "low"
                },
                interpretation: "사람을 좋아하고 스킨십을 즐기는 다정한 고양이입니다. 관심과 사랑을 듬뿍 표현합니다.",
                guide: "충분한 스킨십과 대화를 해주세요. 이름을 부르며 애정을 표현하면 더욱 애교가 늘어납니다.",
                mood: "happy",
                color: "bg-pink-100"
            },
            {
                name: "균형 냥이",
                emoji: "☯️",
                desc: "상황에 따라 적절히 행동하는 중용의 고양이",
                condition: {
                    curious: "medium",
                    alert: "medium",
                    boss: "medium",
                    random: "medium",
                    cute: "medium"
                },
                interpretation: "모든 면에서 균형 잡힌 성격입니다. 상황에 따라 유연하게 대처하며, 적응력이 뛰어납니다.",
                guide: "다양한 환경과 경험을 제공해주세요. 어떤 상황에서도 잘 적응하는 든든한 고양이입니다.",
                mood: "happy",
                color: "bg-gray-100"
            }
        ]
    };

window.CHEMI_SUBJECTS = window.CHEMI_SUBJECTS || {};
window.CHEMI_SUBJECTS.cat = CAT_DATA;
