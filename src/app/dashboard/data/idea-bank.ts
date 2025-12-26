// ============================================================================
// 아이디어 뱅크 - Re-export from new location
// ============================================================================
// 이 파일은 하위 호환성을 위한 re-export입니다.
// 실제 데이터는 src/data/ideas/에 JSON 파일로 관리됩니다.
//
// 데이터 구조:
// src/data/ideas/
// ├── _types.ts              # 타입 정의
// ├── index.ts               # 통합 로더 및 헬퍼 함수
// ├── japanese-anime.json    # 테마별 JSON 파일들
// ├── music.json
// ├── food.json
// ├── games.json
// ├── drama-movie.json
// ├── sports.json
// ├── travel.json
// ├── cars.json
// ├── beauty-fashion.json
// ├── pets.json
// ├── brands.json
// ├── webtoon.json
// ├── youtubers.json
// ├── jobs-career.json
// └── psychology-tests.json
//
// 아이디어 추가/수정/삭제:
// 해당 테마의 JSON 파일을 직접 편집하면 됩니다.
// 빌드 시 자동으로 반영됩니다.
// ============================================================================

export {
  // 메인 데이터
  THEMES,

  // 헬퍼 함수
  getIdeaStats,
  getTotalStats,
  getHighPriorityIdeas,
  getQuickWins,
  getThemeById,
  getIdeaById,
  getIdeasByStatus,
  getIdeasByViralPotential,

  // 타입
  type Theme,
  type ThemeJson,
  type ContentIdea,
  type ThemeMeta,
  type IdeaStatus,
  type ViralPotential,
  type Priority,
  type ContentCategory,
  type Difficulty,

  // 상수
  STATUS_EMOJI,
  CATEGORY_LABEL,
  VIRAL_LABEL,
} from '@/data/ideas';
