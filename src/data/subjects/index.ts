// Subject 데이터 통합 모듈

// 기존 UPPER_CASE export를 camelCase alias로 re-export
export { HUMAN_DATA as humanData } from './human';
export { CAT_DATA as catData } from './cat';
export { DOG_DATA as dogData } from './dog';
export { RABBIT_DATA as rabbitData } from './rabbit';
export { HAMSTER_DATA as hamsterData } from './hamster';
export { IDEALTYPE_DATA as idealTypeData } from './idealType';
export { PLANT_DATA as plantData } from './plant';
export { PETMATCH_DATA as petMatchData } from './petMatch';
export { COFFEE_DATA as coffeeData } from './coffee';

// 새 파일들은 이미 camelCase로 export됨
export { teaData } from './tea';
export { conflictStyleData } from './conflictStyle';
export { fruitData } from './fruit';
export { alcoholData } from './alcohol';
export { breadData } from './bread';

// 세부 테스트
export { dogBreedData } from './dogBreed';
export { catBreedData } from './catBreed';
export { smallPetData } from './smallPet';
export { fishTypeData } from './fishType';
export { birdTypeData } from './birdType';
export { reptileTypeData } from './reptileType';
