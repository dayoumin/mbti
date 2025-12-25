/**
 * 콘텐츠 DB 시딩 스크립트
 *
 * 기존 코드 샘플 데이터를 DB로 이전
 * 사용법: node scripts/seed-content.mjs
 */

import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

// .env.local 로드
dotenv.config({ path: '.env.local' });

// ============================================================================
// 샘플 데이터 (content-samples.ts에서 복사)
// ============================================================================

const CAT_KNOWLEDGE_QUIZZES = [
  {
    id: 'cat-quiz-001',
    type: 'knowledge',
    category: 'cat',
    question: '고양이가 꼬리를 세우고 다가오면?',
    options: [
      { id: 'a', text: '기분이 좋다', isCorrect: true },
      { id: 'b', text: '화가 났다', isCorrect: false },
      { id: 'c', text: '겁을 먹었다', isCorrect: false },
    ],
    explanation: '꼬리를 세우고 끝만 살짝 구부리면 반가움과 호감의 표시예요!',
    difficulty: 1,
    points: 10,
    tags: ['행동', '바디랭귀지'],
  },
  {
    id: 'cat-quiz-002',
    type: 'knowledge',
    category: 'cat',
    question: '고양이에게 가장 위험한 식물은?',
    options: [
      { id: 'a', text: '백합', isCorrect: true },
      { id: 'b', text: '로즈마리', isCorrect: false },
      { id: 'c', text: '바질', isCorrect: false },
    ],
    explanation: '백합은 고양이에게 치명적! 꽃가루만 핥아도 급성 신부전을 일으킬 수 있어요.',
    difficulty: 2,
    points: 20,
    tags: ['건강', '독성식물', '응급'],
  },
  {
    id: 'cat-quiz-003',
    type: 'knowledge',
    category: 'cat',
    question: '고양이가 그루밍을 하루에 몇 시간 할까요?',
    options: [
      { id: 'a', text: '약 1시간', isCorrect: false },
      { id: 'b', text: '약 3-4시간', isCorrect: true },
      { id: 'c', text: '약 6시간 이상', isCorrect: false },
    ],
    explanation: '고양이는 하루 일과의 약 30-50%를 그루밍에 사용해요. 청결뿐 아니라 체온조절과 스트레스 해소 역할도 해요.',
    difficulty: 2,
    points: 15,
    tags: ['습성', '그루밍'],
  },
];

const CAT_VS_POLLS = [
  {
    id: 'cat-poll-001',
    type: 'vs',
    category: 'cat',
    question: '고양이 사료, 뭐가 더 좋아요?',
    options: [
      { id: 'a', text: '습식 (캔/파우치)', emoji: '🥫' },
      { id: 'b', text: '건식 (사료)', emoji: '🍚' },
    ],
    tags: ['사료', '먹이'],
  },
  {
    id: 'cat-poll-002',
    type: 'vs',
    category: 'cat',
    question: '고양이 털 스타일 취향은?',
    options: [
      { id: 'a', text: '장모종', emoji: '🦁' },
      { id: 'b', text: '단모종', emoji: '🐱' },
    ],
    tags: ['품종', '취향'],
  },
  {
    id: 'cat-poll-003',
    type: 'vs',
    category: 'cat',
    question: '고양이 장난감으로 더 좋은 건?',
    options: [
      { id: 'a', text: '낚싯대', emoji: '🎣' },
      { id: 'b', text: '레이저 포인터', emoji: '🔴' },
    ],
    tags: ['장난감', '놀이'],
  },
];

const CAT_BUTLER_SCENARIO = {
  id: 'cat-scenario-butler',
  category: 'cat',
  title: '나의 집사 점수는?',
  subtitle: '고양이 돌봄 상식 테스트',
  emoji: '🐱',
  themeColor: 'bg-orange-100',
  questions: [
    {
      id: 'q1',
      situation: '고양이가 새로운 화장실에 볼일을 안 봐요.',
      question: '어떻게 하시겠어요?',
      options: [
        { id: 'a', text: '기존 화장실 모래를 조금 섞어준다', points: 10, feedback: '정답! 익숙한 냄새로 안심시켜요' },
        { id: 'b', text: '강제로 화장실에 넣어 교육한다', points: 2, feedback: '스트레스를 줄 수 있어요' },
        { id: 'c', text: '그냥 기다린다', points: 5, feedback: '시간이 오래 걸릴 수 있어요' },
      ],
    },
    {
      id: 'q2',
      situation: '고양이가 밥을 갑자기 안 먹어요.',
      question: '가장 먼저 확인할 것은?',
      options: [
        { id: 'a', text: '사료가 상했는지 확인', points: 7, feedback: '좋은 생각이지만 더 중요한 게 있어요' },
        { id: 'b', text: '물을 마시는지, 활력은 있는지 확인', points: 10, feedback: '정답! 건강 상태 먼저 체크해요' },
        { id: 'c', text: '더 맛있는 간식 준다', points: 3, feedback: '근본 원인을 놓칠 수 있어요' },
      ],
    },
  ],
  results: [
    { minScore: 0, maxScore: 10, grade: 'D', title: '초보 집사', emoji: '🐣', description: '아직 배울 게 많아요!' },
    { minScore: 11, maxScore: 20, grade: 'A', title: '프로 집사', emoji: '👑', description: '고양이의 마음을 잘 이해해요!' },
  ],
};

const CAT_BREED_TOURNAMENT = {
  id: 'cat-breed-worldcup-v1',
  type: 'worldcup',
  category: 'cat',
  title: '최애 고양이 품종 월드컵',
  subtitle: '16강',
  description: '당신의 최애 고양이 품종은? 1:1 대결로 찾아보세요!',
  emoji: '🐱',
  themeColor: 'bg-orange-100',
  roundSize: 16,
  contestants: [
    { id: 'persian', name: '페르시안', emoji: '👑', description: '고급스러운 외모의 대명사', tags: ['장모', '조용함'], funFact: '17세기부터 사랑받아왔어요' },
    { id: 'ragdoll', name: '랙돌', emoji: '🧸', description: '인형처럼 축 늘어지는 스위트하트', tags: ['장모', '대형'], funFact: '안으면 인형처럼 몸이 축 처져요' },
    { id: 'maine-coon', name: '메인쿤', emoji: '🦁', description: '고양이계의 젠틀 자이언트', tags: ['장모', '대형'], funFact: '미국에서 가장 큰 집고양이예요' },
    { id: 'british-shorthair', name: '브리티시 숏헤어', emoji: '🧸', description: '통통한 볼살의 영국 신사', tags: ['단모', '둥글둥글'], funFact: '체셔 고양이의 모델이에요' },
  ],
  resultConfig: {
    showRanking: true,
    showWinRate: true,
    showSegmentComparison: true,
    shareMessage: '나의 최애 고양이 품종은 {winner}! 🐱',
  },
  status: 'active',
  createdAt: '2024-12-23',
};

// ============================================================================
// 시딩 함수
// ============================================================================

async function seedContent() {
  console.log('\n🌱 Starting content seeding...\n');

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.error('❌ TURSO_DATABASE_URL is not defined');
    process.exit(1);
  }

  const client = createClient({ url, authToken });

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  // 퀴즈 시딩
  console.log('📝 Seeding quizzes...');
  for (const quiz of CAT_KNOWLEDGE_QUIZZES) {
    try {
      await client.execute({
        sql: `INSERT INTO quizzes (id, type, category, question, options, explanation, difficulty, points, tags, status)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
        args: [
          quiz.id,
          quiz.type,
          quiz.category,
          quiz.question,
          JSON.stringify(quiz.options),
          quiz.explanation,
          quiz.difficulty,
          quiz.points,
          JSON.stringify(quiz.tags),
        ],
      });
      console.log(`   ✅ ${quiz.id}`);
      successCount++;
    } catch (error) {
      if (error.message?.includes('UNIQUE constraint')) {
        console.log(`   ⏭️  ${quiz.id} (already exists)`);
        skipCount++;
      } else {
        console.error(`   ❌ ${quiz.id}: ${error.message}`);
        errorCount++;
      }
    }
  }

  // 투표 시딩
  console.log('\n📊 Seeding polls...');
  for (const poll of CAT_VS_POLLS) {
    try {
      await client.execute({
        sql: `INSERT INTO polls (id, type, category, question, options, tags, status)
              VALUES (?, ?, ?, ?, ?, ?, 'active')`,
        args: [
          poll.id,
          poll.type,
          poll.category,
          poll.question,
          JSON.stringify(poll.options),
          JSON.stringify(poll.tags),
        ],
      });
      console.log(`   ✅ ${poll.id}`);
      successCount++;
    } catch (error) {
      if (error.message?.includes('UNIQUE constraint')) {
        console.log(`   ⏭️  ${poll.id} (already exists)`);
        skipCount++;
      } else {
        console.error(`   ❌ ${poll.id}: ${error.message}`);
        errorCount++;
      }
    }
  }

  // 시나리오 시딩
  console.log('\n🎭 Seeding scenarios...');
  try {
    await client.execute({
      sql: `INSERT INTO scenario_quizzes (id, category, title, subtitle, emoji, theme_color, questions, results, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      args: [
        CAT_BUTLER_SCENARIO.id,
        CAT_BUTLER_SCENARIO.category,
        CAT_BUTLER_SCENARIO.title,
        CAT_BUTLER_SCENARIO.subtitle,
        CAT_BUTLER_SCENARIO.emoji,
        CAT_BUTLER_SCENARIO.themeColor,
        JSON.stringify(CAT_BUTLER_SCENARIO.questions),
        JSON.stringify(CAT_BUTLER_SCENARIO.results),
      ],
    });
    console.log(`   ✅ ${CAT_BUTLER_SCENARIO.id}`);
    successCount++;
  } catch (error) {
    if (error.message?.includes('UNIQUE constraint')) {
      console.log(`   ⏭️  ${CAT_BUTLER_SCENARIO.id} (already exists)`);
      skipCount++;
    } else {
      console.error(`   ❌ ${CAT_BUTLER_SCENARIO.id}: ${error.message}`);
      errorCount++;
    }
  }

  // 토너먼트 시딩
  console.log('\n🏆 Seeding tournaments...');
  try {
    await client.execute({
      sql: `INSERT INTO tournaments (id, type, category, title, subtitle, description, emoji, theme_color, round_size, contestants, result_config, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        CAT_BREED_TOURNAMENT.id,
        CAT_BREED_TOURNAMENT.type,
        CAT_BREED_TOURNAMENT.category,
        CAT_BREED_TOURNAMENT.title,
        CAT_BREED_TOURNAMENT.subtitle,
        CAT_BREED_TOURNAMENT.description,
        CAT_BREED_TOURNAMENT.emoji,
        CAT_BREED_TOURNAMENT.themeColor,
        CAT_BREED_TOURNAMENT.roundSize,
        JSON.stringify(CAT_BREED_TOURNAMENT.contestants),
        JSON.stringify(CAT_BREED_TOURNAMENT.resultConfig),
        CAT_BREED_TOURNAMENT.status,
      ],
    });
    console.log(`   ✅ ${CAT_BREED_TOURNAMENT.id}`);
    successCount++;
  } catch (error) {
    if (error.message?.includes('UNIQUE constraint')) {
      console.log(`   ⏭️  ${CAT_BREED_TOURNAMENT.id} (already exists)`);
      skipCount++;
    } else {
      console.error(`   ❌ ${CAT_BREED_TOURNAMENT.id}: ${error.message}`);
      errorCount++;
    }
  }

  // 결과 출력
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Created: ${successCount}`);
  console.log(`⏭️  Skipped: ${skipCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`${'='.repeat(50)}\n`);

  // 데이터 확인
  console.log('📋 Content counts in database:\n');

  const tables = ['quizzes', 'polls', 'scenario_quizzes', 'tournaments'];
  for (const table of tables) {
    const result = await client.execute(`SELECT COUNT(*) as count FROM ${table}`);
    console.log(`   ${table}: ${result.rows[0].count}`);
  }

  console.log('');
  await client.close();
}

seedContent().catch(error => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
