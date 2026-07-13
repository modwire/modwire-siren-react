import type { InteractionIdentity } from "../domain/interactions/identity";
import { AccessibilityRole } from "../domain/vocabulary/accessibility-role";

export class AccessibilityIdentityFactory {
  create(identity: InteractionIdentity): string {
    return `${this.interaction(identity)}-${AccessibilityRole.widget}`;
  }

  interaction(identity: InteractionIdentity): string {
    return `siren-${encodeURIComponent(identity.value)}`;
  }
}
