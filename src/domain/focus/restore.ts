import type { InteractionIdentity } from "../interactions/identity";
import { FocusIntentionKind } from "../vocabulary/focus-kind";
import { FocusIntention } from "./base";

export class RestoreFocus extends FocusIntention {
  constructor(readonly target: InteractionIdentity) {
    super(FocusIntentionKind.restore);
    Object.freeze(this);
  }
}
