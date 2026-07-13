import { AccessibilityIdentityFactory } from "../../accessibility/identity";
import type { InteractionIdentity } from "../../domain/interactions/identity";
import type { DomIdentityPolicy } from "../../ports/dom-identity";
import { SurfaceIdentityRole } from "../../domain/vocabulary/surface-role";

export class ChildDomIdentityPolicy implements DomIdentityPolicy {
  static readonly palette = new ChildDomIdentityPolicy(
    SurfaceIdentityRole.paletteResult,
    AccessibilityIdentityFactory.global,
  );

  private constructor(
    private readonly role: string,
    private readonly identities: AccessibilityIdentityFactory,
  ) {
    Object.freeze(this);
  }

  create(identity: InteractionIdentity): string {
    return this.identities.interaction(identity.child(this.role));
  }

  scope(identities: AccessibilityIdentityFactory): DomIdentityPolicy {
    return new ChildDomIdentityPolicy(this.role, identities);
  }
}
