import type { InteractionIdentity } from "../../domain/interactions/identity";
import type { DomIdentityPolicy } from "../../ports/dom-identity";
import { InteractionDomIdentity } from "./dom-identity";

export class StandardDomIdentityPolicy implements DomIdentityPolicy {
  static readonly instance = new StandardDomIdentityPolicy();

  private constructor() {
    Object.freeze(this);
  }

  create(identity: InteractionIdentity): string {
    return InteractionDomIdentity.from(identity);
  }
}
