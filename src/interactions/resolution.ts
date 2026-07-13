import type { InteractionRecord } from "./record";

export abstract class InteractionResolution {
  abstract readonly present: boolean;
  abstract require(): InteractionRecord;
}
