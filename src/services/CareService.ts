// ============================================================================
// 통합 케어 서비스
// ============================================================================

import type {
  CareProfile,
  AnyCareProfile,
  CareSchedule,
  CareLog,
  CareStats,
  CareFrequency,
  CareTargetType,
} from '../data/care/types';
import {
  CARE_TARGET_CONFIG,
  getCareTypesForTarget,
  getDefaultCareTypesForTarget,
} from '../data/care/types';

const STORAGE_KEYS = {
  profiles: 'chemi_care_profiles',
  schedules: 'chemi_care_schedules',
  logs: 'chemi_care_logs',
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
// CareService
// ============================================================================

class CareService {
  // ==========================================================================
  // 프로필 관리
  // ==========================================================================

  getProfiles(targetType?: CareTargetType): AnyCareProfile[] {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.profiles);
      const profiles: AnyCareProfile[] = saved ? JSON.parse(saved) : [];
      return targetType ? profiles.filter(p => p.type === targetType) : profiles;
    } catch {
      return [];
    }
  }

  getProfile(id: string): AnyCareProfile | undefined {
    return this.getProfiles().find(p => p.id === id);
  }

  addProfile(data: Omit<CareProfile, 'id' | 'createdAt' | 'updatedAt'>): AnyCareProfile {
    const profile: AnyCareProfile = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as AnyCareProfile;

    const profiles = this.getProfiles();
    profiles.push(profile);
    this.saveProfiles(profiles);

    // 기본 스케줄 생성
    const defaultCareTypes = getDefaultCareTypesForTarget(data.type);
    const careTypes = getCareTypesForTarget(data.type);

    defaultCareTypes.forEach(careType => {
      const info = careTypes[careType];
      if (info) {
        this.addSchedule({
          profileId: profile.id,
          targetType: data.type,
          type: careType,
          name: info.name,
          emoji: info.emoji,
          frequency: 'custom',
          customDays: info.defaultDays,
          enabled: true,
        });
      }
    });

    return profile;
  }

  updateProfile(id: string, data: Partial<AnyCareProfile>): AnyCareProfile | undefined {
    const profiles = this.getProfiles();
    const index = profiles.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    profiles[index] = {
      ...profiles[index],
      ...data,
      updatedAt: new Date().toISOString(),
    } as AnyCareProfile;
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

  private saveProfiles(profiles: AnyCareProfile[]): void {
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
    targetType: CareTargetType;
    type: string;
    name: string;
    emoji: string;
    frequency: CareFrequency;
    customDays?: number;
    enabled?: boolean;
  }): CareSchedule {
    const today = getToday();
    const days = this.getFrequencyDays(data.frequency, data.customDays, data.targetType, data.type);

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

  private getFrequencyDays(
    frequency: CareFrequency,
    customDays?: number,
    targetType?: CareTargetType,
    careType?: string
  ): number {
    switch (frequency) {
      case 'daily': return 1;
      case 'weekly': return 7;
      case 'biweekly': return 14;
      case 'monthly': return 30;
      case 'custom': return customDays || 7;
      default:
        // 타입별 기본값
        if (targetType && careType) {
          const careTypes = getCareTypesForTarget(targetType);
          if (careType in careTypes) {
            return careTypes[careType].defaultDays;
          }
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

    const profile = this.getProfile(schedule.profileId);
    if (!profile) return undefined;

    const today = getToday();
    const days = this.getFrequencyDays(
      schedule.frequency,
      schedule.customDays,
      profile.type,
      schedule.type
    );

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

  getTodayTasks(): Array<CareSchedule & { profile: AnyCareProfile; isOverdue: boolean; daysUntil: number }> {
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

  getDueTasks(): Array<CareSchedule & { profile: AnyCareProfile; isOverdue: boolean; daysUntil: number }> {
    return this.getTodayTasks().filter(task => task.daysUntil <= 0);
  }

  getUpcomingTasks(days: number = 3): Array<CareSchedule & { profile: AnyCareProfile; isOverdue: boolean; daysUntil: number }> {
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

    // 대상별 프로필 수
    const profilesByTarget: Record<CareTargetType, number> = {
      plant: 0,
      dog: 0,
      cat: 0,
      fish: 0,
      hamster: 0,
      rabbit: 0,
    };
    profiles.forEach(p => {
      profilesByTarget[p.type]++;
    });

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
        streak = 1;
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

  // ==========================================================================
  // 마이그레이션 (기존 PlantCareService 데이터)
  // ==========================================================================

  migrateFromPlantCareService(): void {
    if (typeof window === 'undefined') return;

    const oldProfilesKey = 'chemi_plant_profiles';
    const oldSchedulesKey = 'chemi_plant_schedules';
    const oldLogsKey = 'chemi_plant_logs';

    try {
      // 이미 마이그레이션 되었는지 확인
      const existingProfiles = this.getProfiles();
      if (existingProfiles.length > 0) return;

      // 기존 데이터 읽기
      const oldProfiles = localStorage.getItem(oldProfilesKey);
      const oldSchedules = localStorage.getItem(oldSchedulesKey);
      const oldLogs = localStorage.getItem(oldLogsKey);

      if (oldProfiles) {
        localStorage.setItem(STORAGE_KEYS.profiles, oldProfiles);
      }
      if (oldSchedules) {
        localStorage.setItem(STORAGE_KEYS.schedules, oldSchedules);
      }
      if (oldLogs) {
        localStorage.setItem(STORAGE_KEYS.logs, oldLogs);
      }
    } catch {
      // 마이그레이션 실패해도 무시
    }
  }

  // ==========================================================================
  // 테스트 결과 연동
  // ==========================================================================

  /**
   * 테스트 결과로 케어 프로필 생성
   * @param testSubject 테스트 종류 (dog, cat, plant 등)
   * @param resultKey 결과 키
   * @param resultEmoji 결과 이모지
   * @param profileName 프로필 이름 (사용자 입력)
   * @param additionalData 추가 프로필 데이터
   */
  createProfileFromTestResult(
    testSubject: string,
    resultKey: string,
    resultEmoji: string,
    profileName: string,
    additionalData?: Record<string, unknown>
  ): AnyCareProfile | null {
    // 테스트 타입 → 케어 타입 매핑
    const careType = this.getCareTypeFromTest(testSubject, resultKey);
    if (!careType) return null;

    const profileData: Record<string, unknown> = {
      type: careType,
      name: profileName,
      testResult: {
        resultKey,
        resultEmoji,
        completedAt: new Date().toISOString(),
      },
      ...additionalData,
    };

    return this.addProfile(profileData as Parameters<typeof this.addProfile>[0]);
  }

  /**
   * 테스트 종류와 결과로 케어 타입 결정
   */
  getCareTypeFromTest(testSubject: string, resultKey?: string): CareTargetType | null {
    // 직접 매핑되는 테스트 (dog, cat, rabbit, hamster, plant)
    const directMapping: Record<string, CareTargetType> = {
      dog: 'dog',
      cat: 'cat',
      rabbit: 'rabbit',
      hamster: 'hamster',
      plant: 'plant',
    };

    if (testSubject in directMapping) {
      return directMapping[testSubject];
    }

    // petMatch는 결과에 따라 다른 케어 타입
    if (testSubject === 'petMatch' && resultKey) {
      // 결과 키에서 동물 타입 추출 (예: 'dog_active' → 'dog')
      const animalType = resultKey.split('_')[0];
      const petMatchMapping: Record<string, CareTargetType> = {
        dog: 'dog',
        cat: 'cat',
        rabbit: 'rabbit',
        hamster: 'hamster',
        fish: 'fish',
      };
      return petMatchMapping[animalType] || null;
    }

    return null;
  }

  /**
   * 특정 테스트 결과와 연동된 프로필 찾기
   */
  getProfilesWithTestResult(testSubject?: string): AnyCareProfile[] {
    return this.getProfiles().filter(p => {
      if (!p.testResult) return false;
      if (testSubject) {
        // 특정 테스트 타입으로 필터링
        const careType = this.getCareTypeFromTest(testSubject);
        return careType === p.type;
      }
      return true;
    });
  }

  /**
   * 프로필에 테스트 결과 연동
   */
  linkTestResult(
    profileId: string,
    resultKey: string,
    resultEmoji: string
  ): AnyCareProfile | undefined {
    return this.updateProfile(profileId, {
      testResult: {
        resultKey,
        resultEmoji,
        completedAt: new Date().toISOString(),
      },
    });
  }

  // ==========================================================================
  // 헬퍼
  // ==========================================================================

  getTargetConfig(type: CareTargetType) {
    return CARE_TARGET_CONFIG[type];
  }

  /**
   * 테스트가 케어 대상과 연동 가능한지 확인
   */
  isTestLinkable(testSubject: string): boolean {
    const linkableTests = ['dog', 'cat', 'rabbit', 'hamster', 'plant', 'petMatch'];
    return linkableTests.includes(testSubject);
  }
}

// 싱글톤 인스턴스
export const careService = new CareService();
