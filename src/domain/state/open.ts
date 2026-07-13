import type { InteractionIdentity } from "../interactions/identity";
import type { InteractionTree } from "../interactions/tree";
import { InteractionStateKind } from "../vocabulary/state-kind";
import { InteractionState } from "./base";
import type { InteractionPath } from "./path";

export class OpenInteractionState extends InteractionState {
  constructor(
    tree: InteractionTree,
    readonly active: InteractionPath,
    readonly origin: InteractionIdentity,
  ) {
    super(InteractionStateKind.open, tree);
    Object.freeze(this);
  }
}
