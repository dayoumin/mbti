/**
 * Poll API Route
 *
 * POST /api/poll - 투표 저장 또는 사용자 투표 생성
 * GET /api/poll?pollId=xxx - 투표 통계 조회
 * GET /api/poll?action=popular - 인기 투표 목록
 * GET /api/poll?action=my-polls&deviceId=xxx - 사용자 생성 투표 목록
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/turso';

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
    const { deviceId, pollId, optionId } = body;

    if (!deviceId || !pollId || !optionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // UPSERT: 기존 투표가 있으면 무시
    await query(
      `INSERT INTO poll_responses (device_id, poll_id, option_id)
       VALUES (?, ?, ?)
       ON CONFLICT(device_id, poll_id) DO NOTHING`,
      [deviceId, pollId, optionId]
    );

    return NextResponse.json({ success: true });
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

    // 항상 a/b 두 옵션을 반환 (없는 옵션은 0으로)
    const optionMap = new Map<string, number>();
    for (const row of result.rows) {
      optionMap.set(row.option_id as string, row.count as number);
    }

    const aCount = optionMap.get('a') ?? 0;
    const bCount = optionMap.get('b') ?? 0;

    // 퍼센트 계산: 반올림 오류로 합이 101/99가 되는 것을 방지
    // A를 먼저 계산하고, B는 100 - A로 설정
    const aPercent = totalVotes > 0 ? Math.round((aCount / totalVotes) * 100) : 50;
    const bPercent = totalVotes > 0 ? 100 - aPercent : 50;

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
      totalVotes,
      options,
    });
  } catch (error) {
    console.error('[Poll API] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to get poll data' },
      { status: 500 }
    );
  }
}
