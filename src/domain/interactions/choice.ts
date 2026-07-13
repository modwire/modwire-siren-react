import type { InteractionIntent } from "../intents/base";
import { InteractionKind } from "../vocabulary/interaction-kind";
import type { InteractionAvailability } from "./availability";
import { InteractionNode } from "./base";
import type { InteractionIcon } from "./icon";
import type { InteractionIdentity } from "./identity";
import type { AccessibleName } from "./name";
import type { InteractionPlacement } from "./placement";
import type { InteractionShortcut } from "./shortcut";
import type { InteractionVisitor } from "./visitor";

export class ChoiceInteraction extends InteractionNode {
  constructor(
    identity: InteractionIdentity,
    name: AccessibleName,
    icon: InteractionIcon,
    availability: InteractionAvailability,
    shortcut: InteractionShortcut,
    placement: InteractionPlacement,
    readonly choiceGroup: string,
    readonly selected: boolean,
    readonly intent: InteractionIntent,
  ) {
    super(
      InteractionKind.choice,
      identity,
      name,
      icon,
      availability,
      shortcut,
      placement,
    );
    Object.freeze(this);
  }

  accept<Result>(visitor: InteractionVisitor<Result>): Result {
    return visitor.choice(this);
  }
}
