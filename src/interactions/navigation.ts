import type { EnterInteractionGroup } from "../domain/events/enter-group";
import type { LeaveInteractionGroup } from "../domain/events/leave-group";
import type { MoveInteraction } from "../domain/events/move";
import type { OpenInteraction } from "../domain/events/open";
import { MoveFocus } from "../domain/focus/move";
import { RestoreFocus } from "../domain/focus/restore";
import { RetainFocus } from "../domain/focus/retain";
import { InteractionGroup } from "../domain/interactions/group";
import type { InteractionIdentity } from "../domain/interactions/identity";
import { ClosedInteractionState } from "../domain/state/closed";
import { ActivatingInteractionState } from "../domain/state/activating";
import { OpenInteractionState } from "../domain/state/open";
import { InteractionPath } from "../domain/state/path";
import { SearchingInteractionState } from "../domain/state/searching";
import { InteractionSnapshot } from "../domain/state/snapshot";
import { SirenReactCode } from "../errors/code";
import { SirenReactIssue } from "../errors/issue";
import { SirenReactIssues } from "../errors/issues";
import type { InteractionIndex } from "./catalog";
import type { InteractionResolution } from "./resolution";

export class InteractionNavigator {
  open(
    current: InteractionSnapshot,
    index: InteractionIndex,
    event: OpenInteraction,
  ): InteractionSnapshot {
    const target = this.openTarget(index, event.target);
    if (!target.present) return this.missing(current, event.target);
    const record = target.require();
    return this.snapshot(
      current,
      new OpenInteractionState(index.tree, record.path, event.origin),
      new MoveFocus(record.node.identity),
    );
  }

  dismiss(
    current: InteractionSnapshot,
    index: InteractionIndex,
  ): InteractionSnapshot {
    const state = current.state;
    if (state instanceof OpenInteractionState) {
      return this.close(current, index, state.origin);
    }
    if (state instanceof SearchingInteractionState) {
      return this.close(current, index, state.origin);
    }
    if (state instanceof ActivatingInteractionState) {
      return this.close(current, index, state.origin);
    }
    return current;
  }

  move(
    current: InteractionSnapshot,
    index: InteractionIndex,
    event: MoveInteraction,
  ): InteractionSnapshot {
    const state = current.state;
    if (!(state instanceof OpenInteractionState)) return current;
    const active = state.active.at(state.active.length - 1);
    const target = index.move(active, event.direction);
    if (!target.present) return current;
    const record = target.require();
    return this.snapshot(
      current,
      new OpenInteractionState(index.tree, record.path, state.origin),
      new MoveFocus(record.node.identity),
    );
  }

  enter(
    current: InteractionSnapshot,
    index: InteractionIndex,
    event: EnterInteractionGroup,
  ): InteractionSnapshot {
    const state = current.state;
    if (!(state instanceof OpenInteractionState)) return current;
    return this.enterIdentity(current, index, event.target, state.origin);
  }

  enterIdentity(
    current: InteractionSnapshot,
    index: InteractionIndex,
    target: InteractionIdentity,
    origin: InteractionIdentity,
  ): InteractionSnapshot {
    const group = index.resolve(target);
    if (!group.present) return this.missing(current, target);
    if (!(group.require().node instanceof InteractionGroup)) return current;
    const child = index.first(target);
    if (!child.present) return current;
    const record = child.require();
    return this.snapshot(
      current,
      new OpenInteractionState(index.tree, record.path, origin),
      new MoveFocus(record.node.identity),
    );
  }

  leave(
    current: InteractionSnapshot,
    index: InteractionIndex,
    event: LeaveInteractionGroup,
  ): InteractionSnapshot {
    const state = current.state;
    if (!(state instanceof OpenInteractionState)) return current;
    const group = index.resolve(event.target);
    if (!group.present || !(group.require().node instanceof InteractionGroup)) {
      return current;
    }
    let targetPosition = -1;
    for (let position = 0; position < state.active.length; position += 1) {
      if (state.active.at(position).value === event.target.value) {
        targetPosition = position;
      }
    }
    if (targetPosition < 0) return current;
    if (targetPosition === 0) return this.close(current, index, state.origin);
    const path = new InteractionPath(
      state.active.values.slice(0, targetPosition + 1),
    );
    const target = path.at(path.length - 1);
    return this.snapshot(
      current,
      new OpenInteractionState(index.tree, path, state.origin),
      new MoveFocus(target),
    );
  }

  close(
    current: InteractionSnapshot,
    index: InteractionIndex,
    origin: InteractionIdentity,
  ): InteractionSnapshot {
    return this.snapshot(
      current,
      new ClosedInteractionState(index.tree),
      new RestoreFocus(origin),
    );
  }

  missing(
    current: InteractionSnapshot,
    identity: InteractionIdentity,
  ): InteractionSnapshot {
    return new InteractionSnapshot(
      current.state,
      current.modality,
      new RetainFocus(),
      new SirenReactIssues([
        new SirenReactIssue(
          SirenReactCode.interactionMissing,
          identity.value,
          "Interaction identity is unavailable",
        ),
      ]),
    );
  }

  private openTarget(
    index: InteractionIndex,
    target: InteractionIdentity,
  ): InteractionResolution {
    const resolution = index.resolve(target);
    if (!resolution.present) return resolution;
    if (resolution.require().node instanceof InteractionGroup) {
      return index.first(target);
    }
    return resolution;
  }

  private snapshot(
    current: InteractionSnapshot,
    state: InteractionSnapshot["state"],
    focus: InteractionSnapshot["focus"],
  ): InteractionSnapshot {
    return new InteractionSnapshot(
      state,
      current.modality,
      focus,
      SirenReactIssues.empty(),
    );
  }
}
