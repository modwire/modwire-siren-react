import type { ScheduledTask } from "../ports/task";

export class CompletedTask implements ScheduledTask {
  cancel(): void {
    Object.freeze(this);
  }
}
