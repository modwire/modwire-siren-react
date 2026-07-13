import { FocusIntentionKind } from "../vocabulary/focus-kind";
import { FocusIntention } from "./base";

export class RetainFocus extends FocusIntention {
  constructor() {
    super(FocusIntentionKind.retain);
    Object.freeze(this);
  }
}
