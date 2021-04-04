// generates a test case to STDOUT

const noDups = false; // set to true if you don't want duplicate inserts
const numInserts = 100000;
const nums: number[] = [];
const added: number[] = [];
const ahash: Record<number, boolean> = {};
const randInt = (start: number, end: number) =>
  Math.floor(Math.random() * (end - start + 1)) + start;
const getNodeToRemove = () => added.splice(randInt(0, added.length - 1), 1)[0];

// Populate nums with numbers
for (let i = 0; i < numInserts; i++) {
  let n;

  do {
    n = randInt(1, 1000000000);
  } while (noDups && ahash[n]);

  added.push(n);
  nums.push(n);
  if (noDups) {
    ahash[n] = true;
  }

  if (Math.random() < .3) {
    nums.push(-getNodeToRemove());
  }
}

// remove the rest, randomly
while (added.length > 0) {
  nums.push(-getNodeToRemove());
}

console.log(nums.join("\n"));
