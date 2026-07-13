import type { InteractionIdentity } from "../interactions/identity";
import { FocusIntentionKind } from "../vocabulary/focus-kind";
import { FocusIntention } from "./base";

export class MoveFocus extends FocusIntention {
  constructor(readonly target: InteractionIdentity) {
    super(FocusIntentionKind.move);
    Object.freeze(this);
  }
}
