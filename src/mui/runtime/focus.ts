import { MoveFocus } from "../../domain/focus/move";
import { RestoreFocus } from "../../domain/focus/restore";
import type { FocusIntention } from "../../domain/focus/base";
import type { DomIdentityPolicy } from "../../ports/dom-identity";

export class DomFocusAdapter {
  apply(intention: FocusIntention, identities: DomIdentityPolicy): void {
    if (intention instanceof MoveFocus)
      this.focus(intention.target, identities);
    if (intention instanceof RestoreFocus) {
      this.focus(intention.target, identities);
    }
  }

  private focus(
    identity: MoveFocus["target"],
    identities: DomIdentityPolicy,
  ): void {
    document.getElementById(identities.create(identity))?.focus();
  }
}
