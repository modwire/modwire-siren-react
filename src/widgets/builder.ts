import type { ComponentReference } from "../domain/widgets/component-reference";
import type { WidgetFactory } from "../ports/widget-factory";
import { SirenReactCode } from "../errors/code";
import { SirenReactError } from "../errors/error";
import { WidgetRegistration } from "./registration";
import { LocalWidgetRegistry } from "./registry";

export class WidgetRegistryBuilder {
  private readonly registrations: WidgetRegistration[] = [];

  register(component: ComponentReference, factory: WidgetFactory): this {
    if (
      this.registrations.some(
        (registration) => registration.component.key === component.key,
      )
    ) {
      throw new SirenReactError(
        SirenReactCode.widgetDuplicate,
        `Widget is already registered: '${component.key}'`,
      );
    }
    this.registrations.push(new WidgetRegistration(component, factory));
    return this;
  }

  build(fallback: WidgetFactory): LocalWidgetRegistry {
    return new LocalWidgetRegistry(this.registrations, fallback);
  }
}
