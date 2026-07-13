import { InteractionCollection } from "../interactions/collection";
import type { PresentationDiagnostic } from "./diagnostic";
import type { PresentationGroup } from "./group";

export class PresentationSnapshot {
  readonly diagnostics: InteractionCollection<PresentationDiagnostic>;

  constructor(
    readonly revision: number,
    readonly root: PresentationGroup,
    readonly focus: string,
    readonly announcement: string,
    diagnostics: readonly PresentationDiagnostic[],
  ) {
    this.diagnostics = new InteractionCollection(diagnostics);
    Object.freeze(this);
  }
}
