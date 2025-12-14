// 케미 테스트 데이터 통합 모듈

import { ChemiData, SubjectKey } from './types';
import { humanData } from './subjects/human';
import { catData } from './subjects/cat';
import { dogData } from './subjects/dog';
import { rabbitData } from './subjects/rabbit';
import { hamsterData } from './subjects/hamster';
import { idealTypeData } from './subjects/idealType';
import { plantData } from './subjects/plant';
import { petMatchData } from './subjects/petMatch';
import { coffeeData } from './subjects/coffee';
import { conflictStyleData } from './subjects/conflictStyle';
// petMatch 세부 테스트
import { dogBreedData } from './subjects/dogBreed';
import { catBreedData } from './subjects/catBreed';
import { smallPetData } from './subjects/smallPet';
import { fishTypeData } from './subjects/fishType';
import { birdTypeData } from './subjects/birdType';
import { reptileTypeData } from './subjects/reptileType';

export const CHEMI_DATA: ChemiData = {
  human: humanData,
  cat: catData,
  dog: dogData,
  rabbit: rabbitData,
  hamster: hamsterData,
  idealType: idealTypeData,
  plant: plantData,
  petMatch: petMatchData,
  coffee: coffeeData,
  conflictStyle: conflictStyleData,
  // petMatch 세부 테스트
  dogBreed: dogBreedData,
  catBreed: catBreedData,
  smallPet: smallPetData,
  fishType: fishTypeData,
  birdType: birdTypeData,
  reptileType: reptileTypeData
};

export const SUBJECT_KEYS: SubjectKey[] = [
  'human', 'cat', 'dog', 'rabbit', 'hamster', 'idealType', 'plant', 'petMatch', 'coffee', 'conflictStyle',
  // petMatch 세부 테스트
  'dogBreed', 'catBreed', 'smallPet', 'fishType', 'birdType', 'reptileType'
];

// Re-export everything
export * from './types';
// constants에서 Level 제외 (types에서 re-export됨)
export { CHEMI_CONSTANTS } from './constants';
export * from './utils';
export * from './config';
