import { InteractionEventKind } from "../vocabulary/event-kind";
import type { InputModality } from "../vocabulary/modality";
import { InteractionEvent } from "./base";
import type { InteractionEventVisitor } from "./visitor";

export class ChangeInputModality extends InteractionEvent {
  constructor(readonly modality: InputModality) {
    super(InteractionEventKind.changeModality);
    Object.freeze(this);
  }

  accept<Result>(visitor: InteractionEventVisitor<Result>): Result {
    return visitor.changeModality(this);
  }
}
