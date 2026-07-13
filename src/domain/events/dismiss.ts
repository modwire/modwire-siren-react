import { InteractionEventKind } from "../vocabulary/event-kind";
import { InteractionEvent } from "./base";
import type { InteractionEventVisitor } from "./visitor";

export class DismissInteraction extends InteractionEvent {
  constructor() {
    super(InteractionEventKind.dismiss);
    Object.freeze(this);
  }

  accept<Result>(visitor: InteractionEventVisitor<Result>): Result {
    return visitor.dismiss(this);
  }
}
