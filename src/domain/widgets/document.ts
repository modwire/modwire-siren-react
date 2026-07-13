import type { InteractionIdentity } from "../interactions/identity";
import type { AccessibleName } from "../interactions/name";
import type { PresentationDiagnostic } from "../presentation/diagnostic";
import { WidgetKind } from "../vocabulary/widget-kind";
import type { WidgetAction } from "./action";
import { WidgetNode } from "./base";
import type { ComponentReference } from "./component-reference";
import type { WidgetProperty } from "./property";
import type { WidgetRegion } from "./region";
import type { WidgetRelation } from "./relation";

export class WidgetDocument extends WidgetNode {
  readonly regions: readonly WidgetRegion[];
  readonly properties: readonly WidgetProperty[];
  readonly relations: readonly WidgetRelation[];
  readonly actions: readonly WidgetAction[];

  constructor(
    identity: InteractionIdentity,
    name: AccessibleName,
    component: ComponentReference,
    diagnostics: readonly PresentationDiagnostic[],
    regions: readonly WidgetRegion[],
    properties: readonly WidgetProperty[],
    relations: readonly WidgetRelation[],
    actions: readonly WidgetAction[],
  ) {
    super(WidgetKind.document, identity, name, 0, component, diagnostics);
    this.regions = Object.freeze([...regions]);
    this.properties = Object.freeze([...properties]);
    this.relations = Object.freeze([...relations]);
    this.actions = Object.freeze([...actions]);
    Object.freeze(this);
  }
}
