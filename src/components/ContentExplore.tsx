'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, HelpCircle, Vote, CheckCircle, MessageCircle, Lightbulb, ThumbsUp, Bookmark, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { ALL_KNOWLEDGE_QUIZZES } from '@/data/content/quizzes';
import { VS_POLLS } from '@/data/content/polls/vs-polls';
import type { KnowledgeQuiz, VSPoll, ContentCategory } from '@/data/content/types';
import { CATEGORY_LABELS } from '@/data/content/categories';
import { contentParticipationService } from '@/services/ContentParticipationService';
import { getParticipationBridge } from '@/services/ParticipationBridge';
import { SAMPLE_TIPS, SAMPLE_QUESTIONS, SAMPLE_DEBATES, formatRelativeTime, formatNumber } from '@/data/community';
import type { Tip, Question, Debate } from '@/data/community';
import { nextActionService, type NextAction } from '@/services/NextActionService';
import { NextActionInline } from '@/components/NextActionCard';
import CommentSystem from '@/components/CommentSystem';

// ============================================================================
// 타입 정의
// ============================================================================

interface ContentExploreProps {
  onClose: () => void;
  initialTab?: 'quiz' | 'poll' | 'community';
  onStartTest?: (testKey: string) => void;
}

type TabType = 'quiz' | 'poll' | 'community';
type CommunitySubTab = 'tips' | 'qna' | 'debate';

// CATEGORY_LABELS는 @/data/content/categories에서 import

// ============================================================================
// 퀴즈 카드 컴포넌트
// ============================================================================

interface QuizCardProps {
  quiz: KnowledgeQuiz;
  isAnswered: boolean;
  previousAnswer?: string;
  onAnswer: (quizId: string, optionId: string, isCorrect: boolean) => void;
  onNextAction?: (action: NextAction) => void;
}

function QuizCard({ quiz, isAnswered, previousAnswer, onAnswer, onNextAction }: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(previousAnswer || null);
  const [showResult, setShowResult] = useState(isAnswered);
  const [showComments, setShowComments] = useState(false);

  // 다음 액션 추천
  const nextActions = showResult
    ? nextActionService.getRecommendations({
        endpoint: 'quiz_result',
        category: quiz.category,
      }).slice(0, 2)
    : [];

  const handleSelect = (optionId: string) => {
    if (showResult) return;
    setSelectedOption(optionId);
    setShowResult(true);
    const isCorrect = quiz.options.find(o => o.id === optionId)?.isCorrect || false;
    onAnswer(quiz.id, optionId, isCorrect);
  };

  const selectedIsCorrect = quiz.options.find(o => o.id === selectedOption)?.isCorrect;
  const categoryInfo = CATEGORY_LABELS[quiz.category];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <HelpCircle className="w-4 h-4 text-blue-500" />
        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
          {categoryInfo.emoji} {categoryInfo.label}
        </span>
        {isAnswered && (
          <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full ml-auto flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> 참여완료
          </span>
        )}
      </div>

      <p className="text-sm font-bold text-slate-700 mb-3">{quiz.question}</p>

      <div className="space-y-2">
        {quiz.options.map((option) => {
          const isSelected = selectedOption === option.id;
          const isCorrect = option.isCorrect;
          let bgClass = 'bg-gray-50 hover:bg-blue-50 border-gray-200';

          if (showResult) {
            if (isCorrect) {
              bgClass = 'bg-emerald-50 border-emerald-300 text-emerald-700';
            } else if (isSelected && !isCorrect) {
              bgClass = 'bg-red-50 border-red-300 text-red-700';
            } else {
              bgClass = 'bg-gray-50 border-gray-200 text-gray-400';
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={showResult}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm border transition-all ${bgClass}`}
            >
              {option.text}
              {showResult && isCorrect && <span className="ml-2">✓</span>}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className={`mt-3 p-3 rounded-xl text-xs ${selectedIsCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {selectedIsCorrect ? '🎉 정답!' : '💡 오답!'} {quiz.explanation}
        </div>
      )}

      {/* 다음 액션 추천 */}
      {showResult && nextActions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <NextActionInline actions={nextActions} onActionClick={onNextAction} />
        </div>
      )}

      {/* 댓글 토글 버튼 */}
      {showResult && (
        <button
          onClick={() => setShowComments(!showComments)}
          className="w-full mt-3 py-2 flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-slate-700 border-t border-gray-100 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>댓글</span>
          {showComments ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      )}

      {/* 댓글 섹션 */}
      {showResult && showComments && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <CommentSystem
            targetType="quiz"
            targetId={quiz.id}
            placeholder="이 퀴즈에 대한 의견을 남겨보세요..."
            maxDisplay={3}
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 투표 카드 컴포넌트
// ============================================================================

interface PollCardProps {
  poll: VSPoll;
  isVoted: boolean;
  previousVote?: 'a' | 'b';
  onVote: (pollId: string, choice: 'a' | 'b') => void;
  onNextAction?: (action: NextAction) => void;
}

function getStablePollResults(pollId: string) {
  const seedStr = String(pollId || '');
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = ((hash << 5) - hash + seedStr.charCodeAt(i)) | 0;
  }
  const base = Math.abs(hash) % 41; // 0..40
  const a = 30 + base; // 30..70
  return { a, b: 100 - a };
}

function PollCard({ poll, isVoted, previousVote, onVote, onNextAction }: PollCardProps) {
  const [localVoted, setLocalVoted] = useState<'a' | 'b' | null>(null);
  const [showComments, setShowComments] = useState(false);
  const voted = previousVote ?? localVoted;
  const results = getStablePollResults(poll.id);

  // 다음 액션 추천
  const nextActions = voted
    ? nextActionService.getRecommendations({
        endpoint: 'poll_result',
        category: poll.category,
      }).slice(0, 2)
    : [];

  const handleVote = (choice: 'a' | 'b') => {
    if (voted) return;
    setLocalVoted(choice);
    onVote(poll.id, choice);
  };

  const categoryInfo = CATEGORY_LABELS[poll.category];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <Vote className="w-4 h-4 text-purple-500" />
        <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
          {categoryInfo.emoji} {categoryInfo.label}
        </span>
        {(isVoted || voted) && (
          <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full ml-auto flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> 투표완료
          </span>
        )}
      </div>

      <p className="text-sm font-bold text-slate-700 mb-4 text-center">{poll.question}</p>

      <div className="flex gap-3">
        {/* Option A */}
        <button
          onClick={() => handleVote('a')}
          disabled={!!voted}
          className={`flex-1 relative overflow-hidden rounded-xl border-2 transition-all ${
            voted === 'a' ? 'border-purple-400 bg-purple-50' :
            voted ? 'border-gray-200 bg-gray-50' :
            'border-purple-200 bg-white hover:border-purple-300 hover:bg-purple-50'
          }`}
        >
          <div className="p-3 text-center relative z-10">
            <span className="text-2xl block mb-1">{poll.optionA.emoji}</span>
            <span className="text-xs font-bold text-slate-700">{poll.optionA.text}</span>
            {voted && (
              <div className="mt-2 text-lg font-black text-purple-600">{results.a}%</div>
            )}
          </div>
          {voted && (
            <div
              className="absolute bottom-0 left-0 right-0 bg-purple-200/50 transition-all duration-500"
              style={{ height: `${results.a}%` }}
            />
          )}
        </button>

        {/* VS */}
        <div className="flex items-center">
          <span className="text-xs font-black text-slate-400">VS</span>
        </div>

        {/* Option B */}
        <button
          onClick={() => handleVote('b')}
          disabled={!!voted}
          className={`flex-1 relative overflow-hidden rounded-xl border-2 transition-all ${
            voted === 'b' ? 'border-pink-400 bg-pink-50' :
            voted ? 'border-gray-200 bg-gray-50' :
            'border-pink-200 bg-white hover:border-pink-300 hover:bg-pink-50'
          }`}
        >
          <div className="p-3 text-center relative z-10">
            <span className="text-2xl block mb-1">{poll.optionB.emoji}</span>
            <span className="text-xs font-bold text-slate-700">{poll.optionB.text}</span>
            {voted && (
              <div className="mt-2 text-lg font-black text-pink-600">{results.b}%</div>
            )}
          </div>
          {voted && (
            <div
              className="absolute bottom-0 left-0 right-0 bg-pink-200/50 transition-all duration-500"
              style={{ height: `${results.b}%` }}
            />
          )}
        </button>
      </div>

      {/* 다음 액션 추천 */}
      {voted && nextActions.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <NextActionInline actions={nextActions} onActionClick={onNextAction} />
        </div>
      )}

      {/* 댓글 토글 버튼 */}
      {voted && (
        <button
          onClick={() => setShowComments(!showComments)}
          className="w-full mt-3 py-2 flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-slate-700 border-t border-gray-100 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>댓글</span>
          {showComments ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      )}

      {/* 댓글 섹션 */}
      {voted && showComments && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <CommentSystem
            targetType="poll"
            targetId={poll.id}
            placeholder="이 투표에 대한 의견을 남겨보세요..."
            maxDisplay={3}
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 커뮤니티 - 팁 카드 컴포넌트
// ============================================================================

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
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-lg flex-shrink-0">
          💡
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {tip.featured && (
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded">
                베스트
              </span>
            )}
            <span className="text-[10px] text-gray-400">{tip.author.name}</span>
            {tip.author.badge && (
              <span className="text-[10px] text-indigo-500">{tip.author.badge}</span>
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
                <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded">
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

// ============================================================================
// 커뮤니티 - Q&A 카드 컴포넌트
// ============================================================================

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
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
          question.status === 'answered'
            ? 'bg-gradient-to-br from-emerald-100 to-green-100'
            : 'bg-gradient-to-br from-blue-100 to-indigo-100'
        }`}>
          {question.status === 'answered' ? '✅' : '❓'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
              question.status === 'answered'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {question.status === 'answered' ? '답변완료' : '답변대기'}
            </span>
            <span className="text-[10px] text-gray-400">{question.author.nickname}</span>
            {question.author.resultBadge && (
              <span className="text-[10px] text-indigo-500">{question.author.resultBadge}</span>
            )}
          </div>
          <h3 className="font-bold text-sm text-slate-800 mb-2">{question.title}</h3>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{question.content}</p>
          <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-400">
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

// ============================================================================
// 커뮤니티 - 토론/밸런스 카드 컴포넌트
// ============================================================================

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
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">⚔️</span>
        <span className="font-bold text-sm text-slate-800">{debate.title}</span>
        {debate.status === 'active' && (
          <span className="px-1.5 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-bold rounded ml-auto">
            진행중
          </span>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => !voted && setVoted('a')}
          disabled={!!voted}
          className={`flex-1 relative overflow-hidden rounded-xl border-2 transition-all ${
            voted === 'a' ? 'border-purple-400 bg-purple-50' :
            voted ? 'border-gray-200 bg-gray-50' :
            'border-purple-200 bg-white hover:border-purple-300'
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
          className={`flex-1 relative overflow-hidden rounded-xl border-2 transition-all ${
            voted === 'b' ? 'border-pink-400 bg-pink-50' :
            voted ? 'border-gray-200 bg-gray-50' :
            'border-pink-200 bg-white hover:border-pink-300'
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

      <div className="mt-3 text-center text-[10px] text-gray-400">
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

// ============================================================================
// 커뮤니티 탭 콘텐츠
// ============================================================================

interface CommunityContentProps {
  onNextAction?: (action: NextAction) => void;
}

function CommunityContent({ onNextAction }: CommunityContentProps) {
  const [subTab, setSubTab] = useState<CommunitySubTab>('tips');

  return (
    <div>
      {/* 서브 탭 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSubTab('tips')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'tips'
              ? 'bg-amber-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 inline mr-1" />
          팁 베스트
        </button>
        <button
          onClick={() => setSubTab('qna')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'qna'
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5 inline mr-1" />
          Q&A
        </button>
        <button
          onClick={() => setSubTab('debate')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'debate'
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

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function ContentExplore({ onClose, initialTab = 'quiz', onStartTest }: ContentExploreProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | 'all'>('all');
  const [participation, setParticipation] = useState(contentParticipationService.getParticipation());

  useEffect(() => {
    const handleUpdated = () => {
      setParticipation(contentParticipationService.getParticipation());
    };

    window.addEventListener('chemi_content_participation_updated', handleUpdated);
    return () => window.removeEventListener('chemi_content_participation_updated', handleUpdated);
  }, []);

  // 카테고리별 필터링
  const filteredQuizzes = selectedCategory === 'all'
    ? ALL_KNOWLEDGE_QUIZZES
    : ALL_KNOWLEDGE_QUIZZES.filter(q => q.category === selectedCategory);

  const filteredPolls = selectedCategory === 'all'
    ? VS_POLLS
    : VS_POLLS.filter(p => p.category === selectedCategory);

  // 퀴즈 정답 처리
  // ContentParticipationService: UI 상태 (참여 여부 표시용)
  // ParticipationBridge: 게이미피케이션 연동 (배지/포인트)
  // 둘은 역할이 다르므로 각각 호출 (FeedbackService 중복 저장은 Bridge에서 처리)
  const handleQuizAnswer = async (quizId: string, optionId: string, isCorrect: boolean) => {
    // UI 상태 업데이트 (로컬 참여 기록)
    contentParticipationService.recordQuizAnswer(quizId, optionId, isCorrect);
    setParticipation(contentParticipationService.getParticipation());

    // 게이미피케이션 연동 (배지/포인트만 처리, DB 저장은 별도)
    const quiz = ALL_KNOWLEDGE_QUIZZES.find(q => q.id === quizId);
    const bridge = getParticipationBridge();
    if (bridge && quiz) {
      await bridge.recordQuizAnswer(quizId, 0, optionId, isCorrect, quiz.category);
    }
  };

  // 투표 처리
  const handlePollVote = async (pollId: string, choice: 'a' | 'b') => {
    // UI 상태 업데이트 (로컬 참여 기록)
    contentParticipationService.recordPollVote(pollId, choice);
    setParticipation(contentParticipationService.getParticipation());

    // 게이미피케이션 연동
    const poll = VS_POLLS.find(p => p.id === pollId);
    const bridge = getParticipationBridge();
    if (bridge && poll) {
      // 소수 의견 판단용 통계 (getStablePollResults는 ID 기반 결정론적 값)
      const results = getStablePollResults(pollId);
      const pollStats = {
        totalVotes: 100,
        optionVotes: {
          'a': results.a,
          'b': results.b,
        },
      };
      await bridge.recordPollVote(pollId, choice, pollStats, poll.category);
    }
  };

  // 다음 액션 처리
  const handleNextAction = (action: NextAction) => {
    // 액션 타입에 따라 탭 전환 또는 화면 이동
    switch (action.type) {
      case 'quiz':
        setActiveTab('quiz');
        if (action.targetCategory) {
          setSelectedCategory(action.targetCategory as ContentCategory);
        }
        break;
      case 'poll':
        setActiveTab('poll');
        if (action.targetCategory) {
          setSelectedCategory(action.targetCategory as ContentCategory);
        }
        break;
      case 'community':
        setActiveTab('community');
        break;
      case 'test':
        // 테스트로 이동 - ContentExplore 닫고 특정 테스트 시작
        onClose();
        if (action.targetId && onStartTest) {
          onStartTest(action.targetId);
        }
        break;
      case 'share':
        // 공유 기능 (추후 구현)
        break;
      default:
        break;
    }
  };

  // 통계
  const stats = {
    quizTotal: ALL_KNOWLEDGE_QUIZZES.length,
    quizAnswered: participation.quizzes.length,
    quizCorrect: participation.quizzes.filter(q => q.isCorrect).length,
    pollTotal: VS_POLLS.length,
    pollVoted: participation.polls.length,
  };

  // 현재 필터에 있는 카테고리들
  const availableCategories = activeTab === 'quiz'
    ? [...new Set(ALL_KNOWLEDGE_QUIZZES.map(q => q.category))]
    : [...new Set(VS_POLLS.map(p => p.category))];

  // 헤더 타이틀 & 서브타이틀
  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'quiz':
        return {
          title: '퀴즈 & 투표',
          subtitle: `${stats.quizAnswered}/${stats.quizTotal} 참여 · 정답률 ${stats.quizAnswered > 0 ? Math.round((stats.quizCorrect / stats.quizAnswered) * 100) : 0}%`,
        };
      case 'poll':
        return {
          title: '퀴즈 & 투표',
          subtitle: `${stats.pollVoted}/${stats.pollTotal} 투표 완료`,
        };
      case 'community':
        return {
          title: '커뮤니티',
          subtitle: '팁, Q&A, 토론에 참여하세요!',
        };
      default:
        return { title: '콘텐츠', subtitle: '' };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-100 to-slate-200 z-50 overflow-hidden">
      {/* 헤더 */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="font-bold text-slate-800">{headerInfo.title}</h1>
              <p className="text-[10px] text-slate-500">{headerInfo.subtitle}</p>
            </div>
          </div>

          {/* 메인 탭 */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'quiz'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 inline mr-1" />
              퀴즈
            </button>
            <button
              onClick={() => setActiveTab('poll')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'poll'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Vote className="w-3.5 h-3.5 inline mr-1" />
              투표
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'community'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 inline mr-1" />
              커뮤니티
            </button>
          </div>

          {/* 카테고리 필터 (퀴즈/투표에서만 표시) */}
          {activeTab !== 'community' && (
            <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-slate-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {CATEGORY_LABELS[cat].emoji} {CATEGORY_LABELS[cat].label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="overflow-y-auto h-[calc(100vh-180px)] pb-20">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
          {activeTab === 'quiz' && (
            filteredQuizzes.length > 0 ? (
              filteredQuizzes.map((quiz) => {
                const answered = participation.quizzes.find(q => q.quizId === quiz.id);
                return (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    isAnswered={!!answered}
                    previousAnswer={answered?.selectedOption}
                    onAnswer={handleQuizAnswer}
                    onNextAction={handleNextAction}
                  />
                );
              })
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>이 카테고리에 퀴즈가 없습니다</p>
              </div>
            )
          )}
          {activeTab === 'poll' && (
            filteredPolls.length > 0 ? (
              filteredPolls.map((poll) => {
                const voted = participation.polls.find(p => p.pollId === poll.id);
                return (
                  <PollCard
                    key={poll.id}
                    poll={poll}
                    isVoted={!!voted}
                    previousVote={voted?.choice}
                    onVote={handlePollVote}
                    onNextAction={handleNextAction}
                  />
                );
              })
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>이 카테고리에 투표가 없습니다</p>
              </div>
            )
          )}
          {activeTab === 'community' && (
            <CommunityContent onNextAction={handleNextAction} />
          )}
        </div>
      </div>
    </div>
  );
}
