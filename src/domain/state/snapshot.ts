import type { SirenReactIssues } from "../../errors/issues";
import type { FocusIntention } from "../focus/base";
import type { InputModality } from "../vocabulary/modality";
import type { InteractionState } from "./base";

export class InteractionSnapshot {
  constructor(
    readonly state: InteractionState,
    readonly modality: InputModality,
    readonly focus: FocusIntention,
    readonly issues: SirenReactIssues,
  ) {
    Object.freeze(this);
  }
}
