export class InteractionCollection<Value> implements Iterable<Value> {
  readonly values: readonly Value[];

  constructor(values: readonly Value[]) {
    this.values = Object.freeze([...values]);
    Object.freeze(this);
  }

  get length(): number {
    return this.values.length;
  }

  at(index: number): Value {
    let position = 0;
    for (const value of this.values) {
      if (position === index) return value;
      position += 1;
    }
    throw new RangeError(`Collection index is out of range: ${String(index)}`);
  }

  [Symbol.iterator](): Iterator<Value> {
    return this.values[Symbol.iterator]();
  }
}
