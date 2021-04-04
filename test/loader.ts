const fs = require("fs");
const _ = require("underscore");

export function load(filename: string) {
  const ret: number[] = [];
  const nums: string[] = fs.readFileSync(filename, "ascii").split("\n");
  nums.forEach(function (s) {
    if (s.length) {
      ret.push(+s);
    }
  });

  return ret;
}

export function get_inserts(tests) {
  return _.select(tests, function (n) {
    return n > 0;
  });
}

export function get_removes(tests) {
  return _.select(tests, function (n) {
    return n < 0;
  });
}

export function new_tree(treeType) {
  return new treeType(function (a, b) {
    return a - b;
  });
}

export function build_tree(treeType, inserts) {
  const tree = new_tree(treeType);

  inserts.forEach(function (n) {
    tree.insert(n);
  });

  return tree;
}

export function load_tree(treeType, filename: string) {
  const tests = load(filename);
  const inserts = get_inserts(tests);

  return build_tree(treeType, inserts);
}
