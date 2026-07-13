import { InteractionKind } from "../vocabulary/interaction-kind";
import { AbsentIcon } from "./absent-icon";
import { AbsentShortcut } from "./absent-shortcut";
import { InteractionNode } from "./base";
import { ContainerInteraction } from "./container";
import type { InteractionIdentity } from "./identity";
import type { AccessibleName } from "./name";
import { InteractionPlacement } from "./placement";
import type { InteractionVisitor } from "./visitor";

export class InteractionDivider extends InteractionNode {
  constructor(identity: InteractionIdentity, name: AccessibleName) {
    super(
      InteractionKind.divider,
      identity,
      name,
      new AbsentIcon(),
      new ContainerInteraction(),
      new AbsentShortcut(),
      InteractionPlacement.none,
    );
    Object.freeze(this);
  }

  accept<Result>(visitor: InteractionVisitor<Result>): Result {
    return visitor.divider(this);
  }
}
