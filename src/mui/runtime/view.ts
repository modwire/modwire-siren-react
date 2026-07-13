import type { InteractionSnapshot } from "../../domain/state/snapshot";
import type { MuiInteractionBinding } from "./binding";

export class MuiInteractionView {
  constructor(
    readonly binding: MuiInteractionBinding,
    readonly snapshot: InteractionSnapshot,
  ) {
    Object.freeze(this);
  }
}
