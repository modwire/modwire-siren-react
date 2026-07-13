import type { InteractionDensity } from "../domain/vocabulary/density";
import type { DensityContext } from "./density-context";

export interface DensityPolicy {
  select(context: DensityContext): InteractionDensity;
}
