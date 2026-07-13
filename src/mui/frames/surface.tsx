import type { ReactNode } from "react";

import type { InteractionPlacement } from "../../domain/interactions/placement";
import type { SurfacePurpose } from "../../domain/vocabulary/purpose";
import { InteractionSurface } from "../../domain/vocabulary/surface";
import { FrameSurfaceSelection } from "../../frames/surface-selection";
import type { FrameView } from "../../frames/view";
import { CommandBar } from "../surfaces/bar";
import { CommandDial } from "../surfaces/dial";
import { CommandMenu } from "../surfaces/menu";
import { CommandPalette } from "../surfaces/palette";
import { CommandRail } from "../surfaces/rail";
import { CommandSheet } from "../surfaces/sheet";
import { SirenReactCode } from "../../errors/code";
import { SirenReactError } from "../../errors/error";

export interface FrameSurfaceProps {
  readonly view: FrameView;
  readonly placement: InteractionPlacement;
  readonly purpose: SurfacePurpose;
  readonly label: string;
}

export function FrameSurface({
  view,
  placement,
  purpose,
  label,
}: FrameSurfaceProps): ReactNode {
  const surface = new FrameSurfaceSelection().select(view, placement, purpose);
  const props = {
    tree: view.interactions,
    label,
    locale: view.options.locale,
    icons: view.options.icons,
    theme: view.options.theme,
  };
  if (surface === InteractionSurface.rail) return <CommandRail {...props} />;
  if (surface === InteractionSurface.bar) return <CommandBar {...props} />;
  if (surface === InteractionSurface.palette) {
    return <CommandPalette {...props} />;
  }
  if (surface === InteractionSurface.sheet) return <CommandSheet {...props} />;
  if (surface === InteractionSurface.dial) return <CommandDial {...props} />;
  if (surface === InteractionSurface.menu) return <CommandMenu {...props} />;
  throw new SirenReactError(
    SirenReactCode.interactionSurface,
    "Selected interaction surface requires a semantic target",
  );
}
