import { Direction } from "./types.ts";

export class Node<T> {
  public left: Node<T> | null = null;
  public right: Node<T> | null = null;
  public red = true;

  constructor(public data: T) {}

  getChild(direction: Direction) {
    return direction === Direction.Left ? this.left : this.right;
  }

  setChild(direction: Direction, child: Node<T> | null) {
    direction === Direction.Left ? this.left = child : this.right = child;
  }

  hasChild(direction: Direction) {
    return direction === Direction.Left
      ? this.left !== null
      : this.right !== null;
  }

  isRed() {
    return this.red;
  }

  isBlack() {
    return !this.red;
  }
}

export const isNull = <T>(value: Node<T> | null): value is null =>
  value === null;

export const isNode = <T>(value: Node<T> | null): value is Node<T> =>
  value instanceof Node;

export const isRed = <T>(node: Node<T> | null): boolean =>
  isNode(node) && node.isRed();

export const isBlack = <T>(node: Node<T> | null): boolean =>
  isNode(node) && node.isBlack();
