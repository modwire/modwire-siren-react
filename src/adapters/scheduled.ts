import type { ScheduledTask } from "../ports/task";

export class BrowserScheduledTask implements ScheduledTask {
  private active = true;

  constructor(private readonly handle: ReturnType<typeof setTimeout>) {}

  cancel(): void {
    if (!this.active) return;
    this.active = false;
    clearTimeout(this.handle);
  }
}
