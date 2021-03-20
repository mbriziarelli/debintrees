export class Node<T> {
  left: Node<T> | null = null;
  right: Node<T> | null = null;

  constructor(public data: T) {}

  get_child(dir: boolean) {
    return dir ? this.right : this.left;
  }

  set_child(dir: boolean, val: Node<T>) {
    if (dir) {
      this.right = val;
    } else {
      this.left = val;
    }
  }
}
