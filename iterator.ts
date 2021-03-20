import type { TreeBase } from "./treebase.ts";
import type { Node } from "./node.ts";

export class Iterator<T> {
  public _ancestors: Node<T>[] = [];
  public _cursor: Node<T> | null = null;

  constructor(public _tree: TreeBase<T>) {}

  data() {
    return this._cursor?.data ?? null;
  }

  // if null-iterator, returns first node
  // otherwise, returns next node
  next() {
    if (this._cursor === null) {
      const root = this._tree._root;

      if (root !== null) {
        this._minNode(root);
      }
    } else {
      if (this._cursor.right === null) {
        // no greater node in subtree, go up to parent
        // if coming from a right child, continue up the stack
        let save;

        do {
          save = this._cursor;
          if (this._ancestors.length) {
            this._cursor = this._ancestors.pop() ?? null;
          } else {
            this._cursor = null;
            break;
          }
        } while (this._cursor?.right === save);
      } else {
        // get the next node from the subtree
        this._ancestors.push(this._cursor);
        this._minNode(this._cursor.right);
      }
    }

    return this.data();
  }

  // if null-iterator, returns last node
  // otherwise, returns previous node
  prev() {
    if (this._cursor === null) {
      const root = this._tree._root;

      if (root !== null) {
        this._maxNode(root);
      }
    } else {
      if (this._cursor.left === null) {
        let save;

        do {
          save = this._cursor;
          if (this._ancestors.length) {
            this._cursor = this._ancestors.pop() ?? null;
          } else {
            this._cursor = null;
            break;
          }
        } while (this._cursor?.left === save);
      } else {
        this._ancestors.push(this._cursor);
        this._maxNode(this._cursor.left);
      }
    }

    return this.data();
  }

  private _minNode(start: Node<T>) {
    while (start.left !== null) {
      this._ancestors.push(start);
      start = start.left;
    }

    this._cursor = start;
  }

  private _maxNode(start: Node<T>) {
    while (start.right !== null) {
      this._ancestors.push(start);
      start = start.right;
    }

    this._cursor = start;
  }
}
