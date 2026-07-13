import { AvailabilityKind } from "../vocabulary/availability-kind";
import { InteractionAvailability } from "./availability";

export class DisabledInteraction extends InteractionAvailability {
  constructor(readonly reason: string) {
    super(AvailabilityKind.disabled, false);
    Object.freeze(this);
  }
}
