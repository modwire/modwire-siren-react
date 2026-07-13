import type { InteractionIdentity } from "../interactions/identity";
import { InteractionEventKind } from "../vocabulary/event-kind";
import { InteractionEvent } from "./base";
import type { InteractionEventVisitor } from "./visitor";

export class EnterInteractionGroup extends InteractionEvent {
  constructor(readonly target: InteractionIdentity) {
    super(InteractionEventKind.enterGroup);
    Object.freeze(this);
  }

  accept<Result>(visitor: InteractionEventVisitor<Result>): Result {
    return visitor.enterGroup(this);
  }
}
