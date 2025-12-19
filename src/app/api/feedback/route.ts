/**
 * Feedback API Route
 *
 * POST /api/feedback - 피드백 저장
 * GET /api/feedback?testType=xxx - 피드백 통계/댓글 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/turso';

// 피드백 저장
export async function POST(request: NextRequest) {
  try {
    const { deviceId, testType, resultName, isAccurate, comment } = await request.json();

    if (!deviceId || !testType || !resultName || isAccurate === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO feedback (device_id, test_type, result_name, is_accurate, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [deviceId, testType, resultName, isAccurate ? 1 : 0, comment || null]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Feedback API] Save error:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
}

// 피드백 통계/댓글 조회
export async function GET(request: NextRequest) {
  try {
    const testType = request.nextUrl.searchParams.get('testType');
    const resultName = request.nextUrl.searchParams.get('resultName');
    const type = request.nextUrl.searchParams.get('type') || 'stats'; // 'stats' or 'comments'
    // limit 상한 50, 기본 10
    const rawLimit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    const limit = Math.min(Math.max(rawLimit, 1), 50);

    if (!testType) {
      return NextResponse.json(
        { error: 'testType is required' },
        { status: 400 }
      );
    }

    if (type === 'comments') {
      // 댓글 조회
      let sql = `SELECT id, result_name, is_accurate, comment, created_at
                 FROM feedback
                 WHERE test_type = ? AND comment IS NOT NULL AND comment != ''`;
      const args: (string | number)[] = [testType];

      if (resultName) {
        sql += ' AND result_name = ?';
        args.push(resultName);
      }

      sql += ' ORDER BY created_at DESC LIMIT ?';
      args.push(limit);

      const result = await query(sql, args);

      const comments = result.rows.map(row => ({
        id: row.id,
        resultName: row.result_name,
        isAccurate: row.is_accurate === 1,
        comment: row.comment,
        createdAt: row.created_at,
      }));

      return NextResponse.json({ comments });
    } else {
      // 통계 조회
      const result = await query(
        `SELECT is_accurate, COUNT(*) as count
         FROM feedback
         WHERE test_type = ?
         GROUP BY is_accurate`,
        [testType]
      );

      const accurate = result.rows.find(r => r.is_accurate === 1)?.count as number || 0;
      const inaccurate = result.rows.find(r => r.is_accurate === 0)?.count as number || 0;

      return NextResponse.json({
        accurate,
        inaccurate,
        total: accurate + inaccurate,
      });
    }
  } catch (error) {
    console.error('[Feedback API] Get error:', error);
    return NextResponse.json(
      { error: 'Failed to get feedback' },
      { status: 500 }
    );
  }
}
