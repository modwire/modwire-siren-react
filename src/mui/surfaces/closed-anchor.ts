import { ContextMenuAnchor } from "./anchor";

export class ClosedContextMenuAnchor extends ContextMenuAnchor {
  readonly open = false;
  readonly top = 0;
  readonly left = 0;

  constructor() {
    super();
    Object.freeze(this);
  }
}
