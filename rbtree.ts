import {
  Comparator,
  Direction,
  getDirectionFromBoolean,
  getOppositeDirection,
} from "./types.ts";
import { isNode, isNull, isRed, Node } from "./node.ts";
import { TreeBase } from "./treebase.ts";

const singleRotate = <T>(
  root: Node<T> | null,
  direction: Direction,
): Node<T> | null => {
  const oppositeDirection = getOppositeDirection(direction);

  if (isNode(root)) {
    const save = root.getChild(oppositeDirection);

    if (isNode(save)) {
      root.setChild(oppositeDirection, save.getChild(direction));
      save.setChild(direction, root);

      root.red = true;
      save.red = false;

      return save;
    }
  }

  return null;
};

const doubleRotate = <T>(
  root: Node<T> | null,
  direction: Direction,
): Node<T> | null => {
  const oppositeDirection = getOppositeDirection(direction);

  if (isNode(root)) {
    root.setChild(
      oppositeDirection,
      singleRotate(root.getChild(oppositeDirection), oppositeDirection),
    );

    return singleRotate(root, direction);
  }

  return null;
};

export class RBTree<T> extends TreeBase<T> {
  root: Node<T> | null = null;
  size = 0;

  constructor(public comparator: Comparator<T>) {
    super();
  }

  /**
   * @param data The data to insert
   * @returns true if inserted, false if duplicate
   */
  insert(data: T) {
    let inserted = false;

    if (isNull(this.root)) {
      this.root = new Node(data);
      inserted = true;
      this.size++;
    } else {
      const head = new Node<unknown>(undefined);
      head.right = this.root;

      let direction = Direction.Left;
      let last = 0;
      let grandGrandParent: Node<T> | null = (head as Node<T>);
      let grandParent: Node<T> | null = null;
      let parent: Node<T> | null = null;
      let node: Node<T> | null = this.root;

      while (true) {
        if (isNull(node)) {
          // insert new node at the bottom
          node = new Node(data);
          parent.setChild(direction, node);
          inserted = true;
          this.size++;
        } else if (
          isNode(node.left) && isRed(node.left) && isNode(node.right) &&
          isRed(node.right)
        ) {
          node.red = true;
          node.left.red = false;
          node.right.red = false;
        }

        // fix red violation
        if (isNode(node) && isRed(node) && isNode(parent) && isRed(parent)) {
          const direction2 = getDirectionFromBoolean(
            grandGrandParent.right === grandParent,
          );

          if (node === parent.getChild(last)) {
            grandGrandParent.setChild(
              direction2,
              singleRotate(grandParent, getDirectionFromBoolean(!last)),
            );
          } else {
            grandGrandParent.setChild(
              direction2,
              doubleRotate(grandParent, getDirectionFromBoolean(!last)),
            );
          }
        }

        const comparisonResult = this.comparator(node.data, data);

        if (comparisonResult === 0) {
          break;
        } else {
          last = direction;
          direction = getDirectionFromBoolean(comparisonResult < 0);

          if (!isNull(grandParent)) {
            grandGrandParent = grandParent;
          }
          grandParent = parent;
          parent = node;
          node = node.getChild(direction);
        }
      }

      this.root = head.right as Node<T>;
    }

    this.root.red = false;
    return inserted;
  }

  // returns true if removed, false if not found
  remove(data: T) {
    if (isNull(this.root)) {
      return false;
    }

    const head = new Node<unknown>(undefined);
    head.right = this.root;

    let node: Node<T> | null = head as Node<T>;
    let parent: Node<T> | null = null;
    let grandParent: Node<T> | null = null;
    let found: Node<T> | null = null;
    let direction = getDirectionFromBoolean(true);

    while (isNode(node?.getChild(direction) ?? null)) {
      const lastDirection = direction;

      grandParent = parent;
      parent = node;
      node = node?.getChild(direction) ?? null;

      const comparisonResult = this.comparator(data, node.data);

      direction = getDirectionFromBoolean(comparisonResult > 0);

      if (comparisonResult === 0) {
        found = node;
      }

      // push the red node down
      if (!isRed(node) && !isRed(node.getChild(direction))) {
        if (isRed(node.getChild(!direction))) {
          let sr = singleRotate(node, direction);
          parent.setChild(lastDirection, sr);
          parent = sr;
        } else if (!isRed(node.getChild(!direction))) {
          let sibling = parent.getChild(!lastDirection);
          if (sibling !== null) {
            if (
              !isRed(sibling.getChild(!lastDirection)) &&
              !isRed(sibling.getChild(lastDirection))
            ) {
              // color flip
              parent.red = false;
              sibling.red = true;
              node.red = true;
            } else {
              var dir2 = grandParent.right === parent;

              if (isRed(sibling.getChild(lastDirection))) {
                grandParent.setChild(dir2, doubleRotate(parent, lastDirection));
              } else if (isRed(sibling.getChild(!lastDirection))) {
                grandParent.setChild(dir2, singleRotate(parent, lastDirection));
              }

              // ensure correct coloring
              var gpc = grandParent.getChild(dir2);
              gpc.red = true;
              node.red = true;
              gpc.left.red = false;
              gpc.right.red = false;
            }
          }
        }
      }
    }

    if (isNode(found)) {
      found.data = node.data;
      parent.setChild(
        parent.right === node ? Direction.Right : Direction.Left,
        node.getChild(node.left === null ? Direction.Right : Direction.Left),
      );
      this.size--;
    }

    this.root = head.right as Node<T>;

    if (isNode(this.root)) {
      this.root.red = false;
    }

    return isNode(found);
  }
}
