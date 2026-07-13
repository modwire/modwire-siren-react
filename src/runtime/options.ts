import type { AccessibilityPolicy } from "../accessibility/policy";
import { SirenReactCode } from "../errors/code";
import { SirenReactError } from "../errors/error";
import type { FrameConfigurations } from "../frames/configuration";
import type { DensityPolicy } from "../policy/density";
import type { SurfacePreference } from "../policy/preference";
import type { SurfacePolicy } from "../policy/surface";
import type { IconRegistry } from "../ports/icon-registry";
import type { ModalityPort } from "../ports/modality";
import type { NavigationPort } from "../ports/navigation";
import type { RendererObserver } from "../ports/renderer-observer";
import type { ViewportPort } from "../ports/viewport";
import type { WidgetRegistry } from "../ports/widget-registry";
import type { SirenTheme } from "../theme/theme";

export class SirenReactOptions {
  constructor(
    readonly widgets: WidgetRegistry,
    readonly icons: IconRegistry,
    readonly surfaces: SurfacePolicy,
    readonly surfacePreference: SurfacePreference,
    readonly density: DensityPolicy,
    readonly navigation: NavigationPort,
    readonly viewport: ViewportPort,
    readonly modality: ModalityPort,
    readonly observer: RendererObserver,
    readonly accessibility: AccessibilityPolicy,
    readonly theme: SirenTheme,
    readonly frames: FrameConfigurations,
    readonly locale: string,
  ) {
    if (locale.trim() === "") {
      throw new SirenReactError(
        SirenReactCode.optionsInvalid,
        "Locale cannot be empty",
      );
    }
    Object.freeze(this);
  }
}
