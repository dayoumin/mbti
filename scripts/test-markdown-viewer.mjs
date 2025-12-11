/**
 * 마크다운 뷰어 기능 테스트
 * - admin.html의 마크다운 뷰어 관련 코드 검증
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✅ ${name}`);
        passed++;
    } catch (error) {
        console.log(`❌ ${name}`);
        console.log(`   → ${error.message}`);
        failed++;
    }
}

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

// admin.html 읽기
const adminHtml = readFileSync(join(projectRoot, 'admin.html'), 'utf-8');

console.log('\n🧪 마크다운 뷰어 테스트\n');
console.log('='.repeat(50));

// 1. marked.js 라이브러리 로드 테스트
test('marked.js CDN이 포함되어 있어야 함', () => {
    assert(
        adminHtml.includes('cdn.jsdelivr.net/npm/marked'),
        'marked.js CDN이 없습니다'
    );
});

// 2. 모달 HTML 구조 테스트
test('마크다운 모달 요소가 존재해야 함', () => {
    assert(
        adminHtml.includes('id="markdown-modal"'),
        'markdown-modal 요소가 없습니다'
    );
});

test('모달 타이틀 요소가 존재해야 함', () => {
    assert(
        adminHtml.includes('id="markdown-modal-title"'),
        'markdown-modal-title 요소가 없습니다'
    );
});

test('모달 콘텐츠 요소가 존재해야 함', () => {
    assert(
        adminHtml.includes('id="markdown-modal-content"'),
        'markdown-modal-content 요소가 없습니다'
    );
});

// 3. JavaScript 함수 테스트
test('openMarkdownViewer 함수가 정의되어 있어야 함', () => {
    assert(
        adminHtml.includes('function openMarkdownViewer'),
        'openMarkdownViewer 함수가 없습니다'
    );
});

test('closeMarkdownViewer 함수가 정의되어 있어야 함', () => {
    assert(
        adminHtml.includes('function closeMarkdownViewer'),
        'closeMarkdownViewer 함수가 없습니다'
    );
});

test('ESC 키 이벤트 핸들러가 있어야 함', () => {
    assert(
        adminHtml.includes("key === 'Escape'"),
        'ESC 키 핸들러가 없습니다'
    );
});

// 4. 문서 버튼 테스트
const docButtons = [
    { path: 'docs/planning/QUESTION_BANK.md', title: '문제은행 시스템' },
    { path: 'docs/research/QUESTION_COUNT_RESEARCH.md', title: '적정 문항 수 연구' },
    { path: 'docs/design/PSYCHOLOGY_TEST_DESIGN_SYSTEM.md', title: '심리 테스트 디자인' },
    { path: 'docs/LEGAL_COMPLIANCE.md', title: '법적 준수' }
];

test('모든 문서 버튼이 openMarkdownViewer를 호출해야 함', () => {
    for (const doc of docButtons) {
        assert(
            adminHtml.includes(`openMarkdownViewer('${doc.path}'`),
            `${doc.title} 버튼이 openMarkdownViewer를 호출하지 않습니다`
        );
    }
});

test('문서 링크가 <a> 태그가 아닌 <button>으로 변경되어야 함', () => {
    // 문서 섹션에서 직접 href로 .md 파일 링크하는 것이 없어야 함
    const docsSection = adminHtml.match(/id="panel-docs"[\s\S]*?(?=<div id="panel-|$)/);
    if (docsSection) {
        const hasDirectMdLink = /href=["'][^"']*\.md["']/.test(docsSection[0]);
        assert(!hasDirectMdLink, '문서 섹션에 직접 .md 링크가 남아있습니다');
    }
});

// 5. CSS 스타일 테스트
test('markdown-body 스타일이 정의되어 있어야 함', () => {
    assert(
        adminHtml.includes('.markdown-body'),
        'markdown-body CSS 클래스가 없습니다'
    );
});

test('다크모드 마크다운 스타일이 있어야 함', () => {
    assert(
        adminHtml.includes('.dark .markdown-body'),
        '다크모드 markdown-body 스타일이 없습니다'
    );
});

test('코드 블록 스타일이 있어야 함', () => {
    assert(
        adminHtml.includes('.markdown-body pre') &&
        adminHtml.includes('.markdown-body code'),
        '코드 블록 스타일이 없습니다'
    );
});

test('테이블 스타일이 있어야 함', () => {
    assert(
        adminHtml.includes('.markdown-body table') &&
        adminHtml.includes('.markdown-body th') &&
        adminHtml.includes('.markdown-body td'),
        '테이블 스타일이 없습니다'
    );
});

// 6. 문서 파일 존재 여부 테스트
console.log('\n' + '='.repeat(50));
console.log('📁 문서 파일 존재 여부\n');

for (const doc of docButtons) {
    const filePath = join(projectRoot, doc.path);
    test(`${doc.title} 파일이 존재해야 함`, () => {
        assert(existsSync(filePath), `${doc.path} 파일이 없습니다`);
    });
}

// 7. 모달 UX 테스트
console.log('\n' + '='.repeat(50));
console.log('🎨 UX 요소 테스트\n');

test('모달 배경 클릭으로 닫기가 가능해야 함', () => {
    assert(
        adminHtml.includes('onclick="closeMarkdownViewer()"') &&
        adminHtml.includes('bg-black/50'),
        '배경 클릭 닫기 기능이 없습니다'
    );
});

test('닫기 버튼이 있어야 함', () => {
    // X 아이콘 SVG path 확인
    assert(
        adminHtml.includes('M6 18L18 6M6 6l12 12'),
        '닫기 버튼(X)이 없습니다'
    );
});

test('로딩 스피너가 있어야 함', () => {
    assert(
        adminHtml.includes('animate-spin') &&
        adminHtml.includes('문서를 불러오는 중'),
        '로딩 스피너가 없습니다'
    );
});

test('에러 처리가 있어야 함', () => {
    assert(
        adminHtml.includes('문서를 불러올 수 없습니다'),
        '에러 메시지 처리가 없습니다'
    );
});

// 8. marked.parse 호출 확인
test('marked.parse()가 호출되어야 함', () => {
    assert(
        adminHtml.includes('marked.parse('),
        'marked.parse() 호출이 없습니다'
    );
});

// 결과 출력
console.log('\n' + '='.repeat(50));
console.log(`\n📊 테스트 결과: ${passed} 통과, ${failed} 실패\n`);

if (failed > 0) {
    process.exit(1);
}
