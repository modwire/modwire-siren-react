import { AvailabilityKind } from "../vocabulary/availability-kind";
import { InteractionAvailability } from "./availability";

export class AvailableInteraction extends InteractionAvailability {
  constructor() {
    super(AvailabilityKind.available, true);
    Object.freeze(this);
  }
}
