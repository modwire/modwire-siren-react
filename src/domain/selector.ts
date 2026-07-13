import type { SnapshotInput } from "../adapters/snapshot";

export interface SirenSelector<Value> {
  select(snapshot: SnapshotInput): Value;
}
