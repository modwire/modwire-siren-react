import type { UiSnapshot } from "@modwire/siren-ui";
import type {
  UiActionNode,
  UiEntityNode,
  UiFieldNode,
  UiPropertyNode,
  UiRegionNode,
  UiRelationNode,
  UiValue,
} from "@modwire/siren-ui/model";
import type { UiDiagnostic } from "@modwire/siren-ui/model";

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
import { WidgetAction } from "../domain/widgets/action";
import { ComponentReference } from "../domain/widgets/component-reference";
import { WidgetDocument } from "../domain/widgets/document";
import { WidgetField } from "../domain/widgets/field";
import { WidgetProperty } from "../domain/widgets/property";
import { WidgetRegion } from "../domain/widgets/region";
import { WidgetRelation } from "../domain/widgets/relation";
import { WidgetValue } from "../domain/widgets/value";
import { UiAnnouncement } from "./announcement";

export class SnapshotAdapter {
  adapt(snapshot: UiSnapshot): PresentationSnapshot {
    return new PresentationSnapshot(
      snapshot.revision,
      this.entity(snapshot.document.root, snapshot.busy),
      this.document(snapshot.document.root, snapshot),
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

  private document(entity: UiEntityNode, snapshot: UiSnapshot): WidgetDocument {
    const represented = new Set<string>();
    for (const region of entity.regions) {
      for (const property of region.properties)
        represented.add(property.identity.value);
      for (const relation of region.relations)
        represented.add(relation.identity.value);
      for (const action of region.actions)
        represented.add(action.identity.value);
    }
    return new WidgetDocument(
      new InteractionIdentity(entity.identity.value),
      new AccessibleName(this.label(entity.label, entity.identity.value)),
      this.component(entity.component.component.key),
      this.diagnostics(entity.diagnostics.values),
      entity.regions.values.map((region) =>
        this.widgetRegion(region, snapshot),
      ),
      entity.properties.values
        .filter((property) => !represented.has(property.identity.value))
        .map((property) => this.property(property)),
      entity.relations.values
        .filter((relation) => !represented.has(relation.identity.value))
        .map((relation) => this.widgetRelation(relation, snapshot.busy)),
      entity.actions.values
        .filter((action) => !represented.has(action.identity.value))
        .map((action) => this.widgetAction(action, snapshot)),
    );
  }

  private widgetRegion(
    region: UiRegionNode,
    snapshot: UiSnapshot,
  ): WidgetRegion {
    return new WidgetRegion(
      new InteractionIdentity(region.identity.value),
      new AccessibleName(this.label(region.label, region.id)),
      region.order,
      this.component(region.component.component.key),
      this.diagnostics(region.diagnostics.values),
      region.properties.values.map((property) => this.property(property)),
      region.relations.values.map((relation) =>
        this.widgetRelation(relation, snapshot.busy),
      ),
      region.actions.values.map((action) =>
        this.widgetAction(action, snapshot),
      ),
    );
  }

  private property(property: UiPropertyNode): WidgetProperty {
    return new WidgetProperty(
      new InteractionIdentity(property.identity.value),
      new AccessibleName(this.label(property.label, property.name)),
      property.order,
      this.component(property.component.component.key),
      this.diagnostics(property.diagnostics.values),
      property.name,
      this.value(property.value),
      property.format,
      property.importance,
      property.sensitive,
    );
  }

  private widgetRelation(
    relation: UiRelationNode,
    busy: ReadonlySet<string>,
  ): WidgetRelation {
    return new WidgetRelation(
      new InteractionIdentity(relation.identity.value),
      new AccessibleName(this.label(relation.label, relation.relation)),
      relation.order,
      this.component(relation.component.component.key),
      this.diagnostics(relation.diagnostics.values),
      relation.relation,
      relation.role,
      relation.loading,
      relation.cardinality,
      busy.has(relation.identity.value),
    );
  }

  private widgetAction(
    action: UiActionNode,
    snapshot: UiSnapshot,
  ): WidgetAction {
    const draft = snapshot.draft(action.identity.value).values();
    const busy = snapshot.busy.has(action.identity.value);
    return new WidgetAction(
      new InteractionIdentity(action.identity.value),
      new AccessibleName(this.label(action.label, action.name)),
      action.order,
      this.component(action.component.component.key),
      this.diagnostics(action.diagnostics.values),
      action.intent,
      busy,
      action.confirmationRequired,
      this.awaitingConfirmation(action, snapshot),
      action.acknowledgement,
      action.fields.values.map((field) =>
        this.field(action, field, draft, busy),
      ),
    );
  }

  private awaitingConfirmation(
    action: UiActionNode,
    snapshot: UiSnapshot,
  ): boolean {
    return (
      action.confirmationRequired &&
      snapshot.focus === action.identity.value &&
      snapshot.announcement === UiAnnouncement.confirmationRequired
    );
  }

  private field(
    action: UiActionNode,
    field: UiFieldNode,
    draft: UiValue,
    busy: boolean,
  ): WidgetField {
    const draftValue = draft.property(field.name);
    return new WidgetField(
      new InteractionIdentity(field.identity.value),
      new AccessibleName(this.label(field.label, field.name)),
      field.order,
      this.component(field.component.component.key),
      this.diagnostics(field.diagnostics.values),
      new InteractionIdentity(action.identity.value),
      field.name,
      field.source.fieldType,
      field.widget,
      draftValue.present
        ? this.value(draftValue)
        : this.value(field.source.value),
      field.source.required,
      field.visible,
      field.enabled,
      busy,
    );
  }

  private component(key: string): ComponentReference {
    return new ComponentReference(key);
  }

  private value(value: UiValue): WidgetValue {
    return value.present
      ? WidgetValue.from(value.value())
      : WidgetValue.absent();
  }

  private diagnostics(
    diagnostics: readonly UiDiagnostic[],
  ): readonly PresentationDiagnostic[] {
    return diagnostics.map(
      (diagnostic) =>
        new PresentationDiagnostic(
          diagnostic.code,
          diagnostic.pointer,
          diagnostic.severity,
          diagnostic.message,
          diagnostic.node,
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
