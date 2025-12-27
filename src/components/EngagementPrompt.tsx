'use client';

import { useEffect, useState } from 'react';
import { getParticipationBridge } from '@/services/ParticipationBridge';
import { getGamificationService } from '@/services/GamificationService';

interface EngagementPromptProps {
  className?: string;
}

export default function EngagementPrompt({ className = '' }: EngagementPromptProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [progressInfo, setProgressInfo] = useState<{
    current: number;
    target: number;
    label: string;
  } | null>(null);

  useEffect(() => {
    const bridge = getParticipationBridge();
    const gamification = getGamificationService();

    if (!bridge || !gamification) return;

    // 참여 유도 메시지
    const engagementMessage = bridge.getEngagementMessage();
    setMessage(engagementMessage);

    // 진행률 정보 계산
    const stats = gamification.getStats();
    const minorityRatio = gamification.getMinorityVoteRatio();
    const pollsByCategory = gamification.getPollsByCategory();

    // 우선순위에 따라 진행률 정보 설정
    if (stats.pollsVoted >= 5 && minorityRatio >= 40 && minorityRatio < 50) {
      setProgressInfo({
        current: minorityRatio,
        target: 50,
        label: '소신파',
      });
    } else {
      // 카테고리별 진행률 확인
      for (const [category, count] of Object.entries(pollsByCategory)) {
        if (count >= 5 && count < 10) {
          const categoryNames: Record<string, string> = {
            cat: '냥집사 투표왕',
            dog: '댕댕이 투표왕',
            love: '연애 고수',
          };
          if (categoryNames[category]) {
            setProgressInfo({
              current: count,
              target: 10,
              label: categoryNames[category],
            });
            break;
          }
        }
      }

      // 투표 중독자 진행률 (위에서 설정 안 됐을 때만)
      if (stats.pollsVoted >= 30 && stats.pollsVoted < 50) {
        setProgressInfo(prev => prev || {
          current: stats.pollsVoted,
          target: 50,
          label: '투표 중독자',
        });
      }
    }
  }, []);

  if (!message && !progressInfo) return null;

  return (
    <div className={`bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 ${className}`}>
      {/* 메시지 */}
      {message && (
        <p className="text-sm font-medium text-primary mb-3">
          {message}
        </p>
      )}

      {/* 진행률 바 */}
      {progressInfo && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-secondary">{progressInfo.label}</span>
            <span className="text-indigo-600 font-medium">
              {progressInfo.current}/{progressInfo.target}
            </span>
          </div>
          <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{
                width: `${(progressInfo.current / progressInfo.target) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
