import { AvailabilityKind } from "../vocabulary/availability-kind";
import { InteractionAvailability } from "./availability";

export class ContainerInteraction extends InteractionAvailability {
  constructor() {
    super(AvailabilityKind.container, false);
    Object.freeze(this);
  }
}
