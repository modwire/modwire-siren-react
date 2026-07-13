import type { InteractionIdentity } from "../interactions/identity";
import { InteractionCollection } from "../interactions/collection";
import type { InteractionTree } from "../interactions/tree";
import { InteractionStateKind } from "../vocabulary/state-kind";
import { InteractionState } from "./base";
import type { InteractionPath } from "./path";

export class SearchingInteractionState extends InteractionState {
  readonly results: InteractionCollection<InteractionIdentity>;

  constructor(
    tree: InteractionTree,
    readonly active: InteractionPath,
    readonly origin: InteractionIdentity,
    readonly query: string,
    results: readonly InteractionIdentity[],
  ) {
    super(InteractionStateKind.searching, tree);
    this.results = new InteractionCollection(results);
    Object.freeze(this);
  }
}
