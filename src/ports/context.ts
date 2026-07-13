import type { UiSessionStore } from "../adapters/store";

export interface SessionContext {
  requireStore(): UiSessionStore;
}
