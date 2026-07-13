import type { InteractionTree } from "../domain/interactions/tree";
import type { InteractionDensity } from "../domain/vocabulary/density";
import type { FrameFamily } from "../domain/vocabulary/frame";
import type { InputModality } from "../domain/vocabulary/modality";
import type { ViewportClass } from "../domain/vocabulary/viewport";
import type { PresentationSnapshot } from "../domain/presentation/snapshot";
import type { SirenReactOptions } from "../runtime/options";
import type { WidgetContext } from "../widgets/context";

export class FrameView {
  constructor(
    readonly family: FrameFamily,
    readonly presentation: PresentationSnapshot,
    readonly interactions: InteractionTree,
    readonly widgets: WidgetContext,
    readonly viewport: ViewportClass,
    readonly modality: InputModality,
    readonly density: InteractionDensity,
    readonly options: SirenReactOptions,
  ) {
    Object.freeze(this);
  }
}
