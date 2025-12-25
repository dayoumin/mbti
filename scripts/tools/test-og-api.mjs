/**
 * OG API 테스트 스크립트
 *
 * 실행: node scripts/test-og-api.mjs
 *
 * 개발 서버가 실행 중이어야 합니다 (npm run dev)
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const testCases = [
  // 홈 이미지
  {
    name: '홈 OG 이미지',
    url: '/api/og',
    expected: { contentType: 'image/png', minSize: 10000 },
  },

  // 테스트 결과 이미지
  {
    name: '테스트 결과 - 강아지',
    url: '/api/og?type=result&test=dog&result=골든리트리버&emoji=🐕',
    expected: { contentType: 'image/png', minSize: 10000 },
  },
  {
    name: '테스트 결과 - 고양이 (스토리 비율)',
    url: '/api/og?type=result&test=cat&result=러시안블루&ratio=story',
    expected: { contentType: 'image/png', minSize: 10000 },
  },
  {
    name: '테스트 결과 - 사람 (정사각)',
    url: '/api/og?type=result&test=human&result=ENFP&ratio=square',
    expected: { contentType: 'image/png', minSize: 10000 },
  },

  // VS 투표 이미지
  {
    name: 'VS 투표 - 기본',
    url: '/api/og?type=poll&question=고양이 사료는?&optionA=습식&optionB=건식&emojiA=🥫&emojiB=🥣',
    expected: { contentType: 'image/png', minSize: 10000 },
  },
  {
    name: 'VS 투표 - 결과 포함',
    url: '/api/og?type=poll&question=강아지 산책 시간은?&optionA=아침&optionB=저녁&emojiA=🌅&emojiB=🌙&percentA=35&percentB=65',
    expected: { contentType: 'image/png', minSize: 10000 },
  },
  {
    name: 'VS 투표 - 카카오 비율',
    url: '/api/og?type=poll&question=반려동물 간식은?&optionA=수제&optionB=시판&ratio=kakao',
    expected: { contentType: 'image/png', minSize: 10000 },
  },
];

async function runTests() {
  console.log('='.repeat(60));
  console.log('OG API 테스트');
  console.log('='.repeat(60));
  console.log(`Base URL: ${BASE_URL}\n`);

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const fullUrl = `${BASE_URL}${testCase.url}`;

    try {
      const startTime = Date.now();
      const response = await fetch(fullUrl);
      const elapsed = Date.now() - startTime;

      const contentType = response.headers.get('content-type');
      const buffer = await response.arrayBuffer();
      const size = buffer.byteLength;

      // 검증
      const checks = [];

      if (response.ok) {
        checks.push({ name: 'HTTP 200', pass: true });
      } else {
        checks.push({ name: `HTTP ${response.status}`, pass: false });
      }

      if (contentType?.includes('image/png')) {
        checks.push({ name: 'Content-Type: image/png', pass: true });
      } else {
        checks.push({ name: `Content-Type: ${contentType}`, pass: false });
      }

      if (size >= testCase.expected.minSize) {
        checks.push({ name: `Size: ${(size / 1024).toFixed(1)}KB`, pass: true });
      } else {
        checks.push({ name: `Size too small: ${size}B`, pass: false });
      }

      const allPassed = checks.every(c => c.pass);

      if (allPassed) {
        console.log(`✅ ${testCase.name}`);
        console.log(`   URL: ${testCase.url}`);
        console.log(`   Size: ${(size / 1024).toFixed(1)}KB, Time: ${elapsed}ms`);
        passed++;
      } else {
        console.log(`❌ ${testCase.name}`);
        console.log(`   URL: ${testCase.url}`);
        checks.filter(c => !c.pass).forEach(c => {
          console.log(`   ⚠️  ${c.name}`);
        });
        failed++;
      }

      console.log('');

    } catch (error) {
      console.log(`❌ ${testCase.name}`);
      console.log(`   URL: ${testCase.url}`);
      console.log(`   Error: ${error.message}`);
      console.log('');
      failed++;
    }
  }

  console.log('='.repeat(60));
  console.log(`결과: ${passed}개 성공, ${failed}개 실패`);
  console.log('='.repeat(60));

  if (failed > 0) {
    process.exit(1);
  }
}

// UTM 유틸리티 테스트
function testUTMUtils() {
  console.log('\n');
  console.log('='.repeat(60));
  console.log('UTM 유틸리티 테스트 (단위 테스트)');
  console.log('='.repeat(60));
  console.log('');

  // URL 생성 테스트
  const testUrls = [
    {
      input: { base: 'https://chemi.app/result/dog', platform: 'kakao', content: 'test-result', contentId: 'golden' },
      expected: 'utm_source=kakao&utm_medium=social&utm_campaign=test-result&utm_content=golden',
    },
    {
      input: { base: 'https://chemi.app', platform: 'link_copy', content: 'home' },
      expected: 'utm_source=link_copy&utm_medium=share&utm_campaign=home',
    },
  ];

  // 수동 UTM URL 생성 테스트 (유틸리티 함수 로직 시뮬레이션)
  const PLATFORM_MEDIUM = {
    kakao: 'social',
    instagram: 'social',
    link_copy: 'share',
  };

  testUrls.forEach((test, i) => {
    const url = new URL(test.input.base);
    url.searchParams.set('utm_source', test.input.platform);
    url.searchParams.set('utm_medium', PLATFORM_MEDIUM[test.input.platform] || 'other');
    url.searchParams.set('utm_campaign', test.input.content);
    if (test.input.contentId) {
      url.searchParams.set('utm_content', test.input.contentId);
    }

    const params = url.search.slice(1); // remove '?'
    const hasExpected = test.expected.split('&').every(param => params.includes(param));

    if (hasExpected) {
      console.log(`✅ UTM 생성 테스트 ${i + 1}`);
      console.log(`   ${url.toString()}`);
    } else {
      console.log(`❌ UTM 생성 테스트 ${i + 1}`);
      console.log(`   Expected: ${test.expected}`);
      console.log(`   Got: ${params}`);
    }
  });

  console.log('');
}

// 실행
testUTMUtils();
runTests().catch(console.error);
