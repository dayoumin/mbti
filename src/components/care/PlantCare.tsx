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
  Flower2,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { plantCareService } from '@/services/PlantCareService';
import type { PlantProfile, CareSchedule, CareLog } from '@/data/care/types';
import { PLANT_CARE_TYPES, PlantCareType } from '@/data/care/types';

// ============================================================================
// Main Component
// ============================================================================

export default function PlantCare() {
  const [activeView, setActiveView] = useState<'today' | 'plants' | 'history'>('today');
  const [profiles, setProfiles] = useState<PlantProfile[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  useEffect(() => {
    setProfiles(plantCareService.getProfiles());
  }, [refreshKey]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Flower2 className="w-6 h-6 text-green-500" />
            내 식물 케어
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {profiles.length}개의 식물을 돌보고 있어요
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          식물 추가
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
        {[
          { key: 'today', label: '오늘 할 일', icon: <Clock className="w-4 h-4" /> },
          { key: 'plants', label: '내 식물', icon: <Flower2 className="w-4 h-4" /> },
          { key: 'history', label: '기록', icon: <BarChart3 className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveView(tab.key as typeof activeView)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView === tab.key
                ? 'bg-slate-50 text-primary shadow-sm'
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
      {activeView === 'plants' && (
        <PlantListView
          profiles={profiles}
          onAddClick={() => setShowAddModal(true)}
          refresh={refresh}
        />
      )}
      {activeView === 'history' && <HistoryView refreshKey={refreshKey} />}

      {/* Add Plant Modal */}
      {showAddModal && (
        <AddPlantModal
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
  const [dueTasks, setDueTasks] = useState<ReturnType<typeof plantCareService.getDueTasks>>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<ReturnType<typeof plantCareService.getUpcomingTasks>>([]);

  useEffect(() => {
    setDueTasks(plantCareService.getDueTasks());
    setUpcomingTasks(plantCareService.getUpcomingTasks(7));
  }, [refreshKey]);

  const handleComplete = (scheduleId: string) => {
    plantCareService.completeCare(scheduleId);
    setDueTasks(plantCareService.getDueTasks());
    setUpcomingTasks(plantCareService.getUpcomingTasks(7));
    refresh();
  };

  if (dueTasks.length === 0 && upcomingTasks.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-2xl">
        <div className="text-4xl mb-3">🌿</div>
        <p className="text-slate-600 font-medium">오늘 할 일이 없어요!</p>
        <p className="text-sm text-slate-400 mt-1">식물을 추가하면 케어 알림이 표시됩니다</p>
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
  task: ReturnType<typeof plantCareService.getDueTasks>[0];
  onComplete: (id: string) => void;
  urgent?: boolean;
}

function TaskCard({ task, onComplete, urgent }: TaskCardProps) {
  const daysText = task.daysUntil === 0
    ? '오늘'
    : task.daysUntil < 0
      ? `${Math.abs(task.daysUntil)}일 지남`
      : `${task.daysUntil}일 후`;

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${urgent
          ? 'bg-red-50 border border-red-200'
          : 'bg-slate-50 border border-slate-200'
        }`}
    >
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">
        {task.emoji}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-slate-800">{task.profile.name}</p>
        <p className="text-sm text-slate-500">
          {task.name} • <span className={urgent ? 'text-red-500 font-medium' : ''}>{daysText}</span>
        </p>
      </div>
      <button
        onClick={() => onComplete(task.id)}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${urgent
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-green-500 text-white hover:bg-green-600'
          }`}
      >
        <Check className="w-5 h-5" />
      </button>
    </div>
  );
}

// ============================================================================
// Plant List View
// ============================================================================

interface PlantListViewProps {
  profiles: PlantProfile[];
  onAddClick: () => void;
  refresh: () => void;
}

function PlantListView({ profiles, onAddClick, refresh }: PlantListViewProps) {
  const [selectedPlant, setSelectedPlant] = useState<PlantProfile | null>(null);

  if (profiles.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-2xl">
        <div className="text-4xl mb-3">🪴</div>
        <p className="text-slate-600 font-medium">아직 등록된 식물이 없어요</p>
        <button
          onClick={onAddClick}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
        >
          첫 식물 추가하기
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-3">
        {profiles.map(plant => (
          <button
            key={plant.id}
            onClick={() => setSelectedPlant(plant)}
            className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-green-300 transition-all text-left"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
              🌱
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800">{plant.name}</p>
              <p className="text-sm text-slate-500">
                {plant.species || '종류 미지정'} • {plant.location || '위치 미지정'}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        ))}
      </div>

      {selectedPlant && (
        <PlantDetailModal
          plant={selectedPlant}
          onClose={() => setSelectedPlant(null)}
          onDelete={() => {
            refresh();
            setSelectedPlant(null);
          }}
          refresh={refresh}
        />
      )}
    </>
  );
}

// ============================================================================
// History View
// ============================================================================

function HistoryView({ refreshKey }: { refreshKey: number }) {
  const [logs, setLogs] = useState<CareLog[]>([]);
  const [profiles, setProfiles] = useState<PlantProfile[]>([]);

  useEffect(() => {
    const allLogs = plantCareService.getLogs();
    const sortedLogs = [...allLogs].sort((a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
    setLogs(sortedLogs);
    setProfiles(plantCareService.getProfiles());
  }, [refreshKey]);

  const getProfileName = (id: string) => profiles.find(p => p.id === id)?.name || '삭제된 식물';
  const getCareInfo = (type: string) => PLANT_CARE_TYPES[type as PlantCareType] || { name: type, emoji: '🌿' };

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
      {logs.slice(0, 20).map(log => {
        const care = getCareInfo(log.type);
        const date = new Date(log.completedAt);
        return (
          <div
            key={log.id}
            className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
          >
            <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
              {care.emoji}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-700">
                {getProfileName(log.profileId)} - {care.name}
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
// Add Plant Modal
// ============================================================================

interface AddPlantModalProps {
  onClose: () => void;
  onAdd: () => void;
}

function AddPlantModal({ onClose, onAdd }: AddPlantModalProps) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [location, setLocation] = useState('');

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    plantCareService.addProfile({
      name: name.trim(),
      species: species.trim() || undefined,
      location: location.trim() || undefined,
    });
    onAdd();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-plant-title"
    >
      <div className="bg-slate-50 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 id="add-plant-title" className="text-lg font-bold text-slate-800">새 식물 추가</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              이름 *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="예: 몬스테라, 녹이"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              종류 (선택)
            </label>
            <input
              type="text"
              value={species}
              onChange={e => setSpecies(e.target.value)}
              placeholder="예: 몬스테라 델리시오사"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              위치 (선택)
            </label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="예: 거실 창가"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              추가하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// Plant Detail Modal
// ============================================================================

interface PlantDetailModalProps {
  plant: PlantProfile;
  onClose: () => void;
  onDelete: () => void;
  refresh: () => void;
}

function PlantDetailModal({ plant, onClose, onDelete, refresh }: PlantDetailModalProps) {
  const [schedules, setSchedules] = useState<CareSchedule[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setSchedules(plantCareService.getSchedules(plant.id));
  }, [plant.id]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleDelete = () => {
    plantCareService.deleteProfile(plant.id);
    onDelete();
  };

  const handleCompleteCare = (scheduleId: string) => {
    plantCareService.completeCare(scheduleId);
    setSchedules(plantCareService.getSchedules(plant.id));
    refresh();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="plant-detail-title"
    >
      <div className="bg-slate-50 rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-3xl">
                🌱
              </div>
              <div>
                <h3 id="plant-detail-title" className="text-lg font-bold text-slate-800">{plant.name}</h3>
                <p className="text-sm text-slate-500">
                  {plant.species || '종류 미지정'}
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
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500">위치</p>
              <p className="font-medium text-slate-800">{plant.location || '-'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500">등록일</p>
              <p className="font-medium text-slate-800">
                {new Date(plant.createdAt).toLocaleDateString('ko-KR')}
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
                    className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ))}
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
                식물 삭제
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
