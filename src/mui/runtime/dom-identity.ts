import type { InteractionIdentity } from "../../domain/interactions/identity";

export class InteractionDomIdentity {
  static from(identity: InteractionIdentity): string {
    return `siren-${encodeURIComponent(identity.value)}`;
  }
}
