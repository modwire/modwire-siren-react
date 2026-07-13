import { InteractionDensity } from "../domain/vocabulary/density";
import { InputModality } from "../domain/vocabulary/modality";
import type { DensityContext } from "./density-context";
import type { DensityPolicy } from "./density";

export class StandardDensityPolicy implements DensityPolicy {
  select(context: DensityContext): InteractionDensity {
    return context.modality === InputModality.touch
      ? InteractionDensity.touch
      : InteractionDensity.compact;
  }
}
