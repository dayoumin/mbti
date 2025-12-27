'use client';

import { useState } from 'react';
import { Lightbulb, ThumbsUp, Bookmark, MessageCircle, ChevronRight } from 'lucide-react';
import type { CommunitySubTab } from './types';
import { SAMPLE_TIPS, SAMPLE_QUESTIONS, SAMPLE_DEBATES, formatRelativeTime, formatNumber } from '@/data/content/explore';
import type { Tip, Question, Debate } from '@/data/content/explore';
import { nextActionService, type NextAction } from '@/services/NextActionService';
import { NextActionInline } from '@/components/NextActionCard';

interface TipCardProps {
  tip: Tip;
  onNextAction?: (action: NextAction) => void;
}

function TipCard({ tip, onNextAction }: TipCardProps) {
  // 팁 카테고리 기반 다음 액션
  const nextActions = nextActionService.getRecommendations({
    endpoint: 'community_view',
    category: tip.category,
  }).filter(a => a.type === 'test').slice(0, 1);

  return (
    <div className="bg-slate-50 rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-lg flex-shrink-0">
          💡
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {tip.featured && (
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded">
                베스트
              </span>
            )}
            <span className="text-xs text-gray-400">{tip.author.name}</span>
            {tip.author.badge && (
              <span className="text-xs text-indigo-500">{tip.author.badge}</span>
            )}
          </div>
          <h3 className="font-bold text-sm text-slate-800 mb-2">{tip.title}</h3>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{tip.content}</p>
          <div className="flex items-center gap-3 mt-3">
            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-amber-500 transition-colors">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{formatNumber(tip.reactions.helpful)}</span>
            </button>
            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-500 transition-colors">
              <Bookmark className="w-3.5 h-3.5" />
              <span>{formatNumber(tip.reactions.saved)}</span>
            </button>
            <div className="flex gap-1 ml-auto">
              {tip.tags.slice(0, 2).map(tag => (
                <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* 관련 테스트 추천 */}
          {nextActions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <NextActionInline actions={nextActions} onActionClick={onNextAction} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface QnACardProps {
  question: Question;
  onNextAction?: (action: NextAction) => void;
}

function QnACard({ question, onNextAction }: QnACardProps) {
  // Q&A 카테고리 기반 다음 액션
  const nextActions = nextActionService.getRecommendations({
    endpoint: 'community_view',
    category: question.category,
  }).filter(a => a.type === 'test').slice(0, 1);

  return (
    <div className="bg-slate-50 rounded-2xl p-4 shadow-sm border border-subtle">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${question.status === 'answered'
          ? 'bg-gradient-to-br from-emerald-100 to-green-100'
          : 'bg-gradient-to-br from-blue-100 to-indigo-100'
          }`}>
          {question.status === 'answered' ? '✅' : '❓'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-1.5 py-0.5 text-xs font-bold rounded ${question.status === 'answered'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-blue-100 text-blue-700'
              }`}>
              {question.status === 'answered' ? '답변완료' : '답변대기'}
            </span>
            <span className="text-xs text-muted">{question.author.nickname}</span>
            {question.author.resultBadge && (
              <span className="text-xs text-indigo-500">{question.author.resultBadge}</span>
            )}
          </div>
          <h3 className="font-bold text-sm text-slate-800 mb-2">{question.title}</h3>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{question.content}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
            <span>답변 {question.answerCount}</span>
            <span>조회 {formatNumber(question.viewCount)}</span>
            <span>{formatRelativeTime(question.createdAt)}</span>
            <ChevronRight className="w-4 h-4 ml-auto text-gray-300" />
          </div>

          {/* 관련 테스트 추천 */}
          {nextActions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <NextActionInline actions={nextActions} onActionClick={onNextAction} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface DebateCardProps {
  debate: Debate;
  onNextAction?: (action: NextAction) => void;
}

function DebateCard({ debate, onNextAction }: DebateCardProps) {
  const [voted, setVoted] = useState<'a' | 'b' | null>(null);
  const totalVotes = debate.totalVotes + (voted ? 1 : 0);
  const aPercent = Math.round(((debate.optionA.votes + (voted === 'a' ? 1 : 0)) / totalVotes) * 100);
  const bPercent = 100 - aPercent;

  // 투표 후 다음 액션 추천
  const nextActions = voted
    ? nextActionService.getRecommendations({
      endpoint: 'community_view',
      category: debate.category,
    }).filter(a => a.type === 'test').slice(0, 1)
    : [];

  return (
    <div className="bg-slate-50 rounded-2xl p-4 shadow-sm border border-subtle">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">⚔️</span>
        <span className="font-bold text-sm text-primary">{debate.title}</span>
        {debate.status === 'active' && (
          <span className="px-1.5 py-0.5 bg-rose-100 text-rose-600 text-xs font-bold rounded ml-auto">
            진행중
          </span>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => !voted && setVoted('a')}
          disabled={!!voted}
          className={`flex-1 relative overflow-hidden rounded-xl border-2 transition-all ${voted === 'a' ? 'border-purple-400 bg-purple-50' :
            voted ? 'border-gray-200 bg-gray-50' :
              'border-purple-200 bg-slate-50 hover:border-purple-300'
            }`}
        >
          <div className="p-3 text-center relative z-10">
            <span className="text-2xl block mb-1">{debate.optionA.emoji}</span>
            <span className="text-xs font-bold text-slate-700 block">{debate.optionA.text}</span>
            {voted && (
              <div className="mt-2 text-lg font-black text-purple-600">{aPercent}%</div>
            )}
          </div>
          {voted && (
            <div
              className="absolute bottom-0 left-0 right-0 bg-purple-200/50 transition-all duration-500"
              style={{ height: `${aPercent}%` }}
            />
          )}
        </button>

        <div className="flex items-center">
          <span className="text-xs font-black text-slate-400">VS</span>
        </div>

        <button
          onClick={() => !voted && setVoted('b')}
          disabled={!!voted}
          className={`flex-1 relative overflow-hidden rounded-xl border-2 transition-all ${voted === 'b' ? 'border-pink-400 bg-pink-50' :
            voted ? 'border-gray-200 bg-gray-50' :
              'border-pink-200 bg-slate-50 hover:border-pink-300'
            }`}
        >
          <div className="p-3 text-center relative z-10">
            <span className="text-2xl block mb-1">{debate.optionB.emoji}</span>
            <span className="text-xs font-bold text-slate-700 block">{debate.optionB.text}</span>
            {voted && (
              <div className="mt-2 text-lg font-black text-pink-600">{bPercent}%</div>
            )}
          </div>
          {voted && (
            <div
              className="absolute bottom-0 left-0 right-0 bg-pink-200/50 transition-all duration-500"
              style={{ height: `${bPercent}%` }}
            />
          )}
        </button>
      </div>

      <div className="mt-3 text-center text-xs text-gray-400">
        {formatNumber(totalVotes)}명 참여
      </div>

      {/* 투표 후 관련 테스트 추천 */}
      {voted && nextActions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <NextActionInline actions={nextActions} onActionClick={onNextAction} />
        </div>
      )}
    </div>
  );
}

interface CommunityContentProps {
  onNextAction?: (action: NextAction) => void;
}

export default function CommunityContent({ onNextAction }: CommunityContentProps) {
  const [subTab, setSubTab] = useState<CommunitySubTab>('tips');

  return (
    <div>
      {/* 서브 탭 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSubTab('tips')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${subTab === 'tips'
            ? 'bg-amber-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          <Lightbulb className="w-3.5 h-3.5 inline mr-1" />
          팁 베스트
        </button>
        <button
          onClick={() => setSubTab('qna')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${subTab === 'qna'
            ? 'bg-emerald-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          <MessageCircle className="w-3.5 h-3.5 inline mr-1" />
          Q&A
        </button>
        <button
          onClick={() => setSubTab('debate')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${subTab === 'debate'
            ? 'bg-rose-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          ⚔️ 토론
        </button>
      </div>

      {/* 콘텐츠 */}
      <div className="space-y-3">
        {subTab === 'tips' && (
          <>
            {SAMPLE_TIPS.filter(t => t.featured).map(tip => (
              <TipCard key={tip.id} tip={tip} onNextAction={onNextAction} />
            ))}
            <div className="text-center py-4">
              <button className="text-xs text-indigo-500 font-medium hover:underline">
                더 많은 팁 보기 →
              </button>
            </div>
          </>
        )}
        {subTab === 'qna' && (
          <>
            {SAMPLE_QUESTIONS.map(question => (
              <QnACard key={question.id} question={question} onNextAction={onNextAction} />
            ))}
            <div className="text-center py-4">
              <button className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-colors">
                질문하기
              </button>
            </div>
          </>
        )}
        {subTab === 'debate' && (
          <>
            {SAMPLE_DEBATES.map(debate => (
              <DebateCard key={debate.id} debate={debate} onNextAction={onNextAction} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
