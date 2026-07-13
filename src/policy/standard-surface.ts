import { InteractionPlacement } from "../domain/interactions/placement";
import { FrameFamily } from "../domain/vocabulary/frame";
import { InputModality } from "../domain/vocabulary/modality";
import { SurfacePurpose } from "../domain/vocabulary/purpose";
import { InteractionSurface } from "../domain/vocabulary/surface";
import { ViewportClass } from "../domain/vocabulary/viewport";
import { SirenReactCode } from "../errors/code";
import { SirenReactError } from "../errors/error";
import type { SurfaceContext } from "./surface-context";
import type { SurfacePolicy } from "./surface";

export class StandardSurfacePolicy implements SurfacePolicy {
  select(context: SurfaceContext): InteractionSurface {
    const selected = context.preference.select(this.standard(context));
    if (selected === InteractionSurface.dial && !context.shape.dialCompatible) {
      throw new SirenReactError(
        SirenReactCode.interactionSurface,
        "Interaction tree is incompatible with the command dial",
      );
    }
    return selected;
  }

  private standard(context: SurfaceContext): InteractionSurface {
    if (context.purpose === SurfacePurpose.search) {
      return InteractionSurface.palette;
    }
    if (context.modality === InputModality.touch && context.shape.nested) {
      return InteractionSurface.sheet;
    }
    if (context.shape.dialCompatible) return InteractionSurface.dial;
    if (context.purpose === SurfacePurpose.contextual) {
      return context.shape.nested
        ? InteractionSurface.menu
        : InteractionSurface.contextMenu;
    }
    if (context.viewport === ViewportClass.expanded) {
      if (
        context.frame === FrameFamily.workbench &&
        context.placement === InteractionPlacement.navigation
      ) {
        return InteractionSurface.rail;
      }
      return InteractionSurface.bar;
    }
    return context.modality === InputModality.touch
      ? InteractionSurface.sheet
      : InteractionSurface.menu;
  }
}
