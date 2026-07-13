import { SirenReactCode } from "../../errors/code";
import { SirenReactError } from "../../errors/error";
import { InteractionCollection } from "../interactions/collection";
import type { InteractionIdentity } from "../interactions/identity";

export class InteractionPath extends InteractionCollection<InteractionIdentity> {
  constructor(identities: readonly InteractionIdentity[]) {
    if (identities.length === 0) {
      throw new SirenReactError(
        SirenReactCode.interactionTree,
        "An active interaction path cannot be empty",
      );
    }
    super(identities);
  }
}
