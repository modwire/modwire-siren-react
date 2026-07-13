import type { InteractionTree } from "../interactions/tree";
import { InteractionEventKind } from "../vocabulary/event-kind";
import { InteractionEvent } from "./base";
import type { InteractionEventVisitor } from "./visitor";

export class ReplaceInteractionTree extends InteractionEvent {
  constructor(readonly tree: InteractionTree) {
    super(InteractionEventKind.replaceTree);
    Object.freeze(this);
  }

  accept<Result>(visitor: InteractionEventVisitor<Result>): Result {
    return visitor.replaceTree(this);
  }
}
