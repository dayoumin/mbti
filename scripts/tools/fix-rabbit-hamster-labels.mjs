/**
 * 토끼/햄스터 결과 라벨 수정 스크립트
 * - 누락된 조합 추가
 * - 논리적 모순 수정
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '..', 'data.js');

// 토끼 추가 결과 라벨
const rabbitNewLabels = [
    {
        name: "에너자이저 토끼",
        emoji: "⚡",
        desc: "쉴 틈이 없어! 에너지 폭발!",
        condition: { active: "high", chill: "low" },
        interpretation: "에너지가 넘치고 가만히 있지 못하는 성격입니다. 항상 무언가를 하고 싶어해요.",
        guide: "충분한 운동 공간과 다양한 장난감을 제공해주세요. 에너지를 발산할 수 있는 놀이 시간이 중요해요.",
        mood: "excited",
        color: "bg-orange-100"
    }
];

// 햄스터 수정/추가 결과 라벨
const hamsterFixedLabels = [
    // 기존 "낮잠왕" 수정 - 논리적 모순 해결
    {
        name: "낮잠왕 햄찌",
        emoji: "😴",
        desc: "낮엔 자야지... zzZ",
        condition: { nocturnal: "high" },  // active 조건 제거
        interpretation: "철저한 야행성으로 낮에는 깊이 잠들어 있어요. 밤이 되면 활동을 시작합니다.",
        guide: "낮에 깨우지 마세요. 스트레스를 받을 수 있어요. 밤 활동 시간을 존중해주세요.",
        mood: "happy",
        color: "bg-indigo-100"
    },
    // 새로 추가 - 저장 안 하는 타입
    {
        name: "미니멀리스트 햄찌",
        emoji: "✨",
        desc: "저장? 난 그때그때 먹어!",
        condition: { hoard: "low" },
        interpretation: "저장 본능이 약한 편이에요. 볼주머니를 잘 사용하지 않고 그 자리에서 먹는 걸 선호해요.",
        guide: "먹이가 부족하지 않은지 확인해주세요. 저장을 안 해서 배고플 수 있어요.",
        mood: "happy",
        color: "bg-cyan-100"
    },
    // 새로 추가 - 낮에도 활동하는 타입
    {
        name: "아침형 햄찌",
        emoji: "🌅",
        desc: "낮에도 활동해요!",
        condition: { nocturnal: "low", active: "high" },
        interpretation: "일반적인 햄스터와 달리 낮에도 활동적이에요. 주인과 교감할 기회가 더 많아요.",
        guide: "낮 활동이 건강 문제가 아닌지 확인해주세요. 정상적이라면 함께 놀아주기 좋은 타입이에요.",
        mood: "excited",
        color: "bg-amber-100"
    }
];

// data.js 읽기
let content = fs.readFileSync(dataPath, 'utf-8');

// 토끼 resultLabels 찾아서 수정
// "밸런스 토끼" 앞에 새 라벨 추가
const rabbitBalancePattern = /(\s*\{\s*"name":\s*"밸런스 토끼")/;
const rabbitNewLabelStr = rabbitNewLabels.map(l => JSON.stringify(l, null, 12).replace(/^/gm, '            ')).join(',\n') + ',\n';

if (content.match(rabbitBalancePattern)) {
    content = content.replace(rabbitBalancePattern, ',\n' + rabbitNewLabelStr + '$1');
    console.log('✅ 토끼: "에너자이저 토끼" 추가');
} else {
    console.log('⚠️ 토끼 밸런스 라벨을 찾을 수 없음');
}

// 햄스터 "낮잠왕" 수정
const oldSleepyPattern = /"name":\s*"낮잠왕 햄찌"[\s\S]*?"condition":\s*\{\s*"nocturnal":\s*"high",\s*"active":\s*"low"\s*\}/;
const newSleepyCondition = '"name": "낮잠왕 햄찌",\n                "emoji": "😴",\n                "desc": "낮엔 자야지... zzZ",\n                "condition": { "nocturnal": "high" }';

if (content.match(oldSleepyPattern)) {
    content = content.replace(oldSleepyPattern, newSleepyCondition);
    console.log('✅ 햄스터: "낮잠왕" 조건 수정 (active:low 제거)');
}

// 햄스터 "균형잡힌 햄찌" 앞에 새 라벨 추가
const hamsterBalancePattern = /(\s*\{\s*"name":\s*"균형잡힌 햄찌")/;
const hamsterNewLabelsStr = hamsterFixedLabels.slice(1).map(l => JSON.stringify(l, null, 12).replace(/^/gm, '            ')).join(',\n') + ',\n';

if (content.match(hamsterBalancePattern)) {
    content = content.replace(hamsterBalancePattern, ',\n' + hamsterNewLabelsStr + '$1');
    console.log('✅ 햄스터: "미니멀리스트 햄찌", "아침형 햄찌" 추가');
} else {
    console.log('⚠️ 햄스터 균형 라벨을 찾을 수 없음');
}

// 파일 저장
fs.writeFileSync(dataPath, content, 'utf-8');

console.log('\n✅ 결과 라벨 수정 완료!');
console.log('다음 단계: node scripts/validate-questions.mjs');
