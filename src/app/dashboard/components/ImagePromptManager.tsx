'use client';

import { useState } from 'react';
import {
  ALL_IMAGE_PROMPTS,
  generateFullPrompt,
  getImageStats,
  type ImagePromptItem,
  type TestImageGroup
} from '../data/image-prompts';

export default function ImagePromptManager() {
  const [selectedTest, setSelectedTest] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const stats = getImageStats();

  const filteredGroups = selectedTest === 'all'
    ? ALL_IMAGE_PROMPTS
    : ALL_IMAGE_PROMPTS.filter(g => g.testKey === selectedTest);

  const copyToClipboard = async (item: ImagePromptItem) => {
    const fullPrompt = generateFullPrompt(item);
    await navigator.clipboard.writeText(fullPrompt);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: ImagePromptItem['status']) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">대기중</span>;
      case 'generated':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">생성됨</span>;
      case 'uploaded':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">업로드 완료</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 & 통계 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">이미지 프롬프트 관리</h2>
            <p className="text-sm text-gray-600 mt-1">AI 이미지 생성용 프롬프트 및 업로드 상태 관리</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-600">{stats.progress}%</div>
            <div className="text-sm text-gray-500">{stats.uploaded}/{stats.total} 완료</div>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${stats.progress}%` }}
          />
        </div>
      </div>

      {/* 필터 */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedTest('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedTest === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          전체
        </button>
        {ALL_IMAGE_PROMPTS.map(group => (
          <button
            key={group.testKey}
            onClick={() => setSelectedTest(group.testKey)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTest === group.testKey
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {group.testName} ({group.uploadedCount}/{group.totalResults})
          </button>
        ))}
      </div>

      {/* 테스트별 이미지 목록 */}
      {filteredGroups.map(group => (
        <div key={group.testKey} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h3 className="font-bold text-gray-800">{group.testName}</h3>
            <p className="text-sm text-gray-500">{group.uploadedCount}/{group.totalResults} 이미지 업로드됨</p>
          </div>

          <div className="divide-y">
            {group.items.map((item, index) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* 순번 & 이모지 */}
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className="text-3xl mb-1">{item.emoji}</div>
                    <div className="text-xs text-gray-400">#{index + 1}</div>
                  </div>

                  {/* 이미지 미리보기 (업로드 시) */}
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    {item.imagePath ? (
                      <img src={item.imagePath} alt={item.resultName} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span className="text-gray-400 text-xs text-center">이미지<br/>대기중</span>
                    )}
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-800">{item.resultName}</h4>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>

                    {/* 프롬프트 */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-500">English Prompt</span>
                        <button
                          onClick={() => copyToClipboard(item)}
                          className={`text-xs px-2 py-1 rounded transition-colors ${
                            copiedId === item.id
                              ? 'bg-green-100 text-green-700'
                              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          }`}
                        >
                          {copiedId === item.id ? '복사됨!' : '복사'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-700 font-mono leading-relaxed">{item.prompt}</p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3">
                      <span className="text-xs font-medium text-blue-600">한글 설명</span>
                      <p className="text-xs text-blue-800 mt-1">{item.promptKo}</p>
                    </div>
                  </div>

                  {/* 색상 미리보기 */}
                  <div className="flex-shrink-0 w-8">
                    <div
                      className={`w-8 h-8 rounded-full ${getColorClass(item.resultName)}`}
                      title="테마 색상"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 사용 가이드 */}
      <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
        <h3 className="font-bold text-amber-800 mb-3">이미지 생성 가이드</h3>
        <ol className="space-y-2 text-sm text-amber-700">
          <li className="flex gap-2">
            <span className="font-bold">1.</span>
            <span>프롬프트 &quot;복사&quot; 버튼 클릭</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">2.</span>
            <span>Midjourney, DALL-E, 또는 Stable Diffusion에 붙여넣기</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">3.</span>
            <span>생성된 이미지를 <code className="bg-amber-100 px-1 rounded">public/images/idealType/</code> 폴더에 저장</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">4.</span>
            <span>파일명: <code className="bg-amber-100 px-1 rounded">[testKey]-[index].png</code> (예: idealType-1.png)</span>
          </li>
        </ol>
      </div>
    </div>
  );
}

// 결과명에 따른 색상 클래스 반환
function getColorClass(resultName: string): string {
  const colorMap: Record<string, string> = {
    // idealType
    '다정다감 연인': 'bg-pink-200',
    '든든한 버팀목': 'bg-blue-200',
    '열정적인 로맨티스트': 'bg-red-200',
    '자유로운 동반자': 'bg-cyan-200',
    '편안한 베스트프렌드': 'bg-yellow-200',
    '액티브 파트너': 'bg-orange-200',
    '진지한 소울메이트': 'bg-purple-200',
    '츤데레 연인': 'bg-slate-200',
    '집순이/집돌이 파트너': 'bg-amber-200',
    '밸런스 연인': 'bg-green-200',
    // attachment
    '안정형 (Secure)': 'bg-green-200',
    '불안형 (Anxious)': 'bg-yellow-100',
    '회피형 (Avoidant)': 'bg-blue-200',
    '혼란형 (Disorganized)': 'bg-purple-200',
    '안정-불안 경계형': 'bg-yellow-100',
    '안정-회피 경계형': 'bg-blue-100',
    '균형형': 'bg-gray-100',
    '회피-혼란 경계형': 'bg-purple-100',
  };
  return colorMap[resultName] || 'bg-gray-200';
}
