/**
 * 공통 포맷팅 유틸리티
 * - 시간 포맷 (상대 시간)
 * - 숫자 포맷
 */

/**
 * 상대 시간 포맷팅 (예: "방금 전", "5분 전", "3일 전")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}주 전`;
  if (diffDay < 365) return `${Math.floor(diffDay / 30)}개월 전`;
  return `${Math.floor(diffDay / 365)}년 전`;
}

/**
 * timeAgo alias (formatRelativeTime과 동일)
 */
export const timeAgo = formatRelativeTime;

/**
 * 숫자 포맷팅 (1000 → 1K, 1000000 → 1M)
 */
export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 10000) return `${(num / 1000).toFixed(1)}K`;
  if (num < 1000000) return `${Math.floor(num / 1000)}K`;
  return `${(num / 1000000).toFixed(1)}M`;
}

/**
 * 날짜를 한국어 형식으로 포맷팅 (예: "12월 15일")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}
