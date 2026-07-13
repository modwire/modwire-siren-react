import type { InteractionIdentity } from "../interactions/identity";
import type { InteractionTree } from "../interactions/tree";
import { InteractionStateKind } from "../vocabulary/state-kind";
import { InteractionState } from "./base";

export class ActivatingInteractionState extends InteractionState {
  constructor(
    tree: InteractionTree,
    readonly selected: InteractionIdentity,
    readonly origin: InteractionIdentity,
  ) {
    super(InteractionStateKind.activating, tree);
    Object.freeze(this);
  }
}
