import type { InteractionIdentity } from "../interactions/identity";
import type { AccessibleName } from "../interactions/name";
import type { PresentationDiagnostic } from "../presentation/diagnostic";
import { WidgetKind } from "../vocabulary/widget-kind";
import { WidgetNode } from "./base";
import type { ComponentReference } from "./component-reference";
import type { WidgetField } from "./field";

export class WidgetAction extends WidgetNode {
  readonly fields: readonly WidgetField[];

  constructor(
    identity: InteractionIdentity,
    name: AccessibleName,
    order: number,
    component: ComponentReference,
    diagnostics: readonly PresentationDiagnostic[],
    readonly intent: string,
    readonly busy: boolean,
    readonly confirmationRequired: boolean,
    readonly awaitingConfirmation: boolean,
    readonly acknowledgement: string,
    fields: readonly WidgetField[],
  ) {
    super(WidgetKind.action, identity, name, order, component, diagnostics);
    this.fields = Object.freeze([...fields]);
    Object.freeze(this);
  }
}
