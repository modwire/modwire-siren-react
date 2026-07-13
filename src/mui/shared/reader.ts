import type { InteractionNode } from "../../domain/interactions/base";
import { InteractionCollection } from "../../domain/interactions/collection";
import { InteractionDivider } from "../../domain/interactions/divider";
import { InteractionGroup } from "../../domain/interactions/group";
import type { InteractionIdentity } from "../../domain/interactions/identity";
import type { InteractionTree } from "../../domain/interactions/tree";
import { ActivatingInteractionState } from "../../domain/state/activating";
import { ClosedInteractionState } from "../../domain/state/closed";
import { OpenInteractionState } from "../../domain/state/open";
import { SearchingInteractionState } from "../../domain/state/searching";
import type { InteractionSnapshot } from "../../domain/state/snapshot";
import { InteractionIndex } from "../../interactions/catalog";

export class MuiInteractionReader {
  private readonly index: InteractionIndex;

  constructor(private readonly tree: InteractionTree) {
    this.index = new InteractionIndex(tree);
  }

  active(snapshot: InteractionSnapshot): InteractionIdentity {
    const state = snapshot.state;
    if (state instanceof OpenInteractionState) {
      return state.active.at(state.active.length - 1);
    }
    if (state instanceof SearchingInteractionState) {
      return state.active.at(state.active.length - 1);
    }
    if (state instanceof ActivatingInteractionState) return state.selected;
    return this.tree.root.identity;
  }

  isOpen(snapshot: InteractionSnapshot): boolean {
    return !(snapshot.state instanceof ClosedInteractionState);
  }

  contains(
    snapshot: InteractionSnapshot,
    identity: InteractionIdentity,
  ): boolean {
    const state = snapshot.state;
    if (state instanceof OpenInteractionState) {
      return state.active.values.some(
        (value) => value.value === identity.value,
      );
    }
    if (state instanceof SearchingInteractionState) {
      return state.active.values.some(
        (value) => value.value === identity.value,
      );
    }
    return false;
  }

  expanded(
    snapshot: InteractionSnapshot,
    identity: InteractionIdentity,
  ): boolean {
    const state = snapshot.state;
    if (
      !(state instanceof OpenInteractionState) &&
      !(state instanceof SearchingInteractionState)
    ) {
      return false;
    }
    const active = state.active.at(state.active.length - 1);
    return active.value !== identity.value && this.contains(snapshot, identity);
  }

  node(identity: InteractionIdentity): InteractionNode {
    return this.index.resolve(identity).require().node;
  }

  ancestry(identity: InteractionIdentity): string {
    const path = this.index.resolve(identity).require().path;
    const names: string[] = [];
    for (let position = 1; position < path.length - 1; position += 1) {
      names.push(this.node(path.at(position)).name.value);
    }
    return names.join(" / ");
  }

  currentGroup(snapshot: InteractionSnapshot): InteractionGroup {
    const state = snapshot.state;
    if (
      !(state instanceof OpenInteractionState) &&
      !(state instanceof SearchingInteractionState)
    ) {
      return this.tree.root;
    }
    for (let position = state.active.length - 1; position >= 0; position -= 1) {
      const node = this.node(state.active.at(position));
      if (node instanceof InteractionGroup) return node;
    }
    return this.tree.root;
  }

  leaves(): InteractionCollection<InteractionNode> {
    const leaves: InteractionNode[] = [];
    this.collect(this.tree.root, leaves);
    return new InteractionCollection(leaves);
  }

  private collect(node: InteractionNode, leaves: InteractionNode[]): void {
    if (node instanceof InteractionDivider) return;
    if (node instanceof InteractionGroup) {
      for (const child of node.children) this.collect(child, leaves);
      return;
    }
    leaves.push(node);
  }
}
