import type { InteractionAvailability } from "./availability";
import type { InteractionIcon } from "./icon";
import type { InteractionIdentity } from "./identity";
import type { AccessibleName } from "./name";
import type { InteractionPlacement } from "./placement";
import type { InteractionShortcut } from "./shortcut";
import type { InteractionVisitor } from "./visitor";

export abstract class InteractionNode {
  protected constructor(
    readonly kind: string,
    readonly identity: InteractionIdentity,
    readonly name: AccessibleName,
    readonly icon: InteractionIcon,
    readonly availability: InteractionAvailability,
    readonly shortcut: InteractionShortcut,
    readonly placement: InteractionPlacement,
  ) {}

  abstract accept<Result>(visitor: InteractionVisitor<Result>): Result;
}
