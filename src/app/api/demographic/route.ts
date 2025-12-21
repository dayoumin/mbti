/**
 * 인구통계 API
 *
 * POST - 사용자 인구통계 저장
 * GET - 전체 통계 조회 (대시보드용)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTursoClient } from '@/lib/turso';
import { cookies } from 'next/headers';

// 유효한 값 화이트리스트
const VALID_AGE_GROUPS = ['10s', '20s', '30s', '40s+'] as const;
const VALID_GENDERS = ['male', 'female', 'other'] as const;

type AgeGroup = typeof VALID_AGE_GROUPS[number];
type Gender = typeof VALID_GENDERS[number];

function isValidAgeGroup(value: unknown): value is AgeGroup {
  return typeof value === 'string' && VALID_AGE_GROUPS.includes(value as AgeGroup);
}

function isValidGender(value: unknown): value is Gender {
  return typeof value === 'string' && VALID_GENDERS.includes(value as Gender);
}

// device_id 가져오기 (쿠키 또는 헤더)
async function getDeviceId(request: NextRequest): Promise<string | null> {
  // 1. 쿠키에서 확인
  const cookieStore = await cookies();
  const deviceIdCookie = cookieStore.get('chemi_device_id');
  if (deviceIdCookie?.value) return deviceIdCookie.value;

  // 2. 헤더에서 확인
  const headerDeviceId = request.headers.get('x-device-id');
  if (headerDeviceId) return headerDeviceId;

  return null;
}

// POST: 인구통계 저장
export async function POST(request: NextRequest) {
  try {
    const deviceId = await getDeviceId(request);
    if (!deviceId) {
      return NextResponse.json({ error: 'device_id required' }, { status: 400 });
    }

    const body = await request.json();
    const { ageGroup, gender, source = 'bonus_question' } = body;

    // 화이트리스트 검증
    if (!isValidAgeGroup(ageGroup)) {
      return NextResponse.json({ error: 'Invalid ageGroup. Must be one of: 10s, 20s, 30s, 40s+' }, { status: 400 });
    }
    if (!isValidGender(gender)) {
      return NextResponse.json({ error: 'Invalid gender. Must be one of: male, female, other' }, { status: 400 });
    }

    const client = getTursoClient();

    // UPSERT: 있으면 업데이트, 없으면 삽입
    await client.execute({
      sql: `
        INSERT INTO user_demographics (device_id, age_group, gender, source, updated_at)
        VALUES (?, ?, ?, ?, datetime('now'))
        ON CONFLICT(device_id) DO UPDATE SET
          age_group = excluded.age_group,
          gender = excluded.gender,
          source = excluded.source,
          updated_at = datetime('now')
      `,
      args: [deviceId, ageGroup, gender, source],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save demographic:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: 통계 조회 (대시보드용)
export async function GET() {
  try {
    const client = getTursoClient();

    // 연령대별 통계
    const ageStats = await client.execute(`
      SELECT age_group, COUNT(*) as count
      FROM user_demographics
      WHERE age_group IS NOT NULL
      GROUP BY age_group
      ORDER BY
        CASE age_group
          WHEN '10s' THEN 1
          WHEN '20s' THEN 2
          WHEN '30s' THEN 3
          WHEN '40s+' THEN 4
        END
    `);

    // 성별 통계
    const genderStats = await client.execute(`
      SELECT gender, COUNT(*) as count
      FROM user_demographics
      WHERE gender IS NOT NULL
      GROUP BY gender
    `);

    // 연령대 x 성별 교차 통계
    const crossStats = await client.execute(`
      SELECT age_group, gender, COUNT(*) as count
      FROM user_demographics
      WHERE age_group IS NOT NULL AND gender IS NOT NULL
      GROUP BY age_group, gender
      ORDER BY age_group, gender
    `);

    // 총 수집 수
    const totalResult = await client.execute(`
      SELECT COUNT(*) as total FROM user_demographics
    `);

    return NextResponse.json({
      total: totalResult.rows[0]?.total || 0,
      byAge: ageStats.rows,
      byGender: genderStats.rows,
      byCross: crossStats.rows,
    });
  } catch (error) {
    console.error('Failed to get demographic stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
