import { Direction } from "./types.ts";

export class Node<T> {
  left: Node<T> | null = null;
  right: Node<T> | null = null;
  red = true;

  constructor(public data: T) {}

  getChild(direction: Direction) {
    return direction === Direction.Right ? this.right : this.left;
  }

  setChild(direction: Direction, child: Node<T> | null) {
    this[direction === Direction.Right ? "right" : "left"] = child;
  }
}

export const isNull = (value: unknown): value is null => value === null;

export const isNode = <T>(value: Node<T> | null): value is Node<T> =>
  !isNull(value);

export const isRed = <T>(node: Node<T> | null): boolean =>
  isNode(node) && node.red;
