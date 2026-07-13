import { InteractionEventKind } from "../vocabulary/event-kind";
import { InteractionEvent } from "./base";
import type { InteractionEventVisitor } from "./visitor";

export class SearchInteractions extends InteractionEvent {
  constructor(readonly query: string) {
    super(InteractionEventKind.search);
    Object.freeze(this);
  }

  accept<Result>(visitor: InteractionEventVisitor<Result>): Result {
    return visitor.search(this);
  }
}
