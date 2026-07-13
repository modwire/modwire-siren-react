import { InteractionKind } from "../vocabulary/interaction-kind";
import { AbsentIcon } from "./absent-icon";
import { AbsentShortcut } from "./absent-shortcut";
import { InteractionNode } from "./base";
import { InteractionCollection } from "./collection";
import { ContainerInteraction } from "./container";
import type { InteractionIdentity } from "./identity";
import type { AccessibleName } from "./name";
import { InteractionPlacement } from "./placement";
import type { InteractionVisitor } from "./visitor";

export class InteractionGroup extends InteractionNode {
  readonly children: InteractionCollection<InteractionNode>;

  constructor(
    identity: InteractionIdentity,
    name: AccessibleName,
    children: readonly InteractionNode[],
  ) {
    super(
      InteractionKind.group,
      identity,
      name,
      new AbsentIcon(),
      new ContainerInteraction(),
      new AbsentShortcut(),
      InteractionPlacement.none,
    );
    this.children = new InteractionCollection(children);
    Object.freeze(this);
  }

  accept<Result>(visitor: InteractionVisitor<Result>): Result {
    return visitor.group(this);
  }
}
