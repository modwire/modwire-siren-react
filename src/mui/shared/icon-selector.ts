import type { InteractionNode } from "../../domain/interactions/base";
import { ChoiceInteraction } from "../../domain/interactions/choice";
import { DestinationInteraction } from "../../domain/interactions/destination";
import { InteractionGroup } from "../../domain/interactions/group";
import { IconReference } from "../../domain/interactions/icon-reference";
import { ToggleInteraction } from "../../domain/interactions/toggle";
import { StandardIconName } from "../../domain/vocabulary/icon-name";

export class InteractionIconSelector {
  select(node: InteractionNode): IconReference {
    if (node instanceof DestinationInteraction) {
      return new IconReference(StandardIconName.destination);
    }
    if (node instanceof ToggleInteraction) {
      return new IconReference(StandardIconName.toggle);
    }
    if (node instanceof ChoiceInteraction) {
      return new IconReference(StandardIconName.choice);
    }
    if (node instanceof InteractionGroup) {
      return new IconReference(StandardIconName.group);
    }
    return new IconReference(StandardIconName.command);
  }
}
