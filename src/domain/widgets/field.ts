import type { InteractionIdentity } from "../interactions/identity";
import type { AccessibleName } from "../interactions/name";
import type { PresentationDiagnostic } from "../presentation/diagnostic";
import { WidgetKind } from "../vocabulary/widget-kind";
import { WidgetNode } from "./base";
import type { ComponentReference } from "./component-reference";
import type { WidgetValue } from "./value";

export class WidgetField extends WidgetNode {
  constructor(
    identity: InteractionIdentity,
    name: AccessibleName,
    order: number,
    component: ComponentReference,
    diagnostics: readonly PresentationDiagnostic[],
    readonly action: InteractionIdentity,
    readonly field: string,
    readonly fieldType: string,
    readonly widget: string,
    readonly value: WidgetValue,
    readonly required: boolean,
    readonly visible: boolean,
    readonly enabled: boolean,
    readonly busy: boolean,
  ) {
    super(WidgetKind.field, identity, name, order, component, diagnostics);
    Object.freeze(this);
  }
}
