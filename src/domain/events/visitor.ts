import type { ActivateInteraction } from "./activate";
import type { ChangeInputModality } from "./change-modality";
import type { DismissInteraction } from "./dismiss";
import type { EnterInteractionGroup } from "./enter-group";
import type { LeaveInteractionGroup } from "./leave-group";
import type { MoveInteraction } from "./move";
import type { OpenInteraction } from "./open";
import type { ReplaceInteractionTree } from "./replace-tree";
import type { SearchInteractions } from "./search";

export interface InteractionEventVisitor<Result> {
  open(event: OpenInteraction): Result;
  dismiss(event: DismissInteraction): Result;
  move(event: MoveInteraction): Result;
  enterGroup(event: EnterInteractionGroup): Result;
  leaveGroup(event: LeaveInteractionGroup): Result;
  activate(event: ActivateInteraction): Result;
  search(event: SearchInteractions): Result;
  changeModality(event: ChangeInputModality): Result;
  replaceTree(event: ReplaceInteractionTree): Result;
}
