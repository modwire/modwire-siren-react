import type { InteractionIdentity } from "../domain/interactions/identity";
import { AccessibilityRole } from "../domain/vocabulary/accessibility-role";

export class AccessibilityIdentityFactory {
  static readonly global = new AccessibilityIdentityFactory("global");

  private constructor(private readonly scope: string) {
    Object.freeze(this);
  }

  static scoped(scope: string): AccessibilityIdentityFactory {
    return new AccessibilityIdentityFactory(scope);
  }

  create(identity: InteractionIdentity): string {
    return `${this.interaction(identity)}-${AccessibilityRole.widget}`;
  }

  interaction(identity: InteractionIdentity): string {
    return `siren-${encodeURIComponent(this.scope)}-${encodeURIComponent(identity.value)}`;
  }
}
