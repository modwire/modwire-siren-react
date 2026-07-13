import { SirenReactCode } from "../../errors/code";
import { SirenReactError } from "../../errors/error";

export class InteractionPlacement {
  private constructor(readonly value: string) {
    Object.freeze(this);
  }

  static readonly none = new InteractionPlacement("none");
  static readonly navigation = new InteractionPlacement("navigation");
  static readonly entity = new InteractionPlacement("entity");
  static readonly collection = new InteractionPlacement("collection");
  static readonly item = new InteractionPlacement("item");
  static readonly inline = new InteractionPlacement("inline");
  static readonly overflow = new InteractionPlacement("overflow");
  static readonly values = Object.freeze([
    InteractionPlacement.none,
    InteractionPlacement.navigation,
    InteractionPlacement.entity,
    InteractionPlacement.collection,
    InteractionPlacement.item,
    InteractionPlacement.inline,
    InteractionPlacement.overflow,
  ]);

  static from(value: string): InteractionPlacement {
    for (const placement of InteractionPlacement.values) {
      if (placement.value === value) return placement;
    }
    throw new SirenReactError(
      SirenReactCode.interactionPlacement,
      `Unknown interaction placement: '${value}'`,
    );
  }
}
