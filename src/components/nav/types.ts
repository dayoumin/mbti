'use client';

import { Home, Compass, Trophy, User } from 'lucide-react';

// 네비게이션 탭 타입 (BottomNav, Sidebar 공통)
export type NavTab = 'home' | 'explore' | 'ranking' | 'profile';

// 네비게이션 아이템 타입
export interface NavItem {
  key: NavTab;
  label: string;
  icon: typeof Home;
}

// 공통 네비게이션 아이템
export const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: '홈', icon: Home },
  { key: 'explore', label: '퀴즈/투표', icon: Compass },
  { key: 'ranking', label: '랭킹', icon: Trophy },
  { key: 'profile', label: '프로필', icon: User },
];
