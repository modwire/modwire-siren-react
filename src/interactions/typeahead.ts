import type { SearchInteractions } from "../domain/events/search";
import { MoveFocus } from "../domain/focus/move";
import { RetainFocus } from "../domain/focus/retain";
import { OpenInteractionState } from "../domain/state/open";
import { SearchingInteractionState } from "../domain/state/searching";
import { InteractionSnapshot } from "../domain/state/snapshot";
import type { InteractionDirection } from "../domain/vocabulary/direction";
import { InteractionDirection as Direction } from "../domain/vocabulary/direction";
import { SirenReactIssues } from "../errors/issues";
import type { TypeaheadPolicy } from "../policy/typeahead";
import type { InteractionMatcher } from "../ports/matcher";
import type { InteractionIndex } from "./catalog";

export class InteractionTypeahead {
  constructor(
    private readonly matcher: InteractionMatcher,
    readonly policy: TypeaheadPolicy,
  ) {}

  search(
    current: InteractionSnapshot,
    index: InteractionIndex,
    event: SearchInteractions,
  ): InteractionSnapshot {
    const state = current.state;
    if (
      !(state instanceof OpenInteractionState) &&
      !(state instanceof SearchingInteractionState)
    ) {
      return current;
    }
    if (event.query === "") {
      return this.snapshot(
        current,
        new OpenInteractionState(index.tree, state.active, state.origin),
        new RetainFocus(),
      );
    }
    const query =
      state instanceof SearchingInteractionState
        ? this.accumulate(state.query, event.query)
        : event.query;
    const cycling =
      state instanceof SearchingInteractionState &&
      this.matcher.repeated(`${state.query}${event.query}`);
    const results = index.search(this.matcher, query, this.policy.resultLimit);
    let active = state.active;
    let selection = state.active.at(state.active.length - 1);
    if (results.length > 0) {
      let position = 0;
      if (cycling) {
        for (let candidate = 0; candidate < results.length; candidate += 1) {
          if (results.at(candidate).value === selection.value) {
            position = (candidate + 1) % results.length;
          }
        }
      }
      selection = results.at(position);
      active = index.resolve(selection).require().path;
    }
    return this.snapshot(
      current,
      new SearchingInteractionState(
        index.tree,
        active,
        state.origin,
        query,
        results.values,
      ),
      results.length > 0 ? new MoveFocus(selection) : new RetainFocus(),
    );
  }

  move(
    current: InteractionSnapshot,
    index: InteractionIndex,
    direction: InteractionDirection,
  ): InteractionSnapshot {
    const state = current.state;
    if (!(state instanceof SearchingInteractionState)) return current;
    if (state.results.length === 0) return current;
    const active = state.active.at(state.active.length - 1);
    let position = 0;
    for (let candidate = 0; candidate < state.results.length; candidate += 1) {
      if (state.results.at(candidate).value === active.value)
        position = candidate;
    }
    if (direction === Direction.first) position = 0;
    else if (direction === Direction.last) position = state.results.length - 1;
    else {
      const offset = direction === Direction.next ? 1 : -1;
      position =
        (position + offset + state.results.length) % state.results.length;
    }
    const target = state.results.at(position);
    return this.snapshot(
      current,
      new SearchingInteractionState(
        index.tree,
        index.resolve(target).require().path,
        state.origin,
        state.query,
        state.results.values,
      ),
      new MoveFocus(target),
    );
  }

  expire(
    current: InteractionSnapshot,
    index: InteractionIndex,
  ): InteractionSnapshot {
    const state = current.state;
    if (!(state instanceof SearchingInteractionState)) return current;
    return this.snapshot(
      current,
      new OpenInteractionState(index.tree, state.active, state.origin),
      new RetainFocus(),
    );
  }

  restore(
    current: InteractionSnapshot,
    index: InteractionIndex,
    previous: SearchingInteractionState,
  ): InteractionSnapshot {
    const state = current.state;
    if (!(state instanceof OpenInteractionState)) return current;
    const results = index.search(
      this.matcher,
      previous.query,
      this.policy.resultLimit,
    );
    return this.snapshot(
      current,
      new SearchingInteractionState(
        index.tree,
        state.active,
        state.origin,
        previous.query,
        results.values,
      ),
      current.focus,
    );
  }

  private accumulate(current: string, fragment: string): string {
    const combined = `${current}${fragment}`;
    if (this.matcher.repeated(combined)) return fragment;
    return combined;
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
