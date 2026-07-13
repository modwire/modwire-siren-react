import type { InteractionSurface } from "../domain/vocabulary/surface";

export abstract class SurfacePreference {
  abstract select(fallback: InteractionSurface): InteractionSurface;
}
