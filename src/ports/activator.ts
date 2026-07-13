import type { InteractionIntent } from "../domain/intents/base";

export interface InteractionActivator {
  activate(intent: InteractionIntent): Promise<void>;
}
