export const DETAIL_TEST_KEYS = [
  'dogBreed',
  'catBreed',
  'smallPet',
  'fishType',
  'birdType',
  'reptileType',
] as const;

export type DetailTestKey = (typeof DETAIL_TEST_KEYS)[number];

