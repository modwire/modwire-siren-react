import { ComponentReference } from "../../domain/widgets/component-reference";
import { StandardWidgetComponent } from "../../domain/vocabulary/widget-component";
import { WidgetRegistryBuilder } from "../../widgets/builder";
import type { LocalWidgetRegistry } from "../../widgets/registry";
import { StandardWidgetFactory } from "./factory";
import { UnsupportedWidgetFactory } from "./unsupported-factory";

export class StandardWidgetRegistry {
  create(): LocalWidgetRegistry {
    const factory = new StandardWidgetFactory();
    const builder = new WidgetRegistryBuilder();
    for (const key of [
      StandardWidgetComponent.document,
      StandardWidgetComponent.region,
      StandardWidgetComponent.property,
      StandardWidgetComponent.relation,
      StandardWidgetComponent.action,
      StandardWidgetComponent.field,
    ]) {
      builder.register(new ComponentReference(key), factory);
    }
    return builder.build(new UnsupportedWidgetFactory());
  }
}
