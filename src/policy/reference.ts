import type { SirenEquality } from "../domain/equality";

export class ReferenceEquality<Value> implements SirenEquality<Value> {
  equal(current: Value, candidate: Value): boolean {
    return Object.is(current, candidate);
  }
}
