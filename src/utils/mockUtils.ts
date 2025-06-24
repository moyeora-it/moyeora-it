import { GroupType } from '@/types';
import { Position, Skill } from '@/types/enums';

/** enum Position 키 */
export const positionKeys = Object.keys(Position).filter((key) =>
  isNaN(Number(key)),
) as (keyof typeof Position)[];

/** enum Skill 키 */
export const skillKeys = Object.keys(Skill).filter((key) =>
  isNaN(Number(key)),
) as (keyof typeof Skill)[];

/** enum Group 키 */
export const groupTypeValues = Object.values(GroupType);

/** 아이템을 랜덤하게 정렬해서 받기 */
export const getRandomItems = <T>(arr: T[], count: number): T[] => {
  const mixedArr = [...arr].sort(() => 0.5 - Math.random()); // 랜덤한 숫자로 정렬 섞기

  return mixedArr.slice(0, count);
};

/** 배열에서 값을 랜덤하게 받기 */
export const getRandomItem = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};
