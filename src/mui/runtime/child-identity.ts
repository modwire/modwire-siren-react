import type { InteractionIdentity } from "../../domain/interactions/identity";
import type { DomIdentityPolicy } from "../../ports/dom-identity";
import { InteractionDomIdentity } from "./dom-identity";
import { SurfaceIdentityRole } from "../../domain/vocabulary/surface-role";

export class ChildDomIdentityPolicy implements DomIdentityPolicy {
  static readonly palette = new ChildDomIdentityPolicy(
    SurfaceIdentityRole.paletteResult,
  );

  private constructor(private readonly role: string) {
    Object.freeze(this);
  }

  create(identity: InteractionIdentity): string {
    return InteractionDomIdentity.from(identity.child(this.role));
  }
}
