import type { InteractionTree } from "../interactions/tree";

export abstract class InteractionState {
  protected constructor(
    readonly kind: string,
    readonly tree: InteractionTree,
  ) {}
}
