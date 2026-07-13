import { IntentKind } from "../vocabulary/intent-kind";
import type { InteractionIdentity } from "../interactions/identity";
import { InteractionIntent } from "./base";
import type { InteractionIntentVisitor } from "./visitor";

export class ConfirmActionIntent extends InteractionIntent {
  constructor(
    target: InteractionIdentity,
    readonly acknowledgement: string,
  ) {
    super(IntentKind.confirmAction, target);
    Object.freeze(this);
  }

  accept<Result>(visitor: InteractionIntentVisitor<Result>): Result {
    return visitor.confirmAction(this);
  }
}
