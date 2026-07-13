import { AvailabilityKind } from "../vocabulary/availability-kind";
import { InteractionAvailability } from "./availability";

export class PendingInteraction extends InteractionAvailability {
  constructor() {
    super(AvailabilityKind.pending, false);
    Object.freeze(this);
  }
}
