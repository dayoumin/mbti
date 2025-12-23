// 케미 테스트 데이터 통합 모듈
// 생성일: 2025-12-11

import type { SubjectData, SubjectKey } from './types';
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
import { spendingStyleData } from './subjects/spendingStyle';
import { DRINKING_STYLE_DATA } from './subjects/drinkingStyle';
import { travelStyleData } from './subjects/travelStyle';
// 세부 테스트
import { dogBreedData } from './subjects/dogBreed';
import { catBreedData } from './subjects/catBreed';
import { smallPetData } from './subjects/smallPet';
import { fishTypeData } from './subjects/fishType';
import { birdTypeData } from './subjects/birdType';
import { reptileTypeData } from './subjects/reptileType';

// SubjectData로 타입 단언 - 모든 테스트 데이터가 동일한 타입으로 취급됨
// 이렇게 하면 questions_deep 같은 선택적 필드 접근 시 타입 에러 방지
//
// 타입 안전성: _CHEMI_DATA의 키는 SubjectKey와 일치해야 함
// 키 누락/추가 시 아래 _ensureAllKeys에서 타입 에러 발생
const _CHEMI_DATA = {
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
    spendingStyle: spendingStyleData,
    drinkingStyle: DRINKING_STYLE_DATA,
    travelStyle: travelStyleData,
    // 세부 테스트
    dogBreed: dogBreedData,
    catBreed: catBreedData,
    smallPet: smallPetData,
    fishType: fishTypeData,
    birdType: birdTypeData,
    reptileType: reptileTypeData,
};

// 키 완전성 검증: SubjectKey의 모든 키가 _CHEMI_DATA에 있는지 컴파일 타임 체크
// 키가 누락되면 여기서 타입 에러 발생 (예: "Property 'newTest' is missing")
const _ensureAllKeys: Record<SubjectKey, unknown> = _CHEMI_DATA;
void _ensureAllKeys; // unused variable 경고 방지

// 타입 단언으로 통일 - 선택적 필드(questions_deep 등) 접근 시 타입 에러 방지
// unknown을 통한 강제 캐스팅 (각 데이터 파일의 리터럴 타입 차이 무시)
export const CHEMI_DATA = _CHEMI_DATA as unknown as Record<SubjectKey, SubjectData>;

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
export { teaData, conflictStyleData, fruitData, alcoholData, breadData, perfumeData, aromaData, foodData, whiskeySampleData, ramenData, spendingStyleData, travelStyleData };
export const drinkingStyleData = DRINKING_STYLE_DATA;
// 세부 테스트 re-export
export { dogBreedData, catBreedData, smallPetData, fishTypeData, birdTypeData, reptileTypeData };
