import type { ComponentReference } from "../domain/widgets/component-reference";
import type { WidgetFactory } from "../ports/widget-factory";

export class WidgetRegistration {
  constructor(
    readonly component: ComponentReference,
    readonly factory: WidgetFactory,
  ) {
    Object.freeze(this);
  }
}
