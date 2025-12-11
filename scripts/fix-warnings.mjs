/**
 * 경고 수정 스크립트
 *
 * 수정 대상:
 * 1. 질문이 ?로 끝나지 않는 경우 (7개)
 * 2. 점수가 (3,5) 또는 (1,3)인 경우 → (1,5)로 변경 (15개)
 * 3. 키워드 중복 "모임" → 다른 표현으로 변경 (1개)
 *
 * 사용법: node scripts/fix-warnings.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '..', 'data.js');
let content = fs.readFileSync(dataPath, 'utf8');

console.log('🔧 경고 수정 시작...\n');

let fixCount = 0;

// ============================================
// 1. 질문이 ?로 끝나지 않는 경우 수정
// ============================================
console.log('📝 1. 질문 끝에 ? 추가\n');

const questionFixes = [
    // human/questions[12]
    {
        old: 'q: "중요한 발표가 코앞인데, 갑자기 자료가 날아갔다!"',
        new: 'q: "중요한 발표가 코앞인데, 갑자기 자료가 날아갔다면?"'
    },
    // human/questions[13]
    {
        old: 'q: "SNS에서 누군가 내 글에 비판적인 댓글을 달았다."',
        new: 'q: "SNS에서 누군가 내 글에 비판적인 댓글을 달았다면?"'
    },
    // human/questions_deep[17]
    {
        old: `q: "친구가 늦어서 약속 시간에 늦었다. 친구는 '차가 너무 막혔어'라고 한다."`,
        new: `q: "친구가 늦어서 약속 시간에 늦었다. 친구가 '차가 너무 막혔어'라고 한다면?"`
    },
    // cat/questions[4]
    {
        old: 'q: "새로운 박스가 생겼다!"',
        new: 'q: "새로운 박스가 생겼다면?"'
    },
    // cat/questions[8]
    {
        old: 'q: "간식을 줄 때 집사의 손가락까지 깨물었다!"',
        new: 'q: "간식을 줄 때 집사의 손가락까지 깨물었다면?"'
    },
    // cat/questions_deep[8]
    {
        old: 'q: "벌레가 나타났다!"',
        new: 'q: "벌레가 나타났다면?"'
    },
    // cat/questions_deep[14]
    {
        old: 'q: "집사가 실수로 꼬리를 밟았다!"',
        new: 'q: "집사가 실수로 꼬리를 밟았다면?"'
    }
];

for (const fix of questionFixes) {
    if (content.includes(fix.old)) {
        content = content.replace(fix.old, fix.new);
        console.log(`  ✅ 수정: ${fix.old.slice(4, 40)}...`);
        fixCount++;
    } else {
        console.log(`  ⚠️  건너뜀: ${fix.old.slice(4, 40)}... (찾을 수 없음)`);
    }
}

// ============================================
// 2. 점수 수정 (3,5) → (1,5) 또는 (1,3) → (1,5)
// ============================================
console.log('\n📊 2. 점수 (3,5) → (1,5) 수정\n');

// 특정 답변의 score: 3 → score: 1 변경
// 패턴: 각 질문 근처에서만 변경해야 함

const scoreFixes = [
    // cat/questions[3] - "창밖을 구경할 때 나는?"
    { text: '그냥 멍하니 풍경을 바라보며 사색에 잠긴다.', oldScore: 3, newScore: 1 },

    // cat/questions[4] - "새로운 박스가 생겼다!"
    { text: '일단 들어가서 사이즈가 맞는지 확인한다.', oldScore: 3, newScore: 1 },

    // cat/questions[5] - "사냥 놀이를 할 때?"
    { text: '눈앞에 보이는 장난감만 쫓는다.', oldScore: 3, newScore: 1 },

    // cat/questions_deep[3] - "새로운 장난감을 사왔을 때?"
    { text: '며칠 동안 냄새만 맡으며 탐색전을 벌인다.', oldScore: 3, newScore: 1 },

    // cat/questions_deep[6] - "높은 곳(냉장고 위, 장롱 위)을 볼 때?"
    { text: '올라갈 수 있을까? 각도를 계산해본다.', oldScore: 3, newScore: 1 },

    // cat/questions_deep[8] - "벌레가 나타났다!"
    { text: '잡았다! 바로 앞발로 내리친다.', oldScore: 3, newScore: 1 },

    // cat/questions_deep[9] - "집사가 이상한 자세로 있을 때?"
    { text: '뭐하냐옹? 냄새를 맡아본다.', oldScore: 3, newScore: 1 },

    // cat/questions_deep[10] - "간식 서랍을 열지도 않았는데 달려간다?"
    { text: '봉지 부스럭거리는 소리를 들었다.', oldScore: 3, newScore: 1 },

    // dog/questions[7] - "보호자가 울고 있을 때?"
    { text: '옆에 가만히 앉아서 지켜본다.', oldScore: 3, newScore: 1 },

    // dog/questions_deep[7] - "산책 중 낙엽이 굴러갈 때?"
    { text: '바스락 소리에 귀를 쫑긋한다.', oldScore: 3, newScore: 1 },

    // dog/questions_deep[8] - "보호자의 표정 변화를?"
    { text: '목소리 톤이나 행동으로 기분을 파악한다.', oldScore: 3, newScore: 1 },

    // dog/questions_deep[10] - "간식 줄까? 말만 했을 때?"
    { text: '진짜 줄 때까지 기다린다.', oldScore: 3, newScore: 1 },

    // dog/questions_deep[13] - "발을 밟혔을 때?" (1,3 → 1,5)
    { text: '깨갱! 하고 자리를 피한다.', oldScore: 3, newScore: 5 },

    // dog/questions_deep[15] - "칭찬받았을 때?"
    { text: '당당하게 간식을 요구한다.', oldScore: 3, newScore: 1 },

    // dog/questions_deep[22] - "산책 중 갈림길에서?"
    { text: '보호자가 이끄는 대로 잘 따라간다.', oldScore: 3, newScore: 1 }
];

for (const fix of scoreFixes) {
    // 해당 텍스트 근처의 score 값 변경
    const textPattern = fix.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(
        `(text:\\s*['"]${textPattern}['"],\\s*score:\\s*)${fix.oldScore}`,
        'g'
    );

    if (pattern.test(content)) {
        content = content.replace(pattern, `$1${fix.newScore}`);
        console.log(`  ✅ 수정: "${fix.text.slice(0, 25)}..." (${fix.oldScore} → ${fix.newScore})`);
        fixCount++;
    } else {
        console.log(`  ⚠️  건너뜀: "${fix.text.slice(0, 25)}..." (찾을 수 없음)`);
    }
}

// ============================================
// 3. 키워드 중복 수정 - "모임" → 다른 표현
// ============================================
console.log('\n🔤 3. 키워드 중복 수정\n');

// human/inssa 차원에서 "모임"이 2회 사용됨:
// - "파티나 모임에서 나는 주로?"
// - "새로운 모임에 나갔을 때 나의 자기소개 스타일은?"
// 하나를 다른 표현으로 변경

const keywordFix = {
    old: '새로운 모임에 나갔을 때 나의 자기소개 스타일은?',
    new: '처음 만난 사람들 앞에서 나의 자기소개 스타일은?'
};

if (content.includes(keywordFix.old)) {
    content = content.replace(keywordFix.old, keywordFix.new);
    console.log(`  ✅ 수정: "새로운 모임에" → "처음 만난 사람들 앞에서"`);
    fixCount++;
} else {
    console.log(`  ⚠️  건너뜀: 키워드 중복 (이미 수정됨 또는 찾을 수 없음)`);
}

// ============================================
// 파일 저장
// ============================================
fs.writeFileSync(dataPath, content, 'utf8');

console.log(`\n✅ 수정 완료! (${fixCount}개 항목)`);
console.log('\n검증 스크립트를 다시 실행하세요:');
console.log('  node scripts/validate-questions.mjs');
