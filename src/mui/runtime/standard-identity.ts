import { AccessibilityIdentityFactory } from "../../accessibility/identity";
import type { InteractionIdentity } from "../../domain/interactions/identity";
import type { DomIdentityPolicy } from "../../ports/dom-identity";

export class StandardDomIdentityPolicy implements DomIdentityPolicy {
  static readonly instance = new StandardDomIdentityPolicy(
    AccessibilityIdentityFactory.global,
  );

  private constructor(
    private readonly identities: AccessibilityIdentityFactory,
  ) {
    Object.freeze(this);
  }

  create(identity: InteractionIdentity): string {
    return this.identities.interaction(identity);
  }

  scope(identities: AccessibilityIdentityFactory): DomIdentityPolicy {
    return new StandardDomIdentityPolicy(identities);
  }
}
