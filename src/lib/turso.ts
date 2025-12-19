/**
 * Turso Database Client
 *
 * libSQL 기반 Turso 데이터베이스 연결
 * - 서버 컴포넌트 및 API 라우트에서 사용
 * - Edge 환경 지원
 */

import { createClient, Client } from '@libsql/client';

let tursoClient: Client | null = null;

export function getTursoClient(): Client {
  if (tursoClient) return tursoClient;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error('TURSO_DATABASE_URL is not defined');
  }

  tursoClient = createClient({
    url,
    authToken,
  });

  return tursoClient;
}

// 단축 함수들
export async function query(sql: string, args?: unknown[]) {
  const client = getTursoClient();
  return client.execute({ sql, args: args as never[] });
}

export async function batch(statements: { sql: string; args?: unknown[] }[]) {
  const client = getTursoClient();
  return client.batch(statements.map(s => ({ sql: s.sql, args: s.args as never[] })));
}

export default getTursoClient;
