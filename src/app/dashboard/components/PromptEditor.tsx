'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Copy,
  Check,
  X,
  Wand2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import {
  ALL_IMAGE_PROMPTS,
  IMAGE_STYLES,
  generateFullPrompt,
  type ImagePromptItem,
} from '../data/image-prompts';

// ============================================================================
// Types
// ============================================================================

type EditorMode = 'view' | 'add' | 'edit';

interface NewPromptForm {
  testKey: string;
  testName: string;
  resultName: string;
  emoji: string;
  description: string;
  prompt: string;
  promptKo: string;
  style: keyof typeof IMAGE_STYLES;
}

const EMPTY_FORM: NewPromptForm = {
  testKey: '',
  testName: '',
  resultName: '',
  emoji: '',
  description: '',
  prompt: '',
  promptKo: '',
  style: 'teenAnime',
};

// ============================================================================
// Main Component
// ============================================================================

export default function PromptEditor() {
  const [mode, setMode] = useState<EditorMode>('view');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<ImagePromptItem | null>(null);
  const [form, setForm] = useState<NewPromptForm>(EMPTY_FORM);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);

  // 필터링된 프롬프트 목록
  const filteredPrompts = useMemo(() => {
    let items: ImagePromptItem[] = [];

    if (selectedTest === 'all') {
      items = ALL_IMAGE_PROMPTS.flatMap(g => g.items);
    } else {
      const group = ALL_IMAGE_PROMPTS.find(g => g.testKey === selectedTest);
      items = group?.items || [];
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.resultName.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.prompt.toLowerCase().includes(query) ||
        item.promptKo?.toLowerCase().includes(query)
      );
    }

    return items;
  }, [selectedTest, searchQuery]);

  // 클립보드 복사
  const copyToClipboard = async (item: ImagePromptItem) => {
    const fullPrompt = generateFullPrompt(item);
    await navigator.clipboard.writeText(fullPrompt);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 새 프롬프트 추가 시작
  const startAdd = () => {
    setForm(EMPTY_FORM);
    setMode('add');
    setEditingItem(null);
  };

  // 편집 시작
  const startEdit = (item: ImagePromptItem) => {
    setForm({
      testKey: item.testKey,
      testName: item.testName || '',
      resultName: item.resultName,
      emoji: item.emoji || '',
      description: item.description || '',
      prompt: item.prompt,
      promptKo: item.promptKo || '',
      style: (item.style as keyof typeof IMAGE_STYLES) || 'teenAnime',
    });
    setEditingItem(item);
    setMode('edit');
  };

  // 취소
  const cancelEdit = () => {
    setMode('view');
    setForm(EMPTY_FORM);
    setEditingItem(null);
  };

  // 폼 유효성 검사
  const isFormValid = () => {
    return form.testKey.trim() !== '' &&
           form.resultName.trim() !== '' &&
           form.prompt.trim() !== '';
  };

  // 저장 (실제로는 코드 생성)
  const generateCode = () => {
    if (!isFormValid()) {
      alert('필수 필드를 입력해주세요:\n- 테스트 키\n- 결과 이름\n- 영어 프롬프트');
      return;
    }

    const id = `${form.testKey}-${Date.now()}`;
    const code = `{
  id: "${id}",
  testKey: "${form.testKey}",
  testName: "${form.testName}",
  resultName: "${form.resultName}",
  emoji: "${form.emoji}",
  description: "${form.description}",
  prompt: "${form.prompt}",
  promptKo: "${form.promptKo}",
  style: "${form.style}",
  status: "pending"
},`;

    navigator.clipboard.writeText(code);
    alert('코드가 클립보드에 복사되었습니다!\n\nimage-prompts.ts 파일의 해당 테스트 배열에 붙여넣기 하세요.');
    cancelEdit();
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-indigo-600" />
              프롬프트 에디터
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              AI 이미지 생성용 프롬프트를 추가하고 관리합니다
            </p>
          </div>
          <button
            onClick={startAdd}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            새 프롬프트
          </button>
        </div>

        {/* 검색 & 필터 */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="프롬프트 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">전체 테스트</option>
            {ALL_IMAGE_PROMPTS.map(group => (
              <option key={group.testKey} value={group.testKey}>
                {group.testName} ({group.items.length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 추가/편집 폼 */}
      {(mode === 'add' || mode === 'edit') && (
        <div className="bg-white rounded-xl border-2 border-indigo-200 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              {mode === 'add' ? '새 프롬프트 추가' : '프롬프트 편집'}
            </h3>
            <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* 테스트 키 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">테스트 키</label>
              <input
                type="text"
                value={form.testKey}
                onChange={(e) => setForm({ ...form, testKey: e.target.value })}
                placeholder="예: idealType, attachment"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* 테스트 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">테스트 이름</label>
              <input
                type="text"
                value={form.testName}
                onChange={(e) => setForm({ ...form, testName: e.target.value })}
                placeholder="예: 연애 이상형 테스트"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* 결과 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">결과 이름</label>
              <input
                type="text"
                value={form.resultName}
                onChange={(e) => setForm({ ...form, resultName: e.target.value })}
                placeholder="예: 다정다감 연인"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* 이모지 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이모지</label>
              <input
                type="text"
                value={form.emoji}
                onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                placeholder="예: 🥰"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* 설명 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="예: 따뜻한 말과 애정 표현이 가득한 상대"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 영어 프롬프트 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              영어 프롬프트 (AI 이미지 생성용)
            </label>
            <textarea
              value={form.prompt}
              onChange={(e) => setForm({ ...form, prompt: e.target.value })}
              placeholder="cute high school teenager, warm gentle smile..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
            />
          </div>

          {/* 한글 설명 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">한글 프롬프트 설명</label>
            <input
              type="text"
              value={form.promptKo}
              onChange={(e) => setForm({ ...form, promptKo: e.target.value })}
              placeholder="귀여운 고등학생, 따뜻한 미소..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 스타일 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">스타일</label>
            <div className="relative">
              <button
                onClick={() => setShowStyleDropdown(!showStyleDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
              >
                <span>{form.style}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showStyleDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {Object.entries(IMAGE_STYLES).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setForm({ ...form, style: key as keyof typeof IMAGE_STYLES });
                        setShowStyleDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-indigo-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className="font-medium text-gray-800">{key}</div>
                      <div className="text-xs text-gray-500 truncate">{value}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 미리보기 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">생성될 전체 프롬프트 미리보기</h4>
            <p className="text-xs text-gray-600 font-mono leading-relaxed">
              {form.prompt}, {IMAGE_STYLES[form.style]}
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3">
            <button
              onClick={cancelEdit}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={generateCode}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Copy className="w-4 h-4" />
              코드 복사
            </button>
          </div>
        </div>
      )}

      {/* 프롬프트 목록 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800">프롬프트 목록</h3>
            <p className="text-sm text-gray-500">{filteredPrompts.length}개 프롬프트</p>
          </div>
        </div>

        <div className="divide-y max-h-[600px] overflow-y-auto">
          {filteredPrompts.map((item) => (
            <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                {/* 이모지 & 인덱스 */}
                <div className="flex-shrink-0 w-12 text-center">
                  <div className="text-2xl">{item.emoji}</div>
                  <div className="text-xs text-gray-400 mt-1">{item.testKey}</div>
                </div>

                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-800">{item.resultName}</h4>
                    <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                      {item.style}
                    </span>
                    {item.status === 'uploaded' && (
                      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                        업로드됨
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>

                  {/* 프롬프트 미리보기 */}
                  <div className="bg-gray-50 rounded-lg p-2 mb-2">
                    <p className="text-xs text-gray-700 font-mono line-clamp-2">{item.prompt}</p>
                  </div>

                  {item.promptKo && (
                    <p className="text-xs text-blue-600">{item.promptKo}</p>
                  )}
                </div>

                {/* 액션 버튼 */}
                <div className="flex-shrink-0 flex gap-2">
                  <button
                    onClick={() => copyToClipboard(item)}
                    className={`p-2 rounded-lg transition-colors ${
                      copiedId === item.id
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title="프롬프트 복사"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                    title="편집"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 사용 가이드 */}
      <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
        <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          프롬프트 에디터 사용법
        </h3>
        <ol className="space-y-2 text-sm text-amber-700">
          <li className="flex gap-2">
            <span className="font-bold">1.</span>
            <span>&quot;새 프롬프트&quot; 버튼으로 폼 작성</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">2.</span>
            <span>&quot;코드 복사&quot; 버튼 클릭 → 코드가 클립보드에 복사됨</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">3.</span>
            <span><code className="bg-amber-100 px-1 rounded">src/app/dashboard/data/image-prompts.ts</code> 파일 열기</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">4.</span>
            <span>해당 테스트의 배열(예: IDEALTYPE_IMAGE_PROMPTS)에 붙여넣기</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">5.</span>
            <span>빌드 후 자동 반영됨</span>
          </li>
        </ol>
        <div className="mt-4 p-3 bg-amber-100 rounded-lg">
          <p className="text-xs text-amber-800">
            <strong>참고:</strong> 프롬프트는 코드로 관리되므로 직접 파일 수정이 필요합니다.
            에디터는 코드 생성을 도와주는 도구입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
