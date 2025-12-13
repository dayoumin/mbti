/**
 * data.js 파일 분리 리팩토링 스크립트
 *
 * 현재 구조: data.js (4400+ 줄, 단일 파일)
 * 목표 구조:
 *   data/
 *   ├── constants.js      # 상수 정의
 *   ├── utils.js          # matchResultLabel 등 유틸 함수
 *   ├── config.js         # SUBJECT_CONFIG
 *   ├── subjects/
 *   │   ├── human.js
 *   │   ├── cat.js
 *   │   ├── dog.js
 *   │   ├── rabbit.js
 *   │   ├── hamster.js
 *   │   └── idealType.js
 *   └── index.js          # 통합 export
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 원본 data.js 읽기
const dataJsPath = path.join(projectRoot, 'data.js');
const dataJsContent = fs.readFileSync(dataJsPath, 'utf-8');

// data 폴더 구조 생성
const dataDir = path.join(projectRoot, 'data');
const subjectsDir = path.join(dataDir, 'subjects');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
    console.log('Created: data/');
}
if (!fs.existsSync(subjectsDir)) {
    fs.mkdirSync(subjectsDir);
    console.log('Created: data/subjects/');
}

// 1. constants.js 생성
const constantsContent = `// 케미 테스트 상수 정의
// 생성일: ${new Date().toISOString().split('T')[0]}

const CHEMI_CONSTANTS = {
    // 점수 관련
    MAX_SCORE_PER_QUESTION: 5,
    MIN_SCORE_PER_QUESTION: 1,
    DEFAULT_QUESTION_COUNT: 5,

    // 레벨 판정 기준 (백분율)
    LEVEL_THRESHOLDS: {
        HIGH: 60,    // 60% 이상 = high
        LOW: 40      // 40% 이하 = low, 그 사이 = medium
    },

    // 레벨 값
    LEVELS: {
        HIGH: 'high',
        MEDIUM: 'medium',
        LOW: 'low'
    }
};

window.CHEMI_CONSTANTS = CHEMI_CONSTANTS;
`;

fs.writeFileSync(path.join(dataDir, 'constants.js'), constantsContent, 'utf-8');
console.log('Created: data/constants.js');

// 2. utils.js 생성 (matchResultLabel 함수 추출)
const utilsContent = `// 케미 테스트 유틸리티 함수
// 생성일: ${new Date().toISOString().split('T')[0]}

// 점수 레벨 판정 함수
function getScoreLevel(score, maxScore) {
    const { LEVEL_THRESHOLDS, LEVELS } = window.CHEMI_CONSTANTS;
    const percentage = (score / maxScore) * 100;
    if (percentage >= LEVEL_THRESHOLDS.HIGH) return LEVELS.HIGH;
    if (percentage <= LEVEL_THRESHOLDS.LOW) return LEVELS.LOW;
    return LEVELS.MEDIUM;
}

// 결과 라벨 매칭 함수
function matchResultLabel(scores, dimensions, resultLabels, dimCounts) {
    const { MAX_SCORE_PER_QUESTION, DEFAULT_QUESTION_COUNT } = window.CHEMI_CONSTANTS;

    const levels = {};
    Object.keys(dimensions).forEach(dim => {
        const questionCount = dimCounts[dim] || DEFAULT_QUESTION_COUNT;
        const maxScore = questionCount * MAX_SCORE_PER_QUESTION;
        levels[dim] = getScoreLevel(scores[dim] || 0, maxScore);
    });

    // 완전 일치 찾기
    for (const result of resultLabels) {
        const condition = result.condition;
        let match = true;
        for (const [dim, level] of Object.entries(condition)) {
            if (levels[dim] !== level) {
                match = false;
                break;
            }
        }
        if (match) return result;
    }

    // 부분 매칭 (가장 많이 일치하는 결과)
    let bestMatch = resultLabels[resultLabels.length - 1];
    let bestScore = 0;
    for (const result of resultLabels) {
        const condition = result.condition;
        let matchCount = 0;
        for (const [dim, level] of Object.entries(condition)) {
            if (levels[dim] === level) matchCount++;
        }
        if (matchCount > bestScore) {
            bestScore = matchCount;
            bestMatch = result;
        }
    }
    return bestMatch;
}

window.getScoreLevel = getScoreLevel;
window.matchResultLabel = matchResultLabel;
`;

fs.writeFileSync(path.join(dataDir, 'utils.js'), utilsContent, 'utf-8');
console.log('Created: data/utils.js');

// 3. 각 테스트 데이터 추출 및 파일 생성
const subjects = ['human', 'cat', 'dog', 'rabbit', 'hamster', 'idealType'];

// CHEMI_DATA 객체에서 각 subject 추출
// eval 대신 정규식으로 각 섹션 추출
function extractSubjectData(content, subjectName) {
    // 해당 subject의 시작 위치 찾기
    const startPattern = new RegExp(`^\\s*${subjectName}:\\s*\\{`, 'm');
    const startMatch = content.match(startPattern);
    if (!startMatch) return null;

    const startIdx = content.indexOf(startMatch[0]);

    // 중괄호 매칭으로 끝 위치 찾기
    let braceCount = 0;
    let inString = false;
    let stringChar = '';
    let endIdx = startIdx;

    for (let i = startIdx + startMatch[0].indexOf('{'); i < content.length; i++) {
        const char = content[i];
        const prevChar = content[i - 1];

        if (inString) {
            if (char === stringChar && prevChar !== '\\') {
                inString = false;
            }
        } else {
            if (char === '"' || char === "'") {
                inString = true;
                stringChar = char;
            } else if (char === '{') {
                braceCount++;
            } else if (char === '}') {
                braceCount--;
                if (braceCount === 0) {
                    endIdx = i + 1;
                    break;
                }
            }
        }
    }

    // subject: { ... } 형태로 추출
    const extracted = content.substring(startIdx, endIdx);
    // "subject: {" 에서 "{"만 추출하도록 변환
    const objectContent = extracted.replace(new RegExp(`^\\s*${subjectName}:\\s*`), '');

    return objectContent;
}

// 각 subject 파일 생성
for (const subject of subjects) {
    const subjectData = extractSubjectData(dataJsContent, subject);
    if (subjectData) {
        const subjectContent = `// ${subject} 테스트 데이터
// 생성일: ${new Date().toISOString().split('T')[0]}

const ${subject.toUpperCase()}_DATA = ${subjectData};

window.CHEMI_SUBJECTS = window.CHEMI_SUBJECTS || {};
window.CHEMI_SUBJECTS.${subject} = ${subject.toUpperCase()}_DATA;
`;
        fs.writeFileSync(path.join(subjectsDir, `${subject}.js`), subjectContent, 'utf-8');
        console.log(`Created: data/subjects/${subject}.js`);
    } else {
        console.error(`Failed to extract: ${subject}`);
    }
}

// 4. SUBJECT_CONFIG 추출 및 config.js 생성
const configMatch = dataJsContent.match(/const SUBJECT_CONFIG = \{[\s\S]*?\n\};/);
if (configMatch) {
    const configContent = `// Subject 설정 - 새 테스트 추가시 여기에만 추가하면 됨
// 생성일: ${new Date().toISOString().split('T')[0]}

${configMatch[0]}

window.SUBJECT_CONFIG = SUBJECT_CONFIG;
`;
    fs.writeFileSync(path.join(dataDir, 'config.js'), configContent, 'utf-8');
    console.log('Created: data/config.js');
}

// 5. index.js 생성 (통합 파일)
const indexContent = `// 케미 테스트 데이터 통합 모듈
// 생성일: ${new Date().toISOString().split('T')[0]}
//
// 이 파일은 모든 subject 데이터를 CHEMI_DATA로 통합합니다.
// 개별 파일들이 먼저 로드된 후 이 파일이 로드되어야 합니다.

(function() {
    // CHEMI_SUBJECTS에서 CHEMI_DATA로 통합
    const CHEMI_DATA = {};

    if (window.CHEMI_SUBJECTS) {
        Object.keys(window.CHEMI_SUBJECTS).forEach(key => {
            CHEMI_DATA[key] = window.CHEMI_SUBJECTS[key];
        });
    }

    // 전역 노출
    window.CHEMI_DATA = CHEMI_DATA;

    console.log('CHEMI_DATA loaded:', Object.keys(CHEMI_DATA));
})();
`;

fs.writeFileSync(path.join(dataDir, 'index.js'), indexContent, 'utf-8');
console.log('Created: data/index.js');

// 6. 새로운 index.html 스크립트 로드 순서 생성
const htmlScriptTags = `
    <!-- Data (분리된 구조) -->
    <script src="data/constants.js"></script>
    <script src="data/subjects/human.js"></script>
    <script src="data/subjects/cat.js"></script>
    <script src="data/subjects/dog.js"></script>
    <script src="data/subjects/rabbit.js"></script>
    <script src="data/subjects/hamster.js"></script>
    <script src="data/subjects/idealType.js"></script>
    <script src="data/index.js"></script>
    <script src="data/config.js"></script>
    <script src="data/utils.js"></script>
`;

console.log('\n=== 리팩토링 완료 ===');
console.log('\nindex.html에 다음 스크립트 태그로 교체하세요:');
console.log(htmlScriptTags);
console.log('\n기존 data.js는 백업 후 제거해도 됩니다.');
