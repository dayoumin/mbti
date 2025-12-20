/**
 * Icons 유틸리티
 *
 * 아이콘 컴포넌트 동적 로드를 위한 헬퍼 함수
 */

import * as Icons from '@/components/Icons';

// 아이콘 컴포넌트 타입 정의
export type IconComponent = React.ComponentType<{ mood?: string; className?: string }>;

// 기본 아이콘 (폴백)
const DefaultIcon = Icons.HumanIcon as IconComponent;

/**
 * 아이콘 이름으로 컴포넌트를 가져옴
 * @param iconName - SUBJECT_CONFIG의 icon 필드값 (예: 'CatFace', 'DogFace')
 * @returns 아이콘 컴포넌트 (없으면 HumanIcon)
 */
export function getIconComponent(iconName: string): IconComponent {
  const IconComp = Icons[iconName as keyof typeof Icons];
  if (IconComp) {
    return IconComp as IconComponent;
  }
  return DefaultIcon;
}
