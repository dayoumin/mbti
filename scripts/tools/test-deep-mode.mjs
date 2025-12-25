/**
 * 심화 테스트 모드 동작 검증
 * - 기본 테스트 완료 후 심화 버튼 클릭 시 올바른 질문부터 시작하는지 확인
 */

import { chromium } from 'playwright';

const BASE_URL = 'http://127.0.0.1:8765';

async function testDeepMode() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // 콘솔 로그 캡처
    const logs = [];
    page.on('console', msg => {
        logs.push({ type: msg.type(), text: msg.text() });
    });

    try {
        console.log('=== 심화 테스트 모드 검증 ===\n');

        await page.goto(BASE_URL);
        // 앱이 로드될 때까지 대기 (시작하기 버튼이 나타날 때까지)
        await page.waitForSelector('button:has-text("시작")', { timeout: 15000 });

        // idealType 탭 클릭
        console.log('1. idealType(이상형) 테스트 선택...');
        await page.click('button:has-text("이상형")');
        await page.waitForTimeout(500);

        // 시작 버튼 클릭
        console.log('2. 테스트 시작...');
        await page.click('button:has-text("시작")');
        await page.waitForTimeout(500);

        // 첫 질문 확인
        const firstQuestion = await page.locator('h2').first().textContent();
        console.log(`   첫 번째 질문: "${firstQuestion}"`);

        // 질문 번호 확인
        const questionNum = await page.locator('text=/Q\\d+/').first().textContent();
        console.log(`   질문 번호: ${questionNum}`);

        // 진행률 확인
        const progress = await page.locator('text=/\\d+\\/\\d+/').first().textContent();
        console.log(`   진행률: ${progress}`);

        // 기본 질문 12개 답변
        console.log('\n3. 기본 질문 12개 답변 중...');
        for (let i = 0; i < 12; i++) {
            // 첫 번째 답변 선택
            await page.click('.space-y-4 button:first-child');
            await page.waitForTimeout(100);
        }

        // 로딩 대기
        await page.waitForTimeout(2500);

        // 결과 화면 확인
        console.log('\n4. 결과 화면 확인...');
        const resultTitle = await page.locator('h2.text-2xl').first().textContent().catch(() => 'N/A');
        console.log(`   결과: ${resultTitle}`);

        // 심화 버튼 확인
        const deepButton = page.locator('button:has-text("이게 다가 아니다")');
        const deepButtonExists = await deepButton.isVisible().catch(() => false);
        console.log(`   심화 버튼 존재: ${deepButtonExists}`);

        if (deepButtonExists) {
            const deepButtonText = await deepButton.textContent();
            console.log(`   심화 버튼 텍스트: ${deepButtonText}`);

            // 심화 버튼 클릭
            console.log('\n5. 심화 테스트 시작...');
            await deepButton.click();
            await page.waitForTimeout(500);

            // 심화 모드 첫 질문 확인
            const deepFirstQuestion = await page.locator('h2').first().textContent();
            console.log(`   심화 첫 질문: "${deepFirstQuestion}"`);

            // 질문 번호 확인
            const deepQuestionNum = await page.locator('text=/Q\\d+/').first().textContent();
            console.log(`   질문 번호: ${deepQuestionNum}`);

            // 진행률 확인
            const deepProgress = await page.locator('text=/\\d+\\/\\d+/').first().textContent();
            console.log(`   진행률: ${deepProgress}`);

            // 예상값과 비교 (심화 모드에서는 1/20으로 표시되어야 함)
            console.log('\n=== 검증 결과 ===');
            const expectedQuestionNum = 'Q1.';
            const expectedProgress = '1/20';
            const expectedQuestion = '연인이 바쁘다고 연락이 뜸하면?';

            const isQuestionNumCorrect = deepQuestionNum === expectedQuestionNum;
            const isProgressCorrect = deepProgress === expectedProgress;
            const isQuestionCorrect = deepFirstQuestion.includes('바쁘다고') || deepFirstQuestion.includes('뜸하면');

            console.log(`질문 번호: ${deepQuestionNum} (예상: ${expectedQuestionNum}) - ${isQuestionNumCorrect ? '✅' : '❌'}`);
            console.log(`진행률: ${deepProgress} (예상: ${expectedProgress}) - ${isProgressCorrect ? '✅' : '❌'}`);
            console.log(`질문 내용: ${isQuestionCorrect ? '✅ 올바름' : '❌ 잘못됨'}`);

            if (isQuestionNumCorrect && isProgressCorrect && isQuestionCorrect) {
                console.log('\n✅ 심화 모드가 올바르게 동작합니다.');
            } else {
                console.log('\n❌ 일부 항목이 예상과 다릅니다.');
            }
        } else {
            console.log('\n❌ 심화 버튼을 찾을 수 없습니다.');
        }

        // 콘솔 로그 출력
        const appLogs = logs.filter(l => l.text.includes('[App]'));
        if (appLogs.length > 0) {
            console.log('\n=== 앱 콘솔 로그 ===');
            appLogs.forEach(l => console.log(l.text));
        }

    } catch (error) {
        console.error('테스트 실패:', error.message);
    } finally {
        await browser.close();
    }
}

testDeepMode();
