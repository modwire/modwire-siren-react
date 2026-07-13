import type { InteractionPlacement } from "../domain/interactions/placement";
import type { FrameFamily } from "../domain/vocabulary/frame";
import type { InputModality } from "../domain/vocabulary/modality";
import type { SurfacePurpose } from "../domain/vocabulary/purpose";
import type { ViewportClass } from "../domain/vocabulary/viewport";
import type { SurfacePreference } from "./preference";
import type { InteractionShape } from "./shape";

export class SurfaceContext {
  constructor(
    readonly placement: InteractionPlacement,
    readonly viewport: ViewportClass,
    readonly modality: InputModality,
    readonly shape: InteractionShape,
    readonly frame: FrameFamily,
    readonly preference: SurfacePreference,
    readonly purpose: SurfacePurpose,
  ) {
    Object.freeze(this);
  }
}
