import type { InteractionIdentity } from "../domain/interactions/identity";

export class AccessibilityIdentityFactory {
  create(identity: InteractionIdentity): string {
    return `siren-${encodeURIComponent(identity.value)}`;
  }
}
