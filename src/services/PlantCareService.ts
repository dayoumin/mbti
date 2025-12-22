// ============================================================================
// 식물 케어 서비스
// ============================================================================

import type {
  PlantProfile,
  CareSchedule,
  CareLog,
  PlantCareType,
  CareStats,
  CareFrequency,
  CareTargetType
} from '../data/care/types';
import { PLANT_CARE_TYPES } from '../data/care/types';
import { STORAGE_KEYS as GLOBAL_STORAGE_KEYS } from '@/lib/storage';

// 로컬 키 매핑 (기존 코드 호환)
const STORAGE_KEYS = {
  profiles: GLOBAL_STORAGE_KEYS.PLANT_PROFILES,
  schedules: GLOBAL_STORAGE_KEYS.PLANT_SCHEDULES,
  logs: GLOBAL_STORAGE_KEYS.PLANT_LOGS,
};

// ============================================================================
// 유틸리티
// ============================================================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function getDaysDiff(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

// ============================================================================
// PlantCareService
// ============================================================================

class PlantCareService {
  // ==========================================================================
  // 프로필 관리
  // ==========================================================================

  getProfiles(): PlantProfile[] {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.profiles);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  getProfile(id: string): PlantProfile | undefined {
    return this.getProfiles().find(p => p.id === id);
  }

  addProfile(data: Omit<PlantProfile, 'id' | 'type' | 'createdAt' | 'updatedAt'>): PlantProfile {
    const profile: PlantProfile = {
      ...data,
      id: generateId(),
      type: 'plant',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const profiles = this.getProfiles();
    profiles.push(profile);
    this.saveProfiles(profiles);

    // 기본 스케줄 생성 (물주기)
    this.addSchedule({
      profileId: profile.id,
      type: 'water',
      name: PLANT_CARE_TYPES.water.name,
      emoji: PLANT_CARE_TYPES.water.emoji,
      frequency: 'weekly',
      enabled: true,
    });

    return profile;
  }

  updateProfile(id: string, data: Partial<PlantProfile>): PlantProfile | undefined {
    const profiles = this.getProfiles();
    const index = profiles.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    profiles[index] = {
      ...profiles[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.saveProfiles(profiles);
    return profiles[index];
  }

  deleteProfile(id: string): boolean {
    const profiles = this.getProfiles().filter(p => p.id !== id);
    this.saveProfiles(profiles);

    // 관련 스케줄/로그도 삭제
    const schedules = this.getSchedules().filter(s => s.profileId !== id);
    this.saveSchedules(schedules);

    const logs = this.getLogs().filter(l => l.profileId !== id);
    this.saveLogs(logs);

    return true;
  }

  private saveProfiles(profiles: PlantProfile[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.profiles, JSON.stringify(profiles));
  }

  // ==========================================================================
  // 스케줄 관리
  // ==========================================================================

  getSchedules(profileId?: string): CareSchedule[] {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.schedules);
      const schedules: CareSchedule[] = saved ? JSON.parse(saved) : [];
      return profileId ? schedules.filter(s => s.profileId === profileId) : schedules;
    } catch {
      return [];
    }
  }

  getSchedule(id: string): CareSchedule | undefined {
    return this.getSchedules().find(s => s.id === id);
  }

  addSchedule(data: {
    profileId: string;
    type: PlantCareType;
    name: string;
    emoji: string;
    frequency: CareFrequency;
    customDays?: number;
    enabled?: boolean;
  }): CareSchedule {
    const today = getToday();
    const days = this.getFrequencyDays(data.frequency, data.customDays, data.type);

    const schedule: CareSchedule = {
      id: generateId(),
      profileId: data.profileId,
      type: data.type,
      name: data.name,
      emoji: data.emoji,
      frequency: data.frequency,
      customDays: data.customDays,
      enabled: data.enabled ?? true,
      nextDue: addDays(today, days),
      createdAt: new Date().toISOString(),
    };

    const schedules = this.getSchedules();
    schedules.push(schedule);
    this.saveSchedules(schedules);
    return schedule;
  }

  updateSchedule(id: string, data: Partial<CareSchedule>): CareSchedule | undefined {
    const schedules = this.getSchedules();
    const index = schedules.findIndex(s => s.id === id);
    if (index === -1) return undefined;

    schedules[index] = { ...schedules[index], ...data };
    this.saveSchedules(schedules);
    return schedules[index];
  }

  deleteSchedule(id: string): boolean {
    const schedules = this.getSchedules().filter(s => s.id !== id);
    this.saveSchedules(schedules);
    return true;
  }

  private saveSchedules(schedules: CareSchedule[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.schedules, JSON.stringify(schedules));
  }

  private getFrequencyDays(frequency: CareFrequency, customDays?: number, type?: string): number {
    switch (frequency) {
      case 'daily': return 1;
      case 'weekly': return 7;
      case 'biweekly': return 14;
      case 'monthly': return 30;
      case 'custom': return customDays || 7;
      default:
        // 타입별 기본값
        if (type && type in PLANT_CARE_TYPES) {
          return PLANT_CARE_TYPES[type as PlantCareType].defaultDays;
        }
        return 7;
    }
  }

  // ==========================================================================
  // 케어 완료 & 로그
  // ==========================================================================

  completeCare(scheduleId: string, notes?: string): CareLog | undefined {
    const schedule = this.getSchedule(scheduleId);
    if (!schedule) return undefined;

    const today = getToday();
    const days = this.getFrequencyDays(schedule.frequency, schedule.customDays, schedule.type);

    // 로그 생성
    const log: CareLog = {
      id: generateId(),
      profileId: schedule.profileId,
      scheduleId: schedule.id,
      type: schedule.type,
      completedAt: new Date().toISOString(),
      notes,
    };

    const logs = this.getLogs();
    logs.push(log);
    this.saveLogs(logs);

    // 스케줄 업데이트
    this.updateSchedule(scheduleId, {
      lastCompleted: today,
      nextDue: addDays(today, days),
    });

    return log;
  }

  getLogs(profileId?: string): CareLog[] {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.logs);
      const logs: CareLog[] = saved ? JSON.parse(saved) : [];
      return profileId ? logs.filter(l => l.profileId === profileId) : logs;
    } catch {
      return [];
    }
  }

  private saveLogs(logs: CareLog[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(logs));
  }

  // ==========================================================================
  // 오늘의 할 일
  // ==========================================================================

  getTodayTasks(): Array<CareSchedule & { profile: PlantProfile; isOverdue: boolean; daysUntil: number }> {
    const today = getToday();
    const profiles = this.getProfiles();
    const schedules = this.getSchedules().filter(s => s.enabled);

    return schedules
      .map(schedule => {
        const profile = profiles.find(p => p.id === schedule.profileId);
        if (!profile) return null;

        const daysUntil = getDaysDiff(today, schedule.nextDue);
        const isOverdue = daysUntil < 0;

        return {
          ...schedule,
          profile,
          isOverdue,
          daysUntil,
        };
      })
      .filter((task): task is NonNullable<typeof task> => task !== null)
      .sort((a, b) => a.daysUntil - b.daysUntil); // 긴급한 것 먼저
  }

  getDueTasks(): Array<CareSchedule & { profile: PlantProfile; isOverdue: boolean; daysUntil: number }> {
    return this.getTodayTasks().filter(task => task.daysUntil <= 0);
  }

  getUpcomingTasks(days: number = 3): Array<CareSchedule & { profile: PlantProfile; isOverdue: boolean; daysUntil: number }> {
    return this.getTodayTasks().filter(task => task.daysUntil > 0 && task.daysUntil <= days);
  }

  // ==========================================================================
  // 통계
  // ==========================================================================

  getStats(): CareStats {
    const profiles = this.getProfiles();
    const logs = this.getLogs();
    const today = getToday();

    // 타입별 케어 횟수
    const careByType: Record<string, number> = {};
    logs.forEach(log => {
      careByType[log.type] = (careByType[log.type] || 0) + 1;
    });

    // 대상 타입별 프로필 수 (PlantCareService는 식물만 다룸)
    const profilesByTarget: Record<CareTargetType, number> = {
      plant: profiles.length,
      dog: 0,
      cat: 0,
      fish: 0,
      hamster: 0,
      rabbit: 0,
    };

    // 마지막 케어 날짜
    const sortedLogs = [...logs].sort((a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
    const lastLog = sortedLogs[0];

    // 연속 케어 일수 계산 (간단 버전)
    let streak = 0;
    if (lastLog) {
      const lastDate = lastLog.completedAt.split('T')[0];
      const diff = getDaysDiff(lastDate, today);
      if (diff <= 1) {
        streak = 1; // 오늘 또는 어제 케어함
        // TODO: 더 정교한 스트릭 계산
      }
    }

    return {
      totalProfiles: profiles.length,
      totalLogs: logs.length,
      streak,
      lastCareDate: lastLog?.completedAt.split('T')[0],
      careByType,
      profilesByTarget,
    };
  }
}

// 싱글톤 인스턴스
export const plantCareService = new PlantCareService();
