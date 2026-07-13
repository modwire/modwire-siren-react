import type { AccessibilityIdentityFactory } from "../accessibility/identity";
import type { InteractionIdentity } from "../domain/interactions/identity";

export interface DomIdentityPolicy {
  create(identity: InteractionIdentity): string;
  scope(identities: AccessibilityIdentityFactory): DomIdentityPolicy;
}
