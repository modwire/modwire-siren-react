import type { InteractionSubscription } from "../ports/interaction-subscription";

export class ControllerSubscription implements InteractionSubscription {
  private active = true;

  constructor(private readonly unsubscribeAction: () => void) {}

  unsubscribe(): void {
    if (!this.active) return;
    this.active = false;
    this.unsubscribeAction();
  }
}
