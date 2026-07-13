import type { InteractionSurface } from "../domain/vocabulary/surface";
import type { SurfaceContext } from "./surface-context";

export interface SurfacePolicy {
  select(context: SurfaceContext): InteractionSurface;
}
