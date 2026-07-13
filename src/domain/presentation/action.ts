import type { InteractionIdentity } from "../interactions/identity";
import type { AccessibleName } from "../interactions/name";
import type { InteractionPlacement } from "../interactions/placement";
import { ActionIntent } from "../vocabulary/intent";
import { PresentationKind } from "../vocabulary/presentation-kind";
import { PresentationInteraction } from "./base";
import type { PresentationVisitor } from "./visitor";

export class PresentationAction extends PresentationInteraction {
  constructor(
    identity: InteractionIdentity,
    name: AccessibleName,
    order: number,
    readonly placement: InteractionPlacement,
    readonly intent: ActionIntent,
    readonly busy: boolean,
  ) {
    super(PresentationKind.action, identity, name, order);
    Object.freeze(this);
  }

  accept<Result>(visitor: PresentationVisitor<Result>): Result {
    return visitor.action(this);
  }
}
