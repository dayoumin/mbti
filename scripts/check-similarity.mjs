/**
 * 하이브리드 유사도 검사 스크립트
 *
 * 1단계: Jaccard (빠른 필터) - 키워드 기반
 * 2단계: 임베딩 (정밀 검사) - 의미 기반 (Ollama 필요)
 *
 * 사용법: node scripts/check-similarity.mjs [--jaccard-only]
 *
 * 옵션:
 *   --jaccard-only  임베딩 검사 건너뛰기 (Ollama 없을 때 자동)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 설정
const CONFIG = {
    ollamaUrl: 'http://localhost:11434',
    embeddingModel: 'qwen3-embedding:4b',
    thresholds: {
        jaccard: {
            error: 0.6,
            warn: 0.45,
            info: 0.35
        },
        embedding: {
            error: 0.90,
            warn: 0.80,
            info: 0.70
        }
    },
    cacheFile: path.join(__dirname, 'embeddings', 'questions.json')
};

// 유틸리티 함수
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
    aSet.forEach(t => { if (bSet.has(t)) inter++; });
    const union = aSet.size + bSet.size - inter;
    return union === 0 ? 0 : inter / union;
}

function cosineSimilarity(a, b) {
    if (!a || !b || a.length !== b.length) return 0;
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
}

// Ollama 관련 함수
async function checkOllama() {
    try {
        const response = await fetch(`${CONFIG.ollamaUrl}/api/tags`);
        if (!response.ok) return false;
        const data = await response.json();
        return data.models?.some(m => m.name.includes('embedding')) || false;
    } catch {
        return false;
    }
}

async function getEmbedding(text) {
    try {
        const response = await fetch(`${CONFIG.ollamaUrl}/api/embed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: CONFIG.embeddingModel,
                input: text
            })
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.embeddings?.[0] || null;
    } catch {
        return null;
    }
}

// 캐시 관리
function loadCache() {
    try {
        if (fs.existsSync(CONFIG.cacheFile)) {
            return JSON.parse(fs.readFileSync(CONFIG.cacheFile, 'utf8'));
        }
    } catch {}
    return {};
}

function saveCache(cache) {
    const dir = path.dirname(CONFIG.cacheFile);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG.cacheFile, JSON.stringify(cache, null, 2), 'utf8');
}

// 질문 로드
function loadQuestions() {
    const dataPath = path.join(__dirname, '..', 'data.js');
    const dataContent = fs.readFileSync(dataPath, 'utf8');
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

    const questions = [];
    ['human', 'cat', 'dog'].forEach(mode => {
        const modeData = CHEMI_DATA[mode];
        if (!modeData) return;

        modeData.questions?.forEach((q, idx) => {
            questions.push({
                text: q.q,
                dimension: q.dimension,
                location: `${mode}/questions[${idx}]`,
                mode
            });
        });

        modeData.questions_deep?.forEach((q, idx) => {
            questions.push({
                text: q.q,
                dimension: q.dimension,
                location: `${mode}/questions_deep[${idx}]`,
                mode
            });
        });
    });

    return questions;
}

// 메인 검사 로직
async function runCheck(jaccardOnly = false) {
    console.log('🔍 하이브리드 유사도 검사 시작...\n');

    const questions = loadQuestions();
    console.log(`📊 총 ${questions.length}개 질문 분석 중...\n`);

    // Ollama 확인
    let useEmbedding = !jaccardOnly;
    if (useEmbedding) {
        const ollamaAvailable = await checkOllama();
        if (!ollamaAvailable) {
            console.log('⚠️  Ollama 미감지 → Jaccard 전용 모드\n');
            useEmbedding = false;
        } else {
            console.log(`✅ Ollama 감지됨 → 하이브리드 모드 (${CONFIG.embeddingModel})\n`);
        }
    }

    const results = {
        errors: [],
        warnings: [],
        infos: []
    };

    // 1단계: Jaccard 검사 (차원별)
    console.log('━━━ 1단계: Jaccard 유사도 검사 ━━━\n');

    const byDimension = {};
    questions.forEach(q => {
        const key = `${q.mode}/${q.dimension}`;
        if (!byDimension[key]) byDimension[key] = [];
        byDimension[key].push({
            ...q,
            tokens: normalizeTokens(q.text || '')
        });
    });

    const jaccardCandidates = []; // 임베딩 검사 후보

    Object.entries(byDimension).forEach(([dimKey, list]) => {
        for (let i = 0; i < list.length; i++) {
            for (let j = i + 1; j < list.length; j++) {
                const a = list[i];
                const b = list[j];
                const sim = jaccardSimilarity(a.tokens, b.tokens);

                if (sim >= CONFIG.thresholds.jaccard.error) {
                    results.errors.push({
                        type: 'jaccard',
                        similarity: sim,
                        a: { location: a.location, text: a.text },
                        b: { location: b.location, text: b.text }
                    });
                } else if (sim >= CONFIG.thresholds.jaccard.warn) {
                    results.warnings.push({
                        type: 'jaccard',
                        similarity: sim,
                        a: { location: a.location, text: a.text },
                        b: { location: b.location, text: b.text }
                    });
                    jaccardCandidates.push([a, b]);
                } else if (sim >= CONFIG.thresholds.jaccard.info) {
                    results.infos.push({
                        type: 'jaccard',
                        similarity: sim,
                        a: { location: a.location, text: a.text },
                        b: { location: b.location, text: b.text }
                    });
                }
            }
        }
    });

    console.log(`   Jaccard 결과: 오류 ${results.errors.length}개, 경고 ${results.warnings.length}개, 정보 ${results.infos.length}개\n`);

    // 2단계: 임베딩 검사
    if (useEmbedding) {
        console.log('━━━ 2단계: 임베딩 유사도 검사 ━━━\n');

        const cache = loadCache();
        let cacheUpdated = false;

        // 모든 질문 임베딩 생성
        console.log('   임베딩 생성 중...');
        for (const q of questions) {
            if (!cache[q.text]) {
                const embedding = await getEmbedding(q.text);
                if (embedding) {
                    cache[q.text] = embedding;
                    cacheUpdated = true;
                    process.stdout.write('.');
                } else {
                    process.stdout.write('x');
                }
            }
        }
        console.log(' 완료\n');

        if (cacheUpdated) {
            saveCache(cache);
            console.log(`   💾 캐시 저장됨: ${Object.keys(cache).length}개 임베딩\n`);
        }

        // 차원별 임베딩 유사도 검사
        const embeddingResults = {
            errors: [],
            warnings: [],
            infos: []
        };

        Object.entries(byDimension).forEach(([dimKey, list]) => {
            for (let i = 0; i < list.length; i++) {
                for (let j = i + 1; j < list.length; j++) {
                    const a = list[i];
                    const b = list[j];
                    const embA = cache[a.text];
                    const embB = cache[b.text];

                    if (!embA || !embB) continue;

                    const sim = cosineSimilarity(embA, embB);

                    if (sim >= CONFIG.thresholds.embedding.error) {
                        embeddingResults.errors.push({
                            type: 'embedding',
                            similarity: sim,
                            a: { location: a.location, text: a.text },
                            b: { location: b.location, text: b.text }
                        });
                    } else if (sim >= CONFIG.thresholds.embedding.warn) {
                        embeddingResults.warnings.push({
                            type: 'embedding',
                            similarity: sim,
                            a: { location: a.location, text: a.text },
                            b: { location: b.location, text: b.text }
                        });
                    } else if (sim >= CONFIG.thresholds.embedding.info) {
                        embeddingResults.infos.push({
                            type: 'embedding',
                            similarity: sim,
                            a: { location: a.location, text: a.text },
                            b: { location: b.location, text: b.text }
                        });
                    }
                }
            }
        });

        console.log(`   임베딩 결과: 오류 ${embeddingResults.errors.length}개, 경고 ${embeddingResults.warnings.length}개, 정보 ${embeddingResults.infos.length}개\n`);

        // 결과 병합 (중복 제거)
        const seen = new Set();
        [...embeddingResults.errors, ...embeddingResults.warnings].forEach(r => {
            const key = [r.a.location, r.b.location].sort().join('|');
            if (!seen.has(key)) {
                seen.add(key);
                if (r.similarity >= CONFIG.thresholds.embedding.error) {
                    results.errors.push(r);
                } else {
                    results.warnings.push(r);
                }
            }
        });
    }

    // 결과 출력
    console.log('\n' + '═'.repeat(60));
    console.log('📊 검사 결과 요약');
    console.log('═'.repeat(60) + '\n');

    if (results.errors.length > 0) {
        console.log(`❌ 오류 (${results.errors.length}개) - 중복 가능성 높음:\n`);
        results.errors.forEach((r, i) => {
            console.log(`   ${i + 1}. [${r.type}] similarity: ${r.similarity.toFixed(2)}`);
            console.log(`      - ${r.a.location}: "${r.a.text.substring(0, 40)}..."`);
            console.log(`      - ${r.b.location}: "${r.b.text.substring(0, 40)}..."`);
            console.log('');
        });
    }

    if (results.warnings.length > 0) {
        console.log(`⚠️  경고 (${results.warnings.length}개) - 검토 필요:\n`);
        results.warnings.slice(0, 10).forEach((r, i) => {
            console.log(`   ${i + 1}. [${r.type}] similarity: ${r.similarity.toFixed(2)}`);
            console.log(`      - ${r.a.location}: "${r.a.text.substring(0, 40)}..."`);
            console.log(`      - ${r.b.location}: "${r.b.text.substring(0, 40)}..."`);
            console.log('');
        });
        if (results.warnings.length > 10) {
            console.log(`   ... 외 ${results.warnings.length - 10}개\n`);
        }
    }

    if (results.infos.length > 0) {
        console.log(`ℹ️  정보 (${results.infos.length}개) - 참고용\n`);
    }

    // 최종 결과
    console.log('═'.repeat(60));
    const totalIssues = results.errors.length + results.warnings.length;
    if (results.errors.length > 0) {
        console.log(`❌ 검사 완료: ${results.errors.length}개 오류 발견`);
        process.exit(1);
    } else if (results.warnings.length > 0) {
        console.log(`⚠️  검사 완료: ${results.warnings.length}개 검토 필요`);
    } else {
        console.log('✅ 검사 완료: 유사 질문 없음!');
    }
    console.log('═'.repeat(60) + '\n');
}

// 실행
const args = process.argv.slice(2);
const jaccardOnly = args.includes('--jaccard-only');

runCheck(jaccardOnly).catch(console.error);
