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
    { q: "새로운 모임에 가면 활발하게 대화에 참여하는 편이다.", type: "EI", a: [{ text: "Yes", score: "E" }, { text: "No", score: "I" }] },
    { q: "혼자만의 시간이 없으면 에너지가 빠르게 소진된다.", type: "EI", a: [{ text: "Yes", score: "I" }, { text: "No", score: "E" }] },
    { q: "전화가 오면 즉시 받거나, 먼저 전화를 거는 것에 부담이 없다.", type: "EI", a: [{ text: "Yes", score: "E" }, { text: "No", score: "I" }] },
    { q: "업무나 과제를 처리할 때 큰 그림보다 세부적인 사실을 먼저 확인한다.", type: "SN", a: [{ text: "Yes", score: "S" }, { text: "No", score: "N" }] },
    { q: "미래의 가능성이나 추상적인 개념에 대해 깊이 생각하는 것을 즐긴다.", type: "SN", a: [{ text: "Yes", score: "N" }, { text: "No", score: "S" }] },
    { q: "상상 속 아이디어보다 직접 경험한 것을 더 신뢰한다.", type: "SN", a: [{ text: "Yes", score: "S" }, { text: "No", score: "N" }] },
    { q: "친구가 고민을 털어놓을 때, 공감보다 객관적인 해결책을 제시하는 편이다.", type: "TF", a: [{ text: "Yes", score: "T" }, { text: "No", score: "F" }] },
    { q: "다른 사람의 감정 변화를 빠르게 알아채고 배려하는 편이다.", type: "TF", a: [{ text: "Yes", score: "F" }, { text: "No", score: "T" }] },
    { q: "결정을 내릴 때 논리적 근거가 감정적 이유보다 중요하다.", type: "TF", a: [{ text: "Yes", score: "T" }, { text: "No", score: "F" }] },
    { q: "여행을 갈 때 출발 시간, 숙소 등을 미리 계획하고 가는 것을 선호한다.", type: "JP", a: [{ text: "Yes", score: "J" }, { text: "No", score: "P" }] },
    { q: "마감 시간 직전에 최고의 성과를 내는 '벼락치기'를 선호하는 편이다.", type: "JP", a: [{ text: "Yes", score: "P" }, { text: "No", score: "J" }] },
    { q: "일정이 갑자기 바뀌면 스트레스를 받는 편이다.", type: "JP", a: [{ text: "Yes", score: "J" }, { text: "No", score: "P" }] },
];

const catQuestions = [
    { q: "집사나 낯선 사람에게 먼저 다가가 몸을 비비는 편이다.", type: "EI", a: [{ text: "Yes", score: "E" }, { text: "No", score: "I" }] },
    { q: "아침에 집사가 깨어날 때까지 울지 않고 조용히 기다릴 수 있다.", type: "EI", a: [{ text: "Yes", score: "I" }, { text: "No", score: "E" }] },
    { q: "집에 손님이 오면 침대 밑에 숨지 않고 나와서 냄새를 맡는다.", type: "EI", a: [{ text: "Yes", score: "E" }, { text: "No", score: "I" }] },
    { q: "캣타워에서 내려올 때 항상 안전한 경로로만 내려온다.", type: "SN", a: [{ text: "Yes", score: "S" }, { text: "No", score: "N" }] },
    { q: "벽지나 가구를 긁을 때, '이것은 예술이다'라는 생각을 한다.", type: "SN", a: [{ text: "Yes", score: "N" }, { text: "No", score: "S" }] },
    { q: "새로운 장난감보다 익숙한 낡은 상자를 더 좋아한다.", type: "SN", a: [{ text: "Yes", score: "S" }, { text: "No", score: "N" }] },
    { q: "츄르를 나눠 먹을 때, 내 몫이 줄어드는 것을 용납할 수 없다.", type: "TF", a: [{ text: "Yes", score: "T" }, { text: "No", score: "F" }] },
    { q: "집사가 슬퍼 보이면 옆에 와서 골골송을 불러준다.", type: "TF", a: [{ text: "Yes", score: "F" }, { text: "No", score: "T" }] },
    { q: "다른 고양이와 다툴 때 감정보다 영역 논리로 판단한다.", type: "TF", a: [{ text: "Yes", score: "T" }, { text: "No", score: "F" }] },
    { q: "매일 같은 시간에 밥을 달라고 정확히 요구한다.", type: "JP", a: [{ text: "Yes", score: "J" }, { text: "No", score: "P" }] },
    { q: "갑작스러운 환경 변화에도 빠르게 적응하고 편안해한다.", type: "JP", a: [{ text: "Yes", score: "P" }, { text: "No", score: "J" }] },
    { q: "화장실 사용 후 모래를 덮는 동작이 매우 체계적이고 완벽하다.", type: "JP", a: [{ text: "Yes", score: "J" }, { text: "No", score: "P" }] },
];

const dogQuestions = [
    { q: "산책 중 낯선 강아지를 보면 꼬리를 흔들며 먼저 다가간다.", type: "EI", a: [{ text: "Yes", score: "E" }, { text: "No", score: "I" }] },
    { q: "집에 낯선 사람이 오면 짖기보다 조용히 관찰하며 숨는다.", type: "EI", a: [{ text: "Yes", score: "I" }, { text: "No", score: "E" }] },
    { q: "다른 강아지의 짖는 소리가 들리면 바로 따라 짖는다.", type: "EI", a: [{ text: "Yes", score: "E" }, { text: "No", score: "I" }] },
    { q: "새로운 장난감보다 오래 갖고 놀던 인형이 제일 좋다.", type: "SN", a: [{ text: "Yes", score: "S" }, { text: "No", score: "N" }] },
    { q: "보호자의 작은 표정 변화도 놓치지 않고 눈치를 살핀다.", type: "SN", a: [{ text: "Yes", score: "N" }, { text: "No", score: "S" }] },
    { q: "간식을 줄 때 눈빛만 보고도 정확히 양을 파악할 수 있다.", type: "SN", a: [{ text: "Yes", score: "S" }, { text: "No", score: "N" }] },
    { q: "보호자가 혼낼 때, 이유가 납득이 안 되면 반항하는 편이다.", type: "TF", a: [{ text: "Yes", score: "T" }, { text: "No", score: "F" }] },
    { q: "아픈 친구 강아지를 보면 안쓰러워서 곁을 지켜준다.", type: "TF", a: [{ text: "Yes", score: "F" }, { text: "No", score: "T" }] },
    { q: "간식을 나눌 때 공정한 분배가 감정보다 중요하다.", type: "TF", a: [{ text: "Yes", score: "T" }, { text: "No", score: "F" }] },
    { q: "산책 시간이 되면 30분 전부터 현관 앞에서 기다린다.", type: "JP", a: [{ text: "Yes", score: "J" }, { text: "No", score: "P" }] },
    { q: "갑자기 산책 경로가 바뀌어도 전혀 당황하지 않고 즐긴다.", type: "JP", a: [{ text: "Yes", score: "P" }, { text: "No", score: "J" }] },
    { q: "밥그릇과 물그릇이 항상 같은 자리에 있어야 안심된다.", type: "JP", a: [{ text: "Yes", score: "J" }, { text: "No", score: "P" }] },
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
