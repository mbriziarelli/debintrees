import { RBTree } from "../rbtree.ts";

// create a new tree, pass in the compare function
const tree = new RBTree<number>(function (a: number, b: number) {
  return a - b;
});

// do some inserts
tree.insert(1);
tree.insert(2);
tree.insert(3);
tree.remove(2);

// get smallest item
console.log(tree.min());
