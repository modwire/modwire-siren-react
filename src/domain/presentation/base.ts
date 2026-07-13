import type { InteractionIdentity } from "../interactions/identity";
import type { AccessibleName } from "../interactions/name";
import type { PresentationVisitor } from "./visitor";
import { SirenReactCode } from "../../errors/code";
import { SirenReactError } from "../../errors/error";

export abstract class PresentationInteraction {
  protected constructor(
    readonly kind: string,
    readonly identity: InteractionIdentity,
    readonly name: AccessibleName,
    readonly order: number,
  ) {
    if (!Number.isFinite(order)) {
      throw new SirenReactError(
        SirenReactCode.interactionOrder,
        "Interaction order must be finite",
      );
    }
  }

  abstract accept<Result>(visitor: PresentationVisitor<Result>): Result;
}
