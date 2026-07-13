import type { SirenReactIssues } from "../../errors/issues";
import { AvailabilityKind } from "../vocabulary/availability-kind";
import { InteractionAvailability } from "./availability";

export class FailedInteraction extends InteractionAvailability {
  constructor(readonly issues: SirenReactIssues) {
    super(AvailabilityKind.failed, false);
    Object.freeze(this);
  }
}
