import type { InteractionIdentity } from "../interactions/identity";
import type { AccessibleName } from "../interactions/name";
import { PresentationKind } from "../vocabulary/presentation-kind";
import { PresentationInteraction } from "./base";
import type { PresentationVisitor } from "./visitor";

export class PresentationRelation extends PresentationInteraction {
  constructor(
    identity: InteractionIdentity,
    name: AccessibleName,
    order: number,
    readonly relation: string,
    readonly busy: boolean,
  ) {
    super(PresentationKind.relation, identity, name, order);
    Object.freeze(this);
  }

  accept<Result>(visitor: PresentationVisitor<Result>): Result {
    return visitor.relation(this);
  }
}
