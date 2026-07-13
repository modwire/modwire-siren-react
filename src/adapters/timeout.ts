import type { InteractionScheduler } from "../ports/scheduler";
import type { ScheduledTask } from "../ports/task";
import { BrowserScheduledTask } from "./scheduled";

export class BrowserInteractionScheduler implements InteractionScheduler {
  schedule(delay: number, task: () => void): ScheduledTask {
    return new BrowserScheduledTask(setTimeout(task, delay));
  }
}
