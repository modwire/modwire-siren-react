export interface SirenEquality<Value> {
  equal(current: Value, candidate: Value): boolean;
}
