import type { InteractionSnapshot } from "../domain/state/snapshot";

export interface InteractionObserver {
  changed(snapshot: InteractionSnapshot): void;
}
