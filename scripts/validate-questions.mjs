/**
 * 질문 검증 스크립트
 *
 * 사용법: node scripts/validate-questions.mjs
 *
 * 검증 항목:
 * - 필수 필드 존재 여부
 * - 점수 체계 (1, 5)
 * - 질문 형식 (? 종료)
 * - 차원별 최소 질문 수
 * - 중복 검사
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// data.js 파일 읽기
const dataPath = path.join(__dirname, '..', 'data.js');
const dataContent = fs.readFileSync(dataPath, 'utf8');

// CHEMI_DATA 추출
const dataMatch = dataContent.match(/const CHEMI_DATA = (\{[\s\S]*?\});/);
if (!dataMatch) {
    console.error('❌ CHEMI_DATA를 찾을 수 없습니다.');
    process.exit(1);
}

let CHEMI_DATA;
try {
    CHEMI_DATA = eval('(' + dataMatch[1] + ')');
} catch (e) {
    console.error('❌ CHEMI_DATA 파싱 실패:', e.message);
    process.exit(1);
}

// 모드별 유효한 차원
const VALID_DIMENSIONS = {
    human: ['inssa', 'adventure', 'empathy', 'plan', 'mental'],
    cat: ['curious', 'alert', 'boss', 'random', 'cute'],
    dog: ['energy', 'humanLove', 'dogFriend', 'focus', 'brave', 'persist'],
    rabbit: ['curious', 'social', 'active', 'brave', 'chill'],
    hamster: ['curious', 'hoard', 'active', 'tame', 'nocturnal']
};

// 모드별 최소 질문 수
const MIN_QUESTIONS = {
    human: { perDim: 6, basic: 3 },
    cat: { perDim: 4, basic: 2 },
    dog: { perDim: 4, basic: 2 },
    rabbit: { perDim: 4, basic: 2 },
    hamster: { perDim: 4, basic: 2 }
};

const errors = [];
const warnings = [];
const infos = [];
const stats = {};

// 유사도 임계값 설정 (Jaccard)
const SIMILARITY_THRESHOLDS = {
    error: 0.6,
    warn: 0.45,
    info: 0.35
};

// 차원별 키워드 과다 사용 체크 리스트
const KEYWORD_LISTS = {
    inssa: ['파티', '모임', '회식', '동창회', '술자리']
};

function normalizeTokens(text) {
    return Array.from(
        new Set(
            text
                .toLowerCase()
                .replace(/[^\p{L}\p{N}\s]/gu, ' ')
                .split(/\s+/)
                .filter(Boolean)
        )
    );
}

function jaccardSimilarity(aTokens, bTokens) {
    if (aTokens.length === 0 || bTokens.length === 0) return 0;
    const aSet = new Set(aTokens);
    const bSet = new Set(bTokens);
    let inter = 0;
    aSet.forEach(t => {
        if (bSet.has(t)) inter++;
    });
    const union = aSet.size + bSet.size - inter;
    return union === 0 ? 0 : inter / union;
}

function validateQuestion(q, location) {
    const localErrors = [];

    // 필수 필드 검증
    if (!q.q) localErrors.push(`질문 텍스트 누락`);
    if (!q.dimension) localErrors.push(`dimension 누락`);
    if (!q.a) localErrors.push(`답변 배열 누락`);

    // 답변 검증
    if (q.a) {
        if (q.a.length !== 2) {
            localErrors.push(`답변은 정확히 2개여야 함 (현재: ${q.a.length}개)`);
        } else {
            // 답변 텍스트 검증
            q.a.forEach((ans, i) => {
                if (!ans.text) localErrors.push(`답변 ${i+1} 텍스트 누락`);
                if (ans.text && ans.text.length > 60) {
                    warnings.push(`${location}: 답변 ${i+1}이 길어요 (${ans.text.length}자)`);
                }
            });

            // 점수 검증 (1-5 범위, 두 점수가 달라야 함)
            const scores = q.a.map(a => a.score).sort((a, b) => a - b);
            const [lowScore, highScore] = scores;

            // 점수가 1-5 범위인지 확인
            if (lowScore < 1 || lowScore > 5 || highScore < 1 || highScore > 5) {
                localErrors.push(`점수는 1~5 범위여야 함 (현재: ${scores.join(', ')})`);
            }
            // 두 점수가 같으면 안됨
            else if (lowScore === highScore) {
                localErrors.push(`두 답변의 점수가 같으면 안 됨 (현재: ${scores.join(', ')})`);
            }
            // 권장: 1과 5 사용 (경고만)
            else if (lowScore !== 1 || highScore !== 5) {
                warnings.push(`${location}: 권장 점수는 1과 5 (현재: ${scores.join(', ')})`);
            }
        }
    }

    // 질문 형식 검증
    if (q.q) {
        if (!q.q.endsWith('?')) {
            warnings.push(`${location}: 질문이 ?로 끝나지 않음`);
        }
        // 한글은 짧아도 의미 전달 가능 (최소 5자)
        if (q.q.length < 5) {
            localErrors.push(`질문이 너무 짧음 (${q.q.length}자, 최소 5자)`);
        }
        if (q.q.length > 80) {
            warnings.push(`${location}: 질문이 길어요 (${q.q.length}자)`);
        }
    }

    return localErrors;
}

function validateMode(mode, modeData) {
    console.log(`\n📋 ${mode.toUpperCase()} 모드 검증 중...`);

    const validDimensions = VALID_DIMENSIONS[mode];
    const minReq = MIN_QUESTIONS[mode];
    const dimCounts = {};
    const allQuestions = [];

    validDimensions.forEach(dim => dimCounts[dim] = { basic: 0, deep: 0 });

    // 기본 질문 검증
    if (modeData.questions) {
        modeData.questions.forEach((q, idx) => {
            const location = `${mode}/questions[${idx}]`;

            // 차원 유효성 검증
            if (q.dimension && !validDimensions.includes(q.dimension)) {
                errors.push(`${location}: 잘못된 dimension "${q.dimension}"`);
            } else if (q.dimension) {
                dimCounts[q.dimension].basic++;
            }

            // 개별 질문 검증
            const qErrors = validateQuestion(q, location);
            qErrors.forEach(e => errors.push(`${location}: ${e}`));

            allQuestions.push({ ...q, location, tokens: normalizeTokens(q.q || '') });
        });
    }

    // 심화 질문 검증
    if (modeData.questions_deep) {
        modeData.questions_deep.forEach((q, idx) => {
            const location = `${mode}/questions_deep[${idx}]`;

            if (q.dimension && !validDimensions.includes(q.dimension)) {
                errors.push(`${location}: 잘못된 dimension "${q.dimension}"`);
            } else if (q.dimension) {
                dimCounts[q.dimension].deep++;
            }

            const qErrors = validateQuestion(q, location);
            qErrors.forEach(e => errors.push(`${location}: ${e}`));

            allQuestions.push({ ...q, location, tokens: normalizeTokens(q.q || '') });
        });
    }

    // 차원별 질문 수 검증
    console.log('\n  차원별 질문 수:');
    validDimensions.forEach(dim => {
        const basic = dimCounts[dim].basic;
        const deep = dimCounts[dim].deep;
        const total = basic + deep;
        const dimInfo = modeData.dimensions?.[dim];
        const emoji = dimInfo?.emoji || '•';
        const name = dimInfo?.name || dim;

        const status = total >= minReq.perDim ? '✅' : '⚠️';
        console.log(`    ${status} ${emoji} ${name}: 기본 ${basic}개 + 심화 ${deep}개 = 총 ${total}개`);

        if (total < minReq.perDim) {
            warnings.push(`${mode}/${dim}: 질문 부족 (${total}개, 최소 ${minReq.perDim}개 권장)`);
        }
        if (basic < minReq.basic) {
            errors.push(`${mode}/${dim}: 기본 질문 부족 (${basic}개, 최소 ${minReq.basic}개 필요)`);
        }
    });

    // 중복 질문 검사 (정확히 동일한 문장)
    const questionTexts = allQuestions.map(q => q.q);
    const seen = new Map();
    questionTexts.forEach((text, idx) => {
        if (seen.has(text)) {
            errors.push(`중복 질문 발견: "${text.substring(0, 30)}..." (${allQuestions[seen.get(text)].location}, ${allQuestions[idx].location})`);
        } else {
            seen.set(text, idx);
        }
    });

    // 유사도 검사 (차원별 Jaccard)
    console.log('\n  유사도 검사 (차원별):');
    const bucketsByDim = {};
    allQuestions.forEach(q => {
        if (!q.dimension) return;
        bucketsByDim[q.dimension] = bucketsByDim[q.dimension] || [];
        bucketsByDim[q.dimension].push(q);
    });

    Object.entries(bucketsByDim).forEach(([dim, list]) => {
        for (let i = 0; i < list.length; i++) {
            for (let j = i + 1; j < list.length; j++) {
                const a = list[i];
                const b = list[j];
                const sim = jaccardSimilarity(a.tokens, b.tokens);
                if (sim >= SIMILARITY_THRESHOLDS.error) {
                    errors.push(`${dim}: 유사도 높음 (${sim.toFixed(2)}) - ${a.location} vs ${b.location}`);
                } else if (sim >= SIMILARITY_THRESHOLDS.warn) {
                    warnings.push(`${dim}: 유사한 질문 (${sim.toFixed(2)}) - ${a.location} vs ${b.location}`);
                } else if (sim >= SIMILARITY_THRESHOLDS.info) {
                    infos.push(`${dim}: 약간 유사 (${sim.toFixed(2)}) - ${a.location} vs ${b.location}`);
                }
            }
        }
    });

    // 키워드 과다 사용 경고 (차원별)
    console.log('  키워드 중복 검사:');
    Object.entries(KEYWORD_LISTS).forEach(([dim, keywords]) => {
        const list = bucketsByDim[dim] || [];
        if (list.length === 0) return;
        const counts = {};
        list.forEach(q => {
            keywords.forEach(k => {
                if (q.q && q.q.includes(k)) {
                    counts[k] = (counts[k] || 0) + 1;
                }
            });
        });
        Object.entries(counts).forEach(([kw, count]) => {
            if (count >= 2) {
                warnings.push(`${mode}/${dim}: 키워드 과다 사용 "${kw}" (${count}회)`);
            }
        });
    });

    // 통계 저장
    stats[mode] = {
        basic: modeData.questions?.length || 0,
        deep: modeData.questions_deep?.length || 0,
        total: (modeData.questions?.length || 0) + (modeData.questions_deep?.length || 0),
        dimCounts
    };
}

// 메인 실행
console.log('🔍 질문 데이터 검증 시작...\n');
console.log('=' .repeat(50));

['human', 'cat', 'dog', 'rabbit', 'hamster'].forEach(mode => {
    if (CHEMI_DATA[mode]) {
        validateMode(mode, CHEMI_DATA[mode]);
    } else {
        errors.push(`${mode} 모드 데이터 없음`);
    }
});

// 결과 출력
console.log('\n' + '=' .repeat(50));
console.log('\n📊 검증 결과 요약\n');

// 통계 출력
console.log('┌─────────┬───────┬───────┬───────┐');
console.log('│  모드   │ 기본  │ 심화  │  총합 │');
console.log('├─────────┼───────┼───────┼───────┤');
Object.entries(stats).forEach(([mode, s]) => {
    const modeLabel = mode.padEnd(7);
    console.log(`│ ${modeLabel} │ ${String(s.basic).padStart(5)} │ ${String(s.deep).padStart(5)} │ ${String(s.total).padStart(5)} │`);
});
const totalBasic = Object.values(stats).reduce((sum, s) => sum + s.basic, 0);
const totalDeep = Object.values(stats).reduce((sum, s) => sum + s.deep, 0);
const grandTotal = totalBasic + totalDeep;
console.log('├─────────┼───────┼───────┼───────┤');
console.log(`│ 전체    │ ${String(totalBasic).padStart(5)} │ ${String(totalDeep).padStart(5)} │ ${String(grandTotal).padStart(5)} │`);
console.log('└─────────┴───────┴───────┴───────┘');

// 에러 출력
if (errors.length > 0) {
    console.log(`\n❌ 오류 (${errors.length}개):`);
    errors.forEach(e => console.log(`   • ${e}`));
}

// 경고 출력
if (warnings.length > 0) {
    console.log(`\n⚠️  경고 (${warnings.length}개):`);
    warnings.forEach(w => console.log(`   • ${w}`));
}

// 정보성 알림 출력
if (infos.length > 0) {
    console.log(`\nℹ️  정보 (${infos.length}개):`);
    infos.forEach(i => console.log(`   • ${i}`));
}

// 최종 결과
console.log('\n' + '=' .repeat(50));
if (errors.length === 0) {
    console.log('✅ 검증 완료: 오류 없음!');
} else {
    console.log(`❌ 검증 완료: ${errors.length}개 오류 발견`);
    process.exit(1);
}

if (warnings.length > 0) {
    console.log(`   (${warnings.length}개 경고 확인 필요)`);
}
console.log('');
