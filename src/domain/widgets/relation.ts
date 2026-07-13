import type { InteractionIdentity } from "../interactions/identity";
import type { AccessibleName } from "../interactions/name";
import type { PresentationDiagnostic } from "../presentation/diagnostic";
import { WidgetKind } from "../vocabulary/widget-kind";
import { WidgetNode } from "./base";
import type { ComponentReference } from "./component-reference";

export class WidgetRelation extends WidgetNode {
  constructor(
    identity: InteractionIdentity,
    name: AccessibleName,
    order: number,
    component: ComponentReference,
    diagnostics: readonly PresentationDiagnostic[],
    readonly relation: string,
    readonly role: string,
    readonly loading: string,
    readonly cardinality: string,
    readonly busy: boolean,
  ) {
    super(WidgetKind.relation, identity, name, order, component, diagnostics);
    Object.freeze(this);
  }
}
