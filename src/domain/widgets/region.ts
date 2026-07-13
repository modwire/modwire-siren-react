import type { InteractionIdentity } from "../interactions/identity";
import type { AccessibleName } from "../interactions/name";
import type { PresentationDiagnostic } from "../presentation/diagnostic";
import { WidgetKind } from "../vocabulary/widget-kind";
import type { WidgetAction } from "./action";
import { WidgetNode } from "./base";
import type { ComponentReference } from "./component-reference";
import type { WidgetProperty } from "./property";
import type { WidgetRelation } from "./relation";

export class WidgetRegion extends WidgetNode {
  readonly properties: readonly WidgetProperty[];
  readonly relations: readonly WidgetRelation[];
  readonly actions: readonly WidgetAction[];

  constructor(
    identity: InteractionIdentity,
    name: AccessibleName,
    order: number,
    component: ComponentReference,
    diagnostics: readonly PresentationDiagnostic[],
    properties: readonly WidgetProperty[],
    relations: readonly WidgetRelation[],
    actions: readonly WidgetAction[],
  ) {
    super(WidgetKind.region, identity, name, order, component, diagnostics);
    this.properties = Object.freeze([...properties]);
    this.relations = Object.freeze([...relations]);
    this.actions = Object.freeze([...actions]);
    Object.freeze(this);
  }
}
