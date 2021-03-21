export type Comparator<T> = (a: T, b: T) => number;

export enum Direction {
  Right,
  Left,
}

export const getOppositeDirection = (direction: Direction) =>
  direction === Direction.Right ? Direction.Left : Direction.Right;

export const getDirectionFromBoolean = (value: boolean) =>
  value ? Direction.Right : Direction.Left;
