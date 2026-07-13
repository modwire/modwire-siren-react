import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";
import type { SnapshotInput } from "../adapters/snapshot";
import type { SirenEquality } from "../domain/equality";
import type { SirenSelector } from "../domain/selector";
import { useSirenStore } from "./use-store";

export function useSirenSelector<Value>(
  selector: SirenSelector<Value>,
  equality: SirenEquality<Value>,
): Value {
  const store = useSirenStore();
  return useSyncExternalStoreWithSelector<SnapshotInput, Value>(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
    (snapshot) => selector.select(snapshot),
    (current, candidate) => equality.equal(current, candidate),
  );
}
