import { IntentKind } from "../vocabulary/intent-kind";
import type { InteractionIdentity } from "../interactions/identity";
import { InteractionIntent } from "./base";
import { InteractionValue } from "./value";
import type { InteractionIntentVisitor } from "./visitor";

export class SetFieldIntent extends InteractionIntent {
  readonly value: InteractionValue;

  constructor(
    target: InteractionIdentity,
    readonly field: string,
    value: unknown,
  ) {
    super(IntentKind.setField, target);
    this.value = InteractionValue.from(value);
    Object.freeze(this);
  }

  accept<Result>(visitor: InteractionIntentVisitor<Result>): Result {
    return visitor.setField(this);
  }
}
