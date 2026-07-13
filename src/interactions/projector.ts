import { RequestActionIntent } from "../domain/intents/request-action";
import { LoadRelationIntent } from "../domain/intents/load-relation";
import { AbsentIcon } from "../domain/interactions/absent-icon";
import { AbsentShortcut } from "../domain/interactions/absent-shortcut";
import { AvailableInteraction } from "../domain/interactions/available";
import type { InteractionNode } from "../domain/interactions/base";
import { CommandInteraction } from "../domain/interactions/command";
import { DestinationInteraction } from "../domain/interactions/destination";
import { InteractionGroup } from "../domain/interactions/group";
import { InteractionPlacement } from "../domain/interactions/placement";
import { PendingInteraction } from "../domain/interactions/pending";
import { InteractionTree } from "../domain/interactions/tree";
import type { PresentationAction } from "../domain/presentation/action";
import type { PresentationGroup } from "../domain/presentation/group";
import type { PresentationRelation } from "../domain/presentation/relation";
import type { PresentationSnapshot } from "../domain/presentation/snapshot";
import type { PresentationVisitor } from "../domain/presentation/visitor";

export class InteractionProjector implements PresentationVisitor<InteractionNode> {
  project(snapshot: PresentationSnapshot): InteractionTree {
    return new InteractionTree(this.group(snapshot.root));
  }

  action(interaction: PresentationAction): InteractionNode {
    return new CommandInteraction(
      interaction.identity,
      interaction.name,
      new AbsentIcon(),
      interaction.busy ? new PendingInteraction() : new AvailableInteraction(),
      new AbsentShortcut(),
      interaction.placement,
      interaction.intent,
      new RequestActionIntent(interaction.identity),
    );
  }

  relation(interaction: PresentationRelation): InteractionNode {
    return new DestinationInteraction(
      interaction.identity,
      interaction.name,
      new AbsentIcon(),
      interaction.busy ? new PendingInteraction() : new AvailableInteraction(),
      new AbsentShortcut(),
      InteractionPlacement.navigation,
      interaction.relation,
      new LoadRelationIntent(interaction.identity),
    );
  }

  group(interaction: PresentationGroup): InteractionGroup {
    return new InteractionGroup(
      interaction.identity,
      interaction.name,
      interaction.children.values.map((child) => child.accept(this)),
    );
  }
}
