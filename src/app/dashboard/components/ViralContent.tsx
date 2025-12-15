'use client';

import { useState, useMemo } from 'react';
import {
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  CalendarRange,
  Tag,
  TrendingUp,
  Copy,
  Check,
  Share2,
  Lightbulb,
  AlertCircle,
  Sun,
  Snowflake,
  Flower2,
  Leaf,
  Filter,
} from 'lucide-react';
import {
  ALL_VOTE_TOPICS,
  VoteTopic,
  getTodayVoteTopic,
  getWeeklyVoteTopic,
  getTopViralTopics,
  getCurrentSeason,
  getSeasonalVoteTopics,
} from '@/data/viralContent';
import { petMatchData } from '@/data/subjects/petMatch';
import { plantData } from '@/data/subjects/plant';
import { FunFacts } from '@/data/types';

// ============================================================================
// 타입 정의
// ============================================================================

type ViewMode = 'vote' | 'funfacts';
type FunFactsCategory = 'pet' | 'plant';
type VoteFilter = 'all' | 'pet' | 'plant' | 'lifestyle' | 'fun';

// ============================================================================
// 헬퍼 함수
// ============================================================================

const seasonIcons: Record<string, React.ReactNode> = {
  spring: <Flower2 className="w-4 h-4 text-pink-400" />,
  summer: <Sun className="w-4 h-4 text-amber-400" />,
  fall: <Leaf className="w-4 h-4 text-orange-400" />,
  winter: <Snowflake className="w-4 h-4 text-blue-400" />,
};

const categoryColors: Record<string, string> = {
  pet: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  plant: 'bg-green-500/20 text-green-400 border-green-500/30',
  lifestyle: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  fun: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
};

const categoryLabels: Record<string, string> = {
  pet: '반려동물',
  plant: '반려식물',
  lifestyle: '라이프스타일',
  fun: '재미',
};

// ============================================================================
// 컴포넌트
// ============================================================================

export default function ViralContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('vote');
  const [voteFilter, setVoteFilter] = useState<VoteFilter>('all');
  const [funFactsCategory, setFunFactsCategory] = useState<FunFactsCategory>('pet');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 현재 시즌
  const currentSeason = getCurrentSeason();

  // 오늘/이번주 투표
  const todayVote = useMemo(() => getTodayVoteTopic(), []);
  const weeklyVote = useMemo(() => getWeeklyVoteTopic(), []);
  const topViralTopics = useMemo(() => getTopViralTopics(5), []);

  // 필터링된 투표 토픽
  const filteredTopics = useMemo(() => {
    const seasonalTopics = getSeasonalVoteTopics();
    if (voteFilter === 'all') return seasonalTopics;
    return seasonalTopics.filter(t => t.category === voteFilter);
  }, [voteFilter]);

  // FunFacts 데이터
  const funFactsData = useMemo(() => {
    if (funFactsCategory === 'pet') {
      return petMatchData.resultLabels.map(r => ({
        name: r.name,
        emoji: r.emoji,
        funFacts: r.meta?.funFacts,
      })).filter(r => r.funFacts);
    } else {
      return plantData.resultLabels.map(r => ({
        name: r.name,
        emoji: r.emoji,
        funFacts: r.meta?.funFacts,
      })).filter(r => r.funFacts);
    }
  }, [funFactsCategory]);

  // 복사 핸들러
  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            바이럴 콘텐츠
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            SNS 공유용 콘텐츠 미리보기 및 관리
          </p>
        </div>
        <div className="flex items-center gap-2">
          {seasonIcons[currentSeason]}
          <span className="text-sm text-gray-400">
            현재 시즌: {currentSeason === 'spring' ? '봄' : currentSeason === 'summer' ? '여름' : currentSeason === 'fall' ? '가을' : '겨울'}
          </span>
        </div>
      </div>

      {/* 뷰 모드 전환 */}
      <div className="flex gap-2 p-1 bg-gray-800 rounded-xl">
        <button
          onClick={() => setViewMode('vote')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            viewMode === 'vote'
              ? 'bg-purple-500 text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          투표 토픽 ({ALL_VOTE_TOPICS.length})
        </button>
        <button
          onClick={() => setViewMode('funfacts')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            viewMode === 'funfacts'
              ? 'bg-amber-500 text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          FunFacts
        </button>
      </div>

      {/* 투표 토픽 뷰 */}
      {viewMode === 'vote' && (
        <>
          {/* 오늘/이번주 투표 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 오늘의 투표 */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-purple-400">오늘의 투표</h3>
              </div>
              <VoteTopicCard topic={todayVote} onCopy={handleCopy} copiedId={copiedId} />
            </div>

            {/* 이번주 투표 */}
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/30">
              <div className="flex items-center gap-2 mb-3">
                <CalendarRange className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-blue-400">이번주 투표</h3>
              </div>
              <VoteTopicCard topic={weeklyVote} onCopy={handleCopy} copiedId={copiedId} />
            </div>
          </div>

          {/* TOP 5 바이럴 토픽 */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-gray-300">TOP 5 바이럴 토픽</h3>
            </div>
            <div className="space-y-2">
              {topViralTopics.map((topic, index) => (
                <div
                  key={topic.id}
                  className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-amber-500 text-white' :
                    index === 1 ? 'bg-gray-500 text-white' :
                    index === 2 ? 'bg-orange-500 text-white' :
                    'bg-gray-600 text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-200 text-sm truncate">{topic.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${categoryColors[topic.category]}`}>
                        {categoryLabels[topic.category]}
                      </span>
                      <span className="text-xs text-gray-500">
                        점수: {topic.viralScore}/5
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 필터 */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <div className="flex gap-2">
              {(['all', 'pet', 'plant', 'lifestyle', 'fun'] as VoteFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setVoteFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    voteFilter === filter
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {filter === 'all' ? '전체' : categoryLabels[filter]} ({
                    filter === 'all'
                      ? getSeasonalVoteTopics().length
                      : getSeasonalVoteTopics().filter(t => t.category === filter).length
                  })
                </button>
              ))}
            </div>
          </div>

          {/* 모든 투표 토픽 목록 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTopics.map((topic) => (
              <VoteTopicCard
                key={topic.id}
                topic={topic}
                onCopy={handleCopy}
                copiedId={copiedId}
                compact
              />
            ))}
          </div>
        </>
      )}

      {/* FunFacts 뷰 */}
      {viewMode === 'funfacts' && (
        <>
          {/* 카테고리 선택 */}
          <div className="flex gap-2">
            <button
              onClick={() => setFunFactsCategory('pet')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                funFactsCategory === 'pet'
                  ? 'bg-amber-500/20 text-amber-400 border-2 border-amber-500/50'
                  : 'bg-gray-800 text-gray-400 border-2 border-transparent hover:border-gray-700'
              }`}
            >
              🐾 반려동물 ({petMatchData.resultLabels.filter(r => r.meta?.funFacts).length})
            </button>
            <button
              onClick={() => setFunFactsCategory('plant')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                funFactsCategory === 'plant'
                  ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50'
                  : 'bg-gray-800 text-gray-400 border-2 border-transparent hover:border-gray-700'
              }`}
            >
              🌱 반려식물 ({plantData.resultLabels.filter(r => r.meta?.funFacts).length})
            </button>
          </div>

          {/* FunFacts 카드들 */}
          <div className="space-y-4">
            {funFactsData.map((item) => (
              <FunFactsCard
                key={item.name}
                name={item.name}
                emoji={item.emoji}
                funFacts={item.funFacts!}
                onCopy={handleCopy}
                copiedId={copiedId}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// 서브 컴포넌트: 투표 토픽 카드
// ============================================================================

interface VoteTopicCardProps {
  topic: VoteTopic;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
  compact?: boolean;
}

function VoteTopicCard({ topic, onCopy, copiedId, compact }: VoteTopicCardProps) {
  const shareText = `${topic.title}\n\nA: ${topic.optionA}\nB: ${topic.optionB}\n\n#${topic.tags.join(' #')}`;

  return (
    <div className={`bg-gray-800/50 rounded-xl border border-gray-700 ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className={`font-bold text-gray-200 ${compact ? 'text-sm' : ''}`}>{topic.title}</h4>
        {topic.season && (
          <span className="shrink-0">{seasonIcons[topic.season]}</span>
        )}
      </div>

      <div className={`space-y-1.5 ${compact ? 'mb-2' : 'mb-3'}`}>
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-4 h-4 text-blue-400" />
          <span className={`text-gray-300 ${compact ? 'text-xs' : 'text-sm'}`}>{topic.optionA}</span>
        </div>
        <div className="flex items-center gap-2">
          <ThumbsDown className="w-4 h-4 text-rose-400" />
          <span className={`text-gray-300 ${compact ? 'text-xs' : 'text-sm'}`}>{topic.optionB}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 flex-wrap">
          <span className={`px-2 py-0.5 rounded-full text-xs border ${categoryColors[topic.category]}`}>
            {categoryLabels[topic.category]}
          </span>
          {topic.viralScore && topic.viralScore >= 4 && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30">
              🔥 인기
            </span>
          )}
        </div>
        <button
          onClick={() => onCopy(shareText, topic.id)}
          className={`p-1.5 rounded-lg transition-all ${
            copiedId === topic.id
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
          }`}
        >
          {copiedId === topic.id ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>

      {!compact && (
        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-700">
          {topic.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 서브 컴포넌트: FunFacts 카드
// ============================================================================

interface FunFactsCardProps {
  name: string;
  emoji: string;
  funFacts: FunFacts;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
}

function FunFactsCard({ name, emoji, funFacts, onCopy, copiedId }: FunFactsCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
      {/* 헤더 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{emoji}</span>
          <div>
            <h4 className="font-bold text-gray-200">{name}</h4>
            {funFacts.viralOneLiner && (
              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{funFacts.viralOneLiner}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {funFacts.viralOneLiner && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopy(funFacts.viralOneLiner!, `oneliner-${name}`);
              }}
              className={`p-2 rounded-lg transition-all ${
                copiedId === `oneliner-${name}`
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {copiedId === `oneliner-${name}` ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          )}
          <span className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {/* 확장 콘텐츠 */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* viralOneLiner 강조 */}
          {funFacts.viralOneLiner && (
            <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/30">
              <p className="text-xs text-purple-400 font-bold mb-1">SNS 공유용 한 마디</p>
              <p className="text-sm text-gray-200">{funFacts.viralOneLiner}</p>
            </div>
          )}

          {/* didYouKnow */}
          {funFacts.didYouKnow && funFacts.didYouKnow.length > 0 && (
            <div>
              <p className="text-xs text-amber-400 font-bold mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 알고 계셨나요?
              </p>
              <div className="space-y-1.5">
                {funFacts.didYouKnow.map((fact, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-amber-400">✨</span>
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* commonMistakes */}
          {funFacts.commonMistakes && funFacts.commonMistakes.length > 0 && (
            <div>
              <p className="text-xs text-rose-400 font-bold mb-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> 흔한 오해
              </p>
              <div className="space-y-1.5">
                {funFacts.commonMistakes.map((mistake, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-rose-400">⚠️</span>
                    <span>{mistake}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* proTips */}
          {funFacts.proTips && funFacts.proTips.length > 0 && (
            <div>
              <p className="text-xs text-emerald-400 font-bold mb-2 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" /> 프로 팁
              </p>
              <div className="space-y-1.5">
                {funFacts.proTips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-emerald-400">💡</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
