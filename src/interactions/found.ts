import type { InteractionRecord } from "./record";
import { InteractionResolution } from "./resolution";

export class FoundInteraction extends InteractionResolution {
  readonly present = true;

  constructor(private readonly record: InteractionRecord) {
    super();
    Object.freeze(this);
  }

  require(): InteractionRecord {
    return this.record;
  }
}
