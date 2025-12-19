/**
 * Quiz API Route
 *
 * POST /api/quiz - 퀴즈 응답 저장
 * GET /api/quiz?quizId=xxx - 퀴즈 통계 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/turso';

// 퀴즈 응답 저장
export async function POST(request: NextRequest) {
  try {
    const { deviceId, quizId, questionIndex, selectedOption, isCorrect, points } = await request.json();

    if (!deviceId || !quizId || selectedOption === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // UPSERT: 같은 사용자가 같은 퀴즈 문제에 이미 답했으면 무시
    await query(
      `INSERT INTO quiz_responses (device_id, quiz_id, question_index, selected_option, is_correct, points)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(device_id, quiz_id, question_index) DO NOTHING`,
      [deviceId, quizId, questionIndex || 0, selectedOption, isCorrect ? 1 : 0, points || 0]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Quiz API] Save error:', error);
    return NextResponse.json(
      { error: 'Failed to save quiz response' },
      { status: 500 }
    );
  }
}

// 퀴즈 통계 조회
export async function GET(request: NextRequest) {
  try {
    const quizId = request.nextUrl.searchParams.get('quizId');

    if (!quizId) {
      return NextResponse.json(
        { error: 'quizId is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `SELECT question_index, is_correct, COUNT(*) as count
       FROM quiz_responses
       WHERE quiz_id = ?
       GROUP BY question_index, is_correct`,
      [quizId]
    );

    // 총계 계산
    const totalAttempts = result.rows.reduce(
      (sum, row) => sum + (row.count as number),
      0
    );
    const correctCount = result.rows
      .filter(row => row.is_correct === 1)
      .reduce((sum, row) => sum + (row.count as number), 0);

    // 문제별 통계
    const byQuestionMap: Record<number, { total: number; correct: number }> = {};
    result.rows.forEach(row => {
      const idx = row.question_index as number;
      if (!byQuestionMap[idx]) {
        byQuestionMap[idx] = { total: 0, correct: 0 };
      }
      byQuestionMap[idx].total += row.count as number;
      if (row.is_correct === 1) {
        byQuestionMap[idx].correct += row.count as number;
      }
    });

    const byQuestion = Object.entries(byQuestionMap).map(([idx, stats]) => ({
      questionIndex: parseInt(idx),
      correctRate: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    }));

    return NextResponse.json({
      quizId,
      totalAttempts,
      correctRate: totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0,
      byQuestion,
    });
  } catch (error) {
    console.error('[Quiz API] Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get quiz stats' },
      { status: 500 }
    );
  }
}
