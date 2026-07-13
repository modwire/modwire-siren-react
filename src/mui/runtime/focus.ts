import { MoveFocus } from "../../domain/focus/move";
import { RestoreFocus } from "../../domain/focus/restore";
import type { FocusIntention } from "../../domain/focus/base";
import { InteractionDomIdentity } from "./dom-identity";

export class DomFocusAdapter {
  apply(intention: FocusIntention): void {
    if (intention instanceof MoveFocus) this.focus(intention.target);
    if (intention instanceof RestoreFocus) this.focus(intention.target);
  }

  private focus(identity: MoveFocus["target"]): void {
    document.getElementById(InteractionDomIdentity.from(identity))?.focus();
  }
}
