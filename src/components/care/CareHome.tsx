'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Check,
  Clock,
  AlertCircle,
  ChevronRight,
  Trash2,
  X,
  Calendar,
  BarChart3,
  Heart,
} from 'lucide-react';
import { careService } from '@/services/CareService';
import type { AnyCareProfile, CareSchedule, CareLog, CareTargetType } from '@/data/care/types';
import { CARE_TARGET_CONFIG, getCareTypesForTarget } from '@/data/care/types';

// ============================================================================
// Main Component
// ============================================================================

export default function CareHome() {
  const [activeView, setActiveView] = useState<'today' | 'friends' | 'history'>('today');
  const [profiles, setProfiles] = useState<AnyCareProfile[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  useEffect(() => {
    // 기존 PlantCareService 데이터 마이그레이션
    careService.migrateFromPlantCareService();
    setProfiles(careService.getProfiles());
  }, [refreshKey]);

  // 프로필 타입별 요약
  const getProfileSummary = () => {
    const counts: Partial<Record<CareTargetType, number>> = {};
    profiles.forEach(p => {
      counts[p.type] = (counts[p.type] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([type, count]) => `${CARE_TARGET_CONFIG[type as CareTargetType].emoji} ${count}`)
      .join('  ');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500" />
            케어 홈
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {profiles.length > 0 ? getProfileSummary() : '돌보는 친구가 없어요'}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          추가
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
        {[
          { key: 'today', label: '오늘 할 일', icon: <Clock className="w-4 h-4" /> },
          { key: 'friends', label: '내 친구들', icon: <Heart className="w-4 h-4" /> },
          { key: 'history', label: '기록', icon: <BarChart3 className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveView(tab.key as typeof activeView)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeView === tab.key
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeView === 'today' && <TodayView refresh={refresh} refreshKey={refreshKey} />}
      {activeView === 'friends' && (
        <FriendsListView
          profiles={profiles}
          onAddClick={() => setShowAddModal(true)}
          refresh={refresh}
        />
      )}
      {activeView === 'history' && <HistoryView refreshKey={refreshKey} />}

      {/* Add Modal */}
      {showAddModal && (
        <AddProfileModal
          onClose={() => setShowAddModal(false)}
          onAdd={() => {
            refresh();
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// Today View
// ============================================================================

function TodayView({ refresh, refreshKey }: { refresh: () => void; refreshKey: number }) {
  const [dueTasks, setDueTasks] = useState<ReturnType<typeof careService.getDueTasks>>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<ReturnType<typeof careService.getUpcomingTasks>>([]);

  useEffect(() => {
    setDueTasks(careService.getDueTasks());
    setUpcomingTasks(careService.getUpcomingTasks(7));
  }, [refreshKey]);

  const handleComplete = (scheduleId: string) => {
    careService.completeCare(scheduleId);
    setDueTasks(careService.getDueTasks());
    setUpcomingTasks(careService.getUpcomingTasks(7));
    refresh();
  };

  if (dueTasks.length === 0 && upcomingTasks.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-2xl">
        <div className="text-4xl mb-3">🌟</div>
        <p className="text-slate-600 font-medium">오늘 할 일이 없어요!</p>
        <p className="text-sm text-slate-400 mt-1">친구를 추가하면 케어 알림이 표시됩니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 긴급 (오늘/지난 것) */}
      {dueTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            지금 해주세요! ({dueTasks.length})
          </h3>
          <div className="space-y-2">
            {dueTasks.map(task => (
              <TaskCard key={task.id} task={task} onComplete={handleComplete} urgent />
            ))}
          </div>
        </div>
      )}

      {/* 예정 */}
      {upcomingTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            다가오는 일정 ({upcomingTasks.length})
          </h3>
          <div className="space-y-2">
            {upcomingTasks.map(task => (
              <TaskCard key={task.id} task={task} onComplete={handleComplete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Task Card
// ============================================================================

interface TaskCardProps {
  task: ReturnType<typeof careService.getDueTasks>[0];
  onComplete: (id: string) => void;
  urgent?: boolean;
}

function TaskCard({ task, onComplete, urgent }: TaskCardProps) {
  const targetConfig = CARE_TARGET_CONFIG[task.profile.type];
  const daysText = task.daysUntil === 0
    ? '오늘'
    : task.daysUntil < 0
      ? `${Math.abs(task.daysUntil)}일 지남`
      : `${task.daysUntil}일 후`;

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
        urgent
          ? 'bg-red-50 border border-red-200'
          : 'bg-white border border-slate-200'
      }`}
    >
      <div className={`w-10 h-10 ${targetConfig.color} rounded-full flex items-center justify-center text-xl`}>
        {targetConfig.emoji}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-slate-800">{task.profile.name}</p>
        <p className="text-sm text-slate-500">
          {task.emoji} {task.name} • <span className={urgent ? 'text-red-500 font-medium' : ''}>{daysText}</span>
        </p>
      </div>
      <button
        onClick={() => onComplete(task.id)}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          urgent
            ? 'bg-red-500 text-white hover:bg-red-600'
            : `${targetConfig.accentColor} text-white hover:opacity-90`
        }`}
      >
        <Check className="w-5 h-5" />
      </button>
    </div>
  );
}

// ============================================================================
// Friends List View
// ============================================================================

interface FriendsListViewProps {
  profiles: AnyCareProfile[];
  onAddClick: () => void;
  refresh: () => void;
}

function FriendsListView({ profiles, onAddClick, refresh }: FriendsListViewProps) {
  const [selectedProfile, setSelectedProfile] = useState<AnyCareProfile | null>(null);

  if (profiles.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-2xl">
        <div className="text-4xl mb-3">💝</div>
        <p className="text-slate-600 font-medium">아직 등록된 친구가 없어요</p>
        <button
          onClick={onAddClick}
          className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors"
        >
          첫 친구 추가하기
        </button>
      </div>
    );
  }

  // 타입별로 그룹화
  const groupedProfiles = profiles.reduce((acc, profile) => {
    if (!acc[profile.type]) acc[profile.type] = [];
    acc[profile.type].push(profile);
    return acc;
  }, {} as Record<CareTargetType, AnyCareProfile[]>);

  return (
    <>
      <div className="space-y-4">
        {Object.entries(groupedProfiles).map(([type, typeProfiles]) => {
          const config = CARE_TARGET_CONFIG[type as CareTargetType];
          return (
            <div key={type}>
              <h3 className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
                <span>{config.emoji}</span>
                {config.name} ({typeProfiles.length})
              </h3>
              <div className="grid gap-2">
                {typeProfiles.map(profile => (
                  <button
                    key={profile.id}
                    onClick={() => setSelectedProfile(profile)}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all text-left"
                  >
                    <div className={`w-12 h-12 ${config.color} rounded-xl flex items-center justify-center text-2xl`}>
                      {config.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{profile.name}</p>
                      <p className="text-sm text-slate-500">
                        {getProfileSubtitle(profile)}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedProfile && (
        <ProfileDetailModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onDelete={() => {
            refresh();
            setSelectedProfile(null);
          }}
          refresh={refresh}
        />
      )}
    </>
  );
}

function getProfileSubtitle(profile: AnyCareProfile): string {
  switch (profile.type) {
    case 'plant':
      return profile.species || profile.location || '정보 없음';
    case 'dog':
    case 'cat':
      return profile.breed || '품종 미지정';
    case 'fish':
      return profile.species || '어종 미지정';
    case 'hamster':
    case 'rabbit':
      return profile.breed || '품종 미지정';
    default:
      return '';
  }
}

// ============================================================================
// History View
// ============================================================================

function HistoryView({ refreshKey }: { refreshKey: number }) {
  const [logs, setLogs] = useState<CareLog[]>([]);
  const [profiles, setProfiles] = useState<AnyCareProfile[]>([]);

  useEffect(() => {
    const allLogs = careService.getLogs();
    const sortedLogs = [...allLogs].sort((a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
    setLogs(sortedLogs);
    setProfiles(careService.getProfiles());
  }, [refreshKey]);

  const getProfileInfo = (id: string) => {
    const profile = profiles.find(p => p.id === id);
    if (!profile) return { name: '삭제된 친구', config: CARE_TARGET_CONFIG.plant };
    return { name: profile.name, config: CARE_TARGET_CONFIG[profile.type] };
  };

  const getCareInfo = (profileId: string, type: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return { name: type, emoji: '✅' };
    const careTypes = getCareTypesForTarget(profile.type);
    const info = careTypes[type];
    return info || { name: type, emoji: '✅' };
  };

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-2xl">
        <div className="text-4xl mb-3">📝</div>
        <p className="text-slate-600 font-medium">아직 기록이 없어요</p>
        <p className="text-sm text-slate-400 mt-1">케어를 완료하면 기록이 쌓입니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {logs.slice(0, 30).map(log => {
        const profileInfo = getProfileInfo(log.profileId);
        const care = getCareInfo(log.profileId, log.type);
        const date = new Date(log.completedAt);
        return (
          <div
            key={log.id}
            className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100"
          >
            <div className={`w-8 h-8 ${profileInfo.config.color} rounded-full flex items-center justify-center text-sm`}>
              {profileInfo.config.emoji}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-700">
                {profileInfo.name} - {care.emoji} {care.name}
              </p>
              <p className="text-xs text-slate-400">
                {date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' })}
              </p>
            </div>
            <Check className="w-4 h-4 text-green-500" />
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Add Profile Modal
// ============================================================================

interface AddProfileModalProps {
  onClose: () => void;
  onAdd: () => void;
}

function AddProfileModal({ onClose, onAdd }: AddProfileModalProps) {
  const [step, setStep] = useState<'type' | 'details'>('type');
  const [selectedType, setSelectedType] = useState<CareTargetType | null>(null);
  const [name, setName] = useState('');
  const [subInfo, setSubInfo] = useState('');

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleTypeSelect = (type: CareTargetType) => {
    setSelectedType(type);
    setStep('details');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedType) return;

    const profileData: Record<string, unknown> = {
      type: selectedType,
      name: name.trim(),
    };

    // 타입별 추가 정보
    switch (selectedType) {
      case 'plant':
        if (subInfo) profileData.species = subInfo.trim();
        break;
      case 'dog':
      case 'cat':
      case 'hamster':
      case 'rabbit':
        if (subInfo) profileData.breed = subInfo.trim();
        break;
      case 'fish':
        if (subInfo) profileData.species = subInfo.trim();
        break;
    }

    careService.addProfile(profileData as Parameters<typeof careService.addProfile>[0]);
    onAdd();
  };

  const getSubInfoLabel = (): string => {
    switch (selectedType) {
      case 'plant': return '종류 (예: 몬스테라)';
      case 'dog': return '견종 (예: 말티즈)';
      case 'cat': return '묘종 (예: 코숏)';
      case 'fish': return '어종 (예: 구피)';
      case 'hamster': return '품종 (예: 골든햄스터)';
      case 'rabbit': return '품종 (예: 네덜란드 드워프)';
      default: return '종류';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-profile-title"
    >
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 id="add-profile-title" className="text-lg font-bold text-slate-800">
            {step === 'type' ? '누구를 추가할까요?' : `${CARE_TARGET_CONFIG[selectedType!].emoji} ${CARE_TARGET_CONFIG[selectedType!].name} 추가`}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {step === 'type' ? (
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(CARE_TARGET_CONFIG) as [CareTargetType, typeof CARE_TARGET_CONFIG[CareTargetType]][]).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleTypeSelect(key)}
                className={`p-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all flex flex-col items-center gap-2`}
              >
                <span className="text-3xl">{config.emoji}</span>
                <span className="text-sm font-medium text-slate-700">{config.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                이름 *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={`${CARE_TARGET_CONFIG[selectedType!].name} 이름`}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {getSubInfoLabel()} (선택)
              </label>
              <input
                type="text"
                value={subInfo}
                onChange={e => setSubInfo(e.target.value)}
                placeholder={getSubInfoLabel()}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('type')}
                className="flex-1 py-3 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50"
              >
                이전
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                추가하기
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Profile Detail Modal
// ============================================================================

interface ProfileDetailModalProps {
  profile: AnyCareProfile;
  onClose: () => void;
  onDelete: () => void;
  refresh: () => void;
}

function ProfileDetailModal({ profile, onClose, onDelete, refresh }: ProfileDetailModalProps) {
  const [schedules, setSchedules] = useState<CareSchedule[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const config = CARE_TARGET_CONFIG[profile.type];

  useEffect(() => {
    setSchedules(careService.getSchedules(profile.id));
  }, [profile.id]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleDelete = () => {
    careService.deleteProfile(profile.id);
    onDelete();
  };

  const handleCompleteCare = (scheduleId: string) => {
    careService.completeCare(scheduleId);
    setSchedules(careService.getSchedules(profile.id));
    refresh();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-detail-title"
    >
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 ${config.color} rounded-xl flex items-center justify-center text-3xl`}>
                {config.emoji}
              </div>
              <div>
                <h3 id="profile-detail-title" className="text-lg font-bold text-slate-800">{profile.name}</h3>
                <p className="text-sm text-slate-500">
                  {getProfileSubtitle(profile)}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-6 space-y-4">
          {/* 테스트 결과 연동 배지 */}
          {profile.testResult && (
            <div className={`p-4 ${config.color} rounded-xl border border-slate-200`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{profile.testResult.resultEmoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700">케미 테스트 결과</p>
                  <p className="text-xs text-slate-500">
                    {new Date(profile.testResult.completedAt).toLocaleDateString('ko-KR')} 진단
                  </p>
                </div>
                <span className="px-2 py-1 bg-white/80 rounded-lg text-xs font-medium text-slate-600">
                  {profile.testResult.resultKey}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500">등록일</p>
              <p className="font-medium text-slate-800">
                {new Date(profile.createdAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500">타입</p>
              <p className="font-medium text-slate-800">
                {config.emoji} {config.name}
              </p>
            </div>
          </div>

          {/* Schedules */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">케어 스케줄</h4>
            <div className="space-y-2">
              {schedules.map(schedule => (
                <div
                  key={schedule.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                >
                  <span className="text-xl">{schedule.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">{schedule.name}</p>
                    <p className="text-xs text-slate-500">
                      다음: {new Date(schedule.nextDue).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCompleteCare(schedule.id)}
                    className={`w-8 h-8 ${config.accentColor} text-white rounded-full flex items-center justify-center hover:opacity-90`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {schedules.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">등록된 스케줄이 없습니다</p>
              )}
            </div>
          </div>

          {/* Delete */}
          <div className="pt-4 border-t border-slate-100">
            {showDeleteConfirm ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 border border-slate-200 rounded-xl text-slate-600"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 bg-red-500 text-white rounded-xl"
                >
                  삭제 확인
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-center gap-2 py-2 text-red-500 hover:bg-red-50 rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
                삭제
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
