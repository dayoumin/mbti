/**
 * Poll API Route
 *
 * POST /api/poll - 투표 저장 또는 사용자 투표 생성
 * GET /api/poll?pollId=xxx - VS 투표 통계 조회 (A/B)
 * GET /api/poll?pollId=xxx&type=choice - Choice 투표 통계 조회 (다중 선택)
 * GET /api/poll?pollId=xxx&deviceId=xxx - 투표 통계 + 사용자 투표 여부
 * GET /api/poll?action=popular - 인기 투표 목록
 * GET /api/poll?action=my-polls&deviceId=xxx - 사용자 생성 투표 목록
 *
 * 댓글/좋아요:
 * - 댓글: POST/GET /api/comments?targetType=poll&targetId=xxx
 * - 좋아요: POST/GET /api/likes?targetType=poll&targetId=xxx
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/turso';
import { getChoicePollById } from '@/data/content/polls';

// 투표 상태
type PollStatus = 'pending' | 'approved' | 'featured' | 'hidden';

// AI 콘텐츠 검토 (간단 버전 - 금지어 체크)
function moderateContent(question: string, optionA: string, optionB: string): {
  approved: boolean;
  reason?: string;
} {
  const bannedWords = [
    '시발', '씨발', '개새끼', '병신', '지랄', '꺼져', '죽어',
    '섹스', '야동', '포르노', '성인', '19금',
    '마약', '대마', '필로폰', '코카인',
    '자살', '자해',
  ];

  const allText = `${question} ${optionA} ${optionB}`.toLowerCase();

  for (const word of bannedWords) {
    if (allText.includes(word)) {
      return { approved: false, reason: `금지어 포함: ${word}` };
    }
  }

  // 너무 짧은 내용
  if (question.length < 5 || optionA.length < 1 || optionB.length < 1) {
    return { approved: false, reason: '내용이 너무 짧습니다' };
  }

  return { approved: true };
}

// 투표 저장 또는 사용자 투표 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // 사용자 투표 생성
    if (action === 'create') {
      const { deviceId, question, optionA, optionB, category } = body;

      if (!deviceId || !question || !optionA || !optionB) {
        return NextResponse.json(
          { error: 'Missing required fields: question, optionA, optionB' },
          { status: 400 }
        );
      }

      // 콘텐츠 검토
      const moderation = moderateContent(question, optionA, optionB);
      if (!moderation.approved) {
        return NextResponse.json(
          { error: moderation.reason, code: 'CONTENT_REJECTED' },
          { status: 400 }
        );
      }

      // 고유 ID 생성
      const pollId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      // DB에 저장
      await query(
        `INSERT INTO user_polls (id, device_id, question, option_a, option_b, category, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 'approved', datetime('now'))`,
        [pollId, deviceId, question, optionA, optionB, category || 'general']
      );

      return NextResponse.json({
        success: true,
        pollId,
        status: 'approved' as PollStatus,
        message: '투표가 생성되었습니다!',
      });
    }

    // 기존: 투표 응답 저장
    // optionIds: 복수 선택 (allowMultiple), optionId: 단일 선택 (하위 호환)
    const { deviceId, pollId, optionId, optionIds, allowMultiple: clientAllowMultiple } = body;

    // 필수 필드 체크 (pollId.startsWith 호출 전에 먼저 검증)
    if (!deviceId || !pollId) {
      return NextResponse.json(
        { error: 'Missing required fields: deviceId, pollId' },
        { status: 400 }
      );
    }

    // allowMultiple: 서버 측 Choice Poll 설정 우선, 없으면 클라이언트 입력 사용
    // - Choice Poll: 서버 정의된 allowMultiple 사용 (클라이언트 입력 무시)
    // - VS Poll / User Poll: 항상 단일 선택 (allowMultiple 무시)
    let allowMultiple = false;
    if (pollId.startsWith('choice-')) {
      const choicePoll = getChoicePollById(pollId);
      // 서버에 정의된 poll이면 서버 설정 사용, 없으면 클라이언트 입력 허용 (user-created choice poll 대비)
      allowMultiple = choicePoll ? (choicePoll.allowMultiple ?? false) : (clientAllowMultiple ?? false);
    }
    // VS Poll, User Poll은 allowMultiple = false 유지

    // optionId 또는 optionIds 중 하나는 필수
    const selectedOptions: string[] = optionIds
      ? (Array.isArray(optionIds) ? optionIds : [optionIds])
      : (optionId ? [optionId] : []);

    if (selectedOptions.length === 0) {
      return NextResponse.json(
        { error: 'Missing required field: optionId or optionIds' },
        { status: 400 }
      );
    }

    // optionId 검증: pollId prefix로 타입 자동 추론 (클라이언트 입력에 의존하지 않음)
    const validVsOptions = ['a', 'b'];
    const validChoiceOptions = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    // pollId가 'choice-'로 시작하면 Choice Poll
    const isChoicePoll = pollId.startsWith('choice-');
    const validOptions = isChoicePoll ? validChoiceOptions : validVsOptions;

    // 모든 선택된 옵션 검증
    for (const opt of selectedOptions) {
      if (!validOptions.includes(opt)) {
        return NextResponse.json(
          { error: `Invalid optionId: ${opt}` },
          { status: 400 }
        );
      }
    }

    // VS Poll은 항상 단일 선택
    if (!isChoicePoll && selectedOptions.length > 1) {
      return NextResponse.json(
        { error: 'VS poll only allows single option selection' },
        { status: 400 }
      );
    }

    // allowMultiple=false인데 복수 옵션을 보낸 경우 거부
    if (!allowMultiple && selectedOptions.length > 1) {
      return NextResponse.json(
        { error: 'Multiple options not allowed for this poll' },
        { status: 400 }
      );
    }

    // allowMultiple이 아닌 경우 기존 투표 확인 후 차단
    if (!allowMultiple) {
      const existingVote = await query(
        `SELECT option_id FROM poll_responses WHERE device_id = ? AND poll_id = ? LIMIT 1`,
        [deviceId, pollId]
      );
      if (existingVote.rows.length > 0) {
        return NextResponse.json({
          success: false,
          error: 'Already voted',
          existingVote: existingVote.rows[0].option_id,
        });
      }
    }

    // 투표 저장 (각 옵션별로)
    // UNIQUE(device_id, poll_id, option_id)로 같은 옵션 중복 방지
    for (const opt of selectedOptions) {
      await query(
        `INSERT INTO poll_responses (device_id, poll_id, option_id)
         VALUES (?, ?, ?)
         ON CONFLICT(device_id, poll_id, option_id) DO NOTHING`,
        [deviceId, pollId, opt]
      );
    }

    return NextResponse.json({
      success: true,
      savedOptions: selectedOptions,
    });
  } catch (error) {
    console.error('[Poll API] POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// 투표 통계/목록 조회
export async function GET(request: NextRequest) {
  try {
    const action = request.nextUrl.searchParams.get('action');
    const pollId = request.nextUrl.searchParams.get('pollId');

    // 인기 투표 목록 (좋아요 + 참여수 기준)
    if (action === 'popular') {
      const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');

      // 사용자 생성 투표 중 인기순
      const result = await query(
        `SELECT
           up.id,
           up.question,
           up.option_a,
           up.option_b,
           up.category,
           up.status,
           up.created_at,
           COALESCE(vote_counts.total, 0) as vote_count,
           COALESCE(like_counts.total, 0) as like_count
         FROM user_polls up
         LEFT JOIN (
           SELECT poll_id, COUNT(*) as total
           FROM poll_responses
           GROUP BY poll_id
         ) vote_counts ON vote_counts.poll_id = up.id
         LEFT JOIN (
           SELECT target_id, COUNT(*) as total
           FROM likes
           WHERE target_type = 'poll'
           GROUP BY target_id
         ) like_counts ON like_counts.target_id = up.id
         WHERE up.status IN ('approved', 'featured')
         ORDER BY (COALESCE(vote_counts.total, 0) * 2 + COALESCE(like_counts.total, 0) * 3) DESC,
                  up.created_at DESC
         LIMIT ?`,
        [limit]
      );

      const polls = result.rows.map(row => ({
        id: row.id,
        question: row.question,
        optionA: { text: row.option_a as string, emoji: '🅰️' },
        optionB: { text: row.option_b as string, emoji: '🅱️' },
        category: row.category,
        status: row.status,
        createdAt: row.created_at,
        voteCount: row.vote_count,
        likeCount: row.like_count,
        score: (row.vote_count as number) * 2 + (row.like_count as number) * 3,
      }));

      return NextResponse.json({ polls });
    }

    // 사용자 투표 목록 (본인 것)
    if (action === 'my-polls') {
      const deviceId = request.nextUrl.searchParams.get('deviceId');
      if (!deviceId) {
        return NextResponse.json({ error: 'deviceId required' }, { status: 400 });
      }

      const result = await query(
        `SELECT
           up.*,
           COALESCE(vote_counts.total, 0) as vote_count,
           COALESCE(like_counts.total, 0) as like_count
         FROM user_polls up
         LEFT JOIN (
           SELECT poll_id, COUNT(*) as total
           FROM poll_responses
           GROUP BY poll_id
         ) vote_counts ON vote_counts.poll_id = up.id
         LEFT JOIN (
           SELECT target_id, COUNT(*) as total
           FROM likes
           WHERE target_type = 'poll'
           GROUP BY target_id
         ) like_counts ON like_counts.target_id = up.id
         WHERE up.device_id = ?
         ORDER BY up.created_at DESC`,
        [deviceId]
      );

      return NextResponse.json({
        polls: result.rows.map(row => ({
          id: row.id,
          question: row.question,
          optionA: { text: row.option_a as string, emoji: '🅰️' },
          optionB: { text: row.option_b as string, emoji: '🅱️' },
          category: row.category,
          status: row.status,
          createdAt: row.created_at,
          voteCount: row.vote_count,
          likeCount: row.like_count,
        })),
      });
    }

    // 단일 투표 통계 조회
    if (!pollId) {
      return NextResponse.json(
        { error: 'pollId or action is required' },
        { status: 400 }
      );
    }

    // pollType: pollId prefix로 자동 추론 (클라이언트 파라미터 불필요)
    // 하위 호환: type 파라미터도 지원
    const typeParam = request.nextUrl.searchParams.get('type');
    const pollType = pollId.startsWith('choice-') ? 'choice' : (typeParam || 'vs');
    const deviceId = request.nextUrl.searchParams.get('deviceId');

    const result = await query(
      `SELECT option_id, COUNT(*) as count
       FROM poll_responses
       WHERE poll_id = ?
       GROUP BY option_id`,
      [pollId]
    );

    const totalVotes = result.rows.reduce(
      (sum, row) => sum + (row.count as number),
      0
    );

    // 옵션별 투표 수 집계
    const optionMap = new Map<string, number>();
    for (const row of result.rows) {
      optionMap.set(row.option_id as string, row.count as number);
    }

    // Choice Poll (다중 선택: a, b, c, d, e...)
    if (pollType === 'choice') {
      // 옵션 개수 파라미터 (기본 5개: a~e, 최소 2개, 최대 8개)
      const optionCountParam = parseInt(request.nextUrl.searchParams.get('optionCount') || '5');
      const optionCount = Number.isNaN(optionCountParam)
        ? 5  // NaN이면 기본값 5
        : Math.max(2, Math.min(8, optionCountParam));  // 2~8 범위로 제한
      const allOptionIds = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].slice(0, optionCount);

      // 퍼센트 계산 (Largest Remainder Method - 합계 정확히 100% 보장)
      const rawPercentages = allOptionIds.map(optionId => {
        const count = optionMap.get(optionId) ?? 0;
        return {
          optionId,
          count,
          raw: totalVotes > 0 ? (count / totalVotes) * 100 : 0,
        };
      });

      // 1단계: 각각 floor 적용
      const floored = rawPercentages.map(p => ({
        ...p,
        percentage: Math.floor(p.raw),
        remainder: p.raw - Math.floor(p.raw),
      }));

      // 2단계: 부족분 계산 후 remainder가 큰 순서대로 +1
      const floorSum = floored.reduce((sum, p) => sum + p.percentage, 0);
      const shortage = totalVotes > 0 ? 100 - floorSum : 0;

      // remainder 큰 순서로 정렬 (원본 인덱스 유지)
      const sortedByRemainder = floored
        .map((p, idx) => ({ ...p, originalIdx: idx }))
        .sort((a, b) => b.remainder - a.remainder);

      // 상위 shortage개에 +1
      for (let i = 0; i < shortage; i++) {
        sortedByRemainder[i].percentage += 1;
      }

      // 원래 순서로 복원
      sortedByRemainder.sort((a, b) => a.originalIdx - b.originalIdx);

      const options = sortedByRemainder.map(p => ({
        optionId: p.optionId,
        count: p.count,
        percentage: p.percentage,
      }));

      // 현재 사용자 투표 여부 확인 (복수 선택 지원)
      let userVotes: string[] = [];
      if (deviceId) {
        const userVoteResult = await query(
          `SELECT option_id FROM poll_responses WHERE poll_id = ? AND device_id = ? ORDER BY created_at ASC`,
          [pollId, deviceId]
        );
        userVotes = userVoteResult.rows.map(row => row.option_id as string);
      }

      return NextResponse.json({
        pollId,
        pollType: 'choice',
        totalVotes,
        options,
        userVotes,  // 복수 선택: 배열로 반환
        userVote: userVotes[0] ?? null,  // 하위 호환: 첫 번째 투표
      });
    }

    // VS Poll (A/B 투표) - 기존 로직
    const aCount = optionMap.get('a') ?? 0;
    const bCount = optionMap.get('b') ?? 0;

    // 퍼센트 계산: 반올림 오류로 합이 101/99가 되는 것을 방지
    // A를 먼저 계산하고, B는 100 - A로 설정
    const aPercent = totalVotes > 0 ? Math.round((aCount / totalVotes) * 100) : 50;
    const bPercent = totalVotes > 0 ? 100 - aPercent : 50;

    // 현재 사용자 투표 여부 확인
    let userVote: string | null = null;
    if (deviceId) {
      const userVoteResult = await query(
        `SELECT option_id FROM poll_responses WHERE poll_id = ? AND device_id = ? ORDER BY created_at ASC LIMIT 1`,
        [pollId, deviceId]
      );
      if (userVoteResult.rows.length > 0) {
        userVote = userVoteResult.rows[0].option_id as string;
      }
    }

    const options = [
      {
        optionId: 'a',
        count: aCount,
        percentage: aPercent,
      },
      {
        optionId: 'b',
        count: bCount,
        percentage: bPercent,
      },
    ];

    return NextResponse.json({
      pollId,
      pollType: 'vs',
      totalVotes,
      options,
      userVote,
    });
  } catch (error) {
    console.error('[Poll API] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to get poll data' },
      { status: 500 }
    );
  }
}
