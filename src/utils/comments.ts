/**
 * 댓글 관련 유틸 함수
 */

export async function getCommentCount(targetType: string, targetId: string): Promise<number> {
  try {
    const res = await fetch(`/api/comments?targetType=${targetType}&targetId=${targetId}&limit=1`);
    if (!res.ok) return 0;
    const data = await res.json();
    return data.total || 0;
  } catch {
    return 0;
  }
}
