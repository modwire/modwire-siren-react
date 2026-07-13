import { IntentKind } from "../vocabulary/intent-kind";
import type { InteractionIdentity } from "../interactions/identity";
import { InteractionIntent } from "./base";
import type { InteractionIntentVisitor } from "./visitor";

export class RequestActionIntent extends InteractionIntent {
  constructor(target: InteractionIdentity) {
    super(IntentKind.requestAction, target);
    Object.freeze(this);
  }

  accept<Result>(visitor: InteractionIntentVisitor<Result>): Result {
    return visitor.requestAction(this);
  }
}
