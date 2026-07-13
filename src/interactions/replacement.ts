import { MoveFocus } from "../domain/focus/move";
import { RestoreFocus } from "../domain/focus/restore";
import { RetainFocus } from "../domain/focus/retain";
import type { InteractionTree } from "../domain/interactions/tree";
import { ActivatingInteractionState } from "../domain/state/activating";
import { ClosedInteractionState } from "../domain/state/closed";
import { OpenInteractionState } from "../domain/state/open";
import { SearchingInteractionState } from "../domain/state/searching";
import { InteractionSnapshot } from "../domain/state/snapshot";
import { SirenReactIssues } from "../errors/issues";
import type { InteractionIndex } from "./catalog";
import type { InteractionTypeahead } from "./typeahead";

export class InteractionReplacement {
  constructor(private readonly typeahead: InteractionTypeahead) {}

  replace(
    current: InteractionSnapshot,
    index: InteractionIndex,
    tree: InteractionTree,
  ): InteractionSnapshot {
    const previous = current.state;
    if (previous instanceof ClosedInteractionState) {
      return this.snapshot(
        current,
        new ClosedInteractionState(tree),
        new RetainFocus(),
      );
    }
    if (previous instanceof ActivatingInteractionState) {
      if (!index.resolve(previous.selected).present) {
        return this.snapshot(
          current,
          new ClosedInteractionState(tree),
          new RestoreFocus(previous.origin),
        );
      }
      return this.snapshot(
        current,
        new ActivatingInteractionState(
          tree,
          previous.selected,
          previous.origin,
        ),
        new RetainFocus(),
      );
    }
    if (
      !(previous instanceof OpenInteractionState) &&
      !(previous instanceof SearchingInteractionState)
    ) {
      return current;
    }
    const fallback = index.fallback(previous.active);
    if (!fallback.present) {
      return this.snapshot(
        current,
        new ClosedInteractionState(tree),
        new RestoreFocus(previous.origin),
      );
    }
    const record = fallback.require();
    const open = this.snapshot(
      current,
      new OpenInteractionState(tree, record.path, previous.origin),
      new MoveFocus(record.node.identity),
    );
    if (!(previous instanceof SearchingInteractionState)) return open;
    return this.typeahead.restore(open, index, previous);
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
