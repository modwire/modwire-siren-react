import type { InteractionTree } from "../interactions/tree";
import { InteractionStateKind } from "../vocabulary/state-kind";
import { InteractionState } from "./base";

export class ClosedInteractionState extends InteractionState {
  constructor(tree: InteractionTree) {
    super(InteractionStateKind.closed, tree);
    Object.freeze(this);
  }
}
