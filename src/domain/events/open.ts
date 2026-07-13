import type { InteractionIdentity } from "../interactions/identity";
import { InteractionEventKind } from "../vocabulary/event-kind";
import { InteractionEvent } from "./base";
import type { InteractionEventVisitor } from "./visitor";

export class OpenInteraction extends InteractionEvent {
  constructor(
    readonly origin: InteractionIdentity,
    readonly target: InteractionIdentity,
  ) {
    super(InteractionEventKind.open);
    Object.freeze(this);
  }

  accept<Result>(visitor: InteractionEventVisitor<Result>): Result {
    return visitor.open(this);
  }
}
