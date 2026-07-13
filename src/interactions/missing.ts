import { SirenReactCode } from "../errors/code";
import { SirenReactError } from "../errors/error";
import { SirenReactIssue } from "../errors/issue";
import type { InteractionIdentity } from "../domain/interactions/identity";
import type { InteractionRecord } from "./record";
import { InteractionResolution } from "./resolution";

export class MissingInteraction extends InteractionResolution {
  readonly present = false;

  constructor(private readonly identity: InteractionIdentity) {
    super();
    Object.freeze(this);
  }

  require(): InteractionRecord {
    throw new SirenReactError(
      SirenReactCode.interactionMissing,
      "Interaction identity is unavailable",
      [
        new SirenReactIssue(
          SirenReactCode.interactionMissing,
          this.identity.value,
          "Interaction identity is unavailable",
        ),
      ],
    );
  }
}
