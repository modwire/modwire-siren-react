import type { InteractionTree } from "../domain/interactions/tree";
import { PocketDestinations } from "./pocket-destinations";

export class PocketNavigationPolicy {
  compatible(tree: InteractionTree, maximum: number): boolean {
    const destinations = new PocketDestinations().select(tree);
    return destinations.length >= 3 && destinations.length <= maximum;
  }
}
