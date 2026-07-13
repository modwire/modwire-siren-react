import type { SirenReactIssue } from "./issue";

export class SirenReactIssues implements Iterable<SirenReactIssue> {
  readonly values: readonly SirenReactIssue[];

  constructor(values: readonly SirenReactIssue[]) {
    this.values = Object.freeze([...values]);
    Object.freeze(this);
  }

  get length(): number {
    return this.values.length;
  }

  [Symbol.iterator](): Iterator<SirenReactIssue> {
    return this.values[Symbol.iterator]();
  }

  static empty(): SirenReactIssues {
    return new SirenReactIssues([]);
  }
}
