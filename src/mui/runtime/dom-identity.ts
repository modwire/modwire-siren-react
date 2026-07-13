import type { InteractionIdentity } from "../../domain/interactions/identity";
import { AccessibilityIdentityFactory } from "../../accessibility/identity";

export class InteractionDomIdentity {
  static from(identity: InteractionIdentity): string {
    return new AccessibilityIdentityFactory().interaction(identity);
  }
}
