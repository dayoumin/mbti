// 케미 테스트 데이터 통합 모듈
// 생성일: 2025-12-11

import { HUMAN_DATA } from './subjects/human';
import { CAT_DATA } from './subjects/cat';
import { DOG_DATA } from './subjects/dog';
import { RABBIT_DATA } from './subjects/rabbit';
import { HAMSTER_DATA } from './subjects/hamster';
import { IDEALTYPE_DATA } from './subjects/idealType';
import { PLANT_DATA } from './subjects/plant';
import { PETMATCH_DATA } from './subjects/petMatch';
import { COFFEE_DATA } from './subjects/coffee';
import { teaData } from './subjects/tea';
import { conflictStyleData } from './subjects/conflictStyle';
import { fruitData } from './subjects/fruit';
import { alcoholData } from './subjects/alcohol';
import { breadData } from './subjects/bread';
import { perfumeData } from './subjects/perfume';
import { aromaData } from './subjects/aroma';
import { foodData } from './subjects/food';
import { whiskeySampleData } from './subjects/whiskeySample';
import { ramenData } from './subjects/ramen';
// 세부 테스트
import { dogBreedData } from './subjects/dogBreed';
import { catBreedData } from './subjects/catBreed';
import { smallPetData } from './subjects/smallPet';
import { fishTypeData } from './subjects/fishType';
import { birdTypeData } from './subjects/birdType';
import { reptileTypeData } from './subjects/reptileType';

export const CHEMI_DATA = {
    human: HUMAN_DATA,
    cat: CAT_DATA,
    dog: DOG_DATA,
    rabbit: RABBIT_DATA,
    hamster: HAMSTER_DATA,
    idealType: IDEALTYPE_DATA,
    plant: PLANT_DATA,
    petMatch: PETMATCH_DATA,
    coffee: COFFEE_DATA,
    tea: teaData,
    conflictStyle: conflictStyleData,
    fruit: fruitData,
    alcohol: alcoholData,
    bread: breadData,
    perfume: perfumeData,
    aroma: aromaData,
    food: foodData,
    whiskeySample: whiskeySampleData,
    ramen: ramenData,
    // 세부 테스트
    dogBreed: dogBreedData,
    catBreed: catBreedData,
    smallPet: smallPetData,
    fishType: fishTypeData,
    birdType: birdTypeData,
    reptileType: reptileTypeData,
};

// config.ts에서 re-export
export { SUBJECT_CONFIG, MAIN_TEST_KEYS, DETAIL_TEST_KEYS, RANKABLE_TESTS, RANKABLE_TEST_KEYS, TEST_TYPES } from './config';

// camelCase alias exports (하위 호환성)
export const humanData = HUMAN_DATA;
export const catData = CAT_DATA;
export const dogData = DOG_DATA;
export const rabbitData = RABBIT_DATA;
export const hamsterData = HAMSTER_DATA;
export const idealTypeData = IDEALTYPE_DATA;
export const plantData = PLANT_DATA;
export const petMatchData = PETMATCH_DATA;
export const coffeeData = COFFEE_DATA;
// 신규 테스트 re-export (이미 camelCase로 import됨)
export { teaData, conflictStyleData, fruitData, alcoholData, breadData, perfumeData, aromaData, foodData, whiskeySampleData, ramenData };
// 세부 테스트 re-export
export { dogBreedData, catBreedData, smallPetData, fishTypeData, birdTypeData, reptileTypeData };
