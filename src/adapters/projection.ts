import type { UiSnapshot } from "@modwire/siren-ui";
import type {
  UiActionNode,
  UiEntityNode,
  UiRegionNode,
  UiRelationNode,
} from "@modwire/siren-ui/model";

import { InteractionIdentity } from "../domain/interactions/identity";
import { AccessibleName } from "../domain/interactions/name";
import { InteractionPlacement } from "../domain/interactions/placement";
import { PresentationAction } from "../domain/presentation/action";
import type { PresentationInteraction } from "../domain/presentation/base";
import { PresentationDiagnostic } from "../domain/presentation/diagnostic";
import { PresentationGroup } from "../domain/presentation/group";
import { PresentationRelation } from "../domain/presentation/relation";
import { PresentationSnapshot } from "../domain/presentation/snapshot";
import { ActionIntent } from "../domain/vocabulary/intent";
import { PresentationKind } from "../domain/vocabulary/presentation-kind";

export class SnapshotAdapter {
  adapt(snapshot: UiSnapshot): PresentationSnapshot {
    return new PresentationSnapshot(
      snapshot.revision,
      this.entity(snapshot.document.root, snapshot.busy),
      snapshot.focus,
      snapshot.announcement,
      snapshot.diagnostics.values.map(
        (diagnostic) =>
          new PresentationDiagnostic(
            diagnostic.code,
            diagnostic.pointer,
            diagnostic.severity,
            diagnostic.message,
            diagnostic.node,
          ),
      ),
    );
  }

  private entity(
    entity: UiEntityNode,
    busy: ReadonlySet<string>,
  ): PresentationGroup {
    const represented = new Set<string>();
    const children: PresentationInteraction[] = [];
    for (const region of entity.regions) {
      const group = this.region(region, busy);
      if (group.children.length > 0) {
        children.push(group);
        for (const child of group.children)
          represented.add(child.identity.value);
      }
    }
    for (const action of entity.actions) {
      if (!represented.has(action.identity.value)) {
        children.push(this.action(action, busy));
      }
    }
    for (const relation of entity.relations) {
      if (!represented.has(relation.identity.value)) {
        children.push(this.relation(relation, busy));
      }
    }
    return new PresentationGroup(
      new InteractionIdentity(entity.identity.value),
      new AccessibleName(this.label(entity.label, entity.identity.value)),
      0,
      this.ordered(children),
    );
  }

  private region(
    region: UiRegionNode,
    busy: ReadonlySet<string>,
  ): PresentationGroup {
    const children: PresentationInteraction[] = [];
    for (const action of region.actions)
      children.push(this.action(action, busy));
    for (const relation of region.relations) {
      children.push(this.relation(relation, busy));
    }
    return new PresentationGroup(
      new InteractionIdentity(region.identity.value),
      new AccessibleName(this.label(region.label, region.id)),
      region.order,
      this.ordered(children),
    );
  }

  private action(
    action: UiActionNode,
    busy: ReadonlySet<string>,
  ): PresentationAction {
    return new PresentationAction(
      new InteractionIdentity(action.identity.value),
      new AccessibleName(this.label(action.label, action.name)),
      action.order,
      InteractionPlacement.from(action.placement),
      ActionIntent.from(action.intent),
      busy.has(action.identity.value),
    );
  }

  private relation(
    relation: UiRelationNode,
    busy: ReadonlySet<string>,
  ): PresentationRelation {
    return new PresentationRelation(
      new InteractionIdentity(relation.identity.value),
      new AccessibleName(this.label(relation.label, relation.relation)),
      relation.order,
      relation.relation,
      busy.has(relation.identity.value),
    );
  }

  private ordered(
    interactions: readonly PresentationInteraction[],
  ): readonly PresentationInteraction[] {
    return [...interactions].sort((left, right) => {
      const order = left.order - right.order;
      if (order !== 0) return order;
      const kind = this.rank(left.kind) - this.rank(right.kind);
      if (kind !== 0) return kind;
      if (left.identity.value < right.identity.value) return -1;
      if (left.identity.value > right.identity.value) return 1;
      return 0;
    });
  }

  private rank(kind: string): number {
    if (kind === PresentationKind.group) return 0;
    if (kind === PresentationKind.action) return 1;
    return 2;
  }

  private label(label: string, fallback: string): string {
    return label.trim() === "" ? fallback : label;
  }
}
