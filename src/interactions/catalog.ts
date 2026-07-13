import type { InteractionMatcher } from "../ports/matcher";
import type { InteractionNode } from "../domain/interactions/base";
import { InteractionCollection } from "../domain/interactions/collection";
import { InteractionDivider } from "../domain/interactions/divider";
import { InteractionGroup } from "../domain/interactions/group";
import type { InteractionIdentity } from "../domain/interactions/identity";
import type { InteractionTree } from "../domain/interactions/tree";
import type { InteractionDirection } from "../domain/vocabulary/direction";
import { InteractionDirection as Direction } from "../domain/vocabulary/direction";
import { InteractionPath } from "../domain/state/path";
import { FoundInteraction } from "./found";
import { MissingInteraction } from "./missing";
import { InteractionRecord } from "./record";
import type { InteractionResolution } from "./resolution";

export class InteractionIndex {
  private readonly records: InteractionCollection<InteractionRecord>;

  constructor(readonly tree: InteractionTree) {
    const records: InteractionRecord[] = [];
    this.collect(tree.root, [tree.root.identity], tree.root.identity, records);
    this.records = new InteractionCollection(records);
    Object.freeze(this);
  }

  resolve(identity: InteractionIdentity): InteractionResolution {
    for (const record of this.records) {
      if (record.node.identity.value === identity.value) {
        return new FoundInteraction(record);
      }
    }
    return new MissingInteraction(identity);
  }

  first(group: InteractionIdentity): InteractionResolution {
    const parent = this.resolve(group);
    if (!parent.present) return parent;
    const node = parent.require().node;
    if (!(node instanceof InteractionGroup)) return parent;
    for (const child of node.children) {
      if (!(child instanceof InteractionDivider))
        return this.resolve(child.identity);
    }
    return new MissingInteraction(group);
  }

  move(
    active: InteractionIdentity,
    direction: InteractionDirection,
  ): InteractionResolution {
    const current = this.resolve(active);
    if (!current.present) return current;
    const record = current.require();
    const siblings = this.focusableChildren(record.parent);
    if (siblings.length === 0) return current;
    let position = 0;
    for (let index = 0; index < siblings.length; index += 1) {
      if (siblings.at(index).identity.value === active.value) position = index;
    }
    if (direction === Direction.first)
      return this.resolve(siblings.at(0).identity);
    if (direction === Direction.last) {
      return this.resolve(siblings.at(siblings.length - 1).identity);
    }
    const offset = direction === Direction.next ? 1 : -1;
    const target = (position + offset + siblings.length) % siblings.length;
    return this.resolve(siblings.at(target).identity);
  }

  search(
    matcher: InteractionMatcher,
    query: string,
    limit: number,
  ): InteractionCollection<InteractionIdentity> {
    const results: InteractionIdentity[] = [];
    for (const record of this.records) {
      if (
        !(record.node instanceof InteractionDivider) &&
        record.node !== this.tree.root &&
        matcher.matches(record.node.name.value, query)
      ) {
        results.push(record.node.identity);
        if (results.length === limit) break;
      }
    }
    return new InteractionCollection(results);
  }

  fallback(path: InteractionPath): InteractionResolution {
    for (let index = path.length - 1; index >= 0; index -= 1) {
      const candidate = this.resolve(path.at(index));
      if (candidate.present && candidate.require().node !== this.tree.root) {
        return candidate;
      }
    }
    return this.first(this.tree.root.identity);
  }

  private focusableChildren(
    parent: InteractionIdentity,
  ): InteractionCollection<InteractionNode> {
    const children: InteractionNode[] = [];
    for (const record of this.records) {
      if (
        record.parent.value === parent.value &&
        record.node.identity.value !== parent.value &&
        !(record.node instanceof InteractionDivider)
      ) {
        children.push(record.node);
      }
    }
    return new InteractionCollection(children);
  }

  private collect(
    node: InteractionNode,
    path: readonly InteractionIdentity[],
    parent: InteractionIdentity,
    records: InteractionRecord[],
  ): void {
    records.push(
      new InteractionRecord(node, new InteractionPath(path), parent),
    );
    if (node instanceof InteractionGroup) {
      for (const child of node.children) {
        this.collect(child, [...path, child.identity], node.identity, records);
      }
    }
  }
}
