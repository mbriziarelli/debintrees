import { Comparator, Direction, getDirectionFromBoolean } from "./types.ts";
import { isNode, isNull, Node } from "./node.ts";
import { TreeBase } from "./treebase.ts";

export class BinTree<T> extends TreeBase<T> {
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
    if (isNull(this.root)) {
      this.root = new Node(data);
      this.size++;

      return true;
    }

    let parent: Node<T> | null = null;
    let node: Node<T> | null = this.root;
    let direction = Direction.Left;

    while (true) {
      if (isNull(node)) {
        node = new Node(data);

        // At this point of the loop, parent has been set to the previous value of node.
        // Therefore it cannot be null
        (parent as Node<T>).setChild(direction, node);
        this.size++;

        return true;
      }

      // Cache comparison result. We have no idea how long this can take to compare two datas.
      const comparisonResult = this.comparator(node.data, data);

      if (comparisonResult === 0) {
        return false;
      } else {
        direction = getDirectionFromBoolean(comparisonResult < 0);
      }

      // node is not null, so parent is not null also.
      parent = node;
      // here node can become null again.
      node = node.getChild(direction);
    }
  }

  /**
   * @param data The data to remove
   * @returns true if removed, false if not foundNode
   */
  remove(data: T) {
    if (isNull(this.root)) {
      return false;
    }

    let direction = Direction.Right;

    const head = new Node<unknown>(undefined);
    head.setChild(direction, this.root);

    let node: Node<T> | null = (head as Node<T>);
    let parent: Node<T> | null = null;
    let foundNode: Node<T> | null = null;

    while (isNode(node?.getChild(direction) ?? null)) {
      parent = node;
      node = node?.getChild(direction) ?? null;

      if (isNode(node)) {
        const comparisonResult = this.comparator(data, node.data);

        if (comparisonResult === 0) {
          foundNode = node;
        } else {
          direction = getDirectionFromBoolean(comparisonResult > 0);
        }
      }
    }

    if (isNode(foundNode) && isNode(parent)) {
      parent.setChild(
        getDirectionFromBoolean(parent.right === node),
        node?.getChild(getDirectionFromBoolean(!node.left)) ?? null,
      );

      this.root = (head.right as Node<T>);
      this.size--;
      return true;
    }

    return false;
  }
}
