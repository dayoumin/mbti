/**
 * Likes API Route
 *
 * POST /api/likes - 좋아요 토글
 * GET /api/likes?targetType=xxx&targetId=xxx - 좋아요 수 조회
 *
 * targetType 종류:
 * - comment: 댓글
 * - post: 게시물
 * - poll: 투표
 * - quiz: 퀴즈
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/turso';

// 좋아요 토글 (추가/삭제) - 트랜잭션으로 원자적 처리
export async function POST(request: NextRequest) {
  try {
    const { deviceId, targetType, targetId } = await request.json();

    if (!deviceId || !targetType || !targetId) {
      return NextResponse.json(
        { error: 'Missing required fields: deviceId, targetType, targetId' },
        { status: 400 }
      );
    }

    let response: { success: boolean; action: 'added' | 'removed'; liked: boolean };

    // 트랜잭션 시작 (IMMEDIATE로 쓰기 락 획득)
    await query('BEGIN IMMEDIATE');
    try {
      // INSERT 시도 (UNIQUE 제약으로 중복 시 무시)
      const insertResult = await query(
        `INSERT INTO likes (device_id, target_type, target_id)
         VALUES (?, ?, ?)
         ON CONFLICT(device_id, target_type, target_id) DO NOTHING`,
        [deviceId, targetType, targetId]
      );

      // rowsAffected > 0이면 새로 추가됨, 0이면 이미 존재했음
      const wasInserted = insertResult.rowsAffected > 0;

      if (wasInserted) {
        // 새로 추가됨 - 카운트 증가
        if (targetType === 'comment') {
          await query(
            `UPDATE comments SET likes = COALESCE(likes, 0) + 1 WHERE id = ?`,
            [targetId]
          );
        }
        response = { success: true, action: 'added', liked: true };
      } else {
        // 이미 존재했으므로 삭제 (좋아요 취소)
        await query(
          `DELETE FROM likes WHERE device_id = ? AND target_type = ? AND target_id = ?`,
          [deviceId, targetType, targetId]
        );

        // 카운트 감소 (음수 방지)
        if (targetType === 'comment') {
          await query(
            `UPDATE comments SET likes = MAX(COALESCE(likes, 0) - 1, 0) WHERE id = ?`,
            [targetId]
          );
        }
        response = { success: true, action: 'removed', liked: false };
      }

      await query('COMMIT');
      return NextResponse.json(response);
    } catch (innerError) {
      await query('ROLLBACK');
      throw innerError;
    }
  } catch (error) {
    console.error('[Likes API] Toggle error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}

// 좋아요 정보 조회
export async function GET(request: NextRequest) {
  try {
    const targetType = request.nextUrl.searchParams.get('targetType');
    const targetId = request.nextUrl.searchParams.get('targetId');
    const deviceId = request.nextUrl.searchParams.get('deviceId');

    if (!targetType || !targetId) {
      return NextResponse.json(
        { error: 'targetType and targetId are required' },
        { status: 400 }
      );
    }

    // 총 좋아요 수
    const countResult = await query(
      `SELECT COUNT(*) as count FROM likes WHERE target_type = ? AND target_id = ?`,
      [targetType, targetId]
    );

    const count = (countResult.rows[0]?.count as number) || 0;

    // 현재 사용자가 좋아요 했는지
    let liked = false;
    if (deviceId) {
      const likedResult = await query(
        `SELECT id FROM likes WHERE device_id = ? AND target_type = ? AND target_id = ?`,
        [deviceId, targetType, targetId]
      );
      liked = likedResult.rows.length > 0;
    }

    return NextResponse.json({ count, liked });
  } catch (error) {
    console.error('[Likes API] Get error:', error);
    return NextResponse.json(
      { error: 'Failed to get likes' },
      { status: 500 }
    );
  }
}
