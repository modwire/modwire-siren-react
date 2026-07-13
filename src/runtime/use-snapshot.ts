import { useSyncExternalStore } from "react";
import type { SnapshotInput } from "../adapters/snapshot";
import { useSirenStore } from "./use-store";

export function useSirenSnapshot(): SnapshotInput {
  const store = useSirenStore();
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}
