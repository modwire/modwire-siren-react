import { useMemo, useSyncExternalStore } from "react";

import { AccessibilityIdentityFactory } from "../accessibility/identity";
import { UiInteractionActivator } from "../adapters/activation";
import { CommandFactory } from "../adapters/command";
import { SnapshotAdapter } from "../adapters/projection";
import type { FrameFamily } from "../domain/vocabulary/frame";
import { InteractionProjector } from "../interactions/projector";
import { DensityContext } from "../policy/density-context";
import type { SirenReactOptions } from "../runtime/options";
import { useSirenDispatch } from "../runtime/use-dispatch";
import { useSirenSnapshot } from "../runtime/use-snapshot";
import { WidgetContext } from "../widgets/context";
import { FrameView } from "./view";

export function useFrameView(
  family: FrameFamily,
  options: SirenReactOptions,
): FrameView {
  const snapshot = useSirenSnapshot();
  const dispatcher = useSirenDispatch();
  const viewport = useSyncExternalStore(
    options.viewport.subscribe,
    options.viewport.getSnapshot,
    options.viewport.getServerSnapshot,
  );
  const modality = useSyncExternalStore(
    options.modality.subscribe,
    options.modality.getSnapshot,
    options.modality.getServerSnapshot,
  );
  const presentation = useMemo(
    () => new SnapshotAdapter().adapt(snapshot),
    [snapshot],
  );
  const interactions = useMemo(
    () => new InteractionProjector().project(presentation),
    [presentation],
  );
  const density = options.density.select(
    new DensityContext(family, modality, viewport),
  );
  const activator = useMemo(
    () => new UiInteractionActivator(new CommandFactory(), dispatcher),
    [dispatcher],
  );
  const context = useMemo(
    () =>
      new WidgetContext(
        presentation.document,
        presentation,
        density,
        new AccessibilityIdentityFactory(),
        activator,
        options.icons,
        options.widgets,
        options.observer,
      ),
    [activator, density, options, presentation],
  );
  return new FrameView(
    family,
    presentation,
    interactions,
    context,
    viewport,
    modality,
    density,
    options,
  );
}
