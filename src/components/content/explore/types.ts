import type { SituationCategory, ContentCategory } from '@/data/content/types';

export type TabType = 'quiz' | 'poll' | 'community';
export type CommunitySubTab = 'tips' | 'qna' | 'debate';

export const SITUATION_TO_CONTENT_CATEGORY: Record<SituationCategory, ContentCategory> = {
  relationship: 'love',
  work: 'lifestyle',
  social: 'relationship',
  awkward: 'general',
};
