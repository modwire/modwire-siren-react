import type { InteractionSurface } from "../domain/vocabulary/surface";
import { SurfacePreference } from "./preference";

export class PreferredSurface extends SurfacePreference {
  constructor(readonly surface: InteractionSurface) {
    super();
    Object.freeze(this);
  }

  select(): InteractionSurface {
    return this.surface;
  }
}
