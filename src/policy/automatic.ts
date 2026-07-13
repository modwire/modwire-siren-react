import type { InteractionSurface } from "../domain/vocabulary/surface";
import { SurfacePreference } from "./preference";

export class AutomaticSurfacePreference extends SurfacePreference {
  select(fallback: InteractionSurface): InteractionSurface {
    return fallback;
  }
}
