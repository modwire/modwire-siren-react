import type { ScheduledTask } from "./task";

export interface InteractionScheduler {
  schedule(delay: number, task: () => void): ScheduledTask;
}
