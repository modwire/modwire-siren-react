import { InteractionCollection } from "../interactions/collection";
import type { InteractionIdentity } from "../interactions/identity";
import type { AccessibleName } from "../interactions/name";
import { PresentationKind } from "../vocabulary/presentation-kind";
import { PresentationInteraction } from "./base";
import type { PresentationVisitor } from "./visitor";

export class PresentationGroup extends PresentationInteraction {
  readonly children: InteractionCollection<PresentationInteraction>;

  constructor(
    identity: InteractionIdentity,
    name: AccessibleName,
    order: number,
    children: readonly PresentationInteraction[],
  ) {
    super(PresentationKind.group, identity, name, order);
    this.children = new InteractionCollection(children);
    Object.freeze(this);
  }

  accept<Result>(visitor: PresentationVisitor<Result>): Result {
    return visitor.group(this);
  }
}
