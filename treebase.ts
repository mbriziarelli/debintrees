import { isNode, isNull, Node } from "./node.ts";
import { Comparator, getDirectionFromBoolean } from "./types.ts";
import { Iterator } from "./iterator.ts";

export class TreeBase<T> {
  public comparator: Comparator<T> | null = null;
  public root: Node<T> | null = null;

  public size = 0;

  /**
   * removes all nodes from the tree
   */
  clear() {
    this.root = null;
    this.size = 0;
  }

  /**
   * @param data 
   * @returns node data if found, null otherwise 
   */
  find(data: T) {
    if (this.comparator) {
      let res = this.root;

      while (isNode(res)) {
        const comparisonResult = this.comparator(data, res.data);

        if (comparisonResult === 0) {
          return res.data;
        } else {
          res = res.getChild(getDirectionFromBoolean(comparisonResult > 0));
        }
      }
    }

    return null;
  }

  /**
   * @param data 
   * @returns iterator to node if found, null otherwise
   */
  findIter(data: T) {
    if (this.comparator) {
      const iter = this.iterator();
      let res = this.root;

      while (isNode(res)) {
        const comparisonResult = this.comparator(data, res.data);

        if (comparisonResult === 0) {
          iter.cursor = res;
          return iter;
        } else {
          iter.ancestors.push(res);
          res = res.getChild(getDirectionFromBoolean(comparisonResult > 0));
        }
      }
    }

    return null;
  }

  /**
   * @param data 
   * @returns an iterator to the tree node at or immediately after the data 
   */
  lowerBound(data: T) {
    const iter = this.iterator();

    if (this.comparator) {
      let currentNode = this.root;

      while (isNode(currentNode)) {
        const comparisonResult = this.comparator(data, currentNode.data);

        if (comparisonResult === 0) {
          iter.cursor = currentNode;
          return iter;
        }
        iter.ancestors.push(currentNode);
        currentNode = currentNode.getChild(
          getDirectionFromBoolean(comparisonResult > 0),
        );
      }

      for (let i = iter.ancestors.length - 1; i >= 0; --i) {
        currentNode = iter.ancestors[i];
        if (currentNode && this.comparator(data, currentNode.data) < 0) {
          iter.cursor = currentNode;
          iter.ancestors.length = i;

          return iter;
        }
      }

      iter.ancestors.length = 0;
    }

    return iter;
  }

  /**
   * @param data 
   * @returns an iter to the tree node immediately after the data 
   */
  upperBound(data: T) {
    const iter = this.lowerBound(data);

    if (this.comparator) {
      const iteratorData = iter.data();

      while (
        iteratorData !== null && this.comparator(iteratorData, data) === 0
      ) {
        iter.next();
      }
    }

    return iter;
  }

  /**
   * @returns null if tree is empty
   */
  min() {
    let node = this.root;

    if (isNull(node)) {
      return null;
    }
    while (isNode(node.left)) {
      node = node.left;
    }

    return node.data;
  }

  /**
   * @returns null if tree is empty
   */
  max() {
    let node = this.root;

    if (isNull(node)) {
      return null;
    }
    while (isNode(node.right)) {
      node = node.right;
    }

    return node.data;
  }

  /**
   * call next() or prev() to point to an element
   * @returns a null iterator
   */
  iterator() {
    return new Iterator<T>(this);
  }

  /**
   * Calls callback on each node's data, in order.
   * @param callback 
   * @returns when callback returns false or there is no more element in tree.
   */
  each(callback: (data: T) => boolean) {
    const iter = this.iterator();
    let data;

    while ((data = iter.next()) !== null) {
      if (callback(data) === false) {
        return;
      }
    }
  }

  /**
   * calls callback on each node's data, in reverse order
   * @param callback 
   * @returns when callback returns false or there is no more element in tree.
   */
  reach(callback: (data: T) => boolean) {
    const iter = this.iterator();
    let data;

    while ((data = iter.prev()) !== null) {
      if (callback(data) === false) {
        return;
      }
    }
  }
}
