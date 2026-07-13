import { IntentKind } from "../vocabulary/intent-kind";
import type { InteractionIdentity } from "../interactions/identity";
import { InteractionIntent } from "./base";
import type { InteractionIntentVisitor } from "./visitor";

export class ResetActionIntent extends InteractionIntent {
  constructor(target: InteractionIdentity) {
    super(IntentKind.resetAction, target);
    Object.freeze(this);
  }

  accept<Result>(visitor: InteractionIntentVisitor<Result>): Result {
    return visitor.resetAction(this);
  }
}
