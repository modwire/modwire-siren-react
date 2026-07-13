import type { FrameFamily } from "../domain/vocabulary/frame";
import type { InputModality } from "../domain/vocabulary/modality";
import type { ViewportClass } from "../domain/vocabulary/viewport";

export class DensityContext {
  constructor(
    readonly frame: FrameFamily,
    readonly modality: InputModality,
    readonly viewport: ViewportClass,
  ) {
    Object.freeze(this);
  }
}
