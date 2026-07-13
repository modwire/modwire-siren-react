import type { InteractionPlacement } from "../domain/interactions/placement";
import type { InteractionSurface } from "../domain/vocabulary/surface";
import type { SurfacePurpose } from "../domain/vocabulary/purpose";
import { InteractionShape } from "../policy/shape";
import { SurfaceContext } from "../policy/surface-context";
import type { FrameView } from "./view";

export class FrameSurfaceSelection {
  select(
    view: FrameView,
    placement: InteractionPlacement,
    purpose: SurfacePurpose,
  ): InteractionSurface {
    return view.options.surfaces.select(
      new SurfaceContext(
        placement,
        view.viewport,
        view.modality,
        InteractionShape.from(view.interactions),
        view.family,
        view.options.surfacePreference,
        purpose,
      ),
    );
  }
}
