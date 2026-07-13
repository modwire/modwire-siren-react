import type { ComponentReference } from "../domain/widgets/component-reference";
import type { WidgetFactory } from "../ports/widget-factory";
import type { WidgetRegistry } from "../ports/widget-registry";
import type { WidgetRegistration } from "./registration";

export class LocalWidgetRegistry implements WidgetRegistry {
  private readonly registrations: readonly WidgetRegistration[];

  constructor(
    registrations: readonly WidgetRegistration[],
    private readonly fallback: WidgetFactory,
  ) {
    this.registrations = Object.freeze([...registrations]);
    Object.freeze(this);
  }

  resolve(component: ComponentReference): WidgetFactory {
    for (const registration of this.registrations) {
      if (registration.component.key === component.key) {
        return registration.factory;
      }
    }
    return this.fallback;
  }
}
