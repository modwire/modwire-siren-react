import type { InteractionIdentity } from "../interactions/identity";
import type { AccessibleName } from "../interactions/name";
import type { PresentationDiagnostic } from "../presentation/diagnostic";
import { WidgetKind } from "../vocabulary/widget-kind";
import { WidgetNode } from "./base";
import type { ComponentReference } from "./component-reference";
import type { WidgetValue } from "./value";

export class WidgetProperty extends WidgetNode {
  constructor(
    identity: InteractionIdentity,
    name: AccessibleName,
    order: number,
    component: ComponentReference,
    diagnostics: readonly PresentationDiagnostic[],
    readonly property: string,
    readonly value: WidgetValue,
    readonly format: string,
    readonly importance: string,
    readonly sensitive: boolean,
  ) {
    super(WidgetKind.property, identity, name, order, component, diagnostics);
    Object.freeze(this);
  }
}
