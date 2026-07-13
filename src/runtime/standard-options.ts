import { StandardAccessibilityPolicy } from "../accessibility/standard";
import { AbsentNavigationPort } from "../adapters/absent-navigation";
import { BrowserModalityAdapter } from "../adapters/browser-modality";
import { BrowserViewportAdapter } from "../adapters/browser-viewport";
import { SilentRendererObserver } from "../adapters/silent-renderer";
import { ViewportThresholds } from "../adapters/viewport-thresholds";
import { StandardFrameConfigurations } from "../frames/standard-configuration";
import { StandardIconRegistry } from "../mui/icons/standard";
import { StandardWidgetRegistry } from "../mui/widgets/standard";
import { AutomaticSurfacePreference } from "../policy/automatic";
import { StandardDensityPolicy } from "../policy/standard-density";
import { StandardSurfacePolicy } from "../policy/standard-surface";
import { StandardSirenTheme } from "../theme/standard";
import { SirenReactOptions } from "./options";

export class StandardSirenReactOptions {
  create(): SirenReactOptions {
    return new SirenReactOptions(
      new StandardWidgetRegistry().create(),
      new StandardIconRegistry().create(),
      new StandardSurfacePolicy(),
      new AutomaticSurfacePreference(),
      new StandardDensityPolicy(),
      new AbsentNavigationPort(),
      new BrowserViewportAdapter(new ViewportThresholds(600, 1200)),
      new BrowserModalityAdapter(),
      new SilentRendererObserver(),
      new StandardAccessibilityPolicy().create(),
      new StandardSirenTheme().create(),
      new StandardFrameConfigurations().create(),
      "en",
    );
  }
}
