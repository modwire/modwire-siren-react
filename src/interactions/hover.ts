import { CompletedTask } from "../adapters/completed";
import { LeaveInteractionGroup } from "../domain/events/leave-group";
import { OpenInteraction } from "../domain/events/open";
import type { InteractionIdentity } from "../domain/interactions/identity";
import type { InteractionSnapshot } from "../domain/state/snapshot";
import { InputModality } from "../domain/vocabulary/modality";
import type { HoverPolicy } from "../policy/hover";
import type { InteractionObserver } from "../ports/interaction-observer";
import type { InteractionSubscription } from "../ports/interaction-subscription";
import type { InteractionScheduler } from "../ports/scheduler";
import type { ScheduledTask } from "../ports/task";
import type { InteractionController } from "./controller";

export class HoverIntentController implements InteractionObserver {
  private opening: ScheduledTask = new CompletedTask();
  private closing: ScheduledTask = new CompletedTask();
  private disposed = false;
  private readonly subscription: InteractionSubscription;

  constructor(
    private readonly controller: InteractionController,
    private readonly scheduler: InteractionScheduler,
    private readonly policy: HoverPolicy,
  ) {
    this.subscription = controller.subscribe(this);
  }

  enter(origin: InteractionIdentity, target: InteractionIdentity): void {
    if (
      this.disposed ||
      this.controller.snapshot.modality !== InputModality.pointer
    ) {
      return;
    }
    this.opening.cancel();
    this.closing.cancel();
    this.opening = this.scheduler.schedule(this.policy.openDelay, () => {
      void this.controller.dispatch(new OpenInteraction(origin, target));
    });
  }

  leave(target: InteractionIdentity): void {
    if (
      this.disposed ||
      this.controller.snapshot.modality !== InputModality.pointer
    ) {
      return;
    }
    this.opening.cancel();
    this.closing.cancel();
    this.closing = this.scheduler.schedule(this.policy.closeDelay, () => {
      void this.controller.dispatch(new LeaveInteractionGroup(target));
    });
  }

  changed(snapshot: InteractionSnapshot): void {
    if (snapshot.modality === InputModality.pointer) return;
    this.opening.cancel();
    this.closing.cancel();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.opening.cancel();
    this.closing.cancel();
    this.subscription.unsubscribe();
  }
}
