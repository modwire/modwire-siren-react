import type { UiSubscription } from "@modwire/siren-ui/extensions";
import type { StoreConnection } from "../ports/connection";

export class ActiveConnection implements StoreConnection {
  constructor(private readonly subscription: UiSubscription) {}

  disconnect(): void {
    this.subscription.unsubscribe();
  }
}
