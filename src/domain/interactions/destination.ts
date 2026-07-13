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

export class DestinationInteraction extends InteractionNode {
  constructor(
    identity: InteractionIdentity,
    name: AccessibleName,
    icon: InteractionIcon,
    availability: InteractionAvailability,
    shortcut: InteractionShortcut,
    placement: InteractionPlacement,
    readonly relation: string,
    readonly intent: InteractionIntent,
  ) {
    super(
      InteractionKind.destination,
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
    return visitor.destination(this);
  }
}
