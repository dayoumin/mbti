/**
 * MBTI 테스트 로직 검증 스크립트
 * 실행: node test-mbti.js
 */

// 점수 계산 로직 (index.html의 calculateResult와 동일)
function calculateMBTI(scores) {
    const typeE = scores.E > scores.I ? "E" : "I";
    const typeS = scores.S > scores.N ? "S" : "N";
    const typeT = scores.T > scores.F ? "T" : "F";
    const typeJ = scores.J > scores.P ? "J" : "P";
    return typeE + typeS + typeT + typeJ;
}

// 질문 배분 분석
function analyzeQuestions(questions, modeName) {
    const analysis = {
        EI: { E: 0, I: 0 },
        SN: { S: 0, N: 0 },
        TF: { T: 0, F: 0 },
        JP: { J: 0, P: 0 }
    };

    questions.forEach(q => {
        const yesScore = q.a[0].score;
        analysis[q.type][yesScore]++;
    });

    console.log(`\n=== ${modeName} 모드 질문 배분 ===`);
    console.log(`E/I: E=${analysis.EI.E}, I=${analysis.EI.I}`);
    console.log(`S/N: S=${analysis.SN.S}, N=${analysis.SN.N}`);
    console.log(`T/F: T=${analysis.TF.T}, F=${analysis.TF.F}`);
    console.log(`J/P: J=${analysis.JP.J}, P=${analysis.JP.P}`);

    return analysis;
}

// 테스트 케이스
const testCases = [
    {
        name: "모든 Yes 선택 (E, S, T, J 중심)",
        scores: { E: 2, I: 1, S: 2, N: 1, T: 2, F: 1, J: 2, P: 1 },
        expected: "ESTJ"
    },
    {
        name: "모든 No 선택 (I, N, F, P 중심)",
        scores: { E: 1, I: 2, S: 1, N: 2, T: 1, F: 2, J: 1, P: 2 },
        expected: "INFP"
    },
    {
        name: "균등 점수 (동점은 I, N, F, P 우선 - > 연산자 특성)",
        scores: { E: 1, I: 1, S: 1, N: 1, T: 1, F: 1, J: 1, P: 1 },
        expected: "INFP" // 동점시 > 연산자로 인해 두번째 옵션 선택
    },
    {
        name: "ENFJ 테스트",
        scores: { E: 2, I: 1, S: 1, N: 2, T: 1, F: 2, J: 2, P: 1 },
        expected: "ENFJ"
    },
    {
        name: "INTP 테스트",
        scores: { E: 0, I: 3, S: 1, N: 2, T: 3, F: 0, J: 1, P: 2 },
        expected: "INTP"
    },
    {
        name: "극단적 외향형",
        scores: { E: 3, I: 0, S: 0, N: 3, T: 0, F: 3, J: 0, P: 3 },
        expected: "ENFP"
    }
];

// 질문 데이터 (index.html에서 추출)
const humanQuestions = [
    { q: "오랜만에 동창회에 나갔다! 어색한 친구들 사이에서 나는?", type: "EI", a: [{ text: "먼저 말을 걸며 분위기를 띄운다.", score: "E" }, { text: "친한 친구 옆에 딱 붙어서 조용히 있는다.", score: "I" }] },
    { q: "주말에 아무 약속이 없다면?", type: "EI", a: [{ text: "심심해... 친구들에게 연락해 약속을 잡는다.", score: "E" }, { text: "나이스! 밀린 넷플릭스를 보며 침대와 한 몸이 된다.", score: "I" }] },
    { q: "갑자기 모르는 번호로 전화가 걸려온다면?", type: "EI", a: [{ text: "여보세요? 일단 받고 누구인지 확인한다.", score: "E" }, { text: "스팸인가? 고민하다가 끊어지면 안도한다.", score: "I" }] },
    { q: "멍 때릴 때 주로 하는 생각은?", type: "SN", a: [{ text: "오늘 저녁 뭐 먹지? 내일 할 일이 뭐더라?", score: "S" }, { text: "좀비 사태가 터지면 어디로 도망가지? 로또 당첨되면...", score: "N" }] },
    { q: "영화를 보고 나서 친구와 대화할 때 나는?", type: "SN", a: [{ text: "주인공이 입은 옷 예쁘더라. 액션씬 대박이었어.", score: "S" }, { text: "그 결말의 의미는 뭘까? 감독이 전하려는 메시지는...", score: "N" }] },
    { q: "요리 레시피를 볼 때 나는?", type: "SN", a: [{ text: "소금 1작은술... 계량스푼으로 정확히 맞춘다.", score: "S" }, { text: "이 정도면 되겠지? 감으로 대충 넣거나 내 맘대로 바꾼다.", score: "N" }] },
    { q: "친구가 '나 우울해서 빵 샀어'라고 했을 때 나의 반응은?", type: "TF", a: [{ text: "무슨 빵 샀어? 맛있어?", score: "T" }, { text: "무슨 일 있어? 왜 우울해 ㅠㅠ", score: "F" }] },
    { q: "친구가 머리를 자르고 왔는데, 솔직히 좀 별로다. 이때 나는?", type: "TF", a: [{ text: "음... 전이 더 나은 것 같은데? 솔직하게 말한다.", score: "T" }, { text: "오~ 변화를 줬네! 기분 전환 됐겠다! 돌려 말하거나 칭찬한다.", score: "F" }] },
    { q: "조별 과제 중, 열심히 했지만 결과물이 별로인 팀원에게 피드백한다면?", type: "TF", a: [{ text: "이 부분은 수정이 필요해요. 부족한 점을 명확히 짚어준다.", score: "T" }, { text: "고생 많으셨어요! 근데 이 부분만 조금 더... 격려부터 한다.", score: "F" }] },
    { q: "여행 가기 전날, 나의 짐 싸기 스타일은?", type: "JP", a: [{ text: "며칠 전부터 리스트를 작성하고 차곡차곡 싸둔다.", score: "J" }, { text: "출발 직전에 '지갑, 여권! 챙겼으면 됐지!' 하고 후다닥 싼다.", score: "P" }] },
    { q: "2주 뒤가 시험이다. 나의 공부 계획은?", type: "JP", a: [{ text: "일별로 공부할 분량을 나눠서 계획을 짠다.", score: "J" }, { text: "아직 2주나 남았네? 일단 놀다가 벼락치기한다.", score: "P" }] },
    { q: "친구와 맛집에 갔는데 문이 닫혀있다! 이때 나는?", type: "JP", a: [{ text: "아... 어떡하지? 미리 찾아둔 2순위 식당으로 간다.", score: "J" }, { text: "할 수 없지! 저기 맛있어 보이는데 갈까? 바로 옆 가게로 간다.", score: "P" }] },
];

const catQuestions = [
    { q: "택배 기사님이 벨을 '딩동' 눌렀을 때 우리 냥이는?", type: "EI", a: [{ text: "누구냥! 현관으로 마중 나가서 냄새를 맡는다.", score: "E" }, { text: "후다닥! 침대 밑이나 옷장 위로 숨어서 절대 안 나온다.", score: "I" }] },
    { q: "집사가 퇴근하고 문을 열었을 때 반응은?", type: "EI", a: [{ text: "문 앞에서 '야옹~' 하며 다리에 몸을 비빈다.", score: "E" }, { text: "자다 깬 눈으로 멀리서 쳐다보거나 하품만 한다.", score: "I" }] },
    { q: "새로운 장난감을 흔들어 줄 때?", type: "EI", a: [{ text: "우다다다! 숨이 찰 때까지 미친 듯이 뛰어논다.", score: "E" }, { text: "누워서 앞발로만 툭툭 건드리며 간만 본다.", score: "I" }] },
    { q: "간식 서랍을 여는 소리가 들리면?", type: "SN", a: [{ text: "자다가도 0.1초 만에 달려와서 '내놔라!' 하고 운다.", score: "S" }, { text: "불러도 안 오다가 나중에 와서 냄새만 맡고 간다.", score: "N" }] },
    { q: "아무것도 없는 허공을 뚫어지게 쳐다볼 때?", type: "SN", a: [{ text: "벌레가 있나? 집사도 같이 열심히 찾는다.", score: "S" }, { text: "귀신 보나...? 집사를 오싹하게 만든다.", score: "N" }] },
    { q: "비싼 숨숨집을 사줬는데, 택배 박스에만 들어간다.", type: "SN", a: [{ text: "박스가 최고다냥. 좁고 딱딱한 박스를 더 좋아한다.", score: "S" }, { text: "숨숨집 지붕 위에 올라가거나 엉뚱한 방식으로 쓴다.", score: "N" }] },
    { q: "집사가 실수로 꼬리를 밟았다! '악 미안해!' 했을 때?", type: "TF", a: [{ text: "하악! 화내고 구석으로 가서 한동안 삐져 있는다.", score: "T" }, { text: "놀랐지만 집사가 쓰다듬어 주면 금방 골골송을 부른다.", score: "F" }] },
    { q: "집사가 훌쩍거리며 울고 있을 때 냥이의 반응은?", type: "TF", a: [{ text: "밥이나 줘라. 무심하게 쳐다보거나 밥그릇을 긁는다.", score: "T" }, { text: "슬그머니 다가와서 엉덩이를 붙이거나 눈물을 핥아준다.", score: "F" }] },
    { q: "안고 뽀뽀하려고 할 때 반응은?", type: "TF", a: [{ text: "뒷발로 집사 얼굴을 밀어내며 탈출을 시도한다.", score: "T" }, { text: "가만히 안겨 있거나 집사 얼굴에 꾹꾹이를 한다.", score: "F" }] },
    { q: "우리 냥이의 하루 일과는?", type: "JP", a: [{ text: "기상, 식사, 그루밍, 낮잠 시간이 시계처럼 정확하다.", score: "J" }, { text: "그때그때 다르다. 밤에 우다다 했다가 낮에 잤다가 랜덤이다.", score: "P" }] },
    { q: "화장실 모래 전체 갈이를 해줬을 때?", type: "JP", a: [{ text: "바로 들어가서 사용하며 영역 표시를 한다.", score: "J" }, { text: "낯설어서 한참 냄새를 맡거나 화장실 앞에서 망설인다.", score: "P" }] },
    { q: "사냥 놀이를 할 때 스타일은?", type: "JP", a: [{ text: "엉덩이를 흔들며 타이밍을 재다가 정확하게 덮친다.", score: "J" }, { text: "일단 몸부터 날리고 본다. 잡히면 좋고 아니면 말고.", score: "P" }] },
];

const dogQuestions = [
    { q: "애견 카페에 갔을 때 우리 강아지는?", type: "EI", a: [{ text: "안녕! 나랑 놀자! 친구들 냄새 맡으러 돌아다니느라 바쁘다.", score: "E" }, { text: "보호자 무릎 위에만 앉아있거나 다리 뒤에 숨는다.", score: "I" }] },
    { q: "배달 기사님이 오셨을 때 반응은?", type: "EI", a: [{ text: "꼬리가 떨어져라 흔들며 반겨준다.", score: "E" }, { text: "멍! 멍! 짖거나 방으로 도망간다.", score: "I" }] },
    { q: "산책하다가 아는 강아지 친구를 만났을 때?", type: "EI", a: [{ text: "멀리서부터 알아보고 낑낑거리며 달려가려 한다.", score: "E" }, { text: "관심 없거나 모른 척 지나가고 싶어 한다.", score: "I" }] },
    { q: "산책할 때 주로 하는 행동은?", type: "SN", a: [{ text: "전봇대, 풀숲 냄새를 하나하나 꼼꼼히 맡는다.", score: "S" }, { text: "나비나 새를 쫓아가거나 멍하니 풍경을 본다.", score: "N" }] },
    { q: "보호자가 '산책 갈까?'라고 작게 속삭였을 때?", type: "SN", a: [{ text: "'산책'이라는 단어만 기가 막히게 알아듣고 뛴다.", score: "S" }, { text: "보호자가 주섬주섬 옷만 입어도 이미 현관에 가 있다.", score: "N" }] },
    { q: "새로운 개인기를 가르칠 때?", type: "SN", a: [{ text: "간식을 보여줘야만 하라는 대로 한다.", score: "S" }, { text: "보호자의 칭찬과 목소리 톤에 더 반응한다.", score: "N" }] },
    { q: "보호자가 화난 목소리로 '안돼!' 했을 때?", type: "TF", a: [{ text: "왜? 뭐? 억울한 표정으로 짖거나 딴청 피운다.", score: "T" }, { text: "세상 잃은 표정으로 눈치를 보거나 배를 깐다.", score: "F" }] },
    { q: "보호자가 아파서 누워있을 때?", type: "TF", a: [{ text: "심심해 놀아줘! 장난감을 물고 와서 툭 던진다.", score: "T" }, { text: "걱정스러운 눈빛으로 옆에 가만히 누워있는다.", score: "F" }] },
    { q: "다른 강아지를 예뻐해 줄 때 반응은?", type: "TF", a: [{ text: "내 간식 뺏어 먹나? 밥그릇을 지킨다.", score: "T" }, { text: "보호자 사이를 파고들며 '나만 봐!' 하고 낑낑댄다.", score: "F" }] },
    { q: "산책 나갈 때 리드줄을 멜 때?", type: "JP", a: [{ text: "얌전히 앉아서 기다린다.", score: "J" }, { text: "좋아서 방방 뛰고 난리 나서 줄 메기가 힘들다.", score: "P" }] },
    { q: "항상 가던 산책 코스가 공사 중이라 다른 길로 간다면?", type: "JP", a: [{ text: "자꾸 원래 가던 길 쪽으로 가려고 고집을 부린다.", score: "J" }, { text: "오! 새로운 냄새! 신나서 앞장선다.", score: "P" }] },
    { q: "배변 훈련 상태는?", type: "JP", a: [{ text: "정해진 패드 위에 정확하게 100점 만점으로 싼다.", score: "J" }, { text: "기분 좋으면 패드, 급하면 거실 바닥... 가끔 실수한다.", score: "P" }] },
];

// 테스트 실행
console.log("==========================================");
console.log("       MBTI 테스트 로직 검증");
console.log("==========================================");

// 1. 질문 배분 분석
analyzeQuestions(humanQuestions, "인간");
analyzeQuestions(catQuestions, "고양이");
analyzeQuestions(dogQuestions, "강아지");

// 2. 점수 계산 테스트
console.log("\n==========================================");
console.log("       점수 계산 테스트");
console.log("==========================================\n");

let passCount = 0;
let failCount = 0;

testCases.forEach((test, index) => {
    const result = calculateMBTI(test.scores);
    const passed = result === test.expected;

    if (passed) {
        passCount++;
        console.log(`✅ 테스트 ${index + 1}: ${test.name}`);
    } else {
        failCount++;
        console.log(`❌ 테스트 ${index + 1}: ${test.name}`);
        console.log(`   예상: ${test.expected}, 실제: ${result}`);
    }
    console.log(`   점수: E=${test.scores.E} I=${test.scores.I} S=${test.scores.S} N=${test.scores.N} T=${test.scores.T} F=${test.scores.F} J=${test.scores.J} P=${test.scores.P}`);
    console.log("");
});

// 3. 시뮬레이션: 모든 Yes 선택 시 결과
console.log("==========================================");
console.log("       시뮬레이션 테스트");
console.log("==========================================\n");

function simulateAllYes(questions, modeName) {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    questions.forEach(q => {
        const yesScore = q.a[0].score;
        scores[yesScore]++;
    });
    const result = calculateMBTI(scores);
    console.log(`${modeName} - 모든 Yes: ${result}`);
    console.log(`  점수: E=${scores.E} I=${scores.I} S=${scores.S} N=${scores.N} T=${scores.T} F=${scores.F} J=${scores.J} P=${scores.P}`);
}

function simulateAllNo(questions, modeName) {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    questions.forEach(q => {
        const noScore = q.a[1].score;
        scores[noScore]++;
    });
    const result = calculateMBTI(scores);
    console.log(`${modeName} - 모든 No: ${result}`);
    console.log(`  점수: E=${scores.E} I=${scores.I} S=${scores.S} N=${scores.N} T=${scores.T} F=${scores.F} J=${scores.J} P=${scores.P}`);
}

simulateAllYes(humanQuestions, "인간");
simulateAllNo(humanQuestions, "인간");
console.log("");
simulateAllYes(catQuestions, "고양이");
simulateAllNo(catQuestions, "고양이");
console.log("");
simulateAllYes(dogQuestions, "강아지");
simulateAllNo(dogQuestions, "강아지");

// 결과 요약
console.log("\n==========================================");
console.log("       테스트 결과 요약");
console.log("==========================================");
console.log(`통과: ${passCount}/${testCases.length}`);
console.log(`실패: ${failCount}/${testCases.length}`);

if (failCount === 0) {
    console.log("\n✅ 모든 테스트 통과!");
} else {
    console.log("\n❌ 일부 테스트 실패");
    process.exit(1);
}
