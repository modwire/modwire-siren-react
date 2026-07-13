import type { ComponentReference } from "../domain/widgets/component-reference";
import type { WidgetFactory } from "./widget-factory";

export interface WidgetRegistry {
  resolve(component: ComponentReference): WidgetFactory;
}
