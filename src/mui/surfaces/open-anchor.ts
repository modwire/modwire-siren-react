import { ContextMenuAnchor } from "./anchor";

export class OpenContextMenuAnchor extends ContextMenuAnchor {
  readonly open = true;

  constructor(
    readonly top: number,
    readonly left: number,
  ) {
    super();
    Object.freeze(this);
  }
}
