/**
 * 커뮤니티 Mock 데이터
 *
 * 현재: 하드코딩된 샘플 데이터
 * 향후: API 연동 시 이 파일은 타입 정의만 남기고 데이터는 서버에서 가져옴
 */

// ============================================================================
// 타입 정의
// ============================================================================

export interface CommunityPost {
  id: string;
  category: 'tip' | 'qna' | 'boast' | 'general';
  title: string;
  author: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  viewCount: number;
}

export type PostCategory = CommunityPost['category'];

export const POST_CATEGORY_LABELS: Record<PostCategory | 'all', string> = {
  all: '전체',
  tip: '꿀팁',
  qna: '질문/답변',
  boast: '자랑하기',
  general: '자유'
};

/** 카테고리별 색상 스타일 */
export const CATEGORY_STYLES: Record<PostCategory, { bg: string; text: string }> = {
  tip: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  qna: { bg: 'bg-amber-50', text: 'text-amber-600' },
  boast: { bg: 'bg-pink-50', text: 'text-pink-600' },
  general: { bg: 'bg-slate-50', text: 'text-slate-500' }
};

/** 게시판 카테고리 라벨 조회 */
export function getPostCategoryLabel(category: PostCategory): string {
  return POST_CATEGORY_LABELS[category];
}

/** 게시판 카테고리 스타일 클래스 조회 */
export function getPostCategoryStyle(category: PostCategory): string {
  const style = CATEGORY_STYLES[category];
  return `${style.bg} ${style.text}`;
}

// ============================================================================
// Mock 데이터
// ============================================================================

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: '1',
    category: 'tip',
    title: '여름철 강아지 발바닥 보호법',
    author: '뽀삐맘',
    content: '요즘 날씨가 너무 더워요. 산책할 때 아스팔트 온도가 50도가 넘는다고 하니 주의해야 합니다...',
    date: '2025-06-20',
    likes: 45,
    comments: 12,
    viewCount: 156
  },
  {
    id: '2',
    category: 'qna',
    title: '고양이가 갑자기 밥을 안 먹어요',
    author: '초보집사',
    content: '사료를 잘 먹던 아이가 갑자기 어제부터 입도 안 대는데 무슨 문제가 있을까요?',
    date: '2025-06-19',
    likes: 8,
    comments: 24,
    viewCount: 320
  },
  {
    id: '3',
    category: 'boast',
    title: '드디어 개냥이 결과 나왔어요!',
    author: '나비아빠',
    content: '어제 테스트에서 "개냥이" 결과 나왔는데, 진짜로 저 퇴근하자마자 무릎에 와서 골골송 부르네요 ㅎㅎ',
    date: '2025-06-19',
    likes: 120,
    comments: 45,
    viewCount: 890
  }
];

// 미리보기용 (최근 3개)
export const MOCK_COMMUNITY_PREVIEW = MOCK_COMMUNITY_POSTS.slice(0, 3);
