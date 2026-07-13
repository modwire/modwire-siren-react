import type { InteractionIntentVisitor } from "./visitor";
import type { InteractionIdentity } from "../interactions/identity";

export abstract class InteractionIntent {
  protected constructor(
    readonly kind: string,
    readonly target: InteractionIdentity,
  ) {}

  abstract accept<Result>(visitor: InteractionIntentVisitor<Result>): Result;
}
