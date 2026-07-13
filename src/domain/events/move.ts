import type { InteractionDirection } from "../vocabulary/direction";
import { InteractionEventKind } from "../vocabulary/event-kind";
import { InteractionEvent } from "./base";
import type { InteractionEventVisitor } from "./visitor";

export class MoveInteraction extends InteractionEvent {
  constructor(readonly direction: InteractionDirection) {
    super(InteractionEventKind.move);
    Object.freeze(this);
  }

  accept<Result>(visitor: InteractionEventVisitor<Result>): Result {
    return visitor.move(this);
  }
}
