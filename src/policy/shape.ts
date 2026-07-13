import type { InteractionNode } from "../domain/interactions/base";
import { CommandInteraction } from "../domain/interactions/command";
import { InteractionDivider } from "../domain/interactions/divider";
import { InteractionGroup } from "../domain/interactions/group";
import type { InteractionTree } from "../domain/interactions/tree";
import { ActionIntent } from "../domain/vocabulary/intent";

interface ShapeMeasure {
  readonly depth: number;
  readonly leaves: number;
  readonly immediatePrimaryActions: number;
  readonly nested: boolean;
}

export class InteractionShape {
  private constructor(
    readonly depth: number,
    readonly leaves: number,
    readonly immediatePrimaryActions: number,
    readonly nested: boolean,
  ) {
    Object.freeze(this);
  }

  get dialCompatible(): boolean {
    return (
      !this.nested &&
      this.leaves >= 3 &&
      this.leaves <= 6 &&
      this.immediatePrimaryActions === this.leaves
    );
  }

  static from(tree: InteractionTree): InteractionShape {
    const measure = InteractionShape.measure(tree.root, 0);
    return new InteractionShape(
      measure.depth,
      measure.leaves,
      measure.immediatePrimaryActions,
      measure.nested,
    );
  }

  private static measure(node: InteractionNode, level: number): ShapeMeasure {
    if (node instanceof InteractionDivider) {
      return { depth: 0, leaves: 0, immediatePrimaryActions: 0, nested: false };
    }
    if (!(node instanceof InteractionGroup)) {
      return {
        depth: level,
        leaves: 1,
        immediatePrimaryActions:
          level === 1 &&
          node instanceof CommandInteraction &&
          node.emphasis === ActionIntent.primary
            ? 1
            : 0,
        nested: false,
      };
    }
    let depth = 0;
    let leaves = 0;
    let immediatePrimaryActions = 0;
    let nested = level > 0;
    for (const child of node.children) {
      const measure = InteractionShape.measure(child, level + 1);
      depth = Math.max(depth, measure.depth);
      leaves += measure.leaves;
      immediatePrimaryActions += measure.immediatePrimaryActions;
      nested = nested || measure.nested;
    }
    return { depth, leaves, immediatePrimaryActions, nested };
  }
}
