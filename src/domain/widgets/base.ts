import type { InteractionIdentity } from "../interactions/identity";
import type { AccessibleName } from "../interactions/name";
import type { PresentationDiagnostic } from "../presentation/diagnostic";
import type { ComponentReference } from "./component-reference";

export abstract class WidgetNode {
  readonly diagnostics: readonly PresentationDiagnostic[];

  protected constructor(
    readonly kind: string,
    readonly identity: InteractionIdentity,
    readonly name: AccessibleName,
    readonly order: number,
    readonly component: ComponentReference,
    diagnostics: readonly PresentationDiagnostic[],
  ) {
    this.diagnostics = Object.freeze([...diagnostics]);
  }
}
