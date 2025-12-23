/**
 * 테스트 아이콘 유틸리티
 *
 * config.ts의 lucideIcon 필드를 기반으로 아이콘을 렌더링합니다.
 * 새 테스트 추가 시 config.ts에 lucideIcon만 추가하면 됩니다.
 *
 * 단, 새 아이콘 종류를 사용하는 경우 LUCIDE_ICON_MAP에도 추가 필요합니다.
 */

import {
  Brain,
  Cat,
  Dog,
  Rabbit,
  Puzzle,
  Heart,
  Flower2,
  Star,
  Coffee,
  CupSoda,
  HeartHandshake,
  Apple,
  Wine,
  Croissant,
  Sparkle,
  Leaf,
  UtensilsCrossed,
  Soup,
  Fish,
  Bird,
  Bug,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';
import { SUBJECT_CONFIG } from '@/data/config';
import type { SubjectKey } from '@/data/types';

// lucide-react 아이콘 매핑 (문자열 -> 컴포넌트)
// 새 아이콘 종류 사용 시 여기에 추가
const LUCIDE_ICON_MAP: Record<string, LucideIcon> = {
  Brain,
  Cat,
  Dog,
  Rabbit,
  Puzzle,
  Heart,
  Flower2,
  Star,
  Coffee,
  CupSoda,
  HeartHandshake,
  Apple,
  Wine,
  Croissant,
  Sparkle,
  Leaf,
  UtensilsCrossed,
  Soup,
  Fish,
  Bird,
  Bug,
};

// 폴백 아이콘 (lucideIcon 없거나 매핑 없을 때)
const FALLBACK_ICON = HelpCircle;

/**
 * config.ts의 lucideIcon 필드를 읽어 아이콘 렌더링
 *
 * @param key - 테스트 SubjectKey
 * @param className - 아이콘 CSS 클래스 (기본: "w-5 h-5")
 * @returns React 노드로 렌더링된 아이콘
 *
 * @example
 * ```tsx
 * <span>{getTestIcon('human')}</span>
 * <span>{getTestIcon('cat', 'w-6 h-6 text-blue-500')}</span>
 * ```
 */
export function getTestIcon(key: SubjectKey, className = "w-5 h-5"): React.ReactNode {
  const config = SUBJECT_CONFIG[key];
  const iconName = config?.lucideIcon;

  if (!iconName) {
    // lucideIcon 필드가 없는 경우 - 개발 환경에서 경고
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[getTestIcon] Missing lucideIcon for "${key}" in config.ts`);
    }
    return <FALLBACK_ICON className={className} />;
  }

  const IconComponent = LUCIDE_ICON_MAP[iconName];

  if (!IconComponent) {
    // 매핑에 없는 아이콘인 경우 - 개발 환경에서 경고
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[getTestIcon] Unknown icon "${iconName}" for "${key}". Add it to LUCIDE_ICON_MAP in testIcons.tsx`);
    }
    return <FALLBACK_ICON className={className} />;
  }

  return <IconComponent className={className} />;
}

/**
 * LUCIDE_ICON_MAP에 있는 아이콘 이름 목록
 * 검증 스크립트에서 사용
 */
export const AVAILABLE_LUCIDE_ICONS = Object.keys(LUCIDE_ICON_MAP);
