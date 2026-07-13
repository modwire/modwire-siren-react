import type { InteractionNode } from "../domain/interactions/base";
import type { InteractionIdentity } from "../domain/interactions/identity";
import type { InteractionPath } from "../domain/state/path";

export class InteractionRecord {
  constructor(
    readonly node: InteractionNode,
    readonly path: InteractionPath,
    readonly parent: InteractionIdentity,
  ) {
    Object.freeze(this);
  }
}
