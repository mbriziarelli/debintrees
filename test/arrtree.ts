// Not to be used in production!
// Only here to show how much faster bintrees are in the perf benchmarks.

export class ArrTree<T> {
  private _arr: T[] = [];

  constructor(private _comparator: (_1: T, _2: T) => number) {}

  // returns true if inserted, false if duplicate
  insert(data: T) {
    const elemIndex = this._findIndex(data);
    if (elemIndex >= 0) {
      return false;
    }

    // recover the index data should have been inserted at and splice data in
    this._arr.splice(~elemIndex, 0, data);
    return true;
  }

  // returns true if removed, false if not found
  remove(data: T) {
    const elemIndex = this._findIndex(data);
    if (elemIndex < 0) {
      return false;
    }

    // array remains sorted after element has been removed
    this._arr.splice(elemIndex, 1);
    return true;
  }

  find(data: T) {
    const elemIndex = this._findIndex(data);
    if (elemIndex < 0) {
      return null;
    }

    return this._arr[elemIndex];
  }

  // returns the index if found,
  // and the ones-complement of the index it should be inserted at if not
  // NOTE: the ones-complement will always be < 0
  _findIndex(data: T) {
    let minIndex = 0;
    let maxIndex = this._arr.length - 1;
    let currentIndex;
    let currentElement;

    while (minIndex <= maxIndex) {
      currentIndex = (minIndex + maxIndex) / 2 | 0;
      currentElement = this._arr[currentIndex];

      if (this._comparator(currentElement, data) < 0) {
        minIndex = currentIndex + 1;
      } else if (this._comparator(currentElement, data) > 0) {
        maxIndex = currentIndex - 1;
      } else {
        return currentIndex;
      }
    }

    return ~minIndex;
  }
}
