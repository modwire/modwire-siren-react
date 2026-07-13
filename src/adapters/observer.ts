import type { UiSnapshot } from "@modwire/siren-ui";
import type { UiObserver } from "@modwire/siren-ui/extensions";
import type { SnapshotInput } from "./snapshot";

export class SessionObserver implements UiObserver {
  constructor(private readonly handler: (snapshot: SnapshotInput) => void) {}

  changed(snapshot: UiSnapshot): void {
    this.handler(snapshot);
  }
}
