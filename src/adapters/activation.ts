import type { InteractionIntent } from "../domain/intents/base";
import type { InteractionActivator } from "../ports/activator";
import type { CommandFactory } from "./command";
import type { UiDispatcher } from "./dispatcher";

export class UiInteractionActivator implements InteractionActivator {
  constructor(
    private readonly commands: CommandFactory,
    private readonly dispatcher: UiDispatcher,
  ) {}

  async activate(intent: InteractionIntent): Promise<void> {
    await this.dispatcher.dispatch(this.commands.create(intent));
  }
}
