'use client';

import { Home, Compass, Trophy, User, MessageSquare } from 'lucide-react';

// 네비게이션 탭 타입 (BottomNav, Sidebar 공통)
// care는 메인 탭에서 제거 - 프로필 > 동물 탭 또는 테스트 결과에서 유도
export type NavTab = 'home' | 'explore' | 'ranking' | 'talk' | 'profile';

// 네비게이션 아이템 타입
export interface NavItem {
  key: NavTab;
  label: string;
  icon: typeof Home;
}

// 하단 네비게이션 아이템 (5개 - iOS 권장 최대, 모바일 전용)
export const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: '홈', icon: Home },
  { key: 'explore', label: '퀴즈/투표', icon: Compass },
  { key: 'ranking', label: '랭킹', icon: Trophy },
  { key: 'talk', label: '커뮤니티', icon: MessageSquare },
  { key: 'profile', label: '프로필', icon: User },
];

// 사이드바 네비게이션 아이템 (프로필 제외 - 데스크톱에서는 하단 위젯으로 대체)
export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  { key: 'home', label: '홈', icon: Home },
  { key: 'explore', label: '퀴즈/투표', icon: Compass },
  { key: 'ranking', label: '랭킹', icon: Trophy },
  { key: 'talk', label: '커뮤니티', icon: MessageSquare },
];
