import type { InteractionEventVisitor } from "./visitor";

export abstract class InteractionEvent {
  protected constructor(readonly kind: string) {}

  abstract accept<Result>(visitor: InteractionEventVisitor<Result>): Result;
}
