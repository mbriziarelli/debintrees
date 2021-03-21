import type { TreeBase } from "./treebase.ts";
import type { Node } from "./node.ts";

export class Iterator<T> {
  public ancestors: Node<T>[] = [];
  public cursor: Node<T> | null = null;

  constructor(public tree: TreeBase<T>) {}

  data() {
    return this.cursor?.data ?? null;
  }

  /**
   * @returns if null-iterator, returns first node otherwise, returns next node
   */
  next() {
    if (this.cursor === null) {
      const root = this.tree.root;

      if (root !== null) {
        this._minNode(root);
      }
    } else {
      if (this.cursor.right === null) {
        // no greater node in subtree, go up to parent
        // if coming from a right child, continue up the stack
        let save;

        do {
          save = this.cursor;
          if (this.ancestors.length) {
            this.cursor = this.ancestors.pop() ?? null;
          } else {
            this.cursor = null;
            break;
          }
        } while (this.cursor?.right === save);
      } else {
        // get the next node from the subtree
        this.ancestors.push(this.cursor);
        this._minNode(this.cursor.right);
      }
    }

    return this.data();
  }

  /**
   * @returns if null-iterator, returns last node otherwise, returns previous node
   */
  prev() {
    if (this.cursor === null) {
      const root = this.tree.root;

      if (root !== null) {
        this._maxNode(root);
      }
    } else {
      if (this.cursor.left === null) {
        let save;

        do {
          save = this.cursor;
          if (this.ancestors.length) {
            this.cursor = this.ancestors.pop() ?? null;
          } else {
            this.cursor = null;
            break;
          }
        } while (this.cursor?.left === save);
      } else {
        this.ancestors.push(this.cursor);
        this._maxNode(this.cursor.left);
      }
    }

    return this.data();
  }

  private _minNode(start: Node<T>) {
    while (start.left !== null) {
      this.ancestors.push(start);
      start = start.left;
    }

    this.cursor = start;
  }

  private _maxNode(start: Node<T>) {
    while (start.right !== null) {
      this.ancestors.push(start);
      start = start.right;
    }

    this.cursor = start;
  }
}
