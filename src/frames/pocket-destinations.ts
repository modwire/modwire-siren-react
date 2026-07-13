import type { InteractionNode } from "../domain/interactions/base";
import { DestinationInteraction } from "../domain/interactions/destination";
import { InteractionGroup } from "../domain/interactions/group";
import type { InteractionTree } from "../domain/interactions/tree";

export class PocketDestinations {
  select(tree: InteractionTree): readonly DestinationInteraction[] {
    const destinations: DestinationInteraction[] = [];
    this.collect(tree.root, destinations);
    return Object.freeze(destinations);
  }

  private collect(
    node: InteractionNode,
    destinations: DestinationInteraction[],
  ): void {
    if (node instanceof DestinationInteraction) {
      destinations.push(node);
      return;
    }
    if (node instanceof InteractionGroup) {
      for (const child of node.children) this.collect(child, destinations);
    }
  }
}
