import type { ChoiceInteraction } from "./choice";
import type { CommandInteraction } from "./command";
import type { DestinationInteraction } from "./destination";
import type { InteractionDivider } from "./divider";
import type { InteractionGroup } from "./group";
import type { ToggleInteraction } from "./toggle";

export interface InteractionVisitor<Result> {
  command(interaction: CommandInteraction): Result;
  destination(interaction: DestinationInteraction): Result;
  toggle(interaction: ToggleInteraction): Result;
  choice(interaction: ChoiceInteraction): Result;
  group(interaction: InteractionGroup): Result;
  divider(interaction: InteractionDivider): Result;
}
