'use client';

import { Home, Trophy, User, MessageSquare, Brain } from 'lucide-react';

// 네비게이션 탭 타입 (BottomNav, Sidebar 공통)
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
  { key: 'explore', label: '퀴즈/투표', icon: Brain },
  { key: 'ranking', label: '랭킹', icon: Trophy },
  { key: 'talk', label: '커뮤니티', icon: MessageSquare },
  { key: 'profile', label: '프로필', icon: User },
];

// 사이드바 네비게이션 아이템 (데스크톱)
export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  { key: 'home', label: '홈', icon: Home },
  { key: 'explore', label: '퀴즈/투표', icon: Brain },
  { key: 'ranking', label: '랭킹', icon: Trophy },
  { key: 'talk', label: '커뮤니티', icon: MessageSquare },
];
