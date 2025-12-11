/**
 * 리팩토링된 데이터 구조 검증 스크립트
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('=== 리팩토링 검증 시작 ===\n');

// 1. 파일 존재 확인
const requiredFiles = [
    'data/constants.js',
    'data/utils.js',
    'data/config.js',
    'data/index.js',
    'data/subjects/human.js',
    'data/subjects/cat.js',
    'data/subjects/dog.js',
    'data/subjects/rabbit.js',
    'data/subjects/hamster.js',
    'data/subjects/idealType.js',
    'data/subjects/petMatch.js',
    'data/subjects/plant.js',
    'data/subjects/coffee.js'
];

console.log('1. 파일 존재 확인:');
let allFilesExist = true;
for (const file of requiredFiles) {
    const filePath = path.join(projectRoot, file);
    const exists = fs.existsSync(filePath);
    console.log(`   ${exists ? '✓' : '✗'} ${file}`);
    if (!exists) allFilesExist = false;
}

// 2. 각 subject 파일의 데이터 구조 검증
console.log('\n2. Subject 데이터 구조 검증:');
const subjects = ['human', 'cat', 'dog', 'rabbit', 'hamster', 'idealType', 'petMatch', 'plant', 'coffee'];

for (const subject of subjects) {
    const filePath = path.join(projectRoot, `data/subjects/${subject}.js`);
    const content = fs.readFileSync(filePath, 'utf-8');

    // 필수 속성 확인 (따옴표 있는/없는 경우 모두 체크)
    const hasTitle = content.includes('title:') || content.includes('"title"');
    const hasDimensions = content.includes('dimensions:') || content.includes('"dimensions"');
    const hasQuestions = content.includes('questions:') || content.includes('"questions"');
    const hasResultLabels = content.includes('resultLabels:') || content.includes('"resultLabels"');
    const hasWindowExport = content.includes(`window.CHEMI_SUBJECTS.${subject}`);

    const allValid = hasTitle && hasDimensions && hasQuestions && hasResultLabels && hasWindowExport;
    console.log(`   ${allValid ? '✓' : '✗'} ${subject}: title=${hasTitle}, dimensions=${hasDimensions}, questions=${hasQuestions}, resultLabels=${hasResultLabels}, export=${hasWindowExport}`);
}

// 3. constants.js 검증
console.log('\n3. Constants 검증:');
const constantsContent = fs.readFileSync(path.join(projectRoot, 'data/constants.js'), 'utf-8');
const hasMaxScore = constantsContent.includes('MAX_SCORE_PER_QUESTION');
const hasThresholds = constantsContent.includes('LEVEL_THRESHOLDS');
console.log(`   ${hasMaxScore ? '✓' : '✗'} MAX_SCORE_PER_QUESTION`);
console.log(`   ${hasThresholds ? '✓' : '✗'} LEVEL_THRESHOLDS`);

// 4. utils.js 검증
console.log('\n4. Utils 함수 검증:');
const utilsContent = fs.readFileSync(path.join(projectRoot, 'data/utils.js'), 'utf-8');
const hasGetScoreLevel = utilsContent.includes('function getScoreLevel');
const hasMatchResultLabel = utilsContent.includes('function matchResultLabel');
console.log(`   ${hasGetScoreLevel ? '✓' : '✗'} getScoreLevel 함수`);
console.log(`   ${hasMatchResultLabel ? '✓' : '✗'} matchResultLabel 함수`);

// 5. config.js 검증
console.log('\n5. Config 검증:');
const configContent = fs.readFileSync(path.join(projectRoot, 'data/config.js'), 'utf-8');
const hasSubjectConfig = configContent.includes('SUBJECT_CONFIG');
for (const subject of subjects) {
    const hasSubject = configContent.includes(`${subject}:`);
    console.log(`   ${hasSubject ? '✓' : '✗'} ${subject} config`);
}

// 6. 파일 크기 비교
console.log('\n6. 파일 크기 비교:');
const originalSize = fs.statSync(path.join(projectRoot, 'data.js')).size;
let totalNewSize = 0;
for (const file of requiredFiles) {
    const size = fs.statSync(path.join(projectRoot, file)).size;
    totalNewSize += size;
}
console.log(`   원본 data.js: ${(originalSize / 1024).toFixed(1)} KB`);
console.log(`   분리된 파일 합계: ${(totalNewSize / 1024).toFixed(1)} KB`);
console.log(`   차이: ${((totalNewSize - originalSize) / 1024).toFixed(1)} KB (메타데이터/주석 추가)`);

// 7. 질문 수 검증
console.log('\n7. 질문 수 검증:');
for (const subject of subjects) {
    const filePath = path.join(projectRoot, `data/subjects/${subject}.js`);
    const content = fs.readFileSync(filePath, 'utf-8');

    // questions와 questions_deep의 개수 카운트 (따옴표 있는/없는 경우 모두)
    const questionItems = (content.match(/["']?q["']?\s*:\s*["']/g) || []).length;

    console.log(`   ${subject}: ${questionItems}개 질문`);
}

console.log('\n=== 검증 완료 ===');
