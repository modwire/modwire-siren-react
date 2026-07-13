import {
  SirenReactOptions,
  StandardSirenReactOptions,
} from "@modwire/siren-react";
import type {
  RendererObserver,
  SurfacePreference,
  IconRegistry,
  SirenTheme,
  WidgetRegistry,
} from "@modwire/siren-react/extensions";

export class OptionsCase {
  observer(observer: RendererObserver): SirenReactOptions {
    const standard = new StandardSirenReactOptions().create();
    return new SirenReactOptions(
      standard.widgets,
      standard.icons,
      standard.surfaces,
      standard.surfacePreference,
      standard.density,
      standard.navigation,
      standard.viewport,
      standard.modality,
      observer,
      standard.accessibility,
      standard.theme,
      standard.frames,
      standard.locale,
    );
  }

  preference(preference: SurfacePreference): SirenReactOptions {
    const standard = new StandardSirenReactOptions().create();
    return new SirenReactOptions(
      standard.widgets,
      standard.icons,
      standard.surfaces,
      preference,
      standard.density,
      standard.navigation,
      standard.viewport,
      standard.modality,
      standard.observer,
      standard.accessibility,
      standard.theme,
      standard.frames,
      standard.locale,
    );
  }

  icons(icons: IconRegistry, observer: RendererObserver): SirenReactOptions {
    const standard = new StandardSirenReactOptions().create();
    return new SirenReactOptions(
      standard.widgets,
      icons,
      standard.surfaces,
      standard.surfacePreference,
      standard.density,
      standard.navigation,
      standard.viewport,
      standard.modality,
      observer,
      standard.accessibility,
      standard.theme,
      standard.frames,
      standard.locale,
    );
  }

  widgets(
    widgets: WidgetRegistry,
    observer: RendererObserver,
  ): SirenReactOptions {
    const standard = new StandardSirenReactOptions().create();
    return new SirenReactOptions(
      widgets,
      standard.icons,
      standard.surfaces,
      standard.surfacePreference,
      standard.density,
      standard.navigation,
      standard.viewport,
      standard.modality,
      observer,
      standard.accessibility,
      standard.theme,
      standard.frames,
      standard.locale,
    );
  }

  theme(theme: SirenTheme): SirenReactOptions {
    const standard = new StandardSirenReactOptions().create();
    return new SirenReactOptions(
      standard.widgets,
      standard.icons,
      standard.surfaces,
      standard.surfacePreference,
      standard.density,
      standard.navigation,
      standard.viewport,
      standard.modality,
      standard.observer,
      standard.accessibility,
      theme,
      standard.frames,
      standard.locale,
    );
  }
}
