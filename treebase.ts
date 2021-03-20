import type { Comparator } from "./types.ts";
import type { Node } from "./node.ts";
import { Iterator } from "./iterator.ts";

export class TreeBase<T> {
  public _comparator: Comparator<T> | null = null;
  public _root: Node<T> | null = null;

  public size = 0;

  // removes all nodes from the tree
  clear() {
    this._root = null;
    this.size = 0;
  }

  // returns node data if found, null otherwise
  find(data: T) {
    if (this._comparator) {
      let res = this._root;

      while (res !== null) {
        const c = this._comparator(data, res.data);
        if (c === 0) {
          return res.data;
        } else {
          res = res.get_child(c > 0);
        }
      }
    }

    return null;
  }

  // returns iterator to node if found, null otherwise
  findIter(data: T) {
    if (this._comparator) {
      const iter = this.iterator();
      let res = this._root;

      while (res !== null) {
        const c = this._comparator(data, res.data);
        if (c === 0) {
          iter._cursor = res;
          return iter;
        } else {
          iter._ancestors.push(res);
          res = res.get_child(c > 0);
        }
      }
    }

    return null;
  }

  // Returns an iterator to the tree node at or immediately after the item
  lowerBound(item: T) {
    const iter = this.iterator();
    const cmp = this._comparator;

    if (cmp) {
      let cur = this._root;

      while (cur !== null) {
        const c = cmp(item, cur.data);
        if (c === 0) {
          iter._cursor = cur;
          return iter;
        }
        iter._ancestors.push(cur);
        cur = cur.get_child(c > 0);
      }

      for (let i = iter._ancestors.length - 1; i >= 0; --i) {
        cur = iter._ancestors[i];
        if (cur && cmp(item, cur.data) < 0) {
          iter._cursor = cur;
          iter._ancestors.length = i;
          return iter;
        }
      }

      iter._ancestors.length = 0;
    }

    return iter;
  }

  // Returns an iterator to the tree node immediately after the item
  upperBound(item: T) {
    const iter = this.lowerBound(item);
    const cmp = this._comparator;

    if (cmp) {
      while (iter.data() !== null && cmp(iter.data(), item) === 0) {
        iter.next();
      }
    }

    return iter;
  }

  // returns null if tree is empty
  min() {
    let res = this._root;

    if (res === null) {
      return null;
    }
    while (res.left !== null) {
      res = res.left;
    }

    return res.data;
  }

  // returns null if tree is empty
  max() {
    let res = this._root;

    if (res === null) {
      return null;
    }
    while (res.right !== null) {
      res = res.right;
    }

    return res.data;
  }

  // returns a null iterator
  // call next() or prev() to point to an element
  iterator() {
    return new Iterator<T>(this);
  }

  // calls cb on each node's data, in order
  each(cb: (data: T) => boolean) {
    const it = this.iterator();
    let data;

    while ((data = it.next()) !== null) {
      if (cb(data) === false) {
        return;
      }
    }
  }

  // calls cb on each node's data, in reverse order
  reach(cb: (data: T) => boolean) {
    const it = this.iterator();
    let data;

    while ((data = it.prev()) !== null) {
      if (cb(data) === false) {
        return;
      }
    }
  }
}
