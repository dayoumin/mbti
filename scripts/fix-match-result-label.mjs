/**
 * matchResultLabel 함수 버그 수정
 *
 * 문제: App.js에서 dimCounts (객체)를 전달하지만
 *       함수에서는 questionsPerDim * 5로 숫자처럼 사용
 *
 * 수정: 차원별 질문 수를 객체로 받아 각 차원의 maxScore를 개별 계산
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '..', 'data.js');

console.log('🔧 matchResultLabel 함수 버그 수정\n');

// data.js 읽기
let content = fs.readFileSync(dataPath, 'utf-8');

// 기존 함수 패턴
const oldFunction = `// 결과 라벨 매칭 함수
function matchResultLabel(scores, dimensions, resultLabels, questionsPerDim) {
    const levels = {};
    Object.keys(dimensions).forEach(dim => {
        const maxScore = questionsPerDim * 5;
        levels[dim] = getScoreLevel(scores[dim] || 0, maxScore);
    });`;

// 수정된 함수
const newFunction = `// 결과 라벨 매칭 함수
function matchResultLabel(scores, dimensions, resultLabels, dimCounts) {
    const levels = {};
    Object.keys(dimensions).forEach(dim => {
        // dimCounts는 객체: { curious: 6, alert: 6, ... }
        const questionCount = dimCounts[dim] || 5;  // 기본값 5
        const maxScore = questionCount * 5;
        levels[dim] = getScoreLevel(scores[dim] || 0, maxScore);
    });`;

if (content.includes(oldFunction)) {
    content = content.replace(oldFunction, newFunction);
    console.log('✅ matchResultLabel 함수 수정 완료');
    console.log('   - questionsPerDim (숫자) → dimCounts (객체)');
    console.log('   - 차원별 질문 수를 개별적으로 조회');
} else {
    console.log('⚠️  기존 함수 패턴을 찾을 수 없습니다.');
    console.log('   수동으로 확인이 필요합니다.');
    process.exit(1);
}

// 파일 저장
fs.writeFileSync(dataPath, content, 'utf-8');

console.log('\n✅ 수정 완료!');
console.log('다음 단계: node scripts/test-app-data.mjs');
