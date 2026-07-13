import type { InteractionIdentity } from "../domain/interactions/identity";
import { AccessibilityRole } from "../domain/vocabulary/accessibility-role";

export class AccessibilityIdentityFactory {
  create(identity: InteractionIdentity): string {
    return `siren-${encodeURIComponent(identity.value)}-${AccessibilityRole.widget}`;
  }
}
