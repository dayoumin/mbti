/**
 * Poll API Route
 *
 * POST /api/poll - 투표 저장
 * GET /api/poll?pollId=xxx - 투표 통계 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/turso';

// 투표 저장
export async function POST(request: NextRequest) {
  try {
    const { deviceId, pollId, optionId } = await request.json();

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
    console.error('[Poll API] Save error:', error);
    return NextResponse.json(
      { error: 'Failed to save poll response' },
      { status: 500 }
    );
  }
}

// 투표 통계 조회
export async function GET(request: NextRequest) {
  try {
    const pollId = request.nextUrl.searchParams.get('pollId');

    if (!pollId) {
      return NextResponse.json(
        { error: 'pollId is required' },
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

    const options = result.rows.map(row => ({
      optionId: row.option_id as string,
      count: row.count as number,
      percentage: totalVotes > 0
        ? Math.round(((row.count as number) / totalVotes) * 100)
        : 0,
    }));

    return NextResponse.json({
      pollId,
      totalVotes,
      options,
    });
  } catch (error) {
    console.error('[Poll API] Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get poll stats' },
      { status: 500 }
    );
  }
}
