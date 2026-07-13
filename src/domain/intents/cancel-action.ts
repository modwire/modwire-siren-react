import { IntentKind } from "../vocabulary/intent-kind";
import type { InteractionIdentity } from "../interactions/identity";
import { InteractionIntent } from "./base";
import type { InteractionIntentVisitor } from "./visitor";

export class CancelActionIntent extends InteractionIntent {
  constructor(target: InteractionIdentity) {
    super(IntentKind.cancelAction, target);
    Object.freeze(this);
  }

  accept<Result>(visitor: InteractionIntentVisitor<Result>): Result {
    return visitor.cancelAction(this);
  }
}
