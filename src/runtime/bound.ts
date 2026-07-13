import type { UiSessionStore } from "../adapters/store";
import type { SessionContext } from "../ports/context";

export class BoundSessionContext implements SessionContext {
  constructor(private readonly store: UiSessionStore) {}

  requireStore(): UiSessionStore {
    return this.store;
  }
}
